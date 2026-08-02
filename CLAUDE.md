# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Branch governance (locked 2026-07-05):** `main` = bengkel tunggal (single workshop) — all work happens on feature branches merged into `main` via PR with green CI. **`live` = production release pointer; jangan pernah kerja langsung di `live` (never work directly on `live`).** `live` receives only owner-commanded promote PRs (`live ← main`, CI-gated) plus volcanic-status bot commits. Full rules: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) · Content facts lock: [docs/CANONICAL_FACTS.md](docs/CANONICAL_FACTS.md) · **SSOT + CMS map: [docs/SSOT-CMS-KNOWLEDGE-BASE.md](docs/SSOT-CMS-KNOWLEDGE-BASE.md)** (estate, resolver, block model, duplicate-source map, CMS surface, render-path split — read before content/CMS work).

## Project Overview

**Java Volcano Tour Operator (JVTO)** — Next.js 16 site for `PT Java Volcano Rendezvous`, a licensed East Java private volcano tour operator (Ijen, Bromo, Tumpak Sewu). Site emphasizes verifiable trust signals (NIB, police credentials, BBKSDA compliance) over generic marketing.

This is the **canonical JVTO codebase**. As of 2026-04-29, the AEO/GEO architecture was ported here from the now-archived `e:\test-2-2026` rewrite repo per `~/.claude/plans/sepertinya-banyak-hal-yang-sequential-coral.md` (Path B). Single-repo development from this point forward.

Founding year: **2015** (guesthouse era, Booking.com award), **PT formal 2023**. When schemas/copy reference "since" or `foundingDate`, use 2015. The full adjudicated facts lock (founding year, blue-fire wording, review counts, prices, contact/legal identifiers) lives in [docs/CANONICAL_FACTS.md](docs/CANONICAL_FACTS.md) — violations are bugs.

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
| `DEFINED_TERMS.NIB` / `TDUP` / `HPWKI` / `KTA` / `POLPAR` / `BBKSDA` / `SE1658` / `ISIC` / `INDECON` (×9) | `/#term-{key}` | `(website)/layout.tsx` (global) |
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
| Why-JVTO | `src/lib/schemas/buildWhyJvtoSchemas.ts` | DB `narrative_claims` + individual `@type:Review` nodes on `/reviews` |
| Travel-guide | `src/lib/schemas/buildTravelGuideSchemas.ts` | DB `narrative_claims` |
| Policy | `src/lib/schemas/buildPolicySchemas.ts` | DB `narrative_claims` |
| Destinations | `src/lib/schemas/buildDestinationsSchemas.ts` | DB `schema_json` per row |

**Rule:** edit Q&A copy → only `src/lib/*Faqs.ts` or DB `narrative_claims`. Edit schema fields → only `src/lib/schemas/build*.ts`. FAQ source resolution is centralized.

New query helper: `src/lib/queries/schemaReviews.ts` — minimal Prisma query (no joins) feeding `buildIndividualReviewSchemas()`. Activated 2026-05-03; individual `@type:Review` schema is now live on `/why-jvto/reviews`.

### FAQ Source Resolver (CRITICAL): `src/lib/content/resolveFaqs.ts`

Single source of truth for FAQ source resolution. Deterministic precedence (highest → lowest):

0. **`cms-seed`** (`SEED_COVERED_ROUTES` / jvto_cms editorial seed) — for seed-covered routes this owns the FAQ outright, superseding every tier below (even a zero-FAQ seed suppresses the CMS fallback rather than falling through)
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

## Cross-Repo SSOT Sync (llm-wiki + OKF → jvto-web)

Content facts live **upstream**: `sambuko82/llm-wiki` (`master`) compiles the trust-bundle / package-readiness / blog / policy-bundle; `sambuko82/knowledge-catalog-jvto-bootstrap` (`main`) builds the OKF customer-sales-release. jvto-web is a **read-only consumer** of the compiled artifacts under `src/data/`. **Never hand-edit** `src/data/{trust-bundle,okf,package-readiness,blog,policy-bundle}` — fix the producer, recompile there, re-sync (a hand edit re-drifts and fails CI).

**Sync scripts** (`package.json`): `sync:trust` / `sync:packages` / `sync:blog` (source env `LLM_WIKI_PATH`), `sync:policy-bundle` (source env **`LLM_WIKI_ROOT`** — a *different* var, easy to miss), `sync:okf` (source env `OKF_PATH`). Consumed via `src/lib/trust-bundle.ts` (`/trust`) and `src/lib/content/agentGuides.ts` (~13 `/travel-guide/*` routes ← `src/data/okf`).

**CI drift gate (`ci.yml` → `verify`)** checks out llm-wiki@master + OKF@main, runs **all five** syncs, and `git diff --exit-code src/data/{package-readiness,trust-bundle,blog,policy-bundle,okf}`. If **any** bundle is stale it fails *"Synced bundles drifted from source."* So `main` must always be in full sync with **both** producers simultaneously.

**Auto-sync workflow (consolidated)** `sync-artifacts.yml` — replaced the former per-producer `sync-llm-wiki.yml` + `sync-okf.yml` (2026-08-02). Triggers on `repository_dispatch` from **both** producers (`llm-wiki-master-updated`, `okf-main-updated`) + manual `workflow_dispatch`; **`main` only**; re-syncs **all five** bundles from llm-wiki@master + OKF@main into **one** `automation/sync-artifacts-main` PR and auto-merges once `verify` is green (`build-develop` non-required — flaky VPS SSH).

**Why one workflow (deadlock-proof):** because a single PR always carries all five bundles from the current producer heads, the `verify` drift gate is satisfiable in one commit — the two old failure modes are gone: (1) two producers changing together no longer deadlock (both slices land in the same PR), and (2) `policy-bundle` is now covered (the old `sync-llm-wiki.yml` never synced it). Any producer push re-syncs everything from both producers.

**`live` is intentionally NOT auto-synced.** Per `docs/CONTRIBUTING.md`, `live` receives only owner-commanded `main → live` promote PRs — which carry main's already-synced `src/data`, so `live` stays correct without a separate auto-sync (auto-writing bundles to `live` would bypass that gate; `policy-bundle` in particular never had a live auto-sync). The old workflows' `live` legs are removed.

**Manual fallback** (recovery / local re-sync) — run all five from the current producer heads. The inline `VAR=x cmd` form applies only to the first command, so **`export` the vars** first:
```bash
export LLM_WIKI_PATH=/path/llm-wiki LLM_WIKI_ROOT=/path/llm-wiki OKF_PATH=/path/okf
npm run sync:packages && npm run sync:trust && npm run sync:blog && npm run sync:policy-bundle && npm run sync:okf
# red-flag check: only src/data/* changed + a 2nd run adds no diff (idempotent) => verify will pass
```

## Routing

- `/tours/from-bali/[slug]` and `/tours/from-surabaya/[slug]` — separate folders with shared client `src/components/website/TourDetail.tsx`
- `/tours/page.tsx` (root hub), `/tours/from-bali/page.tsx`, `/tours/from-surabaya/page.tsx` — hub listings
- `/destinations/[slug]` — dynamic destination detail
- `/why-jvto/[slug]`, `/travel-guide/[slug]`, `/policy/[slug]` — dynamic CMS-driven sub-pages with per-slug schema augmentation
- `/verify-jvto/{legal,police-safety,press-recognition,history-artifacts}/page.tsx` — separate folders (not [slug] dynamic)

Slug shape: both cities use full-path format — `tours/from-surabaya/{slug}` and `tours/from-bali/{slug}`. The bare-name format for Surabaya was a jvto_dev data bug (fixed 2026-05-02), not intentional design.

## Deployment & Hosting

`main` deploys to the help/preview box via `.github/workflows/deploy.yml` ("Deploy to VPS") — documented below. `live` → production is **owner-promoted**, and its on-box specifics (branch ref, dir, PM2 process) are **not assumed identical** to help — verify the `live` branch's own `deploy.yml` before touching production. `README.md` is the (secret-free) ops runbook.

| Branch | VPS dir | PM2 process | Domain | Index |
|---|---|---|---|---|
| `main` | `/var/www/jvto-help` | `jvto-help` | `help.javavolcano-touroperator.com` (preview/develop) | **noindex** |
| `live` | production box | (prod) | `javavolcano-touroperator.com` | indexable |

- **Mechanism (help/`main` deploy — do NOT run this exact sequence for `live`/production):** `appleboy/ssh-action` SSHes to the Hostinger VPS (`31.97.223.43`) and runs a script that **hard-codes** `origin/main`, `/var/www/jvto-help`, and the `jvto-help` PM2 process: source nvm → capture `PM2_BIN` → **`nvm use 20`** (Next.js 16 needs Node ≥20.9; box default is Node 18) → `git reset --hard origin/main` → `npm ci` → `npm run build` → `pm2 restart jvto-help --update-env`. Not Vercel/Docker. **Never add `git clean`** (it would delete the VPS-local `.env.local`). Any manual on-box command must mirror the `nvm use 20` step or the build aborts on Node 18. Running this against production would reset it to preview code and restart the wrong process — the `live` equivalents differ (confirm on the `live` branch).
- **Triggers:** push to `main` (auto) or `workflow_dispatch` (manual re-run). `live` is owner-promoted only (`main → live` PR).
- **Build needs Postgres.** `DATABASE_URL` comes from the untracked VPS-local `.env.local` (survives `git reset --hard`), never a repo secret. The `verify` job (ci.yml) only runs `prisma generate` with a dummy URL — it never builds.
- **Indexability** is set per box by `NEXT_PUBLIC_SITE_URL` (`src/lib/site.ts` + `next.config.ts`): only the production origin is indexable; every other box gets a global `X-Robots-Tag: noindex, nofollow`.
- **No health/version endpoint exists.** Verify a deploy via the Actions run + a live check: `curl -sI https://help.javavolcano-touroperator.com/` must return `x-robots-tag: noindex` (proves the correct config), then spot-check a changed page. **Race hazard:** deploy.yml has **no concurrency group**, so near-simultaneous pushes run concurrent SSH jobs that mutate the *same* `/var/www/jvto-help` checkout + `.next` (interleaving `git reset` / `npm ci` / `build`) — this can produce an inconsistent build and the final PM2 restart order is not guaranteed. Do **not** assume a later green run reliably supersedes an earlier one; after overlapping deploys, re-check the live box, and consider adding a workflow `concurrency` group to serialize.
- `build-develop` (ci.yml, `scripts/build-pr.sh`) is a pre-merge build on the develop server — **non-required** (flaky VPS SSH); `verify` is the only required check.
- **Secrets topology:** `deploy.yml` uses `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY`; `GH_PAT` (on jvto-web) reads the producer repos for the drift gate + sync; the producers fire `repository_dispatch` at jvto-web via `JVTO_WEB_DISPATCH_TOKEN`. jvto-web is a **public** repo — never commit credentials.

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

- **The "42 pre-existing TypeScript errors in checkout/booking" are GONE** — re-measured 2026-07-05 on `main`: `npx tsc --noEmit` reports exactly 3 errors, all dead imports in `HomePage.tsx`/`ReviewsPage.tsx`, **zero** in checkout/booking. Older docs/plans citing "42" are stale history. Consequence: any tsc error appearing in checkout/booking files today is a NEW regression — don't excuse it against the phantom legacy baseline.
- **`(cms)` route group** is a separate concern from `(website)` schema work. Don't add AEO/GEO logic into CMS pages.
- **content_pages.content.faq** is admin-editable; per FAQ resolver precedence, it's the lowest-priority source. Admin edits affect only routes that have neither `narrative_claims` wired nor canonical hardcoded registered. Communicate this when training admins.
- **Sed-based file copies truncate large TSX files** in this Windows/Bash setup. For files >100 lines, use `Read` + `Write` directly, not shell pipelines.
- **`page copy.tsx` clutter files** in `src/app/(website)/why-jvto/our-story/` — pre-existing backup files with TS errors. Ignore unless owner asks for cleanup.
- **Live dev server on Windows can be slow** with Turbopack + path resolution; verify changes via `npm run build` (SSG-safe post-port) rather than relying on dev server smoke tests.
- **Prisma nullable field type narrowing**: a `where: { star: { not: null } }` clause does NOT narrow the TypeScript return type — the field stays `number | null`. In schema builders, always `.filter(r => r.field != null)` before `.map()` even when the DB query already excludes nulls. Use `r.field!` inside the filtered map. See `buildIndividualReviewSchemas()` for the pattern.
- **Adding a new AI crawler to `public/robots.txt`** = also update `next.config.mjs` `images.remotePatterns` if their bot fetches avatars from external CDNs.
- **The CCR git proxy blocks branch/ref deletion and repo-settings writes** — `git push --delete` fails `send-pack: unexpected disconnect`, and the GitHub API returns *"Repository settings writes are not permitted through this proxy."* Closing a PR does **not** delete its head branch here; enabling "Automatically delete head branches" and deleting leftover branches are **owner UI actions** a session cannot perform. (That setting also only fires on *merge*, not *close*.)

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

**Last completed:** Help-site data sync + README security + dead-code cleanup (2026-08-02). Fixed the live `help.javavolcano-touroperator.com` (develop) site's residual data drift and hardened ops docs — 4 PRs, all merged + deploy-verified (help deploy run #317 green):
- **#129 live content residuals** — surfaces still contradicting the corrected canon: Stefan Loose (kept ISBN `9783770167654` + page 287; dropped unsupported year / "4th edition" / DuMont) across `verify-jvto/{page,press-recognition,legal}` + `verifyFaqs.ts` + tours hubs; Booking.com award `2016→2015` (9.2→9.4); forbidden review count **"112"** in `TourCard.tsx` + `TourDetail.tsx` + `student-package/[slug]/page.tsx` rewired to canonical `@/lib/jvtoReviews` (schema `AGGREGATE_RATING` 4.8/51; display `getCanonicalReviewStats().total` 4.8/195). content-drift 19→18.
- **#130 README secrets** — the **public** repo's `README.md` had committed live credentials (Hostinger, root SSH, GitHub PAT, Mailgun, Postgres/PgBouncer/Metrics, Adminer, Grafana). Removed → secure-storage pointers + de-staled the runbook. **Owner MUST still rotate all of them + purge git history** (cannot be done from a session).
- **#131 runbook Node-20** — manual deploy/rollback snippets now mirror deploy.yml (`nvm use 20` + `PM2_BIN`); `--ref main`=help / `--ref live`=prod clarified (2 Codex P2s).
- **#132 dead-code cleanup** — deleted unimported `HealthScreeningSpotlight.tsx` + `SSOTRenderer.tsx` + `src/lib/whyjvto/` (ssot.ts + fixed4.json), retired `dbPageSnapshots.json` **and its producer** `scripts/export-public-page-snapshots.mjs` + its ingest instruction (Codex P2); fixed stale ISBN in the live-imported `content/why-jvto-ssot.json`. lint 131→130.
- New **Deployment & Hosting** section added to this file (the pipeline was undocumented — had to be researched).

**Prior sprint (2026-08-02) — Surat-sehat evidence + cross-repo sync consolidation.** Owner supplied the BSrE-signed sample Ijen health certificate + Dr. Danu's SIP; propagated evidence-first across all three repos and landed it in `main`:
- **Evidence stored upstream** (private source repo, PII-safe): SIP + sample surat sehat in llm-wiki `raw/evidence/credentials/` (evidence E007, E019). Per-certificate BSrE signature promoted *corroborated → evidenced (signature format only)*; OKF `policies/ijen-health-screening` Limitation + the trust-bundle C4 narrative updated; jvto-web non-synced surfaces (`docs/CANONICAL_FACTS.md`, `verify-jvto` `DigitalDocument` JSON-LD, `public/llms-full.txt`) carry the BSrE / QR-verifiable / SIP-traceable wording.
- **Claim discipline (two Codex rounds):** narrowed to the *evidenced signature format* — dropped "gate-verified/accepted digital document", the absolute "can't be faked", and a false "cited via source_refs" (the derived `policy-cards.json` carries no `source_refs` field). Kept the owner's anti-fraud framing (real/accountable vs self-issued) and mandatory-screening wording.
- **Fixed the sync deadlock** (see "Cross-Repo SSOT Sync" above): landed a consolidated all-five-bundle sync (#126) into `main`; closed the deadlocked per-producer sync PRs #88/#125. Leftover `automation/sync-*-main` branches couldn't be deleted (proxy blocks ref-deletion) — owner UI action.

**Prior sprint (2026-07-31) — cross-repo fact-correction pass** (llm-wiki + OKF as sources, closing pre-PDF blockers open since 2026-05-26):
- **OKF had no sync pipeline into jvto-web at all** — `src/data/okf/*.json` was a one-shot hand snapshot (commit `863db8c`) with no manifest/CI gate, silently drifted to the pre-2026-07-06 *conditional* Ijen-screening wording OKF itself had already dropped, and was live on ~13 `/travel-guide/*` pages via `agentGuides.ts`. Built `scripts/sync-okf.mjs` + `scripts/validate-okf-consumption.mjs` (route coverage + divergence-from-source check), wired into `ci.yml` + new `sync-okf.yml` (mirrors `sync-llm-wiki.yml`), and matching CI in the OKF repo itself.
- **Two content-drift gate gaps let the conditional wording ship undetected**: `blue-fire-guarantee` flagged the *canonical* negated wording as a violation (why a hand-edited OKF snapshot drifted to "cannot be promised"), and a second, undocumented duplicate of the scan loop in `validate-content-drift.mjs` bypassed `contentDriftRules.mjs`'s shared logic entirely. Both fixed; conditional wording fixed everywhere it had spread (agentGuides.ts, tours hub, CMS seed, why-jvto-ssot, llms-full.txt, llm-wiki's own `packages-overview.md` + a blog post that had been missed by the 2026-07-07 sweep).
- **Stefan Loose contradiction — resolved, not owner-adjudication-pending.** llm-wiki (DEC-001, 2026-06-25) and OKF (`references/stefan-loose-indonesien-3770167651`, last_verified 2026-06-26) independently agree: ISBN-13 9783770167654, page 287, no year/publisher/edition asserted. jvto-web was publishing a *different* ISBN (978-3-7701-7881-0) plus an unsupported 2018/4th-edition claim across `entityGraph.ts`, `verify-jvto/page.tsx`, `press-recognition/page.tsx`, `buildVerifySchemas.ts`, `verifyFaqs.ts`, `evidenceRegistry.ts`, and CMS `page_sections.json`. Fixed everywhere.
- **Two related invented-date bugs found in the same pass** (caught by widening `wrong-founding-year`): CMS `page_sections.json` asserted "incorporated PT Java Volcano Rendezvous on 2016-01-01" and `OurStoryPage.tsx` (live, imported by `why-jvto/page.tsx`) asserted "Operating Since 2016" / "Incorporated in 2019" — both directly contradicting this file's own already-published facts lock (`docs/CANONICAL_FACTS.md`'s adjudication table explicitly rules "Incorporated 2016" unsupported). Fixed both.
- **Crew count resolved: 14 (7 guides + 7 drivers)** — confirmed by llm-wiki, OKF, and jvto-web's own `buildCrewSchemas.ts` persona list. `/team` page's stale `"11"` fallback fixed to `"14"`.
- **KTA card identifiers — populated for 11 of 14 crew** (OKF `credential_state: confirmed`); yusuf/dika/pras correctly left unset (`credential_state: pending`). `NAMED_GUIDE_PERSONAS` (in `buildCrewSchemas.ts`) turned out to have zero consumers — dead code — so the actual live path (`getActiveCrewMembers()` → `/team/page.tsx` → `buildCrewPersonSchema()`) was wired directly with an in-process lookup keyed by `crew_members.code`, since `crew_members` has no `kta_id` column and this session had no `DATABASE_URL`/`.env` to migrate one. **Real gap still open:** the DB itself has nowhere to store KTA data long-term; the lookup is a stopgap.
- **ISIC over-claim fixed**: OKF marks `trust/partners/isic` as the one concept `needs_review` (not release-eligible — provider directory entry unrenderable as of 2026-07-07), but `entityGraph.ts` + `tourFaqs.ts` asserted "verified ISIC partner" globally. Downgraded to "registered ISIC provider", matching wording `/isic/student-package` already used.
- **`reviewCount: 112` (forbidden per facts lock) replaced** in 24 identical copy-pasted spots across `data_new.ts` (live homepage/booking/carousel/quote-form) and `mockData.ts` (Testimonials, TourCard, `/api/packages`, `/api/destinations`) with the canonical Trustpilot-primary figure (4.8/51), matching `jvtoReviews.ts`'s already-correct `AGGREGATE_RATING`.
- **`tsconfig.json` `moduleResolution: node` → `bundler`** — `node`/`node10` was fatal at config-parse (TS5107), meaning the previously-documented "3 pre-existing errors" baseline was unmeasurable in a fresh checkout. `node_modules` also wasn't installed in this environment; `npm ci` fixed that. Real current baseline: **2 pre-existing errors**, both the known dead imports in `HomePage.tsx` (`./Hero`, `./TravelGuideTeaser` — files don't exist, component isn't reachable from `src/app/`, build-safe). Doc-comment precedence fixes: `DEFINED_TERMS` table corrected ×7→×9 (was missing ISIC/INDECON); FAQ resolver precedence corrected 3-tier→4-tier (was missing the `cms-seed` tier, which is actually highest-precedence).
**Completed date:** 2026-08-02
**Build status:** `npm run validate` (schema + routes + content-drift + itinerary + OKF consumption) PASS; content-drift at the **18-hit/13-bucket** baseline. `npm run lint:gate` PASS (**130-error** baseline). `npx tsc --noEmit`: 2 pre-existing dead-import errors only (`HomePage.tsx` → `./Hero`, `./TravelGuideTeaser`), zero new. `npm run build` needs Postgres (`DATABASE_URL`) — not attempted here, not a failure. Latest: #129/#130/#131/#132 all merged (`verify` green); help deploy run #317 green.
**Next task:** Owner direction needed. Open paths: (A) **Phase 2 of PDF plan** (`~/.claude/plans/sementara-ini-aku-butuh-tingly-diffie.md`) — email-gated download (NextAuth magic-link + Nodemailer + new `pdf_downloads` model). (B) the separate `live` sync backlog (#116) — owner-promoted per governance. **Done 2026-08-02:** sync design hardened (consolidated into `sync-artifacts.yml` — all-bundle, deadlock-proof, `policy-bundle` covered); "Automatically delete head branches" enabled + leftover `automation/sync-*-main` branches deleted.
**Open items:**
- **KTA card identifiers now use a real `crew_members.kta_id` column** (added + backfilled per `sql/crew_members_kta_id.sql`, claimed applied to jvto_dev + prod `jvto`; read live by `getActiveCrewMembers()` in `crewMembers.ts` → `buildCrewPersonSchema()`). 11/14 crew populated (yusuf/dika/pras NULL by design). The older "no column / in-process stopgap" note is **resolved/stale**. Residual: re-verify the prod `jvto` backfill (`SELECT code, kta_id FROM crew_members`) if crew changes.
- `reviewApiSnapshots.json` (`src/lib/publicContent/generated/`) — `stats` block is correct (51/123/21/195); the `feed` array (**153 items**) is the ingested DB subset and is **legitimately smaller** than `stats.total` by design (see `jvtoReviews.ts` note) — but its platform split (40 TP / 92 Google / 21 TA) undercounts Trustpilot vs the canonical proportions. Regenerate via `scripts/export-public-review-api-snapshots.mjs` (needs `DATABASE_URL`) — do not hand-edit.
- Auto-sync is now the **consolidated `sync-artifacts.yml`** (2026-08-02), driven by both producers' `repository_dispatch` (`llm-wiki-master-updated` + `okf-main-updated`, both confirmed firing) — the former per-producer `sync-llm-wiki.yml` / `sync-okf.yml` are removed. `workflow_dispatch` remains the manual fallback.
- `okf/customer-sales-release/jvto/release-manifest.json` has `customer_traffic_ready: false` — `src/data/okf/_manifest.json` (jvto-web-side) surfaces this flag; worth understanding what "traffic ready" gates before treating that data as fully trustworthy long-term.
- `okf/jvto/scripts/validate_customer_sales_release.py` exists but isn't wired into the OKF repo's own CI, and currently reports one false-positive ("forbidden term: vendor" — matches a legitimate policy-copy sentence about non-recoverable vendor cost, not a real leak). Not fixed this sprint — out of scope.
- NEXT_PUBLIC_MAPBOX_TOKEN only in .env.local — must add to Vercel preview/prod env before deploy
- mapbox-gl install introduced 44 npm audit findings (12 high, 2 critical) — review before deploy
- Design atlas screenshots gitignored — regenerate after server restart: `npm run dev` → `node scripts/generate-design-atlas.mjs`
- booking-2015-plaque.jpg XMP shows "AI-Generated Content: Yes" (Canva) — owner must verify real plaque photo vs. mock-up
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

## Guardrails (feat/schema-spine worktree — from 2026-06-12 handoff)

> Note: the handoff referenced a "Guardrails section" to copy verbatim, but the section
> itself was not included in the handoff message and was not found in `.remember/`,
> `docs/`, or `~/.claude/plans/`. The constraints below are transcribed verbatim from the
> handoff's own explicit instructions, which function as the guardrails.

- Do not ask questions unless you hit a real blocker (credentials, new deps, deletion,
  live branch, sync/deploy workflow, env failure, PR merge). Otherwise assume the safest
  in-scope option, document it, and continue.
- Work only in this worktree (`../jvto-web-schema-spine`, branch `feat/schema-spine`).
  Never touch the live branch.
- NO dummy/fake DB — Package 1 needs no production DB.
- If Prisma requires DATABASE_URL:
  - use an existing local/dev .env ONLY if already present and clearly not production
  - do NOT invent or hardcode a fake DATABASE_URL
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
