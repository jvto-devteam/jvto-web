/**
 * Milestone 2 — remaining public narrative cutover: route-parity gate. Static, no DB, no server.
 *
 * Covers the 10 routes moved off the legacy readers (getPageSeo / getPublicPageSnapshot /
 * resolveFaqsForPage) onto the content/ SSOT. Per route it proves:
 *
 *   1. RENDERABLE — a published content record exists and carries non-empty narrative
 *      (lede or sections or body). A route whose record is missing/empty would render a blank
 *      page; combined with the CI `build` job (which prerenders every route and fails if a page
 *      throws) this is the render-success proof.
 *   2. PRODUCTION CANONICAL — staticRouteCanonical(route) == the feed's canonicalUrl ==
 *      PRODUCTION_ORIGIN + route (correct on the help box too, not just production).
 *   3. METADATA == CANONICAL CONTENT — the compiled knowledge feed's title/description for the
 *      route are exactly the content record's (browserTitle ?? title) / description. The page
 *      renders metadata from that same record, so feed, <title>, and content cannot diverge.
 *   4. VISIBLE == STRUCTURED-DATA PROJECTION — every section the record declares carries a
 *      renderable block, so the visible narrative and the JSON-LD read one source.
 *   5. FAQ VISIBLE == FAQPage — a route with a FAQ resolves it through `faqKey` → `page.faq`,
 *      the single array the page feeds to BOTH the visible list and the FAQPage node. A route
 *      with no FAQ must declare no faqKey (no invented FAQ, no schema-only FAQPage).
 *   6. DYNAMIC DATA PRESERVED — the tours hubs still import their DB package helper, and no
 *      package/price/count was frozen into content/.
 *   7. NO LEGACY FALLBACK — the page sources import none of the retired readers.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  loadStaticPage,
  staticRouteCanonical,
  canonicalUrlForRoute,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/static-content";
import { getKnowledgeEntry } from "@/lib/publicContent/publicKnowledge";

const ROOT = process.cwd();
const failures: string[] = [];
const fail = (m: string) => failures.push(m);

type Target = {
  route: string;
  page: string;
  /** true = a visible FAQ is expected (record must declare faqKey) */
  faq: boolean;
  /** DB helper that must still be imported (dynamic data preserved) */
  dynamicHelper?: string;
};

const TARGETS: Target[] = [
  { route: "/", page: "src/app/(website)/page.tsx", faq: true },
  { route: "/contact", page: "src/app/(website)/contact/page.tsx", faq: false },
  { route: "/trust", page: "src/app/(website)/trust/page.tsx", faq: false },
  { route: "/markets/singapore", page: "src/app/(website)/markets/singapore/page.tsx", faq: true },
  { route: "/markets/malaysia", page: "src/app/(website)/markets/malaysia/page.tsx", faq: true },
  { route: "/isic/student-package", page: "src/app/(website)/isic/student-package/page.tsx", faq: false },
  { route: "/student-deals/isic", page: "src/app/(website)/student-deals/isic/page.tsx", faq: false },
  { route: "/tours", page: "src/app/(website)/tours/page.tsx", faq: true, dynamicHelper: "getPublicPackageList" },
  { route: "/tours/from-bali", page: "src/app/(website)/tours/from-bali/page.tsx", faq: true, dynamicHelper: "getPublicPackageList" },
  { route: "/tours/from-surabaya", page: "src/app/(website)/tours/from-surabaya/page.tsx", faq: true, dynamicHelper: "getPublicPackageList" },
];

/** Retired readers: a migrated route may not import any of them. */
const LEGACY_READERS = [
  "getPageSeo",
  "getPublicPageSnapshot",
  "resolveFaqsForPage",
  "buildResolvedFaqSchema",
];

function hasRenderableNarrative(p: StaticPage): boolean {
  if (p.body && p.body.trim().length > 0) return true;
  if (p.lede?.some((l) => l.trim().length > 0)) return true;
  return (p.sections ?? []).length > 0;
}

/** A section is renderable when it declares at least one block (or is a titled anchor). */
function sectionsRenderable(p: StaticPage): string[] {
  const bad: string[] = [];
  for (const s of p.sections ?? []) {
    const blocks = (s as { blocks?: unknown[] }).blocks ?? [];
    if (!Array.isArray(blocks) || blocks.length === 0) bad.push(s.id);
  }
  return bad;
}

for (const t of TARGETS) {
  const page = loadStaticPage(t.route);

  // 1. renderable content record
  if (!page) { fail(`${t.route}: no content record — the route would fall back to legacy/blank`); continue; }
  if (page.meta.status !== "published") { fail(`${t.route}: content status "${page.meta.status}" — must be published`); continue; }
  if (!hasRenderableNarrative(page)) fail(`${t.route}: content record has no renderable narrative (no body/lede/sections)`);
  const emptySections = sectionsRenderable(page);
  if (emptySections.length) fail(`${t.route}: section(s) with no blocks — visible/JSON-LD projection would be empty: ${emptySections.join(", ")}`);

  // 2. production canonical
  const expected = canonicalUrlForRoute(t.route);
  const entry = getKnowledgeEntry(t.route);
  if (!entry) { fail(`${t.route}: absent from the compiled knowledge feed (run knowledge:compile)`); }
  else {
    if (entry.canonicalUrl !== expected) fail(`${t.route}: feed canonical "${entry.canonicalUrl}" != "${expected}"`);
    if (staticRouteCanonical(t.route) !== expected) fail(`${t.route}: rendered canonical != production canonical "${expected}"`);
    if (!expected.startsWith(PRODUCTION_ORIGIN)) fail(`${t.route}: canonical is not on the production origin`);

    // 3. metadata == canonical content
    const wantTitle = page.meta.browserTitle ?? page.meta.title;
    if (entry.title !== page.meta.title) fail(`${t.route}: feed title "${entry.title}" != content title "${page.meta.title}"`);
    if (entry.browserTitle !== wantTitle) fail(`${t.route}: feed browserTitle != content (browserTitle ?? title)`);
    if (entry.description !== page.meta.description) fail(`${t.route}: feed description != content description`);
  }

  // 5. FAQ visible == FAQPage (one array via faqKey -> page.faq)
  const faqCount = page.faq?.length ?? 0;
  if (t.faq) {
    if (!page.meta.faqKey) fail(`${t.route}: expected a visible FAQ but the record declares no faqKey`);
    if (faqCount === 0) fail(`${t.route}: faqKey declared but the resolved FAQ array is empty`);
    for (const [i, item] of (page.faq ?? []).entries()) {
      if (!item.question?.trim()) fail(`${t.route}: FAQ[${i}] has an empty question`);
      if (!item.answer?.trim()) fail(`${t.route}: FAQ[${i}] has an empty answer`);
    }
  } else {
    if (page.meta.faqKey) fail(`${t.route}: declares faqKey but renders no FAQ today — no invented FAQ, no schema-only FAQPage`);
    if (faqCount > 0) fail(`${t.route}: resolved ${faqCount} FAQ item(s) for a route with no visible FAQ`);
  }

  // 6 + 7. page source: dynamic data preserved, no legacy readers
  const abs = path.join(ROOT, t.page);
  if (!existsSync(abs)) { fail(`${t.route}: page file missing (${t.page})`); continue; }
  const src = readFileSync(abs, "utf8");
  if (!/loadStaticPage\s*\(/.test(src)) fail(`${t.route}: page does not read the content record via loadStaticPage`);
  if (!/staticRouteCanonical\s*\(/.test(src)) fail(`${t.route}: page does not wire canonical via staticRouteCanonical`);
  for (const reader of LEGACY_READERS) {
    if (new RegExp(`\\b${reader}\\b`).test(src)) fail(`${t.route}: still references the retired reader ${reader}`);
  }
  if (t.dynamicHelper && !new RegExp(`\\b${t.dynamicHelper}\\b`).test(src)) {
    fail(`${t.route}: dynamic package data lost — ${t.dynamicHelper} is no longer used`);
  }
}

// 6b. No package/price/count frozen into the tours content records.
const PRICE_RE = /\bIDR\s?[\d.,]+\s?(?:M|K|jt|million)?\b|\bRp\s?[\d.,]+/i;
const COUNT_RE = /\b\d{1,3}\s+(?:private\s+)?(?:packages|tours)\b/i;
for (const route of ["/tours", "/tours/from-bali", "/tours/from-surabaya"]) {
  const p = loadStaticPage(route);
  if (!p) continue;
  const raw = JSON.stringify(p);
  if (PRICE_RE.test(raw)) fail(`${route}: a price is frozen into content/ — prices must stay dynamic (DB)`);
  if (COUNT_RE.test(raw)) fail(`${route}: a package COUNT is frozen into content/ — counts must be derived from the DB list`);
}

// ── Negative self-tests: prove each predicate actually bites ─────────────────────
// (A green gate is worthless if its checks cannot fail — see the PKG-07 review.)
{
  const legacySrc = `const seo = await getPageSeo(ROUTE, fallbackSeo);`;
  const cleanSrc = `const page = loadStaticPage(ROUTE); staticRouteCanonical(ROUTE);`;
  const detects = (src: string) => LEGACY_READERS.some((r) => new RegExp(`\\b${r}\\b`).test(src));
  if (!detects(legacySrc)) fail("negative-test: a legacy reader (getPageSeo) was NOT detected");
  if (detects(cleanSrc)) fail("negative-test: a clean page source was flagged as legacy");
  if (!/loadStaticPage\s*\(/.test(cleanSrc)) fail("negative-test: loadStaticPage detection is broken");

  if (!PRICE_RE.test("From IDR 1.55M/pax")) fail("negative-test: a frozen IDR price was NOT detected");
  if (!PRICE_RE.test("Rp 2.850.000")) fail("negative-test: a frozen Rp price was NOT detected");
  if (PRICE_RE.test("all-inclusive private tours, priced per package"))
    fail("negative-test: price-free prose was flagged as a frozen price");

  if (!COUNT_RE.test("16 private packages")) fail("negative-test: a frozen package count was NOT detected");
  if (!COUNT_RE.test("4 Private Packages")) fail("negative-test: a frozen package count (title-case) was NOT detected");
  if (COUNT_RE.test("multi-day private tours from Bali"))
    fail("negative-test: count-free prose was flagged as a frozen count");

  const emptyProbe = { sections: [{ id: "x", blocks: [] }] } as unknown as StaticPage;
  if (sectionsRenderable(emptyProbe).length === 0)
    fail("negative-test: a section with zero blocks was NOT detected");
  const okProbe = { sections: [{ id: "x", blocks: [{ type: "markdown" }] }] } as unknown as StaticPage;
  if (sectionsRenderable(okProbe).length !== 0)
    fail("negative-test: a valid section was flagged as empty");

  if (hasRenderableNarrative({ sections: [] } as unknown as StaticPage))
    fail("negative-test: an empty record was accepted as renderable");
}

if (failures.length) {
  console.error(`[m2-narrative-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[m2-narrative-parity] PASS — ${TARGETS.length} migrated routes: content-owned narrative, ` +
    `production canonical == feed, metadata == content record, sections renderable, ` +
    `FAQ visible == FAQPage (single array), tours package data still DB-sourced with no ` +
    `price/count frozen into content/, and zero legacy readers.`,
);
