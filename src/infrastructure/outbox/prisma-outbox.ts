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
  return { event, status: r.status, attempts: r.attempts, lastError: r.last_error ?? undefined };
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
   */
  async claimBatch(limit: number): Promise<OutboxRecord[]> {
    const leaseMs = this.opts.leaseMs ?? 30000;
    const rows = await this.prisma.$queryRawUnsafe<DbRow[]>(
      `UPDATE domain_outbox
          SET locked_at = now(), locked_by = $1
        WHERE id IN (
          SELECT id FROM domain_outbox
           WHERE status = 'pending'
             AND available_at <= now()
             AND (locked_at IS NULL OR locked_at < now() - ($2 || ' milliseconds')::interval)
           ORDER BY available_at ASC, id ASC
           LIMIT $3
           FOR UPDATE SKIP LOCKED
        )
        RETURNING *;`,
      this.opts.workerId,
      String(leaseMs),
      limit,
    );
    return rows.map(rowToRecord);
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE domain_outbox SET status='processed', processed_at=now(), locked_at=NULL, locked_by=NULL WHERE event_id=$1;`,
      eventId,
    );
  }

  async markFailed(eventId: string, error: string, maxAttempts: number): Promise<void> {
    const backoffMs = this.opts.backoffMs ?? 1000;
    // attempts+1 ≥ max → dead; else back to pending, retryable after a backoff. Lease released.
    await this.prisma.$executeRawUnsafe(
      `UPDATE domain_outbox
          SET attempts = attempts + 1,
              last_error = $2,
              locked_at = NULL, locked_by = NULL,
              status = CASE WHEN attempts + 1 >= $3 THEN 'dead' ELSE 'pending' END,
              available_at = CASE WHEN attempts + 1 >= $3 THEN available_at
                                  ELSE now() + ($4 || ' milliseconds')::interval END
        WHERE event_id = $1;`,
      eventId,
      error,
      maxAttempts,
      String(backoffMs),
    );
  }

  async markDeferred(eventId: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `UPDATE domain_outbox SET status='deferred', locked_at=NULL, locked_by=NULL WHERE event_id=$1 AND status='pending';`,
      eventId,
    );
  }

  async reactivate(eventType: string): Promise<number> {
    return this.prisma.$executeRawUnsafe(
      `UPDATE domain_outbox SET status='pending', available_at=now() WHERE status='deferred' AND event_type=$1;`,
      eventType,
    );
  }
}
