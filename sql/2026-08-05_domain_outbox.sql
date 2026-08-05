-- Additive migration — domain_outbox (Milestone 1 transactional outbox, handoff §7.7).
--
-- ADDITIVE + IDEMPOTENT (IF NOT EXISTS): creates one new table + its indexes and
-- touches nothing else, so it is safe to apply out-of-band on a dev database. It is
-- NOT auto-run by CI or the build, and MUST NOT be applied to production/live by this
-- change (owner-gated per handoff §9/§25). The Prisma model in prisma/schema.prisma
-- mirrors this table; the outbox worker stays disabled at runtime until a later milestone.
--
-- Rollback: `DROP TABLE IF EXISTS domain_outbox;` (no other object depends on it).

CREATE TABLE IF NOT EXISTS domain_outbox (
  id                BIGSERIAL     PRIMARY KEY,
  event_id          VARCHAR(64)   NOT NULL,
  event_type        VARCHAR(120)  NOT NULL,
  aggregate_type    VARCHAR(120)  NOT NULL,
  aggregate_id      VARCHAR(64)   NOT NULL,
  aggregate_version INTEGER       NOT NULL,
  occurred_at       TIMESTAMPTZ   NOT NULL,
  correlation_id    VARCHAR(64)   NOT NULL,
  causation_id      VARCHAR(64),
  actor_id          VARCHAR(64),
  payload           JSONB         NOT NULL,
  schema_version    INTEGER       NOT NULL DEFAULT 1,
  status            VARCHAR(20)   NOT NULL DEFAULT 'pending',
  attempts          INTEGER       NOT NULL DEFAULT 0,
  available_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  locked_at         TIMESTAMPTZ,
  locked_by         VARCHAR(64),
  processed_at      TIMESTAMPTZ,
  last_error        TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Idempotent enqueue / dedup: one row per domain eventId (append-once).
CREATE UNIQUE INDEX IF NOT EXISTS uq_domain_outbox_event_id ON domain_outbox (event_id);
-- Pending/available claim path (worker `FOR UPDATE SKIP LOCKED` lease).
CREATE INDEX IF NOT EXISTS idx_domain_outbox_pending ON domain_outbox (status, available_at);
-- Expired-lease recovery.
CREATE INDEX IF NOT EXISTS idx_domain_outbox_locked_at ON domain_outbox (locked_at);
