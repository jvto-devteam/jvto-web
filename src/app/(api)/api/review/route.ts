import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        package_id: {
          not: null,
        },
        platform: {
          notIn: ["Klook"],
        },
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
      orderBy: {
        date: "desc",
      },
    });

    // Transform data untuk format yang lebih bersih
    const transformedReviews = reviews.map((review) => {
      // Deduplikasi crew berdasarkan crew_id
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
        // Hanya field penting dari crew
        crews: Array.from(uniqueCrewMap.values()),
        // Flag untuk menunjukkan ini internal crew
        has_internal_crew: uniqueCrewMap.size > 0,
      };
    });

    // Custom replacer untuk handle BigInt
    const jsonString = JSON.stringify(transformedReviews, (key, value) => {
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
