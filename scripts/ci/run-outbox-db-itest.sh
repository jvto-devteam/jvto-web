#!/usr/bin/env bash
#
# run-outbox-db-itest.sh — spin up a DISPOSABLE Postgres, apply the additive outbox
# migration, run the Prisma-backed outbox DB integration test, then tear it all down.
#
# The database is a throwaway cluster in a temp dir; nothing here touches the project's
# configured database or production/live. Postgres refuses to run as root, so the cluster
# runs as the `postgres` OS user via runuser; the test client connects over TCP (trust).
#
# Usage:  scripts/ci/run-outbox-db-itest.sh
# Requires: a local postgres server build (initdb/pg_ctl/psql) + npx tsx.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIGRATION="$REPO/sql/2026-08-05_domain_outbox.sql"
PORT="${OUTBOX_ITEST_PORT:-55432}"
DB="outbox_itest"

# Locate a postgres server build (initdb lives in .../bin, not always on PATH).
PGBIN=""
for c in "$(pg_config --bindir 2>/dev/null || true)" /usr/lib/postgresql/*/bin; do
  if [ -n "$c" ] && [ -x "$c/initdb" ] && [ -x "$c/pg_ctl" ]; then PGBIN="$c"; break; fi
done
if [ -z "$PGBIN" ]; then
  echo "SKIP: no local Postgres server build (initdb/pg_ctl) found — DB itest needs one." >&2
  exit 2
fi
echo "[db-itest] using postgres bin: $PGBIN"

PGDATA="$(mktemp -d /tmp/outbox-itest-pg.XXXXXX)"
LOG="$PGDATA/server.log"

cleanup() {
  set +e
  if [ -n "${PGDATA:-}" ] && [ -f "$PGDATA/postmaster.pid" ]; then
    runuser -u postgres -- "$PGBIN/pg_ctl" -D "$PGDATA" -m immediate stop >/dev/null 2>&1
  fi
  [ -n "${PGDATA:-}" ] && rm -rf "$PGDATA"
}
trap cleanup EXIT

# The cluster dir must be owned by the postgres user (initdb/pg_ctl run as postgres).
chown -R postgres:postgres "$PGDATA"

echo "[db-itest] initdb (trust auth) …"
runuser -u postgres -- "$PGBIN/initdb" -D "$PGDATA" -A trust -U postgres >/dev/null

echo "[db-itest] start postgres on 127.0.0.1:$PORT …"
runuser -u postgres -- "$PGBIN/pg_ctl" -D "$PGDATA" -w -l "$LOG" \
  -o "-p $PORT -k $PGDATA -c listen_addresses=127.0.0.1" start

# Wait until it accepts connections.
for _ in $(seq 1 30); do
  if runuser -u postgres -- "$PGBIN/pg_isready" -h 127.0.0.1 -p "$PORT" -U postgres >/dev/null 2>&1; then break; fi
  sleep 0.5
done

echo "[db-itest] createdb $DB + apply additive migration …"
runuser -u postgres -- "$PGBIN/createdb" -h 127.0.0.1 -p "$PORT" -U postgres "$DB"
runuser -u postgres -- "$PGBIN/psql" -h 127.0.0.1 -p "$PORT" -U postgres -d "$DB" \
  -v ON_ERROR_STOP=1 -f "$MIGRATION" >/dev/null

echo "[db-itest] run integration test …"
set +e
DATABASE_URL="postgresql://postgres@127.0.0.1:$PORT/$DB?connection_limit=8" \
  npx tsx "$REPO/scripts/ci/outbox-db-itest.ts"
RC=$?
set -e

echo "[db-itest] postgres log tail (last 5 lines):"
tail -n 5 "$LOG" 2>/dev/null || true
exit $RC
