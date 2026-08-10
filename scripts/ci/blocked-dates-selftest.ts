/**
 * Blocked-dates self-test (production-release hardening, §3.2). Pure logic,
 * no DB, no server. Proves:
 *   1. both range endpoints are blocked (inclusive-both-ends);
 *   2. the day immediately outside a range is NOT blocked (no off-by-one
 *      over-blocking);
 *   3. the two ranges carried over from `live` during the release cutover
 *      (2026-07-25 and 2026-08-11..15, the exact dates the handoff names)
 *      are present and correctly inclusive at both ends;
 *   4. a pre-existing range untouched by the port still works.
 */
import { BLOCKED_RANGES, isDateBlocked } from "../../src/lib/booking/blockedDates";

let fail = 0;
const ok = (cond: boolean, msg: string) => {
  if (cond) console.log(`  ok    ${msg}`);
  else {
    console.log(`  FAIL  ${msg}`);
    fail++;
  }
};

// 1 + 3. The two live-only ranges this release must not lose.
ok(isDateBlocked("2026-08-11"), "2026-08-11 (range start) is blocked");
ok(isDateBlocked("2026-08-15"), "2026-08-15 (range end, inclusive) is blocked");
ok(isDateBlocked("2026-08-13"), "2026-08-13 (mid-range) is blocked");
ok(!isDateBlocked("2026-08-10"), "2026-08-10 (day before the range) is NOT blocked");
ok(!isDateBlocked("2026-08-16"), "2026-08-16 (day after the range) is NOT blocked");

ok(isDateBlocked("2026-07-25"), "2026-07-25 (single-day range, start==end) is blocked");
ok(!isDateBlocked("2026-07-24"), "2026-07-24 is NOT blocked");
ok(!isDateBlocked("2026-07-26"), "2026-07-26 is NOT blocked");

// 4. A pre-existing (pre-cutover) range still works -- the port did not
// clobber anything that was already there.
ok(isDateBlocked("2026-05-29"), "pre-existing range start (2026-05-29) still blocked");
ok(isDateBlocked("2026-06-01"), "pre-existing range end (2026-06-01) still blocked");
ok(!isDateBlocked("2026-06-02"), "2026-06-02 (just after a pre-existing range) NOT blocked");

// 2. Generic inclusive-boundary proof against every configured range.
for (const r of BLOCKED_RANGES) {
  ok(isDateBlocked(r.start), `range [${r.start}..${r.end}]: start date itself is blocked`);
  ok(isDateBlocked(r.end), `range [${r.start}..${r.end}]: end date itself is blocked`);
}

ok(!isDateBlocked(""), "empty string is not blocked (guards the form's initial empty state)");
ok(!isDateBlocked(null), "null is not blocked");

console.log(fail === 0 ? "\n[blocked-dates-selftest] PASS" : `\n[blocked-dates-selftest] FAIL — ${fail} assertion(s)`);
process.exit(fail === 0 ? 0 : 1);
