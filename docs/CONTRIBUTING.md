# Contributing — jvto-web

> **Model (locked 2026-07-05, governance W0):**
> **`main` = bengkel tunggal (single workshop). `live` = production release pointer.**
> All development happens on `main` via feature-branch PRs. `live` only moves when the
> owner explicitly commands a promote. Never work directly on `live`.
>
> Canonical content facts are locked separately in [`docs/CANONICAL_FACTS.md`](CANONICAL_FACTS.md).

## Branch model

```
feature branch (claude/*, codex/*, feat/*, fix/*, …)
      │  PR → main  (CI `verify` must be green)
      ▼
    main  ──deploy.yml──▶  help.javavolcano  (preview server — true preview of next production)
      │  PR promote `live ← main`  (created ONLY on explicit owner command; CI `verify` runs)
      ▼
    live  ──VPS pull──▶  production
```

## Rules

### 1. All work goes through `main`

- Every change — code, content, docs, schema — is developed on a **feature branch** and
  lands via **PR to `main`**. The CI `verify` job must be green before merge.
- No direct commits to `main` except the automated volcanic-status bot
  (`.github/workflows/update-volcanic-status.yml`, daily data-only commit).

### 2. `live` is a release pointer, not a workspace

- `live` accepts **only**:
  1. **Promote PRs `live ← main`** — created exclusively on an explicit owner command
     ("promote `<scope>` ke live"). These PRs go through the same CI `verify` gate as
     PRs to `main` (enforced in `.github/workflows/ci.yml`).
  2. **Volcanic-status data** from the automated bot — the sole data-only exception.
     `.github/workflows/update-volcanic-status.yml` fetches MAGMA **once**, commits the
     result to `main`, then a second job (`sync-live`) copies the exact committed
     `public/ops/volcanic-status.json` onto `live` **the same day** — no manual promote,
     and no empty commits on days without status changes. A synced change pushes `live`,
     which triggers live's own deploy workflow (production rebuild + `pm2 restart`) —
     an accepted, intentional effect (owner decision 2026-07-05): production volcanic
     status must never go stale between promotes.
- **No feature commits directly on `live`. Ever.** Not for "small fixes", not for
  urgent copy changes.
- **Emergency hotfix procedure:** fix on a feature branch → PR to `main` → merge →
  cherry-pick PR to `live` labeled **`hotfix`**. `main` always receives the fix first
  so it never falls behind production.

### 3. Agent branches are ephemeral

- Branches created by coding agents (`claude/*`, `codex/*`) exist only to carry one PR.
  **Delete them after merge.** They must never become long-lived integration branches.

### 4. Generated snapshots and artifacts

- Files under `src/lib/publicContent/generated/*` and `src/data/*` are **never
  hand-edited**. They change only via the official export/sync scripts
  (`npm run sync:packages`, `sync:trust`, `sync:blog`, and future `sync:*` pipelines).
  CI verifies synced bundles against the producer repo and fails on drift.

### 5. Single brand-config source

- Brand facts (founding year, contacts, review counts, addresses, legal identifiers)
  have exactly two homes: [`docs/CANONICAL_FACTS.md`](CANONICAL_FACTS.md) (the
  adjudicated human-readable lock) and `src/lib/site-config.ts` (the runtime single
  source of truth). They must agree; the facts lock wins on conflict.
- **Never create a second brand-facts config file** — no root `*-config.json` or
  similar, from any session, human or agent. Precedent: `jvto-config.json` (root,
  zero importers, wrong facts) sat unnoticed contradicting the lock. If you find such
  a file, report it as a deletion candidate — do not edit, extend, or preserve it.

## Pre-push gate (run before every push/PR)

| Gate | Command | Pass condition |
|---|---|---|
| Lint | `npm run lint:gate` | PASS — no bucket in the committed per-file/per-rule baseline (`scripts/lint-baseline.json`, 141 pre-existing errors) may grow; fixing legacy errors elsewhere cannot offset a new one. Fixed legacy errors → `node scripts/lint-gate.mjs --update` + commit. |
| Typecheck | `npx tsc --noEmit` | Does **not exceed baseline**: exactly **3 dead-import errors** (`HomePage.tsx`/`ReviewsPage.tsx`). The historical "+42 in checkout/booking flow" was re-measured 2026-07-05 on `main` (post-#62/#63/#64): **0 remain** — any checkout/booking tsc error today is NEW, not legacy. Any new error = regression, fix before PR. |
| Validators | `npm run validate && npm run validate:packages` | Green |
| Build | — | Do **not** run full `npm run build` in a sandbox (SSG needs Postgres). Build verification happens via the CI `build-develop` job and the help deploy after merge — by design. |

## Database guardrails

- Prisma points at the shared production/dev database (`31.97.223.43`). From a working
  session: **no migrations, no seed, no raw DELETE/UPDATE, no `prisma db push`.**
  Reads are allowed only when a phase explicitly requires snapshot regeneration.
- Credentials are never committed.

## Legacy proxy = hard boundary

- `checkout/*`, `my-booking/*`, `api/checkout*`, `api/booking/*` talk to the legacy
  backend that processes real money. Changes there are limited to what a phase
  explicitly specifies — no opportunistic refactoring.

## Commits & PRs

- **Conventional commits**, one logical change per commit.
- Every PR description states: **scope, main files touched, and gate results.**
