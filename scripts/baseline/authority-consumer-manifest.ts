/**
 * Milestone 0 — Authority/Consumer Manifest generator.
 *
 * Extends the Package-00 route audit into a full baseline manifest: every public
 * route AND generated/machine surface mapped to its AUTHORITY (content/ Git |
 * Postgres | producer-bundle | generated | legacy | unresolved) and its downstream
 * CONSUMERS — derived from EVIDENCE, never assumed:
 *   - authority follows imported resolver/component dependencies (depth-limited
 *     closure); when no known signal is reachable it is recorded `unresolved`,
 *     not guessed;
 *   - `sitemap` only for routes actually emitted by the sitemap.data.ts files;
 *   - `search/schema` only when a JSON-LD signal is present in the closure;
 *   - `AI/llms` only for crawlable public routes (in sitemap, not private);
 *   - `private` for authenticated/transactional routes (auth signal or the
 *     checkout / my-booking money surface) — these are never public AI/sitemap
 *     consumers unless the sitemap itself lists them.
 *
 * Deterministic (sorted, stable JSON) so a CI drift gate can regenerate and fail
 * on any non-empty git diff. Read-only w.r.t. app behavior. Emits:
 *   docs/architecture/authority-consumer-manifest.json  (machine-readable)
 *   docs/architecture/authority-consumer-manifest.md    (owner-readable)
 *
 * Run:   npx tsx scripts/baseline/authority-consumer-manifest.ts
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const REPO_ROOT = join(__dirname, "..", "..");
const SRC = join(REPO_ROOT, "src");
const WEBSITE_DIR = join(SRC, "app", "(website)");
const OUT_JSON = join(REPO_ROOT, "docs", "architecture", "authority-consumer-manifest.json");
const OUT_MD = join(REPO_ROOT, "docs", "architecture", "authority-consumer-manifest.md");

/** Resolver signals — matched across a route's import closure. */
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
  { id: "jsonld", re: /PageJsonLdCombined|\bJsonLd\b/ },
  { id: "prisma", re: /from ["']@\/lib\/prisma["']|\bprisma\./ },
];

/** Authenticated / private-surface signals. */
const AUTH_RE = /useSession|getServerSession|\bsignIn\(|next-auth|requireAuth|requireAdmin/;
/** Route prefixes that are transactional/private by contract (legacy money proxy). */
const PRIVATE_PREFIXES = ["/checkout", "/my-booking"];

/** Resolve an import specifier to a repo file (ts/tsx/index). Returns null if external/unresolvable. */
function resolveImport(spec: string, fromФile: string): string | null {
  let base: string | null = null;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith("./") || spec.startsWith("../")) base = join(dirname(fromФile), spec);
  else return null; // bare/external
  const cands = [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")];
  for (const c of cands) {
    try {
      if (statSync(c).isFile()) return c;
    } catch {
      /* not this candidate */
    }
  }
  return null;
}

function importsOf(text: string): string[] {
  const out: string[] = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

/** Build the depth-limited import closure of a page and classify its signals. */
function analyzeClosure(pageFile: string): {
  direct: string[];
  transitive: string[];
  auth: boolean;
  followed: number;
} {
  const directText = readFileSync(pageFile, "utf8");
  const direct = SIGNALS.filter((s) => s.re.test(directText)).map((s) => s.id);
  const transitive = new Set<string>();
  let auth = AUTH_RE.test(directText);

  const visited = new Set<string>([pageFile]);
  let frontier = importsOf(directText)
    .map((spec) => resolveImport(spec, pageFile))
    .filter((f): f is string => !!f && !f.includes("/generated/"));
  let followed = 0;
  for (let depth = 0; depth < 2 && frontier.length; depth++) {
    const next: string[] = [];
    for (const file of frontier) {
      if (visited.has(file)) continue;
      visited.add(file);
      let text: string;
      try {
        if (statSync(file).size > 400_000) continue;
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      followed++;
      for (const s of SIGNALS) if (s.re.test(text)) transitive.add(s.id);
      if (AUTH_RE.test(text)) auth = true;
      for (const spec of importsOf(text)) {
        const r = resolveImport(spec, file);
        if (r && !visited.has(r) && !r.includes("/generated/")) next.push(r);
      }
    }
    frontier = next;
  }
  const directSet = new Set(direct);
  return { direct, transitive: [...transitive].filter((t) => !directSet.has(t)).sort(), auth, followed };
}

function authorityFor(signals: string[], resolution: "direct" | "transitive" | "unresolved"): string {
  if (resolution === "unresolved") return "unresolved (no reachable resolver)";
  const via = resolution === "transitive" ? " (via import)" : "";
  if (signals.includes("static-content")) return "content/ (Git SSOT)" + via;
  if (signals.includes("okf-agent-guides")) return "producer: OKF" + via;
  if (signals.includes("policy-bundle") || signals.includes("trust-bundle")) return "producer: llm-wiki" + via;
  if (signals.includes("snapshot") || signals.includes("cms-seed") || signals.includes("getPageSeo"))
    return "legacy: snapshot/seed" + via;
  if (signals.includes("getContentPage") || signals.includes("content_pages")) return "legacy: content_pages (DB)" + via;
  if (signals.includes("prisma")) return "Postgres (DB)" + via;
  return "tsx-embedded narrative";
}

/** Parse the concrete route set the sitemap.data.ts files emit via url("..."). */
function sitemapRouteSet(): Set<string> {
  const set = new Set<string>();
  const files: string[] = [];
  const collect = (dir: string) => {
    for (const e of readdirSync(dir).sort()) {
      const p = join(dir, e);
      const s = statSync(p);
      if (s.isDirectory()) collect(p);
      else if (/sitemap(\.data)?\.ts$/.test(e)) files.push(p);
    }
  };
  collect(join(SRC, "app"));
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    const re = /url\(\s*["'](\/[^"']*)["']/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) set.add(m[1].replace(/\/$/, "") || "/");
  }
  return set;
}

/** llms surfaces route mentions (public/llms-full.txt) — evidence for AI/llms consumer. */
function llmsMentions(): string {
  const p = join(REPO_ROOT, "public", "llms-full.txt");
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

function walkPages(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkPages(full));
    else if (entry === "page.tsx") out.push(full);
  }
  return out;
}

function routeForFile(rel: string): string {
  if (/\(website\)\/page\.tsx$/.test(rel)) return "/";
  const m = rel.match(/\(website\)\/(.+?)\/page\.tsx$/);
  return m ? "/" + m[1] : "/" + rel;
}

export type Row = {
  surface: string;
  kind: "route" | "generated";
  file: string;
  authority: string;
  resolution: "direct" | "transitive" | "unresolved" | "n/a";
  resolvers: string[];
  private: boolean;
  consumers: string[];
};

const GENERATED: Array<{ surface: string; file: string; authority: string; consumers: string[] }> = [
  { surface: "/robots.txt", file: "src/app/robots.ts", authority: "generated (route registry + owner policy)", consumers: ["crawlers"] },
  { surface: "/sitemap.xml", file: "src/app/sitemap.ts", authority: "generated (per-cluster route lists + DB lastmod fallback)", consumers: ["search crawlers"] },
  { surface: "/llms.txt", file: "src/app/llms.txt/route.ts", authority: "generated/authored", consumers: ["AI crawlers"] },
  { surface: "/llms-full.txt", file: "public/llms-full.txt", authority: "authored (static)", consumers: ["AI crawlers"] },
  { surface: "/api/tours-feed", file: "src/app/(api)/api/tours-feed/route.ts", authority: "generated (DB projection)", consumers: ["declared feed consumers"] },
  { surface: "/api/build-info", file: "src/app/(api)/api/build-info/route.ts", authority: "generated (deploy SHA)", consumers: ["deploy verification"] },
];

/** Is `route` (possibly a [slug] pattern) represented in the sitemap set? */
function sitemapState(route: string, sitemap: Set<string>): "yes" | "dynamic" | "no" {
  if (sitemap.has(route)) return "yes";
  if (route.includes("[")) {
    const parent = route.replace(/\/\[[^\]]+\].*$/, "");
    if (parent && sitemap.has(parent)) return "dynamic";
  }
  return "no";
}

export function build(): Row[] {
  const sitemap = sitemapRouteSet();
  const llms = llmsMentions();
  const rows: Row[] = [];

  for (const file of walkPages(WEBSITE_DIR)) {
    const rel = relative(REPO_ROOT, file);
    const surface = routeForFile(rel);
    const { direct, transitive, auth } = analyzeClosure(file);
    const all = [...direct, ...transitive];
    const resolution: Row["resolution"] = direct.length ? "direct" : transitive.length ? "transitive" : "unresolved";
    const isPrivate = auth || PRIVATE_PREFIXES.some((p) => surface === p || surface.startsWith(p + "/"));

    const smap = sitemapState(surface, sitemap);
    const inSitemap = smap !== "no";
    const consumers = new Set<string>();
    consumers.add(isPrivate ? "web (auth)" : "web");
    if (isPrivate) consumers.add("private");
    if (inSitemap) consumers.add(smap === "dynamic" ? "sitemap (dynamic)" : "sitemap");
    if (all.includes("jsonld")) consumers.add("search/schema");
    // AI/llms: crawlable public routes only (in sitemap, not private) OR explicitly named in llms.
    if ((inSitemap && !isPrivate) || (surface !== "/" && llms.includes(surface))) consumers.add("AI/llms");

    rows.push({
      surface,
      kind: "route",
      file: rel,
      authority: authorityFor(all, resolution),
      resolution,
      resolvers: all.length ? all.sort() : ["none"],
      private: isPrivate,
      consumers: [...consumers].sort(),
    });
  }

  for (const g of GENERATED) {
    rows.push({
      surface: g.surface,
      kind: "generated",
      file: existsSync(join(REPO_ROOT, g.file)) ? g.file : `${g.file} (absent)`,
      authority: g.authority,
      resolution: "n/a",
      resolvers: ["n/a"],
      private: false,
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
  const priv = routes.filter((r) => r.private).length;
  const line = (r: Row) =>
    `| \`${r.surface}\` | \`${r.file}\` | ${r.authority} | ${r.resolution} | ${r.resolvers.join(", ")} | ${r.private ? "yes" : "no"} | ${r.consumers.join(", ")} |`;
  return [
    "# Authority / Consumer Manifest (Milestone 0 baseline)",
    "",
    "> **Generated — do not hand-edit.** Regenerate with `npm run baseline:manifest`; a CI `verify`",
    "> step regenerates and fails on any non-empty `git diff`. Grounded in",
    "> [JVTO_TECHNICAL_PROJECT_HANDOFF.md](./JVTO_TECHNICAL_PROJECT_HANDOFF.md) §6/§22.",
    ">",
    "> Consumers are **evidence-derived**: `sitemap` = route emitted by a `sitemap.data.ts`;",
    "> `search/schema` = JSON-LD signal in the import closure; `AI/llms` = crawlable public route",
    "> (in sitemap, not private) or named in `llms-full.txt`; `private` = auth signal or the",
    "> checkout / my-booking money surface. Authority follows the import closure; `unresolved`",
    "> means no known resolver was reachable (recorded, not guessed).",
    "",
    `**Public routes:** ${routes.length}  ·  **private:** ${priv}  ·  **generated surfaces:** ${gen.length}`,
    "",
    "## Authority distribution (public routes)",
    "",
    summary,
    "",
    "## Public routes",
    "",
    "| surface | file | authority | resolution | resolvers | private | consumers |",
    "|---|---|---|---|---|---|---|",
    ...routes.map(line),
    "",
    "## Generated / machine surfaces",
    "",
    "| surface | file | authority | resolution | resolvers | private | consumers |",
    "|---|---|---|---|---|---|---|",
    ...gen.map(line),
    "",
  ].join("\n");
}

const isDirectRun = !!process.argv[1] && /authority-consumer-manifest\.ts$/.test(process.argv[1]);
if (isDirectRun) {
  const rows = build();
  writeFileSync(OUT_JSON, JSON.stringify(rows, null, 2) + "\n");
  writeFileSync(OUT_MD, toMarkdown(rows));
  console.log(
    `[authority-consumer-manifest] wrote ${rows.filter((r) => r.kind === "route").length} routes ` +
      `(${rows.filter((r) => r.private).length} private) + ${rows.filter((r) => r.kind === "generated").length} generated surfaces`,
  );
}
