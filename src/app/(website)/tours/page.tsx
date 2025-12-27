import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Private Tours | East Java & Bali Adventures | JVTO",
  description:
    "Explore our complete collection of private tours in East Java and Bali. From Mount Bromo sunrise to Ijen Blue Fire and Tumpak Sewu Waterfall. Flexible starting points from Surabaya or Bali.",
};

async function getAllTours(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Fetch global (tanpa filter from=...)
  const res = await fetch(`${siteUrl}/api/packages/web?category=1`, {
    method: "GET",
    cache: "no-store", 
  });

  if (!res.ok) {
    console.error("Failed to fetch all tours");
    return [];
  }
  return res.json();
}

export default async function ToursPageGlobal() {
  const initialTours = await getAllTours();

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
            name: "All Tours",
            item: "https://javavolcano-touroperator.com/tours",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <section className="pt-28 pb-20 md:pt-40 md:pb-24 bg-gray-50 min-h-screen">
        <ToursPageClient 
          initialTours={initialTours}
          destinationName="All Destinations"
          description="Discover the ultimate collection of volcanic adventures, waterfall expeditions, and wildlife safaris across East Java and Bali."
          showLocationFilter={true} // <--- INI KUNCINYA
        />
      </section>
    </>
  );
}