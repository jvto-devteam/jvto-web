import { cache } from "react";
import { prisma } from "@/lib/prisma";
import homeReviewSnapshotsJson from "./generated/homeReviewSnapshots.json";
import {
  canUsePublishedSnapshotDatabaseFallback,
  logPublicContentOnce,
} from "./runtime";
import type {
  PublicReviewItem,
  PublicReviewSnapshotCollection,
} from "./types";

const reviewSnapshots =
  homeReviewSnapshotsJson as PublicReviewSnapshotCollection;

function toReviewItem(review: {
  customer_name?: string | null;
  date: Date;
  url?: string | null;
  url_reference?: string | null;
  star?: number | bigint | null;
  review?: string | null;
}): PublicReviewItem {
  return {
    name: review.customer_name ?? "",
    date: review.date.toISOString(),
    url: review.url || review.url_reference || "",
    stars: Number(review.star ?? 0),
    title: review.review?.substring(0, 60) ?? "",
    text: review.review ?? "",
    verified: true,
  };
}

export function getPublicReviewSnapshotCollection() {
  return reviewSnapshots;
}

export const getPublicHomeReviews = cache(
  async (): Promise<PublicReviewItem[]> => {
    if (reviewSnapshots.items.length > 0) {
      return reviewSnapshots.items;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-home-review-snapshot",
        "error",
        "[publicContent] Missing homepage review snapshot in strict mode.",
      );
      return [];
    }

    try {
      const raw = await prisma.reviews.findMany({
        where: {
          platform: { equals: "Trustpilot" },
        },
        orderBy: { date: "desc" },
      });

      logPublicContentOnce(
        "database-fallback-home-review-snapshot",
        "warn",
        "[publicContent] Using reviews database fallback for homepage. Generate a review snapshot before production cutover.",
      );

      return raw.map(toReviewItem);
    } catch (error) {
      logPublicContentOnce(
        "home-review-snapshot-fallback-error",
        "error",
        `[publicContent] Failed homepage review fallback: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  },
);
