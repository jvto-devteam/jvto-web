/**
 * Content-route canonical render-parity gate (Milestone 2 canonical fix). Static — no server.
 *
 * Proves the rendered <link rel="canonical"> for every content/-owned migrated route is the
 * absolute PRODUCTION canonical recorded by the knowledge feed — on EVERY deploy box,
 * including help/preview (where the layout's relative "./" + metadataBase would otherwise
 * emit a help-origin canonical).
 *
 *   A. Feed/helper agreement (dynamic — covers all migrated routes): for every published
 *      content route, staticRouteCanonical(route) == canonicalForRoute(route) ==
 *      PRODUCTION_ORIGIN + route. staticRouteCanonical is exactly what the pages render, so
 *      this ties the rendered canonical to the feed.
 *   B. Source ownership (static scan): every content/-owned route page wires its canonical
 *      through the shared helper and never derives it from an env host (NEXT_PUBLIC_SITE_URL /
 *      BASE_URL / process.env) — so no page can silently re-introduce a deploy-host canonical.
 *   C. Negative self-test: the scan predicate rejects an env-derived canonical and accepts
 *      the helper form.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  listPublishedStaticPages,
  staticRouteCanonical,
  canonicalUrlForRoute,
  PRODUCTION_ORIGIN,
} from "@/lib/static-content";
import { canonicalForRoute } from "@/lib/publicContent/publicKnowledge";

const ROOT = process.cwd();
const failures: string[] = [];
const fail = (m: string) => failures.push(m);

// ── A. Feed ↔ helper ↔ production-origin agreement for every content route ────────
const routes = listPublishedStaticPages().map((p) => p.meta.route);
if (routes.length === 0) fail("no published content routes found");
for (const route of routes) {
  const expected = canonicalUrlForRoute(route); // PRODUCTION_ORIGIN + normalized route
  const feed = canonicalForRoute(route);
  const helper = staticRouteCanonical(route);
  if (feed === null) {
    fail(`${route}: not present in the compiled knowledge feed (run knowledge:compile) — canonical unverifiable`);
    continue;
  }
  if (feed !== expected) fail(`${route}: feed canonical "${feed}" != production canonical "${expected}"`);
  if (helper !== feed) fail(`${route}: staticRouteCanonical "${helper}" != feed canonical "${feed}"`);
  if (!helper.startsWith(`${PRODUCTION_ORIGIN}/`) && helper !== `${PRODUCTION_ORIGIN}/`) {
    fail(`${route}: rendered canonical "${helper}" is not on the production origin`);
  }
}

// ── B. Every content/-owned route page wires canonical through the shared helper ───
// Explicit list: the page files that serve content/-owned routes (hubs, [slug] loaders, and
// the bespoke travel-guide folder pages). A new content cluster must be added here.
const CONTENT_OWNED_PAGE_FILES = [
  "src/app/(website)/blog/page.tsx",
  "src/app/(website)/blog/[slug]/page.tsx",
  "src/app/(website)/travel-guide/page.tsx",
  "src/app/(website)/travel-guide/[slug]/page.tsx",
  "src/app/(website)/travel-guide/faq/page.tsx",
  "src/app/(website)/travel-guide/best-time-to-visit/page.tsx",
  "src/app/(website)/travel-guide/police-escort-for-groups/page.tsx",
  "src/app/(website)/travel-guide/rijik-monthly-closure/page.tsx",
  "src/app/(website)/verify-jvto/page.tsx",
  "src/app/(website)/verify-jvto/legal/page.tsx",
  "src/app/(website)/verify-jvto/police-safety/page.tsx",
  "src/app/(website)/verify-jvto/press-recognition/page.tsx",
  "src/app/(website)/verify-jvto/history-artifacts/page.tsx",
  "src/app/(website)/policy/page.tsx",
  "src/app/(website)/policy/[slug]/page.tsx",
  "src/app/(website)/why-jvto/page.tsx",
  "src/app/(website)/why-jvto/[slug]/page.tsx",
  "src/app/(website)/destinations/page.tsx",
  "src/app/(website)/destinations/[slug]/page.tsx",
  "src/app/(website)/team/page.tsx",
  "src/app/(website)/team/[slug]/page.tsx",
];

/** Errors for a single page's source w.r.t. canonical ownership. */
function scanCanonicalOwnership(rel: string, src: string): string[] {
  const errs: string[] = [];
  const usesHelper = /\b(staticRouteCanonical|buildStaticRouteMetadata)\s*\(/.test(src);
  if (!usesHelper) {
    errs.push(`${rel}: canonical not wired through the shared helper (staticRouteCanonical/buildStaticRouteMetadata)`);
  }
  // A canonical assigned from an env/deploy-host source re-introduces the help-origin bug.
  const envCanonical = /canonical\s*:\s*[`'"]?\$?\{?\s*(BASE_URL|siteUrl|process\.env|NEXT_PUBLIC_SITE_URL)\b/.test(src);
  if (envCanonical) {
    errs.push(`${rel}: canonical is derived from an env/deploy-host value — must use the feed via staticRouteCanonical`);
  }
  return errs;
}

for (const rel of CONTENT_OWNED_PAGE_FILES) {
  const abs = path.join(ROOT, rel);
  if (!existsSync(abs)) {
    fail(`${rel}: content-owned page file missing (registry drift — update this gate)`);
    continue;
  }
  for (const e of scanCanonicalOwnership(rel, readFileSync(abs, "utf8"))) fail(e);
}

// ── C. Negative self-test: the predicate must catch an env-derived canonical ──────
const goodSrc = `alternates: { canonical: staticRouteCanonical("/x") },`;
const badSrc = "alternates: { canonical: `${BASE_URL}/x` },";
if (scanCanonicalOwnership("good.tsx", goodSrc).length !== 0) {
  fail("negative-test: a valid helper-wired canonical was rejected");
}
if (scanCanonicalOwnership("bad.tsx", badSrc).length === 0) {
  fail("negative-test: an env-derived canonical was NOT rejected");
}

if (failures.length) {
  console.error(`[static-canonical-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[static-canonical-parity] PASS — ${routes.length} content routes: rendered canonical == ` +
    `feed canonical == production origin; ${CONTENT_OWNED_PAGE_FILES.length} route pages wire ` +
    `canonical through the shared helper, none from a deploy host.`,
);
