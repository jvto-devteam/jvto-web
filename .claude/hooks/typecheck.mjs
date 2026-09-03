#!/usr/bin/env node
// PostToolUse hook: run `tsc --noEmit` after Write/Edit so the type-check gate
// stops depending on anyone remembering to run it.
//
// Measured 2026-09-03 on this repo: a full run is ~4.4s. That is cheap enough to
// fire on every TypeScript edit, which is why this hook exists at all.
//
// Exit codes are the contract with Claude Code:
//   0 -> nothing to say
//   2 -> blocking error; whatever we write to stderr is fed back to Claude
// A failure to *run* tsc exits 2, not 0: a gate that did not run is not a gate
// that passed. The single exception is a project with no TypeScript installed,
// which is detected before spawning and skipped quietly — see `tscBin` below.
// (This paragraph said the opposite until 2026-09-03, when a 1 MB buffer
// overflow made the hook report clean against 15,000 real type errors.)

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

// Flip this to `false` to typecheck after EVERY Write/Edit regardless of file
// type. It is `true` because a full typecheck of a Markdown or YAML edit costs
// 4.4s and reports nothing about the file that changed.
const ONLY_TYPESCRIPT_FILES = true;

const TS_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];
// Files that are not TypeScript but change what TypeScript sees.
const TYPE_AFFECTING = ["tsconfig.json", "next-env.d.ts"];

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
  // A malformed payload is a harness problem, not a type error. Say so and let
  // the session continue rather than blocking on a parse failure.
  console.log("[typecheck hook] could not parse hook payload; skipped");
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
const filePath = payload?.tool_input?.file_path ?? "";

if (ONLY_TYPESCRIPT_FILES && filePath) {
  const base = path.basename(filePath);
  const isTs = TS_EXTENSIONS.includes(path.extname(filePath).toLowerCase());
  const affectsTypes = TYPE_AFFECTING.includes(base);
  if (!isTs && !affectsTypes) process.exit(0);
}

// An edit to a scratchpad or to another repo must not trigger a typecheck of
// this one. path.relative escaping upward means the file lives outside.
if (filePath) {
  const rel = path.relative(projectDir, path.resolve(filePath));
  if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);
}

if (!existsSync(path.join(projectDir, "tsconfig.json"))) process.exit(0);

// Run the project's OWN TypeScript, not whatever npx resolves. `npx --no-install
// tsc` reaches out to PATH and can find an unrelated program of the same name —
// on this machine a global `tsc` that prints a red "This is not the tsc command
// you are looking for" banner. A checkout without node_modules therefore had
// every Write/Edit blocked by that banner, presented as type errors, even for a
// file with nothing wrong with it. Measured 2026-09-03.
//
// This one existsSync is also the whole absence check. The previous version
// matched cmd.exe's English error text, which was wrong twice over: it broke on
// a non-English console, and it was tested against stdout as well as stderr — so
// a genuine type error whose message merely contained "command not found" was
// read as a missing toolchain and the hook exited 0, hiding it. Resolving the
// binary by path removes both failure modes rather than narrowing them.
const tscBin = path.join(projectDir, "node_modules", "typescript", "bin", "tsc");
if (!existsSync(tscBin)) {
  console.log("[typecheck hook] typescript not installed here; typecheck skipped");
  process.exit(0);
}

const result = spawnSync(process.execPath, [tscBin, "--noEmit"], {
  cwd: projectDir,
  encoding: "utf8",
  // The default is 1 MB, and this repo blew through it: 15,000 deliberate type
  // errors produced 1,578,894 bytes of tsc output, spawnSync failed with
  // ENOBUFS, and the hook exited 0 — reporting clean at the exact moment it had
  // the most to catch. Measured 2026-09-03.
  maxBuffer: 10 * 1024 * 1024,
});

const combined = `${result.stdout ?? ""}${result.stderr ?? ""}`;

// Absence was already handled above, so anything that stops tsc here is a broken
// gate, and a broken gate blocks. There is no quiet path left: the interpreter is
// process.execPath and the script is one we just proved exists.
if (result.error) {
  process.stderr.write(
    [
      `typecheck hook could not run tsc: ${result.error.message}`,
      "The type-check gate did not run. Treat this as a failure, not a pass.",
      "",
    ].join("\n"),
  );
  process.exit(2);
}

if (result.status === 0) {
  console.log("[typecheck hook] tsc --noEmit: 0 errors");
  process.exit(0);
}

// tsc prints diagnostics on stdout. Send them back on stderr, which is the
// channel Claude Code reads on exit 2.
const diagnostics = combined.trim();
const lines = diagnostics.split(/\r?\n/);
const shown = lines.slice(0, 40).join("\n");
const omitted = lines.length > 40 ? `\n… ${lines.length - 40} more line(s)` : "";

process.stderr.write(
  `tsc --noEmit failed after editing ${filePath || "a file"}:\n${shown}${omitted}\n\n` +
    "Fix these before continuing. Do not hide or suppress them.\n",
);
process.exit(2);
