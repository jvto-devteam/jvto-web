// src/lib/ecosystemContent/tourPackageDetail.ts
//
// Fetches a tour-package detail record from jvto-ekosistem
// (2-product-and-commercial-core/tour-products/<route>.product-contract.json).
// Same local-first / HTTP-fallback pattern as ecosystemContent/destinationDetail.ts.
//
// Part of the single-content-source (ekosistem-only) consolidation. Initially
// (2026-08-18) editorial fields came from ekosistem while pricing/availability
// stayed live from Prisma; owner then explicitly extended the directive to
// pricing/add-ons/compliance/channel metadata too ("literally semua, termasuk
// pricing") — this reader is now a pure ekosistem read, no Prisma involved.
// This applies to the public-facing tour listing/detail pages only; booking
// creation, checkout price-validation, and /my-booking (individual customer
// reservation records) remain Prisma-backed by necessity — they are live
// transactional state, not editorial/catalog content, and were explicitly
// out of scope for this migration. No live sync exists between Prisma and
// the ekosistem file by design: price and availability changes now go
// directly into the ekosistem source and are deployed like any other edit.
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { TourPackageDetail } from "@/interfaces";

const DEFAULT_ECOSYSTEM_BASE_URL =
  "https://ekosistem.javavolcano-touroperator.com";
const DEFAULT_REVALIDATE_SECONDS = 300;
const SOURCE_DIR = "2-product-and-commercial-core/tour-products";

const REVALIDATE_SECONDS = Number(
  process.env.JVTO_EKOSYSTEM_CONTENT_REVALIDATE_SECONDS ??
    DEFAULT_REVALIDATE_SECONDS,
);

function ecosystemContentRoot(): string {
  return (
    process.env.JVTO_EKOSYSTEM_CONTENT_ROOT ??
    path.resolve(process.cwd(), "..", "jvto-ekosistem")
  );
}

function slugToFilename(slug: string): string {
  return `${slug.replace(/\//g, "__")}.product-contract.json`;
}

async function readLocal(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await readFile(
      path.join(ecosystemContentRoot(), SOURCE_DIR, slugToFilename(slug)),
      "utf8",
    );
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function fetchRemote(slug: string): Promise<Record<string, unknown> | null> {
  const configuredBase = process.env.JVTO_EKOSYSTEM_CONTENT_BASE_URL?.trim();
  const baseUrl = configuredBase || DEFAULT_ECOSYSTEM_BASE_URL;

  try {
    const url = new URL("/api/file", baseUrl);
    url.searchParams.set("path", `${SOURCE_DIR}/${slugToFilename(slug)}`);

    const response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["jvto-ekosistem-content", `jvto-ekosistem-tour-${slug}`],
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { content?: string };
    if (typeof body.content !== "string") return null;
    return JSON.parse(body.content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const STATIC_VEHICLE_PLAN = {
  primary: [
    {
      type: "MPV",
      model: "Toyota Avanza/Innova",
      banner:
        "https://legacy.javavolcano-touroperator.com/assets/img/cars/avanza.png",
      maxPax: 3,
      baggageCapacity: "3 medium bags",
      features: ["AC", "Charging ports"],
    },
    {
      type: "Hiace",
      model: "Toyota Hiace",
      banner:
        "https://legacy.javavolcano-touroperator.com/assets/img/cars/hiace.png",
      maxPax: 11,
      baggageCapacity: "11 medium bags",
      features: ["AC", "Spacious legroom"],
    },
  ],
  jeepRequiredAt: ["mount-bromo"],
  jeepSpecs: {
    type: "4WD Jeep",
    capacity: "4-6 pax",
    inclusions: [
      "Experienced driver",
      "Kingkong Hill access",
      "Vintage Jeep experience",
    ],
  },
};

/**
 * Full tour-package detail — editorial AND operational (pricing, add-ons,
 * compliance, channel metadata) fields, all read from ekosistem. Returns
 * null when the ekosistem record can't be found.
 */
export async function getEcosystemTourPackageDetail(
  slug: string,
): Promise<TourPackageDetail | null> {
  const editorial = (await readLocal(slug)) ?? (await fetchRemote(slug));
  if (!editorial) return null;

  const product = {
    id: editorial.id,
    packageId: editorial.packageId,
    slug: editorial.slug ?? slug,
    name: editorial.name,
    seoTitle: editorial.seoTitle ?? "",
    seoDescription: editorial.seoDescription ?? "",
    shortLabel: editorial.shortLabel,
    originCity: editorial.originCity ?? "",
    endCity: editorial.endCity ?? "",
    category_id:
      (editorial.category as any)?.id === "student" ? "student" : "reluger",
    category: (editorial.category as any)?.name ?? "",
    durationId: (editorial.duration as any)?.durationId ?? null,
    durationDays: (editorial.duration as any)?.days ?? 0,
    durationNights: (editorial.duration as any)?.nights ?? 0,
    marketedDurationLabel: (editorial.duration as any)?.label ?? "",
    route: editorial.route ?? [],
    tripRef: `/trips/trip-${editorial.packageId}.json`,
    description: editorial.description ?? "",
    keyExperiences: editorial.keyExperiences ?? [],
    physicalDifficulty: editorial.physicalDifficulty ?? "",
    offers: editorial.offers ?? {
      currency: "IDR",
      aggregateOffer: { lowPrice: 0, highPrice: 0 },
      tiers: [],
    },
    inclusions: editorial.inclusions ?? [],
    exclusions: editorial.exclusions ?? [],
    travelerRequirements: editorial.travelerRequirements ?? [],
    addOns: editorial.addOns ?? [],
    accommodationPlan: editorial.accommodationPlan ?? [],
    gear: editorial.gear ?? { provided: [], recommended: [] },
    itineraryDays: editorial.itineraryDays ?? [],
    gallery: editorial.gallery ?? [],
    imageUrl: editorial.imageUrl ?? "",
    tags: editorial.tags ?? [],
    aggregateRating: editorial.aggregateRating ?? {
      ratingValue: 0,
      reviewCount: 0,
    },
    marketing: editorial.marketing ?? {
      perfectFor: [],
      highlightsBullets: [],
      safetyPositioning: "",
      uniqueSellingPoints: [],
    },
    operationalComplexityNote: editorial.operationalComplexityNote ?? "",
    provider: editorial.provider,
    compliance: editorial.compliance ?? {
      destinationsWhitelist: true,
      itineraryTablesGenerated: true,
      healthScreeningIncluded: false,
      touristPoliceSupport: true,
    },
    channelMetadata: editorial.channelMetadata ?? {
      internalPackageId: editorial.packageId ?? "",
      orderChannelEnabled: {
        JVTO: true,
        KLOOK: false,
        TRAVELOKA: false,
        TIKETCOM: false,
        OTHERS: false,
      },
      externalPackageIds: { klook: "", traveloka: "", tiketcom: "" },
      isFreesale: true,
      requiresAvailabilityCheck: false,
      supportedPickupCities: editorial.originCity ? [editorial.originCity] : [],
      supportedDropoffCities: editorial.endCity ? [editorial.endCity] : [],
      languageOffered: ["en"],
      status: "active",
      minLeadTimeHours: 24,
      maxPaxRecommended: 100,
      minPaxOperational: 1,
    },
    _cms: {
      contentType: "tour-package",
      version: "2.0",
      created: "2025-01-15T00:00:00Z",
      lastModified: "2025-01-15T00:00:00Z",
      status: "published",
      owner: "content-team",
      i18nReady: true,
      seoOptimized: true,
      schemaType: "TouristTrip",
    },
  };

  const detail = {
    id: editorial.id,
    packageId: editorial.packageId,
    type: "package",
    version: "1.0.0",
    meta: {
      createdFrom: {
        productFile: `Product ${editorial.name}.json`,
        tripFile: `Trip ${editorial.name}.json`,
      },
    },
    product,
    trip: { vehiclePlan: STATIC_VEHICLE_PLAN },
  };

  return detail as unknown as TourPackageDetail;
}

const KNOWN_TOUR_SLUGS = [
  "tours/from-bali/bromo-ijen-3d2n",
  "tours/from-bali/ijen-bromo-madakaripura-3d2n",
  "tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n",
  "tours/from-bali/ijen-papuma-tumpak-sewu-bromo-5d4n",
  "tours/from-surabaya/bromo-1d1n",
  "tours/from-surabaya/bromo-2d1n",
  "tours/from-surabaya/bromo-madakaripura-ijen-3d2n",
  "tours/from-surabaya/ijen-2d1n",
  "tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
  "tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
  "tours/from-surabaya/ijen-bromo-madakaripura-malang-5d4n",
  "tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n",
  "tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
  "tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-malang-6d5n",
  "tours/from-surabaya/taman-safari-prigen-bromo-madakaripura-3d2n",
  "tours/from-surabaya/tumpak-sewu-bromo-3d2n",
  "tours/from-surabaya/tumpak-sewu-bromo-ijen-4d3n",
] as const;

/** Published tour-package routes for generateStaticParams, grouped by origin prefix. */
export function getEcosystemTourPackageRoutes(
  prefix: "tours/from-bali" | "tours/from-surabaya",
): Array<{ slug: string }> {
  return KNOWN_TOUR_SLUGS.filter((s) => s.startsWith(`${prefix}/`)).map(
    (s) => ({ slug: s.slice(prefix.length + 1) }),
  );
}

/** Shape returned for hub/listing-page cards — mirrors the retired getWebPackagesList. */
export interface EcosystemPackageListItem {
  id: number;
  name: string;
  startDestination: string;
  endDestination: string;
  duration: { day: number; night: number };
  banner: { url: string; alt: string };
  keyExperiences: string[];
  images: { url: string; alt: string }[];
  startFrom: number;
  slug: string;
  physicality: string;
  tags: string[];
  highlights: string[];
}

const FROM_ID_TO_PREFIX: Record<number, "tours/from-bali" | "tours/from-surabaya"> = {
  3: "tours/from-bali",
  4: "tours/from-surabaya",
};

export interface EcosystemPackagesListFilters {
  /** "tours/from-bali" (3) or "tours/from-surabaya" (4) per live's data convention. */
  fromPrefix?: "tours/from-bali" | "tours/from-surabaya";
  /** Numeric start_destination_id (3 = Bali, 4 = Surabaya) — API-compat alternative to fromPrefix. */
  fromId?: number;
  /** All known ekosistem tour products are category 1 (reguler); none are category 2 (student). */
  categoryId?: 1 | 2;
  /** Matches the Prisma durations.id snapshotted into each file's duration.durationId. */
  durationId?: number;
  limit?: number;
}

/**
 * Published tour-package listings for hub/card pages, filtered by origin/category.
 * Pure ekosistem read — no Prisma. Returns empty array on miss (caller-friendly).
 */
export async function getEcosystemPackagesList(
  filters: EcosystemPackagesListFilters = {},
): Promise<EcosystemPackageListItem[]> {
  const { categoryId, durationId, limit } = filters;
  const fromPrefix = filters.fromPrefix ?? (filters.fromId !== undefined ? FROM_ID_TO_PREFIX[filters.fromId] : undefined);

  // categoryId 2 (student) has no published packages in ekosistem today.
  if (categoryId === 2) return [];

  const slugs = KNOWN_TOUR_SLUGS.filter(
    (s) => !fromPrefix || s.startsWith(`${fromPrefix}/`),
  );

  const items = (
    await Promise.all(
      slugs.map(async (slug) => {
        const editorial = (await readLocal(slug)) ?? (await fetchRemote(slug));
        if (!editorial) return null;

        if (
          durationId !== undefined &&
          Number((editorial.duration as any)?.durationId) !== durationId
        ) {
          return null;
        }

        const gallery = Array.isArray(editorial.gallery)
          ? (editorial.gallery as string[])
          : [];
        const bannerUrl =
          (editorial.imageUrl as string) || gallery[0] || "/fallback-banner.jpg";

        return {
          id: Number(editorial.id) || 0,
          name: (editorial.name as string) ?? "",
          startDestination: (editorial.originCity as string) ?? "",
          endDestination: (editorial.endCity as string) ?? "",
          duration: {
            day: Number((editorial.duration as any)?.days) || 0,
            night: Number((editorial.duration as any)?.nights) || 0,
          },
          banner: { url: bannerUrl, alt: (editorial.name as string) ?? "Package banner" },
          keyExperiences: Array.isArray(editorial.keyExperiences)
            ? (editorial.keyExperiences as Array<{ highlight?: string }>)
                .map((k) => k.highlight ?? "")
                .filter(Boolean)
            : [],
          images: [{ url: bannerUrl, alt: (editorial.name as string) ?? "Package banner" }],
          startFrom: Number((editorial.offers as any)?.aggregateOffer?.lowPrice) || 0,
          slug: (editorial.slug as string) ?? slug,
          physicality: (editorial.physicalDifficulty as string) ?? "",
          tags: Array.isArray(editorial.tags) ? (editorial.tags as string[]) : [],
          highlights: Array.isArray((editorial.marketing as any)?.highlightsBullets)
            ? ((editorial.marketing as any).highlightsBullets as string[])
            : [],
        } satisfies EcosystemPackageListItem;
      }),
    )
  ).filter((item): item is EcosystemPackageListItem => item !== null);

  return limit !== undefined ? items.slice(0, limit) : items;
}
