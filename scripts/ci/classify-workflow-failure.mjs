#!/usr/bin/env node
/**
 * classify-workflow-failure.mjs — deterministic, log-only CI failure classifier.
 *
 * Given the logs of a FAILED GitHub Actions run (plus its run attempt and the
 * workflow name), classify the failure against scripts/ci/failure-signatures.json
 * and decide whether exactly ONE bounded automatic retry is allowed.
 *
 * Hard rules (enforced here and asserted by --selftest):
 *   - Classification comes ONLY from signatures present in the log. Never from
 *     run history, attempt count alone, elapsed time, or any narrative.
 *   - A real category requires a matched signature. No match => UNKNOWN.
 *   - UNKNOWN is never auto-retried.
 *   - retryAllowed is true ONLY when the matched category is transient AND its
 *     maxRetry >= 1 AND run_attempt === 1. (So a retry can never happen more than
 *     once: attempt 2 — the product of that one retry — is never retried again.)
 *   - The only transient category is SSH_TCP_TIMEOUT (maxRetry 1); it is evaluated
 *     LAST among real categories, so any non-transient signature pre-empts a retry.
 *
 * Usage:
 *   node scripts/ci/classify-workflow-failure.mjs --log failed.log --attempt 1 --workflow "Deploy to VPS" [--out classification.json]
 *   cat failed.log | node scripts/ci/classify-workflow-failure.mjs --attempt 2 --workflow "CI"
 *   node scripts/ci/classify-workflow-failure.mjs --selftest
 *
 * Output (stdout, and --out if given): a JSON object with
 *   { classification, matchedSignature, transient, maxRetry, runAttempt, workflow,
 *     retryAllowed, retryReason, evidence: string[], ownerAction }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIGNATURES_PATH = path.join(__dirname, "failure-signatures.json");
const FIXTURES_DIR = path.join(__dirname, "fixtures", "ci-recovery");

function loadSignatures(p = SIGNATURES_PATH) {
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!Array.isArray(raw.priority) || typeof raw.categories !== "object") {
    throw new Error(`Malformed signatures file: ${p}`);
  }
  return raw;
}

function parseArgs(argv) {
  const args = { attempt: undefined, workflow: "", log: undefined, out: undefined, selftest: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--selftest") args.selftest = true;
    else if (a === "--attempt") args.attempt = Number(argv[++i]);
    else if (a === "--workflow") args.workflow = argv[++i] ?? "";
    else if (a === "--log") args.log = argv[++i];
    else if (a === "--out") args.out = argv[++i];
  }
  return args;
}

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/** Strip a leading ISO timestamp (GitHub Actions log prefix) from one line. */
function stripTimestamp(line) {
  return line.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s?/, "").trimEnd();
}

/**
 * Deterministically classify a log. Evaluates categories in `priority` order and
 * returns the first whose matchers hit. `attempt` gates the retry decision only —
 * it never influences which category is chosen.
 */
export function classify(logText, { attempt, workflow = "", signatures } = {}) {
  const sig = signatures || loadSignatures();
  const hay = String(logText || "").toLowerCase();
  const runAttempt = Number.isFinite(attempt) ? Number(attempt) : NaN;

  let chosen = "UNKNOWN";
  let matchedSignature = null;

  for (const name of sig.priority) {
    const cat = sig.categories[name];
    if (!cat) continue;
    const matchers = Array.isArray(cat.matchers) ? cat.matchers : [];
    if (matchers.length === 0) continue; // UNKNOWN / no-matcher categories are fallback only
    const hit = matchers.find((m) => hay.includes(String(m).toLowerCase()));
    if (hit) {
      chosen = name;
      matchedSignature = hit;
      break;
    }
  }

  const cat = sig.categories[chosen] || { transient: false, maxRetry: 0, ownerAction: "" };
  const transient = cat.transient === true;
  const maxRetry = Number(cat.maxRetry) || 0;

  // The single source of the retry decision. Order of the checks is also the
  // human-readable reason we surface.
  let retryAllowed = false;
  let retryReason;
  if (chosen === "UNKNOWN" || matchedSignature === null) {
    retryReason = "no known signature matched — never auto-retried";
  } else if (!transient) {
    retryReason = `${chosen} is not transient — never auto-retried`;
  } else if (maxRetry < 1) {
    retryReason = `${chosen} has maxRetry ${maxRetry} — never auto-retried`;
  } else if (runAttempt !== 1) {
    retryReason = `run attempt is ${Number.isNaN(runAttempt) ? "unknown" : runAttempt} (only attempt 1 is retried, so a retry never happens more than once)`;
  } else {
    retryAllowed = true;
    retryReason = `${chosen} is transient and this is attempt 1 — one bounded re-run allowed`;
  }

  // Evidence: up to 8 real log lines that contain a matcher for the chosen
  // category, timestamp-stripped. Empty for UNKNOWN.
  const evidence = [];
  if (matchedSignature !== null) {
    const matchers = (cat.matchers || []).map((m) => String(m).toLowerCase());
    const lines = String(logText || "").split(/\r?\n/);
    for (const line of lines) {
      const low = line.toLowerCase();
      if (matchers.some((m) => low.includes(m))) {
        const clean = stripTimestamp(line);
        if (clean) evidence.push(clean);
        if (evidence.length >= 8) break;
      }
    }
  }

  return {
    classification: chosen,
    matchedSignature,
    transient,
    maxRetry,
    runAttempt: Number.isNaN(runAttempt) ? null : runAttempt,
    workflow,
    retryAllowed,
    retryReason,
    evidence,
    ownerAction: cat.ownerAction || "",
  };
}

// ── self-test ────────────────────────────────────────────────────────────────

const SELFTEST_CASES = [
  { fixture: "ssh-tcp-timeout.log", attempt: 1, expectClass: "SSH_TCP_TIMEOUT", expectRetry: true },
  { fixture: "ssh-tcp-timeout.log", attempt: 2, expectClass: "SSH_TCP_TIMEOUT", expectRetry: false },
  { fixture: "ssh-tcp-timeout.log", attempt: 3, expectClass: "SSH_TCP_TIMEOUT", expectRetry: false },
  { fixture: "ssh-auth.log", attempt: 1, expectClass: "SSH_AUTH", expectRetry: false },
  { fixture: "remote-build.log", attempt: 1, expectClass: "REMOTE_BUILD", expectRetry: false },
  { fixture: "deploy-proof.log", attempt: 1, expectClass: "DEPLOY_PROOF", expectRetry: false },
  { fixture: "database-infra.log", attempt: 1, expectClass: "DATABASE_INFRA", expectRetry: false },
  { fixture: "unknown.log", attempt: 1, expectClass: "UNKNOWN", expectRetry: false },
  // Codex P2 guard: a generic CI network timeout (no SSH/port-22 marker) must NOT
  // be SSH_TCP_TIMEOUT and must never trigger a retry, even on attempt 1.
  { fixture: "ci-generic-timeout.log", attempt: 1, expectClass: "UNKNOWN", expectRetry: false },
];

function selftest() {
  const sig = loadSignatures();
  const failures = [];

  // 1. Registry integrity — the retry bound cannot be widened without failing here.
  const cats = sig.categories;
  const transientNames = Object.keys(cats).filter((n) => cats[n].transient === true);
  if (transientNames.length !== 1 || transientNames[0] !== "SSH_TCP_TIMEOUT") {
    failures.push(`integrity: exactly one transient category (SSH_TCP_TIMEOUT) expected, got [${transientNames.join(", ")}]`);
  }
  for (const [name, c] of Object.entries(cats)) {
    const mr = Number(c.maxRetry) || 0;
    if (mr > 1) failures.push(`integrity: ${name} maxRetry ${mr} > 1 — a retry must never happen more than once`);
    if (c.transient !== true && mr !== 0) failures.push(`integrity: non-transient ${name} must have maxRetry 0, got ${mr}`);
    if (c.transient === true && mr !== 1) failures.push(`integrity: transient ${name} must have maxRetry 1, got ${mr}`);
  }
  if (sig.priority[sig.priority.length - 1] !== "UNKNOWN") {
    failures.push(`integrity: UNKNOWN must be evaluated last in priority`);
  }
  // The retry-granting category must be evaluated last among the REAL categories.
  const realPriority = sig.priority.filter((n) => n !== "UNKNOWN");
  if (realPriority[realPriority.length - 1] !== "SSH_TCP_TIMEOUT") {
    failures.push(`integrity: SSH_TCP_TIMEOUT (the only retry-granting category) must be last among real categories so any non-transient signature pre-empts a retry`);
  }
  for (const name of sig.priority) {
    if (!cats[name]) failures.push(`integrity: priority lists ${name} but it has no category definition`);
  }

  // 2. Fixture classification — changing/removing a signature so a fixture no
  //    longer classifies as expected fails the gate.
  for (const tc of SELFTEST_CASES) {
    const p = path.join(FIXTURES_DIR, tc.fixture);
    let logText;
    try {
      logText = fs.readFileSync(p, "utf8");
    } catch {
      failures.push(`fixture missing: ${tc.fixture}`);
      continue;
    }
    const r = classify(logText, { attempt: tc.attempt, workflow: "selftest", signatures: sig });
    if (r.classification !== tc.expectClass) {
      failures.push(`${tc.fixture} @attempt ${tc.attempt}: classification ${r.classification} != expected ${tc.expectClass}`);
    }
    if (r.retryAllowed !== tc.expectRetry) {
      failures.push(`${tc.fixture} @attempt ${tc.attempt}: retryAllowed ${r.retryAllowed} != expected ${tc.expectRetry} (${r.retryReason})`);
    }
    if (tc.expectClass !== "UNKNOWN" && (!r.evidence || r.evidence.length === 0)) {
      failures.push(`${tc.fixture}: expected non-empty evidence for a matched signature`);
    }
  }

  // 3. "Retry never more than once" — across attempts 1..6 of the transient
  //    fixture, exactly ONE attempt (attempt 1) may be retried.
  const ssh = fs.readFileSync(path.join(FIXTURES_DIR, "ssh-tcp-timeout.log"), "utf8");
  const retryable = [1, 2, 3, 4, 5, 6].filter((a) => classify(ssh, { attempt: a, signatures: sig }).retryAllowed);
  if (retryable.length !== 1 || retryable[0] !== 1) {
    failures.push(`retry-bound: SSH timeout retryable on attempts [${retryable.join(", ")}], expected exactly [1]`);
  }

  // 4. UNKNOWN never retries, even if someone passes attempt 1.
  const unknownR = classify("some totally unrecognized explosion\nwith no known marker", { attempt: 1, signatures: sig });
  if (unknownR.classification !== "UNKNOWN" || unknownR.retryAllowed !== false) {
    failures.push(`unknown-guard: unrecognized log must be UNKNOWN + no retry, got ${unknownR.classification}/${unknownR.retryAllowed}`);
  }

  if (failures.length) {
    console.error(`[classify-workflow-failure] SELF-TEST FAIL — ${failures.length} problem(s):`);
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exit(1);
  }
  console.log(`[classify-workflow-failure] SELF-TEST PASS — ${SELFTEST_CASES.length} cases + registry integrity + retry-bound + unknown-guard.`);
}

// ── main ─────────────────────────────────────────────────────────────────────

function isMain() {
  return path.resolve(process.argv[1] || "") === path.resolve(fileURLToPath(import.meta.url));
}

if (isMain()) {
  const args = parseArgs(process.argv.slice(2));
  if (args.selftest) {
    selftest();
  } else {
    const logText = args.log ? fs.readFileSync(args.log, "utf8") : readStdin();
    const result = classify(logText, { attempt: args.attempt, workflow: args.workflow });
    const json = JSON.stringify(result, null, 2);
    if (args.out) fs.writeFileSync(args.out, json + "\n");
    console.log(json);
  }
}
