-- Additive migration — destinations table, missing columns (production build blocker).
--
-- ADDITIVE + IDEMPOTENT: every statement is ADD COLUMN IF NOT EXISTS. It never
-- drops, renames, or rewrites an existing column, and every new column is
-- nullable with no default, so it cannot fail against existing rows and cannot
-- break any other service reading this table.
--
-- Root cause: production's `destinations` table (verified via `\d destinations`
-- against the live jvto database, not inferred from `prisma migrate diff` --
-- that tool did not surface these as ADD COLUMN statements in either
-- direction and should not be trusted for this table) is missing 9 columns
-- that prisma/schema.prisma's `destinations` model expects. `npm run build`
-- fails prerendering `/` with `PrismaClientKnownRequestError: The column
-- destinations.latitude does not exist in the current database` the moment
-- getWebPackagesList's include of the related destination rows touches it.
--
-- This does NOT attempt to reconcile every difference between production's
-- schema and prisma/schema.prisma (a much larger, separate divergence --
-- production's DB also carries tables/columns prisma/schema.prisma doesn't
-- model at all, e.g. `users`, `travel_credits`, `admin_users`, and several
-- `destinations` columns like `route_length_m`/`sections` -- those are left
-- untouched here; likely owned by other services on the same box/DB, not a
-- concern this migration should touch). Scoped to exactly the 9 columns the
-- current app code actually needs.
--
-- Verify (read-only, run after commit):
--   \d destinations
--   -- all 9 columns below must be present.

BEGIN;

ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS latitude           DECIMAL(10, 6),
  ADD COLUMN IF NOT EXISTS longitude          DECIMAL(10, 6),
  ADD COLUMN IF NOT EXISTS area_hectares      DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS cultural_depth     INTEGER,
  ADD COLUMN IF NOT EXISTS photo_potential    INTEGER,
  ADD COLUMN IF NOT EXISTS facilities         JSONB,
  ADD COLUMN IF NOT EXISTS emergency_contacts JSONB,
  ADD COLUMN IF NOT EXISTS rituals_festivals  JSONB,
  ADD COLUMN IF NOT EXISTS thumbnail_url      VARCHAR(500);

COMMIT;
