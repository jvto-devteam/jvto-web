/**
 * Outbox interface + worker + IN-MEMORY TEST ADAPTER (handoff §7.7, §16 M1).
 *
 * The DURABLE, transactional store lives in `./prisma-outbox` (`PrismaOutboxStore` +
 * `runInOutboxTransaction`), where the business mutation and the outbox event share one
 * Prisma `$transaction`. This module holds only the shared `OutboxStore` contract, the
 * `OutboxWorker`, and `InMemoryOutboxStore` — a **test adapter**, not proof of a durable
 * transactional outbox.
 *
 * Delivery semantics: **at-least-once**. A leased worker may re-deliver after a crash,
 * so handlers must be **idempotent**; `event_id` is unique so enqueue is append-once.
 * Acks are **lease-fenced** in the durable store: `markProcessed`/`markFailed`/
 * `markDeferred` only apply when the caller still holds the lease (`locked_by`), so a
 * worker whose lease expired and was reclaimed can never mutate another worker's record.
 * The worker is gated by the `outbox-worker` flag (OFF by default → importing this
 * changes no runtime behavior).
 */
import type { DomainEvent } from "../../domains/shared/events";
import { isEnabled } from "../flags";
import type { Logger } from "../observability";

export interface OutboxRecord {
  event: DomainEvent;
  /** `deferred` = no handler registered yet; parked so it can't starve the batch. */
  status: "pending" | "processed" | "dead" | "deferred";
  attempts: number;
  lastError?: string;
  /** The worker that currently holds the lease on this record (`locked_by`), if any. */
  leaseOwner?: string;
}

export interface OutboxStore {
  /** Idempotent enqueue — a duplicate eventId is ignored (append-once). */
  append(event: DomainEvent): Promise<void>;
  /** Claim up to `limit` PENDING records for processing (deferred/dead excluded). */
  claimBatch(limit: number): Promise<OutboxRecord[]>;
  /**
   * Acknowledge success. Returns `true` iff this worker still held the lease and the
   * record was transitioned; `false` means the lease was lost/stale (another worker
   * reclaimed it, or it is no longer pending) and NOTHING was changed. `eventId` alone
   * is never authorization — the durable store also matches the lease owner.
   */
  markProcessed(eventId: string): Promise<boolean>;
  /**
   * Record a failed attempt; when attempts reach `maxAttempts`, mark dead. Returns
   * `false` (no change) if this worker no longer holds the lease.
   */
  markFailed(eventId: string, error: string, maxAttempts: number): Promise<boolean>;
  /**
   * Park a record with no registered handler so it stops being re-claimed. Returns
   * `false` (no change) if this worker no longer holds the lease.
   */
  markDeferred(eventId: string): Promise<boolean>;
  /** Return deferred records of `eventType` to pending (a handler now exists). */
  reactivate(eventType: string): Promise<number>;
}

/**
 * In-memory OutboxStore — a TEST ADAPTER only (no durability, no real transaction, and
 * no lease fencing: it is single-worker, so an ack applies whenever the record is still
 * pending). Lease-owner fencing is a durable-store concern — see `PrismaOutboxStore`.
 */
export class InMemoryOutboxStore implements OutboxStore {
  private readonly records = new Map<string, OutboxRecord>();

  async append(event: DomainEvent): Promise<void> {
    if (this.records.has(event.eventId)) return; // append-once (dedup)
    this.records.set(event.eventId, { event, status: "pending", attempts: 0 });
  }
  async claimBatch(limit: number): Promise<OutboxRecord[]> {
    const out: OutboxRecord[] = [];
    for (const r of this.records.values()) {
      if (r.status === "pending") out.push(r);
      if (out.length >= limit) break;
    }
    return out;
  }
  async markProcessed(eventId: string): Promise<boolean> {
    const r = this.records.get(eventId);
    if (!r || r.status !== "pending") return false; // already terminal → no-op
    r.status = "processed";
    return true;
  }
  async markFailed(eventId: string, error: string, maxAttempts: number): Promise<boolean> {
    const r = this.records.get(eventId);
    if (!r || r.status !== "pending") return false; // only a leased/pending record can fail
    r.attempts += 1;
    r.lastError = error;
    if (r.attempts >= maxAttempts) r.status = "dead";
    return true;
  }
  async markDeferred(eventId: string): Promise<boolean> {
    const r = this.records.get(eventId);
    if (!r || r.status !== "pending") return false;
    r.status = "deferred";
    return true;
  }
  async reactivate(eventType: string): Promise<number> {
    let n = 0;
    for (const r of this.records.values()) {
      if (r.status === "deferred" && r.event.eventType === eventType) {
        r.status = "pending";
        n += 1;
      }
    }
    return n;
  }
  /** Test/inspection helpers. */
  all(): OutboxRecord[] {
    return [...this.records.values()];
  }
  byStatus(status: OutboxRecord["status"]): OutboxRecord[] {
    return this.all().filter((r) => r.status === status);
  }
}

export type EventHandler = (event: DomainEvent) => Promise<void>;

/**
 * In-memory unit-of-work helper for the TEST ADAPTER only. This is NOT a database
 * transaction — the real two-way-rollback boundary is `runInOutboxTransaction` in
 * `./prisma-outbox` (one Prisma `$transaction`). Here, if `mutate` throws, nothing is
 * enqueued; there is no business state to roll back because the store is in-memory.
 */
export async function withOutbox(
  store: OutboxStore,
  mutate: () => Promise<DomainEvent[]>,
): Promise<void> {
  const events = await mutate(); // throws → nothing enqueued
  for (const e of events) await store.append(e);
}

export interface OutboxWorkerOptions {
  maxAttempts?: number;
  batchSize?: number;
  logger?: Logger;
}

/**
 * Worker skeleton: drains the store once per `runOnce()`. Idempotent — an event whose
 * handler already ran is `processed` and never re-run; a handler that throws is retried
 * up to `maxAttempts`, then dead-lettered (→ operations exception, wired later).
 */
export class OutboxWorker {
  private readonly handlers = new Map<string, EventHandler>();
  private readonly maxAttempts: number;
  private readonly batchSize: number;
  private readonly logger?: Logger;

  constructor(private readonly store: OutboxStore, opts: OutboxWorkerOptions = {}) {
    this.maxAttempts = opts.maxAttempts ?? 5;
    this.batchSize = opts.batchSize ?? 50;
    this.logger = opts.logger;
  }

  register(eventType: string, handler: EventHandler): this {
    this.handlers.set(eventType, handler);
    return this;
  }

  /** Process one batch. Respects the `outbox-worker` flag (OFF ⇒ no-op). */
  async runOnce(): Promise<{ processed: number; failed: number; skipped: number }> {
    if (!isEnabled("outbox-worker")) return { processed: 0, failed: 0, skipped: 0 };
    // A handler may have been registered since a record was deferred — reclaim those.
    for (const type of this.handlers.keys()) await this.store.reactivate(type);
    let processed = 0;
    let failed = 0;
    let skipped = 0;
    for (const record of await this.store.claimBatch(this.batchSize)) {
      const handler = this.handlers.get(record.event.eventType);
      if (!handler) {
        skipped += 1;
        // Park it: without this, unhandled events sit pending at the head of the
        // batch and starve later handled events (head-of-line blocking).
        await this.store.markDeferred(record.event.eventId);
        continue;
      }
      try {
        await handler(record.event);
        // Fenced ack: applies only if this worker still holds the lease. A `false`
        // means another worker reclaimed the record (at-least-once — it will/did run
        // there); do not count it and do not treat it as an error.
        if (await this.store.markProcessed(record.event.eventId)) {
          processed += 1;
        } else {
          this.logger?.warn("outbox ack skipped — lease not held", {
            eventType: record.event.eventType,
            errorCode: "OUTBOX_LEASE_LOST",
            result: "skip",
          });
        }
      } catch (err) {
        // Fenced failure record: only the lease holder may retry/dead-letter it.
        if (
          await this.store.markFailed(
            record.event.eventId,
            err instanceof Error ? err.message : String(err),
            this.maxAttempts,
          )
        ) {
          failed += 1;
        }
        this.logger?.warn("outbox handler failed", {
          eventType: record.event.eventType,
          errorCode: "OUTBOX_HANDLER_ERROR",
          result: "retry",
        });
      }
    }
    return { processed, failed, skipped };
  }
}
