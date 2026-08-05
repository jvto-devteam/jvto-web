/**
 * Milestone 1 outbox DB integration test (handoff §7.7) — proves the DURABLE, Prisma-backed
 * transactional outbox against a REAL Postgres, not the in-memory adapter.
 *
 * It requires DATABASE_URL to point at a DISPOSABLE database that already has the
 * `domain_outbox` table (apply sql/2026-08-05_domain_outbox.sql first). The runner
 * scripts/ci/run-outbox-db-itest.sh spins up a throwaway Postgres and wires all of this;
 * production/live is never touched. Run via that runner, or:
 *   DATABASE_URL=postgresql://… npx tsx scripts/ci/outbox-db-itest.ts
 *
 * Proves, on real SQL transactions:
 *   1. business write fails  → the outbox event is NOT stored (nothing enqueued);
 *   2. outbox write fails     → the business write ROLLS BACK too (two-way atomicity);
 *   3. duplicate eventId      → exactly one row (append-once / dedup on unique event_id);
 *   4. retry then dead-letter after maxAttempts;
 *   5. concurrent claim       → two workers never lease the same event (FOR UPDATE SKIP LOCKED);
 *   6. worker flag OFF        → nothing processed (event stays pending, no side effects).
 */
import { PrismaClient } from "@/generated/prisma";
import type { DomainEvent } from "../../src/domains/shared/events";
import {
  PrismaOutboxStore,
  appendEventsTx,
  runInOutboxTransaction,
} from "../../src/infrastructure/outbox/prisma-outbox";
import { OutboxWorker } from "../../src/infrastructure/outbox";
import { __setFlagOverrides } from "../../src/infrastructure/flags";

const prisma = new PrismaClient();

let failed = 0;
const check = (cond: boolean, label: string) => {
  console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
  if (!cond) failed = 1;
};

/** A business table living beside the outbox — used to prove two-way rollback. */
const BIZ = "_outbox_itest_biz";

function evt(id: string, type: string): DomainEvent {
  return {
    eventId: id,
    eventType: type,
    aggregateType: "booking",
    aggregateId: "agg-1",
    aggregateVersion: 1,
    occurredAt: "2026-08-05T00:00:00.000Z",
    correlationId: "corr-1",
    payload: { k: "v" },
    schemaVersion: 1,
  } as unknown as DomainEvent;
}

async function countOutbox(where = "TRUE"): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ n: number }[]>(
    `SELECT count(*)::int AS n FROM domain_outbox WHERE ${where};`,
  );
  return rows[0]?.n ?? 0;
}
async function countBiz(): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int AS n FROM ${BIZ};`);
  return rows[0]?.n ?? 0;
}
async function statusOf(eventId: string): Promise<string | null> {
  const rows = await prisma.$queryRawUnsafe<{ status: string }[]>(
    `SELECT status FROM domain_outbox WHERE event_id = $1;`,
    eventId,
  );
  return rows[0]?.status ?? null;
}
async function rowOf(
  eventId: string,
): Promise<{ status: string; locked_by: string | null; attempts: number } | null> {
  const rows = await prisma.$queryRawUnsafe<{ status: string; locked_by: string | null; attempts: number }[]>(
    `SELECT status, locked_by, attempts FROM domain_outbox WHERE event_id = $1;`,
    eventId,
  );
  return rows[0] ?? null;
}
/** Age a record's lease so a worker with a shorter lease window will reclaim it. */
async function expireLease(eventId: string): Promise<void> {
  await prisma.$executeRawUnsafe(
    `UPDATE domain_outbox SET locked_at = now() - interval '1 hour' WHERE event_id = $1;`,
    eventId,
  );
}
async function reset(): Promise<void> {
  await prisma.$executeRawUnsafe(`TRUNCATE domain_outbox RESTART IDENTITY;`);
  await prisma.$executeRawUnsafe(`TRUNCATE ${BIZ} RESTART IDENTITY;`);
}

async function setup(): Promise<void> {
  // Self-contained: create the business table if the runner did not.
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS ${BIZ} (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL);`,
  );
  // Confirm the outbox table + unique index are actually present (fail loud otherwise).
  const t = await prisma.$queryRawUnsafe<{ n: number }[]>(
    `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_name = 'domain_outbox';`,
  );
  if ((t[0]?.n ?? 0) === 0) {
    throw new Error("domain_outbox table missing — apply sql/2026-08-05_domain_outbox.sql first");
  }
}

async function main() {
  await setup();

  // 1. Business write fails → outbox event NOT stored (and the business write rolls back).
  {
    await reset();
    let threw = false;
    try {
      await runInOutboxTransaction(prisma, async (tx) => {
        await tx.$executeRawUnsafe(`INSERT INTO ${BIZ}(name) VALUES ('should-not-persist');`);
        throw new Error("business failure");
      });
    } catch {
      threw = true;
    }
    check(threw, "business failure surfaces (transaction throws)");
    check((await countOutbox()) === 0, "business write fails → no outbox event stored");
    check((await countBiz()) === 0, "business write fails → business row rolled back");
  }

  // 2. Outbox write fails → business write ROLLS BACK (two-way atomicity).
  //    Force the outbox insert to fail with an oversized event_type (> VARCHAR(120)).
  {
    await reset();
    let threw = false;
    const bad = evt("outbox-fail", "x".repeat(200)); // violates event_type VARCHAR(120)
    try {
      await runInOutboxTransaction(prisma, async (tx) => {
        await tx.$executeRawUnsafe(`INSERT INTO ${BIZ}(name) VALUES ('committed-then-rolled-back');`);
        return [bad];
      });
    } catch {
      threw = true;
    }
    check(threw, "outbox append failure surfaces (transaction throws)");
    check((await countBiz()) === 0, "outbox write fails → business write rolled back (two-way)");
    check((await countOutbox()) === 0, "outbox write fails → no partial outbox row");
  }

  // 3. Duplicate eventId → exactly one row (append-once / dedup on unique event_id).
  {
    await reset();
    await runInOutboxTransaction(prisma, async () => [evt("dup", "booking.created")]);
    await runInOutboxTransaction(prisma, async () => [evt("dup", "booking.created")]);
    // Also prove same-batch dedup via appendEventsTx directly.
    await prisma.$transaction(async (tx) =>
      appendEventsTx(tx, [evt("dup", "booking.created"), evt("dup2", "booking.created"), evt("dup2", "booking.created")]),
    );
    check((await countOutbox(`event_id = 'dup'`)) === 1, "duplicate eventId across txns → exactly one row");
    check((await countOutbox(`event_id = 'dup2'`)) === 1, "duplicate eventId in one batch → exactly one row");
  }

  // 4. Retry then dead-letter after maxAttempts (real rows, backoff 0 so retries are due).
  {
    await reset();
    __setFlagOverrides({ "outbox-worker": true });
    const store = new PrismaOutboxStore(prisma, { workerId: "w-dead", leaseMs: 1, backoffMs: 0 });
    let attempts = 0;
    const worker = new OutboxWorker(store, { maxAttempts: 3, batchSize: 10 }).register(
      "payment.failed",
      async () => {
        attempts += 1;
        throw new Error("handler boom");
      },
    );
    await store.append(evt("e-dead", "payment.failed"));
    await worker.runOnce();
    await worker.runOnce();
    check((await statusOf("e-dead")) === "pending", "still pending / retryable before maxAttempts");
    await worker.runOnce();
    check(attempts === 3 && (await statusOf("e-dead")) === "dead", "dead-lettered after maxAttempts (3)");
    const after = await worker.runOnce();
    check(after.processed === 0 && after.failed === 0, "dead event no longer retried");
  }

  // 5. Concurrent claim → two workers never lease the same event (FOR UPDATE SKIP LOCKED).
  {
    await reset();
    const N = 20;
    for (let i = 0; i < N; i++) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO domain_outbox (event_id, event_type, aggregate_type, aggregate_id, aggregate_version, occurred_at, correlation_id, payload)
         VALUES ($1, 'booking.created', 'booking', 'agg', 1, now(), 'corr', '{}'::jsonb);`,
        `c${i}`,
      );
    }
    const w1 = new PrismaOutboxStore(prisma, { workerId: "w1", leaseMs: 30000 });
    const w2 = new PrismaOutboxStore(prisma, { workerId: "w2", leaseMs: 30000 });
    const [a, b] = await Promise.all([w1.claimBatch(N), w2.claimBatch(N)]);
    const ids1 = new Set(a.map((r) => r.event.eventId));
    const ids2 = new Set(b.map((r) => r.event.eventId));
    const overlap = [...ids1].filter((id) => ids2.has(id));
    const union = new Set([...ids1, ...ids2]);
    check(overlap.length === 0, `concurrent claim disjoint — no event leased by both workers (w1=${ids1.size}, w2=${ids2.size})`);
    check(union.size === N, `every event leased exactly once across workers (${union.size}/${N})`);
  }

  // 6. Worker flag OFF → nothing processed; the event stays pending.
  {
    await reset();
    __setFlagOverrides({ "outbox-worker": false });
    const store = new PrismaOutboxStore(prisma, { workerId: "w-off" });
    await store.append(evt("e-off", "booking.created"));
    const worker = new OutboxWorker(store).register("booking.created", async () => {});
    const r = await worker.runOnce();
    check(r.processed === 0, "flag OFF → worker processes nothing (no-op)");
    check((await statusOf("e-off")) === "pending", "flag OFF → event stays pending");
  }

  // 7. Lease fencing: a worker that lost its lease cannot mutate another worker's record,
  //    and eventId alone is never authorization to acknowledge.
  {
    await reset();
    const a = new PrismaOutboxStore(prisma, { workerId: "A", leaseMs: 30000, backoffMs: 0 });
    const b = new PrismaOutboxStore(prisma, { workerId: "B", leaseMs: 30000, backoffMs: 0 });
    await a.append(evt("fence", "booking.created"));

    const claimedByA = await a.claimBatch(1);
    check(
      claimedByA.length === 1 && claimedByA[0]?.leaseOwner === "A",
      "claimBatch returns the lease owner (A)",
    );

    // A's lease expires; B reclaims the record.
    await expireLease("fence");
    const claimedByB = await b.claimBatch(1);
    check(
      claimedByB.length === 1 && claimedByB[0]?.leaseOwner === "B",
      "expired lease is reclaimed by B (leaseOwner now B)",
    );

    // Stale A can no longer acknowledge or fail — B holds the lease.
    const staleAck = await a.markProcessed("fence");
    let r = await rowOf("fence");
    check(
      staleAck === false && r?.status === "pending" && r?.locked_by === "B",
      "stale worker A markProcessed → false, record unchanged (still leased by B)",
    );
    const staleFail = await a.markFailed("fence", "A boom", 3);
    r = await rowOf("fence");
    check(
      staleFail === false && r?.status === "pending" && r?.locked_by === "B" && r?.attempts === 0,
      "stale worker A markFailed → false, no attempt recorded, lease still B's",
    );

    // The current lease holder B acknowledges successfully.
    const okAck = await b.markProcessed("fence");
    check(okAck === true && (await statusOf("fence")) === "processed", "lease holder B markProcessed → processed");

    // A processed event cannot be reverted to pending/dead by a stale worker.
    const revert = await a.markFailed("fence", "A late boom", 3);
    check(
      revert === false && (await statusOf("fence")) === "processed",
      "stale worker cannot revert a processed event to pending/dead",
    );
  }

  if (failed) {
    console.log("[outbox-db-itest] FAIL");
    await prisma.$disconnect();
    process.exit(1);
  }
  console.log("[outbox-db-itest] PASS");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
