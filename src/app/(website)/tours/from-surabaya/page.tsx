import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";

const fallbackSeo = {
  title: "Private Tours From Surabaya | Bromo, Ijen & Tumpak Sewu",
  h1: "Surabaya Tours",
  description:
    "Explore East Java starting from Surabaya. Best private tours to Mount Bromo sunrise, Ijen Blue Fire, and Madakaripura Waterfall. All-inclusive & hassle-free.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours/from-surabaya", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getToursFromSurabaya(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Fetch khusus ID 4 (Surabaya)
  const res = await fetch(`${siteUrl}/api/packages/web?from=4&category=1`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch surabaya tours");
    return [];
  }
  return res.json();
}

export default async function ToursPageSurabaya() {
  const seo = await getPageSeo("/tours/from-surabaya", fallbackSeo);
  const initialTours = await getToursFromSurabaya();

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
            name: "Tours From Surabaya",
            item: "https://javavolcano-touroperator.com/tours/from-surabaya",
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
          destinationName="Surabaya"
          title={seo.h1}
          description={seo.description}
        />
      </section>
    </>
  );
}
