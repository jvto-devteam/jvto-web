#!/usr/bin/env node
// Sync Policy Bundle v1 output from llm-wiki -> src/data/policy-bundle/.
// Pure ESM, no external deps. Idempotent. Manifest-gated.
//
// Usage:
//   npm run sync:policy-bundle
//
// Source resolution:
//   - If process.env.LLM_WIKI_ROOT is set, resolve from `${LLM_WIKI_ROOT}/output/website/policy-bundle`.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/llm-wiki/output/website/policy-bundle`.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/llm-wiki";

const REQUIRED_SCHEMA = "policy-bundle/v1.0";
const REQUIRED_CONSUMERS = ["checkout", "invoice", "whatsapp"];
const FILES = [
  "_manifest.json",
  "policy-bundle.json",
  "consumer-bundles.json",
  "deprecated-wording-report.json",
  "gap-report.json",
];

const wikiRoot = process.env.LLM_WIKI_ROOT || DEFAULT_SRC;
const SRC_DIR = join(wikiRoot, "output", "website", "policy-bundle");
const DEST_DIR = join(REPO_ROOT, "src", "data", "policy-bundle");

function die(message) {
  console.error(`[sync-policy-bundle] ERROR: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    die(`${path} parse failed: ${err.message}`);
  }
}

if (!existsSync(SRC_DIR)) {
  die(
    `source dir not found: ${SRC_DIR}\n` +
      `set LLM_WIKI_ROOT env to override (current: ${wikiRoot})`,
  );
}

for (const rel of FILES) {
  const src = join(SRC_DIR, rel);
  if (!existsSync(src)) {
    die(`expected file missing in source: ${rel}`);
  }
}

const manifest = readJson(join(SRC_DIR, "_manifest.json"));
if (manifest?.schema_version !== REQUIRED_SCHEMA) {
  die(
    `schema_version mismatch: expected ${REQUIRED_SCHEMA}, ` +
      `got ${JSON.stringify(manifest?.schema_version)}`,
  );
}

if (manifest?.clean !== true) {
  die(
    `manifest not clean (clean=${JSON.stringify(manifest?.clean)}).\n` +
      `re-run llm-wiki policy compiler and resolve findings before sync.`,
  );
}

const consumerBundles = readJson(join(SRC_DIR, "consumer-bundles.json"));
const missingConsumers = REQUIRED_CONSUMERS.filter(
  (consumer) => !consumerBundles?.[consumer],
);
if (missingConsumers.length > 0) {
  die(`consumer-bundles.json missing: ${missingConsumers.join(", ")}`);
}

const deprecatedReport = readJson(
  join(SRC_DIR, "deprecated-wording-report.json"),
);
if (deprecatedReport?.summary?.total_findings !== 0) {
  die(
    `deprecated-wording-report has findings ` +
      `(total_findings=${JSON.stringify(
        deprecatedReport?.summary?.total_findings,
      )})`,
  );
}

const gapReport = readJson(join(SRC_DIR, "gap-report.json"));
if (gapReport?.summary?.errors !== 0) {
  die(
    `gap-report has errors ` +
      `(errors=${JSON.stringify(gapReport?.summary?.errors)})`,
  );
}

for (const rel of FILES) {
  const src = join(SRC_DIR, rel);
  const dest = join(DEST_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  const contents = readFileSync(src, "utf8").replace(/\r\n/g, "\n");
  writeFileSync(dest, contents, "utf8");
}

console.log(
  `[sync-policy-bundle] copied ${FILES.length} files\n` +
    `  from: ${SRC_DIR}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  schema_version: ${manifest.schema_version}\n` +
    `  generated_at: ${manifest.generated_at}`,
);
