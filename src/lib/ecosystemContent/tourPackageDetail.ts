// src/lib/ecosystemContent/tourPackageDetail.ts
//
// Fetches a tour-package detail record from jvto-ekosistem
// (2-product-and-commercial-core/tour-products/<route>.product-contract.json)
// for editorial content (name, description, marketing, itinerary, gear,
// accommodation, inclusions/exclusions, etc.) and merges it with a live
// Prisma read for the operational/transactional fields that must stay
// live: pricing (offers), add-on prices, and channel/booking metadata.
// Same local-first / HTTP-fallback pattern as ecosystemContent/destinationDetail.ts.
//
// Part of the single-content-source (ekosistem-only) consolidation — editorial
// tour-package content now has exactly one canonical home. No live sync exists
// between Prisma and the ekosistem file by design (owner decision 2026-08-18):
// edits to editorial content go directly into the ekosistem source going forward.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
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

function replaceBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
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

function ucwords(str: string) {
  if (!str) return "";
  str = str.toLowerCase();
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Live, operational-only Prisma read: pricing, add-on prices, and
 * booking/channel metadata. Everything editorial comes from ekosistem.
 */
async function fetchLiveOperationalData(slug: string) {
  const pkg = await prisma.packages.findUnique({
    where: { slug },
    include: {
      start_destination: true,
      end_destination: true,
      package_destinations: {
        where: { deleted_at: null },
        include: { destinations: true },
      },
      package_prices: {
        where: { deleted_at: null },
        include: { price_tiers: true },
        orderBy: { price: "asc" },
      },
      package_addons: { include: { addons: true } },
    },
  });

  if (!pkg) return null;

  const allTiers = (pkg.package_prices ?? [])
    .map((p) => p.price_tiers)
    .filter((t) => t != null);
  const calculatedMinPax =
    allTiers.length > 0 ? Math.min(...allTiers.map((t) => t?.min_pax ?? 1)) : 1;
  const calculatedMaxPax = 100;

  const prices = (pkg.package_prices ?? [])
    .map((p) => p.price)
    .filter((v): v is number => typeof v === "number");

  return replaceBigInt({
    offers: {
      currency: "IDR",
      aggregateOffer: {
        lowPrice: prices.length ? Math.min(...prices) : 0,
        highPrice: prices.length ? Math.max(...prices) : 0,
      },
      tiers: (pkg.package_prices ?? []).map((price, key) => ({
        sku: pkg.code + "-" + (key + 1),
        paxMin: price.price_tiers?.min_pax ?? 0,
        paxMax: price.price_tiers?.max_pax ?? 0,
        pricePerPerson: price.price ?? 0,
      })),
    },
    addOns: (pkg.package_addons ?? []).map((addon: any) => ({
      id: addon.addons?.id,
      name: addon.addons?.is_transport
        ? `Transport to ${ucwords(addon.addons?.name || "")}`
        : addon.addons?.name || "",
      type:
        addon.addons?.id == 2
          ? "madakaripura"
          : addon.addons?.is_transport
            ? "transport"
            : null,
      description: addon.addons?.is_transport
        ? `Transport to ${ucwords(addon.addons?.name || "")} - ${ucwords(
            addon.addons?.transport_type || "",
          )} Car (${
            addon.addons?.transport_type === "small"
              ? "1-3 Pax"
              : addon.addons?.transport_type === "medium"
                ? "4-9 Pax"
                : "10 Pax Above"
          })`
        : "",
      transportType: addon.addons?.transport_type ?? null,
      transportDestination: addon.addons?.name ?? null,
      price: addon.addons?.price ?? 0,
    })),
    compliance: {
      destinationsWhitelist: true,
      itineraryTablesGenerated: true,
      healthScreeningIncluded: (pkg.package_destinations ?? []).some(
        (pd) => Number(pd.destination_id) === 2,
      ),
      touristPoliceSupport: true,
    },
    channelMetadata: {
      internalPackageId: pkg.code,
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
      supportedPickupCities: pkg.start_destination?.name
        ? [pkg.start_destination.name]
        : [],
      supportedDropoffCities: pkg.end_destination?.name
        ? [pkg.end_destination.name]
        : [],
      languageOffered: ["en"],
      status: "active",
      minLeadTimeHours: 24,
      maxPaxRecommended: calculatedMaxPax,
      minPaxOperational: calculatedMinPax,
    },
    aggregateRating: { ratingValue: 0, reviewCount: 0 },
  });
}

/**
 * Full tour-package detail: editorial content from ekosistem, merged with
 * live operational (pricing/booking) data from Prisma. Returns null if
 * either the ekosistem record or the live package can't be found.
 */
export async function getEcosystemTourPackageDetail(
  slug: string,
): Promise<TourPackageDetail | null> {
  const [editorial, operational] = await Promise.all([
    (async () => (await readLocal(slug)) ?? (await fetchRemote(slug)))(),
    fetchLiveOperationalData(slug),
  ]);

  if (!editorial || !operational) return null;

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
    offers: (operational as any).offers,
    inclusions: editorial.inclusions ?? [],
    exclusions: editorial.exclusions ?? [],
    travelerRequirements: editorial.travelerRequirements ?? [],
    addOns: (operational as any).addOns,
    accommodationPlan: editorial.accommodationPlan ?? [],
    gear: editorial.gear ?? { provided: [], recommended: [] },
    itineraryDays: editorial.itineraryDays ?? [],
    gallery: editorial.gallery ?? [],
    imageUrl: editorial.imageUrl ?? "",
    tags: editorial.tags ?? [],
    aggregateRating: (operational as any).aggregateRating,
    marketing: editorial.marketing ?? {
      perfectFor: [],
      highlightsBullets: [],
      safetyPositioning: "",
      uniqueSellingPoints: [],
    },
    operationalComplexityNote: editorial.operationalComplexityNote ?? "",
    provider: editorial.provider,
    compliance: (operational as any).compliance,
    channelMetadata: (operational as any).channelMetadata,
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
