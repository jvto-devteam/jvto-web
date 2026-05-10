import { getPublicHomeReviews } from "@/lib/publicContent/reviewSnapshot";
import ReviewsClient from "./ReviewsClient";

const Reviews = async () => {
  const allReviews = await getPublicHomeReviews();
  const reviews = allReviews.slice(0, 10);

  return <ReviewsClient reviews={reviews} totalCount={allReviews.length} />;
};

export default Reviews;
