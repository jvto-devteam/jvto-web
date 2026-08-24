# Vendored: Impeccable

This directory is a **vendored copy** of the `impeccable` design skill. Do not hand-edit files here —
edits are lost on the next update. File issues upstream instead.

| | |
|---|---|
| Upstream | https://github.com/pbakaus/impeccable |
| Homepage | https://impeccable.style |
| Version | **4.1.1** |
| Commit | `56f44523f76efdcec813e67b38ee550e49b16f48` |
| Vendored on | 2026-08-23 |
| Source path | `plugin/skills/impeccable/` |
| License | Apache-2.0 (see `LICENSE` in this directory) |
| Author | Paul Bakaus |

## What this gives you

One skill exposing 23 sub-commands: `/impeccable audit`, `critique`, `polish`, `shape`, `layout`,
`typeset`, `colorize`, `animate`, `clarify`, `adapt`, `optimize`, `harden`, `distill`, `bolder`,
`quieter`, `delight`, `onboard`, `overdrive`, `extract`, `document`, `init`, `live`, `doctor`.

Plus a bundled deterministic anti-pattern detector under `scripts/detector/`, runnable standalone:

```bash
node .claude/skills/impeccable/scripts/detect.mjs --help
```

## What was deliberately NOT installed

- **`plugin/hooks/hooks.json`** — the post-edit design detector hook. Not wired into
  `.claude/settings.json`. Enable later with `/impeccable hooks on` if the team wants it.
- **`plugin/agents/*.md`** — the four helper subagents (`impeccable-asset-producer`,
  `impeccable-documenter`, `impeccable-finish-reviewer`, `impeccable-manual-edit-applier`). The skill
  degrades gracefully without them via `reference/degraded/*.md`. To install, copy those four files
  into `.claude/agents/`.
- **The npm package** (`npx impeccable`). npm `latest` is **3.6.0**, older than this 4.1.1 plugin — its
  detector engine would disagree with the one bundled here. Always use the local `scripts/detect.mjs`.

## Updating

```bash
git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/impeccable-src
rm -rf .claude/skills/impeccable
cp -r /tmp/impeccable-src/plugin/skills/impeccable .claude/skills/impeccable
cp /tmp/impeccable-src/LICENSE .claude/skills/impeccable/LICENSE
# then restore this file and bump the table above
```

## Project notes

`PRODUCT.md` exists at the repo root and is current. `DESIGN.md` / `DESIGN.json` exist but document a
**superseded V1 palette**; see `docs/_audit/impeccable-audit-live-2026-08-23.md` for the finding.
Run `/impeccable document` to regenerate them from live code before relying on any command that reads
design tokens.
