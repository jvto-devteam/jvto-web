// Google review-media carousel — server component (production-release
// hardening, §3.1). Ported from `live` (commit 545fdead). Reads the SAME
// `reviews` table src/lib/jvtoReviews.ts's canonical aggregate already uses;
// this component adds no second review-data source, just a media-rich view
// of the platform="Google" rows /api/review/sync-google keeps fresh.
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { GoogleReviewsCarouselClient } from "./GoogleReviewsCarouselClient";
import type {
  PublicReviewApiFeedItem,
  PublicReviewMediaItem,
} from "@/lib/publicContent/types";

/** Only accept https:// URLs already stored in `reviews.photos` -- the sync
 * route validates on write, this validates again on read so a direct DB edit
 * or a future writer cannot smuggle an unsafe URL into the rendered page. */
function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? v : null;
  } catch {
    return null;
  }
}

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

    return items
      .map((item, index): PublicReviewMediaItem | null => {
        if (!item || typeof item !== "object") return null;
        const media = item as Record<string, unknown>;
        const thumbnailUrl = safeHttpsUrl(media.thumbnailUrl) ?? safeHttpsUrl(media.url);
        const videoUrl = safeHttpsUrl(media.videoUrl);

        if (!thumbnailUrl && !videoUrl) return null;

        return {
          id: typeof media.id === "string" ? media.id : `review-media-${index + 1}`,
          type: media.type === "video" ? "video" : "photo",
          thumbnailUrl,
          thumbnailLabel:
            typeof media.thumbnailLabel === "string" ? media.thumbnailLabel : null,
          videoUrl,
          source:
            typeof media.source === "string"
              ? media.source
              : "Google Business Profile reviewMediaItems",
        };
      })
      .filter((item): item is PublicReviewMediaItem => item !== null);
  } catch {
    return [];
  }
}

// Query DB directly so we always show the latest Google reviews (the DB is
// synced daily via sync-google-reviews.yml -> POST /api/review/sync-google).
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
    url: safeHttpsUrl(r.url) ?? safeHttpsUrl(r.url_reference),
    profile_photo: safeHttpsUrl(r.profile_photo),
    review_media: parseReviewMedia(r.photos),
    package_id: null,
    crews: [],
    has_internal_crew: false,
  }));
});

/** Renders nothing (no empty section, no empty heading) when there are no
 * qualifying reviews yet -- a graceful empty state, not a broken one. */
export async function GoogleReviewsCarousel() {
  const reviews = await getLatestGoogleReviews();
  if (reviews.length === 0) return null;
  return <GoogleReviewsCarouselClient reviews={reviews} />;
}
