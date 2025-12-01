import TravelGuidePage from "@/components/website/TravelGuidePage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Travel Guide & FAQ | JVTO",
  description: "Your hub for essential travel information. Find FAQs, booking policies, and details on the Ijen health screening.",
};

export default function Reviews() {
  const travelGudideSchema = {
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
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={travelGudideSchema} />
      <TravelGuidePage />;
    </>
  );
}
