import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursHubIntro from "@/components/website/Tours/ToursHubIntro";
import ToursSupportGrid from "@/components/website/Tours/ToursSupportGrid";
import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";
import ToursFamilyGuide from "@/components/website/Tours/ToursFamilyGuide";
import ToursPageClient from "@/components/website/ToursPageClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPackageUrl } from "@/lib/packages/packagePaths";
import { getWebTourList } from "@/lib/packages/webTourList";
import { getTourFamilyGuideItems } from "@/lib/packages/tourFamily";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
import { BASE_URL } from "@/lib/site";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
export const revalidate = 3600;

const fallbackSeo = {
  title: "Private East Java Tours from Bali",
  h1: "Private Tours from Bali",
  description:
    "Browse private East Java tours from Bali with guided cross-island handling, proof-backed operator context, and clear route seriousness before booking.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours/from-bali", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/tours/from-bali",
    imageAlt: seo.h1,
  });
}

async function getToursFromBali(): Promise<ListTourPackage[]> {
  return getWebTourList({ fromId: 3, categoryId: 1 });
}

export default async function ToursPageBali() {
  const seo = await getPageSeo("/tours/from-bali", fallbackSeo);
  const [initialTours, org] = await Promise.all([
    getToursFromBali(),
    getOrganizationProfile(),
  ]);
  const familyGuideItems = getTourFamilyGuideItems(initialTours);
  const siteUrl = BASE_URL;
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
          url: getPackageUrl(tour.slug),
          name: tour.name,
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData data={schema} />
      <section className="min-h-screen bg-gray-50">
        <ToursHubIntro
          eyebrow="Tours from Bali"
          title={seo.h1}
          intro="Bali departures work best when East Java is one leg of a bigger trip and you want the harder cross-island movement handled as one private system instead of stitched together on your own."
          chips={[
            "Cross-island route logic",
            "Private transfer continuity",
            "Forward-moving journeys",
            "Ijen seriousness visible",
          ]}
          actions={[
            { label: "Back to Tours Hub", href: "/tours", variant: "primary" },
            { label: "Verify JVTO", href: "/verify-jvto", variant: "secondary" },
            { label: "Prepare & Book", href: "/travel-guide", variant: "ghost" },
          ]}
        />
        <ToursSupportGrid
          title="What matters before choosing a Bali route"
          copy="Bali-origin tours make more sense when transfer continuity, ferry handling, and Ijen seriousness are already understood before you compare package shapes."
          items={[
            {
              title: "Booking Information",
              copy: "Read this first if you want to understand the route flow before discussing dates.",
              href: "/travel-guide/booking-information",
              icon: "booking",
            },
            {
              title: "Weather & Closures",
              copy: "Useful when your route depends on volcano access and tighter timing windows.",
              href: "/travel-guide/weather-and-closures",
              icon: "trust",
            },
            {
              title: "Ijen Health Guide",
              copy: "Any Bali route with Ijen should be checked against this before shortlist decisions.",
              href: "/travel-guide/ijen-health-screening",
              icon: "screening",
            },
            {
              title: "Verify JVTO",
              copy: "Keep proof visible when the route relies on stronger operator handling.",
              href: "/verify-jvto",
              icon: "proof",
            },
          ]}
        />
        <ToursFamilyGuide
          eyebrow="Bali route families"
          title="Bali routes should be compared by handoff logic first."
          copy="Bali-origin packages are not just Java routes with a different pickup point. The real difference is whether the route returns to Bali, finishes forward into Surabaya, or expands into a broader cross-island overland."
          items={familyGuideItems}
        />
        <ToursCatalogShell
          eyebrow="Compare Bali routes"
          title="Use the catalog to judge transfer continuity and route shape together."
          description="Bali-origin routes become easier to compare when ferry handling, end-point logic, and Ijen seriousness stay visible beside the package list instead of being inferred later."
          bullets={[
            "Built for cross-island movement",
            "Return loop versus handoff matters early",
            "Useful for Bali-to-Java overlands",
          ]}
        >
          <ToursPageClient 
            initialTours={initialTours}
            destinationName="Bali"
            title={seo.h1}
            description={seo.description}
            hideHeader={true}
          />
        </ToursCatalogShell>
      </section>
    </>
  );
}
