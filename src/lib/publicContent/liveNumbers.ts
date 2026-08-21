// src/lib/publicContent/liveNumbers.ts
//
// Placeholder substitution for figures that change on their own.
//
// Why this exists: review counts and the package count were written as literal
// digits inside prose (`body_md`, claim descriptions) in several ekosistem
// files. Schema had one source of truth; prose had as many as there were
// files. By 2026-08-20 the site was serving "149 reviews" on /why-jvto/reviews,
// "123 reviews" on the Ijen blog guide, and 152 in every JSON-LD node — three
// numbers for one fact, all on the same site, and "All 22 packages are private"
// as the sole supporting evidence for the private-tours claim when the
// catalogue held 17.
//
// A number written as prose cannot be kept in sync, so the prose now carries a
// placeholder and the value is resolved here at render time from the same
// sources the schema reads. verify-jvto/page.tsx already did this for
// {PACKAGE_COUNT}; this generalises that one-off.
import { cache } from "react";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";

export type LiveNumbers = Record<string, string>;

/**
 * Resolved values for every supported placeholder.
 *
 * A placeholder whose source is unavailable is simply absent from the map, and
 * applyLiveNumbers() then leaves the token in place rather than substituting a
 * zero or a guess — a visible `{GOOGLE_REVIEW_COUNT}` is a bug report; a
 * confident "0 reviews" is a lie.
 */
export const getLiveNumbers = cache(async (): Promise<LiveNumbers> => {
  const [aggregate, profiles, packages] = await Promise.all([
    getPublicAggregateRating().catch(() => null),
    getEcosystemReviewProfiles().catch(() => []),
    getEcosystemPackagesList().catch(() => []),
  ]);

  const out: LiveNumbers = {};

  if (aggregate) {
    out.GOOGLE_REVIEW_COUNT = String(aggregate.count);
    out.GOOGLE_RATING = aggregate.rating.toFixed(1);
  }

  for (const profile of profiles) {
    const count = profile.reviewCount;
    const rating = profile.rating;
    if (profile.platform === "Trustpilot") {
      if (typeof count === "number") out.TRUSTPILOT_COUNT = String(count);
      if (typeof rating === "number") out.TRUSTPILOT_RATING = rating.toFixed(1);
    }
    if (profile.platform === "TripAdvisor") {
      if (typeof count === "number") out.TRIPADVISOR_COUNT = String(count);
      if (typeof rating === "number") out.TRIPADVISOR_RATING = rating.toFixed(2);
    }
  }

  if (packages.length) out.PACKAGE_COUNT = String(packages.length);

  // Sum of the per-platform totals actually published. Deliberately derived
  // rather than stored: a stored total drifts the moment one platform moves.
  const totals = [out.TRUSTPILOT_COUNT, out.GOOGLE_REVIEW_COUNT, out.TRIPADVISOR_COUNT]
    .map((v) => (v ? Number(v) : NaN))
    .filter((v) => Number.isFinite(v));
  if (totals.length === 3) {
    out.TOTAL_REVIEW_COUNT = String(totals.reduce((a, b) => a + b, 0));
  }

  return out;
});

/** Replace every `{TOKEN}` present in `numbers`; leave unknown tokens alone. */
export function applyLiveNumbers(text: string, numbers: LiveNumbers): string {
  return text.replace(/\{([A-Z_]+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(numbers, key) ? numbers[key] : match,
  );
}
