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
 * Route literals a sitemap.data.ts publishes as `url("/path")`.
 * Comments are stripped first — src/app/sitemap.data.ts holds commented-out
 * entries that must not count as published routes. Dynamic entries use
 * backticks and are excluded by requiring a double quote.
 */
export function extractSitemapStaticRoutes(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
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
    if (values.length === 0) {
      violations.push(`source "${key}" is empty — ekosistem read likely failed`);
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
  const live = new Set();
  for (const file of await findSitemapDataFiles(APP_DIR)) {
    for (const route of extractSitemapStaticRoutes(await readFile(file, "utf8"))) {
      live.add(route);
    }
  }
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
    `unconfirmed: ${unconfirmed.length} family/families${
      strictExpectations ? " (strict)" : " (T02 will declare these)"
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
