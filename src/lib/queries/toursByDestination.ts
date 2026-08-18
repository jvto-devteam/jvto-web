// src/lib/queries/toursByDestination.ts
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — reverse-lookup for "tours including this destination"
// ItemList schema on /destinations/{slug}.
// Migrated 2026-08-18: sourced from ekosistem instead of Prisma — matches by destination
// *name* against each package's route[] array (ekosistem has no numeric destination_id join),
// same single-content-source consolidation as the rest of the tour/destination system.
// Callers now pass the destination NAME (e.g. "Mount Bromo"), not the slug.
import { getEcosystemPackagesList } from '@/lib/ecosystemContent/tourPackageDetail';

export interface ToursByDestinationItem {
  id: number;
  name: string | null;
  slug: string | null;
  start_destination_id: number | null;
}

/**
 * Returns published packages that include a given destination (matched by name in route[]).
 * Used by destination detail pages to render reverse-lookup ItemList.
 */
export async function getToursByDestination(
  destinationName: string,
): Promise<ToursByDestinationItem[]> {
  const allTours = await getEcosystemPackagesList();
  const needle = destinationName.trim().toLowerCase();

  return allTours
    .filter((t) => t.route.some((name) => name.trim().toLowerCase() === needle))
    .map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      start_destination_id: t.slug.startsWith('tours/from-bali/') ? 3 : 4,
    }));
}
