#!/usr/bin/env node
// Sync the jvto_cms bootstrap seed (plain JSON) → src/data/cms/.
// Pure ESM, no external deps. Idempotent. Manifest-gated.
//
// WARNING (PACKAGE 05c, 2026-08-04): routes migrated to the static-content
// SSOT (content/pages/** — policy, travel-guide Path A, why-jvto) were
// STRIPPED from src/data/cms/{pages,page_sections}.json. A verbatim re-run of
// this script against an old seed export would RESTORE those rows — CI
// (scripts/validate-static-route-ownership.mjs) fails any PR that re-adds a
// migrated route to the seed. If you must re-sync, re-strip migrated routes
// before committing.
//
// This is the editorial content-plane for the (website) render path: the
// remaining fully-rendered routes in the seed are the source of page copy /
// FAQ / SEO at BOTH build and runtime (see src/lib/cms/seedResolver.ts). It
// mirrors scripts/sync-trust-bundle.mjs in shape.
//
// Usage:
//   npm run sync:cms-seed
//
// Source resolution:
//   - `${CMS_SEED_PATH}/output/seed` when CMS_SEED_PATH is set.
//   - Else default `/workspace/jvto-unified-cms-bootstrap/output/seed`.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_ROOT = "/workspace/jvto-unified-cms-bootstrap";

const seedRoot = process.env.CMS_SEED_PATH || DEFAULT_ROOT;
const SRC_DIR = join(seedRoot, "output", "seed");
const DEST_DIR = join(REPO_ROOT, "src", "data", "cms");

// Allowlist — the editorial subset jvto-web consumes. (load.sql is intentionally
// NOT copied: it is the Postgres loader for the CMS DB, not a build-time asset.)
const FILES = [
  "_manifest.json",
  "pages.json",
  "page_sections.json",
  "entities.json",
  "redirects.json",
  "governance_facts.json",
];

function die(message) {
  console.error(`[sync-cms-seed] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(SRC_DIR)) {
  die(
    `source dir not found: ${SRC_DIR}\n` +
      `set CMS_SEED_PATH env to override (current: ${seedRoot})`,
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

// Gate: only sync a validated seed.
if (manifest?.validation !== "pass") {
  die(
    `manifest validation !== "pass" (got: ${JSON.stringify(
      manifest?.validation,
    )}).\n` + `re-run the jvto-unified-cms-bootstrap projector and fix before sync.`,
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

const counts = manifest.counts ?? {};
console.log(
  `[sync-cms-seed] copied ${FILES.length} files\n` +
    `  from: ${SRC_DIR}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  schema_version: ${manifest.schema_version}  generated_at: ${manifest.generated_at}\n` +
    `  pages: ${counts.pages}  sections: ${counts.sections}  entities: ${counts.entities}\n` +
    `  routes_fully_rendered: ${counts.routes_fully_rendered}  scaffold_only: ${JSON.stringify(
      manifest.routes_scaffold_only ?? [],
    )}`,
);
