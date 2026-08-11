# ADR-0003 — Domain Events and Transactional Outbox

- Status: Accepted (Milestone 1)
- Date: 2026-08-05
- Context: Communications, analytics, and downstream reactions must be driven by domain
  state changes rather than duplicated inline logic (handoff §2.1 "Communications Core
  driven by domain events", §10.2 delivery semantics). If a business write and its
  side-effect notification are performed as two independent steps, a crash between them
  either loses the event or fires it without the state — and a failed notification must
  never roll back a valid payment (§7.5). The events/outbox contract §7.7 requires that
  business state and the outbox event are written in one database transaction, then a
  worker processes events with retries and idempotent handlers. Milestone 1 must
  "implement outbox schema and worker skeleton behind a disabled flag" and "add
  correlation IDs and structured logging" with a passing outbox integration test (§16
  Milestone 1 tasks + exit criteria). The Milestone 0 inventory confirms no
  `domain_outbox`/`audit_log` exists yet and only 2 `$transaction` uses exist in the repo
  (`db-integration-inventory.md` §4e, Analytics row).

- Decision: Introduce a `DomainEvent<T>` contract (§7.7) carrying `eventId`, `eventType`,
  `aggregateType`, `aggregateId`, `aggregateVersion`, `occurredAt`, optional `actorId`,
  `correlationId`, optional `causationId`, `payload`, and `schemaVersion`. Business
  state mutation and the outbox event insert occur in the same DB transaction; a separate
  worker polls the outbox and dispatches to idempotent handlers with a bounded retry
  policy, escalating exhausted retries to an operations exception (§10.2). Correlation IDs
  propagate across request, event, communication, and provider calls (§7.9, §20.1).
  Initial event names (§7.7): `inquiry.created`, `quote.issued`, `quote.expired`,
  `booking.created`, `booking.confirmed`, `booking.amended`, `deposit.requested`,
  `deposit.paid`, `balance.due`, `payment.failed`, `pickup.required`, `pickup.confirmed`,
  `health.required`, `health.completed`, `crew.assigned`, `vehicle.assigned`,
  `trip.ready`, `trip.started`, `trip.completed`, `review.requested`,
  `communication.requested`, `communication.sent`, `communication.failed`.
  Milestone 1 scope: an interface + in-memory store + worker skeleton behind a disabled
  feature flag — no runtime behavior change. The physical `domain_outbox` table (§14.3)
  lands in a later owner-gated migration via expand–migrate–contract (§14.2), not now.

- Consequences:
  - Positive: at-least-once delivery with no lost or phantom events (single-transaction
    write); idempotent handlers make retries and duplicate delivery safe (§18.5 E2E 10);
    outbox backlog age is an observable signal (§20.2 Reliability, §27 outbox-backlog
    risk); rollback stays code-only in Milestone 1 (disabled flag).
  - Negative: worker adds eventual-consistency latency and an operational surface to
    monitor (dead-letter/exception handling); every consequential write path must adopt
    the transactional-outbox pattern to be reliable.
  - Forbids: firing side-effects outside the state transaction; rolling back a valid
    payment because notification delivery failed (§7.5); non-idempotent handlers that
    duplicate a business action on retry.

- Alternatives considered:
  1. Direct/synchronous side-effects at the call site (e.g. send email inline after
     save) — rejected: dual-write with no atomicity; a mid-step crash loses or
     mis-fires the event; violates §7.7 single-transaction rule.
  2. External message broker (Kafka/SQS) now — rejected: §2.2 forbids a microservice
     fleet before boundaries and load justify it; the modular monolith uses a DB outbox
     first (§5.1).
  3. Ship the physical `domain_outbox` table in Milestone 1 — rejected: §14 mandates
     expand–migrate–contract with owner-gated destructive/DDL changes; Milestone 1 is
     "no runtime behavior change / rollback is code-only", so the table is deferred.

- Handoff references: §2.1, §4 (P-05), §7.5 (payment rules), §7.7 (events + outbox),
  §7.9 / §20.1 (correlation IDs), §10.2 (delivery semantics), §14.2–§14.3
  (expand–migrate–contract, `domain_outbox`), §16 Milestone 1 (+ Milestone 6), §18.3/§18.5
  (outbox + retry tests), §20.2 (Reliability metrics), §27 (outbox-backlog risk).
  Milestone 0 grounding: `db-integration-inventory.md` §4e.
