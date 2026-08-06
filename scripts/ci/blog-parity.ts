/**
 * PACKAGE 08 blog parity + BlogPosting-invariant negative self-test. Static — no server.
 *
 * Proves the /blog hub + every published post are content-owned (content/pages/blog/),
 * each a sitemap string-literal, the hub declares CollectionPage while posts declare
 * BlogPosting, every post carries a publishedDate (BlogPosting datePublished + sitemap
 * lastmod both depend on it), the BlogPosting builder is well-formed, and no blog route
 * leaks back into the CMS seed. The invariant checker is exercised by a negative
 * self-test so a malformed post fails the build, not the runtime page.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadStaticPage, listPublishedStaticPages } from "@/lib/static-content";
import { buildBlogPostingSchema } from "@/lib/schemas/buildBlogSchemas";
import type { PageMeta } from "@/lib/static-content/schemas";

const ROOT = process.cwd();
const SITEMAP = readFileSync(path.join(ROOT, "src/app/(website)/blog/sitemap.data.ts"), "utf8");
const PAGES_JSON = readFileSync(path.join(ROOT, "src/data/cms/pages.json"), "utf8");
const SECTIONS_JSON = readFileSync(path.join(ROOT, "src/data/cms/page_sections.json"), "utf8");

const HUB = "/blog";
// The two posts migrated in from src/data/blog — the parity floor. New posts are
// enumerated dynamically below and held to the same invariants automatically.
const EXPECTED_POSTS = [
  "/blog/2026-06-11-ijen-medical-checkup-requirement",
  "/blog/2026-06-11-kawah-ijen-guide",
];

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

// ── the post invariant (also driven by the negative self-test below) ────────────
type PartialMeta = Partial<Pick<PageMeta, "schemaTypes" | "publishedDate" | "title" | "description">>;
function blogPostMetaErrors(meta: PartialMeta): string[] {
  const errs: string[] = [];
  if (!meta.schemaTypes?.includes("BlogPosting")) errs.push("missing BlogPosting in schemaTypes");
  if (!meta.publishedDate) errs.push("missing publishedDate");
  if (!meta.title?.trim()) errs.push("missing title");
  if (!meta.description?.trim()) errs.push("missing description");
  return errs;
}

// ── hub parity ──────────────────────────────────────────────────────────────────
const hub = loadStaticPage(HUB);
if (!hub) {
  fail(`${HUB}: no content record (content/pages/blog/index.md)`);
} else {
  if (hub.meta.status !== "published") fail(`${HUB}: status "${hub.meta.status}" — must be published`);
  if (!hub.meta.schemaTypes.includes("CollectionPage")) fail(`${HUB}: hub must declare CollectionPage in schemaTypes`);
  if (!SITEMAP.includes(`url("${HUB}")`)) fail(`${HUB}: not a string-literal url("…") in the blog sitemap`);
}

// ── post parity (dynamic; the expected migration set must be present) ────────────
const posts = listPublishedStaticPages({ section: "blog" }).filter((p) => p.meta.route !== HUB);
const postRoutes = new Set(posts.map((p) => p.meta.route));
for (const r of EXPECTED_POSTS) {
  if (!postRoutes.has(r)) fail(`${r}: expected migrated post not found among published blog content`);
}
if (posts.length === 0) fail("no published blog posts found under content/pages/blog/");

for (const post of posts) {
  const route = post.meta.route;
  for (const e of blogPostMetaErrors(post.meta)) fail(`${route}: ${e}`);
  if (!SITEMAP.includes(`url("${route}")`)) fail(`${route}: not a string-literal url("…") in the blog sitemap`);

  const s = buildBlogPostingSchema(post.meta) as Record<string, unknown>;
  if (s["@type"] !== "BlogPosting") fail(`${route}: builder @type is "${String(s["@type"])}" (want BlogPosting)`);
  if (!s.headline) fail(`${route}: BlogPosting missing headline`);
  if (!s.url) fail(`${route}: BlogPosting missing url`);
  if (!s["@id"]) fail(`${route}: BlogPosting missing @id`);
  if (!s.datePublished) fail(`${route}: BlogPosting missing datePublished`);
  if (!(s.author as { "@id"?: string })?.["@id"]) fail(`${route}: BlogPosting missing author @id`);
  if (!(s.publisher as { "@id"?: string })?.["@id"]) fail(`${route}: BlogPosting missing publisher @id`);
}

// ── ownership: no blog route may leak back into the CMS seed ─────────────────────
if (/"route":\s*"\/blog/.test(PAGES_JSON)) fail("src/data/cms/pages.json still carries a /blog* route (seed must not own blog)");
if (/"route":\s*"\/blog/.test(SECTIONS_JSON)) fail("src/data/cms/page_sections.json still carries a /blog* route (seed must not own blog)");

// ── negative self-test: the invariant checker must reject a malformed post ────────
const goodMeta: PartialMeta = { title: "T", description: "D", schemaTypes: ["BlogPosting", "WebPage"], publishedDate: "2026-06-11" };
if (blogPostMetaErrors(goodMeta).length) fail("negative-test harness: a valid post meta was rejected");
const badMeta: PartialMeta = { title: "T", description: "D", schemaTypes: ["WebPage"] }; // no BlogPosting, no publishedDate
if (blogPostMetaErrors(badMeta).length < 2) fail("negative-test: a malformed post meta (no BlogPosting, no publishedDate) was not rejected");

// ── report ────────────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`[blog-parity] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[blog-parity] PASS — hub + ${posts.length} post(s) content-owned, each a sitemap ` +
    `string-literal; BlogPosting well-formed; blog absent from CMS seed; invariant checker ` +
    `rejects malformed posts.`,
);
