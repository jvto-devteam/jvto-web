import IjenHealthScreeningPage from "@/components/website/IjenHealthScreeningPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Ijen Health Screening — Real Checks, Digital Proof | JVTO",
  description: "Learn how JVTO includes real health screening for Ijen hikes and supports digital, QR-verified clearance for all travelers..",
};

export default function Reviews() {
  const ijenHealthScreeningSchema = {
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
            name: "Ijen Health Screening",
            item: "https://javavolcano-touroperator.com/travel-guide/ijen-health-screening/",
          },        
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={ijenHealthScreeningSchema} />
      <IjenHealthScreeningPage />;
    </>
  );
}
