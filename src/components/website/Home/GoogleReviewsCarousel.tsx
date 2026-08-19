import { cache } from "react";
import { getEcosystemReviews, type PublicReviewPhotos } from "@/lib/ecosystemContent/reviews";
import { GoogleReviewsCarouselClient } from "./GoogleReviewsCarouselClient";
import type {
  PublicReviewApiFeedItem,
  PublicReviewMediaItem,
} from "@/lib/publicContent/types";

// jvto-ekosistem's reviews.json already hands back `photos` as a parsed object
// (not a JSON string column like Prisma's), so this just projects it into
// PublicReviewMediaItem[] instead of JSON.parse-ing anything.
function parseReviewMedia(photos: PublicReviewPhotos | null): PublicReviewMediaItem[] {
  if (!photos || !Array.isArray(photos.items)) return [];

  const mediaItems: PublicReviewMediaItem[] = [];

  photos.items.forEach((media, index) => {
    if (!media || typeof media !== "object") return;

    const thumbnailUrl = media.thumbnailUrl ?? null;
    const videoUrl = media.videoUrl ?? null;

    if (!thumbnailUrl && !videoUrl) return;

    mediaItems.push({
      id: media.id || `review-media-${index + 1}`,
      type: media.type === "video" ? "video" : "photo",
      thumbnailUrl,
      thumbnailLabel: media.thumbnailLabel ?? null,
      videoUrl,
      source: media.source || "Google Business Profile reviewMediaItems",
    });
  });

  return mediaItems;
}

// Reads jvto-ekosistem's reviews.json (Phase 2 of the Google Reviews migration —
// review CONTENT is no longer read from Prisma). That file is kept current daily
// via ekosistem's own sync-google-reviews.yml workflow (server-side, ekosistem repo).
const getLatestGoogleReviews = cache(
  async (): Promise<PublicReviewApiFeedItem[]> => {
    const rows = await getEcosystemReviews();

    return rows
      .filter((r) => r.platform === "Google" && (r.star ?? 0) >= 4)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((r) => ({
        id: r.id.toString(),
        customer_name: r.customerName,
        platform: r.platform,
        date: new Date(r.date).toISOString(),
        star: r.star ?? 5,
        review: r.review,
        url: r.url || r.urlReference || null,
        profile_photo: null,
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
