#!/usr/bin/env node
// Validates the JSON-LD structured data actually rendered on every public
// route: no duplicate @id, no duplicate singleton @type, within a single
// page's combined <script type="application/ld+json"> output.
//
// Built 2026-08-19 per a GEO audit's P1-A finding: PageJsonLdCombined.tsx
// (the ecosystem-branch merge/dedup guard) and several pages' inline @graph
// literals form 3 independently-authored emission paths with no automated
// check that they don't collide. Two REAL collisions were found and fixed
// by hand this way (a duplicate TouristTrip @id on tour PDPs from a second
// <script> tag; a guard that read @type off an unflattened @graph wrapper
// and so never actually filtered some pages). This script is the ongoing
// net so the next one is caught by CI instead of by a manual audit.
//
// Route list comes from the live sitemap.xml — not hardcoded — so it stays
// current without a second place to remember to update.
//
// Usage: node scripts/validate-jsonld-schema.mjs [--base-url=https://...]

const BASE_URL = (
  process.argv.find((a) => a.startsWith("--base-url="))?.split("=")[1] ??
  process.env.GEO_AUDIT_BASE_URL ??
  "https://javavolcano-touroperator.com"
).replace(/\/$/, "");

const SINGLETON_TYPES = new Set([
  "FAQPage",
  "WebSite",
  "BreadcrumbList",
  "ProfilePage",
  "CollectionPage",
]);

// Organization-family nodes are expected to repeat their @id across every
// page (that's the whole point of the @id — Google stitches the canonical
// definition via it) — a duplicate @id for THESE types is fine as long as
// only one carries the full definition. Everything else duplicating an @id
// within the SAME page is a real bug: two different nodes silently
// competing, or the same node declared twice.
const ID_DUPES_EXPECTED_FOR = new Set(["Organization", "TravelAgency", "LocalBusiness"]);

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      blocks.push({ __parseError: e.message, __raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

function flattenNodes(blocks) {
  const nodes = [];
  for (const block of blocks) {
    if (block.__parseError) continue;
    if (Array.isArray(block?.["@graph"])) {
      nodes.push(...block["@graph"]);
    } else if (block && typeof block === "object") {
      nodes.push(block);
    }
  }
  return nodes;
}

function typesOf(node) {
  const t = node?.["@type"];
  if (Array.isArray(t)) return t.filter((x) => typeof x === "string");
  return typeof t === "string" ? [t] : [];
}

async function fetchRoutes() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  return locs.map((u) => u.replace(BASE_URL, "") || "/");
}

async function validateRoute(route) {
  const url = `${BASE_URL}${route}`;
  const violations = [];

  let html;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      violations.push({ type: "fetch-error", detail: `HTTP ${res.status}` });
      return { route, violations, nodeCount: 0 };
    }
    html = await res.text();
  } catch (e) {
    violations.push({ type: "fetch-error", detail: e.message });
    return { route, violations, nodeCount: 0 };
  }

  const blocks = extractJsonLdBlocks(html);
  for (const b of blocks) {
    if (b.__parseError) {
      violations.push({ type: "parse-error", detail: b.__parseError, raw: b.__raw });
    }
  }

  const nodes = flattenNodes(blocks);

  // Duplicate @id (excluding organization-family, which is meant to repeat).
  const idSeen = new Map();
  for (const node of nodes) {
    const id = node?.["@id"];
    if (typeof id !== "string" || !id) continue;
    const types = typesOf(node);
    if (types.some((t) => ID_DUPES_EXPECTED_FOR.has(t))) continue;
    idSeen.set(id, (idSeen.get(id) ?? 0) + 1);
  }
  for (const [id, count] of idSeen) {
    if (count > 1) {
      violations.push({ type: "duplicate-id", detail: `@id "${id}" appears ${count} times` });
    }
  }

  // Duplicate singleton @type.
  const typeSeen = new Map();
  for (const node of nodes) {
    for (const t of typesOf(node)) {
      if (!SINGLETON_TYPES.has(t)) continue;
      typeSeen.set(t, (typeSeen.get(t) ?? 0) + 1);
    }
  }
  for (const [type, count] of typeSeen) {
    if (count > 1) {
      violations.push({ type: "duplicate-singleton-type", detail: `@type "${type}" appears ${count} times` });
    }
  }

  return { route, violations, nodeCount: nodes.length };
}

async function main() {
  console.log(`Validating JSON-LD on ${BASE_URL} ...`);
  const routes = await fetchRoutes();
  console.log(`${routes.length} routes from sitemap.xml`);

  const results = [];
  // Modest concurrency — enough to be fast, gentle enough not to look like a stress test.
  const CONCURRENCY = 6;
  let cursor = 0;
  async function worker() {
    while (cursor < routes.length) {
      const route = routes[cursor++];
      results.push(await validateRoute(route));
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const withViolations = results.filter((r) => r.violations.length > 0);
  const totalNodes = results.reduce((sum, r) => sum + r.nodeCount, 0);

  console.log(`\n${results.length} routes checked, ${totalNodes} total JSON-LD nodes.`);

  if (withViolations.length === 0) {
    console.log("OK: 0 violations.");
    return;
  }

  console.log(`\n${withViolations.length} route(s) with violations:\n`);
  for (const r of withViolations) {
    console.log(`  ${r.route}`);
    for (const v of r.violations) {
      console.log(`    - [${v.type}] ${v.detail}`);
    }
  }
  console.log("");
  process.exitCode = 1;
}

main().catch((e) => {
  console.error("[validate-jsonld-schema]", e.message);
  process.exit(1);
});
