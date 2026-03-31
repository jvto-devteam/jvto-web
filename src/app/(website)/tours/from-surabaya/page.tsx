import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursHubIntro from "@/components/website/Tours/ToursHubIntro";
import ToursSupportGrid from "@/components/website/Tours/ToursSupportGrid";
import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";
import ToursPageClient from "@/components/website/ToursPageClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getWebTourList } from "@/lib/packages/webTourList";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
export const revalidate = 3600;

const fallbackSeo = {
  title: "Private Tours From Surabaya | Bromo, Ijen & Tumpak Sewu",
  h1: "Surabaya Tours",
  description:
    "Explore East Java starting from Surabaya. Best private tours to Mount Bromo sunrise, Ijen Blue Fire, and Madakaripura Waterfall. All-inclusive & hassle-free.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours/from-surabaya", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/tours/from-surabaya",
    imageAlt: seo.h1,
  });
}

async function getToursFromSurabaya(): Promise<ListTourPackage[]> {
  return getWebTourList({ fromId: 4, categoryId: 1 });
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

  return (
    <>
      <StructuredData data={schema} />
      <section className="min-h-screen bg-gray-50">
        <ToursHubIntro
          eyebrow="Tours from Surabaya"
          title={seo.h1}
          intro="Surabaya is the strongest mainland entry when you want the widest route range with clearer airport logic, cleaner comparison, and less cross-island friction before the trip even starts."
          chips={[
            "Mainland start logic",
            "Shortest to longest route range",
            "Ijen-ready choices",
            "Private handling only",
          ]}
          actions={[
            { label: "Back to Tours Hub", href: "/tours", variant: "primary" },
            { label: "Verify JVTO", href: "/verify-jvto", variant: "secondary" },
            { label: "Prepare & Book", href: "/travel-guide", variant: "ghost" },
          ]}
        />
        <ToursSupportGrid
          title="What matters before choosing a Surabaya route"
          copy="The best Surabaya route usually comes from matching available days, destination seriousness, and route comfort level before you start discussing dates."
          items={[
            {
              title: "Booking Information",
              copy: "Use this first if you want the clearest next step after picking a route family.",
              href: "/travel-guide/booking-information",
              icon: "booking",
            },
            {
              title: "Packing & Fitness",
              copy: "Useful before longer routes or any package with more varied terrain and pacing.",
              href: "/travel-guide/packing-and-fitness",
              icon: "trust",
            },
            {
              title: "Ijen Health Guide",
              copy: "Read this before narrowing any route that includes Ijen.",
              href: "/travel-guide/ijen-health-screening",
              icon: "screening",
            },
            {
              title: "Verify JVTO",
              copy: "Keep operator proof close while comparing route families.",
              href: "/verify-jvto",
              icon: "proof",
            },
          ]}
        />
        <ToursCatalogShell
          eyebrow="Compare Surabaya routes"
          title="Shortlist by route seriousness, not by headline alone."
          description="Surabaya departures can range from easy Bromo-focused entries to longer East Java overlands. Use the browser below to separate timing, route density, and Ijen readiness before discussing dates."
          bullets={[
            "Best for mainland airport logic",
            "Useful for longer overland structures",
            "Strongest route range in one hub",
          ]}
        >
          <ToursPageClient 
            initialTours={initialTours}
            destinationName="Surabaya"
            title={seo.h1}
            description={seo.description}
            hideHeader={true}
          />
        </ToursCatalogShell>
      </section>
    </>
  );
}
