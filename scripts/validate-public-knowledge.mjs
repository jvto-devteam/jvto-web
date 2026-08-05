#!/usr/bin/env node
/**
 * validate-public-knowledge.mjs — Public Knowledge Compiler consumer gate (Milestone 2).
 *
 * The manifest itself is kept in sync with content/ by a separate DRIFT step
 * (`npm run knowledge:compile` + `git diff --exit-code`, wired in ci.yml `verify`, the
 * same pattern as the Milestone 0 authority manifest). THIS gate enforces cross-surface
 * consistency + referential integrity of the committed manifest — that every compiled
 * public surface actually agrees:
 *
 *   1. every route's canonicalUrl === productionOrigin + route (AD-06);
 *   2. every route with a faqKey resolved a non-empty FAQ set (faqCount > 0);
 *   3. every route carries schemaTypes + title + description;
 *   4. every compiled route is present in the sitemap (parsed from sitemap*.ts url("…"));
 *   5. every named entity resolves to a content/entities/<name>.json file;
 *   6. the public feed route exists and reads the compiled manifest.
 *
 * Pure Node ESM (fs only). `--selftest` proves the checks before a real run.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(REPO_ROOT, "src", "lib", "publicContent", "generated", "public-knowledge.json");
const FEED_ROUTE = join(REPO_ROOT, "src", "app", "(api)", "api", "knowledge-feed", "route.ts");
const ENTITIES_DIR = join(REPO_ROOT, "content", "entities");
const APP_DIR = join(REPO_ROOT, "src", "app");

/** Parse the concrete route set the sitemap*.ts files emit via url("…"). */
function sitemapRouteSet(appDir = APP_DIR) {
  const set = new Set();
  const files = [];
  const collect = (dir) => {
    for (const e of readdirSync(dir).sort()) {
      const p = join(dir, e);
      const s = statSync(p);
      if (s.isDirectory()) collect(p);
      else if (/sitemap(\.data)?\.ts$/.test(e)) files.push(p);
    }
  };
  collect(appDir);
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    // Only URLs the sitemap actually EMITS via url("…") count. Deliberately NOT the
    // getContentPageLastModifiedMap([...]) lastmod list in sitemap.ts — a route can sit
    // in that array yet be dropped from emission, and this gate must catch that (a
    // compiled route silently missing from /sitemap.xml), not be fooled by it.
    const re = /url\(\s*["'](\/[^"']*)["']/g;
    let m;
    while ((m = re.exec(text))) set.add(m[1].replace(/\/$/, "") || "/");
  }
  return set;
}

/** Run the checks against a manifest object + environment. Returns an array of failures. */
export function checkManifest(manifest, { sitemap, entityNames, feedText }) {
  const failures = [];
  const fail = (m) => failures.push(m);

  if (!manifest || !Array.isArray(manifest.routes) || manifest.routes.length === 0) {
    fail("manifest has no routes");
    return failures;
  }
  const origin = manifest.productionOrigin;
  for (const r of manifest.routes) {
    if (r.canonicalUrl !== origin + r.route) fail(`${r.route}: canonicalUrl !== productionOrigin + route`);
    if (r.faqKey && !(r.faqCount > 0)) fail(`${r.route}: faqKey "${r.faqKey}" but faqCount ${r.faqCount}`);
    if (!Array.isArray(r.schemaTypes) || r.schemaTypes.length === 0) fail(`${r.route}: no schemaTypes`);
    if (!r.title || !r.description) fail(`${r.route}: missing title/description`);
    if (!sitemap.has(r.route)) fail(`${r.route}: compiled route is NOT present in any sitemap`);
  }
  for (const name of manifest.entities || []) {
    if (!entityNames.has(name)) fail(`entity "${name}" in manifest has no content/entities/${name}.json`);
  }
  if (manifest.counts?.routes !== manifest.routes.length) fail("counts.routes != routes.length");
  if (feedText !== null && !/getPublicKnowledgeManifest/.test(feedText))
    fail("knowledge-feed route does not read the compiled manifest");
  return failures;
}

function selftest() {
  let ok = true;
  const check = (cond, label) => {
    console.log(`  ${cond ? "ok  " : "FAIL"}  ${label}`);
    if (!cond) ok = false;
  };
  const base = {
    productionOrigin: "https://x.test",
    entities: ["organization"],
    counts: { routes: 1 },
    routes: [
      { route: "/policy", canonicalUrl: "https://x.test/policy", schemaTypes: ["WebPage"], title: "T", description: "D", faqKey: "k", faqCount: 3 },
    ],
  };
  const env = { sitemap: new Set(["/policy"]), entityNames: new Set(["organization"]), feedText: "getPublicKnowledgeManifest()" };
  check(checkManifest(base, env).length === 0, "valid manifest passes");
  check(
    checkManifest({ ...base, routes: [{ ...base.routes[0], canonicalUrl: "https://x.test/WRONG" }] }, env).length > 0,
    "bad canonical fails",
  );
  check(
    checkManifest({ ...base, routes: [{ ...base.routes[0], faqCount: 0 }] }, env).length > 0,
    "faqKey with 0 resolved items fails (referential integrity)",
  );
  check(checkManifest(base, { ...env, sitemap: new Set() }).length > 0, "route missing from sitemap fails");
  check(checkManifest(base, { ...env, entityNames: new Set() }).length > 0, "unknown entity fails");
  check(checkManifest(base, { ...env, feedText: "nope" }).length > 0, "feed not reading manifest fails");
  if (!ok) {
    console.error("[public-knowledge] SELF-TEST FAILED");
    process.exit(1);
  }
  console.log("[public-knowledge] self-test PASS (6 cases)");
}

if (process.argv.includes("--selftest")) {
  selftest();
  process.exit(0);
}
selftest();

if (!existsSync(MANIFEST_PATH)) {
  console.error(`[public-knowledge] FAIL — manifest missing: ${MANIFEST_PATH} (run 'npm run knowledge:compile')`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const sitemap = sitemapRouteSet();
const entityNames = new Set(
  existsSync(ENTITIES_DIR)
    ? readdirSync(ENTITIES_DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
    : [],
);
const feedText = existsSync(FEED_ROUTE) ? readFileSync(FEED_ROUTE, "utf8") : null;
if (feedText === null) {
  console.error(`[public-knowledge] FAIL — feed route missing: ${FEED_ROUTE}`);
  process.exit(1);
}

const failures = checkManifest(manifest, { sitemap, entityNames, feedText });
if (failures.length) {
  console.error(`\n[public-knowledge] FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `[public-knowledge] PASS — ${manifest.routes.length} compiled routes consistent across sitemap + feed + entities ` +
    `(digest ${String(manifest.contentDigest).slice(0, 12)}…).`,
);
