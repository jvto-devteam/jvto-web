#!/usr/bin/env bash
# Self-test for scripts/ops/deploy-jvto-help.sh — asserts the ordering- and
# security-critical invariants so they cannot silently regress. Primarily it
# PROVES pm2 is resolved BEFORE `nvm use 20`: pm2 is a default-Node global that
# `nvm use 20` can drop from PATH, so resolving it afterwards would risk a
# pm2-not-found restart even after a green build (owner audit, commit c31d2858).
#
# Static text/order assertions only — no VPS, no root, no deploy. Runs on any
# runner. Wired into ci.yml `verify`.
set -euo pipefail

SCRIPT="$(cd "$(dirname "$0")/../ops" && pwd)/deploy-jvto-help.sh"
fail=0
ok()  { printf '  ok    %s\n' "$*"; }
bad() { printf '  FAIL  %s\n' "$*"; fail=1; }

[ -f "$SCRIPT" ] || { echo "[deploy-script-selftest] missing $SCRIPT"; exit 1; }

# Non-comment lines only (comments legitimately MENTION 'git clean' / 'pm2 update').
noncomment() { grep -vE '^[[:space:]]*#' "$SCRIPT"; }
line_of() { grep -nE "$1" "$SCRIPT" | head -1 | cut -d: -f1; }

echo "[deploy-script-selftest] $SCRIPT"

# 0. syntax
if bash -n "$SCRIPT" 2>/dev/null; then ok "bash -n clean"; else bad "bash -n failed"; fi

# 1. THE reported bug: pm2 resolved BEFORE `nvm use 20`.
pm2_line="$(line_of 'PM2_BIN="\$\(command -v pm2')"
nvm_line="$(line_of '^[[:space:]]*nvm use 20')"
if [ -n "$pm2_line" ] && [ -n "$nvm_line" ] && [ "$pm2_line" -lt "$nvm_line" ]; then
  ok "pm2 resolved (line $pm2_line) BEFORE 'nvm use 20' (line $nvm_line)"
else
  bad "pm2 must be resolved before 'nvm use 20' (pm2=${pm2_line:-none} nvm=${nvm_line:-none})"
fi

# 2. PM2_BIN validated as an absolute, executable path.
if grep -qE 'case "\$PM2_BIN"' "$SCRIPT" && grep -qE '! -x "\$PM2_BIN"' "$SCRIPT"; then
  ok "PM2_BIN validated (absolute + executable)"
else
  bad "PM2_BIN must be validated as absolute + executable"
fi

# 3. exactly one arg + 40-char lowercase hex SHA.
grep -qE '"\$#" -ne 1' "$SCRIPT" && ok "exactly-one-arg guard" || bad "missing single-arg guard"
grep -qE '\[0-9a-f\]\{40\}' "$SCRIPT" && ok "40-hex SHA validation" || bad "missing 40-hex SHA validation"

# 4. flock serialization.
grep -qE 'flock -n 9' "$SCRIPT" && ok "flock serialization" || bad "missing flock"

# 5. target must equal origin/main (fail-closed on superseded/arbitrary SHA).
grep -qE '"\$TARGET_SHA" != "\$ORIGIN_MAIN"' "$SCRIPT" && ok "target==origin/main fail-closed" || bad "missing origin/main equality guard"

# 6. never `git clean` (comments may mention it; commands must not).
if noncomment | grep -qE 'git[[:space:]]+clean'; then bad "must NEVER run 'git clean'"; else ok "no 'git clean' command"; fi

# 7. build BEFORE restart.
build_line="$(line_of 'npm run build')"
restart_line="$(line_of '"\$PM2_BIN" restart')"
if [ -n "$build_line" ] && [ -n "$restart_line" ] && [ "$build_line" -lt "$restart_line" ]; then
  ok "npm run build (line $build_line) before PM2 restart (line $restart_line)"
else
  bad "build must run before the PM2 restart (build=${build_line:-none} restart=${restart_line:-none})"
fi

# 8. restart uses the captured $PM2_BIN --update-env; no `pm2 update`.
grep -qE '"\$PM2_BIN" restart "\$PM2_PROCESS" --update-env' "$SCRIPT" && ok "restart via \$PM2_BIN --update-env" || bad "restart must use \$PM2_BIN --update-env"
if noncomment | grep -qE 'pm2 update'; then bad "must not run 'pm2 update'"; else ok "no 'pm2 update' command"; fi

# 9. strict mode.
grep -qE '^set -euo pipefail' "$SCRIPT" && ok "bash strict mode" || bad "missing 'set -euo pipefail'"

# 10. nounset turned OFF across the nvm load (nvm.sh references unset vars while
#     sourcing), then re-enabled after `nvm use 20` (Codex P1). Required order:
#     set +u  <  . nvm.sh  <  nvm use 20  <  set -u.
plusu_line="$(line_of '^[[:space:]]*set \+u')"
src_line="$(line_of 'nvm\.sh"')"
reu_line="$(line_of '^[[:space:]]*set -u$')"
if [ -n "$plusu_line" ] && [ -n "$src_line" ] && [ -n "$reu_line" ] && [ -n "$nvm_line" ] \
   && [ "$plusu_line" -lt "$src_line" ] && [ "$nvm_line" -lt "$reu_line" ]; then
  ok "nounset OFF (set +u line $plusu_line) before nvm source (line $src_line); re-enabled (set -u line $reu_line) after 'nvm use 20' (line $nvm_line)"
else
  bad "nounset must be OFF across the nvm load: set +u before source, set -u after 'nvm use 20' (plusu=${plusu_line:-none} src=${src_line:-none} nvm=${nvm_line:-none} reu=${reu_line:-none})"
fi

if [ "$fail" -ne 0 ]; then echo "[deploy-script-selftest] FAIL"; exit 1; fi
echo "[deploy-script-selftest] PASS"
