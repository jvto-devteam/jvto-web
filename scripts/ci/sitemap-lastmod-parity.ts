/**
 * Sitemap lastmod gate (PACKAGE 07). Static — no server, no database.
 *
 * Package 07 removed the `content_pages` (Prisma) tier from the sitemap's lastmod
 * resolution. This proves the removal is complete AND safe.
 *
 * Coverage is DERIVED FROM THE EMITTED SITEMAP, not from a hand-maintained list: the gate
 * scans every `sitemap.ts` / `sitemap.data.ts` for the URLs they actually emit. An earlier
 * revision of this gate iterated only `SITEMAP_LASTMOD_ROUTES` (32 routes) and therefore
 * passed while the sub-sitemaps emitted ~20 further routes that still fell through to the
 * force-dynamic request time (caught in review on #164).
 *
 * Checks:
 *   1. every emitted route resolves to a STABLE date — never the caller's fallback, which
 *      is the current request time (`src/app/sitemap.ts` is `force-dynamic`); a fall-through
 *      republishes that page as "modified" on every fetch;
 *   2. `getLastModified` returns that stable date even when the pre-built map misses the
 *      route (correctness must not depend on the enumerated list);
 *   3. resolved dates are real and in the past (a request-time leak shows as ~now);
 *   4. the sitemap lastmod path imports no Prisma/DB module;
 *   5. negative self-tests for the stability predicate and the route scanner.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  SITEMAP_LASTMOD_ROUTES,
  getSitemapLastModifiedMap,
  getLastModified,
  resolveStableLastModified,
} from "@/app/sitemap-utils";

const ROOT = process.cwd();
const failures: string[] = [];
const fail = (m: string) => failures.push(m);

/** Strip block + line comments so commented-out `url("…")` entries are not counted. */
export function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/** Every route the sitemap files actually emit via `url("…")`. */
function emittedRoutes(): string[] {
  const files: string[] = [];
  (function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const p = path.join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else if (/sitemap(\.data)?\.ts$/.test(entry)) files.push(p);
    }
  })(path.join(ROOT, "src/app"));

  const routes = new Set<string>();
  for (const f of files) {
    const text = stripComments(readFileSync(f, "utf8"));
    const re = /url\(\s*["'](\/[^"']*)["']/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      routes.add(m[1].replace(/\/$/, "") || "/");
    }
  }
  return [...routes].sort();
}

/** Stable = a real date that is not the current request time. */
function isStable(d: Date | undefined | null, now: Date): boolean {
  if (!d || Number.isNaN(d.getTime())) return false;
  return now.getTime() - d.getTime() > 60_000;
}

const now = new Date();
const SENTINEL = new Date(0);
const routes = emittedRoutes();
const map = getSitemapLastModifiedMap();

if (routes.length === 0) fail("no emitted sitemap routes found — the scanner is broken");

for (const route of routes) {
  // 1 + 3: a stable date must be resolvable for every emitted route.
  const resolved = resolveStableLastModified(route);
  if (!resolved) {
    fail(`${route}: no stable lastmod source (content record / snapshot / STATIC_ROUTE_LASTMOD) — falls back to the force-dynamic request time`);
    continue;
  }
  if (!isStable(resolved, now)) {
    fail(`${route}: lastmod "${resolved.toISOString()}" looks like the current request time`);
  }
  // 2: correctness must not depend on the pre-built map.
  const viaEmptyMap = getLastModified(new Map(), route, SENTINEL);
  if (viaEmptyMap.getTime() === SENTINEL.getTime()) {
    fail(`${route}: getLastModified fell through to the caller's fallback when the map missed the route`);
  }
}

// Cross-check: the enumerated cache list must not contain routes that cannot resolve.
for (const route of SITEMAP_LASTMOD_ROUTES) {
  if (!map.has(route)) fail(`${route}: listed in SITEMAP_LASTMOD_ROUTES but unresolvable`);
}

// 4: no DB reader anywhere in the lastmod path.
const DB_PATTERN = /@\/lib\/prisma|from ["']\.\.?\/.*prisma|prisma\.[a-zA-Z_]+\.(findMany|findFirst|findUnique)|getContentPage\b/;
for (const rel of ["src/app/sitemap-utils.ts", "src/app/sitemap.ts"]) {
  if (DB_PATTERN.test(readFileSync(path.join(ROOT, rel), "utf8"))) {
    fail(`${rel}: still references a Prisma/DB reader — the content_pages lastmod fallback must stay removed`);
  }
}

// 5: negative self-tests.
if (isStable(new Date(), now)) fail("negative-test: a request-time date was accepted as stable");
if (!isStable(new Date("2026-07-08T00:00:00Z"), now)) fail("negative-test: a valid past date was rejected");
if (isStable(null, now)) fail("negative-test: a missing date was accepted as stable");
if (stripComments('// { url: url("/commented-out") }\n').includes("/commented-out")) {
  fail("negative-test: the scanner counts commented-out url() entries");
}
if (!stripComments('{ url: url("/real") }').includes("/real")) {
  fail("negative-test: the scanner drops real url() entries");
}

if (failures.length) {
  console.error(`[sitemap-lastmod-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[sitemap-lastmod-parity] PASS — ${routes.length} EMITTED sitemap routes (derived from the ` +
    `sitemap files, not a hand list) resolve to a stable lastmod, including when the pre-built ` +
    `map misses them; no request-time fallback; the lastmod path performs no database read.`,
);
