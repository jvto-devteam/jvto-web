# Public Content Migration Status (ledger)

> Regenerate the raw signal table anytime with:
> `npx tsx scripts/static-content/audit-current-sources.ts`
> Status values: `pending` → `extracted` → `cutover` → `verified` → `retired`.
> Audited at baseline `a7892e66` (2026-08-04). See
> [public-content-ownership.md](public-content-ownership.md) for the resolution model.

## Policy (Package 03)

| route | currentPageFile | currentEffectiveSource | currentShape | targetFormat | specialSchema | faqSource | pkg | status | blocker |
|---|---|---|---|---|---|---|---|---|---|
| /policy | `policy/page.tsx` | cms-seed/snapshot | body_md | markdown | hub ItemList | resolver (cms-seed tier) | 03 | pending | none |
| /policy/booking-payment-cancellation | `policy/[slug]/page.tsx` | **policy-bundle** (binding copy; snapshot body skipped) | mixed (bundle blocks + tsx) | markdown | PolicyWebPage + SpecialAnnouncement (`buildPolicySchemas.ts`) | canonical `POLICY_BOOKING_CANCELLATION_FAQS` (built from policy-bundle) | 03 | pending | consolidate bundle wording into one file — do not leave dual owner |
| /policy/inclusions-exclusions | `policy/[slug]/page.tsx` | cms-seed/snapshot | body_md | markdown | PolicyWebPage | resolver | 03 | pending | none |
| /policy/privacy | `policy/[slug]/page.tsx` | cms-seed/snapshot | body_md | markdown | PolicyWebPage | resolver | 03 | pending | none |

## Travel Guide (Package 04) — DUAL PATH

**Path A — `[slug]` dynamic (snapshot chain, `body_md` → `MarkdownRendererTravelGuide`):**

| route | currentEffectiveSource | targetFormat | specialSchema | pkg | status | blocker |
|---|---|---|---|---|---|---|
| /travel-guide (hub) | cms-seed/snapshot | markdown | — | 04 | pending | none |
| /travel-guide/[slug] snapshot routes (booking-information, ijen-health-screening, safety-on-tours, packing-and-fitness, weather-and-closures, …) | cms-seed/snapshot | markdown | **ijen-health-screening: `MedicalWebPage` + `HowTo` (`buildTravelGuideSchemas.ts:73,102`)** — also fix dangling `reviewedBy` doctor `@id` | 04 | pending | none |
| /travel-guide/faq | `travel-guide/faq/page.tsx` (folder) | markdown + faqKey | FAQPage | 04 | pending | none |
| /travel-guide/rijik-monthly-closure | folder page, resolver FAQ only | markdown | — | 04 | pending | none |
| /travel-guide/best-time-to-visit | folder page, resolver FAQ only (no DB row exists) | markdown | — | 04 | pending | content needed (pre-existing open item) |
| /travel-guide/police-escort-for-groups | folder page: `getContentPage` (SEO) + hand-rolled body | markdown | — | 04 | pending | none |

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
| /why-jvto (hub) | snapshot + bespoke TSX modules | hardcoded + narrative_claims | structured-json + entities | hub ItemList + narrative claims ItemList | 05 | pending | none |
| /why-jvto/[slug] (our-story, the-jvto-difference, our-team, community-standards) | snapshot/seed, DB-preferred at runtime (`prefersDbForSlug()`≡true) | sections/blocks (`BlocksRenderer`: markdown, image, grid, crew_grid; `sectionId`-keyed Timeline/ReviewLinks specials) | structured-json | — | 05 | pending | preserve `sectionId` constants `timeline-highlights-artifact-backed`, `where-to-check-reviews-official-links` |
| /why-jvto/reviews | same + Prisma reviews (schema only) | sections + dynamic | structured-json + DB reviews (stays) | individual `Review` + `AggregateRating` (`buildWhyJvtoSchemas.ts:96,153`) | 05 | pending | **close AD-08 gap:** visible FAQ uses `content.faq` while JSON-LD uses resolved source |
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

## Cross-cutting facts (Package 02 — entities)

| entity | current duplicated locations (examples) | blocker |
|---|---|---|
| organization (legal name, NIB, AHU, address, contacts) | `entityGraph.ts`, `site-config.ts`, CMS seed, verify pages | copy `docs/CANONICAL_FACTS.md` values only; no incorporation year (owner decision 2026-08-03) |
| review-platforms (4.8/51 TP · 4.9/123 G · 4.95/21 TA · 195 total) | `jvtoReviews.ts` (`AGGREGATE_RATING`, `REVIEW_PLATFORMS`), `reviewStats.canonical.json` | must carry `verifiedAt`; values locked by facts lock |
| people (founder, Dr. Ahmad Irwandanu SIP/STR) | `entityGraph.ts` FOUNDER/DOCTOR schema, team pages | keep claim boundaries (SIP/STR evidenced wording) |
| credentials (NIB/TDUP/HPWKI/KTA/POLPAR/BBKSDA/SE1658/ISIC/INDECON) | `DEFINED_TERMS` in `entityGraph.ts` | ISIC = "registered provider" (not "verified partner") |

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
| 00 | audit + this ledger | **done (this PR)** |
| 01 | loader + validation gates + drift-scan extension | **done (this PR)** |
| 02–11 | per blueprint | pending, one PR each |
