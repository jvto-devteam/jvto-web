#!/usr/bin/env node
// scripts/validate-health-cert-qr-snapshots.mjs
//
// TARGETED, BLOCKING health-screening-QR gate for the DB-derived snapshots.
//
// Why this exists: the main canonical-facts gate (scripts/validate-content-drift.mjs)
// deliberately EXCLUDES src/lib/publicContent/generated/ — those files are machine
// snapshots regenerated from the DB by scripts/export-*.mjs, so hand-editing them is
// "not the fix" for the general denylist. That exclusion is correct in general, but it
// leaves ONE hole that matters for the owner's 2026-08-06 QR-retirement decision: a
// served snapshot such as faqSnapshots.json (rendered on /travel-guide/faq via
// faqSnapshot.ts, incl. its FAQPage JSON-LD) could carry a health-certificate QR claim,
// and a future DB export would silently reintroduce it WITHOUT CI catching it.
//
// This gate closes exactly that hole — and ONLY that hole:
//   * it scans the generated/ snapshots with the SINGLE shared `health-cert-qr` rule,
//     imported from scripts/lib/contentDriftRules.mjs (NO parallel regex);
//   * it does NOT remove or weaken the broad generated/ exclusion in the drift gate —
//     every other rule still ignores these machine snapshots.
//
// A hit here means the DB row is QR-bearing: fix the DB row + re-export (or, as a
// stopgap, correct the served snapshot), never leave the claim rendering.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanText, RULES } from "./lib/contentDriftRules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GEN_DIR = path.join(ROOT, "src", "lib", "publicContent", "generated");
const RULE = "health-cert-qr";

if (!RULES.some((r) => r.name === RULE)) {
  console.error(
    `[health-qr-snapshots] FATAL: rule '${RULE}' not found in scripts/lib/contentDriftRules.mjs — ` +
      `this gate must reuse the shared rule, not a parallel regex.`,
  );
  process.exit(2);
}

// Reuse the shared per-line scanner, then keep ONLY health-cert-qr hits.
function healthQrHits(content, rel) {
  return scanText(content, rel).filter((h) => h.rule === RULE);
}

// --- Self-test (blocking): the gate MUST catch a health-cert QR claim and MUST NOT
// flag QRIS payment, WhatsApp QR-login, or the AHU/SABH registry `/qrcode/` URL.
// Fixtures are single-line (the rule's [^.\n] proximity stops at sentence boundaries). ---
const SELFTEST = [
  { text: "The surat sehat carries a QR code checked at the crater gate", hit: true },
  { text: "Ijen health certificate verified by scanning its QR at entry", hit: true },
  { text: "A digital system with QR verification for the health screening", hit: true },
  { text: "Scan the QR code to pay with QRIS", hit: false },
  { text: "Log in by scanning the WhatsApp QR code", hit: false },
  { text: "See https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=abc for the Ijen HPWKI registration", hit: false },
];

let selftestFail = 0;
for (const c of SELFTEST) {
  const got = healthQrHits(c.text, "selftest").length > 0;
  const ok = got === c.hit;
  if (!ok) selftestFail++;
  console.log(`  ${ok ? "ok  " : "FAIL"} hit=${got} want=${c.hit}  ${c.text}`);
}
if (selftestFail) {
  console.error(`[health-qr-snapshots] SELF-TEST FAILED (${selftestFail}/${SELFTEST.length}).`);
  process.exit(2);
}
console.log(`[health-qr-snapshots] self-test PASS (${SELFTEST.length} cases)`);

// --- Scan the generated snapshots ---
const files = readdirSync(GEN_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();
const hits = [];
for (const f of files) {
  const rel = path.posix.join("src/lib/publicContent/generated", f);
  const content = readFileSync(path.join(GEN_DIR, f), "utf8");
  hits.push(...healthQrHits(content, rel));
}

if (hits.length) {
  for (const h of hits) console.error(`✗ ${h.rel}:${h.line} — ${h.rule} — ${h.text}`);
  console.error(
    `\n[health-qr-snapshots] FAIL — ${hits.length} health-certificate QR claim(s) in served DB snapshot(s). ` +
      `These files are regenerated from the DB by scripts/export-*.mjs, so the real fix is to UPDATE the ` +
      `source DB row QR-free and re-export (correcting only the JSON is a stopgap). See docs/CANONICAL_FACTS.md ` +
      `(Ijen health screening: BSrE-signed, no QR).`,
  );
  process.exit(1);
}
console.log(
  `[health-qr-snapshots] PASS — scanned ${files.length} generated snapshot(s), no health-certificate QR claim.`,
);
