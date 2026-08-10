#!/usr/bin/env bash
#
# deploy-jvto-web.sh — PRODUCTION (jvto-web / javavolcano-touroperator.com)
# deployment, run ON the VPS.
#
# Invoked ONLY as:  sudo /usr/local/sbin/deploy-jvto-web <40-hex-sha>
# by the dedicated self-hosted GitHub Actions runner (unprivileged user
# `jvto-deploy`) through a narrow sudoers rule restricted to exactly this
# command. Security posture is IDENTICAL to deploy-jvto-help.sh (see that
# script's header) — same input contract, same fail-closed SHA check, same
# `git clean`-never rule, same set +u/-u bracket around the nvm load, same
# IN-PLACE `git reset --hard` (no releases/current staging directory — an
# earlier version of this script used a `git worktree`-per-release + atomic
# symlink design per the handoff's original ask, but the box's actual `pm2
# describe jvto-web` showed `exec cwd: /var/www/jvto-web` — i.e. the PM2
# process PM2 already running production was configured, outside this
# script, to run directly out of $DEPLOY_DIR, not a `current` symlink. That
# process is kept alive by an existing mechanism outside this script (likely
# GitHub Actions, per the owner) and gets restarted frequently, so a design
# that only that existing process's cwd was never going to take effect via a
# `pm2 restart` (fork-mode PM2 does not re-resolve cwd on restart). In-place
# is what's actually compatible with the box as configured today.
#
# What this script still adds beyond help's plain pattern (the handoff's
# production-only requirements it CAN satisfy without a release-per-directory
# layout):
#   - captures the previously-deployed SHA before touching anything, so a
#     failed post-deploy proof can roll back via `git reset --hard` + rebuild
#     + restart, instead of leaving a broken build live;
#   - after restart, runs the SAME post-deploy smoke script the CI workflow
#     runs (scripts/smoke-why-jvto.mjs) with REQUIRE_INDEXABLE=true against
#     the public production origin, as root, so a failure can actually
#     trigger that rollback (the CI step that runs afterward has no
#     privileged access to do that).
#
# Known trade-off vs. the original worktree/symlink design: because there is
# no separate release directory, a build failure still leaves the working
# tree checked out at the new (broken) SHA even though PM2 was never
# restarted — this script restores the working tree to the previous SHA
# before exiting on a build failure (an improvement over deploy-jvto-help.sh,
# which does not), but a rollback-after-failed-verification is NOT atomic:
# there is a real window where PM2 is running the bad build while this script
# rebuilds the previous SHA and restarts again. Documented, not hidden.
#
# First-run note: if PM2 process `jvto-web` does not exist yet, this script
# creates it itself with cwd=$DEPLOY_DIR via `npm start` (next start). If one
# already exists (as it does today, managed by something outside this
# script), this script only restarts it — cwd is whatever it was already
# started with, which must be $DEPLOY_DIR for a restart to actually pick up
# new code (fork-mode PM2 does not re-resolve cwd on restart).
#
# It intentionally hard-codes the deploy dir, branch, and PM2 process; nothing
# about the target is configurable from the caller.

set -euo pipefail

readonly DEPLOY_DIR="/var/www/jvto-web"
readonly DEPLOY_BRANCH="live"
readonly PM2_PROCESS="jvto-web"
readonly LOCK_FILE="/var/lock/jvto-web-deploy.lock"
readonly NVM_DIR="/root/.nvm"
readonly ENV_FILE="$DEPLOY_DIR/.env.local"
readonly PROD_BASE_URL="https://javavolcano-touroperator.com"

log() { printf '[deploy-jvto-web] %s\n' "$*"; }
die() { printf '[deploy-jvto-web] ERROR: %s\n' "$*" >&2; exit "${2:-1}"; }

# ── 1. Input: exactly one 40-char lowercase hex SHA ──────────────────────────
if [ "$#" -ne 1 ]; then
  die "usage: deploy-jvto-web <40-char-lowercase-hex-sha>" 2
fi
readonly TARGET_SHA="$1"
if ! printf '%s' "$TARGET_SHA" | grep -Eq '^[0-9a-f]{40}$'; then
  die "'$TARGET_SHA' is not a 40-char lowercase hex commit SHA" 2
fi

# ── 2. Serialize: only one production deploy at a time (non-blocking) ────────
exec 9>"$LOCK_FILE" || die "cannot open lock file $LOCK_FILE" 3
if ! flock -n 9; then
  die "another jvto-web deploy holds $LOCK_FILE; aborting" 3
fi

# ── 3. Resolve pm2 BEFORE switching Node, THEN select Node 20 ────────────────
# Same load-bearing order as deploy-jvto-help.sh, asserted by this script's
# own self-test (scripts/ci/deploy-jvto-web-script-selftest.sh).
set +u
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then . "$NVM_DIR/nvm.sh"; else die "nvm not found at $NVM_DIR/nvm.sh" 5; fi
PM2_BIN="$(command -v pm2 || true)"
if [ -z "$PM2_BIN" ] || [ ! -x "$PM2_BIN" ]; then
  die "pm2 not found as an executable on PATH before 'nvm use 20' (is pm2 installed globally on the box?)" 5
fi
case "$PM2_BIN" in
  /*) : ;;                                       # absolute path — required
  *) die "resolved pm2 path '$PM2_BIN' is not absolute" 5 ;;
esac
nvm use 20 >/dev/null || die "nvm use 20 failed (is Node 20 installed on the box?)" 5
set -u

cd "$DEPLOY_DIR" || die "cannot cd to $DEPLOY_DIR" 6

# ── 4. Fetch + require the target SHA to be the CURRENT origin/live tip ──────
git fetch --prune origin "$DEPLOY_BRANCH" || die "git fetch origin $DEPLOY_BRANCH failed" 6
ORIGIN_LIVE="$(git rev-parse "origin/${DEPLOY_BRANCH}")"
if [ "$TARGET_SHA" != "$ORIGIN_LIVE" ]; then
  # Superseded (or arbitrary) SHA: stop WITHOUT touching production — the
  # current tip's own deploy will land it. Never reset production to a
  # non-tip commit.
  die "target $TARGET_SHA is not the current origin/${DEPLOY_BRANCH} ($ORIGIN_LIVE); superseded — stopping without touching production" 7
fi

# ── 5. Production .env.local must already exist — never invented, never moved.
[ -f "$ENV_FILE" ] || die "$ENV_FILE not found — production secrets must be provisioned before the first deploy" 4

# ── 6. Capture the currently-deployed SHA for rollback, then check out target.
# `git reset --hard` only touches tracked files, so untracked .env / .env.local
# survive. `git clean` is deliberately never run (same rule as help's script).
PREVIOUS_SHA="$(git rev-parse HEAD 2>/dev/null || true)"
export APP_COMMIT_SHA="$TARGET_SHA"
git reset --hard "$TARGET_SHA" || die "git reset --hard $TARGET_SHA failed" 6
log "checked out $TARGET_SHA in $DEPLOY_DIR (previous: ${PREVIOUS_SHA:-<none>})"

# ── 7. Build. A failure restores the working tree to the previous SHA (so it
# always matches whatever PM2 is actually still serving) before aborting —
# PM2 itself is never touched here, so the running process stays up.
build_failed() {
  local reason="$1"
  if [ -n "$PREVIOUS_SHA" ]; then
    git reset --hard "$PREVIOUS_SHA" 2>/dev/null || true
  fi
  die "$reason — NOT restarting $PM2_PROCESS (running process stays up; working tree restored to $PREVIOUS_SHA)" 8
}

npm ci || build_failed "npm ci failed"
npm run build || build_failed "npm run build failed"

# ── 8. Restart (or first-run bootstrap) ONLY jvto-web. ────────────────────────
if "$PM2_BIN" describe "$PM2_PROCESS" >/dev/null 2>&1; then
  "$PM2_BIN" restart "$PM2_PROCESS" --update-env || die "pm2 restart $PM2_PROCESS failed" 9
else
  log "$PM2_PROCESS has no existing pm2 process — bootstrapping it now (cwd=$DEPLOY_DIR)"
  "$PM2_BIN" start npm --name "$PM2_PROCESS" --cwd "$DEPLOY_DIR" --update-env -- start \
    || die "pm2 start $PM2_PROCESS (first-run bootstrap) failed" 9
fi

# ── 9. Post-restart proof: PM2 online + the real production smoke script. ────
# Reuses the SAME script the CI workflow itself runs afterward — single
# source of truth for what "verified" means — but run HERE, as root, so a
# failure can actually trigger the rollback below (the CI step that follows
# has no privileged access to do that).
rollback() {
  local reason="$1"
  log "post-deploy verification FAILED ($reason)"
  if [ -n "$PREVIOUS_SHA" ]; then
    log "rolling back to $PREVIOUS_SHA (git reset --hard + rebuild + restart)"
    git reset --hard "$PREVIOUS_SHA" || log "WARNING: git reset --hard during rollback failed — manual intervention required"
    if npm ci && npm run build; then
      "$PM2_BIN" restart "$PM2_PROCESS" --update-env || log "WARNING: pm2 restart during rollback also failed — manual intervention required"
    else
      log "WARNING: rebuild during rollback also failed — $PM2_PROCESS is still running the SHA it had before this restart attempt, but the working tree may not match it — manual intervention required"
    fi
    die "deployed $TARGET_SHA failed verification ($reason); rolled back to $PREVIOUS_SHA" 10
  else
    die "deployed $TARGET_SHA failed verification ($reason); NO previous SHA to roll back to (first deploy) — production is left on the failing build, investigate immediately" 11
  fi
}

sleep 3
if ! "$PM2_BIN" describe "$PM2_PROCESS" 2>/dev/null | grep -qE 'status[^│|]*[│|][^│|]*online'; then
  rollback "pm2 status is not online"
fi

if ! BASE_URL="$PROD_BASE_URL" EXPECTED_SHA="$TARGET_SHA" REQUIRE_INDEXABLE="true" \
    node "$DEPLOY_DIR/scripts/smoke-why-jvto.mjs"; then
  rollback "scripts/smoke-why-jvto.mjs failed"
fi

log "deployed $TARGET_SHA to $DEPLOY_DIR ($PM2_PROCESS restarted with APP_COMMIT_SHA, verified live)"
