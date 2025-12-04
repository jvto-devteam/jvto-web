import DestinationsPage from "@/components/website/DestinationsPage";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from 'next'
import type { Destination } from "@/interfaces";
export const metadata: Metadata = {
  title: "East Java Destinations | Bromo, Ijen & More | JVTO Tours",
  description: "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};
async function getAllDestinations(): Promise<Destination[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/destinations/web`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}

export default async function Destinations() {
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
 const destinations = await getAllDestinations();
  return (
    <>
      <StructuredData data={schema} />
      <DestinationsPage destinations={destinations} />;
    </>
  );
}
