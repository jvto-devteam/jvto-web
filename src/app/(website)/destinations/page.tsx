import DestinationsPage from "@/components/website/DestinationsPage";
import StructuredData from "@/components/website/StructuredData";
export const metadata: Metadata = {
  title: "East Java Destinations | Bromo, Ijen & More | JVTO Tours",
  description: "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};

export default function Reviews() {
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
            name: "Destinations",
            item: "https://javavolcano-touroperator.com/destinations/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <DestinationsPage />;
    </>
  );
}
