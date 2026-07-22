import { getPublicReviewPreviewWithFallback } from "@/lib/publicContent/reviewApiSnapshot";
import { GoogleReviewsCarouselClient } from "./GoogleReviewsCarouselClient";

export async function GoogleReviewsCarousel() {
  const preview = await getPublicReviewPreviewWithFallback();
  const google = preview.reviews.filter((r) => r.platform === "Google");
  if (google.length === 0) return null;
  return <GoogleReviewsCarouselClient reviews={google} />;
}
