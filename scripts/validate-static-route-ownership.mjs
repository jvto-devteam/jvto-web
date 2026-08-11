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

const SRC_ROOT = join(REPO_ROOT, "src");
const SCRIPTS_ROOT = join(REPO_ROOT, "scripts");
const GENERATED_DIR = join(REPO_ROOT, "src", "generated"); // prisma client types — excluded

/**
 * FREEZE (M0, handoff §16 "freeze new public-content writers in old producer
 * paths"). Three frozen source classes, each with an explicit allowed-writer
 * REGISTRY — static regex flags a write; the registry decides ownership (which
 * writers are sanctioned) where a regex alone cannot. Any writer NOT in the
 * registry that writes a frozen surface fails CI. Scanned across src/ AND scripts/.
 */
// Receiver-agnostic → catches prisma.content_pages.*, an alias like db.content_pages.*,
// and a destructured `const { content_pages } = prisma; content_pages.update(...)`.
const CONTENT_PAGES_WRITE_RE =
  /\bcontent_pages\.(create|update|upsert|createMany|updateMany|delete|deleteMany)\b/;
const WRITE_OP_RE = /writeFileSync|writeFile\(|createWriteStream|cpSync|copyFileSync/;
const CMS_SEED_PATH_RE = /data\/cms\b/;
const SNAPSHOT_PATH_RE = /pageSnapshots|publicContent\/generated/;

const FROZEN = [
  {
    id: "content_pages (frozen DB public-narrative store)",
    hit: (src) => CONTENT_PAGES_WRITE_RE.test(src),
    allowed: new Set([
      "src/app/(api)/api/content-pages/route.ts",
      "src/app/(api)/api/content-pages/[id]/route.ts",
      "scripts/ingest-workstream-c.mjs", // grandfathered legacy ingest — retire in a later milestone
      "scripts/validate-static-route-ownership.mjs", // this gate's own self-test fixtures
    ]),
  },
  {
    id: "CMS seed bundle (src/data/cms/*)",
    hit: (src) => WRITE_OP_RE.test(src) && CMS_SEED_PATH_RE.test(src),
    allowed: new Set(["scripts/sync-cms-seed.mjs", "scripts/validate-static-route-ownership.mjs"]),
  },
  {
    id: "narrative snapshots + compiled knowledge (pageSnapshots.ts / publicContent/generated)",
    hit: (src) => WRITE_OP_RE.test(src) && SNAPSHOT_PATH_RE.test(src),
    allowed: new Set([
      "scripts/export-public-review-snapshots.mjs",
      "scripts/export-package-activity-snapshots.mjs",
      "scripts/export-public-detail-snapshots.mjs",
      "scripts/export-public-faq-snapshots.mjs",
      "scripts/export-public-review-api-snapshots.mjs",
      "scripts/export-public-list-snapshots.mjs",
      // Milestone 2 Public Knowledge Compiler — sole writer of public-knowledge.json.
      "scripts/compile-public-knowledge.ts",
      "scripts/validate-content-drift.mjs",
      "scripts/validate-static-route-ownership.mjs",
    ]),
  },
];

/** Returns the violated frozen-class id for (rel, comment-stripped src), or null. */
function frozenWriterViolation(rel, src) {
  for (const f of FROZEN) if (f.hit(src) && !f.allowed.has(rel)) return f.id;
  return null;
}

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

  // 7. FREEZE (M0, handoff §16 "freeze new public-content writers in old producer
  //    paths"; §27 "Old producer restores stale public facts"). Scan src/ AND
  //    scripts/ for writers to any frozen source class (content_pages, CMS seed
  //    bundle, legacy narrative snapshots). Ownership is decided by the explicit
  //    allowed-writer REGISTRY (FROZEN) — a write from any other file fails,
  //    covering prisma aliases / repository wrappers a plain regex can't attribute.
  for (const root of [SRC_ROOT, SCRIPTS_ROOT]) {
    for (const file of walk(root)) {
      if (!/\.(ts|tsx|mjs|js)$/.test(file)) continue;
      if (file.startsWith(GENERATED_DIR)) continue; // generated prisma types (doc comments)
      const rel = file.replace(REPO_ROOT + "/", "");
      const violated = frozenWriterViolation(rel, stripComments(readFileSync(file, "utf8")));
      if (violated) {
        fail(
          `${rel}: new writer to a FROZEN producer path — ${violated} (handoff §16). ` +
            `Public narrative is Git-owned (content/pages/**). If this writer is legitimate, ` +
            `add it to the allowed-writer registry in scripts/validate-static-route-ownership.mjs with justification.`,
        );
      }
    }
  }

  // 8. Team cluster is PEOPLE-ENTITY-sourced. /team + /team/[slug] must read the
  //    canonical people record (content/entities/people.json via
  //    @/lib/people/canonicalPeople) and NEVER Prisma / content_pages /
  //    crew_members / getContentPage / the old hardcoded personas.
  const TEAM_PAGES = [
    join(WEBSITE_ROOT, "team", "page.tsx"),
    join(WEBSITE_ROOT, "team", "[slug]", "page.tsx"),
  ];
  const TEAM_BANNED = [
    "@/lib/prisma",
    "prisma.",
    "content_pages",
    "crew_members",
    "getContentPage",
    "getActiveCrewMembers",
    "@/lib/queries/crewMembers",
    "getPersonaByCode",
    "buildNamedGuidePersonaSchema",
    "employmentType",
  ];
  for (const f of TEAM_PAGES) {
    const rel = f.replace(REPO_ROOT + "/", "");
    if (!existsSync(f)) {
      fail(`Team route file missing: ${rel}`);
      continue;
    }
    const src = stripComments(readFileSync(f, "utf8"));
    for (const ident of TEAM_BANNED) {
      if (src.includes(ident)) {
        fail(`${rel}: Team route must be people-entity-sourced — remove "${ident}" (read content/entities/people.json via @/lib/people/canonicalPeople)`);
      }
    }
    if (!src.includes("@/lib/people/canonicalPeople")) {
      fail(`${rel}: Team route must read @/lib/people/canonicalPeople (the people SSOT)`);
    }
  }

  // 9. Destinations DETAIL cluster is content-SSOT-sourced (PACKAGE 06). Every published
  //    /destinations/<slug> content record must (a) have a matching detail-snapshot slug
  //    (content <-> SSG-param parity, both directions — dynamicParams=false), and (b) the
  //    detail render path (destinations/[slug]/page.tsx + DestinationDetailView.tsx +
  //    buildDestinationsSchemas.ts) must NOT carry the hardcoded per-slug narrative/SEO
  //    maps, and the page must read the static-content SSOT for narrative + SEO.
  const DEST_CONTENT_DIR = join(CONTENT_PAGES, "destinations");
  const detailContentSlugs = new Set();
  if (existsSync(DEST_CONTENT_DIR)) {
    for (const file of walk(DEST_CONTENT_DIR)) {
      if (!file.endsWith(".json")) continue;
      const meta = JSON.parse(readFileSync(file, "utf8")).meta ?? {};
      if (meta.status !== "published") continue;
      const m = typeof meta.route === "string" && meta.route.match(/^\/destinations\/([^/]+)$/);
      if (m) detailContentSlugs.add(m[1]);
    }
  }
  const DETAIL_SNAPSHOT = join(
    REPO_ROOT, "src", "lib", "publicContent", "generated", "destinationDetailSnapshots.json",
  );
  const snapSlugs = new Set();
  if (existsSync(DETAIL_SNAPSHOT)) {
    for (const it of JSON.parse(readFileSync(DETAIL_SNAPSHOT, "utf8")).items ?? []) {
      if (it && typeof it.slug === "string") snapSlugs.add(it.slug);
    }
  } else {
    fail("destinationDetailSnapshots.json missing — cannot verify content <-> SSG-param parity");
  }
  for (const s of snapSlugs) {
    if (!detailContentSlugs.has(s)) {
      fail(`/destinations/${s} renders (detail snapshot slug) but has no published content/pages/destinations/${s}.json — every detail route must have a canonical content record (Package 06)`);
    }
  }
  for (const s of detailContentSlugs) {
    if (!snapSlugs.has(s)) {
      fail(`content/pages/destinations/${s}.json is published but /destinations/${s} is not a detail-snapshot slug (dynamicParams=false → it would 404). Remove the content record or add the destination.`);
    }
  }
  const DETAIL_NARRATIVE_BANNED = [
    "DEST_TITLE_OVERRIDES", "DEST_DESC_OVERRIDES", "DEST_CHROME", "DEST_QUICK_FACTS",
    "DEST_ELEVATION_STAT", "DEST_TRAVEL_GUIDE_LINKS", "DEST_RELATED",
    "TOURIST_ATTRACTION_DATA", "DESTINATION_TO_TRAVEL_GUIDE",
  ];
  const DETAIL_RENDER_FILES = [
    join(WEBSITE_ROOT, "destinations", "[slug]", "page.tsx"),
    join(SRC_ROOT, "components", "website", "DestinationDetailView.tsx"),
    join(SRC_ROOT, "lib", "schemas", "buildDestinationsSchemas.ts"),
  ];
  for (const f of DETAIL_RENDER_FILES) {
    const rel = f.replace(REPO_ROOT + "/", "");
    if (!existsSync(f)) {
      fail(`destination detail render file missing: ${rel}`);
      continue;
    }
    const src = stripComments(readFileSync(f, "utf8"));
    for (const ident of DETAIL_NARRATIVE_BANNED) {
      if (new RegExp(`\\b${ident}\\b`).test(src)) {
        fail(`${rel}: destination detail narrative/SEO must come from content/ — remove hardcoded "${ident}" (Package 06, DB-narrative fallback banned)`);
      }
    }
  }
  const detailPageFile = join(WEBSITE_ROOT, "destinations", "[slug]", "page.tsx");
  if (existsSync(detailPageFile)) {
    const src = stripComments(readFileSync(detailPageFile, "utf8"));
    if (!/loadStaticPage|@\/lib\/static-content/.test(src)) {
      fail("destinations/[slug]/page.tsx: must read the static-content SSOT (loadStaticPage / @/lib/static-content) — detail narrative/SEO is Git-owned (Package 06)");
    }
  }

  return routes;
}

function selftest() {
  // (a) forbidden-claim matchers.
  const reCases = [
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
  // (b) FREEZE registry — negative-test EVERY frozen source class + its allow-list.
  const NEW = "src/lib/__new__/x.ts"; // on no allow-list
  const NEWS = "scripts/__new__/x.mjs";
  const freezeCases = [
    // content_pages: receiver-agnostic (alias / wrapper / destructure), write vs read.
    [NEW, "await db.content_pages.upsert({})", "content_pages"], // prisma alias
    [NEW, "const { content_pages } = prisma; content_pages.update({})", "content_pages"], // destructured wrapper
    [NEW, "prisma.content_pages.delete({})", "content_pages"],
    [NEW, "const r = await prisma.content_pages.findMany()", null], // read → ok
    ["src/app/(api)/api/content-pages/route.ts", "prisma.content_pages.upsert({})", null], // allowed CMS API
    ["scripts/ingest-workstream-c.mjs", "await prisma.content_pages.update({})", null], // grandfathered
    // CMS seed bundle writers.
    [NEWS, "writeFileSync('src/data/cms/pages.json', x)", "CMS seed"],
    ["scripts/sync-cms-seed.mjs", "writeFileSync('src/data/cms/pages.json', x)", null], // allowed generator
    [NEW, "const p = 'src/data/cms/pages.json'; readFileSync(p)", null], // read → ok
    // Legacy narrative snapshot writers.
    [NEWS, "writeFileSync('src/lib/publicContent/pageSnapshots.ts', x)", "snapshots"],
    [NEWS, "writeFileSync('src/lib/publicContent/generated/xSnapshot.json', x)", "snapshots"],
    ["scripts/export-public-detail-snapshots.mjs", "writeFileSync('publicContent/generated/x.json', x)", null], // allowed
  ];
  let ok = true;
  for (const [text, re, expected] of reCases) {
    if (re.test(text) !== expected) {
      ok = false;
      console.error(`✗ SELF-TEST claim: ${JSON.stringify(text)} expected ${expected}`);
    }
  }
  for (const [rel, src, expectedClass] of freezeCases) {
    const got = frozenWriterViolation(rel, src);
    const good = expectedClass === null ? got === null : !!got && got.includes(expectedClass);
    if (!good) {
      ok = false;
      console.error(`✗ SELF-TEST freeze: ${rel} ${JSON.stringify(src)} expected ${expectedClass}, got ${got}`);
    }
  }
  if (!ok) {
    console.error("[static-route-ownership] SELF-TEST FAILED — matcher gap");
    process.exit(1);
  }
  console.log(`[static-route-ownership] self-test PASS (${reCases.length} claim + ${freezeCases.length} freeze cases)`);
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
