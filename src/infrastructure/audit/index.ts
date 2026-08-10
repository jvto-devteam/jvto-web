/**
 * Audit-log interface (handoff §16 M1; §13.2 "immutable audit records for high-risk
 * mutations"). Milestone 1 — interface + an in-memory implementation for tests. The
 * durable Prisma-backed `audit_log` table lands in a later owner-gated migration
 * (§14.3, expand–migrate–contract); nothing here writes a database.
 */
import type { ISODateTime, UUID } from "../../domains/shared/ids";

export interface AuditRecord {
  action: string; // e.g. "booking.amend", "payment.approve", "task.waive"
  actorId?: UUID;
  actorRole?: string;
  subjectType: string; // aggregate type
  subjectId: string; // opaque id
  reason?: string; // required for manual overrides (§7.6 rule)
  correlationId?: UUID;
  occurredAt: ISODateTime;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  record(entry: AuditRecord): Promise<void>;
}

/** No-op sink — safe default so importing audit changes no behavior. */
export class NoopAuditLog implements AuditLog {
  async record(): Promise<void> {
    /* intentionally does nothing until a durable store is wired (owner-gated) */
  }
}

/** In-memory audit log for tests/local orchestration. */
export class InMemoryAuditLog implements AuditLog {
  readonly entries: AuditRecord[] = [];
  async record(entry: AuditRecord): Promise<void> {
    this.entries.push(entry);
  }
}
