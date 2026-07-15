import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GBP_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GBP_REVIEWS_BASE = `https://mybusiness.googleapis.com/v4/accounts/${process.env.GBP_ACCOUNT_ID}/locations/${process.env.GBP_LOCATION_ID}/reviews`;

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

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

async function fetchAllReviews(token: string): Promise<GbpReview[]> {
  const all: GbpReview[] = [];
  let pageToken: string | undefined;

  do {
    const url = pageToken
      ? `${GBP_REVIEWS_BASE}?pageToken=${encodeURIComponent(pageToken)}`
      : GBP_REVIEWS_BASE;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      const newToken = await getAccessToken();
      const retry = await fetch(url, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      if (!retry.ok) throw new Error(`GBP API error: ${retry.status}`);
      const data = await retry.json();
      all.push(...(data.reviews ?? []));
      pageToken = data.nextPageToken;
    } else if (!res.ok) {
      throw new Error(`GBP API error: ${res.status}`);
    } else {
      const data = await res.json();
      all.push(...(data.reviews ?? []));
      pageToken = data.nextPageToken;
    }
  } while (pageToken);

  return all;
}

interface GbpReview {
  name: string;
  reviewer: { displayName?: string; profilePhotoUrl?: string };
  starRating: string;
  comment?: string;
  createTime?: string;
}

async function syncReviews(reviews: GbpReview[]) {
  const crews = await prisma.crew_members.findMany({
    where: { deleted_at: null },
    select: { id: true, name: true },
  });

  let newCount = 0;
  let skipCount = 0;

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
      select: { id: true },
    });

    if (existing) {
      // Backfill url_reference for legacy rows that matched by name+date
      if (!existing.id) { skipCount++; continue; }
      await prisma.reviews.update({
        where: { id: existing.id },
        data: { url_reference: r.name },
      });
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
        url_reference: r.name,
      },
    });

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

  return { total_from_api: reviews.length, new_synced: newCount, skipped: skipCount };
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
    const reviews = await fetchAllReviews(token);
    const result = await syncReviews(reviews);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sync-google]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
