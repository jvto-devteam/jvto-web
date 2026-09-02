# CLAUDE.md

Guidance for Claude Code in this repository.

## Read first

- `.claude/rules/GLOBAL-CONSTRAINTS.md` — always on, **overrides this file** where they conflict.
- `.claude/rules/STALE-FACTS-CHECKLIST.md` — before quoting any count, rating, date, or commit hash.
- `STATUS.yaml` (`npm run status:list`) — current open items.
- Commands: `/audit-schema`, `/check-density`, `/resolve-stale` (see `.claude/README.md`).
- `npm run test:stale` guards against stale-fact regressions.

## Project

**Java Volcano Tour Operator (JVTO)** — Next.js 16 site for `PT Java Volcano Rendezvous`, a licensed East Java private volcano tour operator (Ijen, Bromo, Tumpak Sewu). The site leads with verifiable trust signals (NIB, police credentials, BBKSDA compliance), not generic marketing.

Canonical codebase since the 2026-04-29 AEO/GEO port from `e:\test-2-2026` (archived). Single-repo development from here.

## Where data comes from — read before writing any query

**The database stores customer login. Nothing else the site displays.**

| What | Source |
|---|---|
| Everything displayed — packages, destinations, travel guides, policies, reviews, crew, credentials, claims, ratings | **`jvto-ekosistem`** via `src/lib/ecosystemContent/*` |
| Bookings, invoices, payments | **legacy API** (`NEXT_PUBLIC_LEGACY_URL_DOMAIN`) |
| Customer login sessions (Google SSO + email magic link) | **PostgreSQL via Prisma** |

No application code queries Prisma. If you are about to write `prisma.something.findMany()` for content, you are working against the architecture — read it from ekosistem instead.

Content is edited in `jvto-ekosistem`, not here. Prose that appears in `jvto-web` is drift and belongs back at the source.

Why the schema holds only 6 models, and why `prisma db pull` must never be run: `prisma/schema.prisma` lines 12-22. Customer login is the only thing between this repo and no database at all — tracked as `PRISMA_AUTH_ONLY` in `STATUS.yaml`.

## Architecture

The AEO/GEO schema layer (entity-graph `@id`s, `DEFINED_TERMS`, per-cluster schema builders, the ekosistem content-reader layer, `PageJsonLdCombined`) is in `.claude/rules/schema-and-content-layer.md`. It auto-loads when you touch `src/lib/schemas/`, `src/lib/ecosystemContent/`, `src/components/seo/`, or `src/lib/*Faqs.ts`.

### Server + client split

**Every `page.tsx` is a Server Component.** Existing client components under `src/components/website/` keep their Framer Motion / useState dependencies.

1. Server `page.tsx` exports `metadata` and injects JSON-LD via `<PageJsonLdCombined>` or `<JsonLd>`
2. Client `XxxClient.tsx` (PascalCase) handles motion and interactivity
3. Server fetches data and passes it as props
4. Schema injection is server-side, never inside a client component

**Never self-fetch `${SITE_URL}/api/...` from a Server Component** — it breaks SSG with `ECONNREFUSED` at build time. Extract the data logic into a `src/lib/.../get*.ts` helper and call it directly; API routes stay as thin wrappers for external clients.

### Routing

Route folders live under `src/app/(website)/` — `Glob` it.

Both cities use full-path slugs. The bare-name Surabaya format was a jvto_dev data bug (fixed 2026-05-02), not intentional design.

## Things that bite

- **Prisma nullable narrowing**: `where: { star: { not: null } }` does NOT narrow the TypeScript return type — the field stays `number | null`. Always `.filter(r => r.field != null)` before `.map()`, then use `r.field!`. See `buildIndividualReviewSchemas()`.
- **`content_pages.content.faq` is gone** — it died with the FAQ resolver on 2026-08-18. FAQ copy is edited in `jvto-ekosistem` now; tell admins that, not the old CMS story.
- **Adding an AI crawler to `public/robots.txt`** → also update `images.remotePatterns` in `next.config.ts` if its bot fetches avatars from external CDNs. Nothing in `next.config.ts` hints at this.
- **Turbopack dev server is slow on Windows.** Verify changes with `npm run build` (SSG-safe post-port) rather than dev-server smoke tests.
- **Never trust a tsc baseline written in a document.** Run `npx tsc --noEmit` fresh before calling anything a regression.

## Scope guardrails

- No content or copy rewrites
- No legacy-route deletion, no new 301s
- No changes to the sync/deploy workflows: `.github/workflows/ci.yml`, `deploy.yml`, `update-volcanic-status.yml` (the old `sync-llm-wiki.yml` and `scripts/sync-trust-bundle.mjs` this line used to name were deleted 2026-08-15; verified gone 2026-09-02)
- No deploy or CI workflow changes
- No dependency changes without written approval
- No hiding TS or build errors
- No broad SEO edits
- Conversion scope: `travel-guide/faq` only

## Working posture

- Don't ask questions unless you hit a real blocker (credentials, new deps, deletion, live branch, sync/deploy workflow, env failure, PR merge). Otherwise take the safest in-scope option, document it, and continue.
- No dummy or fake DB. Never invent or hardcode a `DATABASE_URL`, never ask for production credentials. If Prisma needs it and it is absent, quote the error verbatim and continue with non-DB steps.
- Stop only if dependencies cannot install or file-based validation cannot run.
- No long SEO reports — doc stubs link to `docs/_audit/package1-audit.md`.

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

**Audit / mapping tasks** → invoke the `analisis-steril` skill before measuring anything.

## Auto-memory

`~/.claude/projects/f--jvto-web/memory/` — 17 files. (`D--jvto-web/memory/` is empty; new memory written from `D:` lands there instead and will not be found here.)

**Read on demand, never all at once.** `decision_filter_5check.md` gates any code/copy/DB/schema change; `cluster_role_contracts.md` is required before per-cluster work. `ls` the folder for the rest.

Update memory when significant work completes.

## Skill routing

Match the request to an available skill and invoke it. When in doubt, invoke. Skill names are listed in `~/.claude/CLAUDE.md`.

Ideas → `/office-hours` · strategy → `/plan-ceo-review` · architecture → `/plan-eng-review` · design consultation → `/design-consultation` · visual polish → `/design-review` · full pipeline → `/autoplan` · bugs → `/investigate` · QA → `/qa`, `/qa-only` · code review → `/review` · ship → `/ship`, `/land-and-deploy` · context → `/context-save`, `/context-restore`.
