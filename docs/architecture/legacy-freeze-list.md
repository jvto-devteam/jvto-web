# Legacy Freeze List (§15 retirement inventory, repo-grounded)

> **Note on terminology:** `Package NN` (e.g. 04a, 05c) names the **completed** content-SSOT
> sub-effort and appears only as historical evidence. All **forward** work is expressed as
> **Milestones 1–8** per the handoff §16.

> **Milestone 0 baseline artifact** grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) §15 (legacy retirement
> inventory + retirement rule) and §25 (owner-gated deletion). This maps every §15 legacy category
> to **concrete repo paths** with its current status and its position on the retirement ladder.
> Companion: [producer-artifact-classification.md](producer-artifact-classification.md),
> [public-content-migration-status.md](public-content-migration-status.md). Branch
> `claude/reconcile-live-into-main`. Every path grep-confirmed; no facts invented.

## Retirement rule (§15) — the ladder every row must climb

```
source frozen → all consumers mapped → replacement read/write path active
→ preview verified → production verified → zero-reference scan
→ rollback window elapsed → delete/archive with OWNER APPROVAL
```

Position shorthand used below: **FROZEN** · **MAPPED** · **REPLACEMENT-ACTIVE** ·
**PREVIEW-VERIFIED** · **PRODUCTION-VERIFIED** · **ZERO-REF** · **DELETE (owner)**.
Status: **frozen** (no new writes) / **active-writer** (still authoritative for some routes) /
**migrated** (deleted for its migrated scope).

**§15 caveat honored:** itinerary intelligence (`src/data/itinerary-core/*`) and package readiness
(`src/data/package-readiness/*`) are **NOT on this list** — they retain a declared operational
authority + controlled interface (see the classification doc, class operational-intelligence).

## Which routes are already migrated vs still legacy

| Cluster | Migrated → `content/` (no legacy fallback, AD-10) | Still legacy |
|---|---|---|
| Policy | `/policy`, `/policy/booking-payment-cancellation`, `/policy/inclusions-exclusions`, `/policy/privacy` (Package 03) | — |
| Travel Guide | Path A: `/travel-guide` hub + `booking-information`, `ijen-health-screening`, `packing-and-fitness`, `safety-on-tours`, `weather-and-closures` (Package 04a) | **Milestone 2 (deferred):** `/travel-guide/faq`, `police-escort-for-groups`, `rijik-monthly-closure`, `best-time-to-visit`; **Path B:** 13 OKF-backed folder pages |
| Why JVTO | Hub + `our-story`, `the-jvto-difference`, `our-team`, `community-standards`, `reviews` (Package 05/05c) | — |
| Verify JVTO | — | **All 5:** `/verify-jvto` + `legal`, `police-safety`, `press-recognition`, `history-artifacts` (Milestone 2) |
| Team | — | `/team` + `/team/[slug]` narrative (params stay DB) (Milestone 2) |
| Destinations | — | `/destinations` + `/destinations/[slug]` narrative (dynamic data stays DB) (Milestone 2) |
| Blog | — | `/blog` + `/blog/[slug]` (Milestone 2) |

## Freeze list

### 1. Manual page-narrative snapshots (§15 "manual page snapshots")

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/lib/publicContent/pageSnapshots.ts` (`manualPageSnapshots`) | active-writer | REPLACEMENT-ACTIVE (migrated routes) / not-started (non-seed routes) | Runtime guard in `getPublicPageSnapshot.ts` forces `allowDatabaseFallback=false` + content-synthesized snapshot for any `content/`-served route (Package 05c), so migrated routes bypass it. Still the fallback for `/`, `/markets/*`, `/isic/*`, `/blog`. Delete = Milestone 8. |
| `src/lib/publicContent/generated/{destinationDetail,destinationList,packageDetail,packageList,packageActivity,homeReview,reviewApi}Snapshots.json` | active-writer | n/a (generated-output, retained) | Build-time SSG **fallbacks for DB catalog/reviews** (transactional-state), not public-narrative snapshots. They stay while catalog/reviews are DB-owned (AD-02); regenerate, never hand-edit. Not a §15 delete target. |

### 2. CMS seed public pages/sections (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/data/cms/{page_sections.json,pages.json}` via `src/lib/cms/seedResolver.ts` (`SEED_COVERED_ROUTES`) | active-writer | PREVIEW-VERIFIED (16 migrated routes) / FROZEN elsewhere | Package 05c deleted 43 `page_sections` + 16 `pages` seed rows for migrated routes (they auto-drop from `SEED_COVERED_ROUTES`). Still serves non-migrated seed routes. `sync:cms-seed` retires at Milestone 8. |
| `src/data/cms/{entities.json,governance_facts.json,redirects.json,_manifest.json}` | active-writer | FROZEN | Same seed plane; retire with `sync:cms-seed`. |

### 3. `content_pages` public-narrative reads/writes (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `content_pages` table (`prisma/schema.prisma:1005`) | active-writer | REPLACEMENT-ACTIVE (migrated) / active (non-migrated SEO) | Write-blocked for migrated routes via `src/lib/static-content/migratedRoutes.ts` (`MIGRATED_STATIC_ROUTES`) — content-pages write API returns 403; CMS console read-only. Still supplies SEO override for non-migrated routes. Table drop = **Milestone 8, owner-gated** (AD-10). |
| Readers: `src/lib/content/getPageSeo.ts`, `getPublicPageSnapshot.ts` DB fallback | active-writer | MAPPED | Consumers enumerated; retire per-route as clusters cut over. |
| `src/lib/ssot/getContentPage.ts` | frozen | ZERO-REF | **Dead module — zero importers** (grep-confirmed). Delete at Milestone 8. |

### 4. FAQ-manager snapshots / resolvers (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/lib/publicContent/faqSnapshot.ts` + `generated/faqSnapshots.json` (`getPublicFaqCategories`) | active-writer | not-started | Distinct generated system (DB `category_faqs`/`faqs`). Sole consumer `(website)/travel-guide/faq/page.tsx`. Migration blocker documented (Milestone 2) — needs its own capture + parity plan. |
| `src/lib/content/resolveFaqs.ts` (`narrative_claims` + `content_pages content.faq` tiers) | active-writer | REPLACEMENT-ACTIVE (migrated) | AD-08 single-object FAQ now on `content/faqs/*` for migrated routes; resolver still owns non-migrated FAQ precedence. |

### 5. Public narrative in TSX + duplicated schema constants (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/app/(website)/verify-jvto/page.tsx` (+ `legal`, `police-safety`, `press-recognition`, `history-artifacts`) | active-writer | not-started | TSX-embedded narrative + `src/lib/Master_Dataset_JVTO.SSOT.v3.0.json` import + `getPageSeo`. Migrate to structured-json `content/` at **Milestone 2**. |
| `src/lib/Master_Dataset_JVTO.SSOT.v3.0.json` | active-writer | not-started | Public narrative blob consumed by verify-jvto; retires with Milestone 2. Guarded by `wrong-founding-year` drift rule (carried `founding_date:"2016-01-01"`). |
| `src/app/(website)/team/page.tsx` + `team/[slug]/page.tsx` | active-writer | not-started | Static bio narrative in TSX + `getContentPage` SEO. **Crew params stay DB** — migrate only narrative (Milestone 2). |
| `src/app/(website)/destinations/page.tsx` + `destinations/[slug]/page.tsx` | active-writer | not-started | Static narrative + `destinations` DB (dynamic) + `content_pages` SEO. Compose static+dynamic at page level (Milestone 2). |
| `src/lib/schemas/entityGraph.ts` (org block, `DEFINED_TERMS`) | active-writer | MAPPED | Canonical `@id` registry + org facts hardcoded. Org block migrates to `content/entities/organization.json` with its route packages (03–06); keep the schema-builder role. |

### 6. Hardcoded public route registries where derivable (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/app/sitemap.ts` + `sitemap.data.ts` + per-cluster `*/sitemap.data.ts` | active-writer | not-started | Route lists hardcoded per cluster. Milestone 2 removes only the `content_pages` `lastModified` fallback (`sitemap-utils.ts`) — it does **not** move the sitemap off enumeration. |
| `src/lib/registry/pages.ts` | active-writer | MAPPED | Page registry consuming trust-bundle; audit at Milestone 2 / Milestone 8. |

### 7. llm-wiki public blog sync (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| ~~`sync:blog` (`scripts/sync-blog.mjs`) → `src/data/blog/*.md` + `_manifest.json` → `src/lib/blog.ts`~~ | **RETIRED (Package 08, 2026-08-06)** | removed from ladder | Blog relocated to `content/pages/blog/` (gray-matter) as Git-SSOT; `sync:blog` + `scripts/sync-blog.mjs` + `src/data/blog` + `src/lib/blog.ts` deleted; `/blog` un-deprecated (redirect removed, registry `live`); parity guarded by `test:blog`. |

### 8. Trust / policy / OKF public-content consumers (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `src/lib/trust-bundle.ts` → `(website)/trust/page.tsx`; `src/lib/llms-txt.ts` → `/llms.txt` | active-writer | not-started | `/trust` + `/llms.txt` still read `src/data/trust-bundle`. Retire after cut to `content/` (Milestone 2). |
| `src/lib/policy-bundle.ts` (`getCustomerCopy`) → `buildPolicySchemas.ts` | active-writer | MAPPED | Policy page body already on `content/`; one schema node still reads the bundle — audit at Milestone 8. |
| `src/lib/content/agentGuides.ts` (← `src/data/okf`) → 13 travel-guide Path B pages | active-writer | not-started | Decouple bodies to `content/` at Milestone 2 — **owner check first** (confirm OKF customer-sales-release keeps other consumers; `_manifest.json` `customer_traffic_ready:false`). `how-booking-works` + `payment-and-deposit` are LIVE pages, migrate (do not redirect). |
| Drift gate `ci.yml verify` (`git diff src/data/{trust-bundle,policy-bundle,blog,package-readiness,okf}`) + `sync-artifacts.yml` | active-writer | n/a (keep until consumers zero) | Non-goal to touch until public consumers reach zero (migration doc). |

### 9. Manually maintained public knowledge outputs (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `public/llms-full.txt` | active-writer | not-started | Hand-authored static file (NOT synced/script-generated). Should become a generated projection (P-05) at Milestone 2, sourced from the same fact graph as visible HTML. |

### 10. Old CMS edit paths for Git-owned routes (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| Content-pages write API (`src/app/(api)/api/content-pages/*`) + CMS console for migrated routes | migrated | PREVIEW-VERIFIED | Already blocked: writes to `MIGRATED_STATIC_ROUTES` return 403; console renders them Git-managed/read-only (Package 05c). Enforced by `validate-static-route-ownership.mjs` (blocking in `verify`). |

### 11. Superseded frontend components (§15)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `WhyJVTOPage` / `OurStoryPage` / `OurTeamPage` / `ReviewsPage` / `JVTODifferencePage` / `CommunityStandardsPage` / `TriangulationReviews` | migrated | DELETE (done) | 7 legacy why-jvto components **already deleted** (Package 05c). `why-jvto/sidebar.tsx` KEPT (Navbar mobile menu imports it). Prior cleanup also removed `HealthScreeningSpotlight.tsx`, `SSOTRenderer.tsx`, `src/lib/whyjvto/`, `src/lib/jsonld.ts` (#132/#137). |

### 12. `narrative_claims` DB public narrative (P-02 Git-owned target)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `narrative_claims` table (`prisma/schema.prisma:1939`), `src/lib/queries/narrativeClaims.ts` | active-writer | REPLACEMENT-ACTIVE (hub) | Hub claims exported to `content/entities/narrative-claims.json` (Package 05c); DB still authoritative for non-migrated routes' FAQ (`resolveFaqs.ts`) + tour `[slug]` families (`buildTourSchemas.ts`). Retire per cluster; DB stays for dynamic reviews only. |

### 13. Live-only production behavior not represented in `main` (§15 / §3.4)

| Path | Status | Ladder position | Detail |
|---|---|---|---|
| `main` vs `live` divergence (`main` +342 / −124 vs `live`, "diverged" at handoff) | active-writer | not-started | 124 live-only commits must be classified preserve/duplicate/obsolete/unknown and ported to a reconciliation branch from `main` (this branch, `claude/reconcile-live-into-main`) **before** any cutover (§3.4, §16 Milestone 0). No destructive branch replacement until audited. |
| `public/ops/volcanic-status.json` bot commits to `live` | active-writer | n/a (keep) | Volcanic-status bot (`update-volcanic-status.yml`) commits to `main` **and** `live` — the sole data-only `live` exception (`docs/CONTRIBUTING.md` §2.2). Not a delete target; a reconciliation consideration (main↔live re-divergence risk — see [risk-register.md](risk-register.md)). |
