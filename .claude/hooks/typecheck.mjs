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
// Any other non-zero is treated as a hook malfunction, so failures to *run*
// tsc deliberately exit 0 with a note rather than masquerading as type errors.

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

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["--no-install", "tsc", "--noEmit"],
  { cwd: projectDir, encoding: "utf8", shell: process.platform === "win32" },
);

if (result.error) {
  console.log(`[typecheck hook] could not run tsc: ${result.error.message}`);
  process.exit(0);
}

if (result.status === 0) {
  console.log("[typecheck hook] tsc --noEmit: 0 errors");
  process.exit(0);
}

// tsc prints diagnostics on stdout. Send them back on stderr, which is the
// channel Claude Code reads on exit 2.
const diagnostics = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
const lines = diagnostics.split(/\r?\n/);
const shown = lines.slice(0, 40).join("\n");
const omitted = lines.length > 40 ? `\n… ${lines.length - 40} more line(s)` : "";

process.stderr.write(
  `tsc --noEmit failed after editing ${filePath || "a file"}:\n${shown}${omitted}\n\n` +
    "Fix these before continuing. Do not hide or suppress them.\n",
);
process.exit(2);
