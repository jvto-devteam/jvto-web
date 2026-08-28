// src/lib/publicContent/getAggregateRating.ts
//
// THE public aggregate rating. There is exactly one figure allowed to be
// presented as "the" JVTO rating: the Google Maps rating and review count
// (owner decision 2026-08-15, recorded in the `_comment` of
// jvto-ekosistem/1-knowledge-and-evidence-core/organization-identity/organization.json).
// A blended cross-platform average is explicitly NOT that figure.
//
// This module invents no data. It reads exactly one source:
//   getEcosystemReviewProfiles() — ekosistem's review-platforms.json, synced
//   daily from the Google Business Profile API by ekosistem's own
//   sync-google-rating.yml (2026-08-19), per the single-content-source-of-truth
//   migration this repo underwent 2026-08.
//
// A second reader used to sit behind it: getGoogleReviewStats(), the Prisma
// `review_stats` row written by jvto-web's own older sync-google-reviews.yml.
// Removed 2026-08-28. That workflow lived only on the `main` branch, which was
// deleted the same day, and it had already been failing — its endpoint
// POST /api/review/sync-google returns 404 in production. So the table it fed
// was frozen, and a fallback that serves a frozen number is worse than no
// fallback: it answers with stale data exactly when the live source is down,
// and nothing tells the reader which one they got.
//
// When ekosistem does not answer, this returns null. Callers (public API +
// visible "4.9 ★" text) render nothing. AggregateRating JSON-LD is built by the
// sibling jvto-ekosistem repo's Organization node; this file is read-only.
import { cache } from "react";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";

/** The platform whose figure is the public aggregate. Matches `profiles[].platform`. */
export const AGGREGATE_PLATFORM = "Google Maps";

export interface PublicAggregateRating {
  rating: number;
  count: number;
  /**
   * Which source answered. Only one remains; the field is kept so a schema diff
   * still says where the figure came from, and so a second source can be added
   * back without changing the shape callers already read.
   */
  source: "ekosistem";
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

    return null;
  },
);
