import ReviewsClient from "./ReviewsClient";
import { getPublicHomeReviews } from "@/lib/publicContent/reviewSnapshot";

const Reviews = async () => {
  const reviews = await getPublicHomeReviews();

  return <ReviewsClient reviews={reviews} />;
};

export default Reviews;
