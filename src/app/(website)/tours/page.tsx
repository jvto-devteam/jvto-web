import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursHubIntro from "@/components/website/Tours/ToursHubIntro";
import ToursSupportGrid from "@/components/website/Tours/ToursSupportGrid";
import ToursCatalogShell from "@/components/website/Tours/ToursCatalogShell";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
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
  title: "All Private Tours | East Java & Bali Adventures",
  h1: "All Destinations Tours",
  description:
    "Explore our complete collection of private tours in East Java and Bali. From Mount Bromo sunrise to Ijen Blue Fire and Tumpak Sewu Waterfall. Flexible starting points from Surabaya or Bali.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/tours", fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/tours",
    imageAlt: seo.h1,
  });
}

async function getAllTours(): Promise<ListTourPackage[]> {
  return getWebTourList({ categoryId: 1 });
}

export default async function ToursPageGlobal() {
  const seo = await getPageSeo("/tours", fallbackSeo);
  const [initialTours, org] = await Promise.all([
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

  return (
    <>
      <StructuredData data={schema} />
      <section className="min-h-screen bg-gray-50">
        <ToursHubIntro
          eyebrow="Tours"
          title={seo.h1}
          intro="Start with the route logic that fits your departure point, timing, and seriousness level. JVTO should help you compare clearly before you ever reach payment."
          chips={[
            "Private tours only",
            "Surabaya + Bali departures",
            "Proof before payment",
            "Ijen readiness visible",
          ]}
          actions={[
            { label: "Surabaya Routes", href: "/tours/from-surabaya", variant: "primary" },
            { label: "Bali Routes", href: "/tours/from-bali", variant: "secondary" },
            { label: "Verify JVTO", href: "/verify-jvto", variant: "ghost" },
          ]}
        />
        <ToursSupportGrid
          title="Use the tours hub as a decision system, not just a list"
          copy="The right package usually becomes obvious faster when support, proof, and Ijen seriousness stay close to the catalog instead of being hidden elsewhere."
          items={[
            {
              title: "Open Proof Library",
              copy: "Check legal, police, media, and history proof before comparing dates.",
              href: "/verify-jvto",
              icon: "proof",
            },
            {
              title: "Read Booking Information",
              copy: "See how booking, deposits, and preparation work before you commit.",
              href: "/travel-guide/booking-information",
              icon: "booking",
            },
            {
              title: "Read Ijen Screening",
              copy: "Any Ijen shortlist should be filtered through health and access logic first.",
              href: "/travel-guide/ijen-health-screening",
              icon: "screening",
            },
            {
              title: "Why JVTO",
              copy: "Understand who runs the route and why the operator context matters.",
              href: "/why-jvto",
              icon: "trust",
            },
          ]}
        />
        <ToursCatalogShell
          eyebrow="Compare routes"
          title="Use the catalog to narrow route fit, not just to browse."
          description="The browser below should work like a shortlist engine. Start by filtering departure logic, then compare intensity, route shape, and the support pages each choice needs."
          bullets={[
            "Filter by departure logic first",
            "Use support routes before payment",
            "Keep proof close while comparing",
          ]}
        >
          <ToursPageClient 
            initialTours={initialTours}
            destinationName="All Destinations"
            title={seo.h1}
            description={seo.description}
            showLocationFilter={true}
            hideHeader={true}
          />
        </ToursCatalogShell>
      </section>
    </>
  );
}
