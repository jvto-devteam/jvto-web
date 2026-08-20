// Migrated 2026-08-19: was a live `prisma.reviews.findMany` query — review
// CONTENT now lives in jvto-ekosistem's reviews.json (Phase 2 of the Google
// Reviews migration), so this filters/sorts in application code over the
// ekosistem reader instead of hitting Prisma. Return type/shape kept
// byte-identical (including `id: bigint` / `date: Date`) so downstream
// consumers (why-jvto/reviews/page.tsx for excerptReviews display) need no changes.
import { getEcosystemReviews } from '@/lib/ecosystemContent/reviews';

export type ReviewForSchema = {
  id: bigint;
  customer_name: string;
  star: number | null;
  review: string;
  date: Date;
  url: string | null;
  url_reference: string | null;
  platform: string;
};

export async function getReviewsForSchema(): Promise<ReviewForSchema[]> {
  const reviews = await getEcosystemReviews();

  return reviews
    .filter(
      (r) =>
        typeof r.star === 'number' &&
        r.star >= 1 &&
        (['Trustpilot', 'TripAdvisor', 'Google'] as string[]).includes(r.platform) &&
        r.review !== '',
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((r) => ({
      id: BigInt(r.id),
      customer_name: r.customerName,
      star: r.star,
      review: r.review,
      date: new Date(r.date),
      url: r.url,
      url_reference: r.urlReference,
      platform: r.platform,
    }));
}
