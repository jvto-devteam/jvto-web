import { NextResponse } from "next/server";
import { getPublicReviewStatsWithFallback } from "@/lib/publicContent/reviewApiSnapshot";

export async function GET() {
  try {
    const stats = await getPublicReviewStatsWithFallback();

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("Review stats error:", err);
    return NextResponse.json(
      {
        success: false,
        total: 0,
        platforms: { google: 0, trustpilot: 0, tripadvisor: 0 },
        average_rating: 0,
      },
      { status: 500 },
    );
  }
}
