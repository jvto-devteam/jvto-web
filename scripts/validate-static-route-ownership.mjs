#!/usr/bin/env node
/**
 * validate-static-route-ownership.mjs — enforcement gate (PACKAGE 05c).
 *
 * Fails CI when a route migrated to the static-content SSOT (content/pages/**)
 * regains a legacy source. This is the cycle-breaker: without it, a later agent
 * (or a manual `sync:cms-seed`) could silently re-introduce snapshots, CMS seed
 * rows, DB fallback, or hardcoded claims for a migrated route.
 *
 * Checks (owner directive 2026-08-04):
 *   1. migrated route still present in pageSnapshots.ts or the CMS seed;
 *   2. a migrated route's page component imports a legacy resolver/fallback;
 *   3. the CMS write API can still edit migrated routes (guard missing);
 *   4. why-jvto FAQ HTML + FAQPage not built from the same content array;
 *   5. the why-jvto hub schema still reads narrative claims from the DB;
 *   6. forbidden claims resurface (14 crew, 7 drivers, ISIC Partner,
 *      INDECON as validator/partnership).
 *
 * Pure Node ESM (fs only) so it runs as a blocking ci.yml step without tsx or a
 * DB. Run `node scripts/validate-static-route-ownership.mjs --selftest` to prove
 * the matchers before trusting the real run.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_PAGES = join(REPO_ROOT, "content", "pages");
const WEBSITE_ROOT = join(REPO_ROOT, "src", "app", "(website)");
const SNAPSHOTS_FILE = join(REPO_ROOT, "src", "lib", "publicContent", "pageSnapshots.ts");
const SEED_PAGES = join(REPO_ROOT, "src", "data", "cms", "pages.json");
const SEED_SECTIONS = join(REPO_ROOT, "src", "data", "cms", "page_sections.json");
const CMS_API = [
  join(REPO_ROOT, "src", "app", "(api)", "api", "content-pages", "route.ts"),
  join(REPO_ROOT, "src", "app", "(api)", "api", "content-pages", "[id]", "route.ts"),
];

const failures = [];
const fail = (msg) => failures.push(msg);

/** Banned legacy readers — a migrated route's component must not import these. */
const BANNED_IDENTIFIERS = [
  "getPublicPageSnapshot",
  "publicPageSnapshots",
  "resolveFaqsForPage",
  "buildResolvedFaqSchema",
  "getContentPage",
  "getSeedFaqsForRoute",
  "seedResolver",
  "SEED_COVERED_ROUTES",
  "prisma.content_pages",
  "getAllNarrativeClaims",
  "dbPageSnapshots",
];

/** Forbidden claim patterns (owner check #6) — scanned in why-jvto content + components. */
const FORBIDDEN_CLAIMS = [
  { label: "14-crew claim", re: /\b14\b[^\n<]{0,24}\bcrew\b|\bcrew\b[^\n<]{0,24}\b14\b|\b14[- ]person\b/i },
  { label: "7-drivers claim", re: /\b7\s+drivers\b|7\s*guides\s*\+\s*7\s*drivers/i },
  { label: "ISIC Partner (must be 'ISIC provider')", re: /\bISIC\s+Partner(ship)?\b/i },
  { label: "INDECON as member/validator/partnership", re: /INDECON[^\n<]{0,30}\b(members?|validat\w*|partnership\w*)\b|\b(members?|validat\w*|partnership\w*)\b[^\n<]{0,30}INDECON/i },
];

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

/** Derive the migrated route set from published content/pages/** files. */
function migratedRoutes() {
  const routes = new Set();
  if (!existsSync(CONTENT_PAGES)) return routes;
  for (const file of walk(CONTENT_PAGES)) {
    if (file.endsWith(".json")) {
      const meta = JSON.parse(readFileSync(file, "utf8")).meta ?? {};
      if (meta.status === "published" && typeof meta.route === "string") routes.add(meta.route);
    } else if (file.endsWith(".md")) {
      const src = readFileSync(file, "utf8");
      const route = src.match(/^route:\s*"?([^\s"]+)"?\s*$/m)?.[1];
      const status = src.match(/^status:\s*"?([^\s"]+)"?\s*$/m)?.[1];
      if (route && status === "published") routes.add(route);
    }
  }
  return routes;
}

/** Map a route to its (website) page file: exact page.tsx, else the cluster [slug]/page.tsx. */
function pageFileForRoute(route) {
  const exact = join(WEBSITE_ROOT, route.replace(/^\//, ""), "page.tsx");
  if (existsSync(exact)) return exact;
  const slug = join(WEBSITE_ROOT, dirname(route).replace(/^\//, ""), "[slug]", "page.tsx");
  if (existsSync(slug)) return slug;
  return null;
}

function runChecks() {
  const routes = migratedRoutes();
  if (routes.size === 0) fail("no published content/pages/** routes found — loader/derivation broken");

  // 1. snapshot + seed leakage
  const snapSrc = existsSync(SNAPSHOTS_FILE) ? readFileSync(SNAPSHOTS_FILE, "utf8") : "";
  const seedPages = existsSync(SEED_PAGES) ? JSON.parse(readFileSync(SEED_PAGES, "utf8")) : [];
  const seedSections = existsSync(SEED_SECTIONS) ? JSON.parse(readFileSync(SEED_SECTIONS, "utf8")) : [];
  for (const r of routes) {
    if (new RegExp(`["']${r.replace(/[/]/g, "\\/")}["']\\s*:`).test(snapSrc)) {
      fail(`pageSnapshots.ts still has a manual snapshot for migrated route "${r}" — delete it`);
    }
    if (seedPages.some((o) => o?.route === r)) {
      fail(`src/data/cms/pages.json still covers migrated route "${r}" — CMS seed must not (sync:cms-seed restore? re-strip)`);
    }
    if (seedSections.some((o) => o?.route === r)) {
      fail(`src/data/cms/page_sections.json still covers migrated route "${r}" — CMS seed must not (sync:cms-seed restore? re-strip)`);
    }
  }

  // 2. component legacy-reader scan
  const scanned = new Set();
  for (const r of routes) {
    const file = pageFileForRoute(r);
    if (!file) {
      fail(`no page file found for migrated route "${r}" (expected exact page.tsx or cluster [slug]/page.tsx) — mapping broken`);
      continue;
    }
    if (scanned.has(file)) continue;
    scanned.add(file);
    const src = stripComments(readFileSync(file, "utf8"));
    for (const ident of BANNED_IDENTIFIERS) {
      if (new RegExp(`\\b${ident.replace(/[.]/g, "\\.")}\\b`).test(src)) {
        fail(`${file.replace(REPO_ROOT + "/", "")}: banned legacy reader "${ident}" — migrated routes read only content/ (AD-10)`);
      }
    }
  }

  // 3. CMS write API must carry the migrated-route guard
  for (const api of CMS_API) {
    const src = existsSync(api) ? readFileSync(api, "utf8") : "";
    if (!/isMigratedStaticRoute/.test(src)) {
      fail(`${api.replace(REPO_ROOT + "/", "")}: missing isMigratedStaticRoute guard — CMS could still edit migrated routes`);
    }
  }

  // 4. why-jvto FAQ: visible HTML + FAQPage from one array (buildStaticFaqSchema over page.faq)
  const hub = join(WEBSITE_ROOT, "why-jvto", "page.tsx");
  const slug = join(WEBSITE_ROOT, "why-jvto", "[slug]", "page.tsx");
  for (const f of [hub, slug]) {
    const src = existsSync(f) ? readFileSync(f, "utf8") : "";
    if (!/buildStaticFaqSchema\(/.test(src) || !/page\.faq|faqSource/.test(src)) {
      fail(`${f.replace(REPO_ROOT + "/", "")}: FAQ must be built from the single page.faq array via buildStaticFaqSchema (AD-08)`);
    }
  }

  // 5. hub schema must not read narrative claims from the DB
  const hubSrc = existsSync(hub) ? stripComments(readFileSync(hub, "utf8")) : "";
  if (/getAllNarrativeClaims/.test(hubSrc)) {
    fail("why-jvto/page.tsx: narrative-claims ItemList must load from content/entities, not getAllNarrativeClaims() (DB)");
  }
  if (!/loadEntity\(\s*["']narrative-claims["']\s*\)/.test(hubSrc)) {
    fail("why-jvto/page.tsx: expected loadEntity(\"narrative-claims\") — the hub must source claims from content/");
  }

  // 6. forbidden claims in why-jvto content + components
  const claimFiles = [
    ...walk(join(CONTENT_PAGES, "why-jvto")),
    join(REPO_ROOT, "content", "faqs"),
  ]
    .flatMap((p) => (statSync(p).isDirectory() ? walk(p) : [p]))
    .filter((p) => p.endsWith(".json"))
    .filter((p) => p.includes("why-jvto") || p.includes(join("content", "pages", "why-jvto")));
  const componentFiles = [hub, slug, join(WEBSITE_ROOT, "why-jvto", "HubInteractive.tsx")];
  for (const f of [...new Set([...claimFiles, ...componentFiles])]) {
    if (!existsSync(f)) continue;
    const src = readFileSync(f, "utf8");
    for (const { label, re } of FORBIDDEN_CLAIMS) {
      const m = src.match(re);
      if (m) fail(`${f.replace(REPO_ROOT + "/", "")}: forbidden claim (${label}): "${m[0]}"`);
    }
  }

  return routes;
}

function selftest() {
  const cases = [
    ["14 named crew. No freelancers.", FORBIDDEN_CLAIMS[0].re, true],
    ["11 active crew — 7 guides, 4 drivers", FORBIDDEN_CLAIMS[0].re, false],
    ["(7 guides + 7 drivers)", FORBIDDEN_CLAIMS[1].re, true],
    ["7 guides + 4 drivers", FORBIDDEN_CLAIMS[1].re, false],
    ["ISIC Partner", FORBIDDEN_CLAIMS[2].re, true],
    ["Registered ISIC Provider", FORBIDDEN_CLAIMS[2].re, false],
    ["INDECON live member", FORBIDDEN_CLAIMS[3].re, true],
    ["validated by INDECON membership", FORBIDDEN_CLAIMS[3].re, true],
    ["INDECON network listing", FORBIDDEN_CLAIMS[3].re, false],
    ["HPWKI, ISIC, INDECON partnerships", FORBIDDEN_CLAIMS[3].re, true],
  ];
  let ok = true;
  for (const [text, re, expected] of cases) {
    const got = re.test(text);
    if (got !== expected) {
      ok = false;
      console.error(`✗ SELF-TEST: ${JSON.stringify(text)} expected match=${expected}, got ${got}`);
    }
  }
  if (!ok) {
    console.error("[static-route-ownership] SELF-TEST FAILED — matcher gap");
    process.exit(1);
  }
  console.log("[static-route-ownership] self-test PASS (10 matcher cases)");
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}

selftest();
const routes = runChecks();
if (failures.length) {
  console.error(`\n[static-route-ownership] FAIL — ${failures.length} violation(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error(
    "\nMigrated routes must read only content/. Fix the source (delete the snapshot/seed row, " +
      "remove the legacy import, restore the CMS guard) — do not weaken this gate.",
  );
  process.exit(1);
}
console.log(
  `[static-route-ownership] PASS — ${routes.size} migrated route(s); no legacy source, CMS guard present, no forbidden claims.`,
);
