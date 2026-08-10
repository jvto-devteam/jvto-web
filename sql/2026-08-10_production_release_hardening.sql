-- Additive migration — production-release hardening (main -> live cutover).
--
-- ADDITIVE + IDEMPOTENT: every statement is IF NOT EXISTS / ON CONFLICT-safe and
-- creates ONLY new tables + their indexes. It never drops, truncates, alters, or
-- rewrites an existing table or column, and it never touches data in a table that
-- already exists (in particular: does NOT touch the existing `review_stats` table
-- if production already has one from a prior partial setup -- CREATE TABLE IF NOT
-- EXISTS is a no-op against it). Verified safe to run twice: applied and reapplied
-- against a disposable Postgres with zero diff on the second run.
--
-- Covers every model added to prisma/schema.prisma since the last confirmed
-- production schema state (main-only per the pre-cutover schema diff):
--   - domain_outbox               (Milestone 1 transactional outbox, handoff §7.7;
--                                   duplicated here, verbatim, from the existing
--                                   sql/2026-08-05_domain_outbox.sql so the owner
--                                   runs exactly ONE file at the Phase 4 checkpoint --
--                                   IF NOT EXISTS makes running both files safe)
--   - combined_packages           (package bundling)
--   - combined_package_details    (bundle <-> package join)
--   - package_images              (per-package image gallery, distinct from the
--                                   existing package_assets/assets tables)
--   - route_destinations          (route <-> destination join, distinct from the
--                                   existing package_destinations table)
--
-- Rollback: each new table has no other object depending on it (all foreign keys
-- point FROM these tables, none point INTO them from a pre-existing table), so
-- `DROP TABLE IF EXISTS <name>;` for each is a complete, safe rollback in any order.
-- The application code that reads these tables is behind the same release cutover
-- this SQL accompanies, so old code (pre-cutover) simply never queries them.

BEGIN;

-- ── domain_outbox ────────────────────────────────────────────────────────────
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
CREATE UNIQUE INDEX IF NOT EXISTS uq_domain_outbox_event_id ON domain_outbox (event_id);
CREATE INDEX IF NOT EXISTS idx_domain_outbox_pending ON domain_outbox (status, available_at);
CREATE INDEX IF NOT EXISTS idx_domain_outbox_locked_at ON domain_outbox (locked_at);

-- ── review_stats ─────────────────────────────────────────────────────────────
-- Restored alongside the Google review-media port (handoff §3.1). A small cache
-- of each platform's self-reported aggregate; the site's canonical displayed
-- rating (src/lib/jvtoReviews.ts) never reads this table -- see that file's
-- comment, and prisma/schema.prisma's comment on this model, for why restoring
-- it introduces no second source of truth.
CREATE TABLE IF NOT EXISTS review_stats (
  id        BIGSERIAL        PRIMARY KEY,
  source    VARCHAR(50)      NOT NULL,
  rating    DOUBLE PRECISION NOT NULL,
  count     INTEGER          NOT NULL,
  synced_at TIMESTAMPTZ      NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS review_stats_source_key ON review_stats (source);

-- ── combined_packages ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS combined_packages (
  id         BIGSERIAL   PRIMARY KEY,
  name       text,
  long_name  text,
  slug       text,
  highlights text,
  created_at TIMESTAMP(6),
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP(6)
);
CREATE UNIQUE INDEX IF NOT EXISTS combined_packages_slug_key ON combined_packages (slug);

-- ── combined_package_details ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS combined_package_details (
  id                  BIGSERIAL PRIMARY KEY,
  combined_package_id BIGINT,
  package_id          BIGINT,
  created_at          TIMESTAMP(6),
  updated_at          TIMESTAMP(6),
  deleted_at          TIMESTAMP(6),
  CONSTRAINT fk_combined_package_details_combined_package_id
    FOREIGN KEY (combined_package_id) REFERENCES combined_packages (id) ON DELETE CASCADE,
  CONSTRAINT fk_combined_package_details_package_id
    FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_combined_package
  ON combined_package_details (combined_package_id, package_id);

-- ── package_images ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS package_images (
  id           BIGSERIAL PRIMARY KEY,
  package_id   BIGINT,
  url          text NOT NULL,
  og_image_url text,
  sort_order   INTEGER,
  alt_text     text,
  caption      text,
  tags         text,
  created_at   TIMESTAMP(6),
  updated_at   TIMESTAMP(6),
  deleted_at   TIMESTAMP(6),
  CONSTRAINT fk_package_images_package_id
    FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE
);

-- ── route_destinations ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS route_destinations (
  id             BIGSERIAL PRIMARY KEY,
  route_id       BIGINT NOT NULL,
  destination_id BIGINT NOT NULL,
  sequence       INTEGER NOT NULL,
  created_at     TIMESTAMP(6),
  updated_at     TIMESTAMP(6),
  CONSTRAINT fk_route_destinations_route_id
    FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE,
  CONSTRAINT fk_route_destinations_destination_id
    FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE CASCADE
);

COMMIT;

-- Verify (read-only, run after commit):
--   SELECT to_regclass('public.domain_outbox'), to_regclass('public.review_stats'),
--          to_regclass('public.combined_packages'), to_regclass('public.combined_package_details'),
--          to_regclass('public.package_images'), to_regclass('public.route_destinations');
--   -- all six must be non-null.
