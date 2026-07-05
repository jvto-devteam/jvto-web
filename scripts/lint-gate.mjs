// scripts/lint-gate.mjs
// Blocking lint gate with a documented baseline — same governance pattern as
// the tsc baseline (3 dead-import + 42 checkout/booking errors, known, must
// not grow). Pre-existing findings don't block merges; NEW errors do.
//
// Baseline captured 2026-07-05, first clean eslint run after the flat-config
// crash fix (native eslint-config-next flat exports, FlatCompat removed):
//   141 errors / 173 warnings, all pre-existing.
// Rules:
//   - The error count must never EXCEED the baseline (gate fails).
//   - Warnings are reported but not gated.
//   - When you fix old errors, ratchet ERROR_BASELINE down so they can't
//     come back. Never ratchet up.
import { spawnSync } from "node:child_process";

const ERROR_BASELINE = 141;

const res = spawnSync("npx", ["--no-install", "eslint", ".", "--format", "json"], {
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

const errors = results.reduce((s, f) => s + f.errorCount, 0);
const warnings = results.reduce((s, f) => s + f.warningCount, 0);
console.log(`[lint-gate] ${errors} errors / ${warnings} warnings (error baseline: ${ERROR_BASELINE})`);

if (errors > ERROR_BASELINE) {
  for (const f of results.filter((r) => r.errorCount > 0)) {
    console.error(`  ${f.filePath}: ${f.errorCount} error(s)`);
  }
  console.error(`[lint-gate] FAIL — ${errors - ERROR_BASELINE} new lint error(s) beyond baseline. Fix them (or fix old ones elsewhere is NOT enough — new errors are regressions).`);
  process.exit(1);
}
if (errors < ERROR_BASELINE) {
  console.log(`[lint-gate] NOTE: error count is below baseline — ratchet ERROR_BASELINE down to ${errors} in scripts/lint-gate.mjs so the fixed errors cannot return.`);
}
console.log("[lint-gate] PASS");
