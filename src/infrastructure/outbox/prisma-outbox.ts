/**
 * Prisma-backed transactional outbox (handoff §7.7). This is the DURABLE store — the
 * business mutation and the outbox event are written in ONE Prisma `$transaction`, so
 * either both commit or both roll back. Delivery is **at-least-once**: a leased worker
 * may re-deliver after a crash, so consumers must be idempotent (dedup on `event_id`).
 *
 * Milestone 1: additive table only; the worker is NOT activated at runtime (gated by
 * the `outbox-worker` flag). The physical table is applied out-of-band via
 * `sql/2026-08-05_domain_outbox.sql` (owner-gated; production untouched).
 */
import type { PrismaClient, Prisma } from "@/generated/prisma";
import type { DomainEvent } from "../../domains/shared/events";
import type { OutboxRecord, OutboxStore } from "./index";

export type OutboxTx = Prisma.TransactionClient;

/** A Prisma client or an already-open transaction client — both expose domain_outbox. */
type OutboxWriter = Pick<OutboxTx, "domain_outbox">;

/** Append events onto an EXISTING transaction (same tx as the business writes). */
export async function appendEventsTx(tx: OutboxWriter, events: DomainEvent[]): Promise<void> {
  if (events.length === 0) return;
  await tx.domain_outbox.createMany({
    data: events.map((e) => ({
      event_id: e.eventId,
      event_type: e.eventType,
      aggregate_type: e.aggregateType,
      aggregate_id: e.aggregateId,
      aggregate_version: e.aggregateVersion,
      occurred_at: new Date(e.occurredAt),
      correlation_id: e.correlationId,
      causation_id: e.causationId ?? null,
      actor_id: e.actorId ?? null,
      payload: (e.payload ?? {}) as Prisma.InputJsonValue,
      schema_version: e.schemaVersion,
    })),
    skipDuplicates: true, // append-once / dedup on the unique event_id
  });
}

/**
 * The transaction boundary: run the business mutation and enqueue its events in ONE
 * transaction. If `fn` throws OR the append throws, the whole transaction rolls back —
 * no orphaned business write, no orphaned event (both directions).
 */
export function runInOutboxTransaction(
  prisma: PrismaClient,
  fn: (tx: OutboxTx) => Promise<DomainEvent[]>,
): Promise<void> {
  return prisma.$transaction(async (tx) => {
    const events = await fn(tx);
    await appendEventsTx(tx, events);
  });
}

interface DbRow {
  event_id: string;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string;
  aggregate_version: number;
  occurred_at: Date;
  correlation_id: string;
  causation_id: string | null;
  actor_id: string | null;
  payload: unknown;
  schema_version: number;
  status: OutboxRecord["status"];
  attempts: number;
  last_error: string | null;
  locked_by: string | null;
}

function rowToRecord(r: DbRow): OutboxRecord {
  const event = {
    eventId: r.event_id,
    eventType: r.event_type,
    aggregateType: r.aggregate_type,
    aggregateId: r.aggregate_id,
    aggregateVersion: r.aggregate_version,
    occurredAt: r.occurred_at.toISOString(),
    correlationId: r.correlation_id,
    causationId: r.causation_id ?? undefined,
    actorId: r.actor_id ?? undefined,
    payload: r.payload,
    schemaVersion: r.schema_version,
  } as unknown as DomainEvent;
  return {
    event,
    status: r.status,
    attempts: r.attempts,
    lastError: r.last_error ?? undefined,
    leaseOwner: r.locked_by ?? undefined,
  };
}

export interface PrismaOutboxStoreOptions {
  workerId: string;
  leaseMs?: number;
  backoffMs?: number;
}

/** Durable OutboxStore for a leased worker. Safe under concurrency (SKIP LOCKED). */
export class PrismaOutboxStore implements OutboxStore {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly opts: PrismaOutboxStoreOptions,
  ) {}

  async append(event: DomainEvent): Promise<void> {
    await runInOutboxTransaction(this.prisma, async () => [event]);
  }

  /**
   * Atomically lease up to `limit` due records. `FOR UPDATE SKIP LOCKED` guarantees two
   * concurrent workers never claim the same active record; an expired lease is reclaimable.
   * Uses a parameterized tagged template (`$queryRaw`) — every interpolation is a bind
   * value, never string-concatenated SQL.
   */
  async claimBatch(limit: number): Promise<OutboxRecord[]> {
    const leaseMs = String(this.opts.leaseMs ?? 30000);
    const rows = await this.prisma.$queryRaw<DbRow[]>`
      UPDATE domain_outbox
         SET locked_at = now(), locked_by = ${this.opts.workerId}
       WHERE id IN (
         SELECT id FROM domain_outbox
          WHERE status = 'pending'
            AND available_at <= now()
            AND (locked_at IS NULL OR locked_at < now() - (${leaseMs} || ' milliseconds')::interval)
          ORDER BY available_at ASC, id ASC
          LIMIT ${limit}
          FOR UPDATE SKIP LOCKED
       )
       RETURNING *;`;
    return rows.map(rowToRecord);
  }

  /**
   * Lease-fenced ack. The `AND status='pending' AND locked_by=<me>` guard means only the
   * worker that currently holds the lease can transition the record — a worker whose lease
   * expired and was reclaimed by another matches 0 rows and changes nothing. Returns
   * whether a row was actually updated (`$executeRaw` → affected-row count).
   */
  async markProcessed(eventId: string): Promise<boolean> {
    const n = await this.prisma.$executeRaw`
      UPDATE domain_outbox
         SET status = 'processed', processed_at = now(), locked_at = NULL, locked_by = NULL
       WHERE event_id = ${eventId}
         AND status = 'pending'
         AND locked_by = ${this.opts.workerId};`;
    return n > 0;
  }

  async markFailed(eventId: string, error: string, maxAttempts: number): Promise<boolean> {
    const backoffMs = String(this.opts.backoffMs ?? 1000);
    // attempts+1 ≥ max → dead; else back to pending, retryable after a backoff. Lease released.
    // Fenced: only the lease holder (locked_by = me) on a still-pending record may fail it.
    const n = await this.prisma.$executeRaw`
      UPDATE domain_outbox
         SET attempts = attempts + 1,
             last_error = ${error},
             locked_at = NULL, locked_by = NULL,
             status = CASE WHEN attempts + 1 >= ${maxAttempts} THEN 'dead' ELSE 'pending' END,
             available_at = CASE WHEN attempts + 1 >= ${maxAttempts} THEN available_at
                                 ELSE now() + (${backoffMs} || ' milliseconds')::interval END
       WHERE event_id = ${eventId}
         AND status = 'pending'
         AND locked_by = ${this.opts.workerId};`;
    return n > 0;
  }

  async markDeferred(eventId: string): Promise<boolean> {
    const n = await this.prisma.$executeRaw`
      UPDATE domain_outbox
         SET status = 'deferred', locked_at = NULL, locked_by = NULL
       WHERE event_id = ${eventId}
         AND status = 'pending'
         AND locked_by = ${this.opts.workerId};`;
    return n > 0;
  }

  async reactivate(eventType: string): Promise<number> {
    return this.prisma.$executeRaw`
      UPDATE domain_outbox
         SET status = 'pending', available_at = now()
       WHERE status = 'deferred' AND event_type = ${eventType};`;
  }
}
