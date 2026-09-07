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
 *   what lets the src/ imports below resolve at all. --disable-warning silences
 *   MODULE_TYPELESS_PACKAGE_JSON, which node emits once per stripped .ts file
 *   and which otherwise buries the actual output; scripts/ has no package.json
 *   "type" field and adding one is out of scope. Same flag as test:stale.
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
 *   throws when NEXT_PUBLIC_SITE_URL is unset.
 *
 * The src imports below carry an explicit .ts extension. That is the opposite
 * of what the .ts test file next door does, and both are correct: .mjs is
 * outside tsconfig's include so tsc never sees it and node demands the
 * extension, while a .ts file is type-checked and an explicit .ts fails TS5097.
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
 * Strips comments before extraction — src/app/sitemap.data.ts holds
 * commented-out entries that must not count as published routes.
 *
 * The line-comment rule refuses to fire after ":" or a word character. The
 * naive /\/\/.*$/gm ate everything following a "https://" inside a string:
 * `{ url: url("/a"), note: "see https://x" }, { url: url("/b") }` silently lost
 * "/b". A dropped route is the dangerous direction — it never reaches `live`,
 * so a sitemap route missing from the contract reads as clean. Adversarial
 * review 2026-09-07.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(?<![:\w])\/\/.*$/gm, "");
}

/** Every `url(<arg>)` call. Spans lines: a call may be wrapped by a formatter. */
const URL_CALL = /\burl\(\s*([\s\S]*?)\s*\)/g;

/**
 * Classifies one `url()` argument. Anything unrecognised is reported rather
 * than ignored — the previous regex accepted only double-quoted single-line
 * literals and silently dropped url('/x'), url(`/x`), a call split across
 * lines, and url("/a/" + b). ESLint enforces no quote style here
 * (eslint.config.mjs is next/core-web-vitals + next/typescript, no `quotes`
 * rule), so every one of those shapes passes lint today.
 */
function classifyUrlCall(raw) {
  const double = /^"(\/[^"]*)"$/.exec(raw);
  if (double) return { kind: "route", route: double[1] };

  const single = /^'(\/[^']*)'$/.exec(raw);
  if (single) return { kind: "route", route: single[1] };

  if (raw.startsWith("`")) {
    // An interpolated template is a dynamic family, expanded from its source
    // and never declared as a static route. Deliberately not a violation.
    if (raw.includes("${")) return { kind: "dynamic" };
    const staticTemplate = /^`(\/[^`]*)`$/.exec(raw);
    if (staticTemplate) return { kind: "route", route: staticTemplate[1] };
  }

  return { kind: "unparsable" };
}

/** Route literals a sitemap.data.ts publishes as a static `url()` argument. */
export function extractSitemapStaticRoutes(source) {
  const routes = [];
  for (const match of stripComments(source).matchAll(URL_CALL)) {
    const classified = classifyUrlCall(match[1]);
    if (classified.kind === "route") routes.push(classified.route);
  }
  return routes;
}

/**
 * `url()` arguments the extractor cannot read, so the validator can fail loudly
 * instead of treating an unreadable call as an absent route.
 */
export function findUnparsableSitemapUrlCalls(source) {
  const unparsable = [];
  for (const match of stripComments(source).matchAll(URL_CALL)) {
    if (classifyUrlCall(match[1]).kind === "unparsable") unparsable.push(match[1]);
  }
  return unparsable;
}

/**
 * Minimum record count per dynamic source. Measured 2026-09-06 and re-measured
 * 2026-09-07; both runs identical, and their sum (267) plus the 38 static
 * routes is the recorded 305.
 *
 * These are floors, not equalities: growth passes, shrinkage stops the run. If
 * ekosistem legitimately publishes fewer records, lower the number here in the
 * same commit and say why. A floor that is edited to make a run pass without
 * that reason is the guard being disabled, not maintained.
 */
// Exported 2026-09-07 so scripts/reconcile-route-outputs.mjs (T02) enforces the
// SAME floors instead of carrying a second copy. Two copies drift, and a drifted
// floor is a disabled guard that still looks like a guard. Zero behaviour change
// here — the keyword is the only edit.
export const SOURCE_FLOORS = {
  reviewIds: 231,
  crewCodes: 11,
  destinationSlugs: 5,
  tourSlugsFromBali: 4,
  tourSlugsFromSurabaya: 13,
  blogRoutes: 3,
};

async function findSitemapDataFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await findSitemapDataFiles(full)));
    else if (entry.name === "sitemap.data.ts") found.push(full);
  }
  return found.sort();
}

// Exported 2026-09-07 for the same reason as SOURCE_FLOORS: T02 needs the exact
// inventory this validator builds, and a reimplementation would be a second
// definition of "what the public routes are" in a repo whose whole point is
// having one. Note getPublicCrewCodes throws when the sibling ekosistem repo is
// missing while the review and blog readers return empty — so a caller cannot
// treat a resolved promise as proof the sources were really read. Check floors.
export async function loadSources() {
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

  // A short dynamic source means the ekosistem read failed. `length === 0` was
  // the only integrity check until 2026-09-07, and it catches just the total
  // wipe: a truncated HTTP payload from the fallback, or a stale sibling
  // checkout, returns 1 review of 231 and prints "OK: 75 routes, 0 violations"
  // — the exact silent pass CLAUDE.md Rule 8 warns about, and the one this
  // file's own header claimed to prevent. Floors are what make the headline
  // count mean something.
  for (const [key, floor] of Object.entries(SOURCE_FLOORS)) {
    const count = sources[key].length;
    if (count === 0) {
      violations.push(`source "${key}" is empty — ekosistem read likely failed`);
    } else if (count < floor) {
      violations.push(
        `source "${key}": ${count} record(s), below the recorded floor of ${floor} — ` +
          `either the ekosistem read is partial, or the floor is stale and must be lowered deliberately`,
      );
    }
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
  // Occurrences, not a Set: two files emitting the same url() put a genuine
  // duplicate <url> entry in sitemap.xml, and a Set would dedupe it away and
  // report clean. findDuplicateRoutes only inspects the contract expansion, so
  // nothing else would notice. Adversarial review 2026-09-07.
  const occurrences = new Map();
  for (const file of await findSitemapDataFiles(APP_DIR)) {
    const source = await readFile(file, "utf8");
    const relative = path.relative(ROOT, file);
    for (const route of extractSitemapStaticRoutes(source)) {
      const emitters = occurrences.get(route) ?? [];
      emitters.push(relative);
      occurrences.set(route, emitters);
    }
    for (const raw of findUnparsableSitemapUrlCalls(source)) {
      violations.push(
        `${relative}: url(${raw}) is not a form the extractor can read — ` +
          `it would be dropped, and a dropped route reads as "not published"`,
      );
    }
  }
  for (const [route, emitters] of occurrences) {
    if (emitters.length > 1) {
      violations.push(`${route} is published ${emitters.length}x, by ${emitters.join(" and ")}`);
    }
  }
  const live = new Set(occurrences.keys());
  for (const route of [...live].sort()) {
    if (!declared.has(route)) {
      violations.push(`sitemap publishes ${route}; contract does not declare it`);
    }
  }
  for (const route of [...declared].sort()) {
    if (!live.has(route)) {
      violations.push(`contract declares ${route}; no sitemap.data.ts publishes it`);
    }
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
  console.log(
    // 2026-09-07: was "(T02 will declare these)". T02 declared all 15, so the
    // line now describes what a NON-zero count would mean — a family added
    // without measuring it — rather than promising work that is already done.
    `unconfirmed: ${unconfirmed.length} family/families${
      strictExpectations ? " (strict)" : " (undeclared — measure before merging)"
    }`,
  );

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
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
  process.exit(await main(process.argv.slice(2)));
}
