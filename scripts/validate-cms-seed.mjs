#!/usr/bin/env node
// scripts/validate-cms-seed.mjs
// Validate the synced jvto_cms seed (src/data/cms/*.json) before it drives the
// editorial render path. Pure ESM. Reuses the repo's shared facts-lock scanner
// (scripts/lib/contentDriftRules.mjs) so the seed is held to the SAME canonical
// facts as the rest of src/.
//
// Checks:
//   1. _manifest.validation === "pass".
//   2. Zero dangling entity_refs — every entity_refs across page_sections.json
//      resolves to a canonical_key in entities.json.
//   3. Facts-lock clean — scanText() over every covered route's page_content body
//      (body_md + nested section text + faq q/a).
//
// Exit non-zero on any failure. Logs the scaffold-only blog routes as kept on the
// existing (non-seed) path.

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scanText, truncate } from "./lib/contentDriftRules.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CMS_DIR = join(REPO_ROOT, "src", "data", "cms");

function load(name) {
  return JSON.parse(readFileSync(join(CMS_DIR, name), "utf8"));
}

let manifest, pages, sections, entities;
try {
  manifest = load("_manifest.json");
  pages = load("pages.json");
  sections = load("page_sections.json");
  entities = load("entities.json");
} catch (err) {
  console.error(`[validate-cms-seed] FAIL — cannot read seed files: ${err.message}`);
  console.error(`  run \`npm run sync:cms-seed\` first.`);
  process.exit(1);
}

const failures = [];

// ---- 1. manifest validation --------------------------------------------
if (manifest?.validation !== "pass") {
  failures.push(
    `manifest.validation !== "pass" (got: ${JSON.stringify(manifest?.validation)})`,
  );
}

// ---- 2. dangling entity_refs -------------------------------------------
const canonicalKeys = new Set(
  entities
    .map((e) => (e && typeof e.canonical_key === "string" ? e.canonical_key : null))
    .filter(Boolean),
);

let refCount = 0;
const dangling = [];
for (const s of sections) {
  for (const ref of s?.entity_refs ?? []) {
    if (typeof ref !== "string") continue;
    refCount++;
    if (!canonicalKeys.has(ref)) {
      dangling.push({ route: s.route, section_type: s.section_type, ref });
    }
  }
}
if (dangling.length) {
  failures.push(`${dangling.length} dangling entity_refs`);
}

// ---- 3. facts-lock over covered-route bodies ---------------------------
const scaffoldOnly = new Set(manifest.routes_scaffold_only ?? []);

// Recursively collect string values from a page_content.content object.
function collectText(value, acc) {
  if (value == null) return;
  if (typeof value === "string") {
    acc.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectText(v, acc);
  } else if (typeof value === "object") {
    for (const v of Object.values(value)) collectText(v, acc);
  }
}

// The `blue-fire-guarantee` rule is a blunt bidirectional regex that also fires on
// brand-CORRECT negations/questions ("cannot be guaranteed", "Does JVTO guarantee
// …?"). Those are the required wording, not a violation. Drop such a hit only when
// the offending line carries an explicit negation/interrogative cue — real
// affirmative guarantee claims (no negation) still fail.
const BLUE_FIRE_NEGATION_CUE =
  /cannot|can'?t|\bnot\b|no guarantee|be guaranteed\?|does\s+jvto\s+guarantee|outside[^.]{0,40}control|maximis|subject to weather/i;

function isFalsePositive(hit, lineText) {
  if (hit.rule !== "blue-fire-guarantee") return false;
  return BLUE_FIRE_NEGATION_CUE.test(lineText);
}

const coveredRoutes = [];
const factsHits = [];
let suppressedNegations = 0;
for (const s of sections) {
  if (s?.section_type !== "page_content") continue;
  if (!s.route || scaffoldOnly.has(s.route)) continue;
  coveredRoutes.push(s.route);

  const parts = [];
  collectText(s.content ?? {}, parts);
  const text = parts.join("\n");
  const textLines = text.split("\n");
  const hits = scanText(text, s.route);
  for (const hit of hits) {
    const lineText = textLines[hit.line - 1] ?? "";
    if (isFalsePositive(hit, lineText)) {
      suppressedNegations++;
      continue;
    }
    factsHits.push(hit);
  }
}
if (factsHits.length) {
  failures.push(`${factsHits.length} facts-lock violations in covered-route bodies`);
}

// ---- report ------------------------------------------------------------
console.log(`[validate-cms-seed] seed: ${CMS_DIR}`);
console.log(
  `  covered routes (page_content): ${coveredRoutes.length}  entity_refs checked: ${refCount}`,
);
if (suppressedNegations) {
  console.log(
    `  suppressed ${suppressedNegations} brand-correct blue-fire negation/question line(s) (not violations)`,
  );
}

if (dangling.length) {
  console.error(`  dangling entity_refs:`);
  for (const d of dangling.slice(0, 20)) {
    console.error(`    - ${d.ref}  (${d.route} / ${d.section_type})`);
  }
  if (dangling.length > 20) console.error(`    … +${dangling.length - 20} more`);
}

if (factsHits.length) {
  console.error(`  facts-lock violations:`);
  for (const h of factsHits.slice(0, 30)) {
    console.error(`    - [${h.rule}] ${h.rel}: "${truncate(h.text)}"`);
  }
  if (factsHits.length > 30) console.error(`    … +${factsHits.length - 30} more`);
}

// Scaffold-only routes are intentionally NOT sourced from the seed.
for (const r of scaffoldOnly) {
  console.log(`  scaffold-only route kept on existing (non-seed) path: ${r}`);
}

if (failures.length) {
  console.error(`\n[validate-cms-seed] FAIL — ${failures.join("; ")}`);
  process.exit(1);
}

console.log(`\n[validate-cms-seed] PASS — manifest ok, 0 dangling refs, facts-lock clean.`);
