// src/lib/publicContent/getHomeReviews.ts
// Created 2026-08-15 (Task 4.2 of data-source-consolidation) — replaces reviewSnapshot.ts's
// getPublicHomeReviews() (deleted this task).
//
// Migrated 2026-08-19 (Phase 2 of the Google Reviews migration): review CONTENT now
// lives in jvto-ekosistem's reviews.json, read via ecosystemContent/reviews.ts
// (local-first / HTTP-fallback, same as the rest of ecosystemContent/*.ts) instead
// of Prisma directly. Filtering/sorting/mapping logic below is unchanged —
// reviews.platform === "Trustpilot" ordered by date desc, same field derivation
// (title = first 60 chars of review body, verified always true) as before.
import { cache } from "react";
import { getEcosystemReviews, type PublicReview } from "../ecosystemContent/reviews";
import type { PublicReviewItem } from "./types";

function toReviewItem(review: PublicReview): PublicReviewItem {
  return {
    name: review.customerName ?? "",
    date: new Date(review.date).toISOString(),
    url: review.url || review.urlReference || "",
    stars: Number(review.star ?? 0),
    title: review.review?.substring(0, 60) ?? "",
    text: review.review ?? "",
    verified: true,
  };
}

/** Trustpilot reviews for the tour-PDP review widget, newest first. */
export const getPublicHomeReviews = cache(
  async (): Promise<PublicReviewItem[]> => {
    const raw = await getEcosystemReviews();

    return raw
      .filter((r) => r.platform === "Trustpilot")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(toReviewItem);
  },
);
