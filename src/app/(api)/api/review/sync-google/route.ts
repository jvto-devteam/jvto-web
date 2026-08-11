import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GBP_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GBP_REVIEWS_BASE = `https://mybusiness.googleapis.com/v4/accounts/${process.env.GBP_ACCOUNT_ID}/locations/${process.env.GBP_LOCATION_ID}/reviews`;

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(GBP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: process.env.GBP_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

interface GbpReview {
  name: string;
  reviewer: { displayName?: string; profilePhotoUrl?: string };
  starRating: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReplyUrl?: string;
  reviewMediaItems?: Array<{
    mediaFormat?: "PHOTO" | "VIDEO" | string;
    thumbnailUrl?: string;
    thumbnailLabel?: string;
    videoUrl?: string;
  }>;
}

interface GbpFetchResult {
  reviews: GbpReview[];
  average_rating: number | null;
  total_review_count: number | null;
}

async function fetchAllReviews(token: string): Promise<GbpFetchResult> {
  const all: GbpReview[] = [];
  let averageRating: number | null = null;
  let totalReviewCount: number | null = null;
  let pageToken: string | undefined;

  do {
    const url = pageToken
      ? `${GBP_REVIEWS_BASE}?pageToken=${encodeURIComponent(pageToken)}`
      : GBP_REVIEWS_BASE;

    let activeToken = token;
    let res: Response | null = null;

    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (res.status === 401 && attempt === 0) {
        activeToken = await getAccessToken();
        continue;
      }

      if (res.ok || !RETRYABLE_STATUS.has(res.status) || attempt === 3) {
        break;
      }

      await sleep(500 * 2 ** attempt);
    }

    if (!res) {
      throw new Error("GBP API error: empty response");
    }

    if (!res.ok) {
      throw new Error(`GBP API error: ${res.status}`);
    }

    const data = await res.json();
    all.push(...(data.reviews ?? []));
    pageToken = data.nextPageToken ?? undefined;
    // GBP returns these on every page — keep last seen value
    if (data.averageRating != null) averageRating = data.averageRating;
    if (data.totalReviewCount != null) totalReviewCount = data.totalReviewCount;
  } while (pageToken);

  return { reviews: all, average_rating: averageRating, total_review_count: totalReviewCount };
}

function serializeReviewMedia(review: GbpReview): string | null {
  const media = (review.reviewMediaItems ?? [])
    .map((item, index) => {
      const type = item.mediaFormat === "VIDEO" ? "video" : "photo";
      const thumbnailUrl = item.thumbnailUrl?.trim() || null;
      const videoUrl = item.videoUrl?.trim() || null;

      if (!thumbnailUrl && !videoUrl) return null;

      return {
        id: `${review.name.split("/").pop() ?? "review"}-${index + 1}`,
        type,
        thumbnailUrl,
        thumbnailLabel: item.thumbnailLabel?.trim() || null,
        videoUrl,
        source: "Google Business Profile reviewMediaItems",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (media.length === 0) return null;

  return JSON.stringify({
    source: "Google Business Profile reviewMediaItems",
    syncedAt: new Date().toISOString(),
    count: media.length,
    items: media,
  });
}

async function syncReviews(reviews: GbpReview[]) {
  const crews = await prisma.crew_members.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true },
  });

  let newCount = 0;
  let skipCount = 0;
  let mediaBackfilledCount = 0;
  let mediaUpdatedCount = 0;

  for (const r of reviews) {
    const reviewDate = r.createTime
      ? new Date(r.createTime)
      : new Date();

    // Dedup: prefer url_reference (Google review name), fallback customer_name+date
    const existing = await prisma.reviews.findFirst({
      where: {
        platform: "Google",
        OR: [
          { url_reference: r.name },
          {
            url_reference: null,
            customer_name: r.reviewer.displayName ?? "Anonymous",
            date: new Date(reviewDate.toISOString().split("T")[0]),
          },
        ],
      },
      select: { id: true, photos: true },
    });
    const serializedMedia = serializeReviewMedia(r);

    if (existing) {
      // Backfill url_reference for legacy rows that matched by name+date
      if (!existing.id) { skipCount++; continue; }
      const shouldBackfillMedia =
        serializedMedia &&
        (!existing.photos || existing.photos.trim().length === 0);
      await prisma.reviews.update({
        where: { id: existing.id },
        data: {
          url_reference: r.name,
          url: r.reviewReplyUrl ?? undefined,
          ...(shouldBackfillMedia ? { photos: serializedMedia } : {}),
        },
      });
      if (shouldBackfillMedia) mediaBackfilledCount++;
      skipCount++;
      continue;
    }

    const created = await prisma.reviews.create({
      data: {
        customer_name: r.reviewer.displayName ?? "Anonymous",
        profile_photo: r.reviewer.profilePhotoUrl ?? null,
        platform: "Google",
        date: new Date(reviewDate.toISOString().split("T")[0]),
        star: STAR_MAP[r.starRating] ?? 0,
        review: r.comment ?? "",
        photos: serializedMedia,
        url: r.reviewReplyUrl ?? null,
        url_reference: r.name,
      },
    });
    if (serializedMedia) mediaUpdatedCount++;

    // Crew name matching — word boundary safe
    const text = (r.comment ?? "").toLowerCase();
    for (const crew of crews) {
      const crewLower = crew.name.toLowerCase();
      // Match whole word only to avoid "Sam" in "Samsung"
      const pattern = new RegExp(`\\b${crewLower}\\b`);
      if (pattern.test(text)) {
        await prisma.crew_reviews.create({
          data: { review_id: created.id, crew_id: crew.id },
        });
      }
    }

    newCount++;
  }

  return {
    total_from_api: reviews.length,
    new_synced: newCount,
    skipped: skipCount,
    media_added_for_new_reviews: mediaUpdatedCount,
    media_backfilled_for_existing_reviews: mediaBackfilledCount,
  };
}

export async function POST(req: NextRequest) {
  // Protect with CRON_SECRET — pass as Authorization: Bearer <secret>
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getAccessToken();
    const { reviews, average_rating, total_review_count } = await fetchAllReviews(token);
    const result = await syncReviews(reviews);

    if (average_rating != null && total_review_count != null) {
      await prisma.review_stats.upsert({
        where: { source: "google" },
        update: { rating: average_rating, count: total_review_count, synced_at: new Date() },
        create: { source: "google", rating: average_rating, count: total_review_count },
      });
    }

    return NextResponse.json({ success: true, ...result, average_rating, total_review_count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sync-google]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
