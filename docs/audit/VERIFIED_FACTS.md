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
