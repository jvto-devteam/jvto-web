import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
export const revalidate = 3600;

const fallbackSeo = {
  title: "All Private Tours | East Java & Bali Adventures",
  h1: "All Destinations Tours",
  description:
    "Explore our complete collection of private tours in East Java and Bali. From Mount Bromo sunrise to Ijen Blue Fire and Tumpak Sewu Waterfall. Flexible starting points from Surabaya or Bali.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getAllTours(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Fetch global (tanpa filter from=...)
  const res = await fetch(`${siteUrl}/api/packages/web?category=1`, {
    method: "GET",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Failed to fetch all tours");
    return [];
  }
  return res.json();
}

export default async function ToursPageGlobal() {
  const seo = await getPageSeo("/tours", fallbackSeo);
  const initialTours = await getAllTours();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/tours#collection`,
        url: `${siteUrl}/tours`,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/tours#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/tours#breadcrumb`,
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
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/tours#itemlist`,
        name: seo.h1,
        numberOfItems: initialTours.length,
        itemListElement: initialTours.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/${tour.slug}`,
          name: tour.name,
        })),
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
          title={seo.h1}
          description={seo.description}
          showLocationFilter={true} // <--- INI KUNCINYA
        />
      </section>
    </>
  );
}
