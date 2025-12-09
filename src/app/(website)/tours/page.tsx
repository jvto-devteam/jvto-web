import LevelSelector from "@/components/website/Home/LevelSelector";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "All Private Tours in East Java | JVTO Tours",
  description:
    "Browse our complete collection of private, all-inclusive tours to Mount Bromo, Ijen Crater, Tumpak Sewu, and more. Find your perfect adventure.",
};

export default async function ToursPage() {
  const schema = {
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
            name: "Tours",
            item: "https://javavolcano-touroperator.com/tours/",
          },
        ],
      },
    ],
  };
  return (
    <>
      <StructuredData data={schema} />
      <LevelSelector />

      {/* <ToursPageClient isFilter={true} initialTours={initialTours} /> */}
    </>
  );
}
