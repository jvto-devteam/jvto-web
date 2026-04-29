// src/lib/queries/toursByDestination.ts
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — DB-driven reverse-lookup for "tours including this destination"
// ItemList schema on /destinations/{slug}. Replaces rewrite's TOURS-array-filter approach (live has no SSOT array).
import { prisma } from '@/lib/prisma';

export interface ToursByDestinationItem {
  id: number;
  name: string | null;
  slug: string | null;
  start_destination_id: number | null;
}

/**
 * Returns published packages that include a given destination (via package_destinations junction).
 * Used by destination detail pages to render reverse-lookup ItemList.
 */
export async function getToursByDestination(
  destinationSlug: string,
): Promise<ToursByDestinationItem[]> {
  const tours = await prisma.packages.findMany({
    where: {
      is_publish: true,
      deleted_at: null,
      package_destinations: {
        some: { destinations: { slug: destinationSlug } },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      start_destination_id: true,
    },
    orderBy: { id: 'asc' },
  });

  return tours.map((t) => ({
    id: Number(t.id),
    name: t.name,
    slug: t.slug,
    start_destination_id:
      t.start_destination_id != null ? Number(t.start_destination_id) : null,
  }));
}
