// src/lib/publicContent/getAggregateRating.ts
//
// THE public aggregate rating. There is exactly one figure allowed to be
// presented as "the" JVTO rating: the Google Maps rating and review count
// (owner decision 2026-08-15, recorded in the `_comment` of
// jvto-ekosistem/1-knowledge-and-evidence-core/organization-identity/organization.json).
// A blended cross-platform average is explicitly NOT that figure.
//
// This module invents no data. It only composes the two existing readers:
//   1. getGoogleReviewStats()        — Prisma `review_stats` row, source "google" (live).
//   2. getEcosystemReviewProfiles()  — the ekosistem review-platforms.json record,
//                                      which declares itself the single source of
//                                      truth for the public platform totals.
// The ekosistem "Google Maps" profile is the fallback when the DB is unreachable,
// so a stale hand-copied constant is never needed. When neither source answers,
// this returns null and callers omit the AggregateRating node entirely rather
// than emit a number nobody can vouch for.
import { cache } from "react";
import { getGoogleReviewStats } from "@/lib/publicContent/getReviewStats";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";

/** The platform whose figure is the public aggregate. Matches `profiles[].platform`. */
export const AGGREGATE_PLATFORM = "Google Maps";

/** Star-scale bounds. Not review data — the schema.org rating scale itself. */
export const BEST_RATING = 5;
export const WORST_RATING = 1;

export interface PublicAggregateRating {
  rating: number;
  count: number;
  /** Which source answered — useful when debugging a schema diff. */
  source: "review_stats" | "ekosistem";
}

export const getPublicAggregateRating = cache(
  async (): Promise<PublicAggregateRating | null> => {
    const live = await getGoogleReviewStats();
    if (live) {
      return { rating: live.rating, count: live.count, source: "review_stats" };
    }

    const profiles = await getEcosystemReviewProfiles();
    const google = profiles.find((p) => p.platform === AGGREGATE_PLATFORM);
    if (
      google &&
      typeof google.rating === "number" &&
      typeof google.reviewCount === "number"
    ) {
      return {
        rating: google.rating,
        count: google.reviewCount,
        source: "ekosistem",
      };
    }

    return null;
  },
);
