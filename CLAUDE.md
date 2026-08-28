# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Rules — read these first

- **ALWAYS READ**: [.claude/rules/GLOBAL-CONSTRAINTS.md](.claude/rules/GLOBAL-CONSTRAINTS.md).
  It is the constitution and **overrides any section of this file it contradicts**.
- **Stale values**: [.claude/rules/STALE-FACTS-CHECKLIST.md](.claude/rules/STALE-FACTS-CHECKLIST.md)
  before quoting any count, rating, date, or commit hash.
- **Check status**: [STATUS.yaml](STATUS.yaml) for current open items
  (`npm run status:list`).
- **Commands**: `/audit-schema`, `/check-density`, `/resolve-stale`
  (see [.claude/README.md](.claude/README.md)).
- **Tests**: `npm run test:stale` to prevent stale-fact regressions.

## Project Overview

**Java Volcano Tour Operator (JVTO)** — Next.js 16 site for `PT Java Volcano Rendezvous`, a licensed East Java private volcano tour operator (Ijen, Bromo, Tumpak Sewu). Site emphasizes verifiable trust signals (NIB, police credentials, BBKSDA compliance) over generic marketing.

This is the **canonical JVTO codebase**. As of 2026-04-29, the AEO/GEO architecture was ported here from the now-archived `e:\test-2-2026` rewrite repo per `~/.claude/plans/sepertinya-banyak-hal-yang-sequential-coral.md` (Path B). Single-repo development from this point forward.

Founding year: **2015** (guesthouse era, Booking.com award), **PT formal 2023**. When schemas/copy reference "since" or `foundingDate`, use 2015.

### Where data comes from — read this before adding any query

**The database stores customer login. Nothing else the site displays.**

| What | Source |
|---|---|
| Everything the site displays — tour packages, destinations, travel guides, policies, reviews, crew, credentials, claims, ratings | **`jvto-ekosistem`** via `src/lib/ecosystemContent/*` |
| Bookings, invoices, payments | **legacy API** (`NEXT_PUBLIC_LEGACY_URL_DOMAIN`) — not this database |
| Customer login sessions (Google SSO + email magic link) | **PostgreSQL via Prisma** — used by checkout, `/my-booking`, and the navbar |

As of 2026-08-28 **no application code queries Prisma at all**. If you are about to
write `prisma.something.findMany()` for content, you are working against the
architecture — read it from ekosistem instead. See "Prisma is pruned" below.

## Commands

```bash
npm run dev           # dev server on :3000 (Turbopack)
npm run build         # production build
npm start             # serve the production build
npm run lint          # ESLint check
npx prisma generate   # regenerate Prisma client (after schema.prisma edits)
# npx prisma db pull  # ⚠️ DO NOT RUN — see "Prisma is pruned" below
```

Database connection: PostgreSQL at `31.97.223.43`, configured via `DATABASE_URL` in
`.env.local`. It backs customer login only — see "Where data comes from" above.

## Tech Stack

- **Next.js 16** App Router with route groups: `(website)`, `(api)`, `(cms)`, `(customer)`
- **Bundler**: Turbopack (default)
- **Data layer**: Prisma 6.18 — **pruned to 6 models** on 2026-08-28 (see below). Content comes from `jvto-ekosistem`; Prisma is auth plus one validator
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
| `DEFINED_TERMS.ISIC` | `/#term-isic` | `(website)/layout.tsx` (global) |
| `DEFINED_TERMS.INDECON` | `/#term-indecon` | `(website)/layout.tsx` (global) |
| `DEFINED_TERMS.JVTO_TRAVEL_CREDIT` | `/#term-jvto-travel-credit` | `(website)/layout.tsx` (global) — **brand-custom** |
| `DEFINED_TERMS.JVTO_FOC_SCHEME` | `/#term-jvto-foc-scheme` | `(website)/layout.tsx` (global) — **brand-custom** |
| `buildCrewPersonSchema()` | `/#crew-{code}` | `/why-jvto/our-team` (per active crew) |

`DEFINED_TERMS` currently holds **11** keys (7 credential/regulatory + ISIC + INDECON +
2 brand-custom). `npm run test:stale` asserts that count — update the test when the set
legitimately grows.

When adding new credentials/terms: add to `DEFINED_TERMS` (auto-injects globally) AND to `@id Registry` in `~/.claude/projects/f--jvto-web/memory/cluster_role_contracts.md`. Don't inline schema in pages.

### Per-cluster Schema Builders + Canonical Q&A

| Cluster | Schema builders | Canonical Q&A |
|---|---|---|
| Tour detail | `src/lib/schemas/buildTourSchemas.ts` | `src/lib/tourFaqs.ts` (`getTourSpineQaPairs`) |
| Tours hub | `src/lib/schemas/buildToursHubSchemas.ts` | `src/lib/tourFaqs.ts` (`getToursHubQaPairs`) |
| Verify-JVTO | `src/lib/schemas/buildVerifySchemas.ts` | `src/lib/verifyFaqs.ts` (`LEGAL_FAQS`, `POLICE_SAFETY_FAQS`, `PRESS_RECOGNITION_FAQS`, `VERIFY_HUB_FAQS`) |
| Why-JVTO | `src/lib/schemas/buildWhyJvtoSchemas.ts` | ekosistem `why-jvto/*.source.json` + individual `@type:Review` nodes on `/reviews` |
| Travel-guide | `src/lib/schemas/buildTravelGuideSchemas.ts` | ekosistem `travel-guide/*.source.json` |
| Policy | `src/lib/schemas/buildPolicySchemas.ts` | ekosistem `policies/*` |
| Destinations | `src/lib/schemas/buildDestinationsSchemas.ts` | `getEcosystemDestinationDetail()` |

> The "DB `narrative_claims`" / "DB `schema_json`" entries this table used to carry were
> corrected on 2026-08-28. Those Prisma models no longer exist — the schema was pruned to
> 6 models and nothing in `src/` imports them. The 26 narrative claims are read by
> `getEcosystemNarrativeClaims()` (used by the two tour-detail pages); everything else
> reads its own ekosistem source file.

**Rule:** edit Q&A copy → in `jvto-ekosistem`, or `src/lib/*Faqs.ts` for the hand-written spine pairs. Edit schema fields → only `src/lib/schemas/build*.ts`. Never add a Prisma query for content.

`src/lib/queries/schemaReviews.ts` feeds `buildIndividualReviewSchemas()`; individual `@type:Review` schema is live on `/why-jvto/reviews`. Despite living under `queries/`, it is **not** a Prisma query — it was `prisma.reviews.findMany` until 2026-08-19 and now filters and sorts in application code over `getEcosystemReviews()`, keeping the same return shape.

### Content Layer (ekosistem-content) — replaces the retired FAQ resolver

> The former "FAQ Source Resolver (CRITICAL)" section documented
> `src/lib/content/resolveFaqs.ts`, `resolveFaqsForPage()`, `CANONICAL_FAQ_REGISTRY`,
> and DB-`narrative_claims` precedence. All of it was **retired 2026-08-18**. Do not
> reintroduce that pattern.

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

### Prisma is pruned — do NOT run `prisma db pull`

`prisma/schema.prisma` models **6 tables**, down from 103 on 2026-08-28. The
database itself was not touched: all 103 tables are still in Postgres, unchanged.
The schema simply stopped modelling the ones nothing reads.

> ⚠️ **`npx prisma db pull` reintrospects the live database and writes all 103
> models back**, silently undoing this. If you need a table that is not modelled,
> add that one model by hand. Never re-pull the whole schema.

| Model | Why it survives |
|---|---|
| `User` (→ `customers`) · `Account` · `Session` · `VerificationToken` | NextAuth `PrismaAdapter`. `session.strategy = "database"` plus an EmailProvider magic link, so these cannot move to JWT-only without dropping magic-link sign-in |
| `packages` · `durations` | Not read by the app. Only `scripts/validate-package-readiness-consumption.mjs` — the DB-vs-registry check |

**No application code queries Prisma any more.** The last two callers moved to
`jvto-ekosistem` on 2026-08-28:

- `getReviewStats.ts` (`review_stats`) — deleted. Its writer, `sync-google-reviews.yml`,
  lived only on the `main` branch (deleted the same day) and had already been failing
  with a 404, so the table it fed was frozen.
- `my-booking/[slug]` (`packages.code` → JSON-LD `productID`) — now reads
  `getEcosystemTourPackageDetail().packageId`. The identifier is the same string in
  both places: it agreed on all 15 codes `middleware.ts` pins as `/trips/trip-*.json`,
  with no mismatches.

So the only thing standing between this repo and no database at all is customer
login. Tracked as `PRISMA_AUTH_ONLY` in `STATUS.yaml`.

### Generated client

`src/generated/prisma` is committed (`.gitignore` un-ignores it), but the engine
binaries are not portable. `npm ci` runs `@prisma/client`'s own postinstall, which
regenerates the engine for the host — that is how the VPS gets its Linux engine.
The Windows engine (20 MB) and an abandoned `.tmp*` file (another 20 MB) were removed
on 2026-08-28 and are now gitignored.

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
- **`content_pages.content.faq` is gone.** The admin-editable CMS FAQ and its precedence
  rules died with the FAQ resolver on 2026-08-18. FAQ copy is edited in `jvto-ekosistem`
  now — tell admins that, not the old CMS story.
- **Sed-based file copies truncate large TSX files** in this Windows/Bash setup. For files >100 lines, use `Read` + `Write` directly, not shell pipelines.
- **`page copy.tsx` clutter files** in `src/app/(website)/why-jvto/our-story/` — pre-existing backup files with TS errors. Ignore unless owner asks for cleanup.
- **Live dev server on Windows can be slow** with Turbopack + path resolution; verify changes via `npm run build` (SSG-safe post-port) rather than relying on dev server smoke tests.
- **Prisma nullable field type narrowing**: a `where: { star: { not: null } }` clause does NOT narrow the TypeScript return type — the field stays `number | null`. In schema builders, always `.filter(r => r.field != null)` before `.map()` even when the DB query already excludes nulls. Use `r.field!` inside the filtered map. See `buildIndividualReviewSchemas()` for the pattern.
- **Adding a new AI crawler to `public/robots.txt`** = also update `next.config.mjs` `images.remotePatterns` if their bot fetches avatars from external CDNs.

## Session Operating Rules

These rules are active every session. Claude must follow them without being reminded.

**RULE 1 — No blind continuation**
Never respond to vague prompts ("lanjutkan", "continue", "yes", "ok", "next") without first stating:
- `→ ORIENTATION: I am currently [doing X] in [file Y].`
- `→ NEXT ACTION : I will now [specific action Z].`
If you cannot fill both, ask 1 specific question. Do not assume and proceed.

**RULE 2 — Compact checkpoint at 60 calls**
At every 60th tool call, output:
`⚠ COMPACT CHECKPOINT — [N] calls. Done: [3 bullets]. → Recommend /compact.`

**RULE 3 — External content protocol**
If a URL or file path is pasted AND call count > 30:
`⚠ External content in heavy context. Recommend /compact first.`
Wait for user confirmation before fetching.

**RULE 4 — Subagent selection (enforce every spawn)**
- Read-only (search, analyze, inspect) → always `Explore`
- Writes, bash, DB changes → `general-purpose`
- Code quality, lint → `code-reviewer`
State the type and reason before spawning. Never use `general-purpose` for read-only tasks.

**RULE 5 — No mid-session /init**
If context feels unclear, read CLAUDE.md directly. `/init` is for fresh session starts only — never run it mid-session.

**RULE 6 — Drift check every 20 calls**
Before any file edit at call N (multiple of 20):
`→ DRIFT CHECK [N]: [current task] → serves [sprint goal] ✓`
If you cannot connect them: flag drift and stop before continuing.

**RULE 7 — Phase transition format**
Before starting any new phase, output or require:
```
## PHASE START: [name]
Previous phase completed: [1 sentence]
Current state: [last file touched]
This phase goal: [1 sentence]
Scope: ONLY [files/folders]
Do NOT: [what must stay unchanged]
```

Use `/phase-start` to run this automatically. Use `/session-close` to commit + handoff.

## Current Sprint

**Last completed:** DB-only content sprint — backfilled body_md into mount-bromo-logistics (3565 chars compiled from existing sections) and tumpak-sewu-logistics (3807 chars); populated and activated packing-list (was inactive empty `{}`); build 137→138/138 ✓ (2026-05-05)
**Completed date:** 2026-05-05
**Next task:** Port remaining undeployed travel-guide DB rows — safety-on-tours, weather-and-closures, packing-and-fitness already have body_md; check if other content_pages need body_md backfill; OR begin next AEO cluster work
**Build status:** ✓ Compiled (138/138 static pages — DB update only, no code change, at commit e27e393)
**Open items:**
- Design atlas screenshots gitignored — regenerate after server restart: `npm run dev` → `node scripts/generate-design-atlas.mjs`
- booking-2015-plaque.jpg XMP shows "AI-Generated Content: Yes" (Canva) — owner must verify real plaque photo vs. mock-up
- KTA card identifier numbers not yet added to hasCredential.identifier — owner to supply numbers per guide
- /travel-guide/best-time-to-visit page exists in code but has no DB row — content needed if publishing

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

## Guardrails (Package-1 Schema Scope)

> Supersedes the 2026-06-12 schema-spine handoff note, which recorded that its
> "Guardrails section" could not be located. The list below is the current one.
> `.claude/rules/GLOBAL-CONSTRAINTS.md` is the authority; this is a pointer copy.

- No content/copy rewrites
- No legacy-route deletion or new 301s
- No changes to `sync-llm-wiki.yml` / `sync-trust-bundle.mjs`
- No deploy/CI workflow changes
- No dependency changes without written approval
- Conversion scope: `travel-guide/faq` only
- No hiding TS/build errors
- No broad SEO edits

### Working posture

- Do not ask questions unless you hit a real blocker (credentials, new deps, deletion,
  live branch, sync/deploy workflow, env failure, PR merge). Otherwise assume the safest
  in-scope option, document it, and continue.
- NO dummy/fake DB.
- If Prisma requires `DATABASE_URL`:
  - use an existing local/dev `.env` ONLY if already present and clearly not production
  - do NOT invent or hardcode a fake `DATABASE_URL`
  - do NOT ask for production credentials
  - document the exact error verbatim, then continue to non-DB / file-based steps
- Do NOT stop unless deps cannot install OR basic file-based validation cannot run.
- Do not write a long SEO report (doc stubs link to `docs/_audit/package1-audit.md`).

### Baseline (captured 2026-06-12)

`npx tsc --noEmit` on `main` (205172f0): **3 pre-existing errors**, all dead imports —
`src/components/website/HomePage.tsx` (`./Hero`, `./TravelGuideTeaser`) and
`src/components/website/ReviewsPage.tsx` (`./Reviews`). These modules do not exist on
`main`; the files are outside the app-router build path so `next build` is unaffected.
Full log: `/tmp/tsc-baseline.txt`. Do not "fix" these as part of schema-spine work;
any new tsc errors beyond these 3 are regressions.

### Environment note (documented decision)

`DATABASE_URL` in the main checkout's `.env`/`.env.local` points at database `jvto`
(not `jvto_dev`) at 31.97.223.43 — NOT clearly non-production, so it was not copied
into this worktree. `npx prisma generate` (offline, no DB connection) was run once with
the env var sourced inline from the main checkout's `.env`; no env file exists in this
worktree by design. Exact error when DATABASE_URL is absent:
`PrismaConfigEnvError: Missing required environment variable: DATABASE_URL`
(thrown by `prisma.config.ts` via `env("DATABASE_URL")` at config load).
