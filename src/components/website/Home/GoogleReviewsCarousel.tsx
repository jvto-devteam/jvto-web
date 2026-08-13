import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { GoogleReviewsCarouselClient } from "./GoogleReviewsCarouselClient";
import type {
  PublicReviewApiFeedItem,
  PublicReviewMediaItem,
} from "@/lib/publicContent/types";

function parseReviewMedia(photos: string | null): PublicReviewMediaItem[] {
  if (!photos) return [];

  try {
    const parsed = JSON.parse(photos) as unknown;
    if (!parsed || typeof parsed !== "object") return [];

    const items = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { items?: unknown }).items)
        ? (parsed as { items: unknown[] }).items
        : [];

    const mediaItems: PublicReviewMediaItem[] = [];

    items.forEach((item, index) => {
      if (!item || typeof item !== "object") return;

      const media = item as Record<string, unknown>;
      const thumbnailUrl =
        typeof media.thumbnailUrl === "string"
          ? media.thumbnailUrl
          : typeof media.url === "string"
            ? media.url
            : null;
      const videoUrl =
        typeof media.videoUrl === "string" ? media.videoUrl : null;

      if (!thumbnailUrl && !videoUrl) return;

      mediaItems.push({
        id:
          typeof media.id === "string" ? media.id : `review-media-${index + 1}`,
        type: media.type === "video" ? "video" : "photo",
        thumbnailUrl,
        thumbnailLabel:
          typeof media.thumbnailLabel === "string"
            ? media.thumbnailLabel
            : null,
        videoUrl,
        source:
          typeof media.source === "string"
            ? media.source
            : "Google Business Profile reviewMediaItems",
      });
    });

    return mediaItems;
  } catch {
    return [];
  }
}

// Query DB directly so we always show the latest Google reviews
// (the static snapshot is regenerated infrequently; the DB is synced daily
// via sync-google-reviews.yml → POST /api/review/sync-google)
const getLatestGoogleReviews = cache(
  async (): Promise<PublicReviewApiFeedItem[]> => {
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
        photos: true,
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
      review_media: parseReviewMedia(r.photos),
      package_id: null,
      crews: [],
      has_internal_crew: false,
    }));
  },
);

export async function GoogleReviewsCarousel() {
  const reviews = await getLatestGoogleReviews();
  if (reviews.length === 0) return null;
  return <GoogleReviewsCarouselClient reviews={reviews} />;
}
