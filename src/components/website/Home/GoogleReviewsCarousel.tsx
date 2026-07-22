import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { GoogleReviewsCarouselClient } from "./GoogleReviewsCarouselClient";
import type { PublicReviewApiFeedItem } from "@/lib/publicContent/types";

// Query DB directly so we always show the latest Google reviews
// (the static snapshot is regenerated infrequently; the DB is synced daily
// via sync-google-reviews.yml → POST /api/review/sync-google)
const getLatestGoogleReviews = cache(async (): Promise<PublicReviewApiFeedItem[]> => {
  const rows = await prisma.reviews.findMany({
    where: { platform: "Google", star: { gte: 4 } },
    orderBy: { date: "desc" },
    take: 10,
    select: {
      id: true,
      customer_name: true,
      platform: true,
      date: true,
      star: true,
      review: true,
      url: true,
      url_reference: true,
      profile_photo: true,
    },
  });

  return rows.map((r) => ({
    id: r.id.toString(),
    customer_name: r.customer_name,
    platform: r.platform,
    date: r.date.toISOString(),
    star: r.star ?? 5,
    review: r.review,
    url: r.url || r.url_reference || null,
    profile_photo: r.profile_photo,
    package_id: null,
    crews: [],
    has_internal_crew: false,
  }));
});

export async function GoogleReviewsCarousel() {
  const reviews = await getLatestGoogleReviews();
  if (reviews.length === 0) return null;
  return <GoogleReviewsCarouselClient reviews={reviews} />;
}
