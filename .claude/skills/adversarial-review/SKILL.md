---
name: adversarial-review
description: Brief for the mandatory adversarial review gate — run before reporting large work complete (mass deletion, dependency change, merge to live/main). Tells a fresh-context Explore subagent how to ATTACK this session's evidence rather than repeat it. Invoke when finishing major work, not for routine checks.
---

# Adversarial review — the brief

The gate itself lives in `CLAUDE.md` (*Working posture*): before reporting large
work complete, run a read-only **`Explore`** subagent (RULE 4) whose brief tells
it to **attack this session's evidence**, not restate it. This file is what goes
in that brief.

Why a subagent and not another pass by the main session: the main session has
been living inside its own assumptions for hours and will re-derive the same
conclusions from the same starting point. Fresh context is the only thing that
reliably catches what is left.

## The brief must name what `tsc` and `build` cannot catch

A green typecheck and a green build prove the module graph resolves. They prove
nothing about:

- **dynamic `import()`** — resolved at runtime, invisible to the compiler
- **references through strings** — a route, a slug, a schema `@id`, a class name
  assembled at runtime; `grep` for the symbol, never for the bare word
- **non-JS consumers** — GitHub workflows, npm scripts, files under `public/`,
  anything shelling out to a path
- **CSS and asset chains** — a class that exists but whose stylesheet is never
  imported (this repo has shipped exactly that: `MATERIAL_SYMBOLS_ICON_BROKEN`)
- **credential and PII leakage** — new secrets, tokens, personal data in output,
  logs, or committed artifacts

## Tell it to falsify specific claims, not to "review the work"

An open-ended "review this" returns a summary. List the session's load-bearing
claims as numbered propositions and instruct the agent to try to break each one,
reporting per claim whether it survived. Include the measurements the session
took, so the agent re-derives them independently instead of trusting them.

State the binding constraints too (scope guardrails, decisions already locked,
`NEEDS_OWNER` items the owner has closed), or the report comes back full of
recommendations that are out of bounds.

## Filter the output

Report only findings with **production, security, or cost** impact. Style
preferences and hypothetical refactors dilute the signal and train the reader to
skim the next one.

## It is a gate, and it earns its keep

Treat a clean report as a result, not a formality — but expect findings. On T02
(2026-09-07) this gate found three real defects in code that had already passed
36 unit tests, a full local gate, and thirteen deliberate failure probes:

1. the classifier call sat outside its `try/catch`, so a run that *could not
   measure* exited `1` — the code meaning "the contract is violated"
2. the main-module guard had dropped a `process.argv[1] &&` test its sibling
   script carried, so importing the module threw
3. duplicate `<loc>` values were collected and printed but never reached the
   exit code, and `--quiet` hid them entirely

All three are the same shape: **a failure that reports as something milder than
it is.** That is this repo's dominant defect class, and it is what the brief
should point the agent at first.
