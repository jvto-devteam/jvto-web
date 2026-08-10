#!/usr/bin/env bash
# Deterministic self-test for the "true-documentation-only" classifier used to
# skip the help deploy (deploy.yml) — automation-governance hardening 2026-08-04,
# per the owner's docs-only spec + Codex P1/P2. (The rule formerly also skipped
# the SSH build-develop job; that job was removed with the runner cutover, so the
# predicate now lives ONLY in deploy.yml's paths-ignore.)
#
# "Documentation" is ONLY `docs/**` and root-level *.md (README.md / CLAUDE.md).
# Served content Markdown is production output and MUST build/deploy —
# content/pages/**/*.md renders via loadStaticPage (this now includes the blog:
# content/pages/blog/**/*.md, since the Milestone-2 Blog migration retired
# src/data/blog + src/lib/blog). This test asserts (a) the classifier verdict for
# the full case matrix and (b) that deploy.yml still carries the exact
# paths-ignore, so a future edit that widens the rule fails CI here.
set -euo pipefail

# The single canonical predicate. classify() prints "code" (build required) or
# "docs" (skippable) for a newline-separated file list on stdin.
DOC_RE='(^docs/|^[^/]+\.md$)'

classify() {
  local files nondoc
  files="$(cat)"
  nondoc="$(printf '%s\n' "$files" | grep -vE "$DOC_RE" || true)"
  # A blank input list has no non-doc file -> "docs"; guard against the empty
  # push case explicitly so it is never mistaken for a real change set.
  if [ -z "$(printf '%s' "$files" | tr -d '[:space:]')" ]; then echo "empty"; return; fi
  if [ -n "$nondoc" ]; then echo "code"; else echo "docs"; fi
}

fail=0
check() {
  local expected="$1"; shift
  local got
  got="$(printf '%s\n' "$@" | classify)"
  if [ "$got" = "$expected" ]; then
    echo "  ok    [$got] $*"
  else
    echo "  FAIL  expected [$expected] got [$got] for: $*"
    fail=1
  fi
}

echo "[docs-only-selftest] classifier matrix"
# --- docs-only (skip build/deploy) ---
check docs "CLAUDE.md"
check docs "README.md"
check docs "docs/architecture/example.md"
check docs "docs/architecture/a.md" "CLAUDE.md"
# --- code (build/deploy required) ---
check code "content/pages/policy/privacy.md"
check code "content/pages/travel-guide/index.md"
check code "content/pages/blog/example.md"
check code ".github/workflows/ci.yml"
check code "src/app/page.tsx"
# --- mixed docs + served content -> code ---
check code "docs/architecture/example.md" "content/pages/policy/privacy.md"
check code "CLAUDE.md" "content/pages/blog/example.md"

echo "[docs-only-selftest] drift guards (deploy.yml must carry the exact rule)"
dep="$(dirname "$0")/../../.github/workflows/deploy.yml"
guard() { # <file> <grep-args...>
  local f="$1"; shift
  if grep -qE "$@" "$f"; then echo "  ok    $f carries: $*"; else echo "  FAIL  $f missing: $*"; fail=1; fi
}
# deploy.yml paths-ignore must be root *.md + docs/**, and must NOT be the
# over-broad **/*.md that swept in served content Markdown (the Codex P1 bug).
guard "$dep" "^ *- '\*\.md'"
guard "$dep" "^ *- 'docs/\*\*'"
# Only flag the over-broad pattern as an actual paths-ignore LIST ITEM
# (`- '**/*.md'`), not a mention inside an explanatory comment.
if grep -qE "^ *- '\*\*/\*\.md'" "$dep"; then
  echo "  FAIL  $dep still lists the over-broad '**/*.md' in paths-ignore"; fail=1
else
  echo "  ok    $dep does not list the over-broad '**/*.md'"
fi

if [ "$fail" -ne 0 ]; then
  echo "[docs-only-selftest] FAIL"
  exit 1
fi
echo "[docs-only-selftest] PASS"
