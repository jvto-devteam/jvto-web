#!/usr/bin/env node
// Session cadence counters (2026-09-08). One script, two counters, registered on
// two events. Replaces three prose rules in CLAUDE.md that depended on the model
// counting its own tool calls — which it demonstrably does not do reliably.
//
//   PostToolUse (all tools)      -> tools counter    -> nudge at x20 and x60
//   PreToolUse (WebFetch|WebSearch) -> external counter -> nudge at x30
//
// WHY ONE FILE AND NOT THREE: x20 and x60 are the same counter, and 60 is a
// multiple of 20, so at call 60 both conditions hold. Three scripts would mean
// three node processes racing on one state file every single tool call. The
// external counter is a different number but identical machinery, and the event
// name in the payload is enough to tell them apart.
//
// COST, measured rather than assumed — this fires on EVERY tool call, so the
// spawn overhead is the whole cost of the feature. The owner asked for the real
// number after installation; measure with 20 calls before and after, not by
// timing this file in isolation.
//
// STATE lives in the OS temp dir keyed by session id: counters must not bleed
// between sessions, and they must never land in the repo. Parallel tool calls
// can lose an increment to a read-modify-write race; that is accepted (owner,
// 2026-09-08) because a checkpoint reminder that fires at 61 instead of 60 is
// still a working checkpoint reminder, and a lock would tax every call.
//
// Exit codes: always 0. This hook advises; it never blocks and never fails a
// tool call. A crash here must not cost the session its work.

import { readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const TOOL_DRIFT_EVERY = 20;
const TOOL_COMPACT_EVERY = 60;
const EXTERNAL_EVERY = 30;

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
};

let payload;
try {
  payload = JSON.parse((await readStdin()) || "{}");
} catch {
  process.exit(0);
}

// Anything outside [A-Za-z0-9_-] is stripped: the session id becomes a filename,
// and an id carrying a path separator would otherwise write outside tmpdir.
const sessionId = String(payload.session_id ?? "unknown").replace(/[^A-Za-z0-9_-]/g, "");
const statePath = path.join(os.tmpdir(), `claude-cadence-${sessionId || "unknown"}.json`);

let state = { tools: 0, external: 0 };
try {
  const parsed = JSON.parse(readFileSync(statePath, "utf8"));
  // Defensive: a corrupt or hand-edited state file must reset, not throw, and
  // must not resurrect a negative or non-integer counter.
  state = {
    tools: Number.isInteger(parsed?.tools) && parsed.tools >= 0 ? parsed.tools : 0,
    external: Number.isInteger(parsed?.external) && parsed.external >= 0 ? parsed.external : 0,
  };
} catch {
  // First call of the session, or an unreadable file. Start from zero.
}

const isExternal = payload.hook_event_name === "PreToolUse";
if (isExternal) state.external += 1;
else state.tools += 1;

try {
  writeFileSync(statePath, JSON.stringify(state));
} catch {
  // A tmpdir we cannot write to costs the counters, not the session.
  process.exit(0);
}

const lines = [];

if (isExternal) {
  if (state.external > 0 && state.external % EXTERNAL_EVERY === 0) {
    lines.push(
      `external content check — ${state.external} external fetches this session. ` +
        `Heavy context plus external content: consider /compact before pulling in more.`,
    );
  }
} else if (state.tools > 0 && state.tools % TOOL_COMPACT_EVERY === 0) {
  // The 60 branch wins over the 20 branch: at call 60 both hold, and the compact
  // recommendation subsumes the drift check.
  lines.push(
    `checkpoint: ${state.tools} tool calls — pertimbangkan /compact. ` +
      `State three bullets of what is done before continuing.`,
  );
} else if (state.tools % TOOL_DRIFT_EVERY === 0) {
  lines.push(
    `drift check [${state.tools}]: bandingkan rencana vs eksekusi sejauh ini. ` +
      `If the current action does not serve the stated goal, stop and say so.`,
  );
}

if (lines.length > 0) console.log(`[cadence] ${lines.join(" ")}`);

process.exit(0);
