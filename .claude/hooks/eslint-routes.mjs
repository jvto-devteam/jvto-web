#!/usr/bin/env node
// PostToolUse hook: run ESLint on writes under src/lib/routes/ and scripts/.
//
// Companion to typecheck.mjs, deliberately NOT merged into it: that hook is
// shipped and working, and a lint failure and a type failure deserve different
// verdicts. tsc blocks (exit 2) because a type error is always a defect. This
// one NEVER blocks.
//
// WHY IT NEVER BLOCKS — the load-bearing decision, confirmed by the owner
// 2026-09-08: `npm run lint` on this repo reports 254 problems (28 errors, 226
// warnings) and has since before T01. A hook that exits 2 on a non-clean lint
// would block essentially every edit in these two directories. So this hook
// reports the exit code into the transcript and always exits 0. If it is ever
// changed to block, the 254 baseline must be driven to zero in the same commit.
//
// It also exists because a clean lint on a new file means nothing until you know
// the file is being linted at all: src/lib/routes/ was a directory ESLint had
// never reported on until someone checked by hand. This makes that automatic.
//
// Exit codes are the contract with Claude Code:
//   0 -> nothing to say, or something to say that must not stop the session
//   2 -> blocking error (never used here, on purpose)

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

// Only these two trees. Widening this is a decision, not a tweak: linting every
// write in src/ turns a 2-4s cost into a tax on unrelated work.
const SCOPED_PREFIXES = ["src/lib/routes", "scripts"];

// Extensions ESLint is configured for here. A Markdown or JSON write in scripts/
// must not spawn a linter that has nothing to say about it.
const LINTABLE = [".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".cjs", ".jsx"];

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

const raw = await readStdin();

let payload;
try {
  payload = JSON.parse(raw || "{}");
} catch {
  // A malformed payload is a harness problem, not a lint finding.
  console.log("[eslint hook] could not parse hook payload; skipped");
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
const filePath = payload?.tool_input?.file_path ?? "";

if (!filePath) process.exit(0);
if (!LINTABLE.includes(path.extname(filePath).toLowerCase())) process.exit(0);

// An edit to a scratchpad or to a sibling repo must not lint this one.
// path.relative escaping upward means the file lives outside the project.
const relative = path.relative(projectDir, filePath).split(path.sep).join("/");
if (relative.startsWith("..") || path.isAbsolute(relative)) process.exit(0);
if (!SCOPED_PREFIXES.some((p) => relative === p || relative.startsWith(`${p}/`))) {
  process.exit(0);
}

// Run ESLint's own JS entry through process.execPath — never `npx`.
//
// Measured 2026-09-08 by smoke-testing this hook before registering it:
// spawnSync("npx.cmd", ...) fails with EINVAL on Windows, because current Node
// refuses to spawn a .cmd without a shell. The hook still exited 0 and said so,
// which is correct behaviour and is exactly how the defect was found — but the
// lint never ran. `shell: true` would fix it and reintroduce shell quoting on a
// path that already contains spaces ("JAVA VOLCANO"). typecheck.mjs:80-86
// already solved this by resolving the binary and running it with the current
// node; same approach here.
//
// No node_modules, no ESLint: exit quietly. A clean checkout must not be blocked
// by a hook, and npx would have tried to install something.
const eslintBin = path.join(projectDir, "node_modules", "eslint", "bin", "eslint.js");
if (!existsSync(eslintBin)) {
  process.exit(0);
}

const result = spawnSync(process.execPath, [eslintBin, "--", filePath], {
  cwd: projectDir,
  encoding: "utf8",
  // 32 MB. typecheck.mjs shipped with a 1 MB default and silently reported
  // clean against 15,000 real errors when the buffer overflowed — an over-run
  // buffer must never read as a pass.
  maxBuffer: 32 * 1024 * 1024,
  shell: false,
});

if (result.error) {
  console.log(`[eslint hook] could not run eslint: ${result.error.message}`);
  process.exit(0);
}

// A truncated stream means the report is incomplete; say so rather than letting
// a partial read look like a short, clean report.
if (result.stdout === undefined || result.stderr === undefined) {
  console.log("[eslint hook] eslint output was truncated; treat this run as unmeasured");
  process.exit(0);
}

const output = `${result.stdout}${result.stderr}`.trim();
const code = result.status;

// EXIT CODE ALONE IS NOT THE VERDICT. ESLint exits 0 on warnings and only 1 on
// errors, so "exit 0" here means "no errors", NOT "no findings". The first
// version of this hook printed "exit 0, clean" over a real no-unused-vars
// warning — caught 2026-09-08 by probing with a deliberately unused const before
// this was ever registered. Most of this repo's 254-problem baseline is
// warnings, so treating exit 0 as clean would have hidden nearly all of them.
// Output presence decides the wording; the exit code is reported beside it.
if (code === 0 && !output) {
  console.log(`[eslint hook] ${relative}: exit 0, no findings`);
} else if (code === 0) {
  console.log(`[eslint hook] ${relative}: exit 0 (no errors) but ESLint reported findings:`);
  console.log(output);
} else {
  // Never a blocking exit — see the header.
  console.log(`[eslint hook] ${relative}: exit ${code} — NOT blocking (lint baseline is 254 problems)`);
  if (output) console.log(output);
}

process.exit(0);
