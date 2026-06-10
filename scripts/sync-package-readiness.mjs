#!/usr/bin/env node
// Sync Package Readiness Bundle output from llm-wiki → src/data/package-readiness/.
// Pure ESM, no external deps. Idempotent. Manifest-gated.
//
// Usage:
//   npm run sync:packages
//
// Source resolution:
//   - If process.env.LLM_WIKI_PATH is set, resolve from `${LLM_WIKI_PATH}/output/products/package-readiness`.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/llm-wiki/output/products/package-readiness`.
//
// Gate: the package-readiness manifest has no F1–F8 validation block (unlike the
// trust bundle). It exposes its own clean signal instead, so we gate on:
//   - manifest.clean === true
//   - manifest.schema_version starts with "package-readiness/"
//   - manifest.canonical_package_count is a positive integer
// The package count is reported but NOT hardcoded — a legitimate new package
// should not break the sync.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/llm-wiki";

const wikiRoot = process.env.LLM_WIKI_PATH || DEFAULT_SRC;
const SRC_DIR = join(wikiRoot, "output", "products", "package-readiness");
const DEST_DIR = join(REPO_ROOT, "src", "data", "package-readiness");

// Allowlist — explicit set of files we expect. Surfaces unexpected additions.
// Package readiness artifacts are all flat (no schema/ subdir).
const FILES = [
  "_manifest.json",
  "package-registry.json",
  "package-pricing.json",
  "package-itineraries.json",
  "booking-compatibility.json",
  "gap-report.json",
];

function die(message) {
  console.error(`[sync-packages] ERROR: ${message}`);
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

if (manifest?.clean !== true) {
  die(
    `manifest not clean (clean=${JSON.stringify(manifest?.clean)}).\n` +
      `re-run llm-wiki package compiler and resolve findings before sync.`,
  );
}

const schemaVersion = manifest?.schema_version;
if (
  typeof schemaVersion !== "string" ||
  !schemaVersion.startsWith("package-readiness/")
) {
  die(
    `unexpected schema_version: ${JSON.stringify(schemaVersion)} ` +
      `(expected a "package-readiness/*" version).`,
  );
}

const packageCount = manifest?.canonical_package_count;
if (!Number.isInteger(packageCount) || packageCount <= 0) {
  die(
    `invalid canonical_package_count: ${JSON.stringify(packageCount)} ` +
      `(expected a positive integer).`,
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
  `[sync-packages] copied ${FILES.length} files\n` +
    `  from: ${SRC_DIR}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  schema_version: ${schemaVersion}  canonical_package_count: ${packageCount}\n` +
    `  generated_at: ${manifest.generated_at}`,
);
