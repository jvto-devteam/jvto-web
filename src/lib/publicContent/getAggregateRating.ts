// src/lib/publicContent/getAggregateRating.ts
//
// THE public aggregate rating. There is exactly one figure allowed to be
// presented as "the" JVTO rating: the Google Maps rating and review count
// (owner decision 2026-08-15, recorded in the `_comment` of
// jvto-ekosistem/1-knowledge-and-evidence-core/organization-identity/organization.json).
// A blended cross-platform average is explicitly NOT that figure.
//
// This module invents no data. It only composes the two existing readers:
//   1. getEcosystemReviewProfiles()  — ekosistem's review-platforms.json,
//                                      synced daily from the Google Business
//                                      Profile API by ekosistem's own
//                                      sync-google-rating.yml (2026-08-19) —
//                                      the PRIMARY source, per the
//                                      single-content-source-of-truth
//                                      migration this repo underwent 2026-08.
//   2. getGoogleReviewStats()        — Prisma `review_stats` row, written by
//                                      jvto-web's own (older) sync-google-
//                                      reviews.yml. Kept only as a fallback
//                                      for the window where ekosistem's daily
//                                      sync hasn't run yet or is unreachable;
//                                      not the source of truth.
// When neither source answers, this returns null. Callers (public API + visible
// "4.9 ★" text) display nothing or a fallback. AggregateRating JSON-LD is built by
// the sibling jvto-ekosistem repo's Organization node; this file's role is read-only.
import { cache } from "react";
import { getGoogleReviewStats } from "@/lib/publicContent/getReviewStats";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";

/** The platform whose figure is the public aggregate. Matches `profiles[].platform`. */
export const AGGREGATE_PLATFORM = "Google Maps";

export interface PublicAggregateRating {
  rating: number;
  count: number;
  /** Which source answered — useful when debugging a schema diff. */
  source: "ekosistem" | "review_stats";
}

export const getPublicAggregateRating = cache(
  async (): Promise<PublicAggregateRating | null> => {
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

    const live = await getGoogleReviewStats();
    if (live) {
      return { rating: live.rating, count: live.count, source: "review_stats" };
    }

    return null;
  },
);
