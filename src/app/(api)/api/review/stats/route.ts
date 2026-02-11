// app/api/review/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Hitung TOTAL review per platform (tanpa limit)
    const [google, trustpilot, tripadvisor] = await Promise.all([
      prisma.reviews.count({
        where: {
          platform: "Google",
          package_id: { not: null },
          review: { not: null },
          star: { gte: 1 },
        },
      }),
      prisma.reviews.count({
        where: {
          platform: "Trustpilot",
          package_id: { not: null },
          review: { not: null },
          star: { gte: 1 },
        },
      }),
      prisma.reviews.count({
        where: {
          platform: "TripAdvisor",
          package_id: { not: null },
          review: { not: null },
          star: { gte: 1 },
        },
      }),
    ]);

    // Hitung rating rata-rata dari SEMUA review (opsional)
    const avgRating = await prisma.reviews.aggregate({
      where: {
        platform: { in: ["Google", "Trustpilot", "TripAdvisor"] },
        package_id: { not: null },
        review: { not: null },
        star: { gte: 1 },
      },
      _avg: {
        star: true,
      },
    });

    const total = google + trustpilot + tripadvisor;

    return NextResponse.json(
      {
        success: true,
        total,
        platforms: {
          google,
          trustpilot,
          tripadvisor,
        },
        average_rating: parseFloat(avgRating._avg.star?.toFixed(1) || "4.9"),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
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
