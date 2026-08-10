/**
 * Destination-detail render-parity gate (PACKAGE 06). Static — no server required.
 *
 * Proves every `/destinations/<slug>` detail route draws its canonical narrative + SEO
 * from the static-content SSOT (content/pages/destinations/<slug>.json), and that the
 * content records and the SSG-param snapshot are in 1:1 parity (dynamicParams=false) —
 * so the visible narrative, metadata, JSON-LD, knowledge feed and sitemap all read one
 * canonical source. Per-route checks: HTTP 200, live dynamic volcanic/tour rendering,
 * and canonical HTTP headers are proven on the help/preview box post-deploy (this gate
 * is the offline half; the deploy step is the online half).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  loadStaticPage,
  listPublishedStaticPages,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/static-content";

const ROOT = process.cwd();
const SNAPSHOT = path.join(
  ROOT,
  "src/lib/publicContent/generated/destinationDetailSnapshots.json",
);

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

type LooseSection = Record<string, unknown> & {
  id: string;
  blocks?: Array<Record<string, unknown>>;
};

function section(page: StaticPage, id: string): LooseSection | undefined {
  return (page.sections ?? []).find((s) => s.id === id) as LooseSection | undefined;
}
function gridItems(sec: LooseSection | undefined, role: string): unknown[] | null {
  const block = (sec?.blocks ?? []).find(
    (b) => b.type === "grid" && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: unknown[] }).items ?? []) : null;
}
function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

const snapSlugs: string[] = (
  (JSON.parse(readFileSync(SNAPSHOT, "utf8")).items ?? []) as Array<{ slug?: unknown }>
)
  .map((i) => i.slug)
  .filter((s): s is string => typeof s === "string");

if (snapSlugs.length === 0) fail("no detail-snapshot slugs found — snapshot missing/empty");

for (const slug of snapSlugs) {
  const route = `/destinations/${slug}`;
  const page = loadStaticPage(route);
  if (!page) {
    fail(`${route}: no content record (content/pages/destinations/${slug}.json missing) — detail routes must be content-owned`);
    continue;
  }
  if (page.meta.status !== "published") fail(`${route}: content status "${page.meta.status}" — must be published`);
  if (page.canonicalUrl !== `${PRODUCTION_ORIGIN}${route}`) fail(`${route}: canonical "${page.canonicalUrl}" != ${PRODUCTION_ORIGIN}${route}`);
  if (!page.meta.title.trim()) fail(`${route}: missing meta.title (metadata == content)`);
  if (!page.meta.description.trim()) fail(`${route}: missing meta.description (metadata == content)`);
  if (!page.meta.schemaTypes.includes("TouristAttraction")) fail(`${route}: schemaTypes must include TouristAttraction`);
  if (!page.lede?.[0]?.trim()) fail(`${route}: missing lede[0] (intro/summary narrative)`);

  const chrome = section(page, "chrome");
  if (!chrome) fail(`${route}: missing "chrome" section`);
  else {
    if (!str(chrome.eyebrow)) fail(`${route}: chrome.eyebrow missing`);
    if (!gridItems(chrome, "quick-facts")?.length) fail(`${route}: chrome quick-facts grid missing/empty`);
    if (!gridItems(chrome, "elevation-stat")?.length) fail(`${route}: chrome elevation-stat grid missing`);
  }

  const attraction = section(page, "attraction");
  if (!attraction) fail(`${route}: missing "attraction" section (TouristAttraction JSON-LD source)`);
  else {
    if (!str(attraction.attraction_name)) fail(`${route}: attraction.attraction_name missing`);
    if (!Array.isArray(attraction.alternate_names)) fail(`${route}: attraction.alternate_names missing`);
    if (!str(attraction.body_md).trim()) fail(`${route}: attraction.body_md (JSON-LD description) missing`);
  }

  const signature = section(page, "signature");
  const sigBlocks = (signature?.blocks ?? []).filter(
    (b) => b.type === "markdown" && str(b.body_md).trim().length > 0,
  );
  if (sigBlocks.length === 0) fail(`${route}: "signature" section needs >=1 non-empty markdown block (visible narrative)`);

  const handoff = section(page, "handoff");
  if (handoff) {
    const tg = handoff.travel_guide as { href?: string; label?: string } | undefined;
    if (tg && (!tg.href || !tg.label)) fail(`${route}: handoff.travel_guide must have href + label`);
    const related = gridItems(handoff, "related") as Array<{ slug?: string; name?: string }> | null;
    if (related && related.some((r) => !r.slug || !r.name)) fail(`${route}: handoff related items need slug + name`);
  }

  // Facts lock: never surface the DB Ijen altitude (2769); never conditional Ijen-health wording.
  const raw = JSON.stringify(page);
  if (/\b2769\b/.test(raw)) fail(`${route}: content contains forbidden DB altitude 2769 — Ijen elevation is 2,386 m`);
  if (/Conditional\s*·|when the rule is active|Coordinated when rules require/i.test(raw)) {
    fail(`${route}: content contains conditional Ijen-health wording — screening is mandatory for every guest`);
  }
}

// Reverse parity: every published /destinations/<slug> content record must be a snapshot slug
// (else it is in the knowledge feed + sitemap but 404s at runtime, dynamicParams=false).
const contentDetailSlugs = listPublishedStaticPages({ section: "destinations" })
  .map((p) => p.meta.route)
  .filter((r) => /^\/destinations\/[^/]+$/.test(r))
  .map((r) => r.replace("/destinations/", ""));
for (const s of contentDetailSlugs) {
  if (!snapSlugs.includes(s)) {
    fail(`/destinations/${s}: published content but not a detail-snapshot slug (dynamicParams=false → 404)`);
  }
}

if (failures.length) {
  console.error(`[destinations-detail-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[destinations-detail-parity] PASS — ${snapSlugs.length} detail route(s): content-owned narrative + SEO, ` +
    `content <-> snapshot 1:1 parity, TouristAttraction schema source present, facts-lock clean.`,
);
