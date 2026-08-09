# Producer / Content Artifact Classification

> **Note on terminology:** `Package NN` (e.g. 04a, 05c) names the **completed** content-SSOT
> sub-effort and appears only as historical evidence. All **forward** work is expressed as
> **Milestones 1–8** per the handoff §16.

> **Milestone 0 baseline artifact** grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) — First-execution
> task §28.5 ("classify every producer artifact as public knowledge, operational intelligence,
> transactional state, generated output, or legacy") and §15 legacy retirement inventory.
> Companion docs: [public-content-ownership.md](public-content-ownership.md) (AD-01..AD-11),
> [public-content-migration-status.md](public-content-migration-status.md) (route ledger),
> [domain-ownership-matrix.md](domain-ownership-matrix.md),
> [legacy-freeze-list.md](legacy-freeze-list.md). Branch `claude/reconcile-live-into-main`.
> Every path grep-confirmed against the working tree; no facts invented.

## Classes (handoff §28.5)

| Class | Meaning |
|---|---|
| **public-knowledge** | Evergreen public narrative / stable facts / evidence metadata (handoff P-02: Git-owned authority under `content/`). |
| **operational-intelligence** | Non-public operational authority with a declared, controlled interface — **not auto-legacy** (§15 caveat). |
| **transactional-state** | Price / availability / booking / payment / customer / operational live state (handoff P-03: PostgreSQL/provider-owned). |
| **generated-output** | Derived projection of a domain model — never an upstream authority (handoff P-05). |
| **legacy** | Superseded reader/writer awaiting the §15 retirement rule (source frozen → consumers mapped → replacement active → preview/production verified → zero-reference → rollback window → delete). |

A single artifact gets exactly one class by its **current authority function**; migration/retirement
state lives in the note column. Where an artifact is public content served through a superseded path,
class reflects whether it is the live authority (public-knowledge) or the designated-superseded writer (legacy).

## Classification table

### `content/` SSOT (the target public-knowledge plane)

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| Entity facts (org, people, credentials, partners, review-platforms, narrative-claims) | `content/entities/*.json` | public-knowledge | `src/lib/jvtoReviews.ts` (review-platforms), why-jvto hub JSON-LD (narrative-claims), `scripts/export-public-review-api-snapshots.mjs` | AD-03. `review-platforms.json` is the review-stats SSOT (relocated from deleted `src/data/reviewStats.canonical.json`, Package 02). |
| Policy pages | `content/pages/policy/{index.md,inclusions-exclusions.md,privacy.md,booking-payment-cancellation.json}` | public-knowledge | `src/lib/static-content/loadStaticPage.ts` → `(website)/policy/*` | Cutover + parity-verified (Package 03, #143). |
| Travel-Guide Path A | `content/pages/travel-guide/{index,booking-information,ijen-health-screening,packing-and-fitness,safety-on-tours,weather-and-closures}.md` | public-knowledge | `loadStaticPage` → `(website)/travel-guide/[slug]` (seed-covered) | Cutover + parity-verified (Package 04a, #144). |
| Why-JVTO pages | `content/pages/why-jvto/{index,our-story,the-jvto-difference,our-team,community-standards,reviews}.json` | public-knowledge | `(website)/why-jvto/page.tsx` + `[slug]/page.tsx` | IMPLEMENTED · PREVIEW-VERIFIED (Package 05/05c, #145). |
| FAQ arrays | `content/faqs/*.json` (10 files) | public-knowledge | `resolveFaqs` / static loader → visible FAQ + `FAQPage` JSON-LD (AD-08, single object) | Travel-guide + why-jvto migrated FAQs. |

### llm-wiki-produced bundles (synced into `src/data/*`)

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| Trust bundle | `src/data/trust-bundle/{claims,faq,aeo-snippets,people,_manifest}.json` + `schema/` | public-knowledge | `src/lib/trust-bundle.ts` → `(website)/trust/page.tsx`; `src/lib/llms-txt.ts` → `/llms.txt`; `src/lib/cms/entityRegistry.ts`; `src/lib/registry/pages.ts` | Synced (`sync:trust`), CI drift-gated. Legacy-producer path; retire after `/trust`+`/llms.txt` cut to `content/` (Milestone 2 / §15 "trust… public-content consumers"). |
| Policy bundle | `src/data/policy-bundle/{policy-bundle,customer-copy,decision-matrix,consumer-bundles,deprecated-wording-report,gap-report}.json` | public-knowledge | `src/lib/policy-bundle.ts` (`getCustomerCopy`/`getPolicyNotes`/`getPolicyEvidenceText`) → `src/lib/schemas/buildPolicySchemas.ts` (SpecialAnnouncement node) | `sync:policy-bundle` (env `LLM_WIKI_ROOT`). Policy page body already on `content/`; bundle still feeds one schema node — audit at Milestone 8. |
| ~~Blog~~ | **RETIRED (Package 08, 2026-08-06)** | — | `content/pages/blog/` via the static-content loader → `(website)/blog/page.tsx` + `[slug]/page.tsx` + `blog/sitemap.data.ts` | Relocated to `content/pages/blog/` (Git-SSOT); `sync:blog` + `src/data/blog` + `src/lib/blog.ts` deleted. No longer a synced producer artifact. |

### OKF-produced bundle + agent guides

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| OKF customer-sales bundle | `src/data/okf/{general-modules,package-profiles,policy-cards,_manifest}.json` | public-knowledge | `src/lib/content/agentGuides.ts` (curated from `general-modules.json`) | `sync:okf`, CI drift + `validate:okf` (route-coverage/divergence). `_manifest.json` surfaces `customer_traffic_ready:false`. |
| `AGENT_GUIDES` | `src/lib/content/agentGuides.ts` | public-knowledge | 13 travel-guide Path B folder pages (`what-is-included`, `private-tour`, `how-booking-works`, `payment-and-deposit`, … `(website)/travel-guide/*/page.tsx`) | Body source for Path B; `getContentPage` used for SEO only. Decouple to `content/` at Milestone 2 (owner check: other OKF consumers first). |

### CMS seed (jvto_cms editorial export)

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| CMS seed pages/sections | `src/data/cms/{pages.json,page_sections.json}` | legacy | `src/lib/cms/seedResolver.ts` (`SEED_COVERED_ROUTES`) → `getPublicPageSnapshot` → non-migrated seed routes | §15 "CMS seed public pages/sections". Frozen+row-deleted for the 16 migrated routes (Package 05c); still active reader for non-migrated seed routes (homepage, `/markets/*`, `/isic/*`). |
| CMS seed aux | `src/data/cms/{entities.json,governance_facts.json,redirects.json,_manifest.json}` | legacy | `seedResolver.ts` / redirect map | Same seed plane; retire with `sync:cms-seed` at Milestone 8. |

### Manual public-narrative snapshots + generated offline snapshots

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| Manual page-narrative snapshots | `src/lib/publicContent/pageSnapshots.ts` (`manualPageSnapshots`) | legacy | `getPublicPageSnapshot.ts` (merged under seed) | §15 "manual page snapshots" + "public narrative". Fallback for non-seed routes (`/`, `/markets/*`, `/isic/*`, `/blog`); superseded for migrated routes by the Package 05c runtime guard. |
| FAQ-manager snapshot | `src/lib/publicContent/generated/faqSnapshots.json` (via `faqSnapshot.ts`) | generated-output | `(website)/travel-guide/faq/page.tsx` (`getPublicFaqCategories`) | DB `category_faqs`/`faqs` projection; legacy-candidate — `/travel-guide/faq` migration blocker (Milestone 2). |
| Package catalog snapshots | `src/lib/publicContent/generated/{packageDetailSnapshots,packageListSnapshot,packageActivitySnapshots}.json` | generated-output | `packageDetailSnapshot.ts` / `packageListSnapshot.ts` (build-time SSG fallback for DB packages) | Offline projection of DB `packages` (transactional-state authority). Stays while catalog is DB-owned (AD-02); do **not** treat as authority (P-05). |
| Destination catalog snapshots | `src/lib/publicContent/generated/{destinationDetailSnapshots,destinationListSnapshot}.json` | generated-output | `destinationDetailSnapshot.ts` / `destinationListSnapshot.ts` | Offline projection of DB `destinations`. |
| Review snapshots | `src/lib/publicContent/generated/{homeReviewSnapshots,reviewApiSnapshots}.json` | generated-output | `reviewSnapshot.ts` / `reviewApiSnapshot.ts` (homepage + review API SSG fallback) | Projection of DB reviews; regenerate via `scripts/export-public-review-api-snapshots.mjs` (needs `DATABASE_URL`). `stats` block canonical; `feed` array (153) legitimately smaller than `stats.total`. |

### Database-resident content

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| `content_pages` | `prisma/schema.prisma:1005` (DB table) | legacy | `src/lib/content/getPageSeo.ts`, `getPublicPageSnapshot` DB fallback, CMS admin write API (the dead `src/lib/ssot/getContentPage.ts` was deleted in Package 09) | §15 "content_pages public narrative reads/writes". Write-blocked for migrated routes (`src/lib/static-content/migratedRoutes.ts`); table drop = Milestone 8, owner-gated (AD-10). Still supplies SEO override for non-migrated routes. |
| `narrative_claims` | `prisma/schema.prisma:1939` (DB table) | legacy | `src/lib/queries/narrativeClaims.ts` → `resolveFaqs.ts`, `buildWhyJvtoSchemas.ts`, `buildTravelGuideSchemas.ts`, `buildPolicySchemas.ts`, `buildTourSchemas.ts` | DB-owned public narrative (P-02 says Git-owned). Hub claims already exported to `content/entities/narrative-claims.json` (Package 05c); DB stays authoritative for non-migrated routes' FAQ + tour `[slug]` families until those cut over. |

### Manually maintained / generated public outputs

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| `llms-full.txt` | `public/llms-full.txt` | legacy | Served static at `/llms-full.txt` (AI crawlers) | Hand-authored static file (llm-wiki notes: NOT script-generated/synced). §15 "manually maintained public knowledge outputs"; should become a generated projection (P-05) at Milestone 2. |
| `/llms.txt` | `src/app/llms.txt/route.ts` + `src/lib/llms-txt.ts` | generated-output | Route handler (build-static) from trust bundle | Already generated (replaced the former static `public/llms.txt`); regenerates on each trust-bundle sync. |
| Sitemap | `src/app/sitemap.ts` + `sitemap.data.ts` + per-cluster `*/sitemap.data.ts` + `sitemap-utils.ts` | generated-output | `/sitemap.xml` | Route lists hardcoded per cluster; `content_pages` supplies only `lastModified` fallback (removed at Milestone 2). |
| Robots | `src/app/robots.ts` | generated-output | `/robots.txt` (dynamic route, not `public/robots.txt`) | Per-box crawler policy keyed on `isIndexableDeployment()`; preview = noindex. |
| Public knowledge feed | `/knowledge/jvto.json` | generated-output (target) | — | **Not yet implemented** (no route in tree). AD-09 convenience feed; Milestone 2 target — versioned projection with `sourceCommit`, never an authority (handoff §9.5). |

### Operational-intelligence (retained per §15 caveat) + evidence

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| Itinerary intelligence | `src/data/itinerary-core/{activities-master,destinations-master,package-route-map}.json` | operational-intelligence | `src/lib/itineraryIntelligence.ts`, `src/lib/schemas/buildDestinationsSchemas.ts`, `src/lib/cms/entityRegistry.ts` | §15 caveat: NOT auto-legacy — declared authority + controlled interface (`sync:itinerary`, `scripts/validate-itinerary-intelligence.mjs`, `sync-itinerary-core.yml`). Domain matrix "Itinerary intelligence". |
| Package readiness | `src/data/package-readiness/{package-registry,package-pricing,package-itineraries,booking-compatibility,gap-report,_manifest}.json` | operational-intelligence | `src/lib/package-readiness.ts`, `(cms)/cms/consolidation/page.tsx` | §15 caveat: NOT auto-legacy — `sync:packages`, `validate:packages`. Operational/commercial-readiness signal; not a public price authority (pricing = DB, AD-02). |
| Volcanic status | `public/ops/volcanic-status.json` (writer `scripts/update-volcanic-status.mjs`) | operational-intelligence | Served at `/ops/volcanic-status.json`; bot workflow `update-volcanic-status.yml` | Public operational status (AD-02: operational status is dynamic). Bot commits to `main` **and** `live` (sole data-only `live` exception, `docs/CONTRIBUTING.md` §2.2). |
| Evidence registry | `src/data/evidenceRegistry.ts` | public-knowledge | Verify pages / schema builders | jvto-web-native, hand-editable evidence metadata (public proof only; raw evidence stays upstream/protected — handoff P-08, data-class Restricted §13.1). |
| Entity graph / SSOT constants | `src/lib/schemas/entityGraph.ts`; `src/lib/Master_Dataset_JVTO.SSOT.v3.0.json` | public-knowledge | `entityGraph.ts` → global `@id` registry + `DEFINED_TERMS`; `Master_Dataset…json` → `(website)/verify-jvto/page.tsx` | §15 "duplicated schema constants" / "public narrative in TSX". Org block + verify narrative migrate to `content/entities` at Milestone 2 (then legacy). Master SSOT still carried `founding_date:"2016-01-01"` — guarded by `wrong-founding-year` drift rule. |

### Transactional-state (DB/provider — authority, never public/AI)

| Artifact | Path | Class | Current consumers | Note |
|---|---|---|---|---|
| Packages / prices / availability | `prisma/schema.prisma` (`packages`, pricing, add-ons, hotels) | transactional-state | `src/lib/packages/getWebPackage*.ts`, checkout/booking | AD-02, P-03. Public read models compose narrative from Knowledge Core; internal cost/margin never enters public/AI envelope. |
| Bookings / payments / customers | `prisma/schema.prisma` (booking, payment, customer, crew assignment) | transactional-state | Booking flow, Xendit webhook, customer dashboard | P-03/P-04. Immutable agreement snapshots are the Milestone 4 target. |
| Destinations / crew params | `prisma/schema.prisma` (`destinations`, `crew_members`) | transactional-state | `destinations/[slug]`, `team/[slug]` route params; `getActiveCrewMembers()` | Params stay DB (Milestone 2 migrates only static narrative). `crew_members.kta_id` backfilled 11/14. |
