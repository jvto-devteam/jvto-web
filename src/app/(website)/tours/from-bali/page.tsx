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
  title: "Private Tours From Bali to Java | Bromo & Ijen Crater",
  h1: "Bali Tours",
  description:
    "Cross-island adventure from Bali to East Java. Includes ferry crossing, transport, and guided tours to Ijen Blue Fire and Mount Bromo. Drop-off in Bali or Surabaya.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours/from-bali", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getToursFromBali(): Promise<ListTourPackage[]> {
  // Refactored 2026-04-29: direct helper call (was self-fetch broke SSG with ECONNREFUSED).
  // fromId=3 = Bali start_destination per live's data convention.
  try {
    return (await getWebPackagesList({ fromId: 3, categoryId: 1 })) as unknown as ListTourPackage[];
  } catch (error) {
    console.error("Failed to fetch bali tours", error);
    return [];
  }
}

export default async function ToursPageBali() {
  const seo = await getPageSeo("/tours/from-bali", fallbackSeo);
  const [initialTours, org] = await Promise.all([
    getToursFromBali(),
    getOrganizationProfile(),
  ]);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-bali`;
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
            name: "Tours From Bali",
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
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: 'from-bali' });

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      <StructuredData data={hubAggregateRatingSchema} />
      <section className="pt-28 pb-20 md:pt-40 md:pb-24 bg-gray-50 min-h-screen">
        <ToursPageClient
          initialTours={initialTours}
          destinationName="Bali"
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
                  Travellers from Singapore often prefer the Bali-to-Java route when they want to combine a Bali stay with a private Bromo or Ijen extension instead of entering East Java first. This setup is useful for guests already holidaying in Bali and looking for a managed cross-island volcano trip with ferry logistics, driver coordination, and fixed timing handled in one booking.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Malaysia</h3>
                <p className="text-gray-700 leading-relaxed">
                  For travellers departing from Malaysia, starting from Bali can make sense when the wider trip already includes Ubud, Seminyak, or South Bali before moving toward East Java. A Bali departure is especially relevant for visitors who want to avoid planning the ferry segment themselves and prefer a private operator to manage the transition into Ijen or Bromo.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Hong Kong</h3>
                <p className="text-gray-700 leading-relaxed">
                  Guests travelling from Hong Kong frequently look for Bromo or Ijen trips that begin after a few nights in Bali, and this route is built for that pattern. It suits travellers who want a Bali pickup, an organized overland crossing into East Java, and a private itinerary without having to stitch together ferry tickets, transfers, and local transport on their own.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-jvto-dark">From Taiwan</h3>
                <p className="text-gray-700 leading-relaxed">
                  For travellers from Taiwan, Bali can be the more natural departure point when East Java is planned as an extension rather than the first stop in Indonesia. This route works well for private travellers who want a clearer handover from Bali accommodation to volcano operations, with managed transport and a simpler path into Ijen, Bromo, or onward drop-off.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
