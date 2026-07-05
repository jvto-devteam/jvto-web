#!/usr/bin/env node
// Sync itinerary intelligence artifacts from jvto-itinerary-core → src/data/itinerary-intelligence/.
// Pure ESM, no external deps. Idempotent. Manifest-gated. Pattern: sync-package-readiness.mjs.
//
// Usage:
//   npm run sync:itinerary
//
// Source resolution:
//   - If process.env.ITINERARY_CORE_PATH is set, use it as the producer repo root.
//   - Else fall back to default `E:/Users/JAVA VOLCANO/jvto-itinerary-core`.
//   Artifacts are read from `<root>/generated/itinerary-intelligence/` plus the
//   geo feed at `<root>/exports/page-payload/samples/geo-feed.sample.json`
//   (synced as `geo-feed.json`).
//
// Gate:
//   - manifest.json must parse and declare schema_version === 1
//   - every allowlisted file must exist and parse as JSON
//   - if `manifest-checksums.txt` is present next to the manifest, each allowlisted
//     file found in it must match its sha256 (missing entries are reported, not fatal;
//     an absent checksums file skips verification with a notice — "bila tersedia")

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DEFAULT_SRC = "E:/Users/JAVA VOLCANO/jvto-itinerary-core";

const coreRoot = process.env.ITINERARY_CORE_PATH || DEFAULT_SRC;
const INTEL_DIR = join(coreRoot, "generated", "itinerary-intelligence");
const GEO_FEED_SAMPLE = join(
  coreRoot,
  "exports",
  "page-payload",
  "samples",
  "geo-feed.sample.json",
);
const DEST_DIR = join(REPO_ROOT, "src", "data", "itinerary-intelligence");

// Allowlist — explicit copy map (source path → dest path relative to DEST_DIR).
// Surfaces unexpected additions; anything not listed here is never synced.
const FILES = [
  { src: join(INTEL_DIR, "manifest.json"), dest: "manifest.json" },
  { src: GEO_FEED_SAMPLE, dest: "geo-feed.json" },
  { src: join(INTEL_DIR, "07-operational-events.json"), dest: "07-operational-events.json" },
  {
    src: join(INTEL_DIR, "agent-contract", "destination-operational-overlays.json"),
    dest: "agent-contract/destination-operational-overlays.json",
  },
  {
    src: join(INTEL_DIR, "agent-contract", "standard-route-truth.json"),
    dest: "agent-contract/standard-route-truth.json",
  },
];

function die(message) {
  console.error(`[sync-itinerary] ERROR: ${message}`);
  process.exit(1);
}

if (!existsSync(INTEL_DIR)) {
  die(
    `source dir not found: ${INTEL_DIR}\n` +
      `set ITINERARY_CORE_PATH env to the jvto-itinerary-core repo root ` +
      `(current root: ${coreRoot})`,
  );
}

// ── gate 1: manifest schema_version ──────────────────────────────────────────

const manifestPath = join(INTEL_DIR, "manifest.json");
if (!existsSync(manifestPath)) {
  die(`manifest.json missing at ${manifestPath}`);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (err) {
  die(`manifest.json parse failed: ${err.message}`);
}

if (manifest?.schema_version !== 1) {
  die(
    `unexpected schema_version: ${JSON.stringify(manifest?.schema_version)} ` +
      `(expected 1). Producer contract changed — update consumer before syncing.`,
  );
}

// ── gate 2: sha256 verification via manifest-checksums.txt (when available) ──

const checksumsPath = join(INTEL_DIR, "manifest-checksums.txt");
if (existsSync(checksumsPath)) {
  // sha256sum-style lines: "<64-hex>  <path>". Paths may be repo-root-relative
  // (like manifest.outputs) — match allowlisted sources by path suffix.
  const byPath = new Map();
  for (const line of readFileSync(checksumsPath, "utf8").split("\n")) {
    const m = line.trim().match(/^([a-fA-F0-9]{64})\s+\*?(.+)$/);
    if (m) byPath.set(m[2].replace(/\\/g, "/"), m[1].toLowerCase());
  }
  let verified = 0;
  const unlisted = [];
  for (const { src } of FILES) {
    const normSrc = src.replace(/\\/g, "/");
    let expected = null;
    for (const [relPath, hash] of byPath) {
      if (normSrc.endsWith(`/${relPath}`) || normSrc === relPath) {
        expected = hash;
        break;
      }
    }
    if (!expected) {
      unlisted.push(normSrc);
      continue;
    }
    const actual = createHash("sha256").update(readFileSync(src)).digest("hex");
    if (actual !== expected) {
      die(
        `sha256 mismatch for ${src}\n` +
          `  expected: ${expected}\n  actual:   ${actual}\n` +
          `producer output is inconsistent with manifest-checksums.txt — refusing to sync.`,
      );
    }
    verified++;
  }
  console.log(
    `[sync-itinerary] checksums: ${verified}/${FILES.length} allowlisted files verified` +
      (unlisted.length ? ` (${unlisted.length} not listed in manifest-checksums.txt)` : ""),
  );
} else {
  console.log(
    "[sync-itinerary] manifest-checksums.txt not present — sha256 verification skipped",
  );
}

// ── gate 3: existence + JSON parse of every allowlisted file, then copy ───────

for (const { src, dest } of FILES) {
  if (!existsSync(src)) {
    die(`expected file missing in source: ${src}`);
  }
  try {
    JSON.parse(readFileSync(src, "utf8"));
  } catch (err) {
    die(`source file is not valid JSON: ${src} (${err.message})`);
  }
  const destPath = join(DEST_DIR, dest);
  mkdirSync(dirname(destPath), { recursive: true });
  copyFileSync(src, destPath);
}

console.log(
  `[sync-itinerary] copied ${FILES.length} files\n` +
    `  from: ${coreRoot}\n` +
    `  to:   ${DEST_DIR}\n` +
    `  schema_version: ${manifest.schema_version}  source_mode: ${manifest.source_mode}\n` +
    `  generated_at: ${manifest.generated_at}`,
);
