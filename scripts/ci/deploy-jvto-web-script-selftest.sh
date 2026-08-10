#!/usr/bin/env bash
# Self-test for scripts/ops/deploy-jvto-web.sh (production deploy, handoff
# §3.6). Mirrors deploy-script-selftest.sh's static text/order assertions for
# the invariants shared with deploy-jvto-help.sh, PLUS the production-only
# additions this script introduces: build-in-a-staging-worktree (never over
# the running release), an atomic symlink switch, post-switch proof BEFORE
# declaring success, and an automatic rollback-to-previous-release ordering.
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

# ── production-only additions (handoff §3.6) ──────────────────────────────────

# 8. .env.local existence checked BEFORE the worktree/build, never invented.
env_check_line="$(line_of '\[ -f "\$ENV_FILE" \]')"
worktree_add_line="$(line_of 'git worktree add')"
if [ -n "$env_check_line" ] && [ -n "$worktree_add_line" ] && [ "$env_check_line" -lt "$worktree_add_line" ]; then
  ok ".env.local existence checked (line $env_check_line) before worktree build (line $worktree_add_line)"
else
  bad ".env.local must be validated before the build starts (env=${env_check_line:-none} worktree=${worktree_add_line:-none})"
fi
if noncomment | grep -qE '^\s*cat\s*>\s*"\$ENV_FILE"|^\s*touch\s*"\$ENV_FILE"'; then
  bad "must NEVER invent/create \$ENV_FILE"
else
  ok "never invents \$ENV_FILE"
fi

# 9. build happens in a release worktree, not in $DEPLOY_DIR / $CURRENT_LINK
#    directly — i.e. `npm run build` must run inside a subshell cd'd to
#    $RELEASE_DIR, not a bare top-level `npm run build`.
if grep -qE 'cd "\$RELEASE_DIR" && npm run build' "$SCRIPT"; then
  ok "build runs inside the release worktree (\$RELEASE_DIR), not in place"
else
  bad "build must run inside \$RELEASE_DIR, never over the running release"
fi
if noncomment | grep -qE '^\s*npm run build\s*$'; then
  bad "must not run a bare top-level 'npm run build' (would build over the running release)"
else
  ok "no bare top-level 'npm run build'"
fi

# 10. switch is an atomic symlink flip (temp link + mv -T), and it happens
#     BEFORE the pm2 restart/bootstrap step.
switch_line="$(line_of 'mv -T "\$TMP_LINK" "\$CURRENT_LINK"')"
restart_line="$(line_of '"\$PM2_BIN" restart "\$PM2_PROCESS" --update-env \|\|')"
if [ -n "$switch_line" ] && [ -n "$restart_line" ] && [ "$switch_line" -lt "$restart_line" ]; then
  ok "atomic \$current switch (line $switch_line) happens before pm2 restart (line $restart_line)"
else
  bad "the \$current symlink switch must happen before the pm2 restart (switch=${switch_line:-none} restart=${restart_line:-none})"
fi

# 11. build failure aborts BEFORE the switch (build_failed() never touches
#     $CURRENT_LINK) — the running release must survive a failed build.
if grep -qE 'build_failed\(\)' "$SCRIPT"; then
  build_failed_body="$(awk '/^build_failed\(\) \{/,/^\}/' "$SCRIPT")"
  if printf '%s' "$build_failed_body" | grep -q 'CURRENT_LINK'; then
    bad "build_failed() must never touch \$CURRENT_LINK — a failed build must leave the running release intact"
  else
    ok "build_failed() never touches \$CURRENT_LINK (running release survives a failed build)"
  fi
else
  bad "missing build_failed() failure handler"
fi

# 12. post-switch verification (smoke script) runs, and success is declared
#     only AFTER it passes — i.e. the final "verified live" log line must
#     come after the smoke-script invocation.
smoke_line="$(line_of 'smoke-why-jvto\.mjs"')"
verified_line="$(line_of 'verification PASSED')"
if [ -n "$smoke_line" ] && [ -n "$verified_line" ] && [ "$smoke_line" -lt "$verified_line" ]; then
  ok "post-switch smoke (line $smoke_line) runs before declaring verification passed (line $verified_line)"
else
  bad "post-switch smoke must run and pass before declaring the deploy verified (smoke=${smoke_line:-none} verified=${verified_line:-none})"
fi
grep -qE 'REQUIRE_INDEXABLE="true"' "$SCRIPT" && ok "production smoke requires indexability (REQUIRE_INDEXABLE=true)" || bad "production smoke must set REQUIRE_INDEXABLE=true"

# 13. rollback() actually re-points $CURRENT_LINK to $PREVIOUS_RELEASE and
#     restarts pm2, and is only reachable from the two verification checks
#     (pm2-status / smoke), both of which precede the prune step.
if grep -qE '^rollback\(\) \{' "$SCRIPT"; then
  rollback_body="$(awk '/^rollback\(\) \{/,/^\}/' "$SCRIPT")"
  if printf '%s' "$rollback_body" | grep -q 'PREVIOUS_RELEASE' && printf '%s' "$rollback_body" | grep -q 'CURRENT_LINK' && printf '%s' "$rollback_body" | grep -qE '"\$PM2_BIN" restart'; then
    ok "rollback() re-points \$current to \$PREVIOUS_RELEASE and restarts pm2"
  else
    bad "rollback() must re-point \$CURRENT_LINK to \$PREVIOUS_RELEASE and restart pm2"
  fi
else
  bad "missing rollback() handler"
fi
rollback_call_line="$(line_of 'rollback "pm2 status is not online"')"
prune_line="$(line_of '# ── 10\. Prune old releases')"
if [ -n "$rollback_call_line" ] && [ -n "$prune_line" ] && [ "$rollback_call_line" -lt "$prune_line" ]; then
  ok "rollback is wired before pruning (rollback=${rollback_call_line}, prune=${prune_line})"
else
  bad "rollback checks must precede the prune-old-releases step (rollback=${rollback_call_line:-none} prune=${prune_line:-none})"
fi

# 14. pruning is bounded (KEEP_RELEASES) and never removes the just-deployed
#     release, and only ever runs AFTER verification passed (i.e. after the
#     smoke line, checked in #12/#13 above).
grep -qE 'KEEP_RELEASES=' "$SCRIPT" && ok "release retention is bounded (KEEP_RELEASES)" || bad "missing bounded release retention"
if [ -n "$prune_line" ] && [ -n "$verified_line" ] && [ "$verified_line" -lt "$prune_line" ]; then
  ok "pruning happens after verification is declared passed"
else
  bad "pruning must happen only after a verified-good deploy"
fi
if noncomment | grep -qE '\[ "\$old" = "\$RELEASE_DIR" \] && continue'; then
  ok "pruning skips the release just deployed"
else
  bad "pruning must never remove the release that was just deployed"
fi

# 15. old releases are removed via `git worktree remove`, not a bare `rm -rf`,
#     so git's own worktree metadata never goes stale (help's script has no
#     equivalent — this is unique to the worktree-per-release design here).
grep -qE 'git worktree remove --force "\$old"' "$SCRIPT" && ok "old releases pruned via 'git worktree remove'" || bad "old releases must be pruned via 'git worktree remove', not a bare rm -rf"

# 16. pm2 restart uses the captured $PM2_BIN --update-env; no `pm2 update`.
grep -qE '"\$PM2_BIN" restart "\$PM2_PROCESS" --update-env \|\|' "$SCRIPT" && ok "restart via \$PM2_BIN --update-env" || bad "restart must use \$PM2_BIN --update-env"
if noncomment | grep -qE 'pm2 update'; then bad "must not run 'pm2 update'"; else ok "no 'pm2 update' command"; fi

if [ "$fail" -ne 0 ]; then echo "[deploy-jvto-web-script-selftest] FAIL"; exit 1; fi
echo "[deploy-jvto-web-script-selftest] PASS"
