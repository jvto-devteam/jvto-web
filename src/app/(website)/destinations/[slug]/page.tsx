// app/(website)/destinations/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { DestinationDetail } from "@/interfaces";
import DestinationDetailView from "@/components/website/DestinationDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { prisma } from "@/lib/prisma";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
export const revalidate = 3600;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  let destinations: Array<{ slug: string | null }> = [];
  try {
    destinations = await prisma.destinations.findMany({
      where: {
        published: true,
        deleted_at: null,
        slug: { not: null },
        id: { notIn: [3, 4] },
      },
      select: { slug: true },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[static-params] destinations fallback to empty list: ${message}`);
    return [];
  }

  return destinations
    .map((destination) => destination.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getDestination(slug: string): Promise<DestinationDetail | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/destinations/web/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Failed to fetch destination: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[destination-detail] fallback to null for ${slug}: ${message}`);
    return null;
  }
}

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

  return buildWebsiteMetadata({
    title,
    description,
    path: `/destinations/${slug}`,
    image: imageUrl,
    imageAlt: data.banner?.alt ?? data.name,
  });
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
