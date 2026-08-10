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
# `git clean`-never rule, same set +u/-u bracket around the nvm load. The one
# behavioral difference this script adds beyond help's is the handoff's
# explicit production upgrade (release-hardening §3.6):
#
#   - the build happens in its OWN release directory
#     ($DEPLOY_DIR/releases/<sha>, a `git worktree` off the same repo — NOT
#     over the currently running release), so a build failure never touches
#     the live process;
#   - the switch to a new release is an atomic symlink flip
#     ($DEPLOY_DIR/current -> releases/<sha>), and PM2 is restarted only
#     AFTER that flip;
#   - after restart, this script runs the SAME post-deploy smoke script the
#     CI workflow runs (scripts/smoke-why-jvto.mjs, from the release being
#     verified) with REQUIRE_INDEXABLE=true against the public production
#     origin. If that smoke fails, this script automatically flips `current`
#     back to the immediately previous release, restarts PM2 again, and
#     exits non-zero — so a bad production deploy self-heals instead of
#     leaving a broken build live;
#   - old release directories are pruned to a bounded count
#     ($KEEP_RELEASES) AFTER a verified-good deploy only, so there is always
#     at least one prior known-good release on disk to roll back to.
#
# First-run note (documented for the Phase 4 owner checkpoint, not decided
# silently): if PM2 process `jvto-web` does not exist yet, this script
# creates it itself with cwd=$DEPLOY_DIR/current (the symlink this script
# manages) via `npm start` (next start), honoring PORT from the release's
# .env.local if set. If a `jvto-web` PM2 process ALREADY exists from a prior,
# different setup, this script only restarts it — it does NOT try to detect
# or repair a mismatched cwd (that check is not reliably parseable across pm2
# versions). Before the first deploy through this script, either let it
# create the process fresh (`pm2 delete jvto-web` first, if one already
# exists with a different cwd), or confirm the existing one already has
# cwd=$DEPLOY_DIR/current.
#
# It intentionally hard-codes the deploy dir, branch, and PM2 process; nothing
# about the target is configurable from the caller.

set -euo pipefail

readonly DEPLOY_DIR="/var/www/jvto-web"
readonly DEPLOY_BRANCH="live"
readonly PM2_PROCESS="jvto-web"
readonly LOCK_FILE="/var/lock/jvto-web-deploy.lock"
readonly NVM_DIR="/root/.nvm"
readonly RELEASES_DIR="$DEPLOY_DIR/releases"
readonly CURRENT_LINK="$DEPLOY_DIR/current"
readonly ENV_FILE="$DEPLOY_DIR/.env.local"
readonly PROD_BASE_URL="https://javavolcano-touroperator.com"
readonly KEEP_RELEASES=5

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

mkdir -p "$RELEASES_DIR"
# Keep a stray `git status` in $DEPLOY_DIR quiet about our own release dirs.
git rev-parse --is-inside-work-tree >/dev/null 2>&1 && {
  EXCLUDE_FILE="$(git rev-parse --git-dir)/info/exclude"
  grep -qxF '/releases/' "$EXCLUDE_FILE" 2>/dev/null || printf '/releases/\n/current\n' >>"$EXCLUDE_FILE"
}

RELEASE_DIR="$RELEASES_DIR/$TARGET_SHA"

# ── 6. Build in a FRESH release worktree — never over the running release. ───
# A re-run against the same (still-tip) SHA rebuilds cleanly: drop any partial
# worktree from an earlier failed attempt first.
if [ -e "$RELEASE_DIR" ]; then
  git worktree remove --force "$RELEASE_DIR" 2>/dev/null || rm -rf "$RELEASE_DIR"
fi
git worktree add --force --detach "$RELEASE_DIR" "$TARGET_SHA" \
  || die "git worktree add $RELEASE_DIR @ $TARGET_SHA failed" 6
export APP_COMMIT_SHA="$TARGET_SHA"
log "checked out $TARGET_SHA into fresh release dir $RELEASE_DIR"

# .env.local is never copied or invented per-release — every release symlinks
# the one, stable, untracked production env file.
ln -sf "$ENV_FILE" "$RELEASE_DIR/.env.local"

build_failed() {
  git worktree remove --force "$RELEASE_DIR" 2>/dev/null || true
  die "$1 — NOT switching \$current (running release stays up)" 8
}

( cd "$RELEASE_DIR" && npm ci ) || build_failed "npm ci failed"
( cd "$RELEASE_DIR" && npx prisma generate ) || build_failed "npx prisma generate failed"
( cd "$RELEASE_DIR" && npm run build ) || build_failed "npm run build failed"

# ── 7. Atomic switch: flip $current to the new release. ──────────────────────
PREVIOUS_RELEASE=""
if [ -L "$CURRENT_LINK" ]; then
  PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK" || true)"
fi
TMP_LINK="$DEPLOY_DIR/.current.tmp.$$"
ln -sfn "$RELEASE_DIR" "$TMP_LINK"
mv -T "$TMP_LINK" "$CURRENT_LINK"
log "switched \$current -> $RELEASE_DIR (previous: ${PREVIOUS_RELEASE:-<none, first deploy>})"

# ── 8. Restart (or first-run bootstrap) ONLY jvto-web. ───────────────────────
if "$PM2_BIN" describe "$PM2_PROCESS" >/dev/null 2>&1; then
  "$PM2_BIN" restart "$PM2_PROCESS" --update-env || die "pm2 restart $PM2_PROCESS failed" 9
else
  log "$PM2_PROCESS has no existing pm2 process — bootstrapping it now (cwd=$CURRENT_LINK)"
  ( cd "$CURRENT_LINK" && "$PM2_BIN" start npm --name "$PM2_PROCESS" --cwd "$CURRENT_LINK" --update-env -- start ) \
    || die "pm2 start $PM2_PROCESS (first-run bootstrap) failed" 9
fi

# ── 9. Post-switch proof: PM2 online + the real production smoke script. ─────
# Reuses the SAME script the CI workflow itself runs afterward — single
# source of truth for what "verified" means — but run HERE, as root, so a
# failure can actually trigger the rollback below (the CI step that follows
# has no privileged access to do that).
rollback() {
  local reason="$1"
  log "post-switch verification FAILED ($reason)"
  if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ]; then
    log "rolling back \$current -> $PREVIOUS_RELEASE"
    TMP_LINK="$DEPLOY_DIR/.current.tmp.$$"
    ln -sfn "$PREVIOUS_RELEASE" "$TMP_LINK"
    mv -T "$TMP_LINK" "$CURRENT_LINK"
    "$PM2_BIN" restart "$PM2_PROCESS" --update-env || log "WARNING: pm2 restart during rollback also failed — manual intervention required"
    die "deployed $TARGET_SHA failed verification ($reason); rolled back to $PREVIOUS_RELEASE" 10
  else
    die "deployed $TARGET_SHA failed verification ($reason); NO previous release to roll back to (first deploy) — production is left on the failing build, investigate immediately" 11
  fi
}

sleep 3
if ! "$PM2_BIN" describe "$PM2_PROCESS" 2>/dev/null | grep -qE 'status[^│|]*[│|][^│|]*online'; then
  rollback "pm2 status is not online"
fi

if ! BASE_URL="$PROD_BASE_URL" EXPECTED_SHA="$TARGET_SHA" REQUIRE_INDEXABLE="true" \
    node "$RELEASE_DIR/scripts/smoke-why-jvto.mjs"; then
  rollback "scripts/smoke-why-jvto.mjs failed"
fi

log "post-switch verification PASSED — $TARGET_SHA is live and confirmed"

# ── 10. Prune old releases (verified-good deploy only) — bounded retention. ──
# Never prunes the release we just switched to. Keeps the newest
# $KEEP_RELEASES release dirs (by directory mtime, i.e. deploy order); older
# ones are removed as git worktrees (not bare rm -rf) so git's own
# .git/worktrees metadata never goes stale.
mapfile -t OLD_RELEASES < <(
  find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' 2>/dev/null \
    | sort -rn | tail -n +$((KEEP_RELEASES + 1)) | cut -d' ' -f2-
)
for old in "${OLD_RELEASES[@]:-}"; do
  [ -n "$old" ] || continue
  [ "$old" = "$RELEASE_DIR" ] && continue
  log "pruning old release $old"
  git worktree remove --force "$old" 2>/dev/null || rm -rf "$old"
done

log "deployed $TARGET_SHA to $DEPLOY_DIR ($PM2_PROCESS restarted with APP_COMMIT_SHA, verified live)"
