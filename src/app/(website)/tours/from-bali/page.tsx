import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Tours From Bali to Java | Bromo & Ijen Crater | JVTO",
  description:
    "Cross-island adventure from Bali to East Java. Includes ferry crossing, transport, and guided tours to Ijen Blue Fire and Mount Bromo. Drop-off in Bali or Surabaya.",
};

async function getToursFromBali(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Fetch khusus ID 3 (Bali)
  const res = await fetch(`${siteUrl}/api/packages/web?from=3&category=1`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch bali tours");
    return [];
  }
  return res.json();
}

export default async function ToursPageBali() {
  const initialTours = await getToursFromBali();

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
            name: "Tours From Bali",
            item: "https://javavolcano-touroperator.com/tours/from-bali",
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
          destinationName="Bali"
          description="Start your volcano adventure from the Island of Gods. We handle the ferry tickets and logistics for a seamless journey to witness Ijen's Blue Fire and Bromo's Sunrise."
        />
      </section>
    </>
  );
}