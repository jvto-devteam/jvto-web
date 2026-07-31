#!/usr/bin/env node
// Sync OKF customer-sales-release output from knowledge-catalog-jvto-bootstrap →
// src/data/okf/. Pure ESM, no external deps. Idempotent. Manifest-gated.
//
// Usage:
//   npm run sync:okf
//
// Source resolution:
//   - If process.env.OKF_PATH is set, resolve from `${OKF_PATH}/okf/customer-sales-release/jvto`.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/knowledge-catalog-jvto-bootstrap`.
//
// Prior to this script, src/data/okf/*.json was a one-shot hand snapshot (commit
// 863db8c) with no manifest, no sync path, and no CI gate — it silently drifted
// from OKF (e.g. kept the pre-2026-07-06 conditional Ijen-screening wording OKF
// itself had already dropped). This script replaces that snapshot with a proper
// sync, mirroring scripts/sync-trust-bundle.mjs.

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/knowledge-catalog-jvto-bootstrap";

const okfRoot = process.env.OKF_PATH || DEFAULT_SRC;
const SRC_DIR = join(okfRoot, "okf", "customer-sales-release", "jvto");
const DEST_DIR = join(REPO_ROOT, "src", "data", "okf");

// Allowlist — the only 3 files jvto-web actually consumes today (agentGuides.ts +
// entityRegistry.ts read-only registrations). The release also ships
// package-variations.json, pricing tiers, etc. — not synced until a consumer exists.
const FILES = ["general-modules.json", "package-profiles.json", "policy-cards.json"];

// Per-file record-count field in release-manifest.json used to gate the sync.
const COUNT_SOURCE = {
  "general-modules.json": (m) => m?.module_layer?.["general-modules.json"],
  "package-profiles.json": (m) => m?.object_counts?.["package-profiles.json"],
  "policy-cards.json": (m) => m?.object_counts?.["policy-cards.json"],
};

function die(message) {
  console.error(`[sync-okf] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(SRC_DIR)) {
  die(
    `source dir not found: ${SRC_DIR}\n` +
      `set OKF_PATH env to override (current: ${okfRoot})`,
  );
}

const manifestPath = join(SRC_DIR, "release-manifest.json");
if (!existsSync(manifestPath)) {
  die(`release-manifest.json missing at ${manifestPath}`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (err) {
  die(`release-manifest.json parse failed: ${err.message}`);
}

if (manifest.schema_version !== "customer-sales-release-v1") {
  die(`unexpected schema_version: ${JSON.stringify(manifest.schema_version)}`);
}

// Policy content (Ijen-screening wording, cancellation terms) is the one capability
// this sync must never ship half-baked — gate on it explicitly, in addition to the
// per-file count check below.
if (manifest.capability_readiness?.policy !== "available") {
  die(
    `capability_readiness.policy is ${JSON.stringify(manifest.capability_readiness?.policy)}, ` +
      `not "available" — refusing to sync policy-derived content.`,
  );
}

for (const rel of FILES) {
  const src = join(SRC_DIR, rel);
  if (!existsSync(src)) {
    die(`expected file missing in source: ${rel}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(src, "utf8"));
  } catch (err) {
    die(`${rel} parse failed: ${err.message}`);
  }
  if (!Array.isArray(parsed)) {
    die(`${rel} expected a JSON array at top level, got ${typeof parsed}`);
  }

  const expectedCount = COUNT_SOURCE[rel](manifest);
  if (typeof expectedCount !== "number") {
    die(`release-manifest.json has no record count for ${rel}`);
  }
  if (parsed.length !== expectedCount) {
    die(
      `${rel} has ${parsed.length} records, manifest expects ${expectedCount} — ` +
        `re-run the OKF release build before syncing.`,
    );
  }

  const dest = join(DEST_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

// Provenance manifest — jvto-web-side record of what was synced from where.
// customer_traffic_ready is passed through verbatim (currently false in the
// source release) so consumers can see the flag rather than have it silently
// dropped by the sync.
const destManifest = {
  synced_from: "knowledge-catalog-jvto-bootstrap/okf/customer-sales-release/jvto",
  release_id: manifest.release_id,
  release_created_at: manifest.created_at,
  customer_traffic_ready: manifest.customer_traffic_ready,
  files: FILES,
};
writeFileSync(
  join(DEST_DIR, "_manifest.json"),
  JSON.stringify(destManifest, null, 2) + "\n",
);

console.log(
  `[sync-okf] copied ${FILES.length} files\n` +
    `  from: ${SRC_DIR}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  release_id: ${manifest.release_id}  customer_traffic_ready: ${manifest.customer_traffic_ready}`,
);
