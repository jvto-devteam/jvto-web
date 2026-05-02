import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
import {
  buildToursHubFaqSchema,
  buildToursHubAggregateRatingSchema,
} from "@/lib/schemas/buildToursHubSchemas";
export const revalidate = 3600;

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
  // Refactored 2026-04-29: direct helper call (was self-fetch broke SSG with ECONNREFUSED).
  // fromId=4 = Surabaya start_destination per live's data convention.
  try {
    return (await getWebPackagesList({ fromId: 4, categoryId: 1 })) as unknown as ListTourPackage[];
  } catch (error) {
    console.error("Failed to fetch surabaya tours", error);
    return [];
  }
}

export default async function ToursPageSurabaya() {
  const seo = await getPageSeo("/tours/from-surabaya", fallbackSeo);
  const [initialTours, org] = await Promise.all([
    getToursFromSurabaya(),
    getOrganizationProfile(),
  ]);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-surabaya`;
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#collection` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: seo.h1,
        description: seo.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tours From Surabaya",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
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

  // AEO/GEO port (2026-04-29): hub-level FAQPage + standalone AggregateRating per Cluster 1 hub MH.
  const hubFaqSchema = buildToursHubFaqSchema();
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: 'from-surabaya' });

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      <StructuredData data={hubAggregateRatingSchema} />
      <section className="pt-28 pb-20 md:pt-40 md:pb-24 bg-gray-50 min-h-screen">
        <ToursPageClient
          initialTours={initialTours}
          destinationName="Surabaya"
          title={seo.h1}
          description={seo.description}
        />

        <section className="container mx-auto px-6 mt-16">
          <div className="rounded-sm border border-gray-200 bg-white p-8 md:p-10">
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
