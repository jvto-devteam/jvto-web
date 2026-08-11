import { cache } from "react";
import { prisma } from "@/lib/prisma";
import reviewApiSnapshotsJson from "./generated/reviewApiSnapshots.json";
import {
  canUsePublishedSnapshotDatabaseFallback,
  logPublicContentOnce,
} from "./runtime";
import type {
  PublicReviewApiCrewItem,
  PublicReviewApiFeedItem,
  PublicReviewApiSnapshotCollection,
  PublicReviewApiStats,
  PublicReviewXmlItem,
} from "./types";

const reviewApiSnapshots =
  reviewApiSnapshotsJson as unknown as PublicReviewApiSnapshotCollection;

function serializeBigInt(value: unknown) {
  return JSON.parse(
    JSON.stringify(value, (_, currentValue) =>
      typeof currentValue === "bigint"
        ? currentValue.toString()
        : currentValue instanceof Date
          ? currentValue.toISOString()
          : currentValue,
    ),
  );
}

async function getReviewFeedFromDatabase(platform?: string | null) {
  const reviews = await prisma.reviews.findMany({
    where: {
      package_id: {
        not: null,
      },
      platform: {
        notIn: ["Klook"],
        ...(platform ? { equals: platform } : {}),
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

  return reviews.map((review) => {
    const uniqueCrewMap = new Map<string, PublicReviewApiFeedItem["crews"][number]>();

    review.crew_reviews?.forEach((crewReview) => {
      if (crewReview.crew) {
        const crewId = String(crewReview.crew_id);
        if (!uniqueCrewMap.has(crewId)) {
          uniqueCrewMap.set(crewId, {
            id: String(crewReview.crew.id),
            name: crewReview.crew.name,
            type: crewReview.crew.type,
            photo_url: crewReview.crew.photo_url,
            tags: crewReview.crew.tags as string[] | null,
          });
        }
      }
    });

    return {
      id: String(review.id),
      customer_name: review.customer_name,
      platform: review.platform,
      date: review.date.toISOString(),
      star: Number(review.star ?? 0),
      review: review.review,
      url: review.url || review.url_reference || "",
      profile_photo: review.profile_photo,
      package_id: review.package_id != null ? String(review.package_id) : null,
      crews: Array.from(uniqueCrewMap.values()),
      has_internal_crew: uniqueCrewMap.size > 0,
    } satisfies PublicReviewApiFeedItem;
  });
}

async function getReviewPreviewFromDatabase() {
  const platforms = ["Google", "Trustpilot", "TripAdvisor"];

  const reviewGroups = await Promise.all(
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

      let reviewsWithoutCrew: typeof reviewsWithCrew = [];
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

  const reviews = reviewGroups.flat().map((review) => serializeBigInt(review));

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

  const transformedReviews = reviews.map((review: any) => {
    const uniqueCrewMap = new Map<string, PublicReviewApiFeedItem["crews"][number]>();

    review.crew_reviews?.forEach((crewReview: any) => {
      if (crewReview.crew) {
        const crewId = String(crewReview.crew_id);
        if (!uniqueCrewMap.has(crewId)) {
          uniqueCrewMap.set(crewId, {
            id: String(crewReview.crew.id),
            name: crewReview.crew.name,
            type: crewReview.crew.type,
            photo_url: crewReview.crew.photo_url,
            tags: crewReview.crew.tags ?? null,
          });
        }
      }
    });

    return {
      id: String(review.id),
      customer_name: review.customer_name,
      platform: review.platform,
      date: review.date,
      star: Number(review.star ?? 0),
      review: review.review,
      url: review.url || review.url_reference || "",
      profile_photo: review.profile_photo,
      package_id: review.package_id != null ? String(review.package_id) : null,
      crews: Array.from(uniqueCrewMap.values()),
      has_internal_crew: uniqueCrewMap.size > 0,
    } satisfies PublicReviewApiFeedItem;
  });

  const crews = allCrews.map((crew) => ({
    id: String(crew.id),
    name: crew.name,
    full_name: crew.full_name,
    type: crew.type,
    photo_url: crew.photo_url,
    tags: crew.tags as string[] | null,
    year_of_joining:
      crew.year_of_joining != null ? Number(crew.year_of_joining) : null,
  })) satisfies PublicReviewApiCrewItem[];

  return {
    reviews: transformedReviews,
    crews,
  };
}

async function getReviewStatsFromDatabase(): Promise<PublicReviewApiStats> {
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

  return {
    success: true,
    total: google + trustpilot + tripadvisor,
    platforms: {
      google,
      trustpilot,
      tripadvisor,
    },
    average_rating: parseFloat(avgRating._avg.star?.toFixed(1) || "4.9"),
  };
}

async function getReviewXmlItemsFromDatabase(): Promise<PublicReviewXmlItem[]> {
  const reviews = await prisma.reviews.findMany({
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

  return reviews.map((review) => ({
    id: String(review.id),
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
  }));
}

export function getPublicReviewApiSnapshotCollection() {
  return reviewApiSnapshots;
}

export function getPublicReviewFeed(platform?: string | null) {
  const items = reviewApiSnapshots.feed;
  if (!platform) return items;
  return items.filter((item) => item.platform === platform);
}

export function getPublicReviewPreview() {
  return reviewApiSnapshots.preview;
}

export function getPublicReviewStats() {
  return reviewApiSnapshots.stats;
}

export function getPublicReviewXmlItems() {
  return reviewApiSnapshots.xmlItems;
}

export const getPublicReviewFeedWithFallback = cache(
  async (platform?: string | null): Promise<PublicReviewApiFeedItem[]> => {
    if (reviewApiSnapshots.feed.length > 0) {
      return getPublicReviewFeed(platform);
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-review-feed-snapshot",
        "error",
        "[publicContent] Missing review feed snapshot in strict mode.",
      );
      return [];
    }

    logPublicContentOnce(
      "database-fallback-review-feed-snapshot",
      "warn",
      "[publicContent] Using review feed database fallback. Generate review API snapshots before production cutover.",
    );
    return getReviewFeedFromDatabase(platform);
  },
);

export const getPublicReviewPreviewWithFallback = cache(
  async () => {
    if (reviewApiSnapshots.preview.reviews.length > 0) {
      return reviewApiSnapshots.preview;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-review-preview-snapshot",
        "error",
        "[publicContent] Missing review preview snapshot in strict mode.",
      );
      return { reviews: [], crews: [] };
    }

    logPublicContentOnce(
      "database-fallback-review-preview-snapshot",
      "warn",
      "[publicContent] Using review preview database fallback. Generate review API snapshots before production cutover.",
    );
    return getReviewPreviewFromDatabase();
  },
);

export const getPublicReviewStatsWithFallback = cache(
  async (): Promise<PublicReviewApiStats> => {
    if (reviewApiSnapshots.stats.total > 0) {
      return reviewApiSnapshots.stats;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-review-stats-snapshot",
        "error",
        "[publicContent] Missing review stats snapshot in strict mode.",
      );
      return {
        success: false,
        total: 0,
        platforms: { google: 0, trustpilot: 0, tripadvisor: 0 },
        average_rating: 0,
      };
    }

    logPublicContentOnce(
      "database-fallback-review-stats-snapshot",
      "warn",
      "[publicContent] Using review stats database fallback. Generate review API snapshots before production cutover.",
    );
    return getReviewStatsFromDatabase();
  },
);

export const getPublicReviewXmlItemsWithFallback = cache(
  async (): Promise<PublicReviewXmlItem[]> => {
    if (reviewApiSnapshots.xmlItems.length > 0) {
      return reviewApiSnapshots.xmlItems;
    }

    if (!canUsePublishedSnapshotDatabaseFallback()) {
      logPublicContentOnce(
        "strict-missing-review-xml-snapshot",
        "error",
        "[publicContent] Missing review XML snapshot in strict mode.",
      );
      return [];
    }

    logPublicContentOnce(
      "database-fallback-review-xml-snapshot",
      "warn",
      "[publicContent] Using review XML database fallback. Generate review API snapshots before production cutover.",
    );
    return getReviewXmlItemsFromDatabase();
  },
);
