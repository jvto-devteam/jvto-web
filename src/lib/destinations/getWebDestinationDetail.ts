// src/lib/destinations/getWebDestinationDetail.ts
// Created 2026-04-29 (AEO/GEO port Phase 4.8) — same refactor pattern as getWebPackageDetail.ts.
// Server Component (destinations/[slug]/page.tsx) calls this helper directly to skip HTTP self-fetch
// (which broke SSG with ECONNREFUSED at build time during generateStaticParams enumeration).
import { prisma } from '@/lib/prisma';
import { MOCK_DESTINATION_DETAILS } from '@/data/mockData';

/** Replace BigInt with Number in nested object (matches API route's JSON.parse(JSON.stringify(...)) trick). */
function replaceBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? Number(v) : v)),
  );
}

/**
 * Fetch a single published destination by slug. Returns null if not found.
 * Mirrors the original /api/destinations/web/[slug] route's data shape (raw row + destination_assets relation).
 * Honors NEXT_PUBLIC_IS_FIREBASE mock-mode env flag.
 */
export async function getWebDestinationDetail(
  slug: string,
): Promise<unknown | null> {
  if (process.env.NEXT_PUBLIC_IS_FIREBASE === 'true') {
    return (MOCK_DESTINATION_DETAILS as any[]).find((d) => d.slug === slug) ?? null;
  }

  const dest = await prisma.destinations.findUnique({
    where: { slug },
    include: {
      destination_assets: {
        include: { asset: true },
      },
    },
  });

  if (!dest) return null;

  return replaceBigInt(dest);
}
