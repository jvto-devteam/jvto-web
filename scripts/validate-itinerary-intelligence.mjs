#!/usr/bin/env node
// Validate synced itinerary intelligence artifacts (src/data/itinerary-intelligence/).
// Report-only: no writes, no DB. Pure ESM, zero dependencies.
//
// Chained FIRST inside `npm run validate` — the order matters: CI invokes
// `npm run validate schema` / `npm run validate routes`, and npm appends the
// trailing arg to the END of the script string, so validate.mjs must stay last
// for its subcommand to keep working. This script ignores extra argv.
//
// Skip mode: when src/data/itinerary-intelligence/ does not exist (first sync
// has not run yet — see scripts/sync-itinerary-intelligence.mjs), this script
// WARNS and exits 0 so the chained `validate` gate stays green on main.
//
// Checks (full mode):
//   I-01  All allowlisted artifacts exist and parse as JSON
//   I-02  manifest.json schema_version === 1
//   I-03  geo-feed.json has a non-empty destinations[] with numeric lat/lng
//   I-04  Geo bounds (East Java + Bali corridor): lat in [-12, -6], lng in [110, 116]
//         for every destination and every route node
//   I-05  07-operational-events.json is a non-empty array of {id} entries
//   I-06  agent-contract/destination-operational-overlays.json is a non-empty
//         array of {destination} entries
//   I-07  agent-contract/standard-route-truth.json has a non-empty packages[]
//
// Exit codes: 0 = pass (or skip-warning), 1 = any ERROR finding.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DATA_DIR = join(REPO_ROOT, "src", "data", "itinerary-intelligence");

const LAT_MIN = -12;
const LAT_MAX = -6;
const LNG_MIN = 110;
const LNG_MAX = 116;

const ARTIFACTS = [
  "manifest.json",
  "geo-feed.json",
  "07-operational-events.json",
  "agent-contract/destination-operational-overlays.json",
  "agent-contract/standard-route-truth.json",
];

// ── skip-warning mode: data dir absent = not yet synced, not a failure ────────

if (!existsSync(DATA_DIR)) {
  console.warn(
    `[validate-itinerary] WARN: ${DATA_DIR} not present — itinerary intelligence ` +
      `has not been synced yet. Skipping validation (run "npm run sync:itinerary" ` +
      `with ITINERARY_CORE_PATH set, or wait for the sync-itinerary-core workflow).`,
  );
  process.exit(0);
}

// ── findings collector ────────────────────────────────────────────────────────

const errors = [];
const infos = [];

function fail(id, message) {
  errors.push(`  ✗ ERROR [${id}] ${message}`);
}

function pass(id, message) {
  infos.push(`  ✓ INFO  [${id}] ${message}`);
}

function inBounds(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= LAT_MIN &&
    lat <= LAT_MAX &&
    lng >= LNG_MIN &&
    lng <= LNG_MAX
  );
}

// ── I-01: existence + parse ───────────────────────────────────────────────────

const loaded = {};
for (const rel of ARTIFACTS) {
  const p = join(DATA_DIR, rel);
  if (!existsSync(p)) {
    fail("I-01", `missing artifact: ${rel}`);
    continue;
  }
  try {
    loaded[rel] = JSON.parse(readFileSync(p, "utf8"));
  } catch (err) {
    fail("I-01", `artifact is not valid JSON: ${rel} (${err.message})`);
  }
}
if (Object.keys(loaded).length === ARTIFACTS.length) {
  pass("I-01", `all ${ARTIFACTS.length} artifacts present and parse as JSON`);
}

// ── I-02: manifest schema_version ─────────────────────────────────────────────

const manifest = loaded["manifest.json"];
if (manifest) {
  if (manifest.schema_version !== 1) {
    fail("I-02", `manifest schema_version=${JSON.stringify(manifest.schema_version)} (expected 1)`);
  } else {
    pass("I-02", "manifest schema_version=1");
  }
}

// ── I-03 + I-04: geo-feed structure + bounds ──────────────────────────────────

const geoFeed = loaded["geo-feed.json"];
if (geoFeed) {
  const dests = geoFeed.destinations;
  if (!Array.isArray(dests) || dests.length === 0) {
    fail("I-03", "geo-feed destinations[] missing or empty");
  } else {
    const malformed = dests.filter(
      (d) => !d?.id || typeof d.lat !== "number" || typeof d.lng !== "number",
    );
    if (malformed.length > 0) {
      fail(
        "I-03",
        `geo-feed destinations with missing id or non-numeric lat/lng: ` +
          malformed.map((d) => JSON.stringify(d?.id ?? "?")).join(", "),
      );
    } else {
      pass("I-03", `geo-feed has ${dests.length} destinations with numeric coordinates`);
    }

    const outOfBounds = [];
    for (const d of dests) {
      if (!inBounds(d.lat, d.lng)) {
        outOfBounds.push(`destination ${d.id}: (${d.lat}, ${d.lng})`);
      }
    }
    const routes = Array.isArray(geoFeed.routes) ? geoFeed.routes : [];
    for (const r of routes) {
      for (const n of Array.isArray(r?.nodes) ? r.nodes : []) {
        if (!inBounds(n?.lat, n?.lng)) {
          outOfBounds.push(`route ${r.package_id} node ${n?.name}: (${n?.lat}, ${n?.lng})`);
        }
      }
    }
    if (outOfBounds.length > 0) {
      fail(
        "I-04",
        `coordinates outside lat [${LAT_MIN}, ${LAT_MAX}] / lng [${LNG_MIN}, ${LNG_MAX}]:\n` +
          outOfBounds.map((s) => `           ${s}`).join("\n"),
      );
    } else {
      const nodeCount = routes.reduce((acc, r) => acc + (r?.nodes?.length ?? 0), 0);
      pass(
        "I-04",
        `${dests.length} destinations + ${nodeCount} route nodes (${routes.length} routes) within geo bounds`,
      );
    }
  }
}

// ── I-05: operational events ──────────────────────────────────────────────────

const events = loaded["07-operational-events.json"];
if (events) {
  if (!Array.isArray(events) || events.length === 0) {
    fail("I-05", "07-operational-events.json is not a non-empty array");
  } else if (events.some((e) => !e?.id)) {
    fail("I-05", "07-operational-events.json has entries without id");
  } else {
    pass("I-05", `${events.length} operational events, all with id`);
  }
}

// ── I-06: destination operational overlays ────────────────────────────────────

const overlays = loaded["agent-contract/destination-operational-overlays.json"];
if (overlays) {
  if (!Array.isArray(overlays) || overlays.length === 0) {
    fail("I-06", "destination-operational-overlays.json is not a non-empty array");
  } else if (overlays.some((o) => !o?.destination)) {
    fail("I-06", "destination-operational-overlays.json has entries without destination");
  } else {
    pass("I-06", `${overlays.length} destination overlays, all with destination key`);
  }
}

// ── I-07: standard route truth ────────────────────────────────────────────────

const routeTruth = loaded["agent-contract/standard-route-truth.json"];
if (routeTruth) {
  if (!Array.isArray(routeTruth.packages) || routeTruth.packages.length === 0) {
    fail("I-07", "standard-route-truth.json packages[] missing or empty");
  } else {
    pass("I-07", `standard-route-truth has ${routeTruth.packages.length} packages`);
  }
}

// ── report ────────────────────────────────────────────────────────────────────

console.log("\n[validate-itinerary] ────────────────────────────────────────");
console.log(`  Artifact dir : ${DATA_DIR}`);
if (manifest) {
  console.log(`  schema_version: ${manifest.schema_version}  source_mode: ${manifest.source_mode}`);
  console.log(`  generated_at : ${manifest.generated_at}`);
}
console.log("──────────────────────────────────────────────────────────────");
for (const line of infos) console.log(line);
for (const line of errors) console.log(line);
console.log("──────────────────────────────────────────────────────────────");
console.log(`  Summary: ${errors.length} error(s)  ${infos.length} pass(es)`);

if (errors.length > 0) {
  console.log("\n[validate-itinerary] FAILED — resolve errors above (re-sync from producer if artifacts are corrupt).\n");
  process.exit(1);
} else {
  console.log("\n[validate-itinerary] PASS\n");
  process.exit(0);
}
