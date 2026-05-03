// app/(website)/destinations/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
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
import { getWebDestinationDetail } from "@/lib/destinations/getWebDestinationDetail";
import { getToursByDestination } from "@/lib/queries/toursByDestination";
import {
  buildToursIncludingDestSchema,
  buildDestinationTravelGuideHandoffSchema,
} from "@/lib/schemas/buildDestinationsSchemas";
export const revalidate = 3600;

const DEST_TRAVEL_GUIDE_LINKS: Record<string, { href: string; label: string }> = {
  "ijen-crater": { href: "/travel-guide/ijen-health-screening", label: "Ijen Health Screening" },
  "mount-bromo": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  "tumpak-sewu-waterfall": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  "madakaripura-waterfall": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
};

const DEST_RELATED: Record<string, Array<{ slug: string; name: string }>> = {
  "ijen-crater": [{ slug: "mount-bromo", name: "Mount Bromo" }, { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }],
  "mount-bromo": [{ slug: "ijen-crater", name: "Ijen Crater" }, { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }],
  "tumpak-sewu-waterfall": [{ slug: "ijen-crater", name: "Ijen Crater" }, { slug: "mount-bromo", name: "Mount Bromo" }],
  "madakaripura-waterfall": [{ slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }, { slug: "mount-bromo", name: "Mount Bromo" }],
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const destinations = await prisma.destinations.findMany({
    where: {
      published: true,
      deleted_at: null,
      slug: { not: null },
      id: { notIn: [3, 4] },
    },
    select: { slug: true },
  });

  return destinations
    .map((destination) => destination.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getDestination(slug: string): Promise<DestinationDetail | null> {
  // Refactored 2026-04-29 (Phase 4.8): direct helper call (was self-fetch broke SSG with ECONNREFUSED).
  try {
    const data = await getWebDestinationDetail(slug);
    return (data as DestinationDetail | null) ?? null;
  } catch (error) {
    console.error("Failed to fetch destination", error);
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

  // AEO/GEO port (2026-04-29) Phase 4.8: reverse-lookup tours-including ItemList +
  // travel-guide cross-link handoff. Per cluster_role_contracts.md Cluster 7 destination MH
  // (un-orphans the cluster: gives AI a discoverable tours list per destination).
  const tours = await getToursByDestination(slug);
  const destinationName = data.name ?? slug;
  const toursIncludingNode = buildToursIncludingDestSchema({
    destinationSlug: slug,
    destinationName,
    tours,
  });
  const travelGuideHandoffNode = buildDestinationTravelGuideHandoffSchema({
    destinationSlug: slug,
    destinationName,
  });

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      ...destNodes,
      toursIncludingNode,
      travelGuideHandoffNode,
    ].filter(Boolean),
  };

  const travelGuideLink = DEST_TRAVEL_GUIDE_LINKS[slug];
  const relatedDests = DEST_RELATED[slug] ?? [];

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView data={data} />
      {(travelGuideLink || relatedDests.length > 0) && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl py-8 flex flex-col sm:flex-row gap-8">
            {travelGuideLink && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Travel Guide</p>
                <Link href={travelGuideLink.href} className="text-sm font-semibold text-gray-900 hover:text-green-700 transition-colors">
                  {travelGuideLink.label} →
                </Link>
              </div>
            )}
            {relatedDests.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Related Destinations</p>
                <div className="flex flex-wrap gap-6">
                  {relatedDests.map((d) => (
                    <Link key={d.slug} href={`/destinations/${d.slug}`} className="text-sm font-semibold text-gray-900 hover:text-green-700 transition-colors">
                      {d.name} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
