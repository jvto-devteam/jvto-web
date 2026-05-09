import { getPublicHomeReviews } from "@/lib/publicContent/reviewSnapshot";
import HomeReviewsStatic from "./HomeReviewsStatic";

const Reviews = async () => {
  const allReviews = await getPublicHomeReviews();
  const reviews = allReviews.slice(0, 10);

  return <HomeReviewsStatic reviews={reviews} totalCount={allReviews.length} />;
};

export default Reviews;
