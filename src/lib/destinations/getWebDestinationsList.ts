// src/lib/destinations/getWebDestinationsList.ts
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — same refactor pattern as getWebPackagesList.ts:
// extract API transform logic so Server Components (destinations hub + homepage) call it directly,
// skipping HTTP self-fetch (which broke SSG with ECONNREFUSED at build time).
import { prisma } from '@/lib/prisma';
import { MOCK_DESTINATIONS } from '@/data/mockData';

export interface WebDestinationListItem {
  id: number;
  name: string | null;
  slug: string | null;
  short_slug: string | null;
  featured: boolean;
  banner: { url: string; alt: string };
  summary: string | null;
  highlight: string | null;
  description: string | null;
  geo: {
    latitude: number | null;
    longitude: number | null;
    altitude: string | null;
  };
  keyInfo: {
    difficulty_level: string | null;
    temperature_range: string | null;
    best_time_to_visit: string | null;
    permit_required: boolean;
    permit_details: string | null;
    physical_requirements: string | null;
  };
  main_attractions: unknown;
  key_highlights: unknown;
  seo: { title: string | null; description: string | null };
  tags: string[];
  types: unknown;
  schema_json: unknown;
}

function safeJson(val: unknown, fallback: unknown = []) {
  if (!val) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val;
}

function serializeDestination(dest: any): WebDestinationListItem {
  const primaryAsset =
    (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === 'image' && da.type === 'primary',
    )?.asset ?? null;

  return {
    id: Number(dest.id),
    name: dest.name,
    slug: dest.slug,
    short_slug: dest.short_slug ?? null,
    featured: dest.featured ?? false,
    banner: {
      url: primaryAsset?.url ?? '',
      alt: primaryAsset?.description ?? dest.name ?? '',
    },
    summary: dest.summary ?? null,
    highlight: dest.highlight ?? null,
    description: dest.description ?? null,
    geo: {
      latitude: dest.latitude ? Number(dest.latitude) : null,
      longitude: dest.longitude ? Number(dest.longitude) : null,
      altitude: dest.altitude ?? null,
    },
    keyInfo: {
      difficulty_level: dest.difficulty_level ?? null,
      temperature_range: dest.temperature_range ?? null,
      best_time_to_visit: dest.best_time_to_visit ?? null,
      permit_required: dest.permit_required ?? false,
      permit_details: dest.permit_details ?? null,
      physical_requirements: dest.physical_requirements ?? null,
    },
    main_attractions: safeJson(dest.main_attractions),
    key_highlights: safeJson(dest.key_highlights),
    seo: {
      title: dest.seo_title ?? null,
      description: dest.seo_description ?? null,
    },
    tags: dest.tags ?? [],
    types: safeJson(dest.types),
    schema_json: dest.schema_json ?? null,
  };
}

export interface WebDestinationsListFilters {
  /** Cap result length. */
  limit?: number;
  /** Restrict to featured destinations only. */
  featured?: boolean;
}

/**
 * Fetch published web destinations (excluding ids 3/4 which are city/departure references — see CLAUDE.md).
 * Honors NEXT_PUBLIC_IS_FIREBASE mock-mode env flag.
 */
export async function getWebDestinationsList(
  filters: WebDestinationsListFilters = {},
): Promise<WebDestinationListItem[]> {
  const { limit, featured } = filters;

  if (process.env.NEXT_PUBLIC_IS_FIREBASE === 'true') {
    let data = [...(MOCK_DESTINATIONS as unknown as WebDestinationListItem[])];
    if (limit) data = data.slice(0, limit);
    return data;
  }

  const destinations = await prisma.destinations.findMany({
    where: {
      published: true,
      deleted_at: null,
      id: { notIn: [3, 4] },
      ...(featured && { featured: true }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      short_slug: true,
      featured: true,
      summary: true,
      highlight: true,
      description: true,
      latitude: true,
      longitude: true,
      altitude: true,
      difficulty_level: true,
      temperature_range: true,
      best_time_to_visit: true,
      permit_required: true,
      permit_details: true,
      physical_requirements: true,
      main_attractions: true,
      key_highlights: true,
      seo_title: true,
      seo_description: true,
      tags: true,
      types: true,
      schema_json: true,
      destination_assets: {
        where: { asset: { type: 'image' } },
        include: { asset: true },
      },
    },
    orderBy: { id: 'asc' },
    ...(limit !== undefined && { take: limit }),
  });

  return destinations.map(serializeDestination);
}
