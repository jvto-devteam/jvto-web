# Authority / Consumer Manifest (Milestone 0 baseline)

> **Generated — do not hand-edit.** Regenerate with `npm run baseline:manifest`; a CI `verify`
> step regenerates and fails on any non-empty `git diff`. Grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](./JVTO_TECHNICAL_PROJECT_HANDOFF.md) §6/§22 — every public
> route and generated surface maps to one authority + its consumers.

**Public routes:** 56  ·  **Generated surfaces:** 6

## Authority distribution (public routes)

- Postgres (DB): **1**
- content/ (Git SSOT): **6**
- legacy: content_pages (DB): **4**
- legacy: snapshot/seed: **17**
- producer: OKF: **13**
- producer: llm-wiki: **2**
- tsx-embedded narrative: **13**

## Public routes

| surface | file | authority | resolvers | consumers |
|---|---|---|---|---|
| `/` | `src/app/(website)/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/blog` | `src/app/(website)/blog/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/blog/[slug]` | `src/app/(website)/blog/[slug]/page.tsx` | tsx-embedded narrative | jsonld | AI/llms, search/schema, sitemap, web |
| `/checkout` | `src/app/(website)/checkout/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/contact` | `src/app/(website)/contact/page.tsx` | legacy: snapshot/seed | snapshot, jsonld | AI/llms, search/schema, sitemap, web |
| `/destinations` | `src/app/(website)/destinations/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/destinations/[slug]` | `src/app/(website)/destinations/[slug]/page.tsx` | legacy: content_pages (DB) | content_pages, jsonld | AI/llms, search/schema, sitemap, web |
| `/isic/student-package` | `src/app/(website)/isic/student-package/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/markets/malaysia` | `src/app/(website)/markets/malaysia/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/markets/singapore` | `src/app/(website)/markets/singapore/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/my-booking` | `src/app/(website)/my-booking/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/my-booking/[slug]` | `src/app/(website)/my-booking/[slug]/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/my-booking/[slug]/bank-transfer` | `src/app/(website)/my-booking/[slug]/bank-transfer/page.tsx` | producer: llm-wiki | policy-bundle | AI/llms, sitemap, web |
| `/policy` | `src/app/(website)/policy/page.tsx` | content/ (Git SSOT) | static-content, jsonld | AI/llms, search/schema, sitemap, web |
| `/policy/[slug]` | `src/app/(website)/policy/[slug]/page.tsx` | content/ (Git SSOT) | static-content, policy-bundle, content_pages, jsonld | AI/llms, search/schema, sitemap, web |
| `/student-deals/isic` | `src/app/(website)/student-deals/isic/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/team` | `src/app/(website)/team/page.tsx` | legacy: content_pages (DB) | getContentPage, jsonld | AI/llms, search/schema, sitemap, web |
| `/team/[slug]` | `src/app/(website)/team/[slug]/page.tsx` | legacy: content_pages (DB) | getContentPage, content_pages, jsonld, prisma | AI/llms, search/schema, sitemap, web |
| `/tour-from-bali` | `src/app/(website)/tour-from-bali/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/tour-from-surabaya` | `src/app/(website)/tour-from-surabaya/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/tours` | `src/app/(website)/tours/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/tours-from-bali` | `src/app/(website)/tours-from-bali/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/tours-from-surabaya` | `src/app/(website)/tours-from-surabaya/page.tsx` | tsx-embedded narrative | tsx-only | AI/llms, sitemap, web |
| `/tours/from-bali` | `src/app/(website)/tours/from-bali/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/tours/from-bali/[slug]` | `src/app/(website)/tours/from-bali/[slug]/page.tsx` | tsx-embedded narrative | jsonld | AI/llms, search/schema, sitemap, web |
| `/tours/from-surabaya` | `src/app/(website)/tours/from-surabaya/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/tours/from-surabaya/[slug]` | `src/app/(website)/tours/from-surabaya/[slug]/page.tsx` | tsx-embedded narrative | jsonld | AI/llms, search/schema, sitemap, web |
| `/tours/student-package/[slug]` | `src/app/(website)/tours/student-package/[slug]/page.tsx` | tsx-embedded narrative | jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide` | `src/app/(website)/travel-guide/page.tsx` | content/ (Git SSOT) | static-content, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/[slug]` | `src/app/(website)/travel-guide/[slug]/page.tsx` | content/ (Git SSOT) | static-content, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/best-time-to-visit` | `src/app/(website)/travel-guide/best-time-to-visit/page.tsx` | tsx-embedded narrative | faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/blue-fire-and-sunrise` | `src/app/(website)/travel-guide/blue-fire-and-sunrise/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/booking-safety` | `src/app/(website)/travel-guide/booking-safety/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/bromo-sunrise` | `src/app/(website)/travel-guide/bromo-sunrise/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/cancellation-travel-credit` | `src/app/(website)/travel-guide/cancellation-travel-credit/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/faq` | `src/app/(website)/travel-guide/faq/page.tsx` | legacy: snapshot/seed | getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/finish-in-bali` | `src/app/(website)/travel-guide/finish-in-bali/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/how-booking-works` | `src/app/(website)/travel-guide/how-booking-works/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/malang-batu` | `src/app/(website)/travel-guide/malang-batu/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/payment-and-deposit` | `src/app/(website)/travel-guide/payment-and-deposit/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/police-escort-for-groups` | `src/app/(website)/travel-guide/police-escort-for-groups/page.tsx` | legacy: content_pages (DB) | getContentPage, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/private-tour` | `src/app/(website)/travel-guide/private-tour/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/rijik-monthly-closure` | `src/app/(website)/travel-guide/rijik-monthly-closure/page.tsx` | tsx-embedded narrative | faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/travel-guide/rooming-and-accommodation` | `src/app/(website)/travel-guide/rooming-and-accommodation/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/vehicle-and-luggage` | `src/app/(website)/travel-guide/vehicle-and-luggage/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/what-is-included` | `src/app/(website)/travel-guide/what-is-included/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/travel-guide/why-stay-near-ijen` | `src/app/(website)/travel-guide/why-stay-near-ijen/page.tsx` | producer: OKF | okf-agent-guides, getContentPage | AI/llms, sitemap, web |
| `/trust` | `src/app/(website)/trust/page.tsx` | producer: llm-wiki | trust-bundle, getPageSeo, jsonld | AI/llms, search/schema, sitemap, web |
| `/verify-jvto` | `src/app/(website)/verify-jvto/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/history-artifacts` | `src/app/(website)/verify-jvto/history-artifacts/page.tsx` | legacy: snapshot/seed | getPageSeo, content_pages, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/legal` | `src/app/(website)/verify-jvto/legal/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/police-safety` | `src/app/(website)/verify-jvto/police-safety/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/press-recognition` | `src/app/(website)/verify-jvto/press-recognition/page.tsx` | legacy: snapshot/seed | getPageSeo, faq-resolver, jsonld | AI/llms, search/schema, sitemap, web |
| `/why-jvto` | `src/app/(website)/why-jvto/page.tsx` | content/ (Git SSOT) | static-content, jsonld | AI/llms, search/schema, sitemap, web |
| `/why-jvto/[slug]` | `src/app/(website)/why-jvto/[slug]/page.tsx` | content/ (Git SSOT) | static-content, content_pages, jsonld | AI/llms, search/schema, sitemap, web |
| `/why-jvto/reviews/[id]` | `src/app/(website)/why-jvto/reviews/[id]/page.tsx` | Postgres (DB) | jsonld, prisma | AI/llms, search/schema, sitemap, web |

## Generated / machine surfaces

| surface | file | authority | resolvers | consumers |
|---|---|---|---|---|
| `/api/build-info` | `src/app/(api)/api/build-info/route.ts` | generated (deploy SHA) | n/a | deploy verification |
| `/api/tours-feed` | `src/app/(api)/api/tours-feed/route.ts` | generated (DB projection) | n/a | declared feed consumers |
| `/llms-full.txt` | `public/llms-full.txt` | authored (static) | n/a | AI crawlers |
| `/llms.txt` | `src/app/llms.txt/route.ts` | generated/authored | n/a | AI crawlers |
| `/robots.txt` | `src/app/robots.ts` | generated (route registry + owner policy) | n/a | crawlers |
| `/sitemap.xml` | `src/app/sitemap.ts` | generated (per-cluster route lists + DB lastmod fallback) | n/a | search crawlers |
