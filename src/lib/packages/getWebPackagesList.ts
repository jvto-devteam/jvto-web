// src/lib/packages/getWebPackagesList.ts
// Created 2026-04-29 (Phase 4.2 of AEO/GEO port) — same refactor pattern as getWebPackageDetail.ts:
// extract API transform logic so Server Components (tour hub pages) call it directly, skipping HTTP.
// Unblocks SSG (was failing with ECONNREFUSED on self-fetch to /api/packages/web at build time).
import { prisma } from '@/lib/prisma';
import { MOCK_PACKAGES } from '@/data/mockData';

export interface ImageAsset {
  url: string;
  alt: string;
  isPrimary: boolean;
}

/** Shape returned by the original /api/packages/web GET — preserved for backward compat. */
export interface PackageListItem {
  id: number;
  name: string | null;
  startDestination: string | null;
  endDestination: string | null;
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

export interface WebPackagesListFilters {
  /** Match start_destination_id (3 = Bali, 4 = Surabaya per live's data convention). */
  fromId?: number;
  /** Match duration_id directly. */
  durationId?: number;
  /** Match package_category_id (1 = reluger / regular, 2 = student). */
  categoryId?: number;
  /** Optional cap on result length. */
  limit?: number;
}

const EXCLUDED_DESTINATION_IDS = new Set([3, 4]);

function serializePackage(pkg: any): PackageListItem {
  const imageAssets: ImageAsset[] = (pkg.package_assets ?? [])
    .filter((pa: any) => pa.asset?.type === 'image')
    .map((pa: any) => ({
      url: pa.asset?.url || '',
      alt: pa.asset?.description || '',
      isPrimary: pa.is_primary === true,
    }));

  const primaryImage = imageAssets.find((img) => img.isPrimary) || imageAssets[0];

  const validPrices: number[] = (pkg.package_prices ?? [])
    .map((p: any) => p.price)
    .filter((price: any): price is number => typeof price === 'number' && price > 0);

  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  return {
    id: Number(pkg.id),
    name: pkg.name,
    startDestination: pkg.start_destination?.name ?? null,
    endDestination: pkg.end_destination?.name ?? null,
    duration: {
      day: Number(pkg.durations?.day) || 0,
      night: Number(pkg.durations?.night) || 0,
    },
    banner: {
      url: primaryImage?.url || '/fallback-banner.jpg',
      alt: primaryImage?.alt || pkg.name || 'Package banner',
    },
    keyExperiences: (pkg.package_destinations ?? [])
      .filter(
        (pd: any) => !EXCLUDED_DESTINATION_IDS.has(Number(pd.destination_id)),
      )
      .map((dest: any) => dest.destinations?.activities?.[0]?.activity_name ?? '')
      .filter(Boolean),
    images: primaryImage
      ? [{ url: primaryImage.url, alt: primaryImage.alt }]
      : [{ url: '/fallback-banner.jpg', alt: pkg.name || 'Package banner' }],
    startFrom,
    slug: pkg.slug || '',
    physicality: pkg.physicality || '',
    tags: Array.isArray(pkg.tags)
      ? pkg.tags.map((s: any) => s?.trim()).filter((s: any) => s && s.length > 0)
      : [],
    highlights: Array.isArray(pkg.highlights_bullets)
      ? pkg.highlights_bullets
          .map((s: any) => s?.trim())
          .filter((s: any) => s && s.length > 0)
      : [],
  };
}

/**
 * Fetch published web tour-package listings, filtered by optional from/duration/category.
 * Returns empty array on miss or error (caller-friendly — no null checks).
 * Honors NEXT_PUBLIC_IS_FIREBASE mock-mode env flag.
 */
export async function getWebPackagesList(
  filters: WebPackagesListFilters = {},
): Promise<PackageListItem[]> {
  const { fromId, durationId, categoryId, limit } = filters;

  if (process.env.NEXT_PUBLIC_IS_FIREBASE === 'true') {
    let filtered = [...(MOCK_PACKAGES as PackageListItem[])];
    if (fromId !== undefined) {
      if (fromId === 4) {
        filtered = filtered.filter((p) => p.startDestination === 'Surabaya');
      } else if (fromId === 3) {
        filtered = filtered.filter((p) => p.startDestination === 'Bali');
      }
    }
    if (durationId !== undefined) {
      const durationMap: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const expectedDays = durationMap[durationId];
      if (expectedDays) {
        filtered = filtered.filter((p) => p.duration.day === expectedDays);
      }
    }
    if (limit !== undefined) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  }

  const pkgs = await prisma.packages.findMany({
    where: {
      is_publish: true,
      ...(fromId !== undefined && { start_destination_id: fromId }),
      ...(durationId !== undefined && { duration_id: durationId }),
      ...(categoryId !== undefined && { package_category_id: categoryId }),
    },
    include: {
      start_destination: true,
      end_destination: true,
      durations: true,
      package_prices: {
        include: { price_tiers: true },
        orderBy: { price: 'asc' },
      },
      package_destinations: {
        include: {
          destinations: {
            include: { activities: true, destination_gears: true },
          },
        },
        orderBy: { sort_order: 'asc' },
      },
      package_assets: { include: { asset: true } },
    },
    orderBy: { id: 'asc' },
    ...(limit !== undefined && { take: limit }),
  });

  return pkgs.map(serializePackage);
}
