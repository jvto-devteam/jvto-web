# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Java Volcano Tour Operator (JVTO)** — Next.js 16 site for `PT Java Volcano Rendezvous`, a licensed East Java private volcano tour operator (Ijen, Bromo, Tumpak Sewu). Site emphasizes verifiable trust signals (NIB, police credentials, BBKSDA compliance) over generic marketing.

This is the **canonical JVTO codebase**. As of 2026-04-29, the AEO/GEO architecture was ported here from the now-archived `e:\test-2-2026` rewrite repo per `~/.claude/plans/sepertinya-banyak-hal-yang-sequential-coral.md` (Path B). Single-repo development from this point forward.

Founding year: **2015** (guesthouse era, Booking.com award), **PT formal 2023**. When schemas/copy reference "since" or `foundingDate`, use 2015.

## Commands

```bash
npm run dev           # dev server on :3000 (Turbopack)
npm run build         # production build
npm start             # serve the production build
npm run lint          # ESLint check
npx prisma generate   # regenerate Prisma client (after schema.prisma edits)
npx prisma db pull    # sync schema.prisma from DB
```

Database connection: PostgreSQL at `31.97.223.43:5432/jvto_dev`, configured via `DATABASE_URL` in `.env.local`.

## Tech Stack

- **Next.js 16** App Router with route groups: `(website)`, `(api)`, `(cms)`, `(customer)`
- **Bundler**: Turbopack (default)
- **Data layer**: Prisma 6.18 (`prisma/schema.prisma` covers 105+ models including booking flow, CMS content, narrative_claims)
- **Auth**: NextAuth (Google SSO) for customer dashboard + admin CMS
- **Editor**: TipTap (admin CMS WYSIWYG)
- **Email**: Mailgun + Nodemailer
- **Payments**: Xendit Gateway (booking + travel-credit issuance)
- **Storage**: local `public/` for static assets; absolute URLs in schema for production-domain references

## Architecture: Schema Layer (post-port)

The AEO/GEO schema architecture is the most important addition from the port. Every public page emits structured JSON-LD that maximizes AI search (AEO) signal density via cross-referenced entity graph.

### Master Entity Graph: `src/lib/schemas/entityGraph.ts`

All entities have stable `@id` so any page can cross-reference via `{ '@id': ... }` instead of re-inlining.

| Export | `@id` | Where injected |
|---|---|---|
| `ORGANIZATION_SCHEMA` | `/#organization` | Per-page via `PageJsonLdCombined` |
| `FOUNDER_SCHEMA` | `/#agung-sambuko` | `(website)/layout.tsx` (global) |
| `DOCTOR_SCHEMA` | `/#dr-ahmad-irwandanu` | `(website)/layout.tsx` (global) |
| `BBKSDA_REGULATION_SCHEMA` | n/a | `(website)/layout.tsx` (global) |
| `DEFINED_TERMS.NIB` / `TDUP` / `HPWKI` / `KTA` / `POLPAR` / `BBKSDA` / `SE1658` (×7) | `/#term-{key}` | `(website)/layout.tsx` (global) |
| `DEFINED_TERMS.JVTO_TRAVEL_CREDIT` | `/#term-jvto-travel-credit` | `(website)/layout.tsx` (global) — **brand-custom** |
| `DEFINED_TERMS.JVTO_FOC_SCHEME` | `/#term-jvto-foc-scheme` | `(website)/layout.tsx` (global) — **brand-custom** |
| `buildCrewPersonSchema()` | `/#crew-{code}` | `/why-jvto/our-team` (per active crew) |

When adding new credentials/terms: add to `DEFINED_TERMS` (auto-injects globally) AND to `@id Registry` in `~/.claude/projects/f--jvto-web/memory/cluster_role_contracts.md`. Don't inline schema in pages.

### Per-cluster Schema Builders + Canonical Q&A

| Cluster | Schema builders | Canonical Q&A |
|---|---|---|
| Tour detail | `src/lib/schemas/buildTourSchemas.ts` | `src/lib/tourFaqs.ts` (`getTourSpineQaPairs`) |
| Tours hub | `src/lib/schemas/buildToursHubSchemas.ts` | `src/lib/tourFaqs.ts` (`getToursHubQaPairs`) |
| Homepage | `src/lib/schemas/buildHomepageSchemas.ts` | `src/lib/homepageFaqs.ts` (`HOMEPAGE_FAQS`) |
| Verify-JVTO | `src/lib/schemas/buildVerifySchemas.ts` | `src/lib/verifyFaqs.ts` (`LEGAL_FAQS`, `POLICE_SAFETY_FAQS`, `PRESS_RECOGNITION_FAQS`, `VERIFY_HUB_FAQS`) |
| Why-JVTO | `src/lib/schemas/buildWhyJvtoSchemas.ts` | DB `narrative_claims` (via `getNarrativeClaimsByPage`) |
| Travel-guide | `src/lib/schemas/buildTravelGuideSchemas.ts` | DB `narrative_claims` |
| Policy | `src/lib/schemas/buildPolicySchemas.ts` | DB `narrative_claims` |
| Destinations | `src/lib/schemas/buildDestinationsSchemas.ts` | DB `schema_json` per row |

**Rule:** edit Q&A copy → only `src/lib/*Faqs.ts` or DB `narrative_claims`. Edit schema fields → only `src/lib/schemas/build*.ts`. FAQ source resolution is centralized.

### FAQ Source Resolver (CRITICAL): `src/lib/content/resolveFaqs.ts`

Single source of truth for FAQ source resolution. Deterministic precedence (highest → lowest):

1. **`narrative_claims`** (DB, primary_page-wired) — canonical AEO-tuned brand voice
2. **Canonical hardcoded** (`HOMEPAGE_FAQS`, `LEGAL_FAQS`, etc. registered in `CANONICAL_FAQ_REGISTRY`)
3. **CMS** (`content.faq` from `content_pages` row, auto-injected by `PageJsonLdCombined` unless suppressed)

**Single FAQPage per page rule.** Pages MUST pass `suppressCmsFaq={faqResolution.suppressCmsFaq}` to `<PageJsonLdCombined>` to prevent double FAQPage emission when a higher-precedence source fires.

Pattern (per page handler):
```ts
import { resolveFaqsForPage, buildResolvedFaqSchema } from '@/lib/content/resolveFaqs';

const faqResolution = await resolveFaqsForPage(route);
const faqNode = buildResolvedFaqSchema(faqResolution, route);

return (
  <PageJsonLdCombined
    pageRow={pageRow}
    extraSchemas={[..., faqNode]}
    suppressCmsFaq={faqResolution.suppressCmsFaq}
  />
);
```

**Adding a new canonical Q&A file** = 1 entry in `CANONICAL_FAQ_REGISTRY`. **Adding a narrative_claim** = DB row, zero code change. **Removing a Q&A** = remove from highest-precedence source for that route.

### `PageJsonLdCombined` Component

`src/components/seo/PageJsonLdCombined.tsx` is the standard schema injection component for all `(website)/*` pages. It auto-injects: Organization + WebSite + WebPage + BreadcrumbList + (optional) CMS-FAQ + page extras passed via `extraSchemas`.

Accepts:
- `pageRow` — content_pages row (for SEO + content.faq)
- `extraSchemas` — per-page schema nodes
- `suppressCmsFaq` — opt-out for CMS FAQ when canonical takes over (Phase 5 addition)

## Architecture: Server + Client Split Pattern

**Every `page.tsx` is a Server Component.** Live's existing client components (under `src/components/website/`) preserve dependencies on Framer Motion, useState, etc.

When converting or creating a page:

1. Server `page.tsx` exports `metadata` and injects JSON-LD via `<PageJsonLdCombined>` or `<JsonLd>`
2. Client `XxxClient.tsx` (PascalCase) handles motion/interactivity
3. Server fetches DB data and passes as props
4. Schema injection happens server-side, never inside client components

## Data Layer (post-port)

### Server Components → Direct Helpers (NOT self-fetch)

**Anti-pattern**: `fetch(\`${SITE_URL}/api/...\`)` in Server Components breaks SSG with `ECONNREFUSED` at build time. The port (Phase 4.1.fix + Phase 4.8) refactored this anti-pattern across the spine pages.

Helpers extracted from API routes (Server Components call directly; routes still serve external clients via thin wrappers):

| Helper | Used by | Replaces |
|---|---|---|
| `src/lib/packages/getWebPackageDetail.ts` | tour detail pages | `/api/packages/web/details` self-fetch |
| `src/lib/packages/getWebPackagesList.ts` | tour hubs (×3), homepage destinations preview | `/api/packages/web` self-fetch |
| `src/lib/destinations/getWebDestinationDetail.ts` | destination detail pages | `/api/destinations/web/[slug]` self-fetch |
| `src/lib/destinations/getWebDestinationsList.ts` | destinations hub, homepage | `/api/destinations/web` self-fetch |

**Rule:** when adding new SSG-rendered pages with DB data, extract data logic to a `src/lib/.../get*.ts` helper. Don't `fetch(/api/...)` from a Server Component — it breaks at build time.

### BigInt Serialization

Live's Prisma returns `BigInt` for `id` columns. JSON.stringify chokes on BigInt by default. Fix in `src/lib/prisma.ts` monkey-patches `BigInt.prototype.toJSON` to return `.toString()`. Don't override or remove this.

### Prisma Models (notable)

- `narrative_claims` — added Phase 3 of port. 9 canonical brand claims (C1–C9) with `primary_page` field for FAQ wiring.
- `packages` (16 active + 12 soft-deleted) — slug shape uniform full-path: both Surabaya (`tours/from-surabaya/bromo-1d1n`) and Bali (`tours/from-bali/bromo-ijen-3d2n`) use the full prefix. Fixed 2026-05-02 (jvto_dev Surabaya slugs were bare, causing 404).
- `destinations` (5 published + 5 NULL-slug city/departure refs) — `id IN (3, 4)` filtered out (Bali / Surabaya departure refs, not real destinations).
- `crew_members` — used by `/why-jvto/our-team` Person schema injection via `getActiveCrewMembers()`.
- `content_pages` — CMS-managed SEO + content.faq per route.

## Routing

- `/tours/from-bali/[slug]` and `/tours/from-surabaya/[slug]` — separate folders with shared client `src/components/website/TourDetail.tsx`
- `/tours/page.tsx` (root hub), `/tours/from-bali/page.tsx`, `/tours/from-surabaya/page.tsx` — hub listings
- `/destinations/[slug]` — dynamic destination detail
- `/why-jvto/[slug]`, `/travel-guide/[slug]`, `/policy/[slug]` — dynamic CMS-driven sub-pages with per-slug schema augmentation
- `/verify-jvto/{legal,police-safety,press-recognition,history-artifacts}/page.tsx` — separate folders (not [slug] dynamic)

Slug shape: both cities use full-path format — `tours/from-surabaya/{slug}` and `tours/from-bali/{slug}`. The bare-name format for Surabaya was a jvto_dev data bug (fixed 2026-05-02), not intentional design.

## Auto-Memory

Persistent memory at `~/.claude/projects/f--jvto-web/memory/`. Two tiers:

**Read-first (canonical operating principles):**

- `priority_order_canonical.md` — locked sequence: package pages → tours hub → homepage → trust/support → technical → CMS → expansion
- `working_rule_canonical.md` — page roles: homepage sells trust, tours hub clarity, package confidence, support reduces friction, verify proves claims
- `decision_filter_5check.md` — mandatory 5-question gate before any code/copy/DB/schema change
- `visual_modes_canonical.md` — Homepage/Travel/Trust/Hybrid mode mapping per cluster (navy + orange + lime canonical)
- `feedback_aeo_geo_priority.md` — locked lens: AEO/GEO/technical signal density; booking/backoffice/visual polish are NOT the primary driver
- `feedback_communication_style.md` — locked 2026-04-29: confident report-style with locked recommendations, NOT multi-choice prompts
- `strategic_pivot_2026-04-29.md` — Path B locked: AEO/GEO ported from rewrite to live; rewrite archived
- `scope_phasing_canonical.md` — post-port single-repo dev (replaces prior phased model)
- `cluster_role_contracts.md` — per-cluster MH/SH/NTH signal contracts + cross-cluster handoff matrix + @id registry. Required reading before per-cluster work
- `cluster_templates.md` — extracted patterns per cluster with live's `src/...` paths. Pattern, not instance

Update memory when significant work completes. They persist across sessions.

## Things That Bite

- **Pre-existing 42 TypeScript errors** in `(website)/checkout/page.tsx` + booking flow files (unrelated to AEO/GEO port). Don't fix opportunistically — out of scope per pivot. Track separately if owner asks for cleanup.
- **`(cms)` route group** is a separate concern from `(website)` schema work. Don't add AEO/GEO logic into CMS pages.
- **content_pages.content.faq** is admin-editable; per FAQ resolver precedence, it's the lowest-priority source. Admin edits affect only routes that have neither `narrative_claims` wired nor canonical hardcoded registered. Communicate this when training admins.
- **Sed-based file copies truncate large TSX files** in this Windows/Bash setup. For files >100 lines, use `Read` + `Write` directly, not shell pipelines.
- **`page copy.tsx` clutter files** in `src/app/(website)/why-jvto/our-story/` — pre-existing backup files with TS errors. Ignore unless owner asks for cleanup.
- **Live dev server on Windows can be slow** with Turbopack + path resolution; verify changes via `npm run build` (SSG-safe post-port) rather than relying on dev server smoke tests.
- **Adding a new AI crawler to `public/robots.txt`** = also update `next.config.mjs` `images.remotePatterns` if their bot fetches avatars from external CDNs.
