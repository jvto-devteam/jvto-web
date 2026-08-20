// src/lib/publicContent/reviewApi.ts
// Replaces reviewApiSnapshot.ts (deleted 2026-08-20) — that module read a stale,
// committed local JSON snapshot (`generated/reviewApiSnapshots.json`, generatedAt
// 2026-05-08) with a `prisma.reviews`/`prisma.crew_members` fallback and no
// regenerator script. Review CONTENT was already fully migrated off Prisma to
// jvto-ekosistem's reviews.json earlier in this migration (see
// `@/lib/ecosystemContent/reviews`, `@/lib/queries/schemaReviews.ts`,
// `@/lib/publicContent/getHomeReviews.ts`, `GoogleReviewsCarousel.tsx`) — this
// module follows the same "read ekosistem, filter/sort/map in application code"
// pattern for the 4 review API routes that were still reading the dead snapshot.
//
// Field/shape notes vs. the old Prisma-backed functions (documented, not bugs):
//  - `package_id` (was a numeric Prisma package id, stringified) is now populated
//    from ekosistem's `packageSlug` — there is no numeric package id in the
//    ekosistem data model any more. The `requires package_id != null` filter is
//    adapted to `requires packageSlug != null`.
//  - There is no "Klook" platform in ekosistem's reviews.json (only Google,
//    Trustpilot, TripAdvisor were ever migrated), so the `platform !== "Klook"`
//    guard below is dead code kept only for parity/documentation.
//  - Crew objects come from `getPublicCrew()` (`@/lib/people/canonicalPeople`),
//    keyed by `code` (there's no numeric crew id any more — `code` is used as
//    the `id` string, which downstream consumers already treat as an opaque
//    string). `tags` has no equivalent field in the ekosistem people model, so
//    it's left `null` rather than fabricated from `specialties`/`languages`.
//  - The preview endpoint's crew roster previously excluded Prisma ids [9, 56]
//    (unpublished/deleted crew) — `getPublicCrew()` already excludes unpublished
//    crew structurally, so no extra exclusion list is needed. It also no longer
//    carries `full_name`/`year_of_joining` (no equivalent field in ekosistem) —
//    both stay `undefined`, which the type already allows.
//  - The XML feed's `<mpn>`/`<sku>` (`package.code`) has no equivalent field in
//    ekosistem's tour-package data model (no SKU/code concept) — `packageSlug`
//    is used as the closest stable product identifier instead.
import { cache } from "react";
import { getEcosystemReviews, type PublicReview } from "@/lib/ecosystemContent/reviews";
import { getPublicCrew } from "@/lib/people/canonicalPeople";
import type {
  PublicReviewApiCrewItem,
  PublicReviewApiFeedItem,
  PublicReviewApiStats,
  PublicReviewXmlItem,
} from "./types";

type FeedCrew = PublicReviewApiFeedItem["crews"][number];

async function buildCrewMap(): Promise<Map<string, FeedCrew>> {
  const crew = await getPublicCrew();
  return new Map(
    crew.map((c) => [
      c.code,
      {
        id: c.code,
        name: c.name,
        type: c.role,
        photo_url: c.image?.src ?? null,
        tags: null,
      } satisfies FeedCrew,
    ]),
  );
}

function buildCrewsForReview(
  review: PublicReview,
  crewMap: Map<string, FeedCrew>,
): FeedCrew[] {
  const uniqueCrewMap = new Map<string, FeedCrew>();
  for (const code of review.crewCodes ?? []) {
    const crew = crewMap.get(code);
    if (crew && !uniqueCrewMap.has(crew.id)) {
      uniqueCrewMap.set(crew.id, crew);
    }
  }
  return Array.from(uniqueCrewMap.values());
}

function toFeedItem(
  review: PublicReview,
  crewMap: Map<string, FeedCrew>,
): PublicReviewApiFeedItem {
  const crews = buildCrewsForReview(review, crewMap);
  return {
    id: String(review.id),
    customer_name: review.customerName,
    platform: review.platform,
    date: new Date(review.date).toISOString(),
    star: Number(review.star ?? 0),
    review: review.review,
    url: review.url || review.urlReference || "",
    profile_photo: null,
    package_id: review.packageSlug ?? null,
    crews,
    has_internal_crew: crews.length > 0,
  };
}

function byDateDesc(a: PublicReview, b: PublicReview): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/** Public review feed — same filter/sort semantics as the old Prisma feed query. */
export const getPublicReviewFeedWithFallback = cache(
  async (platform?: string | null): Promise<PublicReviewApiFeedItem[]> => {
    const [reviews, crewMap] = await Promise.all([
      getEcosystemReviews(),
      buildCrewMap(),
    ]);

    return reviews
      .filter(
        (r) =>
          r.packageSlug != null &&
          r.platform !== "Klook" &&
          (!platform || r.platform === platform),
      )
      .sort(byDateDesc)
      .map((r) => toFeedItem(r, crewMap));
  },
);

const PREVIEW_PLATFORMS = ["Google", "Trustpilot", "TripAdvisor"] as const;
const PREVIEW_TAKE = 10;

/**
 * Preview widget feed: per platform, star >= 4, crew-mentioned reviews first
 * (up to 10), backfilled with non-crew reviews to reach 10 — same two-pass
 * logic as the old `reviewsWithCrew` / `reviewsWithoutCrew` Prisma queries.
 */
export const getPublicReviewPreviewWithFallback = cache(
  async (): Promise<{
    reviews: PublicReviewApiFeedItem[];
    crews: PublicReviewApiCrewItem[];
  }> => {
    const [reviews, crewMap] = await Promise.all([
      getEcosystemReviews(),
      buildCrewMap(),
    ]);

    const selected: PublicReview[] = [];
    for (const platform of PREVIEW_PLATFORMS) {
      const eligible = reviews
        .filter((r) => r.platform === platform && (r.star ?? 0) >= 4)
        .sort(byDateDesc);

      const withCrew = eligible.filter((r) => (r.crewCodes?.length ?? 0) > 0);
      const withoutCrew = eligible.filter(
        (r) => !(r.crewCodes?.length ?? 0),
      );

      const taken = withCrew.slice(0, PREVIEW_TAKE);
      const remaining = Math.max(PREVIEW_TAKE - taken.length, 0);
      selected.push(...taken, ...withoutCrew.slice(0, remaining));
    }

    const reviewItems = selected.map((r) => toFeedItem(r, crewMap));

    const crews: PublicReviewApiCrewItem[] = Array.from(crewMap.values())
      .map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        photo_url: c.photo_url,
        tags: c.tags,
      }))
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

    return { reviews: reviewItems, crews };
  },
);

/** Per-platform counts + overall average star, star >= 1 — same semantics as the old Prisma aggregate. */
export const getPublicReviewStatsWithFallback = cache(
  async (): Promise<PublicReviewApiStats> => {
    const reviews = await getEcosystemReviews();
    const relevant = (platform: string) =>
      reviews.filter((r) => r.platform === platform && (r.star ?? 0) >= 1);

    const googleReviews = relevant("Google");
    const trustpilotReviews = relevant("Trustpilot");
    const tripadvisorReviews = relevant("TripAdvisor");
    const combined = [...googleReviews, ...trustpilotReviews, ...tripadvisorReviews];

    const averageRating = combined.length
      ? combined.reduce((sum, r) => sum + (r.star ?? 0), 0) / combined.length
      : 4.9;

    return {
      success: true,
      total: googleReviews.length + trustpilotReviews.length + tripadvisorReviews.length,
      platforms: {
        google: googleReviews.length,
        trustpilot: trustpilotReviews.length,
        tripadvisor: tripadvisorReviews.length,
      },
      average_rating: parseFloat(averageRating.toFixed(1)),
    };
  },
);

/** Google Merchant product-review XML items — package_id != null, date desc. */
export const getPublicReviewXmlItemsWithFallback = cache(
  async (): Promise<PublicReviewXmlItem[]> => {
    const reviews = await getEcosystemReviews();

    return reviews
      .filter((r) => r.packageSlug != null)
      .sort(byDateDesc)
      .map((r) => ({
        id: String(r.id),
        customer_name: r.customerName,
        date: new Date(r.date).toISOString(),
        review: r.review,
        star: Number(r.star ?? 5),
        package: r.packageSlug
          ? {
              code: r.packageSlug,
              name: r.packageName ?? null,
              slug: r.packageSlug,
            }
          : null,
      }));
  },
);
