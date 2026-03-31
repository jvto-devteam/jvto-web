import ReviewsClient from "./ReviewsClient";
import { prisma } from "@/lib/prisma";

const Reviews = async () => {
  let raw: Array<{
    customer_name: string | null;
    date: Date;
    url: string | null;
    url_reference: string | null;
    star: number | bigint | null;
    review: string | null;
  }> = [];

  try {
    raw = await prisma.reviews.findMany({
      where: {
        platform: { equals: "Trustpilot" },
      },
      select: {
        customer_name: true,
        date: true,
        url: true,
        url_reference: true,
        star: true,
        review: true,
      },
      orderBy: { date: "desc" },
      take: 12,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[home-reviews] fallback to empty list: ${message}`);
    raw = [];
  }

  const reviews = raw.map((r) => ({
    name: r.customer_name,
    date: r.date.toISOString(),
    url: r.url || r.url_reference,
    stars: Number(r.star),
    title: r.review?.substring(0, 60) ?? "",
    text: r.review ?? "",
    verified: true,
  }));

  return <ReviewsClient reviews={reviews} />;
};

export default Reviews;
