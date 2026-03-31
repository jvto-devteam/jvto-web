import type { Destination, DestinationDetail } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { MOCK_DESTINATIONS, MOCK_DESTINATION_DETAILS } from "@/data/mockData";

const EXCLUDED_DESTINATION_IDS = [3, 4];

function safeJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);

  if (value && typeof value === "object" && "toString" in value) {
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function selectPrimaryAsset(destination: any) {
  const imageAssets = (destination.destination_assets ?? []).filter(
    (item: any) => item.asset?.type === "image",
  );

  return (
    imageAssets.find((item: any) => item.type === "primary") ??
    imageAssets[0] ??
    null
  );
}

function serializeDestinationListItem(destination: any): Destination {
  const primaryAsset = selectPrimaryAsset(destination);
  const bannerUrl =
    primaryAsset?.asset?.url ??
    destination.featured_image ??
    destination.thumbnail_url ??
    "";
  const bannerAlt =
    primaryAsset?.asset?.description ??
    primaryAsset?.asset?.caption ??
    destination.name;

  return {
    id: toNumber(destination.id),
    name: destination.name,
    description: destination.description ?? "",
    slug: destination.slug ?? "",
    schema_json: destination.schema_json ?? null,
    banner: {
      url: bannerUrl,
      alt: bannerAlt,
    },
    keyInfo: {
      difficulty_level: destination.difficulty_level ?? "",
      temperature_range: destination.temperature_range ?? "",
      best_time_to_visit: destination.best_time_to_visit ?? "",
    },
  };
}

function serializeDestinationDetail(destination: any): DestinationDetail {
  const primaryAsset = selectPrimaryAsset(destination);
  const bannerUrl =
    primaryAsset?.asset?.url ??
    destination.featured_image ??
    destination.thumbnail_url ??
    "";
  const bannerAlt =
    primaryAsset?.asset?.description ??
    primaryAsset?.asset?.caption ??
    destination.name;

  return {
    id: toNumber(destination.id),
    code: destination.code ?? "",
    name: destination.name,
    seo_title: destination.seo_title ?? "",
    seo_description: destination.seo_description ?? "",
    schema_json: destination.schema_json ?? null,
    banner: {
      url: bannerUrl,
      alt: bannerAlt,
    },
    category: destination.category ?? "",
    region: destination.region ?? "",
    province: destination.province ?? "",
    country: destination.country ?? "",
    latitude: destination.latitude?.toString?.() ?? "",
    longitude: destination.longitude?.toString?.() ?? "",
    altitude: destination.altitude ?? 0,
    area_hectares: destination.area_hectares?.toString?.() ?? "",
    terrain: destination.terrain ?? "",
    best_time_to_visit: destination.best_time_to_visit ?? "",
    difficulty_level: destination.difficulty_level ?? "",
    duration: destination.duration ?? "",
    physical_demand: destination.physical_demand ?? 0,
    cultural_depth: destination.cultural_depth ?? 0,
    photo_potential: destination.photo_potential ?? 0,
    weather_by_season: destination.weather_by_season ?? "",
    rainfall_intensity: destination.rainfall_intensity ?? "",
    temperature_range: destination.temperature_range ?? "",
    trail_details: destination.trail_details ?? "",
    required_gear: safeJson<string[]>(destination.required_gear, []),
    summary: destination.summary ?? "",
    description: destination.description ?? "",
    highlight: destination.highlight ?? "",
    main_attractions: safeJson<Array<{ title: string; description: string }>>(
      destination.main_attractions,
      [],
    ),
    key_highlights: safeJson<Array<{ title: string; description: string }>>(
      destination.key_highlights,
      [],
    ),
    permit_required: destination.permit_required ?? false,
    permit_details: destination.permit_details ?? "",
    guide_required: destination.guide_required ?? false,
    safety_notes: safeJson<string[]>(destination.safety_notes, []),
    risk_factors: safeJson<
      Array<{
        type: string;
        level: string;
        mitigation: string;
        description: string;
      }>
    >(destination.risk_factors, []),
    environmental_factors: safeJson<
      Array<{
        unit?: string;
        value: string;
        factor: string;
        impact: string;
        condition?: string;
      }>
    >(destination.environmental_factors, []),
    physical_requirements: destination.physical_requirements ?? "",
    cultural_context: destination.cultural_context ?? "",
    local_tribes: Array.isArray(destination.local_tribes)
      ? destination.local_tribes
      : [],
    tips_for_visitors: destination.tips_for_visitors ?? "",
    featured_image: destination.featured_image ?? bannerUrl,
    tags: Array.isArray(destination.tags) ? destination.tags : [],
    destination_assets: (destination.destination_assets ?? []).map(
      (item: any) => ({
        id: toNumber(item.id),
        destination_id: toNumber(item.destination_id),
        asset_id: toNumber(item.asset_id),
        type: item.type ?? "",
        asset: {
          id: toNumber(item.asset?.id),
          folder_id: toNumber(item.asset?.folder_id),
          name: item.asset?.name ?? "",
          caption: item.asset?.caption ?? "",
          description: item.asset?.description ?? "",
          type: item.asset?.type ?? "",
          url: item.asset?.url ?? "",
          file_ext: item.asset?.file_ext ?? "",
          size_bytes: toNumber(item.asset?.size_bytes),
          is_active: item.asset?.is_active ?? true,
        },
      }),
    ),
  };
}

export async function getWebDestinations(options?: {
  featured?: boolean;
  limit?: number;
}) {
  const featured = options?.featured === true;
  const limit = options?.limit;

  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    const mockDestinations = MOCK_DESTINATIONS as Destination[];
    const filtered = featured
      ? mockDestinations.filter((destination: any) => destination.featured)
      : [...mockDestinations];

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }

  try {
    const destinations = await prisma.destinations.findMany({
      where: {
        published: true,
        deleted_at: null,
        id: { notIn: EXCLUDED_DESTINATION_IDS },
        ...(featured && { featured: true }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        featured_image: true,
        thumbnail_url: true,
        difficulty_level: true,
        temperature_range: true,
        best_time_to_visit: true,
        schema_json: true,
        destination_assets: {
          where: { asset: { type: "image" } },
          select: {
            type: true,
            asset: {
              select: {
                url: true,
                caption: true,
                description: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
      ...(typeof limit === "number" ? { take: limit } : {}),
    });

    return destinations.map(serializeDestinationListItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[destinations] falling back to mock list: ${message}`);

    const mockDestinations = MOCK_DESTINATIONS as Destination[];
    const filtered = featured
      ? mockDestinations.filter((destination: any) => destination.featured)
      : [...mockDestinations];

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }
}

export async function getWebDestinationBySlug(slug: string) {
  if (!slug) return null;

  if (process.env.NEXT_PUBLIC_IS_FIREBASE === "true") {
    const mockDetails = MOCK_DESTINATION_DETAILS as any[];
    return (
      mockDetails.find(
        (destination) => destination.slug === slug,
      ) ?? null
    );
  }

  try {
    const destination = await prisma.destinations.findFirst({
      where: {
        slug,
        published: true,
        deleted_at: null,
        id: { notIn: EXCLUDED_DESTINATION_IDS },
      },
      select: {
        id: true,
        code: true,
        name: true,
        slug: true,
        category: true,
        region: true,
        province: true,
        country: true,
        latitude: true,
        longitude: true,
        altitude: true,
        area_hectares: true,
        terrain: true,
        best_time_to_visit: true,
        difficulty_level: true,
        duration: true,
        physical_demand: true,
        cultural_depth: true,
        photo_potential: true,
        weather_by_season: true,
        rainfall_intensity: true,
        temperature_range: true,
        trail_details: true,
        required_gear: true,
        summary: true,
        description: true,
        highlight: true,
        main_attractions: true,
        key_highlights: true,
        permit_required: true,
        permit_details: true,
        guide_required: true,
        safety_notes: true,
        risk_factors: true,
        environmental_factors: true,
        physical_requirements: true,
        cultural_context: true,
        local_tribes: true,
        tips_for_visitors: true,
        featured_image: true,
        thumbnail_url: true,
        seo_title: true,
        seo_description: true,
        schema_json: true,
        tags: true,
        destination_assets: {
          include: {
            asset: {
              select: {
                id: true,
                folder_id: true,
                name: true,
                caption: true,
                description: true,
                type: true,
                url: true,
                file_ext: true,
                size_bytes: true,
                is_active: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!destination) return null;

    return serializeDestinationDetail(destination);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[destination-detail] falling back to mock data for ${slug}: ${message}`);

    const mockDetails = MOCK_DESTINATION_DETAILS as any[];
    return (
      mockDetails.find(
        (destination) => destination.slug === slug,
      ) ?? null
    );
  }
}
