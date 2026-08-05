#!/usr/bin/env bash
#
# deploy-jvto-help.sh — help/preview (jvto-help) deployment, run ON the VPS.
#
# Invoked ONLY as:  sudo /usr/local/sbin/deploy-jvto-help <40-hex-sha>
# by the dedicated self-hosted GitHub Actions runner (unprivileged user
# `jvto-deploy`) through a narrow sudoers rule restricted to exactly this command.
#
# Security posture (see the PR description / owner checkpoint for install steps):
#   - the runner process runs as unprivileged `jvto-deploy`, never root;
#   - this script is root-owned in /usr/local/sbin and reachable only via the
#     sudoers rule `jvto-deploy ALL=(root) NOPASSWD: /usr/local/sbin/deploy-jvto-help *`;
#   - the ONLY caller-supplied input is a single commit SHA — no free command or
#     path is ever taken from the caller;
#   - the SHA is strictly validated (40-char lowercase hex) and MUST equal the
#     current origin/main tip, so a stale/arbitrary/superseded SHA is refused
#     (fail-closed) and never deployed;
#   - a flock serializes deploys so two builds never mutate the checkout at once;
#   - `git clean` is never run (it would delete the untracked .env/.env.local);
#   - a build failure aborts BEFORE the PM2 restart (set -e), so a broken build
#     never replaces the running process.
#
# It intentionally hard-codes the deploy dir, branch, and PM2 process; nothing
# about the target is configurable from the caller.

set -euo pipefail

readonly DEPLOY_DIR="/var/www/jvto-help"
readonly DEPLOY_BRANCH="main"
readonly PM2_PROCESS="jvto-help"
readonly LOCK_FILE="/var/lock/jvto-help-deploy.lock"
readonly NVM_DIR="/root/.nvm"

log() { printf '[deploy-jvto-help] %s\n' "$*"; }
die() { printf '[deploy-jvto-help] ERROR: %s\n' "$*" >&2; exit "${2:-1}"; }

# ── 1. Input: exactly one 40-char lowercase hex SHA ──────────────────────────
if [ "$#" -ne 1 ]; then
  die "usage: deploy-jvto-help <40-char-lowercase-hex-sha>" 2
fi
readonly TARGET_SHA="$1"
if ! printf '%s' "$TARGET_SHA" | grep -Eq '^[0-9a-f]{40}$'; then
  die "'$TARGET_SHA' is not a 40-char lowercase hex commit SHA" 2
fi

# ── 2. Serialize: only one deploy at a time (non-blocking) ───────────────────
exec 9>"$LOCK_FILE" || die "cannot open lock file $LOCK_FILE" 3
if ! flock -n 9; then
  die "another jvto-help deploy holds $LOCK_FILE; aborting" 3
fi

# ── 3. Node 20 via root's nvm (Next.js 16 needs >=20.9; box default is 18) ────
# shellcheck disable=SC1091
if [ -s "$NVM_DIR/nvm.sh" ]; then . "$NVM_DIR/nvm.sh"; else die "nvm not found at $NVM_DIR/nvm.sh" 5; fi
nvm use 20 >/dev/null || die "nvm use 20 failed (is Node 20 installed on the box?)" 5
# Resolve pm2 once, now (before any PATH change), and call it by absolute path so
# the restart can't become command-not-found.
PM2_BIN="$(command -v pm2 || true)"
[ -n "$PM2_BIN" ] || die "pm2 not found on PATH" 5

cd "$DEPLOY_DIR" || die "cannot cd to $DEPLOY_DIR" 6

# ── 4. Fetch + require the target SHA to be the CURRENT origin/main tip ───────
git fetch --prune origin "$DEPLOY_BRANCH" || die "git fetch origin $DEPLOY_BRANCH failed" 6
ORIGIN_MAIN="$(git rev-parse "origin/${DEPLOY_BRANCH}")"
if [ "$TARGET_SHA" != "$ORIGIN_MAIN" ]; then
  # Superseded (or arbitrary) SHA: stop WITHOUT rollback — the current tip's own
  # deploy will land it. Never reset the box to a non-tip commit.
  die "target $TARGET_SHA is not the current origin/${DEPLOY_BRANCH} ($ORIGIN_MAIN); superseded — stopping without rollback" 7
fi

# ── 5. Check out EXACTLY the target SHA (never git clean; keep untracked env) ─
# `git reset --hard` only touches tracked files, so untracked .env / .env.local
# (DB creds, CMS_ADMIN_EMAILS) survive. `git clean` is deliberately never run.
export APP_COMMIT_SHA="$TARGET_SHA"
git reset --hard "$TARGET_SHA" || die "git reset --hard $TARGET_SHA failed" 6
log "checked out $TARGET_SHA in $DEPLOY_DIR"

# ── 6. Build. Any failure here aborts before the PM2 restart (set -e). ────────
npm ci || die "npm ci failed" 8
npm run build || die "npm run build failed — NOT restarting $PM2_PROCESS (previous process stays up)" 8

# ── 7. Restart ONLY jvto-help; carry APP_COMMIT_SHA into the running env. ─────
# --update-env so the process reports the new SHA at /api/build-info. No
# `pm2 update`, and no other PM2 process is touched.
"$PM2_BIN" restart "$PM2_PROCESS" --update-env || die "pm2 restart $PM2_PROCESS failed" 9

log "deployed $TARGET_SHA to $DEPLOY_DIR ($PM2_PROCESS restarted with APP_COMMIT_SHA)"
