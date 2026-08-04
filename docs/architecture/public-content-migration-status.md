# Public Content Migration Status (ledger)

> Regenerate the raw signal table anytime with:
> `npx tsx scripts/static-content/audit-current-sources.ts`
> Status values: `pending` → `extracted` → `cutover` → `verified` → `retired`.
> Audited at baseline `a7892e66` (2026-08-04). See
> [public-content-ownership.md](public-content-ownership.md) for the resolution model.

## Policy (Package 03) — **CUTOVER 2026-08-04, parity verified**

| route | file | format | specialSchema kept | status | notes |
|---|---|---|---|---|---|
| /policy | `content/pages/policy/index.md` | markdown (meta + canonical hub copy; card layout stays TSX chrome) | hub ItemList | **verified** | FAQ removed from render path (resolver returned 0 — parity) |
| /policy/booking-payment-cancellation | `content/pages/policy/booking-payment-cancellation.json` | **structured** — bundle wording consolidated verbatim (booking-paths, payment-rules, 8 guarantee blocks in a grid + precedence note); lime-box styling keyed on section id `lifetime-package-guarantee` | PolicyWebPage + SpecialAnnouncement | **verified** | the stale 10,977-char snapshot body was already skipped pre-migration — not resurrected |
| /policy/inclusions-exclusions | `content/pages/policy/inclusions-exclusions.md` | markdown | PolicyWebPage | **verified** | AD-07: leading in-body `# H1` stripped (was double-rendered) |
| /policy/privacy | `content/pages/policy/privacy.md` | markdown | PolicyWebPage | **verified** | AD-07: leading in-body `# H1` stripped (was double-rendered) |

Policy routes call **zero** obsolete readers (`getPublicPageSnapshot` / `getContentPage` /
`resolveFaqsForPage` / `getPolicyNotes` / `getCustomerCopy` / `getPolicyEvidenceText` /
`getPageSeo` / `listPublicPageRoutesByPrefix` — grep-verified empty). `buildPolicySchemas.ts`
still reads `getCustomerCopy` internally for the SpecialAnnouncement node (schema import,
allowed by the blueprint; audit again in Package 09). `browserTitle` meta field added for
H1 ≠ `<title>` parity. Parity proof: all 4 routes byte-compared against the pre-cutover
resolver dumps (H1/titles/descriptions/bodies/bundle blocks/no-FAQ) — PASS.

## Travel Guide (Package 04) — Path A **CUTOVER 2026-08-04, parity verified**

| route | file | status | notes |
|---|---|---|---|
| /travel-guide (hub) | `travel-guide/index.md` | **verified** | meta/H1 from SSOT; rich TSX layout kept; the former hub `FAQPage` node was **schema-only** (no visible FAQ) and is dropped per **AD-08** |
| /travel-guide/booking-information | `booking-information.md` + `faqs/travel-guide-booking-information.json` (7) | **verified** | FAQ: one array → visible + JSON-LD |
| /travel-guide/ijen-health-screening | `ijen-health-screening.md` + faq (5) | **verified** | `MedicalWebPage` + `HowTo` preserved; **dangling doctor `@id` FIXED** (DOCTOR_SCHEMA now injected); an embedded llm-wiki authoring block (`profile:/sources:` + duplicate `# H1`) that rendered as junk on the live page was stripped (documented hygiene fix) |
| /travel-guide/packing-and-fitness | `packing-and-fitness.md` + faq (5) | **verified** | |
| /travel-guide/safety-on-tours | `safety-on-tours.md` + faq (5) | **verified** | |
| /travel-guide/weather-and-closures | `weather-and-closures.md` + faq (5) | **verified** | canonical blue-fire negation carries a same-line `drift-ok` marker (scanner is line-based; the "No" answer is facts-lock compliant) |

**Path A capture safety:** every route above is **seed-covered** (`SEED_COVERED_ROUTES`), so the
seed/snapshot is authoritative even at runtime — the DB can never override → offline capture ==
production truth. All routes byte-parity-verified (H1/titles/descriptions/bodies/FAQs).

**Deferred to 04b (documented blockers — do NOT fold into 04a):**

| route | blocker |
|---|---|
| /travel-guide/faq | content comes from the **FAQ-manager snapshot** (`getPublicFaqCategories()` / `faqSnapshot`), a distinct generated system — needs its own capture + parity plan |
| /travel-guide/police-escort-for-groups | folder page; TSX body + `getContentPage` **SEO override from the DB** — a live DB row may differ from offline fallbacks; needs a verified DB export before its SEO migrates |
| /travel-guide/rijik-monthly-closure, /travel-guide/best-time-to-visit | folder pages, TSX-bodied (not snapshot-driven); best-time-to-visit additionally has no DB row (pre-existing open item) |

**Path B — 13 OKF-backed folder pages (`AgentGuide` body from `src/data/okf` via `AGENT_GUIDES`; `getContentPage` for SEO only):**
`blue-fire-and-sunrise`, `booking-safety`, `bromo-sunrise`, `cancellation-travel-credit`,
`finish-in-bali`, `how-booking-works`, `malang-batu`, `payment-and-deposit`, `private-tour`,
`rooming-and-accommodation`, `vehicle-and-luggage`, `what-is-included`, `why-stay-near-ijen`.

| aspect | value |
|---|---|
| currentEffectiveSource | OKF agent-guides (file) + content_pages (SEO override only) |
| targetFormat | markdown (body) — decouples from `sync:okf` for these pages |
| pkg / status | 04 / pending |
| blocker | **owner check before decouple:** confirm OKF customer-sales-release keeps its other consumers; `/travel-guide/how-booking-works` + `/payment-and-deposit` are LIVE pages, not redirects — migrate, don't redirect |

## Why JVTO (Package 05)

| route | currentEffectiveSource | currentShape | targetFormat | specialSchema | pkg | status | blocker |
|---|---|---|---|---|---|---|---|
| /why-jvto (hub) | content/pages/why-jvto/index.json (+ content/entities/*) | structured-json + entities | structured-json + entities | hub ItemList + narrative-claims ItemList (content/entities/narrative-claims.json) + FAQPage | 05 | **done** (live-verified) | 05c: ALL hub narrative moved to content/ (trust cards, proof docs, hero meta, chips, §01-05, press, DIFF/QUOTES/STORY/STANDARDS, CTA); TSX = layout/icons/interaction only; crew stats COMPUTED from the our-team crew_grid (11/7/4); zero DB reads (claims ItemList from content/) |
| /why-jvto/[slug] (our-story, the-jvto-difference, our-team, community-standards) | content/pages/why-jvto/*.json | sections/blocks (`BlocksRenderer`: markdown, image, grid, crew_grid; `sectionId`-keyed Timeline/ReviewLinks specials) | structured-json | — | 05 | **done** (live-verified) | `prefersDbForSlug()` DB-preferred path removed (AD-10); `sectionId` constants preserved verbatim from source |
| /why-jvto/reviews | content/pages/why-jvto/reviews.json + Prisma reviews (schema only) | sections + dynamic | structured-json + DB reviews (stays) | individual `Review` + `AggregateRating` (`buildWhyJvtoSchemas.ts:96,153`) | 05 | **done** (live-verified) | AD-08 gap **closed** — visible FAQ + FAQPage JSON-LD now both built from the single `page.faq` array |
| /why-jvto/reviews/[id] | Prisma (dynamic) | dynamic | **stays DB** | Review | — | n/a | out of scope (dynamic) |

## Verify JVTO / Team / Destinations (Package 06)

| route | currentEffectiveSource | targetFormat | pkg | status | blocker |
|---|---|---|---|---|---|
| /verify-jvto + legal, police-safety, press-recognition | TSX-embedded narrative + `getPageSeo` (snapshot SEO) | structured-json | 06 | pending | none |
| /verify-jvto/history-artifacts | `content_pages` + resolver | structured-json | 06 | pending | none |
| /team (hub) + /team/[slug] | `crew_members` (DB params) + `getContentPage` SEO | entities/people.json narrative; **params stay DB** | 06 | pending | do not migrate crew params |
| /destinations + /destinations/[slug] | `destinations` table (dynamic) + `content_pages` SEO | markdown narrative; **dynamic data stays DB** | 06 | pending | compose static+dynamic at page level |

## Blog (Package 08)

| route | currentEffectiveSource | targetFormat | pkg | status | blocker |
|---|---|---|---|---|---|
| /blog + /blog/[slug] (2 posts) | `src/data/blog/*.md` + `_manifest.json` via `src/lib/blog.ts` (hand-rolled frontmatter; synced from llm-wiki via `sync:blog`) | move to `content/pages/blog/` (gray-matter), keep URLs + `BlogPosting` JSON-LD | 08 | pending | remove `sync:blog` only after parity |

## Cross-cutting facts (Package 02 — entities) — **DONE 2026-08-04**

| entity | status | notes |
|---|---|---|
| `entities/organization.json` | extracted | values verbatim from `entityGraph.ts` + facts lock; no incorporation year; foundingDate 2015 |
| `entities/review-platforms.json` | **cutover** | the review-stats SSOT **relocated** here from `src/data/reviewStats.canonical.json` (deleted); both consumers now read the entity: `src/lib/jvtoReviews.ts` (runtime `AGGREGATE_RATING`/`REVIEW_PLATFORMS`) + `scripts/export-public-review-api-snapshots.mjs`. Strict schema enforces counts↔profiles parity, rating⇒verifiedAt, exactly one primary |
| `entities/people.json` | extracted | founder + Dr. Irwandanu (SIP/STR + claim boundary) + crew counts (14 = 7+7; KTA stays DB) |
| `entities/credentials.json` | extracted | NIB/TDUP/HPWKI/SPRIN×2/BBKSDA-SE1658 with SHA-256 anchors verbatim |
| `entities/partners.json` | extracted | HPWKI/INDECON/ISIC with OKF claim boundaries (ISIC = registered provider) |

Remaining consumers (`entityGraph.ts` org block, verify pages, `DEFINED_TERMS`) migrate with
their route packages (03–06) — per blueprint §Package 02, only one low-risk shared consumer
(the review-stats SSOT) was cut over now.

## Non-goals / stays as-is

- Tours/packages/pricing/checkout/booking/customer/auth — DB-owned (AD-02), untouched.
- `src/data/{trust-bundle,policy-bundle,package-readiness,okf}` sync + CI drift gate — untouched
  until their consumers reach zero (Packages 03–09); `sync:cms-seed` retires in 09.
- Sitemap route enumeration (hardcoded per-cluster) — only the `content_pages` lastmod fallback is
  removed in Package 07.
- `src/lib/ssot/getContentPage.ts` — dead (zero importers); delete in Package 09.

## Program status

| package | scope | status |
|---|---|---|
| 00 | audit + this ledger | **done** (#141) |
| 01 | loader + validation gates + drift-scan extension | **done** (#141) |
| 02 | shared entities + review-stats SSOT relocation | **done** (#142) |
| 03 | Policy migration + cutover (4 routes, parity verified) | **done** (#143) |
| 04a | Travel Guide Path A (hub + 5 seed-owned slugs, parity verified) | **done** (#144) |
| 04b | TG deferred routes (faq / police-escort / rijik / best-time) + 13 OKF pages | pending — blockers documented above |
| 05 | Why JVTO migration + cutover (hub + 5 sub-pages; AD-08 gap closed) | **done** (#145 cutover) |
| 05b | 5 owner-flagged fact fixes + /api/build-info + deploy SHA/smoke gate | **done** (#145) |
| 05c | Total legacy-source removal + enforcement gate (below) | **done** (#145, merged `1c22c770`) — live-verified |
| 06–11 | per blueprint | pending, one PR each |

**Live proof (help box, merge `1c22c770`, 2026-08-04):** deploy run 30901548524 green (its in-CI
`smoke-why-jvto.mjs` step passed) + independent re-verification: `/api/build-info` commitSha ==
`1c22c770bda3e25b0e8cad1b7d27068f967cb34c`; all 6 why-jvto routes HTTP 200 with the production
canonical + exactly one FAQPage each; hub shows "11 active crew" / "7 guides, 4 drivers" +
"Registered ISIC Provider"; zero occurrences of "14 named crew", "ISIC Partner", or "guidebook 2016".
**`live`/production still carries the old Why JVTO until the owner runs the `main → live` promote.**

### Package 05c — legacy-source removal + enforcement (owner directive 2026-08-04)

Owner rule: a migrated route's PR must ALSO remove its legacy sources and block their return —
no "migrated now, remove later".

- **All hub narrative → content/.** `why-jvto/page.tsx` (was 754 lines of hardcoded copy) +
  `HubInteractive.tsx` (4 data arrays) now render entirely from `content/pages/why-jvto/index.json`
  (10 hub sections) + `content/entities/narrative-claims.json`. TSX keeps layout, styling, the icon
  map, and interaction only. Crew stats are **computed** from the published `our-team` crew_grid
  (11 total / 7 guides / 4 drivers) — never TSX literals. ISIC → "Registered ISIC Provider";
  INDECON → public network listing, separated from the Local-Boys employment policy.
- **Legacy sources deleted for the 6 why-jvto routes** (and the 10 policy/travel-guide migrated
  routes are covered by the same registry): 16 `manualPageSnapshots` entries removed from
  `pageSnapshots.ts`; 43 `page_sections.json` + 16 `pages.json` seed rows removed (so
  `SEED_COVERED_ROUTES` auto-drops them); 7 dead legacy components deleted
  (`WhyJVTOPage`/`OurStoryPage`/`OurTeamPage`/`ReviewsPage`/`JVTODifferencePage`/`CommunityStandardsPage`,
  `TriangulationReviews`). `why-jvto/sidebar.tsx` KEPT (Navbar mobile menu imports it).
- **Runtime guard:** `getPublicPageSnapshot` now recognizes any content/-served route
  (`loadStaticPage`, fs-only) and forces `allowDatabaseFallback = false` + serves a
  content-synthesized snapshot — so deleting the cms-seed rows cannot re-open the DB-override path.
  `sitemap-utils` reads `meta.lastReviewed` for those routes (no DB).
- **Narrative claims:** hub JSON-LD ItemList reads `content/entities/narrative-claims.json`
  (pillar + primary_page, exported from the DB), not `getAllNarrativeClaims()`. The DB stays the
  source only for dynamic data (individual reviews, ratings) and the two tour `[slug]` families.
- **CMS block:** central registry `MIGRATED_STATIC_ROUTES`
  (`src/lib/static-content/migratedRoutes.ts`, derived from published content/) — the content-pages
  write API rejects create/update on those routes (403), and the CMS console renders them
  Git-managed/read-only.
- **Enforcement gate:** `scripts/validate-static-route-ownership.mjs` (blocking in ci.yml `verify`
  via `content:check`) fails the build when a migrated route regains a snapshot/seed/resolver/DB
  source, when the CMS guard is missing, or when a forbidden claim (14 crew, 7 drivers, ISIC
  Partner, INDECON-as-partnership) reappears. Live proof: `scripts/smoke-why-jvto.mjs` in deploy.yml
  (SHA match + 6×200 + canonical + single FAQPage + 11/7/4 crew + no forbidden claims).
