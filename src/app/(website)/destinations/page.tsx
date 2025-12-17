import Link from "next/link";
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import DestinationCard from "@/components/website/DestinationCard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "East Java Destinations | Bromo, Ijen & More | JVTO Tours",
  description:
    "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
  openGraph: {
    title: "East Java Destinations | Bromo, Ijen & More | JVTO Tours",
    description:
      "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
    url: `${siteUrl}/destinations`,
    siteName: "Java Volcano Tour Operator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/og/destinations.webp",
        width: 1200,
        height: 630,
        alt: "Destinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "East Java Destinations | Bromo, Ijen & More | JVTO Tours",
    description:
      "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
    images: [siteUrl + "/assets/img/og/destinations.webp"],
  },
};
async function getAllDestinations(): Promise<Destination[]> {
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
      <section className="md:py-40 py-26 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
                Destinations
              </h2>
              <p className="text-gray-600 max-w-xl">
                From the fires of Ijen to the waters of Tumpak Sewu. Discover
                the elemental landscapes of East Java.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest, idx) => (
              <DestinationCard key={idx} destination={dest} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
