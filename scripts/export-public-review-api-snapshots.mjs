import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../src/generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const OUTPUT_PATH = path.join(
  repoRoot,
  "src/lib/publicContent/generated/reviewApiSnapshots.json",
);

const prisma = new PrismaClient();

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function toId(value) {
  if (value == null) return null;
  return typeof value === "bigint" ? value.toString() : String(value);
}

try {
  const feedReviews = await prisma.reviews.findMany({
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

  const feed = feedReviews.map((review) => {
    const uniqueCrewMap = new Map();

    review.crew_reviews?.forEach((crewReview) => {
      if (crewReview.crew) {
        const crewId = toId(crewReview.crew_id);
        if (!uniqueCrewMap.has(crewId)) {
          uniqueCrewMap.set(crewId, {
            id: toId(crewReview.crew.id),
            name: crewReview.crew.name,
            type: crewReview.crew.type,
            photo_url: crewReview.crew.photo_url,
            tags: crewReview.crew.tags ?? null,
          });
        }
      }
    });

    return {
      id: toId(review.id),
      customer_name: review.customer_name,
      platform: review.platform,
      date: review.date.toISOString(),
      star: Number(review.star ?? 0),
      review: review.review,
      url: review.url || review.url_reference || "",
      profile_photo: review.profile_photo,
      package_id: toId(review.package_id),
      crews: Array.from(uniqueCrewMap.values()),
      has_internal_crew: uniqueCrewMap.size > 0,
    };
  });

  const platforms = ["Google", "Trustpilot", "TripAdvisor"];
  const previewGroups = await Promise.all(
    platforms.map(async (platform) => {
      const reviewsWithCrew = await prisma.reviews.findMany({
        where: {
          platform,
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

      const remaining = 10 - reviewsWithCrew.length;
      let reviewsWithoutCrew = [];

      if (remaining > 0) {
        reviewsWithoutCrew = await prisma.reviews.findMany({
          where: {
            platform,
            star: { gte: 4 },
            crew_reviews: { none: {} },
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

      return [...reviewsWithCrew, ...reviewsWithoutCrew];
    }),
  );

  const previewReviews = previewGroups.flat().map((review) => {
    const uniqueCrewMap = new Map();

    review.crew_reviews?.forEach((crewReview) => {
      if (crewReview.crew) {
        const crewId = toId(crewReview.crew_id);
        if (!uniqueCrewMap.has(crewId)) {
          uniqueCrewMap.set(crewId, {
            id: toId(crewReview.crew.id),
            name: crewReview.crew.name,
            type: crewReview.crew.type,
            photo_url: crewReview.crew.photo_url,
            tags: crewReview.crew.tags ?? null,
          });
        }
      }
    });

    return {
      id: toId(review.id),
      customer_name: review.customer_name,
      platform: review.platform,
      date: review.date.toISOString(),
      star: Number(review.star ?? 0),
      review: review.review,
      url: review.url || review.url_reference || "",
      profile_photo: review.profile_photo,
      package_id: toId(review.package_id),
      crews: Array.from(uniqueCrewMap.values()),
      has_internal_crew: uniqueCrewMap.size > 0,
    };
  });

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

  const [google, trustpilot, tripadvisor] = await Promise.all([
    prisma.reviews.count({
      where: { platform: "Google", star: { gte: 1 } },
    }),
    prisma.reviews.count({
      where: { platform: "Trustpilot", star: { gte: 1 } },
    }),
    prisma.reviews.count({
      where: { platform: "TripAdvisor", star: { gte: 1 } },
    }),
  ]);

  const avgRating = await prisma.reviews.aggregate({
    where: {
      platform: { in: ["Google", "Trustpilot", "TripAdvisor"] },
      star: { gte: 1 },
    },
    _avg: {
      star: true,
    },
  });

  const xmlReviews = await prisma.reviews.findMany({
    where: {
      package_id: {
        not: null,
      },
    },
    include: {
      package: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  writeJson(OUTPUT_PATH, {
    generatedAt: new Date().toISOString(),
    feed,
    preview: {
      reviews: previewReviews,
      crews: allCrews.map((crew) => ({
        id: toId(crew.id),
        name: crew.name,
        full_name: crew.full_name,
        type: crew.type,
        photo_url: crew.photo_url,
        tags: crew.tags ?? null,
        year_of_joining:
          crew.year_of_joining != null ? Number(crew.year_of_joining) : null,
      })),
    },
    stats: {
      success: true,
      total: google + trustpilot + tripadvisor,
      platforms: {
        google,
        trustpilot,
        tripadvisor,
      },
      average_rating: parseFloat(avgRating._avg.star?.toFixed(1) || "4.9"),
    },
    xmlItems: xmlReviews.map((review) => ({
      id: toId(review.id),
      customer_name: review.customer_name,
      date: review.date.toISOString(),
      review: review.review,
      star: Number(review.star ?? 5),
      package: review.package
        ? {
            code: review.package.code,
            name: review.package.name,
            slug: review.package.slug,
          }
        : null,
    })),
  });

  console.log(`Wrote review API snapshot to ${OUTPUT_PATH}`);
} finally {
  await prisma.$disconnect();
}
