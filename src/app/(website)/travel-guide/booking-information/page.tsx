import BookingInformationPage from "@/components/website/BookingInformationPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Booking Information | Payments, Changes & Inclusions | JVTO",
  description: "How JVTO tours work: booking steps, payments, cancellations, logistics, inclusions, safety, and support. Ijen health certificate is included.",
};

export default function Reviews() {
  const bookingInformationSchema = {
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
            name: "Travel Guide",
            item: "https://javavolcano-touroperator.com/travel-guide/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Booking Information",
            item: "https://javavolcano-touroperator.com/travel-guide/booking-information/",
          }
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={bookingInformationSchema} />
      <BookingInformationPage />;
    </>
  );
}
