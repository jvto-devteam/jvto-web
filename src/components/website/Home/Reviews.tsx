import ReviewsClient from "./ReviewsClient";
import { prisma } from "@/lib/prisma";

const Reviews = async () => {
  const raw = await prisma.reviews.findMany({
    where: {
      platform: { equals: "Trustpilot" },
    },
    orderBy: { date: "desc" },
  });

  const reviews = raw.map((r) => ({
    name: r.customer_name,
    date: r.date,
    url: r.url || r.url_reference,
    stars: Number(r.star),
    title: r.review?.substring(0, 60) ?? "",
    text: r.review ?? "",
    verified: true,
  }));

  return <ReviewsClient reviews={reviews} />;
};

export default Reviews;
