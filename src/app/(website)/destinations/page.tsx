// app/(website)/destinations/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  getPublicDestinationList,
  getPublicDestinationListSnapshot,
} from "@/lib/publicContent/destinationListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getPageSeo } from "@/lib/content/getPageSeo";
import DestinationsHub from "@/components/website/DestinationsHub";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";
const ROUTE = "/destinations";
export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

const fallbackSeo = {
  title: "East Java Destinations | Bromo, Ijen & More",
  h1: "Five destinations. One operator.",
  description:
    "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}${ROUTE}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/assets/img/og/destinations.webp`,
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${SITE_URL}/assets/img/og/destinations.webp`],
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationsPage() {
  const [seo, org] = await Promise.all([
    getPageSeo(ROUTE, fallbackSeo),
    getOrganizationProfile(),
  ]);

  // Rich snapshot items (includes geo.altitude, summary, tags) for the view
  const snapshot = getPublicDestinationListSnapshot();
  const items = snapshot.items;

  // Lightweight Destination[] for JSON-LD schema builders
  const destinations = getPublicDestinationList();

  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const breadcrumb = buildBreadcrumbJsonLd(ROUTE, SITE_URL);
  const collection = buildDestinationsCollectionJsonLd(destinations as any, SITE_URL);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, collection, breadcrumb].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={schema} />
      <DestinationsHub items={items} />
    </>
  );
}
