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

        <section className="container mx-auto px-6 mt-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-8 text-jvto-dark">
              Travelling from Singapore, Malaysia, Hong Kong, or Taiwan?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Singapore</h3>
                <p className="text-gray-700 leading-relaxed">
                  For travellers flying from Singapore, Surabaya is often the most practical gateway into East Java before continuing by private car to Bromo, Ijen, or Tumpak Sewu. This route suits visitors who want a clear airport-to-mountain transfer without piecing together trains, shared shuttles, or local taxis after arrival in Indonesia.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Malaysia</h3>
                <p className="text-gray-700 leading-relaxed">
                  Travellers from Malaysia frequently use Surabaya as the easiest arrival point for East Java volcano trips, especially when they want direct onward ground support to Bromo and Ijen. A private Surabaya departure also helps guests who prefer fixed pick-up, simpler timing, and a single operator managing the overland part of the journey.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Hong Kong</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you are travelling from Hong Kong and looking for a smoother East Java entry point, Surabaya can work well for private volcano itineraries with structured arrival support. Many guests choose this option when they want to land, meet the driver, and continue directly toward Bromo or multi-day combinations without extra domestic coordination stress.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Taiwan</h3>
                <p className="text-gray-700 leading-relaxed">
                  For travellers departing from Taiwan, Surabaya is a sensible base if the priority is reaching East Java efficiently and starting the land program with minimal friction. It works especially well for visitors booking private tours who value confirmed logistics, airport pick-up clarity, and a more controlled route into Bromo, Ijen, and nearby highlights.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
