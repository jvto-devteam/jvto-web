#!/usr/bin/env bash
# Self-test for scripts/ops/deploy-jvto-web.sh (production deploy, handoff
# §3.6). Mirrors deploy-script-selftest.sh's static text/order assertions for
# the invariants shared with deploy-jvto-help.sh (in-place `git reset --hard`
# deploy — no release-per-directory staging; see this script's own header for
# why: production's real PM2 process runs with cwd=$DEPLOY_DIR directly, not
# through a `current` symlink, so a staged/atomic-switch design would never
# actually take effect on a `pm2 restart`), PLUS this script's production-only
# additions: capturing the previous SHA for rollback, restoring the working
# tree on a build failure, post-restart proof before declaring success, and
# an automatic rollback-with-rebuild on a failed post-restart proof.
#
# Static text/order assertions only — no VPS, no root, no deploy, no network.
# Runs on any runner. Wired into ci.yml `verify`.
set -euo pipefail

SCRIPT="$(cd "$(dirname "$0")/../ops" && pwd)/deploy-jvto-web.sh"
fail=0
ok()  { printf '  ok    %s\n' "$*"; }
bad() { printf '  FAIL  %s\n' "$*"; fail=1; }

[ -f "$SCRIPT" ] || { echo "[deploy-jvto-web-script-selftest] missing $SCRIPT"; exit 1; }

noncomment() { grep -vE '^[[:space:]]*#' "$SCRIPT"; }
line_of() { grep -nE "$1" "$SCRIPT" | head -1 | cut -d: -f1; }

echo "[deploy-jvto-web-script-selftest] $SCRIPT"

# 0. syntax
if bash -n "$SCRIPT" 2>/dev/null; then ok "bash -n clean"; else bad "bash -n failed"; fi

# ── invariants shared with deploy-jvto-help.sh ────────────────────────────────

# 1. pm2 resolved BEFORE `nvm use 20` (same load-bearing bug class as help's).
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

# 4. flock serialization, on its OWN lock file (never help's).
grep -qE 'flock -n 9' "$SCRIPT" && ok "flock serialization" || bad "missing flock"
grep -qE 'jvto-web-deploy\.lock' "$SCRIPT" && ok "dedicated jvto-web lock file (distinct from help's)" || bad "must use its own lock file, not help's"

# 5. target must equal origin/live (fail-closed on superseded/arbitrary SHA) —
#    NOTE: origin/live, not origin/main — this is the production script.
grep -qE '"\$TARGET_SHA" != "\$ORIGIN_LIVE"' "$SCRIPT" && ok "target==origin/live fail-closed" || bad "missing origin/live equality guard"
grep -qE 'DEPLOY_BRANCH="live"' "$SCRIPT" && ok "deploys the live branch, not main" || bad "must target the live branch"

# 6. never `git clean` (comments may mention it; commands must not).
if noncomment | grep -qE 'git[[:space:]]+clean'; then bad "must NEVER run 'git clean'"; else ok "no 'git clean' command"; fi

# 7. strict mode + nounset bracket around the nvm load (same order as help's).
grep -qE '^set -euo pipefail' "$SCRIPT" && ok "bash strict mode" || bad "missing 'set -euo pipefail'"
plusu_line="$(line_of '^[[:space:]]*set \+u')"
src_line="$(line_of 'nvm\.sh"')"
reu_line="$(line_of '^[[:space:]]*set -u$')"
if [ -n "$plusu_line" ] && [ -n "$src_line" ] && [ -n "$reu_line" ] && [ -n "$nvm_line" ] \
   && [ "$plusu_line" -lt "$src_line" ] && [ "$nvm_line" -lt "$reu_line" ]; then
  ok "nounset OFF (line $plusu_line) before nvm source (line $src_line); re-enabled (line $reu_line) after 'nvm use 20' (line $nvm_line)"
else
  bad "nounset must be OFF across the nvm load: set +u before source, set -u after 'nvm use 20' (plusu=${plusu_line:-none} src=${src_line:-none} nvm=${nvm_line:-none} reu=${reu_line:-none})"
fi

# ── production-only additions (handoff §3.6, in-place variant) ───────────────

# 8. .env.local existence checked BEFORE the reset/build, never invented.
env_check_line="$(line_of '\[ -f "\$ENV_FILE" \]')"
reset_line="$(line_of 'git reset --hard "\$TARGET_SHA"')"
if [ -n "$env_check_line" ] && [ -n "$reset_line" ] && [ "$env_check_line" -lt "$reset_line" ]; then
  ok ".env.local existence checked (line $env_check_line) before checkout (line $reset_line)"
else
  bad ".env.local must be validated before checkout/build (env=${env_check_line:-none} reset=${reset_line:-none})"
fi
if noncomment | grep -qE '^\s*cat\s*>\s*"\$ENV_FILE"|^\s*touch\s*"\$ENV_FILE"'; then
  bad "must NEVER invent/create \$ENV_FILE"
else
  ok "never invents \$ENV_FILE"
fi

# 9. the previous SHA is captured BEFORE the target checkout, so a rollback
#    target always exists once anything has changed.
prev_capture_line="$(line_of 'PREVIOUS_SHA="\$\(git rev-parse HEAD')"
if [ -n "$prev_capture_line" ] && [ -n "$reset_line" ] && [ "$prev_capture_line" -lt "$reset_line" ]; then
  ok "previous SHA captured (line $prev_capture_line) before checkout (line $reset_line)"
else
  bad "PREVIOUS_SHA must be captured before the target checkout (capture=${prev_capture_line:-none} reset=${reset_line:-none})"
fi

# 10. build failure restores the working tree to PREVIOUS_SHA and never
#     touches PM2 (build_failed() must not call pm2 restart/start).
if grep -qE 'build_failed\(\)' "$SCRIPT"; then
  build_failed_body="$(awk '/^build_failed\(\) \{/,/^\}/' "$SCRIPT")"
  if printf '%s' "$build_failed_body" | grep -q 'PREVIOUS_SHA' && ! printf '%s' "$build_failed_body" | grep -qE '"\$PM2_BIN"'; then
    ok "build_failed() restores \$PREVIOUS_SHA and never touches PM2"
  else
    bad "build_failed() must restore \$PREVIOUS_SHA and must never call \$PM2_BIN"
  fi
else
  bad "missing build_failed() failure handler"
fi

# 11. build (npm ci + npm run build) happens BEFORE the pm2 restart.
build_line="$(line_of '^npm run build \|\| build_failed')"
restart_line="$(line_of '"\$PM2_BIN" restart "\$PM2_PROCESS" --update-env \|\|')"
if [ -n "$build_line" ] && [ -n "$restart_line" ] && [ "$build_line" -lt "$restart_line" ]; then
  ok "npm run build (line $build_line) happens before pm2 restart (line $restart_line)"
else
  bad "build must happen before the pm2 restart (build=${build_line:-none} restart=${restart_line:-none})"
fi

# 12. post-restart smoke runs, and success is declared only AFTER it passes.
smoke_line="$(line_of 'smoke-why-jvto\.mjs"')"
verified_line="$(line_of 'deployed \$TARGET_SHA to \$DEPLOY_DIR')"
if [ -n "$smoke_line" ] && [ -n "$verified_line" ] && [ "$smoke_line" -lt "$verified_line" ]; then
  ok "post-restart smoke (line $smoke_line) runs before declaring the deploy done (line $verified_line)"
else
  bad "post-restart smoke must run and pass before declaring the deploy done (smoke=${smoke_line:-none} verified=${verified_line:-none})"
fi
grep -qE 'REQUIRE_INDEXABLE="true"' "$SCRIPT" && ok "production smoke requires indexability (REQUIRE_INDEXABLE=true)" || bad "production smoke must set REQUIRE_INDEXABLE=true"

# 13. rollback() resets to $PREVIOUS_SHA, rebuilds, and restarts pm2 — and is
#     reachable from both post-restart checks (pm2-status / smoke), both of
#     which precede the final success log line.
if grep -qE '^rollback\(\) \{' "$SCRIPT"; then
  rollback_body="$(awk '/^rollback\(\) \{/,/^\}/' "$SCRIPT")"
  if printf '%s' "$rollback_body" | grep -q 'PREVIOUS_SHA' \
     && printf '%s' "$rollback_body" | grep -qE 'git reset --hard "\$PREVIOUS_SHA"' \
     && printf '%s' "$rollback_body" | grep -qE 'npm ci && npm run build' \
     && printf '%s' "$rollback_body" | grep -qE '"\$PM2_BIN" restart'; then
    ok "rollback() resets to \$PREVIOUS_SHA, rebuilds, and restarts pm2"
  else
    bad "rollback() must reset to \$PREVIOUS_SHA, rebuild (npm ci && npm run build), and restart pm2"
  fi
else
  bad "missing rollback() handler"
fi
rollback_call_line="$(line_of 'rollback "pm2 status is not online"')"
if [ -n "$rollback_call_line" ] && [ -n "$verified_line" ] && [ "$rollback_call_line" -lt "$verified_line" ]; then
  ok "rollback is wired before the final success log line (rollback=${rollback_call_line}, verified=${verified_line})"
else
  bad "rollback checks must precede the final success log line (rollback=${rollback_call_line:-none} verified=${verified_line:-none})"
fi

# 14. no separate release-per-directory staging (worktree/current symlink) —
#     this variant is deliberately in-place; a regression back to a worktree
#     design without re-verifying PM2's real cwd would silently break restart.
if noncomment | grep -qE 'git worktree|CURRENT_LINK|RELEASES_DIR'; then
  bad "this variant must be in-place — no git worktree / \$CURRENT_LINK / \$RELEASES_DIR (verify PM2's real cwd before reintroducing staging)"
else
  ok "in-place deploy confirmed — no worktree/current-symlink staging"
fi

# 15. pm2 restart/start uses the captured $PM2_BIN --update-env; no `pm2 update`.
grep -qE '"\$PM2_BIN" restart "\$PM2_PROCESS" --update-env \|\|' "$SCRIPT" && ok "restart via \$PM2_BIN --update-env" || bad "restart must use \$PM2_BIN --update-env"
if noncomment | grep -qE 'pm2 update'; then bad "must not run 'pm2 update'"; else ok "no 'pm2 update' command"; fi

if [ "$fail" -ne 0 ]; then echo "[deploy-jvto-web-script-selftest] FAIL"; exit 1; fi
echo "[deploy-jvto-web-script-selftest] PASS"
