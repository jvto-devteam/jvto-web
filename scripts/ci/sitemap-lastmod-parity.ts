/**
 * Sitemap lastmod gate (PACKAGE 07). Static — no server, no database.
 *
 * Package 07 removed the `content_pages` (Prisma) tier from the sitemap's lastmod
 * resolution. This proves the removal is complete AND safe:
 *
 *   1. every enumerated sitemap route resolves to a STABLE date — none falls through to
 *      the caller's fallback, which is the current request time (`src/app/sitemap.ts` is
 *      `force-dynamic`); a fall-through would republish that page as "modified" on every
 *      fetch, the unstable crawl signal fixed earlier for `/blog`;
 *   2. resolved dates are real, past, and not "now" (a request-time leak would show as a
 *      timestamp within seconds of the run);
 *   3. the sitemap lastmod path imports no Prisma/DB module — the fallback cannot return
 *      via a future edit;
 *   4. negative self-test: the stability predicate rejects a request-time date.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  SITEMAP_LASTMOD_ROUTES,
  getSitemapLastModifiedMap,
  getLastModified,
} from "@/app/sitemap-utils";

const ROOT = process.cwd();
const failures: string[] = [];
const fail = (m: string) => failures.push(m);

/** A lastmod is stable when it is a real date that is not the current request time. */
function isStable(d: Date | undefined, now: Date): boolean {
  if (!d || Number.isNaN(d.getTime())) return false;
  // Anything within 60s of "now" is indistinguishable from a request-time fallback.
  return now.getTime() - d.getTime() > 60_000;
}

const now = new Date();
// A sentinel the map can never produce, so a miss is detectable.
const SENTINEL = new Date(0);
const map = getSitemapLastModifiedMap();

if (SITEMAP_LASTMOD_ROUTES.length === 0) fail("SITEMAP_LASTMOD_ROUTES is empty");

for (const route of SITEMAP_LASTMOD_ROUTES) {
  const resolved = getLastModified(map, route, SENTINEL);
  if (resolved.getTime() === SENTINEL.getTime()) {
    fail(`${route}: no stable lastmod source (content record / snapshot / STATIC_ROUTE_LASTMOD) — would fall back to the request time`);
    continue;
  }
  if (!isStable(resolved, now)) {
    fail(`${route}: lastmod "${resolved.toISOString()}" looks like the current request time`);
  }
}

// 3. the sitemap lastmod path must not import Prisma / a DB reader.
const DB_PATTERN = /@\/lib\/prisma|from ["']\.\.?\/.*prisma|prisma\.[a-zA-Z_]+\.(findMany|findFirst|findUnique)|getContentPage\b/;
for (const rel of ["src/app/sitemap-utils.ts", "src/app/sitemap.ts"]) {
  const src = readFileSync(path.join(ROOT, rel), "utf8");
  if (DB_PATTERN.test(src)) {
    fail(`${rel}: still references a Prisma/DB reader — the content_pages lastmod fallback must stay removed`);
  }
}

// 4. negative self-test: the predicate must reject a request-time date and accept a real one.
if (isStable(new Date(), now)) fail("negative-test: a request-time date was accepted as stable");
if (!isStable(new Date("2026-07-08T00:00:00Z"), now)) fail("negative-test: a valid past date was rejected");
if (isStable(undefined, now)) fail("negative-test: a missing date was accepted as stable");

if (failures.length) {
  console.error(`[sitemap-lastmod-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[sitemap-lastmod-parity] PASS — ${SITEMAP_LASTMOD_ROUTES.length} sitemap routes resolve to a ` +
    `stable lastmod (content record / snapshot / explicit static date); no request-time fallback; ` +
    `the sitemap lastmod path performs no database read.`,
);
