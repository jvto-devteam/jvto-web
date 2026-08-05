# Rollback Plan (repo-grounded)

> **Milestone 0 baseline artifact** grounded in
> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](JVTO_TECHNICAL_PROJECT_HANDOFF.md) §21 (rollback design), §19
> (CI/CD gates), §26 (known unknowns requiring owner discovery). Adapts the §21 four-part rollback to
> the **real deploy pipeline** in this repo. Companion: [risk-register.md](risk-register.md),
> [legacy-freeze-list.md](legacy-freeze-list.md). Branch `claude/reconcile-live-into-main`. Every
> path grep-confirmed; no facts invented.

**Deploy topology (grep-confirmed).** `main` auto-deploys to the **help/preview** box
(`/var/www/jvto-help`, PM2 `jvto-help`, `help.javavolcano-touroperator.com`, **noindex**) via
`.github/workflows/deploy.yml` (`appleboy/ssh-action` → SSH → `git reset --hard $APP_COMMIT_SHA` →
`npm ci` → `npm run build` → `pm2 restart jvto-help --update-env`). `live` → production is
**owner-promoted only** (`main → live` PR); its on-box specifics (dir / branch ref / PM2 process)
are **not assumed identical to help** — verify the `live` branch's own `deploy.yml` before any
production rollback. Production promotion + `PRODUCTION-VERIFIED` are **owner actions** (§25).

## 1. Code / frontend rollback (§21)

| Control | Repo evidence | Procedure |
|---|---|---|
| Immutable build artifact per commit | `deploy.yml` exports `APP_COMMIT_SHA="${{ github.sha }}"` before `npm run build`, carried into `pm2 restart --update-env` | Each deploy is pinned to one commit; the box serves exactly that tree (`git reset --hard $APP_COMMIT_SHA`, not a moving `origin/main`). |
| Exact-SHA verification gate | `src/app/(api)/api/build-info/route.ts` (`force-dynamic`, `no-store`) returns `{commitSha, environment, siteOrigin, nodeEnv}`; `deploy.yml` "Verify deployment" step runs `scripts/smoke-why-jvto.mjs` (waits for `/api/build-info` == pushed SHA, then 6×200 + canonical + single FAQPage + 11/7/4 crew + forbidden-claim checks) | If `commitSha` ≠ expected or smoke fails, the deploy workflow fails — treat as not-deployed. |
| Revert path (preview) | `main` history + `deploy.yml` trigger (push to `main` or `workflow_dispatch`) | Revert the offending PR/commit on `main` → the revert push re-runs `deploy.yml` → box resets to the reverted SHA. Confirm via `curl -s https://help.javavolcano-touroperator.com/api/build-info` (`commitSha` matches) and `curl -sI …/` still shows `x-robots-tag: noindex`. |
| Revert path (production) | `live` branch, owner-promoted | **Owner action.** Record the previous production SHA before promote (§19 production workflow); roll back by promoting/redeploying that SHA. Do **not** run the help `deploy.yml` sequence against production — it hard-codes the help dir/process (see [risk-register.md](risk-register.md)). |
| Concurrency safety | `deploy.yml` `concurrency: deploy-help-main` (`cancel-in-progress: false`) | Serializes deploys (one running + one pending; pending coalesces). Does **not** guarantee every intermediate SHA deploys — always confirm the landed commit via `/api/build-info`. |
| Feature flags for new read paths | Not yet present (Milestone 1 target, §16) | Until a flag mechanism exists, rollback is **revert + redeploy**, not flag-off. New read paths should ship behind a flag (§21) once Milestone 1 lands. |

**Rollback window:** the old frontend remains deployable through the agreed window (§21) — the prior
SHA is always redeployable via `workflow_dispatch` after reverting, since `git reset --hard` can
target any commit on `main`.

## 2. Database rollback (§21)

| Control | Status | Procedure |
|---|---|---|
| Additive migrations first | Target (expand–migrate–contract, §14.2) | No destructive rollback dependency after data writes. Contract phase (drop columns/tables) only after zero-reference proof + owner approval (§14.2 step 7, AD-10 for `content_pages`). |
| Backup / restore before destructive change | **§26 owner-discovery — NOT verified in repo** | "Current VPS filesystem/deploy scripts and backup restoration proof" is an explicit §26 unknown. **Backup/restore drill (§13.2) must be proven by the owner before any destructive migration.** No backup mechanism is represented in the repo (`.env.local` DB creds are VPS-local, not in Git). |
| Read-path feature flag before contract | Target (Milestone 1) | Switch reads via versioned repository/flag before dropping the old path; keep old readable through the window. |
| Resumable / idempotent backfill | Target (Milestone 4/5) | Backfill scripts must be batched, resumable, idempotent (§14.2 step 2). |
| Catastrophic restore | Owner + §26 discovery | Restore from verified backup only. Destructive migration is **owner-gated** (§25.4); financial migration report owner-reviewed (Milestone 4 exit). |

**Current DB reality:** `DATABASE_URL` → `jvto_dev` (dev) / `jvto` (prod) at `31.97.223.43`;
production schema, triggers, views, row counts, and migration state are §26 discovery outputs. Run
the §14.1 pre-migration audit (introspect, diff vs `prisma/schema.prisma`, read/write path
inventory, PII/financial classification) **before** altering any model.

## 3. Integration rollback (§21)

| Integration | Status | Procedure |
|---|---|---|
| Payment (Xendit) | **§26 discovery** — signature/retry/refund/reconciliation impl unverified | Adapter must be independently disable-able; webhook receipts stored for replay; verify signature before projection; idempotency on provider event ID (§7.5, §11). Failed delivery → exception, never data loss. Until the current impl is discovered, treat webhook idempotency as a **bounded risk**, not a proven control. |
| Email (Mailgun + Nodemailer) | Configured (env); delivery semantics not versioned yet | Failed send → retry with bounded policy → operations exception (§10.2); a failed notification must **not** roll back a valid payment record (§7.5). |
| WhatsApp gateway | **§26 discovery** — provider/contract/delivery semantics unknown | Same disable-independently + stored-receipt pattern (§10, §11) once the contract is discovered. |
| Partner channels (GetYourGuide/Klook/agency) | Not built (Milestone 6) | Adapter pattern (§11): per-channel disable, idempotency on external reference, unknown-product quarantine, exception queue — no silent overwrite of a manually amended booking. |
| Cross-repo sync (`sync-artifacts.yml`) | Active | "Rollback" = revert the sync PR on `main`; the drift gate (`verify`) re-checks against producer heads. Never hand-edit `src/data/*` to roll back — fix at the producer, recompile, re-sync. |

Event-handler versions must stay backward-compatible during the deployment window (§21); the outbox/
event layer (§7.7) that this depends on is a Milestone 1 target.

## 4. Content rollback (§21)

| Control | Repo evidence | Procedure |
|---|---|---|
| Revert the content commit | `content/pages/**`, `content/entities/**`, `content/faqs/**` (Git-owned, P-02) | Revert the `content/` commit on `main` → deploy re-runs (served content Markdown/JSON **does** deploy; only root `*.md` + `docs/**` are deploy-skipped, `deploy.yml paths-ignore`). Regenerate outputs (`/llms.txt`, sitemap) rebuild from the reverted tree. |
| **No legacy fallback for migrated routes** | AD-10; `getPublicPageSnapshot` runtime guard (Package 05c); `MIGRATED_STATIC_ROUTES` (`src/lib/static-content/migratedRoutes.ts`) | A migrated route reads **only** `content/` — reverting content does **not** silently re-open the DB/seed/snapshot path, and it must not. Do **not** reactivate old writers or DB fallback as a rollback (§21 explicit). If content is missing, the route fails validation / 404s (AD-06) rather than querying a legacy source. |
| Facts-lock guard on revert | `scripts/validate-content-drift.mjs` (scans `content/`), `validate-static-route-ownership.mjs`, both blocking in `ci.yml verify` | A revert that reintroduces a forbidden claim (2016, conditional Ijen health, "ISIC Partner", stale review counts) fails `verify` — the revert cannot ship. |
| Non-migrated routes | Legacy sources still active (see [legacy-freeze-list.md](legacy-freeze-list.md)) | For not-yet-migrated routes, content rollback = revert the source (seed/snapshot/`src/data` producer or upstream producer + re-sync), per that source's own path. |

## Cross-cutting

- **Owner-gated steps (§25):** merge, `main → live` promotion, production redeploy/rollback,
  destructive DB migration, and legacy deletion are **owner actions**. Engineering prepares the
  revert, drives `verify` green, verifies on the help box (PREVIEW-VERIFIED), and stops at
  `READY FOR OWNER`.
- **Help ≠ live.** The help pipeline above is documented and grep-confirmed; the production (`live`)
  pipeline's dir/ref/PM2/backup specifics are **owner-verified on the `live` branch**, not assumed
  identical. Verify before acting on production.
- **IndexNow / analytics are never a rollback trigger** (§19): a healthy deployment is not rolled
  back for a failed URL submission or crawler telemetry.
