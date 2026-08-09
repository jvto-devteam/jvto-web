# Public Content Migration Status (ledger)

> Regenerate the raw signal table anytime with:
> `npx tsx scripts/static-content/audit-current-sources.ts`
> Per-route status values: `pending` → `extracted` → `cutover` → `verified` → `retired`.
> **Promotion status** (a package's release state, 2026-08-04): **IMPLEMENTED** = merged to
> `main`; **PREVIEW-VERIFIED** = proven live on the help/preview box; **PRODUCTION-VERIFIED** =
> proven on `live`/production after the owner's `main → live` promote. A package is never marked
> PRODUCTION-VERIFIED by this workspace — production promotion + verification is an owner action.
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
allowed by the blueprint; **audited in Package 09 (2026-08-09): kept** — it reads the
`policy-bundle` producer artifact (`src/lib/policy-bundle.ts`), the sanctioned policy-copy
source shared with checkout + `tourFaqs`; it is a schema-only read, not a migrated-route legacy
source, so no change). `browserTitle` meta field added for
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

**Package 04b — all 17 deferred Travel Guide routes cut over to content/ (owner decisions locked 2026-08-06).** Every route is now content-owned; `getContentPage` / `content_pages` / the FAQ-manager snapshot / `AGENT_GUIDES` are removed from all Travel Guide render paths.

**Four bespoke folder pages** (kept a folder `page.tsx` for a layout the markdown renderer can't reproduce; excluded from the `[slug]` loader's `FOLDER_OWNED_ROUTES`; narrative + SEO + FAQ in `content/`):

| route | notes |
|---|---|
| /travel-guide/best-time-to-visit | colour-coded month table + season-verdict cards (TSX chrome over structured content); FAQ from content |
| /travel-guide/rijik-monthly-closure | prose + FAQ from content; calendar-computed closure table stays TSX; `"100% JVTO Travel Credit"` → **Lifetime Package Credit** (facts-lock) |
| /travel-guide/faq | categorized accordions + single FAQPage from the same array; frozen from the served FAQ-manager snapshot (owner decision — no DB wait); HTML answers → markdown; one question reworded to clear the `blue-fire-guarantee` scanner |
| /travel-guide/police-escort-for-groups | prose + key-facts + photo-evidence grid (TSX chrome); repository SEO fallback is the canonical content (owner decision — no `content_pages` export wait) |

**Thirteen former OKF pages → `content/pages/travel-guide/<slug>.md`, served by the `[slug]` loader** (folder pages + `AgentGuide.tsx` + `agentGuides.ts` deleted; `AGENT_GUIDES` retired): `blue-fire-and-sunrise`, `booking-safety`, `bromo-sunrise`, `cancellation-travel-credit`, `finish-in-bali`, `how-booking-works`, `malang-batu`, `payment-and-deposit`, `private-tour`, `rooming-and-accommodation`, `vehicle-and-luggage`, `what-is-included`, `why-stay-near-ijen`. One-time input = the currently-synced OKF bundle (frozen via `AGENT_GUIDES`, which was curated from `src/data/okf/general-modules.json`).

**OKF retained for its non-route consumers** (owner decision #4): `src/data/okf` + `sync:okf` + the CI drift gate stay for the CMS catalog (`entityRegistry.ts` read-only entries + the `cms/consolidation` view). The route-coverage validator `validate-okf-consumption.mjs` is retired (no route consumes OKF now).

**Enforcement:** ownership gate (44 migrated routes; faq + police-escort seed rows + snapshots stripped), `test:travel-guide-04b` (route parity + malformed-grid negative self-test), knowledge feed (44 routes) + sitemap string-literals + authority manifest all regenerated.

## Why JVTO (Package 05)

| route | currentEffectiveSource | currentShape | targetFormat | specialSchema | pkg | status | blocker |
|---|---|---|---|---|---|---|---|
| /why-jvto (hub) | content/pages/why-jvto/index.json (+ content/entities/*) | structured-json + entities | structured-json + entities | hub ItemList + narrative-claims ItemList (content/entities/narrative-claims.json) + FAQPage | 05 | **IMPLEMENTED · PREVIEW-VERIFIED** | 05c: ALL hub narrative moved to content/ (trust cards, proof docs, hero meta, chips, §01-05, press, DIFF/QUOTES/STORY/STANDARDS, CTA); TSX = layout/icons/interaction only; crew stats COMPUTED from the our-team crew_grid (11/7/4); zero DB reads (claims ItemList from content/) |
| /why-jvto/[slug] (our-story, the-jvto-difference, our-team, community-standards) | content/pages/why-jvto/*.json | sections/blocks (`BlocksRenderer`: markdown, image, grid, crew_grid; `sectionId`-keyed Timeline/ReviewLinks specials) | structured-json | — | 05 | **IMPLEMENTED · PREVIEW-VERIFIED** | `prefersDbForSlug()` DB-preferred path removed (AD-10); `sectionId` constants preserved verbatim from source |
| /why-jvto/reviews | content/pages/why-jvto/reviews.json + Prisma reviews (schema only) | sections + dynamic | structured-json + DB reviews (stays) | individual `Review` + `AggregateRating` (`buildWhyJvtoSchemas.ts:96,153`) | 05 | **IMPLEMENTED · PREVIEW-VERIFIED** | AD-08 gap **closed** — visible FAQ + FAQPage JSON-LD now both built from the single `page.faq` array |
| /why-jvto/reviews/[id] | Prisma (dynamic) | dynamic | **stays DB** | Review | — | n/a | out of scope (dynamic) |

## Verify JVTO / Team / Destinations (Package 06)

| route | currentEffectiveSource | targetFormat | pkg | status | notes |
|---|---|---|---|---|---|
| /verify-jvto (hub) + legal, police-safety, press-recognition, history-artifacts | `content/pages/verify-jvto/*.json` (+ `content/faqs/verify-jvto*.json`) | structured-json | 06 | **IMPLEMENTED · PREVIEW-VERIFIED** | copy/SEO/FAQ from content/; TSX keeps layout + the JSON-LD projection (`buildVerifySubpageSchema`, `LEGAL_/POLICE_SAFETY_DIGITAL_DOCUMENTS`, `PRESS_RECOGNITION_SCHEMAS`, in-file `HISTORY_TIMELINE_SCHEMA`) + the evidence locker (`VerifyJvtoClient` + `getDocsByGroup` = Master_Dataset SSOT, **not** migrated). Legacy removed for all 5 routes: 5 `manualPageSnapshots` + 5 `pages.json` + 11 `page_sections.json` seed rows; no `getPageSeo`/`resolveFaqsForPage`. Facts fixed in-flight: hub aggregateRating `4.9/200` → canonical `4.8/195`; Stefan Loose timeline **de-yeared** (no "2016", no startDate); incorporation reframed to 2023 formalization (TDUP 2023-02-11). FAQ single-array (visible==FAQPage, AD-08); FAQ now rendered visibly on every verify page |
| /team (hub) + /team/[slug] | `content/entities/people.json` via `@/lib/people/canonicalPeople` | people-entity (11 crew: 7 guides + 4 drivers); params **people.json-sourced, NOT `crew_members`** | 06 | **IMPLEMENTED** | people-entity-sourced already on `main`; enforced by ownership gate check 8 + `validate:people` + `test:team-parity`. KTA is an HPWKI **membership** credential carried in people.json, never DB params. (Corrected 2026-08-06 — the prior "crew_members (DB params) … pending" row was stale.) |
| /destinations (hub) | `content/pages/destinations/index.json` (hero + per-slug feature copy + transport + CTA) **+** DB snapshot (`getPublicDestinationList`) for cards, counts, and the `CollectionPage`/`ItemList` JSON-LD | structured-json narrative **+** dynamic DB | 06 | **IMPLEMENTED · PREVIEW-VERIFIED** | static + dynamic composed at page level, no duplicated facts; **no package/price/booking/availability migrated**; 1 `manualPageSnapshot` + 1 `pages.json` + 3 `page_sections.json` seed rows removed; `getPageSeo` replaced by `loadStaticPage` |
| /destinations/[slug] — **5 routes** (`ijen-crater`, `mount-bromo`, `tumpak-sewu-waterfall`, `madakaripura-waterfall`, `papuma-beach`) | `content/pages/destinations/<slug>.json` (evergreen narrative + SEO) **+** DB/snapshot for dynamic data only | structured-json narrative **+** dynamic DB | 06 | **IMPLEMENTED · PREVIEW-VERIFIED** | All five detail routes have canonical content records under `content/pages/destinations/`. The page loader is **`loadStaticPage()`** (used in both `generateMetadata` and the render). From `content/`: evergreen narrative (hero chrome, quick facts, signature narrative, travel-guide handoff, related destinations), SEO metadata, the **canonical** (`staticRouteCanonical()` → the knowledge feed's production URL), the visible content, and the `TouristAttraction` / handoff JSON-LD facts. **DB stays the source for dynamic data only:** identity, coordinates, media, route statistics, volcanic status, tours (+ prices), org profile. Each of the five is a compiled knowledge-feed route with a production canonical (feed = 47 routes); `dynamicParams=false`, params from the detail snapshot. Enforced by `test:destinations-parity` + the ownership gate (a detail route must have a content record and no DB/TSX narrative). **Corrected in Package 09** — the earlier "detail route unchanged / stays DB / only the hub migrates / outside the knowledge-feed scope" wording was false: the detail migration landed with the hub in #159. |

## Blog (Package 08)

| route | currentEffectiveSource | targetFormat | pkg | status | blocker |
|---|---|---|---|---|---|
| /blog + /blog/[slug] (2 posts) | **`content/pages/blog/`** — `index.md` hub + 2 post `.md` (gray-matter) via the static-content loader | move to `content/pages/blog/`, keep URLs + `BlogPosting` JSON-LD | 08 | **IMPLEMENTED · PREVIEW-VERIFIED** (merge `f1bfc8f7`) | `sync:blog` + `src/data/blog` + `src/lib/blog.ts` retired; **`/blog` un-deprecated** (removed the `next.config` 301 → `/travel-guide` + flipped the registry `dead`→`live`); CMS-seed blog rows stripped; hub `CollectionPage` + posts `BlogPosting` + `publishedDate`; `test:blog` parity + negative self-test |

## Cross-cutting facts (Package 02 — entities) — **DONE 2026-08-04**

| entity | status | notes |
|---|---|---|
| `entities/organization.json` | extracted | values verbatim from `entityGraph.ts` + facts lock; no incorporation year; foundingDate 2015 |
| `entities/review-platforms.json` | **cutover** | the review-stats SSOT **relocated** here from `src/data/reviewStats.canonical.json` (deleted); both consumers now read the entity: `src/lib/jvtoReviews.ts` (runtime `AGGREGATE_RATING`/`REVIEW_PLATFORMS`) + `scripts/export-public-review-api-snapshots.mjs`. Strict schema enforces counts↔profiles parity, rating⇒verifiedAt, exactly one primary |
| `entities/people.json` | **cutover** | founder + Dr. Irwandanu (SIP/STR + claim boundary) + crew counts (**11 = 7 guides + 4 drivers**; KTA is an HPWKI membership credential carried in people.json, not DB params). Read live by the Team routes via `@/lib/people/canonicalPeople` (Package 06). Corrected 2026-08-06 (was "14 = 7+7; KTA stays DB") |
| `entities/credentials.json` | extracted | NIB/TDUP/HPWKI/SPRIN×2/BBKSDA-SE1658 with SHA-256 anchors verbatim |
| `entities/partners.json` | extracted | HPWKI/INDECON/ISIC with OKF claim boundaries (ISIC = registered provider) |

Remaining consumers (`entityGraph.ts` org block, verify pages, `DEFINED_TERMS`) migrate with
their route packages (03–06) — per blueprint §Package 02, only one low-risk shared consumer
(the review-stats SSOT) was cut over now.

## Non-goals / stays as-is

- Tours/packages/pricing/checkout/booking/customer/auth — DB-owned (AD-02), untouched.
- `src/data/{trust-bundle,policy-bundle,package-readiness,okf}` sync + CI drift gate — untouched
  until their consumers reach zero (Packages 03–09). **`sync:cms-seed` retires at Milestone 8**
  (it still serves non-migrated seed routes, so retiring it earlier would break them) — reconciled
  in Package 09 to match `legacy-freeze-list.md` + `producer-artifact-classification.md`; the earlier
  "retires in 09" here was an outlier and is corrected.
- Sitemap route enumeration (hardcoded per-cluster) — unchanged. The `content_pages` lastmod
  fallback **was removed in Package 07** (2026-08-09): lastmod now resolves from the content/ SSOT
  (`meta.lastReviewed`) → committed page snapshots → an explicit static date for the two TSX/lib-owned
  `/markets/*` routes, so the sitemap performs **no database read** and no route falls through to the
  force-dynamic request time.
- `src/lib/ssot/getContentPage.ts` — **deleted in Package 09** (was dead, zero importers; the active
  reader is `@/lib/content/getContentPage`).

## Program status

| package | scope | status |
|---|---|---|
| 00 | audit + this ledger | **done** (#141) |
| 01 | loader + validation gates + drift-scan extension | **done** (#141) |
| 02 | shared entities + review-stats SSOT relocation | **done** (#142) |
| 03 | Policy migration + cutover (4 routes, parity verified) | **done** (#143) |
| 04a | Travel Guide Path A (hub + 5 seed-owned slugs, parity verified) | **done** (#144) |
| 04b | TG deferred routes (best-time / rijik / faq / police-escort) + 13 OKF pages | **IMPLEMENTED · PREVIEW-VERIFIED** (#160, merged `024d673f`) — all 17 routes content-owned; AGENT_GUIDES retired, OKF kept for non-route consumers; owner decisions locked 2026-08-06. Preview proof: help `/api/build-info` == `024d673f`, all 17 `/travel-guide/*` routes HTTP 200, knowledge feed 44 routes |
| 05 | Why JVTO migration + cutover (hub + 5 sub-pages; AD-08 gap closed) | **IMPLEMENTED · PREVIEW-VERIFIED** (#145) |
| 05b | 5 owner-flagged fact fixes + /api/build-info + deploy SHA/smoke gate | **IMPLEMENTED · PREVIEW-VERIFIED** (#145) |
| 05c | Total legacy-source removal + enforcement gate (below) | **IMPLEMENTED · PREVIEW-VERIFIED** (#145, merged `1c22c770`) |
| 06 | Verify JVTO (hub + 4 sub-pages) + Destinations **hub + 5 detail routes** → content/; Team people-entity-sourced | **IMPLEMENTED · PREVIEW-VERIFIED** (#159, merged `7850af59`) — Verify (5 routes) + Destinations hub **and all 5 `/destinations/[slug]` detail routes** (narrative/SEO/canonical/JSON-LD from `content/`, DB only for dynamic data); Team people-entity-sourced. Preview proof (help @ `f1bfc8f7`, 2026-08-09): the 5 detail routes each return HTTP 200 with the production canonical + `TouristAttraction` JSON-LD |
| 08 | Blog (hub + 2 posts) → content/; `/blog` un-deprecated; `sync:blog` retired | **IMPLEMENTED · PREVIEW-VERIFIED** (#161, merged `f1bfc8f7`) — content-owned, `BlogPosting`/`CollectionPage` JSON-LD, `test:blog` parity. Preview proof (help @ `f1bfc8f7`): build-info + knowledge-feed `sourceCommit` both `f1bfc8f7`, feed 47 routes, hub + both posts HTTP 200 with production canonicals, sitemap carries all three, help still `noindex, nofollow`. **Routing note:** `/blog` no longer 301s to `/travel-guide` (the redirect is removed; the registry entry is now `live`) |
| 09 | SSOT dead-source cleanup: delete dead `src/lib/ssot/getContentPage.ts`; audit `buildPolicySchemas` `getCustomerCopy` (**kept** — sanctioned `policy-bundle` read, shared with checkout/tours); reconcile the architecture inventories + this ledger (incl. the `/destinations/[slug]` row and the promotion statuses above); `sync:cms-seed` retirement timing → **Milestone 8** | **IMPLEMENTED · PREVIEW-VERIFIED** (#162, merged `cf293bbe`) — preview proof: the **automatic** `main → help` deploy (`Deploy to VPS` run #366, `event: push`, head `cf293bbe`, 15:19:35Z → success 15:21:08Z; the workflow fails unless `/api/build-info` reports the pushed SHA) plus an independent re-check: help `build-info.commitSha` == `knowledge-feed.sourceCommit` == `cf293bbe`, feed 47 routes, `/blog` + post + `/destinations/ijen-crater` + `/travel-guide/faq` each HTTP 200 with the production canonical, `/travel-guide/faq` exactly one FAQPage, help still `noindex, nofollow`. The `sync:cms-seed` retirement itself remains deferred to M8 (still serves non-migrated routes) |
| 07 | Sitemap lastmod: remove the `content_pages` (Prisma) fallback; enumeration unchanged | **cutover (this PR)** — lastmod resolves content/ → snapshot → explicit static date; `/markets/{singapore,malaysia}` (the only routes the DB tier still served) get an explicit date so they never fall to the request time; `test:sitemap-lastmod` gate proves all 32 routes stable + the path is DB-free |
| 10–11 | per blueprint | pending, one PR each |

**Deploy proof (help/preview box, merge `1c22c770`, 2026-08-04) — NOT production:** deploy run
30901548524 green (its in-CI `smoke-why-jvto.mjs` step passed) + independent re-verification:
`/api/build-info` commitSha ==
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
