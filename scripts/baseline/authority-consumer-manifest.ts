/**
 * Milestone 0 — Authority/Consumer Manifest generator.
 *
 * Extends scripts/static-content/audit-current-sources.ts (route→signal audit) into a
 * full baseline manifest: every public route AND generated/machine surface mapped to
 * its AUTHORITY (content/ Git | Postgres | producer-bundle | generated | legacy | tsx),
 * the resolver signals it uses, and its downstream CONSUMERS. Deterministic (sorted,
 * stable JSON) so a CI drift gate can regenerate and fail on any non-empty git diff.
 *
 * Read-only w.r.t. app behavior. Emits:
 *   docs/architecture/authority-consumer-manifest.json  (machine-readable)
 *   docs/architecture/authority-consumer-manifest.md    (owner-readable)
 *
 * Run:   npx tsx scripts/baseline/authority-consumer-manifest.ts
 * Check: same + `git diff --exit-code docs/architecture/authority-consumer-manifest.*`
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const REPO_ROOT = join(__dirname, "..", "..");
const WEBSITE_DIR = join(REPO_ROOT, "src", "app", "(website)");
const OUT_JSON = join(REPO_ROOT, "docs", "architecture", "authority-consumer-manifest.json");
const OUT_MD = join(REPO_ROOT, "docs", "architecture", "authority-consumer-manifest.md");

/** Resolver signals detected in a route file; order = reporting order. */
const SIGNALS: Array<{ id: string; re: RegExp }> = [
  { id: "static-content", re: /@\/lib\/static-content|loadStaticPage|loadStructuredPage|listStaticPages/ },
  { id: "okf-agent-guides", re: /AGENT_GUIDES|agentGuides|AgentGuide/ },
  { id: "policy-bundle", re: /policy-bundle|getPolicyNotes|getCustomerCopy|getPolicyEvidenceText|getPolicyDomain/ },
  { id: "trust-bundle", re: /trust-bundle/ },
  { id: "snapshot", re: /getPublicPageSnapshot/ },
  { id: "getPageSeo", re: /getPageSeo/ },
  { id: "getContentPage", re: /getContentPage/ },
  { id: "content_pages", re: /content_pages/ },
  { id: "cms-seed", re: /SEED_COVERED_ROUTES|seedResolver/ },
  { id: "faq-resolver", re: /resolveFaqsForPage/ },
  { id: "jsonld", re: /PageJsonLdCombined|JsonLd\b/ },
  { id: "prisma", re: /from ["']@\/lib\/prisma["']|prisma\./ },
];

/** Authority classification from the detected signals (highest-precedence first). */
function authorityFor(signals: string[]): string {
  if (signals.includes("static-content")) return "content/ (Git SSOT)";
  if (signals.includes("okf-agent-guides")) return "producer: OKF";
  if (signals.includes("policy-bundle") || signals.includes("trust-bundle")) return "producer: llm-wiki";
  if (signals.includes("snapshot") || signals.includes("cms-seed") || signals.includes("getPageSeo"))
    return "legacy: snapshot/seed";
  if (signals.includes("getContentPage") || signals.includes("content_pages")) return "legacy: content_pages (DB)";
  if (signals.includes("prisma")) return "Postgres (DB)";
  return "tsx-embedded narrative";
}

/** Consumers implied by the signals + universal public-surface consumers. */
function consumersFor(signals: string[]): string[] {
  const c = new Set<string>(["web", "AI/llms"]);
  if (signals.includes("jsonld")) c.add("search/schema");
  c.add("sitemap");
  return [...c].sort();
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry === "page.tsx") out.push(full);
  }
  return out;
}

function routeForFile(rel: string): string {
  if (/\(website\)\/page\.tsx$/.test(rel)) return "/"; // homepage
  const m = rel.match(/\(website\)\/(.+?)\/page\.tsx$/);
  return m ? "/" + m[1] : "/" + rel;
}

type Row = {
  surface: string;
  kind: "route" | "generated";
  file: string;
  authority: string;
  resolvers: string[];
  consumers: string[];
};

/** Generated/machine surfaces (explicit — few and specific). */
const GENERATED: Array<{ surface: string; file: string; authority: string; consumers: string[] }> = [
  { surface: "/robots.txt", file: "src/app/robots.ts", authority: "generated (route registry + owner policy)", consumers: ["crawlers"] },
  { surface: "/sitemap.xml", file: "src/app/sitemap.ts", authority: "generated (per-cluster route lists + DB lastmod fallback)", consumers: ["search crawlers"] },
  { surface: "/llms.txt", file: "src/app/llms.txt/route.ts", authority: "generated/authored", consumers: ["AI crawlers"] },
  { surface: "/llms-full.txt", file: "public/llms-full.txt", authority: "authored (static)", consumers: ["AI crawlers"] },
  { surface: "/api/tours-feed", file: "src/app/(api)/api/tours-feed/route.ts", authority: "generated (DB projection)", consumers: ["declared feed consumers"] },
  { surface: "/api/build-info", file: "src/app/(api)/api/build-info/route.ts", authority: "generated (deploy SHA)", consumers: ["deploy verification"] },
];

function build(): Row[] {
  const rows: Row[] = [];
  for (const file of walk(WEBSITE_DIR)) {
    const rel = relative(REPO_ROOT, file);
    const text = readFileSync(file, "utf8");
    const resolvers = SIGNALS.filter((s) => s.re.test(text)).map((s) => s.id);
    rows.push({
      surface: routeForFile(rel),
      kind: "route",
      file: rel,
      authority: authorityFor(resolvers),
      resolvers: resolvers.length ? resolvers : ["tsx-only"],
      consumers: consumersFor(resolvers),
    });
  }
  for (const g of GENERATED) {
    rows.push({
      surface: g.surface,
      kind: "generated",
      file: existsSync(join(REPO_ROOT, g.file)) ? g.file : `${g.file} (absent)`,
      authority: g.authority,
      resolvers: ["n/a"],
      consumers: g.consumers,
    });
  }
  return rows.sort((a, b) => a.surface.localeCompare(b.surface) || a.file.localeCompare(b.file));
}

function toMarkdown(rows: Row[]): string {
  const routes = rows.filter((r) => r.kind === "route");
  const gen = rows.filter((r) => r.kind === "generated");
  const authCounts = new Map<string, number>();
  for (const r of routes) authCounts.set(r.authority, (authCounts.get(r.authority) ?? 0) + 1);
  const summary = [...authCounts.entries()].sort().map(([a, n]) => `- ${a}: **${n}**`).join("\n");
  const line = (r: Row) => `| \`${r.surface}\` | \`${r.file}\` | ${r.authority} | ${r.resolvers.join(", ")} | ${r.consumers.join(", ")} |`;
  return [
    "# Authority / Consumer Manifest (Milestone 0 baseline)",
    "",
    "> **Generated — do not hand-edit.** Regenerate with `npm run baseline:manifest`; a CI `verify`",
    "> step regenerates and fails on any non-empty `git diff`. Grounded in",
    "> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](./JVTO_TECHNICAL_PROJECT_HANDOFF.md) §6/§22 — every public",
    "> route and generated surface maps to one authority + its consumers.",
    "",
    `**Public routes:** ${routes.length}  ·  **Generated surfaces:** ${gen.length}`,
    "",
    "## Authority distribution (public routes)",
    "",
    summary,
    "",
    "## Public routes",
    "",
    "| surface | file | authority | resolvers | consumers |",
    "|---|---|---|---|---|",
    ...routes.map(line),
    "",
    "## Generated / machine surfaces",
    "",
    "| surface | file | authority | resolvers | consumers |",
    "|---|---|---|---|---|",
    ...gen.map(line),
    "",
  ].join("\n");
}

const rows = build();
writeFileSync(OUT_JSON, JSON.stringify(rows, null, 2) + "\n");
writeFileSync(OUT_MD, toMarkdown(rows));
console.log(
  `[authority-consumer-manifest] wrote ${rows.filter((r) => r.kind === "route").length} routes + ${rows.filter((r) => r.kind === "generated").length} generated surfaces`,
);
