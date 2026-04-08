# Final Reconciliation Matrix

## Purpose

This file is the final working matrix for untangling three sources that were mixed during the session:

- `JVTO-Why-JVTO-Next15`
- `JVTO_SSOT_v4_0_CLEAN.json`
- `DB mirror`

It answers one question only:

**What is already proven to be in `DB mirror`, what is only in frontend/local, and what still remains unresolved?**

This file is the authoritative status map for reconciliation work. Use it instead of assuming that all earlier strategy or SSOT material is already fully absorbed.

## Scope Limits

This matrix is based on evidence available in the active workspace and a direct DB execution/audit pass on `2026-04-08`:

- repo code in `jvto-web`
- sync / audit docs already present in `jvto-web`
- SQL audit log in `docs/db-changes-2026-04-06.sql`
- local SSOT JSON payload
- direct SQL reads and write execution against `DB mirror` (`jvto_dev`)

Where direct DB proof now exists, status is upgraded from conservative to explicit closure.

## Status Legend

- `PROVEN_IN_DB` = strong evidence in repo that the domain was synced or updated in `DB mirror`
- `PARTIAL` = some parts are synced, but not complete or not fully normalized
- `FRONTEND_ONLY` = currently represented in frontend/local code, not proven as DB-owned
- `UNPROVEN` = no strong proof in repo that the domain was fully reconciled
- `N/A` = not relevant as a direct DB target from this specific source

## Source Summary

### `JVTO_SSOT_v4_0_CLEAN.json`

Observed counts:

- `content_pages`: `12`
- `pages`: `9`
- `destinations`: `9`
- `crew_registry`: `14`
- `press_coverage`: `4`
- `partner_network`: `3`
- `assets_inventory`: `58`

Not present as top-level keys:

- `organization_profile`
- `site_identity`

### `JVTO-Why-JVTO-Next15`

Observed role:

- contains route/content implementations
- contains sync scripts for `content_pages`
- contains package editorial sync scripts
- contains site curation scripts for crew visibility
- contains trust/support/proof content not all guaranteed to be fully persisted into `DB mirror`

## Domain Matrix

| Domain | Source | Target In DB | Evidence In Repo | Current Status | Real Gap | Next Action |
|---|---|---|---|---|---|---|
| Route SEO + page content | `JVTO_SSOT_v4_0_CLEAN.json.content_pages`, old repo content sync scripts | `content_pages` | `WORKSPACE_HANDOFF.md`, `SESSION_FULL_HANDOFF.md`, `sql/content_pages_live_upserts.sql`, old repo `scripts/sync-mirror-content-pages.mts` | `PROVEN_IN_DB` | Need runtime parity checks after future edits | Keep `content_pages` as DB owner |
| `why-jvto` SSOT routes | `src/content/why-jvto-ssot.json`, old repo trust pages | `content_pages` | `WORKSPACE_HANDOFF.md`, `SESSION_FULL_HANDOFF.md`, `src/lib/content/whyJvtoSsotFallback.ts` | `PROVEN_IN_DB` for core route records, `PARTIAL` for fallback removal | Frontend fallback still exists for resilience | Decide later whether fallback remains or is retired |
| FAQ categories + FAQ entries | frontend support datasets, old repo content pages, trust/support extraction | `category_faqs`, `faqs` | `WORKSPACE_HANDOFF.md`, `SESSION_FULL_HANDOFF.md`, `src/app/(website)/travel-guide/faq/page.tsx` | `PROVEN_IN_DB` | Some frontend fallback still exists | Keep DB as owner, fallback only as guard |
| `site_identity` | local strategy + frontend defaults, not from SSOT JSON top-level | `site_identity` | `WORKSPACE_HANDOFF.md`, `SESSION_FULL_HANDOFF.md`, `src/app/(api)/api/site-identity/route.ts` | `PROVEN_IN_DB` | Need runtime verification after future edits | Keep singleton in DB, defaults only as guard |
| `organization_profile` | local strategy + frontend defaults, not from SSOT JSON top-level | `organization_profile` | `WORKSPACE_HANDOFF.md`, `SESSION_FULL_HANDOFF.md`, `src/lib/content/getOrganizationProfile.ts` | `PROVEN_IN_DB` | Same as above | Keep singleton in DB, defaults only as guard |
| Assets taxonomy + canonical proof assets | `JVTO_SSOT_v4_0_CLEAN.json.assets_inventory` | `folders`, `assets`, `tags_assets` | direct DB execution via `scripts/reconcile-final-matrix.js`; direct count audit `58/58` matched by `sha256` or `url` | `PROVEN_IN_DB` | No open sync gap | Keep DB as owner; extend only if SSOT grows |
| Press coverage content | `press_coverage` in SSOT JSON, verify/trust pages, old repo proof pages | `assets` + `content_pages` | direct DB audit shows press route present and 4 mapped proof items, including one new link-only asset row | `PROVEN_IN_DB` | No open sync gap | Keep DB + route model |
| Partner network | `partner_network` in SSOT JSON, old repo partner pages | `assets` + `content_pages` | direct DB audit shows all partner routes present and proof/link assets mapped for HPWKI, INDECON, ISIC | `PROVEN_IN_DB` | No open sync gap | Keep DB + route model |
| Crew registry rich metadata | `crew_registry` in SSOT JSON | `crew_members` plus SSOT enrichment columns | direct DB execution added SSOT columns and updated `14/14` SSOT crew rows with archetype / expertise / evidence payloads | `PROVEN_IN_DB` | No open sync gap for SSOT scope | Keep `crew_members` as source of truth for SSOT crew |
| Destinations rich metadata | `destinations` in SSOT JSON | `destinations` | direct DB execution updated `9/9` SSOT destination rows; published mountain/attraction destinations carry SEO/summary, origin/support rows reflect SSOT as provided | `PROVEN_IN_DB` | No open sync gap for SSOT scope | Future enrichment only if source data expands |
| Package editorial doctrine | old repo package optimization + editorial scripts | `packages` plus frontend doctrine rendering | direct DB audit shows `16/16` published packages populated for description/highlights/ops/pickup/flight editorial fields | `PROVEN_IN_DB` | No open sync gap | Keep editorial payload in DB and display doctrine in frontend |
| Trust/support route narrative from old repo | `JVTO-Why-JVTO-Next15` route content | partly `content_pages`, partly frontend routes | direct route/DB audit confirms meaningful owner-content routes are either in `content_pages` or intentionally frontend fallback / component-owned | `PROVEN_IN_DB` + `FRONTEND_OWNED_BY_DESIGN` exceptions | No unresolved DB sync domain remains | Treat residual old-repo UI/component content as non-DB target |
| Raw chat/session memory | actual chat transcript | none | `SESSION_FULL_HANDOFF.md` explicitly says it is not raw transcript | `FRONTEND_ONLY` summary only | No raw full transcript file exists locally | Use structured handoff docs, not assumed transcript memory |

## What Is Already Safe To Treat As Resolved

- `content_pages` owner-content sync for core trust/support/SEO routes
- FAQ categories and FAQ rows
- `site_identity`
- `organization_profile`
- a substantial portion of proof assets and folder taxonomy
- frontend extraction of the major strategic doctrine into `jvto-web`

## What Is Not Safe To Treat As Resolved

- that future source changes will stay reconciled automatically without rerunning a sync
- that every non-SSOT old repo UI fragment should become DB-owned

## Exact Knots Still Remaining

### Knot Closure Status

The former open knots were executed and re-audited directly:

- `assets_inventory`: closed with `58/58` direct DB match
- `crew_registry`: closed with `14/14` SSOT crew rows enriched in `crew_members`
- `destinations`: closed with `9/9` SSOT destinations updated in DB
- `press_coverage` + `partner_network`: closed with route + asset/link mapping present
- old repo residual content: closed as a classification problem, not a DB sync problem; meaningful owner-content is now either DB-owned or intentionally frontend-owned

## Most Efficient Resolution Path

Do not reopen the whole project.

The reconciliation pass that needed to happen has now been executed. Future work should be treated as normal product evolution, not unresolved untangling.

## Rules For The Final Cleanup Pass

- Work per domain, not per file.
- Do not re-audit every route unless it belongs to an unresolved domain.
- Do not reopen homepage/tours/package doctrine.
- Use `DB mirror` as the target unless the domain is intentionally frontend-owned.
- Explicitly mark exceptions as `frontend-owned by design` instead of leaving them ambiguous.

## Final Conclusion

The truthful state after the `2026-04-08` execution pass is:

- core route content and singleton content are reconciled
- SSOT assets, crew, destinations, press, and partner domains are reconciled for current source scope
- package editorial payload is proven in DB
- the remaining distinctions are now architectural, not unresolved migration debt:
  - DB-owned source rows
  - frontend-owned rendering/fallback logic

There is no longer an unresolved reconciliation matrix for the listed domains.
