// app/api/review/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil 10 review terbaru dari masing-masing platform
    const platforms = ["Google", "Trustpilot", "TripAdvisor"];

    const reviewsPromises = platforms.map(async (platform) => {
      // AMBIL DULU REVIEW YANG MENTION CREW
      const reviewsWithCrew = await prisma.reviews.findMany({
        where: {
          package_id: { not: null },
          platform: platform,
          star: { gte: 4 },
          crew_reviews: { some: {} },
        },
        include: {
          crew_reviews: {
            include: {
              crew: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  photo_url: true,
                  tags: true,
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
        take: 10,
      });

      // HITUNG BERAPA KURANGNYA
      const remaining = 10 - reviewsWithCrew.length;

      // KALO MASIH KURANG, AMBIL REVIEW TANPA CREW (TAPI MASIH BAGUS)
      let reviewsWithoutCrew: any[] = [];
      if (remaining > 0) {
        reviewsWithoutCrew = await prisma.reviews.findMany({
          where: {
            package_id: { not: null },
            platform: platform,
            star: { gte: 4 },
            crew_reviews: { none: {} }, // TIDAK mention crew
          },
          include: {
            crew_reviews: {
              include: {
                crew: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    photo_url: true,
                    tags: true,
                  },
                },
              },
            },
          },
          orderBy: { date: "desc" },
          take: remaining,
        });
      }

      // GABUNGIN: REVIEW DENGAN CREW DULU, BARU YANG TANPA CREW
      return [...reviewsWithCrew, ...reviewsWithoutCrew];
    });

    const reviewsByPlatform = await Promise.all(reviewsPromises);
    const reviews = reviewsByPlatform.flat();

    // Ambil semua crew members dari tabel crew_members
    const allCrews = await prisma.crew_members.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        photo_url: true,
        tags: true,
        year_of_joining: true,
        full_name: true,
      },
      where: {
        deleted_at: null,
        id: {
          notIn: [9, 56],
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform data reviews
    const transformedReviews = reviews.map((review) => {
      const uniqueCrewMap = new Map();

      review.crew_reviews?.forEach((cr) => {
        if (cr.crew && !uniqueCrewMap.has(cr.crew_id)) {
          uniqueCrewMap.set(cr.crew_id, {
            id: cr.crew.id,
            name: cr.crew.name,
            type: cr.crew.type,
            photo_url: cr.crew.photo_url,
            tags: cr.crew.tags,
          });
        }
      });

      return {
        id: review.id,
        customer_name: review.customer_name,
        platform: review.platform,
        date: review.date,
        star: review.star,
        review: review.review,
        url: review.url || review.url_reference,
        profile_photo: review.profile_photo,
        package_id: review.package_id,
        crews: Array.from(uniqueCrewMap.values()),
        has_internal_crew: uniqueCrewMap.size > 0,
      };
    });

    // Response dengan data reviews DAN semua crew members
    const response = {
      reviews: transformedReviews,
      crews: allCrews.map((crew) => ({
        id: crew.id,
        name: crew.name,
        full_name: crew.full_name,
        type: crew.type,
        photo_url: crew.photo_url,
        tags: crew.tags,
        year_of_joining: crew.year_of_joining,
      })),
    };

    const jsonString = JSON.stringify(response, (key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    });

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err) {
    console.error("JSON Reviews error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate JSON",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
