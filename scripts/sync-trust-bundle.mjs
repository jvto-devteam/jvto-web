#!/usr/bin/env node
// Sync Trust Bundle v1 output from llm-wiki → src/data/trust-bundle/.
// Pure ESM, no external deps. Idempotent. Manifest-gated.
//
// Usage:
//   npm run sync:trust
//
// Source resolution:
//   - If process.env.LLM_WIKI_PATH is set, resolve from `${LLM_WIKI_PATH}/output/website/trust-bundle`.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/llm-wiki/output/website/trust-bundle`.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/llm-wiki";

const wikiRoot = process.env.LLM_WIKI_PATH || DEFAULT_SRC;
const SRC_DIR = join(wikiRoot, "output", "website", "trust-bundle");
const DEST_DIR = join(REPO_ROOT, "src", "data", "trust-bundle");

// Allowlist — explicit set of files we expect. Surfaces unexpected additions.
const FILES = [
  "_manifest.json",
  "claims.json",
  "faq.json",
  "aeo-snippets.json",
  "schema/organization.json",
  "schema/faq-page.json",
  "schema/tourist-trip.json",
];

function die(message) {
  console.error(`[sync-trust] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(SRC_DIR)) {
  die(
    `source dir not found: ${SRC_DIR}\n` +
      `set LLM_WIKI_PATH env to override (current: ${wikiRoot})`,
  );
}

const manifestPath = join(SRC_DIR, "_manifest.json");
if (!existsSync(manifestPath)) {
  die(`_manifest.json missing at ${manifestPath}`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (err) {
  die(`_manifest.json parse failed: ${err.message}`);
}

const validation = manifest?.validation ?? {};
const expectedGates = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8"];
const failed = expectedGates.filter((g) => validation[g] !== "pass");
if (failed.length > 0) {
  die(
    `manifest validation not all pass — failing gates: ${failed.join(", ")}.\n` +
      `re-run llm-wiki compiler and fix before sync.`,
  );
}

for (const rel of FILES) {
  const src = join(SRC_DIR, rel);
  if (!existsSync(src)) {
    die(`expected file missing in source: ${rel}`);
  }
  const dest = join(DEST_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

console.log(
  `[sync-trust] copied ${FILES.length} files\n` +
    `  from: ${SRC_DIR}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  compiled_at: ${manifest.compiled_at}  compiler_version: ${manifest.compiler_version}`,
);
