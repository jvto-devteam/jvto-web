// src/lib/queries/packageFaqs.ts — Published package FAQs from DB.
// Created 2026-04-29 as part of AEO/GEO port Phase 4.1.B (closing fullData=null debt).
//
// Queries `package_faqs` junction table joined with `faqs` master, filtered by `faqs.is_published = true`.
// Returned shape matches FullPackageDbDataSeed.faqs from src/lib/schemas/buildTourSchemas.ts.
//
// Most package_faqs rows reference unpublished FAQ master rows (75 of 78 distinct linked FAQs are
// is_published=false per cluster_role_contracts.md — DB content review is owner's task). This helper
// surfaces only the small but valid published subset for FAQPage schema composition.
import { prisma } from '@/lib/prisma';

/**
 * Fetch published FAQs for a package by its slug.
 * Returns plain `{question, answer}[]` ordered by `faqs.sort_order` (nulls last) then `faqs.id`.
 * Empty array on miss, null on DB error (caller can `?? []`).
 */
export async function getPublishedPackageFaqsBySlug(
  slug: string,
): Promise<{ question: string; answer: string }[]> {
  const pkg = await prisma.packages.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!pkg) return [];

  const rows = await prisma.package_faqs.findMany({
    where: {
      package_id: pkg.id,
      faq: { is_published: true },
    },
    include: {
      faq: {
        select: { question: true, answer: true, sort_order: true, id: true },
      },
    },
  });

  return rows
    .map((r) => r.faq)
    .filter((f): f is NonNullable<typeof f> => Boolean(f && f.question && f.answer))
    .sort((a, b) => {
      const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (sa !== sb) return sa - sb;
      return Number(a.id - b.id);
    })
    .map((f) => ({ question: f.question as string, answer: f.answer as string }));
}
