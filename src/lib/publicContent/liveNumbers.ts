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

  // Per-origin counts. {PACKAGE_COUNT} is the catalogue total, so a sentence on
  // an origin page that says "13 private itineraries" cannot use it — following
  // that advice would publish the wrong number. These are the tokens that fit.
  // Both are derived from the same list, so neither can drift from the total.
  const perOrigin = { PACKAGE_COUNT_BALI: 0, PACKAGE_COUNT_SURABAYA: 0 };
  for (const pkg of packages) {
    const origin = String((pkg as { startDestination?: unknown }).startDestination ?? "")
      .toLowerCase();
    if (origin.includes("bali")) perOrigin.PACKAGE_COUNT_BALI += 1;
    else if (origin.includes("surabaya")) perOrigin.PACKAGE_COUNT_SURABAYA += 1;
  }
  if (perOrigin.PACKAGE_COUNT_BALI) {
    out.PACKAGE_COUNT_BALI = String(perOrigin.PACKAGE_COUNT_BALI);
  }
  if (perOrigin.PACKAGE_COUNT_SURABAYA) {
    out.PACKAGE_COUNT_SURABAYA = String(perOrigin.PACKAGE_COUNT_SURABAYA);
  }

  // Catalogue floor, derived rather than stored. A price written into a
  // sentence is stale the day a cheaper package is published — which is
  // exactly how "From IDR 1.55M" outlived a 1.0M package on this site.
  const floor = Math.min(
    ...packages
      .map((pkg) => Number((pkg as { startFrom?: unknown }).startFrom))
      .filter((price) => Number.isFinite(price) && price > 0),
  );
  if (Number.isFinite(floor) && floor > 0) {
    out.PRICE_FROM = `IDR ${(floor / 1_000_000).toFixed(2).replace(/\.00$/, "")}M/pax`;
  }

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
