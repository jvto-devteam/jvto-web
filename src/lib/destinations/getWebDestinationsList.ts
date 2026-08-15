// src/lib/destinations/getWebDestinationsList.ts
// Created 2026-08-15 (Task 4.2 of data-source-consolidation) — replaces the static-snapshot
// destination list (src/lib/publicContent/destinationListSnapshot.ts, deleted this task) with a
// direct Prisma read. DB-only, no fallback: if Prisma is unreachable, callers error.
//
// Reused by 3 call sites that all previously read the snapshot:
//  - app/(website)/page.tsx (homepage) via getDestinationsForHomepage()
//  - app/(website)/destinations/page.tsx (destinations hub) via getWebDestinationsList()
//  - app/(api)/api/destinations/web/route.ts via getWebDestinationsList({ featured, limit })
//    (this route already had an equivalent Prisma query behind a
//    PUBLIC_CONTENT_USE_SNAPSHOT_LISTS flag — this function supersedes it; same where-filter,
//    same excluded-id convention as getWebPackagesList.ts's EXCLUDED_DESTINATION_IDS.)
//
// Note: `geo.latitude`/`geo.longitude` are always null — the `destinations` table has no
// latitude/longitude columns (only `altitude`). The snapshot type declared these fields, but
// no consumer actually renders them outside an optional GeoCoordinates JSON-LD block that
// already no-ops when they're absent (buildDestinationsCollectionJsonLd checks
// `dest.geo?.latitude && dest.geo?.longitude` before emitting). Not fabricated — left null.
import { prisma } from '@/lib/prisma';
import type { Destination } from '@/interfaces';

export interface DestinationListItem extends Destination {
  featured?: boolean;
  short_slug?: string | null;
  summary?: string | null;
  highlight?: string | null;
  geo?: { latitude: number | null; longitude: number | null; altitude: number | null };
  permit_required?: boolean;
  permit_details?: string | null;
  physical_requirements?: string | null;
  seo?: { title?: string | null; description?: string | null };
  tags?: string[];
}

export interface WebDestinationsListFilters {
  featured?: boolean;
  limit?: number;
}

/** IDs excluded from public destination listings (start/end-only placeholder rows, not real
 * public destinations) — same convention as getWebPackagesList.ts's EXCLUDED_DESTINATION_IDS
 * and the pre-existing Prisma fallback branch in api/destinations/web/route.ts. */
const EXCLUDED_DESTINATION_IDS = [3, 4];

function safeJson<T>(val: unknown, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return val as T;
}

function serializeDestination(dest: any): DestinationListItem {
  const primaryAsset =
    (dest.destination_assets ?? []).find(
      (da: any) => da.asset?.type === 'image' && da.type === 'primary',
    )?.asset ?? null;

  return {
    id: Number(dest.id),
    name: dest.name ?? '',
    slug: dest.slug ?? '',
    short_slug: dest.short_slug ?? null,
    featured: dest.featured ?? false,
    banner: {
      url: primaryAsset?.url ?? '',
      alt: primaryAsset?.description ?? dest.name ?? '',
    },
    summary: dest.summary ?? null,
    highlight: dest.highlight ?? null,
    description: dest.description ?? '',
    geo: {
      latitude: null,
      longitude: null,
      altitude: dest.altitude ?? null,
    },
    keyInfo: {
      difficulty_level: dest.difficulty_level ?? '',
      temperature_range: dest.temperature_range ?? '',
      best_time_to_visit: dest.best_time_to_visit ?? '',
    },
    permit_required: dest.permit_required ?? false,
    permit_details: dest.permit_details ?? null,
    physical_requirements: dest.physical_requirements ?? null,
    seo: {
      title: dest.seo_title ?? null,
      description: dest.seo_description ?? null,
    },
    tags: Array.isArray(dest.tags) ? dest.tags : safeJson<string[]>(dest.tags, []),
    schema_json: dest.schema_json ?? null,
  };
}

/**
 * Fetch published web destination listings (excludes ids 3/4, matches the pre-existing
 * convention). DB-only — throws if Prisma is unreachable, no snapshot/mock fallback.
 */
export async function getWebDestinationsList(
  filters: WebDestinationsListFilters = {},
): Promise<DestinationListItem[]> {
  const { featured, limit } = filters;

  const rows = await prisma.destinations.findMany({
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
      short_slug: true,
      featured: true,
      summary: true,
      highlight: true,
      description: true,
      altitude: true,
      difficulty_level: true,
      temperature_range: true,
      best_time_to_visit: true,
      permit_required: true,
      permit_details: true,
      physical_requirements: true,
      seo_title: true,
      seo_description: true,
      tags: true,
      schema_json: true,
      destination_assets: {
        where: { asset: { type: 'image' } },
        include: { asset: true },
      },
    },
    orderBy: { id: 'asc' },
    ...(limit !== undefined && { take: limit }),
  });

  return rows.map(serializeDestination);
}

/** Lean homepage read — same DB-only query, used by app/(website)/page.tsx. */
export async function getDestinationsForHomepage(): Promise<Destination[]> {
  return getWebDestinationsList();
}
