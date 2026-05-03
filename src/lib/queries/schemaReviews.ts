import { prisma } from '@/lib/prisma';

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
  return prisma.reviews.findMany({
    select: {
      id: true,
      customer_name: true,
      star: true,
      review: true,
      date: true,
      url: true,
      url_reference: true,
      platform: true,
    },
    where: {
      star: { not: null, gte: 1 },
      platform: { in: ['Trustpilot', 'TripAdvisor', 'Google'] },
      review: { not: '' },
    },
    orderBy: { date: 'desc' },
  });
}
