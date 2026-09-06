# T01 — Public Route Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `src/lib/routes/` — a declarative contract of every public/indexable route family plus a pure inventory builder — and a validator script that proves every public URL matches exactly one family.

**Architecture:** Contract is pure data with zero imports. Builder is a pure function taking already-loaded route sources; it performs no I/O. All I/O lives in `scripts/validate-public-route-contract.mjs`, which imports the alias-free TS modules directly under Node 24 type-stripping.

**Tech Stack:** TypeScript 5 (strict), Node 24.14.0 native type-stripping, `node --test` + `node:assert/strict`. **Zero new dependencies.**

**Spec:** `docs/audit/JVTO_Technical_Implementation_Backlog_2026-09-06.md` § T01 (lines 43–144)

---

## Context

The 2026-09-05 drift audit compared `sitemap.xml` against `route-output-index.json` and reported 8 mismatches. That comparison is invalid — the two files measure different things (`route-output-index.json` = artifacts ekosistem produced; `sitemap.xml` = URLs the website publishes as indexable). There is no authority in either repo that says which routes are *supposed* to be public, who owns their content, and what artifacts they are *expected* to have.

T01 creates that authority. It is **foundation-only**: it changes no sitemap output, adds no route, deletes no route, and touches nothing in `jvto-ekosistem`. T02 consumes it to turn the 8 mismatches into explicit classifications.

### Verified facts this plan rests on

Measured directly this session, not inherited from the spec doc:

| Fact | Value | How verified |
|---|---|---|
| `getEcosystemReviews` | `ecosystemContent/reviews.ts:112`, `(): Promise<PublicReview[]>` | grep `^export` |
| `getEcosystemDestinationRoutes` | `ecosystemContent/destinationDetail.ts:90`, `(): Promise<Array<{slug:string}>>` | grep `^export` |
| `getEcosystemTourPackageRoutes` | `ecosystemContent/tourPackageDetail.ts:254` — **synchronous**, **requires** `prefix: "tours/from-bali" \| "tours/from-surabaya"` | grep `^export` |
| `getPublicCrewCodes` | `people/canonicalPeople.ts:201`, `(): Promise<string[]>` | grep `^export` |
| `getEcosystemWebsiteRoutes` | `ecosystemContent/website.ts:405` — source of `/blog/*` routes | read |
| Node | v24.14.0 → TS type-stripping on by default | `node --version` |
| `src/lib/routes/` | **does not exist** | `ls` |
| Exported route-normalizer | **none exists**; two byte-equivalent private copies at `staticPageAdapter.ts:39` and `website.ts:128` | grep |
| Sitemap static literal shape | `url("/path")` double-quoted; dynamic uses backticks `` url(`/x/${v}`) `` | read `sitemap.data.ts`, `why-jvto/sitemap.data.ts` |
| Alias-free at runtime | `reviews.ts`, `destinationDetail.ts`, `tourPackageDetail.ts`, `website.ts`, `people.ts`, `static-content/schemas.ts` (only `import type`, `node:*`, and `zod`) | grep imports |
| **Blocked** | `canonicalPeople.ts` has two **value** `@/` imports; `blog.ts` value-imports `@/lib/site`, which **throws** without `NEXT_PUBLIC_SITE_URL` | grep + read `site.ts:2-6` |

### Owner decisions locked for this task

1. **Static routes are duplicated into the contract, not extracted out of `sitemap.data.ts`.** No sitemap file is touched. The duplication is made safe by a mandatory drift guard (Task 4) that fails the validator whenever the two lists diverge.
2. **`websiteOutputExpected` / `schemaOutputExpected` are `"unconfirmed"` in T01.** No invented values. The validator reports the unconfirmed count and only fails on it under `--strict-expectations`, which T02 turns on.

---

## Global Constraints

- **No new dependencies.** `zod` is already present but is NOT used here — the contract is compile-time typed; the validator's inputs come from typed TS modules.
- **No change to sitemap output.** No file under `src/app/**/sitemap*` is edited. `/sitemap.xml` must be byte-identical apart from timestamps.
- **No change to `jvto-ekosistem`.** No workflow, CI, or deploy file changes.
- Named exports only — `export default` appears once in all of `src/lib`; do not add a second.
- Double-quoted imports (majority style in non-ported files). No formatter exists; do not reformat neighbouring code.
- `strict: true`, `noUncheckedIndexedAccess` **off** — indexed access yields `T`, not `T | undefined`.
- `scripts/lib/ts-resolve-hooks.mjs` (Task 1) makes `@/…` and extensionless specifiers resolve under plain node, so new `src/lib/routes/*.ts` files are not constrained in how they import. They still import nothing but each other — keep it that way, so the contract stays loadable by anything.
- **Every node invocation that touches `src/**/*.ts` needs both flags**: `--import ./scripts/lib/register-ts-hook.mjs` and `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON`. They live in the npm scripts; invoke through npm, never the bare file.
- **🔴 Import-extension asymmetry — the file's own extension decides, and getting it backwards fails at a different stage each way.** Measured 2026-09-06 while building Task 2.

  | Importing file | Importing `src/**/*.ts` | Why |
  |---|---|---|
  | `scripts/*.mjs` | **WITH `.ts`** — `from "../src/lib/routes/publicRouteContract.ts"` | `.mjs` is outside tsconfig's `include`, so tsc never sees it; node ESM demands the extension |
  | `scripts/*.test.ts`, any `.ts` | **WITHOUT any extension** — `from "../src/lib/routes/publicRouteContract"` | tsconfig's `include` is `**/*.ts` and covers `scripts/`, so the file IS type-checked; an explicit `.ts` fails **TS5097**, the same error that made `allowImportingTsExtensions` the rejected option in `D-2026-09-06-02`. The resolver hook supplies the extension for node |

  Get it wrong in a `.ts` file and the tsc hook blocks the write immediately. Get it wrong in a `.mjs` file and tsc stays silent — it only fails at run time with `ERR_MODULE_NOT_FOUND`, which reads like a missing file rather than a missing suffix.
- A `PostToolUse` hook runs `tsc --noEmit` on every `.ts`/`.tsx` write (~4.4s). A `TS####` reply with exit 2 is the hook, not a broken tool — fix the type error.
- Every Bash call touching git/npm starts with an explicit `cd /d/jvto-web &&`.
- Exit codes follow `scripts/verify-live.mjs`: `0` pass · `1` contract violation · `2` usage error.
- Comments carry a date and the reason, matching the repo's house style.

---

## File Structure

| File | Responsibility |
|---|---|
| **Create** `src/lib/routes/normalizeRoute.ts` | One pure function. Third copy in repo by necessity — the two existing ones are module-private and de-duplicating them would edit `ecosystemContent/`, out of scope. |
| **Create** `src/lib/routes/publicRouteContract.ts` | Types + `PUBLIC_ROUTE_CONTRACT`. Pure data, zero imports. Static families carry a literal `routes` array; dynamic families carry a `pattern` and a `source` key. |
| **Create** `src/lib/routes/buildPublicRouteInventory.ts` | Pure expansion of contract × sources → sorted inventory. No I/O, no clock except an injected `generatedAt`. |
| **Create** `scripts/validate-public-route-contract.mjs` | All I/O: loads sources, calls the builder, runs the drift guard, prints, exits 0/1/2. |
| **Create** `scripts/validate-public-route-contract.test.ts` | `node --test`. Covers the builder, the normalizer, and the sitemap-literal extractor. |
| ✅ `scripts/lib/ts-resolve-hooks.mjs` | Node resolve hook: `@/*` alias + TS extension inference. Done in Task 1 (`eb152826`). **`src/` is not modified at all.** |
| **Create** `scripts/lib/register-ts-hook.mjs` | Three lines that call `register()` on the hook. Exists so `node --import` can install the hook *before* the entry module is linked — see Task 2 Step 0. |
| **Modify** `package.json` | Add `validate:public-routes` and `test:routes`, both carrying `--import` and `--disable-warning`. |

---

## Task 1: Make src loaders importable from plain node — ✅ DONE (`eb152826`)

**Executed 2026-09-06 as Option B (resolver hook), not as originally written.** The original Step 3 changed `canonicalPeople.ts` to relative imports; that was measured, found insufficient, and reverted. The record below is what actually happened, kept because the failed branch is the part worth not repeating.

**Files (as executed):**
- Create: `scripts/lib/ts-resolve-hooks.mjs` — the only code added
- Create: `docs/audit/decision-log.json` — decision `D-2026-09-06-02`
- **`src/lib/people/canonicalPeople.ts` was NOT changed** — reverted to its `@/` imports, byte-identical to HEAD
- Scratch only: `<scratchpad>/spike.mjs`, `<scratchpad>/hooks.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `resolve(specifier, context, nextResolve)` and `class ResolveHookError`, from `scripts/lib/ts-resolve-hooks.mjs`. Registered by the caller; the module never self-registers.

- [x] **Step 1: Write the spike that must fail first**

Write to the scratchpad (NOT into the repo):

```js
// spike.mjs — run from D:\jvto-web
import { getEcosystemReviews } from "./src/lib/ecosystemContent/reviews.ts";
import { getEcosystemDestinationRoutes } from "./src/lib/ecosystemContent/destinationDetail.ts";
import { getEcosystemTourPackageRoutes } from "./src/lib/ecosystemContent/tourPackageDetail.ts";
import { getEcosystemWebsiteRoutes } from "./src/lib/ecosystemContent/website.ts";
import { getPublicCrewCodes } from "./src/lib/people/canonicalPeople.ts";

const reviews = await getEcosystemReviews();
const dests = await getEcosystemDestinationRoutes();
const bali = getEcosystemTourPackageRoutes("tours/from-bali");
const sby = getEcosystemTourPackageRoutes("tours/from-surabaya");
const index = await getEcosystemWebsiteRoutes();
const blog = (index.routes ?? []).map((r) => r.route).filter((r) => r.startsWith("/blog/"));
const crew = await getPublicCrewCodes();

console.log(JSON.stringify({
  reviews: reviews.length, dests: dests.length,
  bali: bali.length, sby: sby.length,
  blog: blog.length, crew: crew.length,
}, null, 2));
```

- [x] **Step 2: Run it and confirm it fails on the alias**

```bash
cd /d/jvto-web && node "$SCRATCH/spike.mjs"
```

Expected: `ERR_MODULE_NOT_FOUND` naming `@/lib/ecosystemContent/people` (raised from `canonicalPeople.ts`). If it fails on a *different* module, stop and report — the import survey was incomplete.

- [x] **Step 3 (superseded): relative imports — TRIED, INSUFFICIENT, REVERTED**

The original instruction was to rewrite `canonicalPeople.ts:29-30` to `"../ecosystemContent/people"` and `"../static-content/schemas"`. That was done and re-run. It fixes the alias and leaves a second, independent problem standing:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'D:\jvto-web\src\lib\ecosystemContent\people'
imported from D:\jvto-web\src\lib\people\canonicalPeople.ts
```

**Node ESM requires an explicit extension on relative specifiers.** TypeScript, webpack and Turbopack all infer `.ts`; node never does. Adding `.ts` in source needs `allowImportingTsExtensions` in `tsconfig.json` — repo-wide config, rejected by the owner. The edit was reverted; `git diff --stat` on tracked files is empty.

- [x] **Step 3 (as executed): write the resolver hook**

`scripts/lib/ts-resolve-hooks.mjs` handles both problems in one place, outside `src/`:
1. `@/*` → `<cwd>/src/*` (override with `JVTO_SRC_DIR`)
2. extensionless specifier → first existing of `.ts`, `.tsx`, `.mts`, `/index.ts`, `/index.tsx`

Zero dependencies. The extension retry runs **only** after `nextResolve` has already failed with `ERR_MODULE_NOT_FOUND`, so real packages and genuine errors are untouched. It throws `ResolveHookError` at load time if `SRC_DIR` does not exist, because a hook that silently resolves nothing surfaces as an unrelated missing dependency.

- [x] **Step 4: Prove all five loaders import through the hook**

Spike registers the hook, then dynamic-imports each loader:

```js
import { register } from "node:module";
import { pathToFileURL } from "node:url";
register(pathToFileURL("D:/jvto-web/scripts/lib/ts-resolve-hooks.mjs"));
const { getPublicCrewCodes } = await import("file:///D:/jvto-web/src/lib/people/canonicalPeople.ts");
```

Measured 2026-09-06, exit 0 — **the baseline Task 4's first real run must reproduce**:

| source | count |
|---|---|
| reviews | **231** |
| destinations | **5** |
| tours from-bali | **4** |
| tours from-surabaya | **13** |
| blog | **3** |
| crew | **11** |

A lower count means an ekosistem read failed. An inventory built from nothing looks identical to a clean pass — that is why Task 4 treats an empty source as a violation.

Node emits `MODULE_TYPELESS_PACKAGE_JSON` on every `.ts` it strips. Harmless, but noisy enough to bury real output — Task 4 suppresses it with the same flag `test:stale` already uses.

- [x] **Step 5: Confirm nothing else broke**

`npx tsc --noEmit` → clean. `npx eslint scripts/lib/ts-resolve-hooks.mjs` → clean.

**`npm run lint` is NOT clean repo-wide and never was: 254 problems (28 errors, 226 warnings), all pre-existing.** Proven rather than assumed — lint was run with `scripts/lib/` moved aside and again with it restored; both runs reported 254/28/226. Any later task must compare against that baseline, not against "clean".

A clean lint result on a new file is only meaningful once you know the file is actually being linted. Confirmed by injecting `const unusedProbe = 1;`, watching `no-unused-vars` fire, then removing it. Do this for every new file in a directory ESLint has never reported on.

- [x] **Step 6: Commit** — `eb152826`, 2 files, 119 insertions

`scripts/lib/ts-resolve-hooks.mjs` + `docs/audit/decision-log.json`. The message records the failed relative-import branch, decision `D-2026-09-06-02`, the six baseline counts, and the measured lint baseline. A second commit `f00dc6f1` added the three `docs/audit/*.md` records, including the spec this plan implements.

Neither is pushed. `origin/live..HEAD` = 2 commits.

---

## Task 2: Route normalizer + the contract itself

**Files:**
- Create: `src/lib/routes/normalizeRoute.ts`
- Create: `src/lib/routes/publicRouteContract.ts`
- Test: `scripts/validate-public-route-contract.test.ts` (created here, extended in Tasks 3–4)

**Interfaces:**
- Consumes: `scripts/lib/ts-resolve-hooks.mjs` (Task 1), via the shim created in Step 0
- Produces:
  - `scripts/lib/register-ts-hook.mjs`
  - `normalizeRoute(route: string): string`
  - `type RouteFamilyContract`, `type ArtifactExpectation`, `type RouteSourceKey`
  - `const PUBLIC_ROUTE_CONTRACT: readonly RouteFamilyContract[]`

- [ ] **Step 0: Create the registration shim, and understand why it must exist**

`scripts/lib/ts-resolve-hooks.mjs` deliberately does not register itself. Something has to call `register()` — and **it cannot be a top-level call inside the file that needs the hook.** ES modules link the whole graph before any code runs, so every `import` specifier in a file is resolved *before* its first statement executes. A `register()` on line 1 is already too late for line 2's import.

Two ways out. Dynamic `await import()` after registering works, but then no consumer can use a static import and every one of them has to remember the ordering rule. `node --import` installs the hook before the entry module is linked, so **ordinary static imports work everywhere** and no consumer has to know the hook exists. Take the second.

This lands in Task 2 rather than Task 4 because Task 3's test imports `buildPublicRouteInventory.ts`, whose own `./normalizeRoute` / `./publicRouteContract` imports are extensionless — they do not resolve under plain node without the hook.

Create `scripts/lib/register-ts-hook.mjs`:

```js
/**
 * Installs ts-resolve-hooks for a whole node process. Load it with
 * `node --import ./scripts/lib/register-ts-hook.mjs <entry>` so the hook is in
 * place before the entry module is linked — a top-level register() inside the
 * entry itself runs after its own imports have already been resolved, which is
 * too late. See scripts/lib/ts-resolve-hooks.mjs for what it resolves and why.
 */
import { register } from "node:module";

register(new URL("./ts-resolve-hooks.mjs", import.meta.url));
```

- [ ] **Step 0b: Prove the shim does something, both ways**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
  --import ./scripts/lib/register-ts-hook.mjs \
  -e 'const m = await import("./src/lib/people/canonicalPeople.ts"); console.log((await m.getPublicCrewCodes()).length)'
```
Expected: `11`.

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
  -e 'const m = await import("./src/lib/people/canonicalPeople.ts"); console.log((await m.getPublicCrewCodes()).length)'
```
Expected: fails with `Cannot find package '@/lib'`. Run both. A hook you have only ever seen succeed is indistinguishable from a hook that is not installed.

- [ ] **Step 1: Write the failing normalizer test**

Create `scripts/validate-public-route-contract.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeRoute } from "../src/lib/routes/normalizeRoute";

test("normalizeRoute: adds leading slash, strips trailing, lowercases", () => {
  assert.equal(normalizeRoute("why-jvto"), "/why-jvto");
  assert.equal(normalizeRoute("/why-jvto/"), "/why-jvto");
  assert.equal(normalizeRoute("/Why-JVTO"), "/why-jvto");
  assert.equal(normalizeRoute("  /why-jvto  "), "/why-jvto");
});

test("normalizeRoute: root stays a bare slash", () => {
  assert.equal(normalizeRoute("/"), "/");
  assert.equal(normalizeRoute(""), "/");
  assert.equal(normalizeRoute("   "), "/");
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts
```
Expected: FAIL — cannot find `../src/lib/routes/normalizeRoute.ts`.

- [ ] **Step 3: Write the normalizer**

Create `src/lib/routes/normalizeRoute.ts`:

```ts
/**
 * Canonical route-string form for the public route contract (T01, 2026-09-06).
 *
 * Two byte-equivalent private copies of this logic already exist —
 * ecosystemContent/staticPageAdapter.ts:39 and ecosystemContent/website.ts:128.
 * Neither is exported. Importing one would make src/lib/routes depend on the
 * reader layer, which inverts the intended direction; de-duplicating them is a
 * follow-up, deliberately out of T01's foundation-only scope.
 */
export function normalizeRoute(route: string): string {
  const trimmed = route.trim();
  if (trimmed === "" || trimmed === "/") return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailing = withLeading.replace(/\/+$/, "");
  return (withoutTrailing === "" ? "/" : withoutTrailing).toLowerCase();
}
```

- [ ] **Step 4: Run the test — it must pass**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts
```
Expected: 2 pass, 0 fail.

- [ ] **Step 5: Extract the real static route literals**

Do not retype them from any document. Produce the list mechanically:

```bash
cd /d/jvto-web && find src/app -name "sitemap.data.ts" | sort | while IFS= read -r f; do
  echo "=== $f"
  sed 's#//.*##' "$f" | grep -oE 'url\("(/[^"]*)"\)' | sed -E 's#url\("(.*)"\)#\1#'
done
```

`sed 's#//.*##'` drops the commented-out entries (e.g. `sitemap.data.ts:12-13`). Backtick-interpolated dynamic URLs are excluded automatically because the regex requires a double quote. **Record the total count** — it becomes the drift guard's expectation in Task 4.

- [ ] **Step 6: Write the contract**

Create `src/lib/routes/publicRouteContract.ts`. Fill the static `routes` arrays from Step 5's output, grouped by the file they came from. Do not invent a route that Step 5 did not print.

```ts
/**
 * Public route contract — T01, 2026-09-06.
 *
 * The authority on which routes are public/indexable, who owns their content,
 * and which artifacts they are expected to have. This is the comparand for
 * sitemap.xml; route-output-index.json is NOT (it holds 299 entries of which
 * 248 are review/crew detail routes, so it measures artifacts, not publication).
 *
 * Static routes are duplicated here from src/app/**\/sitemap.data.ts by owner
 * decision 2026-09-06 (foundation-only: no sitemap file is edited). The
 * duplication is guarded — scripts/validate-public-route-contract.mjs re-extracts
 * the literals from those files on every run and fails on any divergence.
 *
 * This file must stay import-free at runtime so plain `node` can load it.
 */

/**
 * Artifact expectations are deliberately undeclared in T01. The spec's own
 * example flags destination-detail's schemaOutputExpected as needing product
 * confirmation, and filling it from today's manifest would freeze current drift
 * as "correct" and leave T02 with nothing to find. T02 declares them; until
 * then `--strict-expectations` fails on any remaining "unconfirmed".
 */
export type ArtifactExpectation = boolean | "unconfirmed";

export type RouteSourceKey =
  | "reviewIds"
  | "crewCodes"
  | "destinationSlugs"
  | "tourSlugsFromBali"
  | "tourSlugsFromSurabaya"
  | "blogRoutes";

type BaseContract = {
  readonly id: string;
  readonly group: string;
  readonly contentOwner: "jvto-web" | "jvto-ekosistem";
  readonly renderOwner: "jvto-web";
  readonly schemaOwner: "jvto-web" | "jvto-ekosistem";
  readonly sitemapExpected: boolean;
  readonly websiteOutputExpected: ArtifactExpectation;
  readonly schemaOutputExpected: ArtifactExpectation;
  readonly expectedStatus: 200;
};

export type RouteFamilyContract =
  | (BaseContract & { readonly kind: "static"; readonly routes: readonly string[] })
  | (BaseContract & {
      readonly kind: "dynamic";
      readonly pattern: string;
      readonly source: RouteSourceKey;
      /** "id" -> `${prefix}/${id}`; "route" -> the source already yields full routes. */
      readonly expansion: "id" | "route";
      readonly prefix: string;
    });

export const PUBLIC_ROUTE_CONTRACT: readonly RouteFamilyContract[] = [
  // --- static families: one per sitemap.data.ts file ---------------------
  {
    id: "root-static",
    kind: "static",
    group: "root",
    routes: [
      // from src/app/sitemap.data.ts — Step 5 output
    ],
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-web",
    sitemapExpected: true,
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
    expectedStatus: 200,
  },
  // … one entry per remaining sitemap.data.ts file, same shape …

  // --- dynamic families --------------------------------------------------
  {
    id: "review-detail",
    kind: "dynamic",
    pattern: "/why-jvto/reviews/:id",
    group: "why-jvto/reviews-detail",
    source: "reviewIds",
    expansion: "id",
    prefix: "/why-jvto/reviews",
    contentOwner: "jvto-ekosistem",
    renderOwner: "jvto-web",
    schemaOwner: "jvto-ekosistem",
    sitemapExpected: true,
    websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed",
    expectedStatus: 200,
  },
  // crew-detail        /why-jvto/our-team/:code   source: crewCodes
  // destination-detail /destinations/:slug        source: destinationSlugs
  // tour-detail-from-bali      /tours/from-bali/:slug      source: tourSlugsFromBali
  // tour-detail-from-surabaya  /tours/from-surabaya/:slug  source: tourSlugsFromSurabaya
  // blog-post          /blog/:slug   source: blogRoutes, expansion: "route"
];
```

Do **not** add a family for `/my-booking/:slug`. It is transactional, absent from the sitemap, and has no `generateStaticParams` — it is non-public, and a contract entry would wrongly assert it should be indexed.

- [ ] **Step 7: Add a contract-shape test**

Append to the test file:

```ts
import { PUBLIC_ROUTE_CONTRACT } from "../src/lib/routes/publicRouteContract";

test("contract: family ids are unique", () => {
  const ids = PUBLIC_ROUTE_CONTRACT.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate family id: ${ids.join(", ")}`);
});

test("contract: every static route is already normalized", () => {
  for (const family of PUBLIC_ROUTE_CONTRACT) {
    if (family.kind !== "static") continue;
    for (const route of family.routes) {
      assert.equal(normalizeRoute(route), route, `${family.id}: "${route}" is not normalized`);
    }
  }
});

test("contract: no static route is declared by two families", () => {
  const seen = new Map<string, string>();
  for (const family of PUBLIC_ROUTE_CONTRACT) {
    if (family.kind !== "static") continue;
    for (const route of family.routes) {
      const prior = seen.get(route);
      assert.equal(prior, undefined, `${route} claimed by both ${prior} and ${family.id}`);
      seen.set(route, family.id);
    }
  }
});
```

- [ ] **Step 8: Run the tests**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts && npx tsc --noEmit
```
Expected: 5 pass, 0 fail; tsc clean.

- [ ] **Step 9: Commit**

```bash
cd /d/jvto-web && git add src/lib/routes/ scripts/lib/register-ts-hook.mjs scripts/validate-public-route-contract.test.ts
git commit -m "feat(routes): add public route contract and normalizer (T01)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RDfJAM9hSdB5KqYFobKAdD"
```

---

## Task 3: Pure inventory builder

**Files:**
- Create: `src/lib/routes/buildPublicRouteInventory.ts`
- Test: `scripts/validate-public-route-contract.test.ts` (extend)

**Interfaces:**
- Consumes: `RouteFamilyContract`, `RouteSourceKey`, `PUBLIC_ROUTE_CONTRACT`, `normalizeRoute`
- Produces:
  ```ts
  export type RouteSources = Readonly<Record<RouteSourceKey, readonly string[]>>;
  export type InventoryRoute = Readonly<{
    route: string; group: string; contractId: string;
    sitemapExpected: boolean;
    websiteOutputExpected: ArtifactExpectation;
    schemaOutputExpected: ArtifactExpectation;
    sourceRecord: string | null;
  }>;
  export type PublicRouteInventory = Readonly<{
    schemaVersion: "jvto/public-route-inventory/v1";
    generatedAt: string;
    routes: readonly InventoryRoute[];
  }>;
  export function buildPublicRouteInventory(
    sources: RouteSources,
    options?: { generatedAt?: string; contract?: readonly RouteFamilyContract[] },
  ): PublicRouteInventory;
  export function findDuplicateRoutes(inventory: PublicRouteInventory): readonly string[];
  ```

- [ ] **Step 1: Write the failing builder tests**

Append to the test file:

```ts
import {
  buildPublicRouteInventory,
  findDuplicateRoutes,
} from "../src/lib/routes/buildPublicRouteInventory";

const EMPTY_SOURCES = {
  reviewIds: [], crewCodes: [], destinationSlugs: [],
  tourSlugsFromBali: [], tourSlugsFromSurabaya: [], blogRoutes: [],
} as const;

const FIXTURE_CONTRACT = [
  {
    id: "root-static", kind: "static", group: "root",
    routes: ["/", "/contact"],
    contentOwner: "jvto-ekosistem", renderOwner: "jvto-web", schemaOwner: "jvto-web",
    sitemapExpected: true, websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed", expectedStatus: 200,
  },
  {
    id: "review-detail", kind: "dynamic", pattern: "/why-jvto/reviews/:id",
    group: "why-jvto/reviews-detail", source: "reviewIds",
    expansion: "id", prefix: "/why-jvto/reviews",
    contentOwner: "jvto-ekosistem", renderOwner: "jvto-web", schemaOwner: "jvto-ekosistem",
    sitemapExpected: true, websiteOutputExpected: "unconfirmed",
    schemaOutputExpected: "unconfirmed", expectedStatus: 200,
  },
] as const;

test("builder: expands a dynamic family from its source", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["333", "334"] },
    { generatedAt: "2026-09-06T00:00:00.000Z", contract: FIXTURE_CONTRACT },
  );
  const routes = inv.routes.map((r) => r.route);
  assert.ok(routes.includes("/why-jvto/reviews/333"), routes.join(","));
  assert.ok(routes.includes("/why-jvto/reviews/334"), routes.join(","));
});

test("builder: dynamic route carries its source record", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["333"] },
    { generatedAt: "2026-09-06T00:00:00.000Z", contract: FIXTURE_CONTRACT },
  );
  const entry = inv.routes.find((r) => r.route === "/why-jvto/reviews/333");
  assert.equal(entry?.sourceRecord, "reviewIds#333");
  assert.equal(entry?.contractId, "review-detail");
});

test("builder: an empty source id is a hard error, not a silent skip", () => {
  assert.throws(
    () => buildPublicRouteInventory(
      { ...EMPTY_SOURCES, reviewIds: ["333", "  "] },
      { contract: FIXTURE_CONTRACT },
    ),
    /review-detail/,
  );
});

test("builder: output is deterministic apart from generatedAt", () => {
  const sources = { ...EMPTY_SOURCES, reviewIds: ["334", "333"] };
  const a = buildPublicRouteInventory(sources, { generatedAt: "A", contract: FIXTURE_CONTRACT });
  const b = buildPublicRouteInventory(sources, { generatedAt: "B", contract: FIXTURE_CONTRACT });
  assert.deepEqual(a.routes, b.routes, "route list must not depend on generatedAt or input order");
});

test("builder: no uppercase survives expansion", () => {
  const inv = buildPublicRouteInventory(
    { ...EMPTY_SOURCES, reviewIds: ["ABC"] },
    { contract: FIXTURE_CONTRACT },
  );
  const routes = inv.routes.map((r) => r.route);
  assert.ok(routes.every((r) => r === r.toLowerCase()), routes.join(","));
});

test("findDuplicateRoutes: reports a route claimed twice", () => {
  const dupContract = [
    FIXTURE_CONTRACT[0],
    { ...FIXTURE_CONTRACT[0], id: "root-static-copy" },
  ] as const;
  const inv = buildPublicRouteInventory(EMPTY_SOURCES, { contract: dupContract });
  assert.deepEqual([...findDuplicateRoutes(inv)].sort(), ["/", "/contact"]);
});

test("builder: real contract with empty sources yields only static routes", () => {
  const inv = buildPublicRouteInventory(EMPTY_SOURCES);
  assert.ok(inv.routes.length > 0);
  assert.equal(findDuplicateRoutes(inv).length, 0);
  assert.ok(inv.routes.every((r) => normalizeRoute(r.route) === r.route));
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts
```
Expected: FAIL — cannot find `buildPublicRouteInventory.ts`.

- [ ] **Step 3: Write the builder**

Create `src/lib/routes/buildPublicRouteInventory.ts`:

```ts
import { normalizeRoute } from "./normalizeRoute";
import {
  PUBLIC_ROUTE_CONTRACT,
  type ArtifactExpectation,
  type RouteFamilyContract,
  type RouteSourceKey,
} from "./publicRouteContract";

export type RouteSources = Readonly<Record<RouteSourceKey, readonly string[]>>;

export type InventoryRoute = Readonly<{
  route: string;
  group: string;
  contractId: string;
  sitemapExpected: boolean;
  websiteOutputExpected: ArtifactExpectation;
  schemaOutputExpected: ArtifactExpectation;
  sourceRecord: string | null;
}>;

export type PublicRouteInventory = Readonly<{
  schemaVersion: "jvto/public-route-inventory/v1";
  generatedAt: string;
  routes: readonly InventoryRoute[];
}>;

/**
 * Pure. Performs no I/O and reads no clock — `generatedAt` is injected so two
 * runs over the same sources are byte-comparable. T01, 2026-09-06.
 */
export function buildPublicRouteInventory(
  sources: RouteSources,
  options: {
    generatedAt?: string;
    contract?: readonly RouteFamilyContract[];
  } = {},
): PublicRouteInventory {
  const contract = options.contract ?? PUBLIC_ROUTE_CONTRACT;
  const routes: InventoryRoute[] = [];

  for (const family of contract) {
    const common = {
      group: family.group,
      contractId: family.id,
      sitemapExpected: family.sitemapExpected,
      websiteOutputExpected: family.websiteOutputExpected,
      schemaOutputExpected: family.schemaOutputExpected,
    };

    if (family.kind === "static") {
      for (const route of family.routes) {
        routes.push({ ...common, route: normalizeRoute(route), sourceRecord: null });
      }
      continue;
    }

    for (const record of sources[family.source]) {
      if (record.trim() === "") {
        throw new Error(
          `${family.id}: source "${family.source}" yielded an empty record. ` +
            `An empty id would silently produce the family's index route.`,
        );
      }
      const route =
        family.expansion === "route" ? record : `${family.prefix}/${record}`;
      routes.push({
        ...common,
        route: normalizeRoute(route),
        sourceRecord: `${family.source}#${record}`,
      });
    }
  }

  routes.sort((a, b) => a.route.localeCompare(b.route) || a.contractId.localeCompare(b.contractId));

  return {
    schemaVersion: "jvto/public-route-inventory/v1",
    generatedAt: options.generatedAt ?? "",
    routes,
  };
}

/** Routes claimed by more than one contract family. Empty array means clean. */
export function findDuplicateRoutes(inventory: PublicRouteInventory): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of inventory.routes) {
    if (seen.has(entry.route)) duplicates.add(entry.route);
    seen.add(entry.route);
  }
  return [...duplicates].sort();
}
```

- [ ] **Step 4: Run the tests — all must pass**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts && npx tsc --noEmit
```
Expected: 12 pass, 0 fail; tsc clean.

- [ ] **Step 5: Commit**

```bash
cd /d/jvto-web && git add src/lib/routes/buildPublicRouteInventory.ts scripts/validate-public-route-contract.test.ts
git commit -m "feat(routes): add pure public route inventory builder (T01)

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RDfJAM9hSdB5KqYFobKAdD"
```

---

## Task 4: Validator script + drift guard + npm scripts

**Files:**
- Create: `scripts/validate-public-route-contract.mjs`
- Modify: `package.json`
- Test: `scripts/validate-public-route-contract.test.ts` (extend)

**Interfaces:**
- Consumes: `buildPublicRouteInventory`, `findDuplicateRoutes`, `PUBLIC_ROUTE_CONTRACT`, and the five loaders proven in Task 1
- Produces: `npm run validate:public-routes`, plus an exported `extractSitemapStaticRoutes(source: string): string[]` used by both the script and its test

- [ ] **Step 1: Write the failing extractor test**

Append to the test file. The fixture reproduces every shape actually present in the real files — double-quoted static, backtick dynamic, and a commented-out entry:

```ts
import { extractSitemapStaticRoutes } from "./validate-public-route-contract.mjs";

test("extractor: takes double-quoted routes, skips dynamic and commented", () => {
  const fixture = [
    'import { url } from "@/lib/site";',
    'export function s(t, m) {',
    '  return [',
    '    { url: url("/"), lastModified: getLastModified(m, "/", t) },',
    '    // { url: url("/ijen-crater-blue-fire-tour"), lastModified: t },',
    '    { url: url("/contact"), lastModified: getLastModified(m, "/contact", t) },',
    '    ...crewCodes.map((code) => ({ url: url(`/why-jvto/our-team/${code}`) })),',
    '    /* { url: url("/block-commented") } */',
    '  ];',
    '}',
  ].join("\n");

  assert.deepEqual(extractSitemapStaticRoutes(fixture), ["/", "/contact"]);
});

test("extractor: does not mistake a getLastModified key for a url", () => {
  const fixture = '{ lastModified: getLastModified(map, "/why-jvto/our-team", t) }';
  assert.deepEqual(extractSitemapStaticRoutes(fixture), []);
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
cd /d/jvto-web && node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts
```
Expected: FAIL — cannot find `validate-public-route-contract.mjs`.

- [ ] **Step 3: Write the validator script**

Create `scripts/validate-public-route-contract.mjs`. Static imports are fine because `--import` installs the hook first (Step 3a). The exit-code contract mirrors `scripts/verify-live.mjs` (0/1/2), and the crew/blog sourcing choices carry their reason inline:

```js
/**
 * validate-public-route-contract — T01, 2026-09-06.
 *
 * Builds the public route inventory from the live sources and asserts the
 * contract holds. Foundation-only: reads everything, writes nothing unless
 * --json is passed.
 *
 * Usage — the flags are not optional, use `npm run validate:public-routes`:
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
 *        --import ./scripts/lib/register-ts-hook.mjs \
 *        scripts/validate-public-route-contract.mjs [--json <path>] [--strict-expectations]
 *
 *   --import installs the resolver hook before this module is linked, which is
 *   what lets the src/**\/*.ts imports below resolve at all. --disable-warning
 *   silences MODULE_TYPELESS_PACKAGE_JSON, which node emits once per stripped
 *   .ts file and which otherwise buries the actual output; scripts/package.json
 *   has no "type" field and adding one is out of scope. Same flag as test:stale.
 *
 * Exit codes (same contract as scripts/verify-live.mjs):
 *   0  contract holds
 *   1  contract violated
 *   2  usage error
 *
 * Why the sources are imported the way they are:
 *   reviews / destinations / tours / website are already runtime-alias-free.
 *   crew comes from getPublicCrewCodes rather than re-reading people.json,
 *   because the G2 published/unpublished rule lives in that function and a
 *   second copy here could contradict it.
 *   blog routes are filtered off getEcosystemWebsiteRoutes instead of
 *   getAllPublishedBlogRoutes, because blog.ts value-imports @/lib/site, which
 *   throws when NEXT_PUBLIC_SITE_URL is unset. The filter below is the same one
 *   getAllPublishedBlogRoutes applies (blog.ts:218).
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getEcosystemReviews } from "../src/lib/ecosystemContent/reviews.ts";
import { getEcosystemDestinationRoutes } from "../src/lib/ecosystemContent/destinationDetail.ts";
import { getEcosystemTourPackageRoutes } from "../src/lib/ecosystemContent/tourPackageDetail.ts";
import { getEcosystemWebsiteRoutes } from "../src/lib/ecosystemContent/website.ts";
import { getPublicCrewCodes } from "../src/lib/people/canonicalPeople.ts";
import { PUBLIC_ROUTE_CONTRACT } from "../src/lib/routes/publicRouteContract.ts";
import {
  buildPublicRouteInventory,
  findDuplicateRoutes,
} from "../src/lib/routes/buildPublicRouteInventory.ts";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");

/**
 * Route literals a sitemap.data.ts publishes as `url("/path")`.
 * Comments are stripped first — src/app/sitemap.data.ts:12-13 hold two
 * commented-out entries that must not count as published routes.
 * Dynamic entries use backticks and are excluded by requiring a double quote.
 */
export function extractSitemapStaticRoutes(source) {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  const matches = withoutComments.matchAll(/\burl\("(\/[^"]*)"\)/g);
  return [...matches].map((m) => m[1]);
}

async function findSitemapDataFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await findSitemapDataFiles(full)));
    else if (entry.name === "sitemap.data.ts") found.push(full);
  }
  return found.sort();
}

async function loadSources() {
  const [reviews, destinations, crewCodes, websiteIndex] = await Promise.all([
    getEcosystemReviews(),
    getEcosystemDestinationRoutes(),
    getPublicCrewCodes(),
    getEcosystemWebsiteRoutes(),
  ]);
  return {
    reviewIds: reviews.map((r) => String(r.id)),
    crewCodes,
    destinationSlugs: destinations.map((d) => d.slug),
    tourSlugsFromBali: getEcosystemTourPackageRoutes("tours/from-bali").map((t) => t.slug),
    tourSlugsFromSurabaya: getEcosystemTourPackageRoutes("tours/from-surabaya").map((t) => t.slug),
    blogRoutes: (websiteIndex.routes ?? [])
      .map((item) => item.route)
      .filter((route) => route.startsWith("/blog/")),
  };
}

async function main(argv) {
  const jsonFlagAt = argv.indexOf("--json");
  const jsonPath = jsonFlagAt === -1 ? null : argv[jsonFlagAt + 1];
  if (jsonFlagAt !== -1 && !jsonPath) {
    console.error("usage: --json requires a path");
    return 2;
  }
  const strictExpectations = argv.includes("--strict-expectations");

  const sources = await loadSources();
  const violations = [];

  // An empty dynamic source means the ekosistem read failed. Reporting an
  // inventory built from nothing would look identical to "all clean" — the
  // exact failure mode CLAUDE.md Rule 8 warns about.
  for (const [key, values] of Object.entries(sources)) {
    if (values.length === 0) violations.push(`source "${key}" is empty — ekosistem read likely failed`);
  }

  const inventory = buildPublicRouteInventory(sources, {
    generatedAt: new Date().toISOString(),
  });

  for (const route of findDuplicateRoutes(inventory)) {
    violations.push(`duplicate route claimed by two families: ${route}`);
  }

  // Drift guard for the duplicated static lists (owner decision 2026-09-06).
  const declared = new Set(
    PUBLIC_ROUTE_CONTRACT.filter((f) => f.kind === "static").flatMap((f) => f.routes),
  );
  const live = new Set();
  for (const file of await findSitemapDataFiles(APP_DIR)) {
    for (const route of extractSitemapStaticRoutes(await readFile(file, "utf8"))) {
      live.add(route);
    }
  }
  for (const route of [...live].sort()) {
    if (!declared.has(route)) violations.push(`sitemap publishes ${route}; contract does not declare it`);
  }
  for (const route of [...declared].sort()) {
    if (!live.has(route)) violations.push(`contract declares ${route}; no sitemap.data.ts publishes it`);
  }

  const unconfirmed = PUBLIC_ROUTE_CONTRACT.filter(
    (f) => f.websiteOutputExpected === "unconfirmed" || f.schemaOutputExpected === "unconfirmed",
  );
  if (strictExpectations) {
    for (const family of unconfirmed) {
      violations.push(`${family.id}: artifact expectation still "unconfirmed"`);
    }
  }

  if (jsonPath) {
    await writeFile(jsonPath, `${JSON.stringify(inventory, null, 2)}\n`);
  }

  console.log(`routes:      ${inventory.routes.length}`);
  console.log(`families:    ${PUBLIC_ROUTE_CONTRACT.length}`);
  console.log(`static live: ${live.size}`);
  console.log(`unconfirmed: ${unconfirmed.length} family/families${strictExpectations ? " (strict)" : " (T02 will declare these)"}`);

  if (violations.length > 0) {
    console.error(`FAILED: ${violations.length} violation(s)`);
    violations.forEach((v) => console.error(`  - ${v}`));
    return 1;
  }
  console.log(`OK: ${inventory.routes.length} routes, 0 violations`);
  return 0;
}

// fileURLToPath, not `new URL(import.meta.url).pathname` — on Win32 the latter
// yields "/D:/jvto-web/..." with a leading slash that path.resolve normalizes
// inconsistently against process.argv[1], so the guard silently never fires and
// the script exits 0 having validated nothing. Same spelling as
// jvto-ekosistem/scripts/validate-schema.mjs, which is the correct one there.
const isMainModule =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
  process.exit(await main(process.argv.slice(2)));
}
```

- [ ] **Step 3c: Add the npm scripts**

Both flags are load-bearing, and this lands before the script is ever run — every command from here on goes through npm, so the invocation that ships is the invocation that was tested. In `package.json`, alongside the existing `validate:*` entries:

```json
"validate:public-routes": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs scripts/validate-public-route-contract.mjs",
"test:routes": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/lib/register-ts-hook.mjs --test scripts/validate-public-route-contract.test.ts"
```

- [ ] **Step 4: Run the tests — all must pass**

```bash
cd /d/jvto-web && npm run test:routes
```
Expected: 14 pass, 0 fail.

- [ ] **Step 5: Run the validator for real — the drift guard earns its keep here**

```bash
cd /d/jvto-web && npm run validate:public-routes; echo "exit=$?"
```

Expected on first run: likely `exit=1` with `contract declares …` / `sitemap publishes …` lines, because the hand-copied static lists will not match on the first attempt. **That is the guard working.** Fix the contract's `routes` arrays until it prints `OK`. Do not weaken the guard to make it pass.

**If the command prints nothing at all and exits 0, the `isMainModule` guard did not fire** — `main()` never ran and nothing was validated. That is the silent-pass failure mode, not a success. Check `fileURLToPath(import.meta.url)` against `path.resolve(process.argv[1])` before going further.

Then confirm the route total equals Task 1 Step 4's six counts summed with the static count. If it does not, the discrepancy is real — investigate before proceeding.

- [ ] **Step 6: Prove the failure path, not just the success path**

A validator that has never been seen to fail is unverified.

```bash
cd /d/jvto-web && npm run validate:public-routes -- --strict-expectations; echo "exit=$?"
```
Expected: `exit=1`, listing every family with an `unconfirmed` expectation.

```bash
cd /d/jvto-web && npm run validate:public-routes -- --json; echo "exit=$?"
```
Expected: `exit=2`, `usage: --json requires a path`.

- [ ] **Step 7: Confirm the shipped invocation is the tested one**

```bash
cd /d/jvto-web && node scripts/validate-public-route-contract.mjs; echo "exit=$?"
```
Expected: **fails** with `Cannot find package '@/lib'`. That is correct — the flags in Step 3c are the contract, and anyone invoking the bare file is bypassing it. If this unexpectedly succeeds, the hook is being installed by something other than the npm script and the dependency is invisible; find out what before continuing.

- [ ] **Step 8: Run the full local gate**

```bash
cd /d/jvto-web && npm run test:routes && npm run validate:public-routes && npx tsc --noEmit && npm run lint && npm run test:stale && npm run validate && npm run build
```
Expected: all green. `npm run build` must still report **106/106** static pages and **104** route-table entries — Task 1's import change is the only edit to existing runtime code, and it must move neither number.

- [ ] **Step 9: Commit**

```bash
cd /d/jvto-web && git add scripts/validate-public-route-contract.mjs scripts/validate-public-route-contract.test.ts src/lib/routes/publicRouteContract.ts package.json
git commit -F - <<'MSGEOF'
feat(routes): add validate:public-routes with sitemap drift guard (T01)

Completes T01 (public route contract). The validator loads the live route
sources, expands them through PUBLIC_ROUTE_CONTRACT, and asserts the contract
holds. It reads everything and writes nothing unless --json is passed.

Exit codes follow scripts/verify-live.mjs: 0 pass, 1 contract violated,
2 usage error. Both failure paths were exercised, not just the success path:
--strict-expectations exits 1 listing every family whose artifact expectation
is still "unconfirmed", and --json without a path exits 2.

The static route lists are duplicated from src/app/**/sitemap.data.ts by owner
decision 2026-09-06 (foundation-only: no sitemap file is edited). The guard is
what makes that duplication safe -- every run re-extracts the url("/path")
literals from those files and fails on any route present on one side only, so
the two lists cannot drift apart silently.

Three sourcing decisions carry their reason in the script header: crew codes
come from getPublicCrewCodes so the G2 published/unpublished rule is not
copied and contradicted; blog routes are filtered off getEcosystemWebsiteRoutes
because blog.ts value-imports @/lib/site, which throws without
NEXT_PUBLIC_SITE_URL; and an empty dynamic source is a violation, because an
inventory built from a failed ekosistem read looks identical to a clean one.

Verified: test:routes green, validate:public-routes exit 0, tsc clean, lint
clean, test:stale 11/11, validate 52/52, build 106/106 pages and 104 route
entries -- unchanged. `git diff --stat origin/live..HEAD -- src/app` empty.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RDfJAM9hSdB5KqYFobKAdD
MSGEOF
```

---

## Verification

**Definition of Done (from the spec, § T01 lines 140-144):**

| Requirement | How it is met |
|---|---|
| `npm run validate:public-routes` available | Task 4 Step 7 |
| Validator exits `1` on duplicate/unclassified route | Task 4 Steps 5-6; `findDuplicateRoutes` + the two drift-guard loops |
| Sitemap content unchanged; foundation-only | No file under `src/app/**/sitemap*` is edited. Confirm with `git diff --stat origin/live..HEAD -- src/app` → empty |
| No duplicate route | `findDuplicateRoutes` + a unit test |
| Every route matches exactly one family | Structural: a route exists only because a family produced it; two families producing the same route is a duplicate and fails |
| Routes normalized, no uppercase | `normalizeRoute` applied at expansion; two unit tests |
| Dynamic records non-empty | Builder **throws** on an empty record; unit test asserts the throw |
| Deterministic output | Builder sorts and takes `generatedAt` by injection; unit test compares two runs |

**End-to-end check:**

```bash
cd /d/jvto-web
npm run test:routes                    # unit tests
npm run validate:public-routes         # exit 0, prints route/family/static counts
npm run build                          # 106/106 pages, 104 route entries — unchanged
git diff --stat origin/live..HEAD -- src/app   # must be empty
```

**What this does NOT prove.** Everything above is local evidence. Per CLAUDE.md Rule 9 that caps the status at `IN_PROGRESS`, not `DONE`. T01 adds no rendered output, so there is nothing for `npm run verify:live` to observe — record that as the reason, and keep the `STATUS.yaml` item at `IN_PROGRESS` until T02 gives the contract a live consumer.

**Deploy note.** Push to `live` is a production deploy and a decision gate — do not push without asking. Check `git log --oneline origin/live..HEAD` first; a doc commit already waiting should ride along.

## Follow-ups deliberately out of scope

- `normalizeRoute` now exists in three places. Collapsing `staticPageAdapter.ts:39` and `website.ts:128` onto the exported one edits the reader layer — a separate change.
- `PRODUCTION_ORIGIN` (`staticPageAdapter.ts:10`, hardcoded) and `BASE_URL` (`site.ts:9`, env-driven) disagree about the site origin. Not T01's to resolve, but T02 will have to pick one.
- `scripts/validate-review-detail-pages.mjs:5-9` carries a stale header claiming review-detail routes are deliberately absent from the sitemap. That stopped being true on 2026-08-21. Correct it when that file is next opened.
