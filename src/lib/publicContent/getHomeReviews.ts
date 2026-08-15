// src/lib/publicContent/getHomeReviews.ts
// Created 2026-08-15 (Task 4.2 of data-source-consolidation) — replaces reviewSnapshot.ts's
// getPublicHomeReviews() (deleted this task). DB-only, no fallback: if Prisma is unreachable,
// callers error rather than silently returning stale/empty data.
//
// Same prisma.reviews query + row-mapping reviewSnapshot.ts's own (previously dormant,
// snapshot-first) DB-fallback path already used — reviews.platform === "Trustpilot" ordered by
// date desc. Every field this reads (customer_name, date, url, url_reference, star, review)
// exists verbatim on the `reviews` Prisma model.
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { PublicReviewItem } from "./types";

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

/** Trustpilot reviews for the tour-PDP review widget, newest first. */
export const getPublicHomeReviews = cache(
  async (): Promise<PublicReviewItem[]> => {
    const raw = await prisma.reviews.findMany({
      where: { platform: { equals: "Trustpilot" } },
      orderBy: { date: "desc" },
    });

    return raw.map(toReviewItem);
  },
);
