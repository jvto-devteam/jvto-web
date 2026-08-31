// app/(website)/destinations/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getEcosystemDestinationsList } from "@/lib/ecosystemContent/destinationDetail";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { getEcosystemWebsitePage } from "@/lib/ecosystemContent/website";
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
    "Explore 5 East Java destinations with JVTO: Bromo 2,329 m, Ijen 2,386 m, Tumpak Sewu, Madakaripura, Papuma. Private tours, 4.8★ Trustpilot.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}${ROUTE}`,
      languages: {
        en: `${SITE_URL}${ROUTE}`,
        "x-default": `${SITE_URL}${ROUTE}`,
      },
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
  const [seo, org, ecosystemPage] = await Promise.all([
    getEcosystemPageSeo(ROUTE, fallbackSeo),
    getOrganizationProfile(),
    getEcosystemWebsitePage(ROUTE),
  ]);

  // Rich destination items (includes geo.altitude, summary, tags) for the view —
  // also doubles as the lightweight Destination[] for JSON-LD schema builders below
  // (DestinationListItem extends Destination).
  const items = await getEcosystemDestinationsList();
  const destinations = items;

  const pc = ((ecosystemPage?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as {
    transportNote?: string;
  };

  const orgNode = toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, SITE_URL));
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
      <DestinationsHub
        items={items}
        answerFirst={ecosystemPage?.raw.page.answerFirst}
        lastReviewed={ecosystemPage?.meta.lastReviewed ?? "2026-08-15"}
        transportNote={pc.transportNote}
      />
    </>
  );
}
