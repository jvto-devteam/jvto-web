// app/(website)/destinations/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import DestinationCard from "@/components/website/DestinationCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";
const ROUTE = "/destinations";
export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

const fallbackSeo = {
  title: "East Java Destinations | Bromo, Ijen & More",
  h1: "Destinations",
  description:
    "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: ROUTE,
    image: "/assets/img/og/destinations.webp",
    imageAlt: seo.h1,
  });
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getAllDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/destinations/web`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[destinations] fallback to empty list: ${message}`);
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationsPage() {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  const [destinations, org] = await Promise.all([
    getAllDestinations(),
    getOrganizationProfile(),
  ]);

  // Build @graph — tidak ada @context di tiap node, hanya di root
  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const breadcrumb = buildBreadcrumbJsonLd(ROUTE, SITE_URL);
  const collection = buildDestinationsCollectionJsonLd(
    destinations as any,
    SITE_URL,
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, collection, breadcrumb].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="md:py-40 py-26 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              {/* h2 → h1: sebelumnya tidak ada h1 di halaman ini */}
              <h1 className="text-3xl md:text-4xl font-black uppercase mb-4">
                {seo.h1}
              </h1>
              <p className="text-gray-600 max-w-xl">
                {seo.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* key={dest.id} lebih stabil dari key={idx} */}
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
