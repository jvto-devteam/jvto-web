#!/usr/bin/env node
// Validate src/lib/content/agentGuides.ts against its OKF source
// (src/data/okf/general-modules.json). Report-only: no writes.
//
// Two checks:
//   COVERAGE   — every AGENT_GUIDES route has at least one matching OKF module
//                (by link_key), so a route can't silently go orphaned from its
//                source of truth.
//   DIVERGENCE — re-runs the canonical content-drift denylist (the same rules
//                validate-content-drift.mjs enforces) against each route's
//                agentGuides.ts section bodies AND against the OKF module text
//                feeding that route. If OKF is clean but agentGuides.ts still
//                hits a rule, that's not just generic drift — it's proof
//                agentGuides.ts was hand-edited away from its source (exactly
//                how the pre-fix snapshot ended up shipping "cannot be
//                promised" and conditional Ijen-screening wording that OKF
//                itself had already dropped).
//
// Route → OKF link_key is mechanical (slug with hyphens → underscores) except
// two semantic renames recorded in ROUTE_LINK_KEY_OVERRIDES below.
//
// Exit codes: 0 = pass, 1 = any ERROR finding.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scanText } from "./lib/contentDriftRules.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OKF_PATH = join(REPO_ROOT, "src", "data", "okf", "general-modules.json");
const GUIDES_PATH = join(REPO_ROOT, "src", "lib", "content", "agentGuides.ts");

// Slugs whose OKF link_key is not the mechanical hyphen→underscore transform.
const ROUTE_LINK_KEY_OVERRIDES = {
  "blue-fire-and-sunrise": "natural_phenomena",
  "cancellation-travel-credit": "cancellation_package_credit",
  "booking-safety": "booking_safety_anti_fraud",
  "malang-batu": "malang_batu_guide",
};

function die(message) {
  console.error(`[validate-okf] FATAL: ${message}`);
  process.exit(1);
}

if (!existsSync(OKF_PATH)) die(`missing ${OKF_PATH} — run npm run sync:okf first.`);
if (!existsSync(GUIDES_PATH)) die(`missing ${GUIDES_PATH}`);

let modules;
try {
  modules = JSON.parse(readFileSync(OKF_PATH, "utf8"));
} catch (err) {
  die(`general-modules.json parse failed: ${err.message}`);
}

const guidesSource = readFileSync(GUIDES_PATH, "utf8");

// Parse AGENT_GUIDES as data (not by importing the .ts — this script has no
// TS loader). Extract each top-level guide object's slug and its `sections[].body`
// strings via a scoped regex walk, which is stable because the file is
// machine-generated JSON-shaped TS (see file header).
const guideBlocks = [...guidesSource.matchAll(/"slug":\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
if (guideBlocks.length === 0) die("found zero AGENT_GUIDES entries — parser broke, check agentGuides.ts shape.");

const SEVERITY = { ERROR: "ERROR", WARN: "WARN", INFO: "INFO" };
const findings = [];
function find(id, severity, message) {
  findings.push({ id, severity, message });
}

// ── COVERAGE ──────────────────────────────────────────────────────────────────

const modulesByLinkKey = new Map();
for (const m of modules) {
  if (!m.link_key) continue;
  if (!modulesByLinkKey.has(m.link_key)) modulesByLinkKey.set(m.link_key, []);
  modulesByLinkKey.get(m.link_key).push(m);
}

for (const slug of guideBlocks) {
  const linkKey = ROUTE_LINK_KEY_OVERRIDES[slug] ?? slug.replace(/-/g, "_");
  const matches = modulesByLinkKey.get(linkKey) ?? [];
  if (matches.length === 0) {
    find(
      "COVERAGE",
      SEVERITY.ERROR,
      `route "${slug}" has no matching OKF module (looked for link_key="${linkKey}") — ` +
        `either add a ROUTE_LINK_KEY_OVERRIDES entry or the route has gone orphaned from OKF.`,
    );
  } else {
    find("COVERAGE", SEVERITY.INFO, `route "${slug}" ← ${matches.length} OKF module(s) (link_key="${linkKey}")`);
  }
}

// ── DIVERGENCE ────────────────────────────────────────────────────────────────

// Extract each guide's raw block text (from its opening `"<slug>": {` to the next
// top-level guide key or closing brace) so drift scanning stays scoped per route.
function extractGuideBlock(slug) {
  const startMarker = `"${slug}": {`;
  const start = guidesSource.indexOf(startMarker);
  if (start === -1) return null;
  // Find the next guide entry start (or end of AGENT_GUIDES object) to bound this block.
  const rest = guidesSource.slice(start + startMarker.length);
  const nextGuide = rest.search(/\n\s{2}"[a-z0-9-]+":\s*\{/);
  const end = nextGuide === -1 ? rest.length : nextGuide;
  return rest.slice(0, end);
}

for (const slug of guideBlocks) {
  const block = extractGuideBlock(slug);
  if (block === null) continue;

  const guideHits = scanText(block, `agentGuides.ts#${slug}`);
  if (guideHits.length === 0) continue;

  const linkKey = ROUTE_LINK_KEY_OVERRIDES[slug] ?? slug.replace(/-/g, "_");
  const sourceModules = modulesByLinkKey.get(linkKey) ?? [];
  const sourceText = sourceModules
    .map((m) => `${m.short_answer ?? ""}\n${m.detail_summary ?? ""}`)
    .join("\n");
  const sourceHits = scanText(sourceText, `okf#${linkKey}`);

  for (const hit of guideHits) {
    const sourceAlsoHits = sourceHits.some((s) => s.rule === hit.rule);
    if (sourceAlsoHits) {
      // OKF source itself trips the same rule — not agentGuides.ts's doing;
      // validate-content-drift.mjs will catch/baseline it independently.
      find("DIVERGENCE", SEVERITY.WARN, `${hit.rel}:${hit.line} [${hit.rule}] present in OKF source too — "${hit.text}"`);
    } else {
      find(
        "DIVERGENCE",
        SEVERITY.ERROR,
        `${hit.rel}:${hit.line} [${hit.rule}] "${hit.text}" — OKF source for link_key="${linkKey}" is clean on this rule; ` +
          `agentGuides.ts diverged from its source. Re-run npm run sync:okf and regenerate this route's copy from OKF, don't hand-edit.`,
      );
    }
  }
}

if (findings.filter((f) => f.id === "DIVERGENCE").length === 0) {
  find("DIVERGENCE", SEVERITY.INFO, "no agentGuides.ts content diverges from its OKF source on any drift rule");
}

// ── report ────────────────────────────────────────────────────────────────────

const errors = findings.filter((f) => f.severity === SEVERITY.ERROR);
const warnings = findings.filter((f) => f.severity === SEVERITY.WARN);

console.log("\n[validate-okf] ───────────────────────────────────────────────");
console.log(`  OKF modules  : ${modules.length}`);
console.log(`  AGENT_GUIDES : ${guideBlocks.length} routes`);
console.log("────────────────────────────────────────────────────────────────");
for (const f of findings) {
  const prefix = f.severity === SEVERITY.ERROR ? "  ✗ ERROR" : f.severity === SEVERITY.WARN ? "  ⚠ WARN " : "  ✓ INFO ";
  console.log(`${prefix} [${f.id}] ${f.message}`);
}
console.log("────────────────────────────────────────────────────────────────");
console.log(`  Summary: ${errors.length} error(s)  ${warnings.length} warning(s)`);

if (errors.length > 0) {
  console.log("\n[validate-okf] FAILED\n");
  process.exit(1);
} else {
  console.log(`\n[validate-okf] ${warnings.length > 0 ? `PASS with ${warnings.length} warning(s)` : "PASS"}\n`);
  process.exit(0);
}
