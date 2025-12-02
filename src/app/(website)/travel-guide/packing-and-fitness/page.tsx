import PackingAndFitnessPage from "@/components/website/PackingAndFitnessPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Packing & Fitness Guide for Bromo & Ijen | JVTO",
  description: "A practical guide on what to pack and the fitness levels required for your private tour in East Java. Prepare for volcano treks and waterfalls..",
};

export default function PackingAndFitness() {
  const packingAndFitnessSchema = {
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
            name: "Packing and Fitness",
            item: "https://javavolcano-touroperator.com/travel-guide/packing-and-fitness/",
          },        
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={packingAndFitnessSchema} />
      <PackingAndFitnessPage />;
    </>
  );
}
