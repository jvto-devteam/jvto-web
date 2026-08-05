---
name: jvto-ci-recovery
description: Diagnose and respond to a FAILED jvto-web GitHub Actions run ("Deploy to VPS" help deploy or "CI") from its logs, deterministically — never from memory or a "known flaky" hunch. Use when a deploy/CI run fails, when asked to re-run/retry/fix/babysit a red run, or when a help/preview deploy did not land (build-info shows the wrong SHA, a route 404s). Reads scripts/ci/failure-signatures.json + runs scripts/ci/classify-workflow-failure.mjs on the failed run's logs to get a class (SSH_TCP_TIMEOUT | SSH_AUTH | REMOTE_BUILD | DEPLOY_PROOF | DATABASE_INFRA | UNKNOWN), whether a retry is allowed, evidence lines, and the owner action. Enforces: the CI Recovery workflow owns the one bounded transient retry, so the agent must NOT poll with timers or manually re-run for a transient timeout; only auth / database / deploy-proof / unknown need an owner. Does NOT merge, deploy, promote, or run PR code.
---

# JVTO CI Recovery

The recurring failure is not the CI logic — it is a **transient VPS-SSH transport
timeout** (`dial tcp ***:22: i/o timeout`) on the help deploy and the
`build-develop` job. The wrong response is to call it "known flaky" from memory
and manually re-run on a timer. The right response is **classify from the log,
then act on the class** — and let the `CI Recovery` workflow perform the single
bounded retry it is built for.

This skill makes that response mechanical. It never classifies from history, run
count, elapsed time, or narrative — only from signatures present in the failed
run's logs.

## Activation guard

Activate when working in jvto-web / JVTO **AND** one of:

- A GitHub Actions run for **"Deploy to VPS"** or **"CI"** ended in `failure`.
- The user asks to **re-run / retry / fix / investigate / babysit** a red run.
- A **help/preview deploy did not land** — `/api/build-info` reports the wrong
  commit SHA, a migrated route 404s, or the live smoke failed.

Do **not** activate for: a green run, a content/fact question (use
`facts-locked-web`), or production promotion (owner-only, always out of scope).

## The one rule

> **CI failures are classified from logs, never from memory. Only the CI Recovery
> workflow may perform one bounded transient retry. Do not create timers,
> scheduled check-ins, or additional retries.**

The phrase **"known flaky" is banned unless you can name the matched signature**
(e.g. "SSH_TCP_TIMEOUT via `dial tcp`"). No signature → not "flaky", just
"unclassified — inspect".

## Step 1 — Classify (always first)

Get the failed run's id + `run_attempt` + workflow name (GitHub Actions tools or
the run URL). Fetch the failed logs and classify:

```bash
# logs via gh in a runner, or paste/download the failed step log locally:
node scripts/ci/classify-workflow-failure.mjs --log failed.log --attempt <N> --workflow "<name>"
```

Output is the single source of truth: `classification`, `matchedSignature`,
`transient`, `retryAllowed`, `retryReason`, `evidence[]`, `ownerAction`. **Do not
form a verdict before this runs.** If no signature matches, the class is
`UNKNOWN` — that is a real answer, not a reason to guess.

The registry (`scripts/ci/failure-signatures.json`) is the authority for the
classes and the retry bound; the classifier just applies it. Categories are
evaluated with the only retry-granting class (`SSH_TCP_TIMEOUT`) LAST, so any
non-transient signature pre-empts a retry.

## Step 2 — Act on the class (and only the class)

| Class | Transient | Who acts | Agent action |
|---|---|---|---|
| `SSH_TCP_TIMEOUT` | yes (attempt 1) | **CI Recovery workflow** | **Nothing to retry.** The workflow re-runs failed jobs once automatically. Do **not** poll with a timer and do **not** manually re-run. Just report the class + that recovery will handle attempt 1. If it recurs at attempt ≥2, escalate as below. |
| `SSH_AUTH` | no | **Owner** | Report; ask the owner to verify/rotate the SSH key + user/host secret. No retry. |
| `DATABASE_INFRA` | no | **Owner** | Report; ask the owner to check the Postgres service container / DB availability. No retry. |
| `DEPLOY_PROOF` | no | **Owner (+ maybe a code fix)** | SSH succeeded but the box didn't verify (SHA mismatch / smoke). Report the evidence; a re-run alone won't fix it. If it's a code/content bug in scope, fix it on the branch; otherwise it's an owner/box item. |
| `REMOTE_BUILD` | no | depends | The build failed on the box. If the fix is in scope, fix it and push; else report. No blind re-run. |
| `UNKNOWN` | no | **Owner** | No signature matched. Report the raw evidence and ask the owner; if it's a new recurring class, add a signature + fixture (Step 3). No retry. |

**Retry ceiling:** never exceed `maxRetry` for the class (1 for `SSH_TCP_TIMEOUT`,
0 for everything else). The retry is the workflow's job on attempt 1 — you never
issue a second one. `retryAllowed:false` means stop, not "try again yourself".

**No timers.** Because the workflow owns the transient retry, do not schedule a
`send_later`/check-in or a polling loop to "wait and re-run". Report the terminal
classification and stop. (Watching a PR you own for review/CI events via the
normal subscription is fine; a timer to manually re-run a transient timeout is
not.)

## Step 3 — Only if a NEW recurring class appears

If a failure is genuinely new and recurring and classifies as `UNKNOWN`, add a
matcher to `scripts/ci/failure-signatures.json` **and** a fixture +
expected-verdict row (`scripts/ci/fixtures/ci-recovery/*.log` +
`SELFTEST_CASES`), then `npm run test:ci-classifier`. Keep the retry bound intact
— only `SSH_TCP_TIMEOUT` is transient, nothing may set `maxRetry > 1`. This is a
normal in-scope code change on a feature branch → PR; it is not an owner action.

## Stop condition

Stop after the terminal result: a class, the evidence, the decision (retry owned
by the workflow, or owner action named), and — if in scope — a pushed fix. Do not
promote to production, do not merge, and do not keep polling.
