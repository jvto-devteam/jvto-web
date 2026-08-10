// scripts/lint-gate.mjs
// Blocking lint gate against a COMMITTED per-file/per-rule error baseline —
// same governance pattern as the tsc baseline (known legacy errors don't block
// merges; new ones do), but enforced per bucket so a change that fixes one
// legacy error while introducing a different new one still FAILS (an aggregate
// count would let that swap through).
//
// Baseline: scripts/lint-baseline.json — { "<repo-relative file> :: <ruleId>": count }.
// Captured 2026-07-05 on the first clean eslint run after the flat-config fix:
// 141 pre-existing errors (173 warnings reported, not gated).
//
// Rules:
//   - Any bucket exceeding its baseline count = FAIL (new error, even if other
//     legacy errors were fixed elsewhere).
//   - Renaming a file that carries legacy errors moves its bucket key and will
//     fail the gate: either fix those errors (preferred) or regenerate the
//     baseline so the rename is visible in the PR diff.
//   - Fixed legacy errors: regenerate with `node scripts/lint-gate.mjs --update`
//     so they can't come back. NEVER hand-edit lint-baseline.json, and never
//     regenerate to legitimize new errors — the baseline diff is reviewed.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_PATH = join(ROOT, "scripts", "lint-baseline.json");

const res = spawnSync("npx", ["--no-install", "eslint", ".", "--format", "json"], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  shell: process.platform === "win32",
});

let results;
try {
  results = JSON.parse(res.stdout);
} catch {
  console.error("[lint-gate] eslint produced no parseable JSON — that is a crash, not findings. Failing.");
  console.error(res.stderr || res.stdout || res.error);
  process.exit(1);
}

// Bucket errors by repo-relative path + ruleId (line numbers deliberately
// excluded — they shift on every edit and would false-positive constantly).
const current = {};
let errTotal = 0;
let warnTotal = 0;
for (const file of results) {
  warnTotal += file.warningCount;
  if (!file.errorCount) continue;
  const rel = relative(ROOT, file.filePath).replaceAll("\\", "/");
  for (const m of file.messages) {
    if (m.severity !== 2) continue;
    errTotal += 1;
    const key = `${rel} :: ${m.ruleId ?? "(parse-error)"}`;
    current[key] = (current[key] ?? 0) + 1;
  }
}

if (process.argv.includes("--update")) {
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(BASELINE_PATH, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`[lint-gate] baseline written: ${errTotal} errors across ${Object.keys(current).length} buckets → ${relative(ROOT, BASELINE_PATH)}`);
  process.exit(0);
}

let baseline;
try {
  baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
} catch {
  console.error(`[lint-gate] missing/unreadable ${relative(ROOT, BASELINE_PATH)} — run \`node scripts/lint-gate.mjs --update\` on a clean checkout and commit it.`);
  process.exit(1);
}

const baseTotal = Object.values(baseline).reduce((s, n) => s + n, 0);
console.log(`[lint-gate] ${errTotal} errors / ${warnTotal} warnings (baseline: ${baseTotal} errors in ${Object.keys(baseline).length} buckets)`);

const regressions = Object.entries(current)
  .filter(([key, count]) => count > (baseline[key] ?? 0))
  .map(([key, count]) => `  ${key} — ${count} error(s), baseline ${baseline[key] ?? 0}`);

if (regressions.length) {
  console.error(`[lint-gate] FAIL — new lint error(s) beyond baseline in ${regressions.length} bucket(s):`);
  for (const line of regressions) console.error(line);
  console.error("[lint-gate] Fix the new errors — fixing old ones elsewhere does not offset them.");
  process.exit(1);
}

if (errTotal < baseTotal) {
  console.log(`[lint-gate] NOTE: legacy errors were fixed (${baseTotal} → ${errTotal}) — run \`node scripts/lint-gate.mjs --update\` and commit the baseline so they cannot return.`);
}
console.log("[lint-gate] PASS");
