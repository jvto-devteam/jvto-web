// app/(website)/destinations/[slug]/page.tsx
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import Link from "@/components/website/AppLink";
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
import { getWebDestinationDetail } from "@/lib/destinations/getWebDestinationDetail";
import { getToursByDestination } from "@/lib/queries/toursByDestination";
import {
  buildToursIncludingDestSchema,
  buildDestinationTravelGuideHandoffSchema,
} from "@/lib/schemas/buildDestinationsSchemas";
import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";
export const revalidate = 3600;
export const dynamicParams = false;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";

export interface RouteStats {
  slug: string;
  length_km: number;
  elev_gain_m: number;
  elev_max_m: number;
  elev_min_m: number;
  bbox: [number, number, number, number];
}

const DEST_TRAVEL_GUIDE_LINKS: Record<
  string,
  { href: string; label: string } | undefined
> = {
  "mount-bromo": {
    href: "/travel-guide/mount-bromo-logistics",
    label: "Mount Bromo logistics and sunrise planning",
  },
  "ijen-crater": {
    href: "/travel-guide/ijen-health-screening",
    label: "Ijen health screening and pre-ascent process",
  },
  "tumpak-sewu-waterfall": {
    href: "/travel-guide/tumpak-sewu-logistics",
    label: "Tumpak Sewu logistics and descent planning",
  },
};

const DEST_RELATED: Record<string, Array<{ slug: string; name: string }>> = {
  "mount-bromo": [
    { slug: "ijen-crater", name: "Ijen Crater" },
    { slug: "madakaripura-waterfall", name: "Madakaripura Waterfall" },
  ],
  "ijen-crater": [
    { slug: "mount-bromo", name: "Mount Bromo" },
    { slug: "papuma-beach", name: "Papuma Beach" },
  ],
  "tumpak-sewu-waterfall": [
    { slug: "mount-bromo", name: "Mount Bromo" },
    { slug: "madakaripura-waterfall", name: "Madakaripura Waterfall" },
  ],
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublicDestinationDetailStaticParams();
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

const getDestination = cache(async (slug: string): Promise<DestinationDetail | null> =>
  getPublicDestinationDetail(slug),
);

function readRouteStats(_slug: string): RouteStats | null {
  return null;
}

function readVolcanicStatus(_slug: string): VolcanicStatusData | null {
  return null;
}

function buildStatusAnnouncementSchema(
  _slug: string,
  _destinationName: string,
  _status: VolcanicStatusData,
  _siteUrl: string,
) {
  return null;
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
  const routeStats = readRouteStats(slug);
  const volcanicStatus = readVolcanicStatus(slug);

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

  const statusAnnouncementNode =
    volcanicStatus && data
      ? buildStatusAnnouncementSchema(
          slug,
          data.name ?? slug,
          volcanicStatus,
          SITE_URL,
        )
      : null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      ...destNodes,
      toursIncludingNode,
      travelGuideHandoffNode,
      statusAnnouncementNode,
    ].filter(Boolean),
  };

  const travelGuideLink = DEST_TRAVEL_GUIDE_LINKS[slug];
  const relatedDests = DEST_RELATED[slug] ?? [];

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView data={data} routeStats={routeStats} volcanicStatus={volcanicStatus} />
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
