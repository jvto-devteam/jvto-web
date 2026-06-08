#!/usr/bin/env bash
#
# build-pr.sh — Develop-server PR build gate (verification only).
#
# Invoked over SSH by .github/workflows/ci.yml (build-develop job) as:
#     bash build-pr.sh <PR_NUMBER> <COMMIT_SHA>
#
# Builds the EXACT PR head commit against the DEV database, in an isolated,
# throwaway directory. It NEVER touches the production/live folder, NEVER uses
# the live DB, and NEVER reloads/redeploys production. Production deploy stays
# owned by deploy.yml (push -> main).
#
# ── Server setup (one-time, by the owner) ───────────────────────────────────
#   • Install this script as the trusted control copy, tracking `main`, e.g.:
#         git clone <repo> ~/jvto-build-control && cd ~/jvto-build-control
#         git config remote.origin.fetch '+refs/heads/main:refs/remotes/origin/main'
#     (refresh with `git fetch && git checkout origin/main -- scripts/build-pr.sh`)
#   • Provide a dev env file at  ~/jvto-develop/.env.develop  (dev DATABASE_URL).
#   • Provide an llm-wiki checkout (master) at  ~/llm-wiki  (for the sync steps).
#   • Add CI secrets: DEVELOP_SSH_HOST, DEVELOP_SSH_USER, DEVELOP_SSH_KEY.
#
# Overridable via env (sane defaults below):
#   BUILD_PR_REPO_URL, BUILD_PR_ROOT, BUILD_PR_ENV_FILE, LLM_WIKI_PATH
#
# Security: runs without `set -x`; never prints the env file or secrets.

set -euo pipefail

PR_NUMBER="${1:?usage: build-pr.sh <PR_NUMBER> <COMMIT_SHA>}"
COMMIT_SHA="${2:?usage: build-pr.sh <PR_NUMBER> <COMMIT_SHA>}"

REPO_URL="${BUILD_PR_REPO_URL:-git@github.com:jvto-devteam/jvto-web.git}"
BUILD_ROOT="${BUILD_PR_ROOT:-$HOME/jvto-pr-builds}"
ENV_DEVELOP="${BUILD_PR_ENV_FILE:-$HOME/jvto-develop/.env.develop}"
LLM_WIKI_PATH="${LLM_WIKI_PATH:-$HOME/llm-wiki}"
export LLM_WIKI_PATH

log() { echo "[build-pr] $*"; }

# ── Input validation (no arbitrary refs / paths) ────────────────────────────
[[ "$PR_NUMBER" =~ ^[0-9]+$ ]]      || { echo "[build-pr] invalid PR number" >&2; exit 2; }
[[ "$COMMIT_SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "[build-pr] invalid commit SHA (need full 40-hex)" >&2; exit 2; }

# ── Refuse to run anywhere near production ───────────────────────────────────
case "$BUILD_ROOT" in
  *prod*|*production*|*live*|/var/www/jvto-help*)
    echo "[build-pr] REFUSING: build root looks like production: $BUILD_ROOT" >&2; exit 2;;
esac

[[ -f "$ENV_DEVELOP" ]]      || { echo "[build-pr] dev env file not found: $ENV_DEVELOP" >&2; exit 2; }
[[ -d "$LLM_WIKI_PATH" ]]    || { echo "[build-pr] llm-wiki checkout not found: $LLM_WIKI_PATH" >&2; exit 2; }

WORKDIR="$BUILD_ROOT/pr-${PR_NUMBER}-${COMMIT_SHA}"
cleanup() { cd "$HOME" 2>/dev/null || true; rm -rf "$WORKDIR"; }
trap cleanup EXIT
log "isolated build dir: $WORKDIR"
rm -rf "$WORKDIR"; mkdir -p "$WORKDIR"

# ── Fetch the EXACT commit via the PR ref, then assert it matches ────────────
git clone --quiet --no-checkout "$REPO_URL" "$WORKDIR"
cd "$WORKDIR"
git fetch --quiet origin "refs/pull/${PR_NUMBER}/head"
git checkout --quiet --detach FETCH_HEAD
ACTUAL_SHA="$(git rev-parse HEAD)"
if [[ "$ACTUAL_SHA" != "$COMMIT_SHA" ]]; then
  echo "[build-pr] PR #$PR_NUMBER head ($ACTUAL_SHA) != expected SHA ($COMMIT_SHA) — aborting (PR moved)" >&2
  exit 2
fi
log "building PR #$PR_NUMBER at $COMMIT_SHA"

# ── Dev env (never printed) ──────────────────────────────────────────────────
cp "$ENV_DEVELOP" "$WORKDIR/.env.local"
chmod 600 "$WORKDIR/.env.local"

# ── Build (any failure exits non-zero -> SSH step fails -> PR check red) ──────
npm ci
npx prisma generate
npm run sync:packages
npm run sync:trust
npm run build

log "BUILD OK — PR #$PR_NUMBER @ $COMMIT_SHA (dev DB, isolated, no production touch)"
