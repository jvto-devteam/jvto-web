---
paths:
  - "src/lib/schemas/**"
  - "src/lib/ecosystemContent/**"
  - "src/components/seo/**"
  - "src/lib/*Faqs.ts"
---

# Schema Layer, Content Layer & Schema Builders

> Moved out of the always-loaded root `CLAUDE.md` on 2026-08-31 — this only needs to be
> in context when you're touching schema builders, the ekosistem content-reader layer, or
> `PageJsonLdCombined`. The one rule from this area that matters everywhere else — never
> add a Prisma query for content — stays in the root file's "Where data comes from" section.

## Architecture: Schema Layer (post-port)

The AEO/GEO schema architecture is the most important addition from the port. Every public page emits structured JSON-LD that maximizes AI search (AEO) signal density via cross-referenced entity graph.

### Master Entity Graph: `src/lib/schemas/entityGraph.ts`

All entities have stable `@id` so any page can cross-reference via `{ '@id': ... }` instead of re-inlining.

> 🔴 **CORRECTED 2026-09-09.** Every row below used to read
> `(website)/layout.tsx` (global) in the "Where injected" column. **That injection
> point does not exist and never did** — `src/app/(website)/layout.tsx` contains no
> JSON-LD at all. Builders across `verify-jvto`, `why-jvto`, `policy` and both tour
> PDPs emitted `{"@id": …}` references trusting this table. Measured on the live
> sitemap 2026-09-09: **21 routes** dangled `#agung-sambuko`, **20** dangled a
> `#term-*`, **1** dangled the doctor. Only `/` defined the terms; only `/` and
> `/verify-jvto` defined the founder. Tracked as `T04_FIX_DANGLING_FOUNDER_REFS`.

| Export | `@id` | Where injected |
|---|---|---|
| `ORGANIZATION_SCHEMA` | `/#organization` | Per-page via `PageJsonLdCombined` |
| `buildFounderSchema()` | `/#agung-sambuko` | `/` + `/verify-jvto` explicitly; elsewhere **on reference**, via `resolveGlobalEntityNodes()` |
| `buildDoctorSchema()` | `/#dr-ahmad-irwandanu` | `/` + `/verify-jvto` explicitly; elsewhere **on reference** |
| `buildBbksdaRegulationSchema()` | **none — the node carries no `@id`** | `/` + `/verify-jvto/legal` explicitly. Cannot be referenced or resolved |
| `DEFINED_TERM_IDS.*` → `buildDefinedTerms()` (×11) | `/#term-{key}` | `/` explicitly; elsewhere **on reference**. `JVTO_TRAVEL_CREDIT` + `JVTO_FOC_SCHEME` are **brand-custom** |
| `buildCrewPersonSchema()` | `/#crew-{code}` | `/why-jvto/our-team` (per active crew) |

**"On reference" is the mechanism, and it is the only one.** `resolveGlobalEntityNodes()`
(`src/lib/schemas/globalEntityNodes.ts`) scans an assembled graph for objects carrying
`@id` and no key outside `{"@id","@type"}`, and appends the definitions for any global id
that is referenced but undefined. It is called from `PageJsonLdCombined` (both branches)
and from the two tour PDPs, which bypass that component. Nothing is injected on a page
that does not reference it, and appending to a page that already defines it is a no-op —
both assemblers dedupe by `@id`, first-occurrence-wins.

Its reference rule must stay identical to the audit's in
`jvto-ekosistem/scripts/lib/extract-jsonld-nodes.mjs`. If the fix and the check disagree
about what a reference is, `npm run audit:website-live` proves nothing.

`DEFINED_TERMS` currently holds **11** keys (9 credential/regulatory + 2 brand-custom).
`npm run test:stale` asserts that count — update the test when the set legitimately grows.

When adding new credentials/terms: add to `DEFINED_TERM_IDS` + `buildDefinedTerms()` AND to `@id Registry` in `~/.claude/projects/f--jvto-web/memory/cluster_role_contracts.md`. Don't inline schema in pages. A new id is resolved automatically once it is in `GLOBAL_ENTITY_IDS`.

### Per-cluster Schema Builders + Canonical Q&A

| Cluster | Schema builders | Canonical Q&A |
|---|---|---|
| Tour detail | `src/lib/schemas/buildTourSchemas.ts` | **ekosistem** `5-experience-engine/knowledge-feed/tour-spine-faq.feed-output.json` via `getEcosystemTourSpineFaq()`, assembled by `src/lib/tourFaqResolution.ts`. `getTourSpineQaPairs` was deleted by T05B (2026-09-11) |
| Tours hub | `src/lib/schemas/buildToursHubSchemas.ts` | `src/lib/tourFaqs.ts` (`getToursHubQaPairs`) |
| Verify-JVTO | `src/lib/schemas/buildVerifySchemas.ts` | `src/lib/verifyFaqs.ts` (`LEGAL_FAQS`, `POLICE_SAFETY_FAQS`, `PRESS_RECOGNITION_FAQS`, `VERIFY_HUB_FAQS`) |
| Why-JVTO | **tidak ada builder lokal** — kesembilan `page.tsx` cluster ini menyuntik lewat `PageJsonLdCombined` (ekosistem). `buildWhyJvtoSchemas.ts` dihapus 2026-09-02: nol importer | ekosistem `why-jvto/*.source.json` + individual `@type:Review` nodes on `/reviews` |
| Travel-guide | `src/lib/schemas/buildTravelGuideSchemas.ts` | ekosistem `travel-guide/*.source.json` |
| Policy | `src/lib/schemas/buildPolicySchemas.ts` | ekosistem `policies/*` |
| Destinations | `src/lib/schemas/buildDestinationsSchemas.ts` | `getEcosystemDestinationDetail()` |

> The "DB `narrative_claims`" / "DB `schema_json`" entries this table used to carry were
> corrected on 2026-08-28. Those Prisma models no longer exist — the schema was pruned to
> 6 models and nothing in `src/` imports them. Everything reads its own ekosistem source file.
>
> ⚠️ **`getEcosystemNarrativeClaims()` currently has ZERO callers** (verified 2026-09-11).
> The two tour-detail pages were its last consumers and stopped calling it in T05B: their
> FAQPage used to emit narrative-claim **pillars** as `Question.name`, which are taxonomy
> labels, not questions, and had no counterpart on the rendered page. The reader is kept —
> the 26 claims are still canonical content and a future page may want them — but do not
> read this table as evidence that something consumes it today. Tracked as
> `NARRATIVE_CLAIMS_READER_ORPHANED`.

**Rule:** edit Q&A copy → in `jvto-ekosistem`. (`src/lib/*Faqs.ts` still holds hand-written pairs for the /tours hub and verify-jvto; tour **detail** left that pattern in T05B.) Edit schema fields → only `src/lib/schemas/build*.ts`. Never add a Prisma query for content.

`src/lib/queries/schemaReviews.ts` feeds `buildIndividualReviewSchemas()`; individual `@type:Review` schema is live on `/why-jvto/reviews`. Despite living under `queries/`, it is **not** a Prisma query — it was `prisma.reviews.findMany` until 2026-08-19 and now filters and sorts in application code over `getEcosystemReviews()`, keeping the same return shape.

### Content Layer (ekosistem-content) — replaces the retired FAQ resolver

> The former "FAQ Source Resolver (CRITICAL)" section documented
> `resolveFaqsForPage()`, `CANONICAL_FAQ_REGISTRY`, and DB-`narrative_claims`
> precedence. Those were **retired 2026-08-18**. Do not reintroduce that pattern.
>
> ⚠️ The file `src/lib/content/resolveFaqs.ts` itself **survives — do not delete it**.
> It still exports `buildResolvedFaqSchema()`, which formats an already-resolved
> `{source, faqs}` object into a FAQPage node. Live importers:
> `markets/malaysia/page.tsx:6,46`, `markets/singapore/page.tsx:6,46`; also referenced
> by `components/seo/PageJsonLdCombined.tsx:130`. The retirement removed a function,
> not the module. Verified 2026-09-02.

**Single source of truth**: the `jvto-ekosistem` repo.

- Local checkout first (`../jvto-ekosistem`, overridable via `JVTO_EKOSYSTEM_CONTENT_ROOT`)
- HTTP fallback to `ekosistem.javavolcano-touroperator.com/api/file`
- **No live sync** between Prisma and the ekosistem files, by design — edits go into
  the ekosistem source, not into this repo

**Reader layer**: `src/lib/ecosystemContent/*` (18 files as of 2026-08-28).

| File | Reads |
|---|---|
| `narrativeClaims.ts` | 26 claims — C1–C9 + POL-BPC-01..11 + POL-IE-01..06 |
| `externalEntities.ts` | external organisation/entity records |
| `people.ts` | crew roster |
| `reviewPlatforms.ts` | per-platform rating data |
| `tourPackageDetail.ts` / `destinationDetail.ts` | package + destination editorial |
| `staticPageAdapter.ts` | generic page content adapter |

**These are fetchers, not data.** Grepping `narrativeClaims.ts` to count claims will
always be wrong — the claims live in
`../jvto-ekosistem/1-knowledge-and-evidence-core/narrative-claims/narrative-claims.json`.

**Architecture note**: FAQ pages, policy pages, and `llms.txt` are thin wrappers around
`EcosystemTravelGuidePage` / `PolicyEcosystemPage` / `getEcosystemLlmsTxt()`.

### `PageJsonLdCombined` Component

`src/components/seo/PageJsonLdCombined.tsx` is the standard schema injection component for all `(website)/*` pages. It auto-injects: Organization + WebSite + WebPage + BreadcrumbList + (optional) CMS-FAQ + page extras passed via `extraSchemas`.

Accepts:
- `pageRow` — page SEO + FAQ, sourced from ekosistem (was a `content_pages` DB row before the 2026-08-18 migration)
- `extraSchemas` — per-page schema nodes
- `suppressCmsFaq` — opt-out for CMS FAQ when canonical takes over (Phase 5 addition)
