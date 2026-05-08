// app/(website)/destinations/[slug]/page.tsx
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import type { DestinationDetail } from "@/interfaces";
import DestinationDetailView from "@/components/website/DestinationDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  getPublicDestinationDetail,
  getPublicDestinationDetailStaticParams,
} from "@/lib/publicContent/destinationDetailSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
export const revalidate = 3600;
export const dynamicParams = false;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublicDestinationDetailStaticParams();
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

const getDestination = cache(
  async (slug: string): Promise<DestinationDetail | null> =>
    getPublicDestinationDetail(slug),
);

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDestination(slug);

  if (!data) return { title: "Destination Not Found" };

  const title = data.seo_title?.trim() || `${data.name} | JVTO Tours`;
  const description =
    data.seo_description?.trim() ||
    data.summary ||
    data.highlight ||
    "";
  const imageUrl = data.banner?.url
    ? data.banner.url.startsWith("http")
      ? data.banner.url
      : `${SITE_URL}${data.banner.url}`
    : `${SITE_URL}/assets/img/og/destinations.webp`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/destinations/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/destinations/${slug}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: data.banner?.alt ?? data.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;

  const [data, org] = await Promise.all([
    getDestination(slug),
    getOrganizationProfile(),
  ]);

  if (!data) notFound();

  // ── Schema @graph ──────────────────────────────────────────────────────────
  //
  // schema_json dari DB sudah berisi @graph lengkap per destination:
  //   TouristAttraction, WebPage, BreadcrumbList, SafetyProtocol, dll
  //
  // Kita strip Organization & WebSite dari sana (ada di node terpisah),
  // lalu inject Organization + WebSite dari organization_profile DB.

  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const destNodes = extractDestinationNodes(data.schema_json ?? null);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, ...destNodes].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView data={data} />
    </>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Ambil nodes dari schema_json DB, strip Organization & WebSite
 * karena sudah dihandle dari organization_profile.
 */
function extractDestinationNodes(
  schema_json: Record<string, any> | null,
): any[] {
  if (!schema_json) return [];

  const graph: any[] = Array.isArray(schema_json)
    ? schema_json
    : Array.isArray(schema_json["@graph"])
      ? schema_json["@graph"]
      : [];

  const ORG_TYPES = ["Organization", "LocalBusiness", "TravelAgency"];
  const SKIP_TYPES = [...ORG_TYPES, "WebSite"];

  return graph.filter((node: any) => {
    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];
    return !types.some((t: string) => SKIP_TYPES.includes(t));
  });
}
