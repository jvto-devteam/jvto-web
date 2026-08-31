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
| Customer login sessions (Google SSO + email magic link) | **PostgreSQL via Prisma** |

As of 2026-08-28 **no application code queries Prisma at all**. If you are about to
write `prisma.something.findMany()` for content, you are working against the
architecture — read it from ekosistem instead. See "Prisma is pruned" below.

## Commands

Standard npm scripts (`dev`/`build`/`start`/`lint`) — see `package.json`.

```bash
npx prisma generate   # regenerate Prisma client (after schema.prisma edits)
# npx prisma db pull  # ⚠️ DO NOT RUN — see "Prisma is pruned" below
```

Database connection: PostgreSQL at `31.97.223.43`, configured via `DATABASE_URL` in
`.env.local`. It backs customer login only — see "Where data comes from" above.

## Architecture: Schema Layer, Content Layer & Schema Builders

The AEO/GEO schema architecture (entity graph `@id`s, `DEFINED_TERMS`, per-cluster schema builders + canonical Q&A, the `jvto-ekosistem` content-reader layer, `PageJsonLdCombined`) is documented in
[.claude/rules/schema-and-content-layer.md](.claude/rules/schema-and-content-layer.md) — it loads automatically when you touch `src/lib/schemas/`, `src/lib/ecosystemContent/`, `src/components/seo/`, or `src/lib/*Faqs.ts`.

Tech stack (Next.js 16, Prisma 6.18 pruned to 6 models, NextAuth, TipTap, Mailgun, Xendit) is in `package.json` — see "Prisma is pruned" below for the one non-obvious part.

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

Route folder layout matches `src/app/(website)/` — `ls`/`Glob` it directly.

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
