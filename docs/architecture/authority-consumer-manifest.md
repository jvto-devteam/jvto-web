# Authority / Consumer Manifest (Milestone 0 baseline)

> **Generated — do not hand-edit.** Regenerate with `npm run baseline:manifest`; a CI `verify`
> step regenerates and fails on any non-empty `git diff`. Grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](./JVTO_TECHNICAL_PROJECT_HANDOFF.md) §6/§22.
>
> Consumers are **evidence-derived**: `sitemap` = route emitted by a `sitemap.data.ts`;
> `search/schema` = JSON-LD signal in the import closure; `AI/llms` = crawlable public route
> (in sitemap, not private) or named in `llms-full.txt`; `private` = auth signal or the
> checkout / my-booking money surface. Authority follows the import closure; `unresolved`
> means no known resolver was reachable (recorded, not guessed).

**Public routes:** 56  ·  **private:** 4  ·  **generated surfaces:** 6

## Authority distribution (public routes)

- Postgres (DB): **1**
- content/ (Git SSOT): **28**
- legacy: content_pages (DB): **1**
- producer: OKF: **13**
- producer: llm-wiki (via import): **1**
- producer: llm-wiki: **5**
- tsx-embedded narrative: **1**
- unresolved (no reachable resolver): **6**

## Public routes

| surface | file | authority | resolution | resolvers | private | consumers |
|---|---|---|---|---|---|---|
| `/` | `src/app/(website)/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, faq-resolver, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/blog` | `src/app/(website)/blog/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/blog/[slug]` | `src/app/(website)/blog/[slug]/page.tsx` | tsx-embedded narrative | direct | jsonld | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/checkout` | `src/app/(website)/checkout/page.tsx` | producer: llm-wiki (via import) | transitive | policy-bundle | yes | private, web (auth) |
| `/contact` | `src/app/(website)/contact/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, jsonld, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/destinations` | `src/app/(website)/destinations/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap, web |
| `/destinations/[slug]` | `src/app/(website)/destinations/[slug]/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/isic/student-package` | `src/app/(website)/isic/student-package/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/markets/malaysia` | `src/app/(website)/markets/malaysia/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, faq-resolver, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/markets/singapore` | `src/app/(website)/markets/singapore/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, faq-resolver, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/my-booking` | `src/app/(website)/my-booking/page.tsx` | unresolved (no reachable resolver) | unresolved | none | yes | private, web (auth) |
| `/my-booking/[slug]` | `src/app/(website)/my-booking/[slug]/page.tsx` | unresolved (no reachable resolver) | unresolved | none | yes | private, web (auth) |
| `/my-booking/[slug]/bank-transfer` | `src/app/(website)/my-booking/[slug]/bank-transfer/page.tsx` | producer: llm-wiki | direct | policy-bundle | yes | private, web (auth) |
| `/policy` | `src/app/(website)/policy/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, policy-bundle, prisma, static-content | no | AI/llms, search/schema, sitemap, web |
| `/policy/[slug]` | `src/app/(website)/policy/[slug]/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, policy-bundle, prisma, static-content | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/student-deals/isic` | `src/app/(website)/student-deals/isic/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, snapshot, static-content | no | search/schema, web |
| `/team` | `src/app/(website)/team/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, static-content | no | search/schema, web |
| `/team/[slug]` | `src/app/(website)/team/[slug]/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, static-content | no | search/schema, web |
| `/tour-from-bali` | `src/app/(website)/tour-from-bali/page.tsx` | unresolved (no reachable resolver) | unresolved | none | no | web |
| `/tour-from-surabaya` | `src/app/(website)/tour-from-surabaya/page.tsx` | unresolved (no reachable resolver) | unresolved | none | no | web |
| `/tours` | `src/app/(website)/tours/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/tours-from-bali` | `src/app/(website)/tours-from-bali/page.tsx` | unresolved (no reachable resolver) | unresolved | none | no | web |
| `/tours-from-surabaya` | `src/app/(website)/tours-from-surabaya/page.tsx` | unresolved (no reachable resolver) | unresolved | none | no | web |
| `/tours/from-bali` | `src/app/(website)/tours/from-bali/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/tours/from-bali/[slug]` | `src/app/(website)/tours/from-bali/[slug]/page.tsx` | producer: llm-wiki | direct | jsonld, policy-bundle, prisma | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/tours/from-surabaya` | `src/app/(website)/tours/from-surabaya/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, policy-bundle, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/tours/from-surabaya/[slug]` | `src/app/(website)/tours/from-surabaya/[slug]/page.tsx` | producer: llm-wiki | direct | jsonld, policy-bundle, prisma | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/tours/student-package/[slug]` | `src/app/(website)/tours/student-package/[slug]/page.tsx` | producer: llm-wiki | direct | jsonld, policy-bundle, prisma | no | search/schema, web |
| `/travel-guide` | `src/app/(website)/travel-guide/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap, web |
| `/travel-guide/[slug]` | `src/app/(website)/travel-guide/[slug]/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/travel-guide/best-time-to-visit` | `src/app/(website)/travel-guide/best-time-to-visit/page.tsx` | content/ (Git SSOT) | direct | content_pages, faq-resolver, getPageSeo, jsonld, static-content | no | AI/llms, search/schema, sitemap, web |
| `/travel-guide/blue-fire-and-sunrise` | `src/app/(website)/travel-guide/blue-fire-and-sunrise/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/booking-safety` | `src/app/(website)/travel-guide/booking-safety/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/bromo-sunrise` | `src/app/(website)/travel-guide/bromo-sunrise/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/cancellation-travel-credit` | `src/app/(website)/travel-guide/cancellation-travel-credit/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/faq` | `src/app/(website)/travel-guide/faq/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, prisma, snapshot, static-content | no | AI/llms, search/schema, sitemap, web |
| `/travel-guide/finish-in-bali` | `src/app/(website)/travel-guide/finish-in-bali/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/how-booking-works` | `src/app/(website)/travel-guide/how-booking-works/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/malang-batu` | `src/app/(website)/travel-guide/malang-batu/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/payment-and-deposit` | `src/app/(website)/travel-guide/payment-and-deposit/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/police-escort-for-groups` | `src/app/(website)/travel-guide/police-escort-for-groups/page.tsx` | legacy: content_pages (DB) | direct | content_pages, getContentPage, jsonld, prisma | no | AI/llms, search/schema, sitemap, web |
| `/travel-guide/private-tour` | `src/app/(website)/travel-guide/private-tour/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/rijik-monthly-closure` | `src/app/(website)/travel-guide/rijik-monthly-closure/page.tsx` | producer: llm-wiki | direct | cms-seed, faq-resolver, jsonld, policy-bundle, prisma | no | search/schema, web |
| `/travel-guide/rooming-and-accommodation` | `src/app/(website)/travel-guide/rooming-and-accommodation/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/vehicle-and-luggage` | `src/app/(website)/travel-guide/vehicle-and-luggage/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/what-is-included` | `src/app/(website)/travel-guide/what-is-included/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/travel-guide/why-stay-near-ijen` | `src/app/(website)/travel-guide/why-stay-near-ijen/page.tsx` | producer: OKF | direct | content_pages, getContentPage, jsonld, okf-agent-guides, prisma | no | search/schema, web |
| `/trust` | `src/app/(website)/trust/page.tsx` | content/ (Git SSOT) | direct | cms-seed, content_pages, getContentPage, getPageSeo, jsonld, snapshot, static-content, trust-bundle | no | AI/llms, search/schema, sitemap, web |
| `/verify-jvto` | `src/app/(website)/verify-jvto/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, static-content | no | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/history-artifacts` | `src/app/(website)/verify-jvto/history-artifacts/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, static-content | no | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/legal` | `src/app/(website)/verify-jvto/legal/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, policy-bundle, prisma, static-content | no | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/police-safety` | `src/app/(website)/verify-jvto/police-safety/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, policy-bundle, static-content | no | AI/llms, search/schema, sitemap, web |
| `/verify-jvto/press-recognition` | `src/app/(website)/verify-jvto/press-recognition/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, policy-bundle, static-content | no | AI/llms, search/schema, sitemap, web |
| `/why-jvto` | `src/app/(website)/why-jvto/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap, web |
| `/why-jvto/[slug]` | `src/app/(website)/why-jvto/[slug]/page.tsx` | content/ (Git SSOT) | direct | content_pages, jsonld, prisma, static-content | no | AI/llms, search/schema, sitemap (dynamic), web |
| `/why-jvto/reviews/[id]` | `src/app/(website)/why-jvto/reviews/[id]/page.tsx` | Postgres (DB) | direct | jsonld, prisma | no | AI/llms, search/schema, sitemap (dynamic), web |

## Generated / machine surfaces

| surface | file | authority | resolution | resolvers | private | consumers |
|---|---|---|---|---|---|---|
| `/api/build-info` | `src/app/(api)/api/build-info/route.ts` | generated (deploy SHA) | n/a | n/a | no | deploy verification |
| `/api/tours-feed` | `src/app/(api)/api/tours-feed/route.ts` | generated (DB projection) | n/a | n/a | no | declared feed consumers |
| `/llms-full.txt` | `public/llms-full.txt` | authored (static) | n/a | n/a | no | AI crawlers |
| `/llms.txt` | `src/app/llms.txt/route.ts` | generated/authored | n/a | n/a | no | AI crawlers |
| `/robots.txt` | `src/app/robots.ts` | generated (route registry + owner policy) | n/a | n/a | no | crawlers |
| `/sitemap.xml` | `src/app/sitemap.ts` | generated (per-cluster route lists + DB lastmod fallback) | n/a | n/a | no | search crawlers |
