/**
 * Milestone 1 outbox integration test (handoff §7.7 semantics, in-memory store).
 * Run: npx tsx scripts/ci/outbox-selftest.ts
 */
import { InMemoryOutboxStore, OutboxWorker, withOutbox } from "../../src/infrastructure/outbox";
import { __setFlagOverrides, isEnabled } from "../../src/infrastructure/flags";
import type { DomainEvent } from "../../src/domains/shared/events";

let failed = 0;
const check = (cond: boolean, label: string) => {
  console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
  if (!cond) failed = 1;
};

function evt(id: string, type: DomainEvent["eventType"]): DomainEvent {
  return {
    eventId: id as DomainEvent["eventId"],
    eventType: type,
    aggregateType: "booking",
    aggregateId: "agg-1" as DomainEvent["aggregateId"],
    aggregateVersion: 1,
    occurredAt: "2026-08-05T00:00:00Z" as DomainEvent["occurredAt"],
    correlationId: "corr-1" as DomainEvent["correlationId"],
    payload: {},
    schemaVersion: 1,
  };
}

async function main() {
  // Flag OFF by default → worker is a no-op (no behavior without opt-in).
  __setFlagOverrides({ "outbox-worker": false });
  {
    const store = new InMemoryOutboxStore();
    await store.append(evt("e0", "booking.created"));
    const worker = new OutboxWorker(store).register("booking.created", async () => {});
    const r = await worker.runOnce();
    check(!isEnabled("outbox-worker") && r.processed === 0, "flag OFF → worker no-op");
    check(store.byStatus("pending").length === 1, "flag OFF → event stays pending");
  }

  // Enable for the behavioral tests.
  __setFlagOverrides({ "outbox-worker": true });

  // 1. Atomic unit of work: business mutation + append together.
  {
    const store = new InMemoryOutboxStore();
    let businessWritten = 0;
    await withOutbox(store, async () => {
      businessWritten += 1;
      return [evt("e1", "booking.confirmed")];
    });
    check(businessWritten === 1 && store.all().length === 1, "withOutbox writes state + enqueues event");
  }

  // 2. Rollback: mutation throws → nothing enqueued.
  {
    const store = new InMemoryOutboxStore();
    let threw = false;
    try {
      await withOutbox(store, async () => {
        throw new Error("business failure");
      });
    } catch {
      threw = true;
    }
    check(threw && store.all().length === 0, "mutation throws → no event enqueued (rollback)");
  }

  // 3. Idempotent consumer: a processed event is not re-processed on re-run.
  {
    const store = new InMemoryOutboxStore();
    let calls = 0;
    const worker = new OutboxWorker(store).register("deposit.paid", async () => {
      calls += 1;
    });
    await store.append(evt("e2", "deposit.paid"));
    const first = await worker.runOnce();
    const second = await worker.runOnce();
    check(first.processed === 1 && calls === 1, "handler runs once, then event is marked processed");
    check(second.processed === 0 && calls === 1, "processed event not re-processed on re-run (idempotent consumer)");
    check(store.byStatus("processed").length === 1, "event marked processed");
  }

  // 4. Append-once dedup.
  {
    const store = new InMemoryOutboxStore();
    await store.append(evt("dup", "quote.issued"));
    await store.append(evt("dup", "quote.issued"));
    check(store.all().length === 1, "duplicate eventId enqueued once (dedup)");
  }

  // 5. Retry then dead-letter after maxAttempts.
  {
    const store = new InMemoryOutboxStore();
    let attempts = 0;
    const worker = new OutboxWorker(store, { maxAttempts: 3 }).register("payment.failed", async () => {
      attempts += 1;
      throw new Error("handler boom");
    });
    await store.append(evt("e3", "payment.failed"));
    await worker.runOnce();
    await worker.runOnce();
    check(store.byStatus("dead").length === 0, "not dead-lettered before maxAttempts");
    await worker.runOnce();
    check(attempts === 3 && store.byStatus("dead").length === 1, "dead-lettered after maxAttempts (3)");
    const after = await worker.runOnce();
    check(after.processed === 0 && after.failed === 0, "dead event no longer retried");
  }

  // 6. Unregistered event type is deferred (parked), not lost, not left blocking.
  {
    const store = new InMemoryOutboxStore();
    await store.append(evt("e4", "trip.ready"));
    const worker = new OutboxWorker(store); // no handler
    const r = await worker.runOnce();
    check(
      r.skipped === 1 && store.byStatus("deferred").length === 1 && store.byStatus("pending").length === 0,
      "no handler → deferred (parked), not left pending",
    );
  }

  // 7. Deferred events do not starve later handled events (head-of-line blocking).
  {
    const store = new InMemoryOutboxStore();
    let calls = 0;
    const worker = new OutboxWorker(store, { batchSize: 1 }).register("deposit.paid", async () => {
      calls += 1;
    });
    await store.append(evt("unknown", "trip.ready")); // no handler, enqueued first
    await store.append(evt("known", "deposit.paid")); // handled, behind it
    await worker.runOnce(); // claims the unknown (batchSize 1) → deferred
    await worker.runOnce(); // now claims the handled event → processed
    check(
      calls === 1 && store.byStatus("processed").length === 1,
      "handled event not starved by an unhandled one ahead of it (batchSize 1)",
    );
  }

  // 8. A handler registered later reactivates its deferred events.
  {
    const store = new InMemoryOutboxStore();
    let calls = 0;
    const worker = new OutboxWorker(store);
    await store.append(evt("late", "crew.assigned"));
    await worker.runOnce(); // no handler yet → deferred
    check(store.byStatus("deferred").length === 1, "event deferred while no handler");
    worker.register("crew.assigned", async () => {
      calls += 1;
    });
    await worker.runOnce(); // reactivate + process
    check(
      calls === 1 && store.byStatus("processed").length === 1,
      "late-registered handler reactivates + processes deferred event",
    );
  }

  if (failed) {
    console.log("[outbox-selftest] FAIL");
    process.exit(1);
  }
  console.log("[outbox-selftest] PASS");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
