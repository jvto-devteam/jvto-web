# Package 1 Audit — Schema Spine

Produced 2026-06-12 on `feat/schema-spine` (main @ 205172f0). Read-only audit by three
parallel subagents (schema-auditor/haiku, route-canonical-auditor/sonnet,
trust-bundle-auditor/sonnet), consolidated and spot-checked. No code was edited.

Assumptions documented inline. One agent claim was corrected during consolidation:
`/travel-guide/faq` duplication is **×2** per node type, not ×3 as first reported
(verified at `src/app/(website)/travel-guide/faq/page.tsx:99-149`).

---

## 1. JSON-LD emitters per route (schema-auditor)

Emitter layers:
- `src/lib/seo/jsonld/builders.ts` — BreadcrumbList, TravelAgency (Organization), WebSite, WebPage, FAQPage (from CMS `content.faq`), CollectionPage, dynamic `schemaType`.
- `src/lib/schemas/build*Schemas.ts` (×9) + `entityGraph.ts` — per-cluster nodes (TouristTrip, HowTo, DigitalDocument, Review, Person ×14 crew, DefinedTerm ×11, etc.).
- `PageJsonLdCombined` auto-injects on every use: Organization + WebSite + WebPage + BreadcrumbList + content-page extras + CMS FAQPage **unless** `suppressCmsFaq` (default `false`).
- `(website)/layout.tsx`: no hardcoded global graph found by the auditor (contradicts CLAUDE.md's description of global Founder/Doctor/DefinedTerm injection — verify before relying on either).

| Route | Mechanism | Page-level @type nodes | >1 Org/Breadcrumb/FAQPage? | suppressCmsFaq |
|---|---|---|---|---|
| / | PageJsonLdCombined + extras | Service, WebApplication, AggregateRating | No | Yes |
| /blog | PageJsonLdCombined | auto-inject only | No | No |
| /blog/[slug] | PageJsonLdCombined + extras | (extras unverified) | Unknown | No |
| /contact | PageJsonLdCombined | auto-inject only | No | No |
| /destinations | inline JsonLd | CollectionPage, TouristAttraction ×5, ItemList | No | n/a |
| /destinations/[slug] | inline JsonLd | TouristAttraction, ItemList, WebPage | No | n/a |
| /isic/student-package | PageJsonLdCombined + extras | (extras unverified) | Unknown | No |
| /policy | PageJsonLdCombined + extras | ItemList, FAQPage | No | Yes |
| /policy/[slug] | PageJsonLdCombined + extras | ItemList, FAQPage, SpecialAnnouncement, WebPage | No | Yes |
| /student-deals/isic | PageJsonLdCombined | auto-inject only | No | No |
| /team | PageJsonLdCombined + extras | ItemList, Person ×14, AggregateRating | No | Yes |
| /team/[slug] | PageJsonLdCombined + extras | Person, Credential, ImageObject | No | Yes |
| /tours | inline JsonLd | CollectionPage, BreadcrumbList, ItemList | No | n/a |
| /tours/from-bali | inline JsonLd | CollectionPage, BreadcrumbList, ItemList | No | n/a |
| /tours/from-bali/[slug] | inline JsonLd | TouristTrip, WebPage, BreadcrumbList, Product, AggregateOffer, AggregateRating | No | n/a |
| /tours/from-surabaya | inline JsonLd | CollectionPage, BreadcrumbList, ItemList | No | n/a |
| /tours/from-surabaya/[slug] | inline JsonLd | TouristTrip, WebPage, BreadcrumbList, Product, AggregateOffer, AggregateRating | No | n/a |
| /tours/student-package/[slug] | inline JsonLd | TouristTrip, WebPage, BreadcrumbList, Product, AggregateOffer | No | n/a |
| /travel-guide | PageJsonLdCombined + extras | ItemList, FAQPage | No | Yes |
| **/travel-guide/faq** | PageJsonLdCombined + extras | **FAQPage ×2, BreadcrumbList ×2, WebPage ×2** | **YES** | **No** |
| /travel-guide/best-time-to-visit | PageJsonLdCombined + extras | FAQPage, WebPage | No | Yes |
| /travel-guide/police-escort-for-groups | PageJsonLdCombined + extras | FAQPage, WebPage | No | Yes |
| /travel-guide/[slug] | PageJsonLdCombined + extras | FAQPage, WebPage | No | Yes |
| /trust | PageJsonLdCombined + extras | (extras unverified) | Unknown | Yes |
| /verify-jvto | PageJsonLdCombined + extras | DigitalDocument ×3, FAQPage, WebPage | No | Yes |
| /verify-jvto/legal | PageJsonLdCombined + extras | DigitalDocument ×3, FAQPage, WebPage | No | Yes |
| /verify-jvto/police-safety | PageJsonLdCombined + extras | DigitalDocument ×2, FAQPage, WebPage | No | Yes |
| /verify-jvto/press-recognition | PageJsonLdCombined + extras | Book, NewsArticle ×2, Award, FAQPage, WebPage | No | Yes |
| /verify-jvto/history-artifacts | PageJsonLdCombined + extras | ImageObject, Book, FAQPage, WebPage | No | Yes |
| /why-jvto | PageJsonLdCombined | auto-inject only (`whyJVTOSchema` defined at page.tsx:179-322 but **never passed** — dead code) | No | No |
| /why-jvto/[slug] | PageJsonLdCombined + extras | ItemList, FAQPage, Review ×n | No | No |
| /why-jvto/reviews/[id] | inline JsonLd | WebPage, Product, Review, AggregateRating | No | n/a |

### Double-emitter suspects: verdict

| Route | Verdict | Evidence | suppressCmsFaq |
|---|---|---|---|
| /travel-guide/faq | **CONFIRMED** — FAQPage, BreadcrumbList, WebPage each emitted twice (inline `@graph` in extraSchemas + PageJsonLdCombined auto-inject) | `travel-guide/faq/page.tsx:99` (`@graph`), `:101` (FAQPage), `:121` (BreadcrumbList), `:149` (no suppressCmsFaq prop) — spot-checked | No (default false) |
| /verify-jvto | Refuted — suppression correctly applied | `verify-jvto/page.tsx:284` extras + suppressCmsFaq=true | Yes |
| /why-jvto | Refuted — but `whyJVTOSchema` (page.tsx:179-322) is dead code, never rendered | page.tsx:714 passes no extras | No (harmless today; latent risk if wired up without suppression) |
| /travel-guide | Refuted — suppression correctly applied | `travel-guide/page.tsx:256-258` | Yes |

**Biggest risk:** `/travel-guide/faq` — the site's dedicated FAQ page — emits two competing FAQPage nodes (hand-rolled inline `@graph` + CMS auto-inject) and double BreadcrumbList/WebPage, the exact failure mode the resolveFaqs precedence system was built to prevent; it bypasses `resolveFaqsForPage` entirely.

---

## 2. Routes vs redirects (route-canonical-auditor)

Auditor assumptions: `why-jvto/[slug]`, `travel-guide/[slug]`, `policy/[slug]` slugs are
snapshot-driven (`pageSnapshots.ts`, `dynamicParams=false`); `page copy.tsx` files do not
register routes. Redirect layers in precedence order: `next.config.ts redirects()` →
`middleware.ts` (goneUrls 410 at line ~174, redirectMap at ~214, prefix rules) →
filesystem router.

### Slug-shape variants — the core finding

| Variant path | Status | Notes |
|---|---|---|
| /tour-from-bali | **Live route** | competes with the two below |
| /tours-from-bali | **Live route** | competes |
| /tours/from-bali | **Live route** | canonical per CLAUDE.md |
| /tour-from-surabaya | **Live route** | competes |
| /tours-from-surabaya | **Live route** | competes |
| /tours/from-surabaya | **Live route** | canonical per CLAUDE.md |
| /isic/student-package | **Live route** | canonical |
| /student-deals/isic | Live page.tsx **but unreachable** | next.config redirect → /isic/student-package fires first → dead code |
| /student-package | Redirect source + 410 conflict | next.config 301 wins over middleware goneUrls 410 — contradictory intent |
| /tours/student-package/[slug] | Live route | no index page for /tours/student-package |

**Three live, un-redirected pages exist per departure city** (`/tour-from-X`,
`/tours-from-X`, `/tours/from-X`) with no redirects between them.

### Redirect conflicts and dead code

| Source | Configured behavior | Conflict |
|---|---|---|
| /blog | next.config 301 → /travel-guide | `(website)/blog/page.tsx` **exists but is unreachable** (and /blog/[slug] children remain live — inconsistent cluster) |
| /student-deals/isic | next.config 301 → /isic/student-package | live page.tsx unreachable; also duplicated in middleware redirectMap (never reached) |
| /all-inclusive | next.config 301 → /policy/inclusions-exclusions | also in middleware goneUrls (410) — 301 wins, 410 intent dead |
| /student-package | next.config 301 | also in goneUrls — 301 wins |
| /custom-package | next.config 301 → /tours | also in goneUrls — 301 wins |
| /tours/4-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya | middleware redirectMap 301 | **also in goneUrls, which runs first → URL returns 410, redirect is dead code** |
| /reviews, /about, /faq, /office, /how-to-book | next.config 301 | duplicated verbatim in middleware redirectMap (dead duplicates, drift hazard) |

No multi-hop redirect chains found. `/why-jvto/proof-transparency/*` legacy paths all
redirect correctly. Rewrite: `/api/octo/:path*` → legacy domain proxy (intentional).

**Biggest risk:** three competing live pages per departure city ("tours from Bali" ×3, "tours from Surabaya" ×3) with zero redirects between them split crawl authority and ranking signals — while `/blog` and `/student-deals/isic` page.tsx files are silently dead behind next.config redirects.

---

## 3. Trust-bundle sync vs llm-wiki (trust-bundle-auditor)

`scripts/sync-trust-bundle.mjs`: pure `copyFileSync` allowlist, gated on `_manifest.json`
F1–F8 all passing. Default wiki path is Windows-absolute (`E:/Users/JAVA VOLCANO/llm-wiki`)
— `LLM_WIKI_PATH` env var required on this macOS machine or the script exits.

### Allowlist coverage

| llm-wiki source (output/website/trust-bundle/) | jvto-web destination | in sync? |
|---|---|---|
| _manifest.json | src/data/trust-bundle/_manifest.json | YES (compiled_at 2026-06-10, F1–F8 pass) |
| claims.json | src/data/trust-bundle/claims.json | YES |
| faq.json | src/data/trust-bundle/faq.json | YES |
| aeo-snippets.json | src/data/trust-bundle/aeo-snippets.json | YES |
| schema/organization.json | src/data/trust-bundle/schema/organization.json | YES |
| schema/faq-page.json | src/data/trust-bundle/schema/faq-page.json | YES |
| schema/tourist-trip.json | src/data/trust-bundle/schema/tourist-trip.json | YES |
| **destinations.json** | — | **never synced** (site uses DB + hardcodes) |
| **people.json** | — | **never synced** (founder/doctor/14-crew roster + KTA statuses) |
| **policies.json** | — | **never synced** (policy copy hardcoded across pages + src/data.ts) |
| **operational.json** | — | **never synced** (temps, travel times, 23 partner hotels, closures) |
| **products.json** | — | **never synced** (site uses DB) |
| extended-bundle-receipt.md | — | not synced (informational; likely intentional) |

Auditor assumption: the five entity JSONs look intentionally excluded (site consumes DB),
but they are canonical and the hardcoded site values have drifted — see below.

### Hardcoded entity divergence

| Entity | Field | llm-wiki canonical | jvto-web hardcoded | Site location |
|---|---|---|---|---|
| Kawah Ijen | Elevation (homepage volcano status) | 2,386 m (crater rim) | **2,769 m** (uncited; data.ts:490 has 2,799 m summit) | `HomeVolcanoStatus.tsx:18` |
| Crew / guides | KTA status | 11 confirmed, **3 pending** (yusuf/dika/pras) | "All guides hold KTA 2024" | `tours/from-surabaya/page.tsx:72`, `tours/from-bali/page.tsx:73` |
| Dr. Ahmad Irwandanu | schema `@id` | `/#dr-ahmad-irwandanu` | `/#doctor-ahmad-irwandanu` (breaks @id cross-links) | `verify-jvto/page.tsx:175,373,415` |
| Stefan Loose guidebook | First-mention year | CONF-001 **open** (2016 vs 2018); trust-bundle uses datePublished 2018-07-05 | "2016" published as resolved fact | `verify-jvto/history-artifacts/page.tsx:75,154`; `pageSnapshots.ts:329` |
| Booking.com award | Second award (2016, 9.2/10) | **no such award in wiki** (only 2015, 9.4/10) | "Guest Review Award 2016 (9.2/10 – Homestay Era)" | `verify-jvto/page.tsx:620` |
| Dr. Ahmad Irwandanu | Role label | "Licensed Medical Doctor (SIP-credentialed)" | "Licensed General Practitioner" | `entityGraph.ts:288` |
| Organization | foundingDate | SSOT records 2016-01-01; wiki log resolved → '2015' per CLAUDE.md | '2015' (consistent with decision log; SSOT conflict still open) | `entityGraph.ts:35` |

**Biggest risk:** "All guides hold KTA 2024" on both commercial tour-hub pages contradicts canonical people.json (11 confirmed, 3 pending) — a verifiable trust claim stated falsely on the pages where the brand's whole premise is verifiability, with legal/reputational exposure.

---

## Consolidated top risks (ranked)

1. **False trust claim**: blanket "All guides hold KTA 2024" vs canonical 11/14 confirmed (§3).
2. **Canonical-route dilution**: 3 live competing hub pages per departure city, no redirects (§2).
3. **Double FAQPage/Breadcrumb/WebPage on /travel-guide/faq**, bypassing the resolveFaqs system (§1).
4. **@id drift**: `/#doctor-ahmad-irwandanu` vs `/#dr-ahmad-irwandanu` severs entity-graph cross-references on /verify-jvto (§3).
5. **Unverified facts published as resolved**: Stefan Loose "2016", Booking.com "2016 award", Ijen 2,769 m — none backed by canonical wiki data (§3).
6. **Redirect-layer contradictions**: next.config 301s silently override middleware 410s; goneUrls kills one redirectMap entry; `/blog` + `/student-deals/isic` pages are dead code (§2).
