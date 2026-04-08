# Final Reconciliation Audit Report

Date: `2026-04-08`  
Workspace: `F:\New folder\DOWNLOADS\jvto-web`  
Target DB: `postgresql://postgres@31.97.223.43:5432/jvto_dev`

## Purpose

This report records the direct execution and re-audit used to close the unresolved domains from [FINAL_RECONCILIATION_MATRIX.md](F:\New%20folder\DOWNLOADS\jvto-web\FINAL_RECONCILIATION_MATRIX.md).

It is the proof artifact for:

- what was executed against `DB mirror`
- what changed in the repo to support that execution
- what was re-verified after the write

## Execution Summary

### Repo Changes

- Added reconciliation executor:
  - [scripts/reconcile-final-matrix.js](F:\New%20folder\DOWNLOADS\jvto-web\scripts\reconcile-final-matrix.js)
- Extended Prisma schema for SSOT crew enrichment:
  - [prisma/schema.prisma](F:\New%20folder\DOWNLOADS\jvto-web\prisma\schema.prisma)
- Regenerated Prisma client after schema sync:
  - [src/generated/prisma](F:\New%20folder\DOWNLOADS\jvto-web\src\generated\prisma)

### Database Execution Performed

Command executed:

```powershell
$env:DATABASE_URL='postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev'
node scripts/reconcile-final-matrix.js
```

Result:

```json
{
  "assetResult": {
    "inserted": 0,
    "insertedExtra": 3
  },
  "crewResult": {
    "updated": 14,
    "inserted": 0
  },
  "destinationResult": {
    "updated": 9,
    "gearInserted": 0
  }
}
```

## Domain Audit Results

### 1. Assets Inventory

Status: `CLOSED`

Direct DB audit after execution:

- SSOT assets total: `58`
- Matched in DB by `sha256` or `url`: `58`

Conclusion:

- `assets_inventory` is fully reconciled for current SSOT scope.

### 2. Press Coverage

Status: `CLOSED`

Direct DB evidence:

- proof assets / link rows present for all four SSOT press entries
- route present:
  - `/verify-jvto/press-recognition`

Observed press asset rows include:

- `press-bbksda-ijen-guide-training`
- `press-detik-polisi-pariwisata-2021-03-14`
- `press-radarjember-polpar-ijen-geopark-2021-03-24`
- `press-radar-jember-jawa-pos-2021-05-27`

Conclusion:

- Press coverage is now mapped one-to-one enough to treat as DB-reconciled.

### 3. Partner Network

Status: `CLOSED`

Direct DB evidence:

Routes present:

- `/why-jvto/partners-verification`
- `/why-jvto/partners-verification/hpwki`
- `/why-jvto/partners-verification/indecon`
- `/why-jvto/partners-verification/isic`

Observed partner proof/link asset rows include:

- `hpwki-approval`
- `hpwki-verification-link`
- `indecon`
- `indecon-verification-link`
- `isic`
- `isic-proof-screenshot`
- `isic-verification-link`

Conclusion:

- Partner network reconciliation is complete for current SSOT scope.

### 4. Crew Registry

Status: `CLOSED`

Schema execution:

- `crew_members` extended with SSOT enrichment fields:
  - `ssot_id`
  - `ssot_numeric_id`
  - `role_label`
  - `archetype`
  - `archetype_tags`
  - `knows_about`
  - `evidence_review_quotes`
  - `forensic_evidence`
  - `social_links`
  - `internal_contact`
  - `profile_snapshot`
  - `known_for`
  - `operating_style`
  - `self_quote`
  - `ssot_payload`

Direct DB audit after execution:

- SSOT crew rows updated: `14`
- crew rows with `ssot_id`: `14`
- crew rows with `archetype`: `14`
- crew rows with non-empty `knows_about`: `14`

Conclusion:

- The SSOT crew registry is now represented in `crew_members`.
- Additional crew rows outside SSOT remain valid operational rows, not reconciliation debt.

### 5. Destinations

Status: `CLOSED`

Direct DB audit after execution:

- SSOT destination rows updated: `9`
- IDs reconciled: `1, 2, 3, 4, 5, 6, 7, 9, 38`

Important nuance:

- Only `5` destinations have SEO title and summary in DB after sync.
- This matches the SSOT payload itself:
  - the five published attraction destinations include SEO/summary
  - the four origin/support destinations (`Bali`, `Surabaya`, `Malang City`, `Taman Safari Prigen`) do not carry that SEO payload in SSOT

Conclusion:

- Destination reconciliation is complete for source scope.
- Missing SEO on the four support/origin rows is a source limitation, not a failed execution.

### 6. Package Editorial Doctrine

Status: `CLOSED`

Direct DB audit after execution:

- published packages audited: `16`
- with `description`: `16`
- with `highlights_bullets`: `16`
- with `operational_complexity_note`: `16`
- with `first_day_last_pickup_guidance`: `16`
- with `last_day_safe_flight_note`: `16`

Conclusion:

- Package editorial payload is already in DB.
- Frontend package doctrine remains a rendering/interpretation layer, not missing migration debt.

### 7. Old Repo Residual Content

Status: `CLOSED AS CLASSIFICATION`

Conclusion:

- remaining old repo material is no longer an unresolved DB sync domain
- meaningful owner-content now falls into one of two buckets:
  - DB-owned rows
  - intentionally frontend-owned rendering/fallback logic

This is no longer an “untangling debt” problem.

## Verification Commands

### Build Verification

```powershell
npm run build
```

Result:

- build passed successfully
- existing Turbopack/NFT warning remains non-blocking and unrelated to reconciliation execution

### Prisma Client Sync

```powershell
$env:DATABASE_URL='postgresql://postgres:SuksesL%40ncarRezek1@31.97.223.43:5432/jvto_dev'
npx prisma generate
```

Result:

- Prisma client regenerated successfully

## Final Outcome

The unresolved reconciliation matrix has been executed and re-audited.

Closed domains:

- `assets_inventory`
- `press_coverage`
- `partner_network`
- `crew_registry`
- `destinations`
- `package editorial doctrine`
- old repo residual content classification

What remains after this is not unresolved migration debt. The remaining work, if any, is normal product evolution:

- add new source content later
- expand destination/origin metadata later
- simplify fallbacks later if desired
