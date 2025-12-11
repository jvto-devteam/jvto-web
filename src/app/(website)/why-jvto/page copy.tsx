import WhyJVTOPage from "@/components/website/WhyJVTOPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Why Choose JVTO: A Framework of Verifiable Trust",
  description: "The only East Java operator founded by an active Tourist Police officer, with verifiable legal compliance (TDUP, AHU) and a public record of excellence on TripAdvisor and Google.",
};

export default function WhyJVTO() {
  const whyJVTOSchema = {
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
          }
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={whyJVTOSchema} />
      <WhyJVTOPage />;
    </>
  );
}
