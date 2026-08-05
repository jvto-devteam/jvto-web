#!/usr/bin/env bash
# workflow-security-selftest.sh — proves the PR + help-deploy workflows carry NO
# inbound SSH, and that the real production build runs GitHub-hosted before merge:
#   1. no appleboy/ssh-action anywhere in ci.yml or deploy.yml;
#   2. no DEVELOP_SSH_* (PR path) or VPS_* (deploy path) SSH secrets referenced;
#   3. the help deploy runs ONLY on the dedicated local runner (jvto-help-deploy),
#      never a GitHub-hosted runner;
#   4. ci.yml has a `build` job that runs `npm ci` and `npm run build`.
# Static text assertions; runs on any runner. Wired blocking into ci.yml `verify`.
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CI="$DIR/.github/workflows/ci.yml"
DEP="$DIR/.github/workflows/deploy.yml"
fail=0
ok()  { printf '  ok    %s\n' "$*"; }
bad() { printf '  FAIL  %s\n' "$*"; fail=1; }

for f in "$CI" "$DEP"; do [ -f "$f" ] || { echo "missing $f"; exit 1; }; done

echo "[workflow-security-selftest]"

# 1. No inbound SSH action anywhere on the PR or help-deploy path. Comments may
#    legitimately mention appleboy/ssh-action (as a removed thing); only an actual
#    non-comment `uses:` invocation counts, so strip comment lines first.
for f in "$CI" "$DEP"; do
  n="$(basename "$f")"
  if grep -vE '^[[:space:]]*#' "$f" | grep -qE 'appleboy/ssh-action'; then bad "$n still uses appleboy/ssh-action"; else ok "$n: no appleboy/ssh-action (non-comment)"; fi
done

# 2. No SSH secrets referenced (DEVELOP_SSH_* on the PR path; VPS_* on the deploy path).
if grep -qE 'DEVELOP_SSH_(HOST|USER|KEY)' "$CI"; then bad "ci.yml still references DEVELOP_SSH_*"; else ok "ci.yml: no DEVELOP_SSH_* secret"; fi
for f in "$CI" "$DEP"; do
  n="$(basename "$f")"
  if grep -qE 'VPS_(HOST|USER|SSH_KEY)' "$f"; then bad "$n still references VPS_* SSH secrets"; else ok "$n: no VPS_* SSH secret"; fi
done

# 3. Help deploy runs ONLY on the dedicated local runner label, never GitHub-hosted.
if grep -qE 'runs-on:[[:space:]]*\[[[:space:]]*self-hosted,[[:space:]]*Linux,[[:space:]]*X64,[[:space:]]*jvto-help-deploy[[:space:]]*\]' "$DEP"; then
  ok "deploy.yml runs on [self-hosted, Linux, X64, jvto-help-deploy]"
else
  bad "deploy.yml must run on the [self-hosted, Linux, X64, jvto-help-deploy] runner"
fi
if grep -qE '^[[:space:]]*runs-on:[[:space:]]*ubuntu-latest' "$DEP"; then bad "deploy.yml must NOT use a GitHub-hosted runner"; else ok "deploy.yml: no ubuntu-latest runner"; fi

# 4. ci.yml has a `build` job that runs the real production build before merge.
if grep -qE '^  build:' "$CI"; then ok "ci.yml has a build job"; else bad "ci.yml is missing the build job"; fi
if grep -qE '^[[:space:]]*run: npm ci$' "$CI"; then ok "ci.yml runs 'npm ci'"; else bad "ci.yml must run 'npm ci'"; fi
if grep -qE '^[[:space:]]*run: npm run build$' "$CI"; then ok "ci.yml runs 'npm run build'"; else bad "ci.yml must run 'npm run build'"; fi

if [ "$fail" -ne 0 ]; then echo "[workflow-security-selftest] FAIL"; exit 1; fi
echo "[workflow-security-selftest] PASS"
