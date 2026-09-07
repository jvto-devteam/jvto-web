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

---

## T02 closed locally — measured 2026-09-07

`npm run reconcile:routes`, exit 0, against production:

| Source | Count |
|---|---|
| Local T01 inventory | **305** |
| Live sitemap (HTTP 200) | **302** |
| Ekosistem `route-output-index.json` | **299** |
| Union reconciled | **305** |

Verdicts: **302 pass · 3 warn · 0 fail** — `EXPECTED_ECOSYSTEM_OUTPUT` ×296,
`EXPECTED_WEB_OWNED_OUTPUT` ×6, `SITEMAP_PUBLICATION_LAG` ×3.

**The union is 305, not the ~308 the plan predicted.** The manifest turns out to
be exactly the inventory minus the six web-owned routes, and the live sitemap
exactly the inventory minus the three lagging reviews — so neither observation
contributes a route the inventory lacks. That is a stronger result than the
estimate: today there is no route in production or in ekosistem that the
contract does not declare. Recorded because a prediction that was wrong in the
safe direction is still a prediction that was wrong.

Same tree: `test:reconcile` 36/36, `test:routes` 16/16, `tsc` clean,
`lint` 254/28/226 (baseline, no new findings), `test:stale`, `validate` 52/52,
`build` exit 0 with **106/106** static pages and **104** route entries, 0
`PrismaClientInitializationError`, and `git diff -- src/app` empty.

## The 2026-09-05 audit's "8 mismatches" are 9 today, and the count itself is a finding

| Direction | Audit 2026-09-05 | Measured 2026-09-07 | Classification |
|---|---:|---:|---|
| In sitemap, not in manifest | 6 | **6** | `EXPECTED_WEB_OWNED_OUTPUT` (PASS) |
| In manifest, not in sitemap | 2 | **3** | `SITEMAP_PUBLICATION_LAG` (WARN) |

The second direction grew because review `/335` entered the manifest and has not
reached production's sitemap. Do not reconcile the arithmetic back to 8 — the
DoD is met because every difference carries an explicit classification, and the
difference in the count is itself explained by one of them.

## `/entity` and `/destinations/*` are web-owned — verified from markup, not inferred from absence

The manifest shows zero artifacts for these six routes, and that alone does not
distinguish "web assembles the schema" from "the ekosistem generator is
unfinished". The distinction matters: ekosistem **does** hold source content for
all five destinations (`destination-knowledge/*.content.json`, `schema_version`
`jvto/source/destination-detail/v1`), which is the shape of an unfinished
generator. `/entity` has no ekosistem source at all.

Measured against production instead (Rule 8 — never inferred from `page.tsx`):

```bash
curl -s https://javavolcano-touroperator.com/destinations/mount-bromo \
  | grep -o 'application/ld+json' | wc -l          # 2
curl -s https://javavolcano-touroperator.com/entity \
  | grep -o 'application/ld+json' | wc -l          # 2
curl -s https://javavolcano-touroperator.com/travel-guide/faq \
  | grep -o 'application/ld+json' | wc -l          # 2  ← control
```

`/destinations/mount-bromo` serves `TouristTrip` ×16 and `ListItem` ×19;
`/entity` serves `GovernmentOrganization` ×10, `Organization` ×6, `Place`,
`PostalAddress`, `DigitalDocument`. `/travel-guide/faq` is the control — it
**has** an ekosistem schema-output and also serves JSON-LD, so the sample
separates the two cases instead of confirming one.

Flipping `destination-detail.schemaOutputExpected` to `true` and re-running
yields exactly **5 × `MISSING_SCHEMA_OUTPUT`, exit 1**. That probe is the
standing evidence for the declaration; run it before arguing the other way.

## The classifier is a total function over 234 cells — proven, not asserted

Membership is `(I, S, M, SO, WO)` constrained by `M=0 ⟹ SO=WO=0` (SO and WO are
read *from* the manifest entry, so a miss cannot claim an artifact — enforced by
`lookupRouteOutput` returning all-false, not by a downstream assertion).
`(I=0, S=0, M=0)` is out of domain: the universe is the union of the three
sources.

19 membership combinations → 9 cells with `I=0` (no declarations) and, with
`I=1`, 10 × 2 (`sitemapExpected`) × 3 × 3 (the two expectations) = 180, plus the
`familyFullyAbsent` split that applies only where `sitemapExpected=T ∧ S=0`
(5 × 9 = 45 cells splitting in two) = **234**. `npm run test:reconcile`
enumerates all 234, asserts the count, asserts every cell yields a name from the
closed set, and asserts no rule is dead.

**A row's status is the worst rule that fired, not the status of the first name.**
A route that is both a publication lag (WARN) and a real artifact defect (FAIL)
is filed under the FAIL — otherwise a production defect gets excused as a
deployment state.

## `npm run reconcile:routes` fails on purpose — probes run 2026-09-07

Every one reverted afterwards and the contract file byte-compared:

| Probe | Result |
|---|---|
| `--fail-on-warn` with the 3 lag routes | exit **1** |
| `--json` with no path · unknown argument · `toString foo` | exit **2** |
| `--base https://site/blog` | exit **2** |
| `--base` and `--sitemap-file` together | exit **2** (refuses; does not pick) |
| sitemap file with 2 URLs | exit **2**, names `LIVE_SITEMAP_FLOOR 302` |
| empty sitemap file | exit **2**, "zero `<loc>` entries" |
| sitemap whose `<loc>` origin is `staging.example.com` | exit **2** — a guard `verify-live.mjs` does **not** have |
| manifest with 1 entry · `--manifest /nonexistent` | exit **2**, names `MANIFEST_ENTRY_FLOOR 299` |
| `JVTO_EKOSYSTEM_CONTENT_ROOT=/nonexistent` | exit **2** — confirms a bad root does not throw for free |
| flip `why-jvto-static` to `false` | exit **1**, 6 × `UNEXPECTED_SCHEMA_OUTPUT` |
| delete family `blog-index` | exit **1**, `/blog` → `UNDECLARED_PUBLISHED_ROUTE` |
| bare `node scripts/reconcile-route-outputs.mjs` | `ERR_MODULE_NOT_FOUND` — the npm flags are the contract |

**`src/lib/routes/publicRouteContract.ts` has CRLF line endings.** A probe that
anchored on `"  {\n    id: \"blog-index\""` got `indexOf` → `-1`, sliced from
`-1`, and corrupted the file into `ERR_INVALID_TYPESCRIPT_SYNTAX`. The run still
exited 1, which looked at a glance like the probe succeeding. Anchor on a single
`id:` literal and expand outward; never trust a multi-line anchor in this file.

## Production is three review URLs behind both repos — 2026-09-07

The live sitemap publishes **228** review permalinks; this checkout and the
ekosistem manifest both hold **231**. Missing: `/why-jvto/reviews/333`, `/334`,
`/335`. The 2026-09-05 audit already saw two of the three, so this has persisted
at least two days.

Not a code defect: `why-jvto/sitemap.data.ts` emits every id `getEcosystemReviews`
returns, and `src/app/sitemap.ts` is `force-dynamic`, so it is not a Next cache.
What remains is the jvto-ekosistem checkout **on the jvto-web VPS** trailing
`main`. Deployment dependency, not runtime (Rule 7): the site serves normally and
only three URLs are absent from the sitemap. Tracked as
`SITEMAP_PRODUCTION_LAG_REVIEWS`; closing it needs VPS access.

## Adversarial review found three real defects in T02's own code — fixed 2026-09-07

A fresh-context read-only review was run against this session's evidence, as
`CLAUDE.md` requires before reporting large work complete. It found three, all
in `scripts/reconcile-route-outputs.mjs`, all confirmed by probe before fixing:

| # | Defect | Why it mattered |
|---|---|---|
| 1 | `buildPublicRouteInventory()` and `reconcileRoutes()` sat **outside** the try/catch | Both throw plain `Error`. An unhandled top-level-await rejection exits **1** — measured, not assumed — so "I could not measure" reported as "the contract is violated". Reachable: `SOURCE_FLOORS` counts array **length**, so a source carrying an empty-string record clears the floor and then throws inside the builder |
| 2 | main-module guard dropped the `process.argv[1] &&` test that T01 carries | `path.resolve(undefined)` throws `ERR_INVALID_ARG_TYPE` when the module is imported rather than run |
| 3 | `sitemapDuplicates` was collected, threaded through the report, and printed in the human summary **only** | Never reached `counts` or the exit code, and `--quiet` hid it entirely. T01 treats a route claimed twice as a violation; T02 observed the same defect in production and exited 0 |

Proof each fix works, by probe:

```bash
# 1 — force the classifier to throw, then revert
npm run reconcile:routes   # exit 2  (was exit 1)
# 2 — import the module instead of running it
node --import ./scripts/lib/register-ts-hook.mjs \
     --input-type=module -e 'await import("./scripts/reconcile-route-outputs.mjs")'
# 3 — a sitemap with one repeated <loc>
npm run reconcile:routes -- --sitemap-file <dup.xml>   # exit 1, names /blog
```

**Claims that survived the attack**, each re-measured independently by the
reviewer: every family's declaration matches the manifest (`root-static` at 5/5
after `/entity` was removed); 305 = 38 static + 267 dynamic and `/entity` is
declared exactly once; the `export` edit to T01's script is behaviour-neutral
and its main-module guard does not fire on import; `--sitemap-file` passes
through the same floor as the HTTP path; ESLint really does cover the new files
(confirmed here too by appending an unused const, watching `no-unused-vars`
fire, then reverting); `reconcile:routes` is GET-only; no new secret or PII
exposure; disk writes stay opt-in behind `--json`/`--csv`.

One cell is inert rather than unreachable: the driver can construct
`familyFullyAbsent=true` together with `sitemapExpected=false`, which the 234-cell
cube does not enumerate, but `reconcileRoute` reads that flag only inside the
`sitemapExpected && !inSitemap` branch, so it cannot change an outcome.

## Pre-existing hazard in T01's script — NOT fixed, needs a decision

`scripts/validate-public-route-contract.mjs:303` ends with
`process.exit(await main(...))`. That path can perform a `fetch`: every
ekosistem reader has an HTTP fallback (`reviews.ts:95`, `website.ts:171`,
`destinationDetail.ts:55`, `tourPackageDetail.ts:64`). This is the exact libuv
`UV_HANDLE_CLOSING` hazard that `verify-live.mjs` and now
`reconcile-route-outputs.mjs` both document themselves as avoiding by setting
`process.exitCode` instead.

It has not misfired — the local sibling checkout means the fallback never runs
here. Left alone deliberately: changing the exit mechanics of a shipped gate is
its own decision, and T02 reused `loadSources` from that file without needing to
touch it.
