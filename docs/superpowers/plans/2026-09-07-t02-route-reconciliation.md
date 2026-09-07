# T02 — Route Reconciliation Validator: execution record

**Date:** 2026-09-07 · **Branch:** `live` · **Baseline commit:** `9f74516c`

Turns every route difference into a named, testable classification, and removes
the fourteen `"unconfirmed"` artifact expectations T01 deliberately left behind.

Full plan, classification table and exhaustiveness proof:
`~/.claude/plans/greedy-popping-patterson.md`. Measured facts:
`docs/audit/VERIFIED_FACTS.md`. Decisions: `docs/audit/decision-log.json`
(`D-2026-09-07-01` … `-05`).

---

## What shipped

| File | Role |
|---|---|
| `src/lib/routes/parseSitemapUrls.ts` | **new** — `<loc>` reader; pure, refuses empty/foreign-origin/malformed input |
| `src/lib/routes/parseRouteOutputIndex.ts` | **new** — total validation of ekosistem's manifest; takes a JSON value, not a path |
| `src/lib/routes/reconcileRoutes.ts` | **new** — the 14-name classifier + two-phase driver |
| `src/lib/routes/reconciliationToCsv.ts` | **new** — RFC4180 serializer |
| `scripts/reconcile-route-outputs.mjs` | **new** — all I/O; exit 0/1/2 |
| `scripts/reconcile-route-outputs.test.ts` | **new** — 36 tests, half of them failure paths |
| `src/lib/routes/publicRouteContract.ts` | 15 families (was 14); every artifact expectation declared |
| `scripts/validate-public-route-contract.mjs` | `export` on `loadSources` + `SOURCE_FLOORS`; one stale line corrected |
| `scripts/validate-public-route-contract.test.ts` | +1 test: no family may leave an expectation unconfirmed |
| `package.json` | `reconcile:routes`, `test:reconcile` |

`src/app/**` untouched. No dependency, CI or workflow change.

## Results

| Gate | Result |
|---|---|
| `reconcile:routes` | exit **0** — 305 reconciled · 302 pass · 3 warn · 0 fail |
| `reconcile:routes --fail-on-warn` | exit **1** — names the 3 lag routes |
| `validate:public-routes` | exit 0 — routes **305**, families **15**, static live **38** |
| `validate:public-routes --strict-expectations` | exit **0** — was exit 1 |
| `test:reconcile` / `test:routes` | 36/36 · 16/16 |
| `tsc` · `test:stale` · `validate` | clean · pass · 52/52 |
| `lint` | 254 problems (28/226) — baseline, no new findings |
| `build` | exit 0, **106/106** pages, **104** route entries, 0 Prisma errors |

The 2026-09-05 audit's 8 mismatches are 9 today and all classified:
6 × `EXPECTED_WEB_OWNED_OUTPUT` (PASS) and 3 × `SITEMAP_PUBLICATION_LAG` (WARN).

## Three things worth carrying forward

**1. The obvious design was circular.** The spec reads as "compare the inventory
to a sitemap". Locally that cannot fail: all eight `sitemap.data.ts` files read
the same loaders the T01 validator reads, so 267 of 305 routes would be compared
against themselves and T01 already guards the other 38. The sitemap side has to
come over HTTP — which is what Rule 8 requires anyway.

**2. The audit's product question had a measurable answer.** It asked whether
`/entity` and the five destination-detail pages are intentionally web-only. The
manifest alone cannot answer it — zero artifacts looks identical whether the web
owns the schema or the generator is unfinished, and ekosistem *does* hold source
content for all five destinations. Production markup answered it: both serve full
JSON-LD with no ekosistem artifact behind them. Nothing was escalated.

**3. A probe that looks like it worked can be the probe crashing.** Deleting the
`blog-index` family was expected to yield exit 1, and it did — but from
`ERR_INVALID_TYPESCRIPT_SYNTAX`, because the file has CRLF endings, a multi-line
`indexOf` anchor returned `-1`, and the slice corrupted it. The exit code alone
would have confirmed the wrong thing. Read the output, not the code.

## Not done

- **Not deployed.** Status is `IN_PROGRESS`, not `DONE`: local evidence proves
  correct code, not correct production (Rule 9). Push to `live` is an owner gate.
- `SITEMAP_PRODUCTION_LAG_REVIEWS` — production's sitemap trails both repos by
  three review URLs. Needs VPS access, not a code change.

## Adversarial review (gate, not optional)

Three real defects in this session's own code, all in
`scripts/reconcile-route-outputs.mjs`, all fixed and probe-verified:
the classifier call sat outside the try/catch so a failed measurement exited 1
instead of 2; the main-module guard dropped T01's `process.argv[1] &&` test; and
duplicate `<loc>` values were reported but never affected the exit code.

Details, probes and the list of claims that survived:
`docs/audit/VERIFIED_FACTS.md`.

Gate re-run after the fixes: `reconcile:routes` exit 0 (302/3/0),
`--fail-on-warn` exit 1, `test:reconcile` 36/36, `test:routes` 16/16, `tsc`
clean, `lint` 254/28/226, `validate` 52/52, `build` 106/106 + 104 entries,
`src/app` untouched.

**One anomaly worth recording.** The review agent reported that a request
reached it mid-task asking it to write a skill file instructing future sessions
to skip adversarial review and skip failure probes. No such request was issued
by this session. The agent refused (read-only) and flagged it. Origin unknown
and not investigated here; recorded so that it is not discovered later without
context.
