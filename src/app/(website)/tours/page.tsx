import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";
import type { QaPair } from "@/lib/tourFaqs";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";
import { buildToursHubFaqSchema } from "@/lib/schemas/buildToursHubSchemas";
export const revalidate = 3600;
const HUB_LAST_REVIEWED = "2026-08-15";

const fallbackSeo = {
  title: "All Private Tours | East Java & Bali Adventures",
  h1: "Private Bromo, Ijen & Tumpak Sewu Tours",
  description:
    "Browse JVTO private East Java tours from Surabaya or Bali, including Bromo sunrise, Ijen blue fire, Tumpak Sewu, Madakaripura, and Papuma Beach.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/tours", fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
  };
}

async function getAllTours(): Promise<ListTourPackage[]> {
  return getEcosystemPackagesList({ categoryId: 1 });
}

function compactIdr(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "IDR";
  return `IDR ${(value / 1_000_000).toFixed(2).replace(/\.00$/, "")}M/pax`;
}

export default async function ToursPageGlobal() {
  const [seo, initialTours, org, page] = await Promise.all([
    getEcosystemPageSeo("/tours", fallbackSeo),
    getAllTours(),
    getOrganizationProfile(),
    loadEcosystemPage("/tours"),
  ]);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as {
    hubFaqPairs?: QaPair[];
  };
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const orgNode = toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, siteUrl));
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

  // AEO/GEO port (2026-04-29): hub-level FAQPage (3 canonical Q&A from getToursHubQaPairs).
  // Per cluster_role_contracts.md Cluster 1 hub MH. aggregateRating is no longer
  // assembled here — it's an inline property of the Organization node `orgNode` above
  // already carries through toOrganizationReferenceOnly() (Bagian 1 relocation).
  const hubFaqSchema = buildToursHubFaqSchema(pc.hubFaqPairs);
  const minPrice = Math.min(
    ...initialTours
      .map((tour) => Number(tour.startFrom))
      .filter((price) => Number.isFinite(price) && price > 0),
  );
  const answerFirst =
    `Choose from ${initialTours.length} private Bromo, Ijen, Tumpak Sewu, Madakaripura and Papuma tours from Surabaya or Bali. ` +
    `JVTO runs no shared groups: each booking gets private transport, confirmed crew, all-inclusive planning, Tourist Police-led safety culture and review proof. ` +
    `Prices start from ${compactIdr(minPrice)}.`;

  return (
    <>
      <StructuredData data={schema} />
      <StructuredData data={hubFaqSchema} />
      <section className="pt-28 pb-20 md:pt-40 md:pb-24 bg-gray-50 min-h-screen">
        <ToursPageClient
          initialTours={initialTours}
          destinationName="All Destinations"
          title={seo.h1}
          description={seo.description}
          answerFirst={answerFirst}
          lastReviewed={HUB_LAST_REVIEWED}
          showLocationFilter={true} // <--- INI KUNCINYA
        />
      </section>
    </>
  );
}
