import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface GoogleReviewStats {
  rating: number;
  count: number;
  synced_at: string;
}

export const getGoogleReviewStats = cache(
  async (): Promise<GoogleReviewStats | null> => {
    try {
      const row = await prisma.review_stats.findUnique({
        where: { source: "google" },
      });
      if (!row) return null;
      return {
        rating: row.rating,
        count: row.count,
        synced_at: row.synced_at.toISOString(),
      };
    } catch {
      return null;
    }
  }
);
