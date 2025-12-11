import ReviewsPage from "@/components/website/ReviewsPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Reviews & Testimonials | JVTO Tours",
  description: "Read reviews from travelers who have experienced East Java with us. See why we have 5-star ratings on Google, TripAdvisor, and other platforms.",
};

export default function Reviews() {
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Why JVTO",
            item: "https://javavolcano-touroperator.com/why-jvto/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Reviews",
            item: "https://javavolcano-touroperator.com/why-jvto/reviews/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={reviewsSchema} />
      <ReviewsPage />;
    </>
  );
}
