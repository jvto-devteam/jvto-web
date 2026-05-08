import ReviewsClient from "./ReviewsClient";
import { getPublicHomeReviews } from "@/lib/publicContent/reviewSnapshot";

const Reviews = async () => {
  const reviews = (await getPublicHomeReviews()).slice(0, 12);

  return <ReviewsClient reviews={reviews} />;
};

export default Reviews;
