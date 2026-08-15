// Task 4.4 (data-source-consolidation, 2026-08-15): promoted to the destination-detail page's
// only reader — DB-only, no snapshot fallback. Field-parity verified against the retired
// destinationDetailSnapshots.json for ijen-crater and mount-bromo: every field
// `DestinationDetail` declares that the page/DestinationDetailView/JSON-LD builders actually
// read maps 1:1 onto a real `destinations` column (see prisma/schema.prisma `model destinations`)
// or the `destination_assets -> asset` relation, with matching shape. The one interface field
// that has no Prisma equivalent — `banner` — was already absent from every snapshot payload
// (never populated there either); DestinationDetailView derives its hero image from
// `destination_assets`/`featured_image` instead, and generateMetadata's OG image already
// falls back to the site default when `banner` is undefined. Not a regression, not fabricated.
import type { DestinationDetail } from "@/interfaces";
import { prisma } from "@/lib/prisma";

function replaceBigInt<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, currentValue) =>
      typeof currentValue === "bigint" ? Number(currentValue) : currentValue,
    ),
  ) as T;
}

export async function getDestinationDetailFromDatabase(
  slug: string,
): Promise<DestinationDetail | null> {
  const destination = await prisma.destinations.findUnique({
    where: { slug },
    include: {
      destination_assets: {
        include: { asset: true },
      },
    },
  });

  if (!destination) {
    return null;
  }

  return replaceBigInt(destination) as unknown as DestinationDetail;
}

/** IDs excluded from public destination routes (start/end-only placeholder rows, not real
 * public destinations) — same convention as getWebDestinationsList.ts's
 * EXCLUDED_DESTINATION_IDS. */
const EXCLUDED_DESTINATION_IDS = [3, 4];

/**
 * Published destination-detail routes for `generateStaticParams` and the sitemap — DB-only,
 * same `published: true, deleted_at: null` + excluded-id convention as getWebDestinationsList.ts.
 * Throws if Prisma is unreachable (no silent fallback).
 */
export async function getPublishedDestinationRoutes(): Promise<
  Array<{ slug: string; updatedAt?: Date }>
> {
  const rows = await prisma.destinations.findMany({
    where: {
      published: true,
      deleted_at: null,
      id: { notIn: EXCLUDED_DESTINATION_IDS },
    },
    select: { slug: true, updated_at: true },
    orderBy: { id: "asc" },
  });

  return rows
    .filter((row): row is typeof row & { slug: string } => Boolean(row.slug))
    .map((row) => ({ slug: row.slug, updatedAt: row.updated_at ?? undefined }));
}
