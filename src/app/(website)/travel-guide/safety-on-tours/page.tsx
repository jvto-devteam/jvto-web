import SafetyOnToursPage from "@/components/website/SafetyOnToursPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Safety on Tours | JVTO's Protocols & Standards",
  description: "Our police-led safety culture in practice. Learn about our vehicle standards, guide training, Ijen safety protocols, and emergency procedures.",
};

export default function Reviews() {
  const safetyOnToursSchema = {
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
            name: "Safety on Tours",
            item: "https://javavolcano-touroperator.com/travel-guide/safety-on-tours/",
          },        
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={safetyOnToursSchema} />
      <SafetyOnToursPage />;
    </>
  );
}
