-- Add + backfill crew_members.kta_id (KTA card identifier).
-- Safe scope:
-- - additive: ADD COLUMN IF NOT EXISTS (no change to existing columns/data)
-- - backfill only sets the new kta_id column, matched on crew_members.code
-- - idempotent: re-running produces the same end state
-- - 3 crew (yusuf/dika/pras) intentionally left NULL (credential_state: pending)
--
-- Applied 2026-07-31 to BOTH jvto_dev (main/preview) and jvto (prod/live) via Adminer.
-- Source of the code -> KTA id map: src/lib/schemas/buildCrewSchemas.ts (NAMED_GUIDE_PERSONAS).
-- Replaces the in-process lookup stopgap previously in src/lib/queries/crewMembers.ts.

BEGIN;

ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS kta_id text;

UPDATE crew_members AS c
SET kta_id = v.kta_id
FROM (VALUES
  ('gufron', 'KTA-G-2024-001'),
  ('rendi',  'KTA-G-2024-002'),
  ('yandi',  'KTA-D-2024-003'),
  ('boy',    'KTA-G-2024-004'),
  ('fredi',  'KTA-D-2024-005'),
  ('anjas',  'KTA-G-2024-006'),
  ('taufik', 'KTA-G-2024-007'),
  ('kiki',   'KTA-G-2024-008'),
  ('holili', 'KTA-D-2024-009'),
  ('fauzi',  'KTA-G-2024-010'),
  ('joyo',   'KTA-D-2024-011')
) AS v(code, kta_id)
WHERE c.code = v.code;

-- Verify: 11 rows populated, yusuf/dika/pras NULL.
SELECT id, code, name, type, kta_id
FROM crew_members
WHERE code IS NOT NULL
ORDER BY id;

COMMIT;
