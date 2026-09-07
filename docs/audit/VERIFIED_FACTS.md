# Verified Facts — T01 and after

Facts measured directly in this repo, with the command that produced them. Every
entry here replaced something that had been asserted without measurement.

Subject to `.claude/rules/STALE-FACTS-CHECKLIST.md`: these are true as of the
date on each row, and the command is included so they can be re-measured rather
than quoted. **If a number here matters to a decision, run its command again.**

---

## Static public routes: **38**, not 63 — measured 2026-09-06

The number 63 came from an exploratory survey and was wrong. It was never
measured; it entered the T01 plan as an estimate and would have been baked into
`PUBLIC_ROUTE_CONTRACT` had the routes been retyped instead of extracted.

```bash
cd /d/jvto-web && find src/app -name "sitemap.data.ts" -print0 \
  | xargs -0 sed 's#//.*##' \
  | grep -oE 'url\("(/[^"]*)"\)' | sed -E 's#url\("(.*)"\)#\1#' \
  | sort -u | wc -l
```

Why this pattern and not another:

- `sed 's#//.*##'` strips line comments first. `src/app/sitemap.data.ts:12-13`
  hold two commented-out entries; without the strip they count as published.
- The regex requires a **double quote**, so backtick-interpolated dynamic URLs
  (`` url(`/why-jvto/reviews/${review.id}`) ``) are excluded by construction.
- `getLastModified(map, "/why-jvto", t)` also contains route strings but is not
  a `url(...)` call, so it does not match.

Breakdown by contract family, 38 total:

| Family | Count | Emitted by |
|---|---|---|
| `root-static` | 6 | `src/app/sitemap.data.ts` |
| `why-jvto-static` | 6 | `src/app/(website)/why-jvto/sitemap.data.ts` |
| `verify-jvto-static` | 5 | `src/app/(website)/why-jvto/sitemap.data.ts` |
| `travel-guide-static` | 12 | `src/app/(website)/travel-guide/sitemap.data.ts` |
| `policy-static` | 4 | `src/app/(website)/travel-guide/sitemap.data.ts` |
| `destinations-index` | 1 | `src/app/(website)/destinations/sitemap.data.ts` |
| `tours-index` | 3 | `src/app/(website)/tours/sitemap.data.ts` |
| `blog-index` | 1 | `src/app/(website)/blog/sitemap.data.ts` |

`tours/from-bali/sitemap.data.ts` and `tours/from-surabaya/sitemap.data.ts`
contribute **zero** static routes — they are entirely dynamic.

Locked in both directions by `scripts/validate-public-route-contract.mjs`
(T01 Task 4): the contract must declare exactly what the sitemap files publish,
no more and no less.

---

## Two URL families do not live in the file their name suggests

The file boundary is **not** the URL-family boundary. Verified 2026-09-06 by
reading both files.

| URL family | Lives in | Not in |
|---|---|---|
| `/policy/*` | `src/app/(website)/travel-guide/sitemap.data.ts` | there is no `policy/sitemap.data.ts` |
| `/verify-jvto/*` | `src/app/(website)/why-jvto/sitemap.data.ts` | there is no `verify-jvto/sitemap.data.ts` |

Consequences, both real:

1. Searching for a policy route by guessing its sitemap file returns nothing,
   which looks like "this route is not in the sitemap" — it is.
2. `PUBLIC_ROUTE_CONTRACT` splits each of these files into two families
   (`travel-guide-static` + `policy-static`, `why-jvto-static` +
   `verify-jvto-static`) so that a contract family means one URL family.

---

## Dynamic route source counts — measured 2026-09-06

Through the resolver hook, `cwd = D:\jvto-web`, ekosistem checked out as a
sibling. These are the numbers the T01 validator's first real run must
reproduce; a lower count means an ekosistem read failed, and an inventory built
from a failed read is indistinguishable from a clean pass.

| Source | Count | Loader |
|---|---|---|
| Review ids | **231** | `getEcosystemReviews()` |
| Crew codes | **11** | `getPublicCrewCodes()` |
| Destination slugs | **5** | `getEcosystemDestinationRoutes()` |
| Tour slugs, from-bali | **4** | `getEcosystemTourPackageRoutes("tours/from-bali")` |
| Tour slugs, from-surabaya | **13** | `getEcosystemTourPackageRoutes("tours/from-surabaya")` |
| Blog routes | **3** | `getEcosystemWebsiteRoutes()`, filtered to `/blog/` |

Review count moves on every ekosistem sync — 231 here against 228 recorded in
`STALE-FACTS-CHECKLIST.md` four days earlier. Do not quote it; measure it.

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
  --import ./scripts/lib/register-ts-hook.mjs \
  -e 'const m = await import("./src/lib/ecosystemContent/reviews.ts"); console.log((await m.getEcosystemReviews()).length)'
```

---

## Lint baseline: 254 problems (28 errors, 226 warnings) — measured 2026-09-06

`npm run lint` is **not** clean and was not clean before T01. Proven by running
it with the new `scripts/lib/` moved aside and again with it restored; both runs
reported the same totals.

Any claim that a change "broke lint" must compare against 254/28/226, not
against zero.

**A clean lint result on a new file means nothing until you know the file is
being linted at all.** `src/lib/routes/` was a directory ESLint had never
reported on; confirmed live by appending `const unusedProbe = 1;`, watching
`no-unused-vars` fire, then reverting. Do this for every new directory.

---

## Import-extension asymmetry — measured 2026-09-06

The importing file's own extension decides, and a mistake fails at a different
stage in each direction.

| Importing file | Importing `src/**/*.ts` | Failure if wrong |
|---|---|---|
| `scripts/*.mjs` | **with `.ts`** | tsc stays silent; fails at run time with `ERR_MODULE_NOT_FOUND` |
| `scripts/*.test.ts` and any `.ts` | **without any extension** | tsc fails immediately with `TS5097` |

`.mjs` is outside tsconfig's `include`, so it is never type-checked and node
ESM's demand for an explicit extension is the only rule that applies. A `.ts`
file under `scripts/` **is** covered by `include: **/*.ts` and is type-checked
like any source file, so an explicit `.ts` suffix trips `TS5097` — the same
error that made `allowImportingTsExtensions` the rejected option in
`D-2026-09-06-02`. The resolver hook supplies the extension for node.

---

## T01 closed — measured 2026-09-07

Validator run on `c7006a20`, the commit that shipped:

```bash
npm run validate:public-routes
```

| Output | Value |
|---|---|
| routes | **305** |
| families | **14** |
| static live | **38** |
| exit | **0** |

305 = 38 static + 267 dynamic (231 + 11 + 5 + 4 + 13 + 3), matching the source
counts recorded above exactly. Local gate on the same tree: `test:routes` 15/15,
`tsc --noEmit` clean, `test:stale` 11/11, `validate` 52/52, `build` exit 0 with
**106/106** static pages and **104** route entries, 0
`PrismaClientInitializationError`. Deployed `c7006a20` at 2026-09-07T06:09:58Z,
run `34089461669`, conclusion success, 2m17s.

---

## 🔴 The extraction pattern documented above is DEFECTIVE — corrected 2026-09-07

The bash one-liner under "Static public routes" produced the right answer for
today's files and would silently produce a wrong one tomorrow. Adversarial
review found four defects in the same logic inside the validator; three of them
apply to that shell pattern too. Measured, not reasoned:

| Shape | The documented pattern returns |
|---|---|
| `url('/x')` — single quotes | **nothing** |
| `` url(`/x`) `` — template, no interpolation | **nothing** |
| `url(\n  "/x"\n)` — call split across lines | **nothing** |
| `url("/a/" + code)` — concatenation | **nothing** |
| `{ url: url("/a"), note: "see https://x" }, { url: url("/b") }` | `/a` only — **`/b` is eaten by `sed 's#//.*##'`**, which is not string-aware |

The claim in "Why this pattern and not another" that dynamic URLs are excluded
"by construction" is true only because the pattern excludes almost everything
that is not the one shape it knows. **A dropped route is the dangerous
direction**: it never enters the comparison, so a sitemap route missing from the
contract reads as clean and the run exits 0.

`scripts/validate-public-route-contract.mjs` no longer works this way.
`classifyUrlCall()` accepts double-quoted, single-quoted and static-template
arguments, treats an interpolated template as a dynamic family, and routes
anything else to `findUnparsableSitemapUrlCalls()` — which is a **violation**,
not a skip. Comment stripping refuses to fire after `:` or a word character, so
a `https://` inside a string no longer deletes the rest of the line.

Use the npm script. Do not re-derive this with grep:

```bash
cd /d/jvto-web && npm run validate:public-routes
```

The eight real `sitemap.data.ts` files currently yield **zero** unparsable
calls, which is why the number stayed 38 across the fix. That is a fact about
today's files, not a property of the pattern.

---

## Source floors — why an empty check was not enough

`SOURCE_FLOORS` in the validator records the measured minimum per source
(231 / 11 / 5 / 4 / 13 / 3). Before 2026-09-07 the only integrity check was
`length === 0`, which catches the total wipe and nothing else: a truncated HTTP
payload from the ekosistem fallback, or a stale sibling checkout, returns 1
review of 231 and prints `OK: 75 routes, 0 violations`.

Floors, not equalities — growth passes, shrinkage stops the run. If ekosistem
legitimately publishes fewer records, lower the number in the same commit and
say why. Editing a floor to make a run pass without that reason is disabling the
guard, not maintaining it.

---

## The resolver hook must be installed by `--import`, never by a top-level call

`scripts/lib/ts-resolve-hooks.mjs` deliberately does not register itself. ES
modules link the entire graph before any statement runs, so a `register()` on
line 1 of a file is already too late for line 2's import.

`scripts/lib/register-ts-hook.mjs` exists so `node --import` can install it
before the entry module is linked. Both npm scripts carry two flags, and both
are load-bearing:

```
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
     --import ./scripts/lib/register-ts-hook.mjs <entry>
```

Verified 2026-09-07 — invoking the file directly **fails**, and that is the
intended proof:

```bash
cd /d/jvto-web && node scripts/validate-public-route-contract.mjs
# ERR_MODULE_NOT_FOUND — the npm script is the contract
```

If that bare invocation ever succeeds, something else is installing the hook and
the dependency has gone invisible. Find out what before trusting a run.

---

## Open, not fixed — recorded 2026-09-07

Tracked in `STATUS.yaml`; listed here because each is a measurement, and the
measurement is what makes them decidable.

| Item | Measured |
|---|---|
| `ROUTES_3D_INDEXABILITY` | `src/app/3d/[slug]` generates 5 slugs from `public/routes/index.json` (`ijen-crater`, `madakaripura-waterfall`, `mount-bromo`, `papuma-beach`, `tumpak-sewu-waterfall`). `src/app/robots.ts` allows `/`, no `noindex`, absent from every `sitemap.data.ts` and from `PUBLIC_ROUTE_CONTRACT` — statically generated, crawlable, undeclared |
| `ROUTE_CONTRACT_CI_WIRING` | `grep -rn "validate:public-routes\|test:routes" .github/ scripts/validate.mjs` → **zero matches**. The guard runs only when a human types it |
| `ROUTE_CONTRACT_CI_NODE_VERSION` | `ci.yml:38` and `update-volcanic-status.yml:30` pin `node-version: '20'`; no `engines` field, no `.nvmrc`. Unflagged type stripping needs ≥22.18, so both scripts die with `ERR_UNKNOWN_FILE_EXTENSION` on CI's Node. `test:stale` shares the flaw and is also unwired |

The last two are one change: installing the CI step before raising Node just
turns CI red.
