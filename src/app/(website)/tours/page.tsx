import { TourPackage } from "@/types";
import ToursPageClient from "./ToursPageClient"; // yang interaktif saja
import StructuredData from "@/components/website/StructuredData";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "All Private Tours in East Java | JVTO Tours",
  description:
    "Browse our complete collection of private, all-inclusive tours to Mount Bromo, Ijen Crater, Tumpak Sewu, and more. Find your perfect adventure.",
};

// Fungsi untuk fetch semua data tours (bisa dipanggil di server)
async function getAllTours(): Promise<TourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/packages/web`, {
    // Tanpa ?from untuk fetch semua tours
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}

export default async function ToursPage() {
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
      <ToursPageClient initialTours={initialTours} />
    </>
  );
}
