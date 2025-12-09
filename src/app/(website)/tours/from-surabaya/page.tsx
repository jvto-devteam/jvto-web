import { ListTourPackage } from "@/types";
import ToursPageClient from "@/components/website/ToursPageClient"; // yang interaktif saja
import StructuredData from "@/components/website/StructuredData";
import TourCard from "@/components/website/Tours/TourCard";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "All Private Tours in East Java | JVTO Tours",
  description:
    "Browse our complete collection of private, all-inclusive tours to Mount Bromo, Ijen Crater, Tumpak Sewu, and more. Find your perfect adventure.",
};

// Fungsi untuk fetch semua data tours (bisa dipanggil di server)
async function getAllTours(): Promise<ListTourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/packages/web?from=4`, {
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
      <section className="md:py-40 py-26  bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
              Tours From Surabaya
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of private, all-inclusive tours from Surabaya to
              Mount Bromo, Ijen Crater, Tumpak Sewu, and more. Find your perfect
              adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialTours.map((tour) => (
              <div key={tour.id} className="h-[500px]">
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <ToursPageClient isFilter={false} initialTours={initialTours} /> */}
    </>
  );
}
