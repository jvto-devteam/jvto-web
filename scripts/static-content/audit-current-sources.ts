/**
 * PACKAGE 00 — Baseline audit of public-content sources (SSOT migration).
 *
 * Enumerates every route component under the six priority clusters and records
 * which content-resolution signals each file actually uses. Output is a
 * Markdown ledger table (stdout) whose rows seed
 * docs/architecture/public-content-migration-status.md.
 *
 * Read-only: this script never modifies rendering behavior.
 *
 * Run: npx tsx scripts/static-content/audit-current-sources.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const REPO_ROOT = join(__dirname, "..", "..");
const WEBSITE_DIR = join(REPO_ROOT, "src", "app", "(website)");

const CLUSTERS = [
  "policy",
  "travel-guide",
  "why-jvto",
  "verify-jvto",
  "team",
  "destinations",
] as const;

/** Signal → the resolver/source it indicates. Order matters for reporting. */
const SIGNALS: Array<{ id: string; re: RegExp; source: string }> = [
  { id: "snapshot", re: /getPublicPageSnapshot/, source: "snapshot/seed chain" },
  { id: "getContentPage", re: /getContentPage/, source: "content_pages (DB)" },
  { id: "content_pages", re: /content_pages/, source: "content_pages (raw)" },
  { id: "seed", re: /SEED_COVERED_ROUTES|seedResolver/, source: "cms-seed" },
  { id: "policy-bundle", re: /policy-bundle|getPolicyNotes|getCustomerCopy|getPolicyEvidenceText|getPolicyDomain/, source: "policy-bundle" },
  { id: "trust-bundle", re: /trust-bundle/, source: "trust-bundle" },
  { id: "okf-agent-guides", re: /AGENT_GUIDES|agentGuides|AgentGuide/, source: "OKF agent-guides" },
  { id: "faq-resolver", re: /resolveFaqsForPage/, source: "FAQ resolver" },
  { id: "jsonld", re: /PageJsonLdCombined/, source: "combined JSON-LD" },
  { id: "prisma", re: /from ["']@\/lib\/prisma["']|prisma\./, source: "Prisma (direct)" },
  { id: "getPageSeo", re: /getPageSeo/, source: "snapshot SEO (indirect)" },
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

function routeForFile(rel: string): string {
  // src/app/(website)/policy/[slug]/page.tsx -> /policy/[slug]
  const m = rel.match(/\(website\)\/(.+?)\/page\.tsx$/);
  if (m) return "/" + m[1];
  return "(" + rel + ")"; // non-page module (component, data, etc.)
}

function main(): void {
  const rows: string[] = [];
  for (const cluster of CLUSTERS) {
    const dir = join(WEBSITE_DIR, cluster);
    let files: string[] = [];
    try {
      files = walk(dir);
    } catch {
      continue; // cluster dir absent
    }
    for (const file of files.sort()) {
      const rel = relative(REPO_ROOT, file);
      const text = readFileSync(file, "utf8");
      const hits = SIGNALS.filter((s) => s.re.test(text)).map((s) => s.id);
      if (hits.length === 0 && !rel.endsWith("page.tsx")) continue; // skip silent helpers
      rows.push(
        `| ${routeForFile(rel)} | \`${rel}\` | ${hits.join(", ") || "tsx-only"} |`,
      );
    }
  }

  console.log("| route | file | signals |");
  console.log("|---|---|---|");
  for (const row of rows) console.log(row);
  console.log(`\n${rows.length} route files audited across ${CLUSTERS.length} clusters.`);
}

main();
