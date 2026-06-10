#!/usr/bin/env node
// Validate Package Readiness artifacts against DB packages table.
// Report-only: no writes, no DB modifications.
//
// Two modes:
//   Online  — internal checks + DB reconciliation (needs DATABASE_URL + Prisma client)
//   Offline — internal checks only (pass --offline or when DB is unavailable)
//
// Internal checks (always):
//   C-01  Manifest clean flag and schema_version
//   C-02  Manifest canonical_package_count matches registry length
//   C-03  Cross-artifact slug set consistency (registry ↔ pricing ↔ itineraries ↔ booking)
//   C-04  No duplicate package_id within any artifact
//   C-05  All public_url values start with /tours/from-surabaya/ or /tours/from-bali/
//   C-06  All pricing entries have at least one pax_tier
//   C-07  All itinerary entries have at least one day
//   C-08  Booking compatibility paths non-empty
//
// DB checks (online only):
//   D-01  Active DB package count matches manifest canonical_package_count
//   D-02  Every registry entry has a matching DB slug (public_url without leading /)
//   D-03  Every active DB package has a corresponding registry entry (warn on extras)
//   D-04  DB name vs artifact title spot-check (warn on mismatch)
//
// Exit codes: 0 = pass (or offline+pass), 1 = any ERROR finding.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DATA_DIR = join(REPO_ROOT, "src", "data", "package-readiness");

const OFFLINE = process.argv.includes("--offline");

// ── helpers ──────────────────────────────────────────────────────────────────

function loadJson(filename) {
  const p = join(DATA_DIR, filename);
  if (!existsSync(p)) throw new Error(`missing artifact: ${filename}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

const SEVERITY = { ERROR: "ERROR", WARN: "WARN", INFO: "INFO" };
const findings = [];

function find(id, severity, message, detail = null) {
  findings.push({ id, severity, message, ...(detail ? { detail } : {}) });
}

function slugKey(entry) {
  return entry.public_url?.replace(/^\//, "") ?? entry.package_id;
}

// ── load artifacts ────────────────────────────────────────────────────────────

let manifest, registry, pricing, itineraries, booking;
try {
  manifest     = loadJson("_manifest.json");
  registry     = loadJson("package-registry.json");
  pricing      = loadJson("package-pricing.json");
  itineraries  = loadJson("package-itineraries.json");
  booking      = loadJson("booking-compatibility.json");
} catch (err) {
  console.error(`[validate-packages] FATAL: ${err.message}`);
  process.exit(1);
}

// ── C-01: manifest validity ───────────────────────────────────────────────────

if (manifest.clean !== true) {
  find("C-01a", SEVERITY.ERROR,
    `Manifest not clean (clean=${JSON.stringify(manifest.clean)})`);
} else {
  find("C-01a", SEVERITY.INFO, "Manifest clean=true");
}

const sv = manifest.schema_version;
if (typeof sv !== "string" || !sv.startsWith("package-readiness/")) {
  find("C-01b", SEVERITY.ERROR,
    `Unexpected schema_version: ${JSON.stringify(sv)}`);
} else {
  find("C-01b", SEVERITY.INFO, `schema_version: ${sv}`);
}

// ── C-02: count ───────────────────────────────────────────────────────────────

const manifestCount = manifest.canonical_package_count;
const registryCount = registry.length;
if (manifestCount !== registryCount) {
  find("C-02", SEVERITY.ERROR,
    `Count mismatch: manifest says ${manifestCount}, registry has ${registryCount}`);
} else {
  find("C-02", SEVERITY.INFO, `Package count: ${registryCount} (matches manifest)`);
}

// ── C-03: cross-artifact slug consistency ─────────────────────────────────────

const registryIds = new Set(registry.map(e => e.package_id));
const pricingIds  = new Set(pricing.map(e => e.package_id));
const itinIds     = new Set(itineraries.map(e => e.package_id));
const bookingIds  = new Set(booking.map(e => e.package_id));

function setDiff(a, b) {
  return [...a].filter(x => !b.has(x));
}

for (const [name, set] of [["pricing", pricingIds], ["itineraries", itinIds], ["booking", bookingIds]]) {
  const missing = setDiff(registryIds, set);
  const extra   = setDiff(set, registryIds);
  if (missing.length > 0) {
    find("C-03", SEVERITY.ERROR,
      `Registry IDs missing from ${name}: ${missing.join(", ")}`);
  }
  if (extra.length > 0) {
    find("C-03", SEVERITY.WARN,
      `Extra IDs in ${name} not in registry: ${extra.join(", ")}`);
  }
}

// Also verify the slug field is consistent for matching package_ids across artifacts.
// package_id and slug can legitimately differ (Bali: id="bali/foo", slug="foo"),
// but if the same package_id appears in two artifacts the slug must agree.
const registrySlugByPkgId = new Map(registry.map(e => [e.package_id, e.slug]));
for (const [name, arr] of [["pricing", pricing], ["itineraries", itineraries], ["booking", booking]]) {
  for (const entry of arr) {
    const expectedSlug = registrySlugByPkgId.get(entry.package_id);
    if (expectedSlug !== undefined && entry.slug !== expectedSlug) {
      find("C-03", SEVERITY.ERROR,
        `slug mismatch in ${name} for package_id "${entry.package_id}": ` +
        `registry="${expectedSlug}", ${name}="${entry.slug}"`);
    }
  }
}

if (findings.filter(f => f.id === "C-03").length === 0) {
  find("C-03", SEVERITY.INFO, "Cross-artifact package_id sets and slug fields consistent");
}

// ── C-04: duplicate package_id ────────────────────────────────────────────────

for (const [name, arr] of [
  ["registry", registry], ["pricing", pricing],
  ["itineraries", itineraries], ["booking", booking],
]) {
  const seen = new Set();
  const dupes = [];
  for (const e of arr) {
    if (seen.has(e.package_id)) dupes.push(e.package_id);
    seen.add(e.package_id);
  }
  if (dupes.length > 0) {
    find("C-04", SEVERITY.ERROR,
      `Duplicate package_id in ${name}: ${dupes.join(", ")}`);
  }
}
if (findings.filter(f => f.id === "C-04").length === 0) {
  find("C-04", SEVERITY.INFO, "No duplicate package_id in any artifact");
}

// ── C-05: public_url format ───────────────────────────────────────────────────

const validUrlPrefixes = ["/tours/from-surabaya/", "/tours/from-bali/"];
const badUrls = registry.filter(
  e => !validUrlPrefixes.some(p => e.public_url?.startsWith(p))
);
if (badUrls.length > 0) {
  find("C-05", SEVERITY.ERROR,
    `public_url format invalid for: ${badUrls.map(e => e.package_id).join(", ")}`);
} else {
  find("C-05", SEVERITY.INFO, "All public_url values have valid /tours/from-{origin}/ prefix");
}

// ── C-06: pricing pax_tiers non-empty ─────────────────────────────────────────

const emptyTiers = pricing.filter(e => !Array.isArray(e.pax_tiers) || e.pax_tiers.length === 0);
if (emptyTiers.length > 0) {
  find("C-06", SEVERITY.ERROR,
    `Empty pax_tiers for: ${emptyTiers.map(e => e.package_id).join(", ")}`);
} else {
  find("C-06", SEVERITY.INFO, `All ${pricing.length} pricing entries have pax_tiers`);
}

// ── C-07: itinerary days non-empty ────────────────────────────────────────────

const emptyDays = itineraries.filter(e => !Array.isArray(e.days) || e.days.length === 0);
if (emptyDays.length > 0) {
  find("C-07", SEVERITY.ERROR,
    `Empty days for: ${emptyDays.map(e => e.package_id).join(", ")}`);
} else {
  find("C-07", SEVERITY.INFO, `All ${itineraries.length} itinerary entries have days`);
}

// ── C-08: booking paths non-empty ────────────────────────────────────────────

const emptyPaths = booking.filter(
  e => !Array.isArray(e.booking_paths) || e.booking_paths.length === 0
);
if (emptyPaths.length > 0) {
  find("C-08", SEVERITY.ERROR,
    `Empty booking_paths for: ${emptyPaths.map(e => e.package_id).join(", ")}`);
} else {
  find("C-08", SEVERITY.INFO, `All ${booking.length} booking entries have booking_paths`);
}

// ── DB checks ─────────────────────────────────────────────────────────────────

let dbMode = "skipped";

if (!OFFLINE) {
  try {
    const { PrismaClient } = await import(
      "../src/generated/prisma/index.js"
    );
    const prisma = new PrismaClient();

    let dbPackages;
    try {
      dbPackages = await prisma.packages.findMany({
        where: { deleted_at: null },
        select: {
          id: true,
          slug: true,
          name: true,
          is_publish: true,
          durations: { select: { day: true, night: true } },
        },
      });
    } finally {
      await prisma.$disconnect();
    }

    dbMode = "online";

    // D-01: active DB count vs manifest count
    const activePublished = dbPackages.filter(p => p.is_publish === true);
    if (activePublished.length !== manifestCount) {
      find("D-01", SEVERITY.WARN,
        `DB active+published count (${activePublished.length}) ≠ manifest canonical_package_count (${manifestCount})`);
    } else {
      find("D-01", SEVERITY.INFO,
        `DB active+published count: ${activePublished.length} (matches manifest)`);
    }

    // Build lookup maps
    const dbBySlug = new Map(dbPackages.map(p => [p.slug, p]));
    const registryByDbSlug = new Map(
      registry.map(e => [e.public_url.replace(/^\//, ""), e])
    );

    // D-02: every registry entry has a matching DB slug
    for (const entry of registry) {
      const dbSlug = entry.public_url.replace(/^\//, "");
      if (!dbBySlug.has(dbSlug)) {
        find("D-02", SEVERITY.ERROR,
          `Registry entry not found in DB: ${entry.package_id}`,
          { expected_db_slug: dbSlug });
      }
    }
    const d02Errors = findings.filter(f => f.id === "D-02" && f.severity === SEVERITY.ERROR);
    if (d02Errors.length === 0) {
      find("D-02", SEVERITY.INFO,
        `All ${registry.length} registry entries have a matching DB slug`);
    }

    // D-03: every active+published DB package has a registry entry
    for (const pkg of activePublished) {
      if (!registryByDbSlug.has(pkg.slug)) {
        find("D-03", SEVERITY.WARN,
          `DB package not in registry: slug="${pkg.slug}" name="${pkg.name}"`,
          { hint: "Add to llm-wiki source and recompile, or soft-delete if retired" });
      }
    }
    const d03Warns = findings.filter(f => f.id === "D-03" && f.severity === SEVERITY.WARN);
    if (d03Warns.length === 0) {
      find("D-03", SEVERITY.INFO,
        "All active+published DB packages have registry entries");
    }

    // D-04: title spot-check (warn only)
    let titleMismatches = 0;
    for (const entry of registry) {
      const dbSlug = entry.public_url.replace(/^\//, "");
      const dbPkg = dbBySlug.get(dbSlug);
      if (dbPkg && dbPkg.name !== entry.title) {
        find("D-04", SEVERITY.WARN,
          `Title mismatch for ${entry.package_id}`,
          { db_name: dbPkg.name, artifact_title: entry.title });
        titleMismatches++;
      }
    }
    if (titleMismatches === 0) {
      find("D-04", SEVERITY.INFO, "All DB names match artifact titles");
    }

  } catch (err) {
    const isConnErr =
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("connect ETIMEDOUT") ||
      err.message?.includes("Cannot find module") ||
      err.message?.includes("could not locate the Query Engine") ||
      err.message?.includes("binaryTargets") ||
      err.code === "MODULE_NOT_FOUND";

    if (isConnErr) {
      dbMode = "offline-fallback";
      find("DB", SEVERITY.WARN,
        `DB unavailable — skipping D-01..D-04 (${err.message.split("\n")[0]})`);
    } else {
      find("DB", SEVERITY.ERROR, `DB check failed: ${err.message}`);
      dbMode = "error";
    }
  }
} else {
  find("DB", SEVERITY.INFO, "DB checks skipped (--offline)");
}

// ── report ────────────────────────────────────────────────────────────────────

const errors   = findings.filter(f => f.severity === SEVERITY.ERROR);
const warnings = findings.filter(f => f.severity === SEVERITY.WARN);
const infos    = findings.filter(f => f.severity === SEVERITY.INFO);

console.log("\n[validate-packages] ─────────────────────────────────────────");
console.log(`  Artifact dir : ${DATA_DIR}`);
console.log(`  DB mode      : ${dbMode}`);
console.log(`  Packages     : ${registryCount} (manifest says ${manifestCount})`);
console.log(`  schema_version: ${sv}`);
console.log(`  generated_at : ${manifest.generated_at}`);
console.log("──────────────────────────────────────────────────────────────");

for (const f of findings) {
  const prefix =
    f.severity === SEVERITY.ERROR ? "  ✗ ERROR" :
    f.severity === SEVERITY.WARN  ? "  ⚠ WARN " :
                                    "  ✓ INFO ";
  console.log(`${prefix} [${f.id}] ${f.message}`);
  if (f.detail) console.log(`         detail: ${JSON.stringify(f.detail)}`);
}

console.log("──────────────────────────────────────────────────────────────");
console.log(`  Summary: ${errors.length} error(s)  ${warnings.length} warning(s)  ${infos.length} pass(es)`);

if (errors.length > 0) {
  console.log("\n[validate-packages] FAILED — resolve errors above before runtime usage.\n");
  process.exit(1);
} else {
  const status = warnings.length > 0
    ? `PASS with ${warnings.length} warning(s)`
    : "PASS";
  console.log(`\n[validate-packages] ${status}\n`);
  process.exit(0);
}
