import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
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
  // Refactored 2026-04-29: direct helper call (was self-fetch broke SSG with ECONNREFUSED).
  try {
    return (await getWebPackagesList({ categoryId: 1 })) as unknown as ListTourPackage[];
  } catch (error) {
    console.error("Failed to fetch all tours", error);
    return [];
  }
}

export default async function ToursPageGlobal() {
  const [seo, initialTours, org] = await Promise.all([
    getPageSeo("/tours", fallbackSeo),
    getAllTours(),
    getOrganizationProfile(),
  ]);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
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

  // AEO/GEO port (2026-04-29): hub-level FAQPage (3 canonical Q&A from getToursHubQaPairs)
  // + standalone AggregateRating cross-ref to Organization. Per cluster_role_contracts.md Cluster 1 hub MH.
  const hubFaqSchema = buildToursHubFaqSchema();
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: '' });

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      <StructuredData data={hubAggregateRatingSchema} />
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
