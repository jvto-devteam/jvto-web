// src/lib/queries/toursByDestination.ts
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — extended 2026-05-22 for visual rendering
import { prisma } from '@/lib/prisma';

export interface ToursByDestinationItem {
  id: number;
  name: string | null;
  slug: string | null;
  start_destination_id: number | null;
  // Fields for visual rendering (added 2026-05-22)
  banner_url: string | null;
  start_from: number | null;
  duration_day: number | null;
  duration_night: number | null;
  physicality: string | null;
}

/**
 * Returns published packages that include a given destination (via package_destinations junction).
 * Used by destination detail pages to render reverse-lookup ItemList (schema) and tour cards (UI).
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
      physicality: true,
      durations: {
        select: { day: true, night: true },
      },
      package_assets: {
        select: {
          is_primary: true,
          asset: { select: { url: true } },
        },
      },
      package_prices: {
        where: { deleted_at: null },
        select: { price: true },
      },
    },
    orderBy: { id: 'asc' },
  });

  return tours.map((t) => {
    // Primary asset URL — fall back to first asset if no primary flagged
    const primary = t.package_assets.find((a) => a.is_primary) ?? t.package_assets[0];
    const bannerUrl = primary?.asset?.url ?? null;

    // Start-from: minimum of all positive prices
    const prices = (t.package_prices ?? [])
      .map((p) => p.price)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    const startFrom = prices.length > 0 ? Math.min(...prices) : null;

    return {
      id: Number(t.id),
      name: t.name,
      slug: t.slug,
      start_destination_id:
        t.start_destination_id != null ? Number(t.start_destination_id) : null,
      banner_url: bannerUrl,
      start_from: startFrom,
      duration_day: t.durations?.day ?? null,
      duration_night: t.durations?.night ?? null,
      physicality: t.physicality,
    };
  });
}
