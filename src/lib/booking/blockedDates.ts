// src/lib/booking/blockedDates.ts
//
// Operational booking closures — dates the checkout form must refuse
// regardless of the underlying package's own availability data. Extracted
// from TourDetail.tsx (production-release hardening, handoff §3.2) so the
// comparison logic is independently testable without rendering the
// component: see scripts/ci/blocked-dates-selftest.ts.
//
// These are OPERATOR decisions (route closures, capacity holds, etc.), not
// derived from any database table -- ownership intentionally not redesigned
// here, per the hardening scope.

export type BlockedRange = { start: string; end: string };

export const BLOCKED_RANGES: BlockedRange[] = [
  { start: "2026-03-16", end: "2026-03-20" },
  { start: "2026-04-05", end: "2026-04-11" },
  { start: "2026-05-01", end: "2026-05-01" },
  { start: "2026-05-30", end: "2026-05-30" },
  { start: "2026-05-02", end: "2026-05-02" },
  { start: "2026-05-29", end: "2026-06-01" },
  // Carried over from `live` (production) during the release-hardening
  // cutover -- these were added directly on live on 2026-08-08 and would
  // have silently re-opened for booking if a plain `main` promote had
  // overwritten this file without porting them first.
  { start: "2026-07-25", end: "2026-07-25" },
  { start: "2026-08-11", end: "2026-08-15" },
];

/** Both `start` and `end` are inclusive. */
export function isDateBlocked(
  dateStr: string | null | undefined,
  ranges: BlockedRange[] = BLOCKED_RANGES,
): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  return ranges.some((range) => {
    const start = new Date(range.start);
    const end = new Date(range.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return target >= start && target <= end;
  });
}
