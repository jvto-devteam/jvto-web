/**
 * PACKAGE 04b route-parity + malformed-grid negative self-test. Static — no server.
 *
 * Proves every 04b Travel Guide route is content-owned (a published record under
 * content/pages/travel-guide/), that the four bespoke folder pages are kept + a
 * string-literal in the sitemap, that the 13 former OKF pages are now served by the
 * [slug] loader (no folder page), and that the shared bespoke-grid validators reject
 * malformed content (so a bad edit fails the build, not the runtime page).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { loadStaticPage } from "@/lib/static-content";
import {
  SeasonCardSchema,
  MonthRowSchema,
  KeyFactSchema,
  FaqListItemSchema,
  parseGrid,
} from "@/lib/content/travelGuideGrids";

const ROOT = process.cwd();
const APP = path.join(ROOT, "src/app/(website)/travel-guide");
const SITEMAP = readFileSync(path.join(APP, "sitemap.data.ts"), "utf8");

const FOLDER_OWNED = [
  "best-time-to-visit",
  "rijik-monthly-closure",
  "faq",
  "police-escort-for-groups",
];
const OKF_SERVED_BY_SLUG = [
  "blue-fire-and-sunrise",
  "booking-safety",
  "bromo-sunrise",
  "cancellation-travel-credit",
  "finish-in-bali",
  "how-booking-works",
  "malang-batu",
  "payment-and-deposit",
  "private-tour",
  "rooming-and-accommodation",
  "vehicle-and-luggage",
  "what-is-included",
  "why-stay-near-ijen",
];
const ALL_04B = [...FOLDER_OWNED, ...OKF_SERVED_BY_SLUG];

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

// ── route parity ───────────────────────────────────────────────────────────────
for (const slug of ALL_04B) {
  const route = `/travel-guide/${slug}`;
  const page = loadStaticPage(route);
  if (!page) {
    fail(`${route}: no content record under content/pages/travel-guide/`);
    continue;
  }
  if (page.meta.status !== "published") fail(`${route}: content status "${page.meta.status}" — must be published`);
  if (!page.meta.title.trim()) fail(`${route}: missing meta.title`);
  if (!page.meta.description.trim()) fail(`${route}: missing meta.description`);
  if (!SITEMAP.includes(`url("${route}")`)) fail(`${route}: not a string-literal url("…") in the travel-guide sitemap`);

  const folderPage = path.join(APP, slug, "page.tsx");
  const hasFolder = existsSync(folderPage);
  if (FOLDER_OWNED.includes(slug) && !hasFolder) {
    fail(`${route}: bespoke folder page missing (${slug}/page.tsx) — it must keep its custom layout`);
  }
  if (OKF_SERVED_BY_SLUG.includes(slug) && hasFolder) {
    fail(`${route}: still has a folder page (${slug}/page.tsx) — the OKF pages must be served by the [slug] loader`);
  }
}

// The [slug] loader must exclude the four folder-owned routes (no duplicate-path collision).
const SLUG_LOADER = readFileSync(path.join(APP, "[slug]", "page.tsx"), "utf8");
for (const slug of FOLDER_OWNED) {
  if (!SLUG_LOADER.includes(`/travel-guide/${slug}`)) {
    fail(`/travel-guide/${slug}: not in the [slug] loader's FOLDER_OWNED_ROUTES exclusion set`);
  }
}

// ── malformed-grid negative self-test ────────────────────────────────────────────
function expectThrows(fn: () => unknown, name: string) {
  try {
    fn();
    fail(`negative-test "${name}": expected a throw on malformed content, but it was accepted`);
  } catch {
    /* expected */
  }
}
function expectOk(fn: () => unknown, name: string) {
  try {
    fn();
  } catch (e) {
    fail(`positive-test "${name}": valid content was rejected — ${(e as Error).message}`);
  }
}

const validCard = {
  kind: "dry",
  label: "Dry Season",
  range: "May – October",
  points: [{ positive: true, text: "Clearest Bromo sunrises" }],
};
const validRow = { month: "May", bromo: "Excellent", ijen: "Excellent", tumpak: "Good", crowd: "Medium", sweet: true };

expectOk(() => parseGrid(SeasonCardSchema, [validCard], "season-cards"), "valid season card");
expectOk(() => parseGrid(MonthRowSchema, [validRow], "month-table"), "valid month row");
expectThrows(() => parseGrid(SeasonCardSchema, [{ kind: "dry", label: "x", range: "y" }], "season-cards"), "season card missing points");
expectThrows(() => parseGrid(SeasonCardSchema, [{ ...validCard, points: [] }], "season-cards"), "season card empty points");
expectThrows(() => parseGrid(SeasonCardSchema, [{ ...validCard, kind: "shoulder" }], "season-cards"), "season card invalid kind");
expectThrows(() => parseGrid(MonthRowSchema, [{ month: "May", bromo: "a", ijen: "b", tumpak: "c", crowd: "d" }], "month-table"), "month row missing sweet");
expectThrows(() => parseGrid(MonthRowSchema, [{ ...validRow, sweet: "yes" }], "month-table"), "month row non-boolean sweet");
expectThrows(() => parseGrid(KeyFactSchema, [{}], "key-facts"), "key fact missing text");
expectThrows(() => parseGrid(FaqListItemSchema, [{ question: "q" }], "faq-list"), "faq item missing answer");

// ── report ───────────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`[travel-guide-04b-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[travel-guide-04b-parity] PASS — ${ALL_04B.length} routes content-owned ` +
    `(${FOLDER_OWNED.length} bespoke folder pages + ${OKF_SERVED_BY_SLUG.length} via [slug]); ` +
    `malformed-grid validators reject bad content.`,
);
