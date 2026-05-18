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
import fs from "fs";
import path from "path";
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
  try {
    const indexPath = path.join(process.cwd(), "public", "routes", "index.json");
    const raw = fs.readFileSync(indexPath, "utf8");
    const index = JSON.parse(raw) as { routes: RouteStats[] };
    return index.routes.find((r) => r.slug === _slug) ?? null;
  } catch {
    return null;
  }
}

function readVolcanicStatus(_slug: string): VolcanicStatusData | null {
  const volcanicStatusSlugs = new Set(["ijen-crater", "mount-bromo"]);
  if (!volcanicStatusSlugs.has(_slug)) return null;
  try {
    const statusPath = path.join(process.cwd(), "public", "ops", "volcanic-status.json");
    const raw = fs.readFileSync(statusPath, "utf8");
    const data = JSON.parse(raw) as { destinations: Record<string, VolcanicStatusData> };
    return data.destinations[_slug] ?? null;
  } catch {
    return null;
  }
}

function buildStatusAnnouncementSchema(
  slug: string,
  destinationName: string,
  status: VolcanicStatusData,
  siteUrl: string,
) {
  const lastVerifiedDate = new Date(status.last_verified + "T00:00:00");
  const expiresDate = new Date(lastVerifiedDate.getTime() + 72 * 60 * 60 * 1000);

  const pvmbg = status.pvmbg_report;
  const textParts = [`${destinationName} status: ${status.alert_level}. ${status.notes}`];
  if (pvmbg?.visual_en) textParts.push(`Visual observation: ${pvmbg.visual_en}.`);
  if (pvmbg?.climate_en) textParts.push(`Summit conditions: ${pvmbg.climate_en}.`);

  return {
    "@type": "SpecialAnnouncement",
    "@id": `${siteUrl}/destinations/${slug}#status`,
    name: `${destinationName} Current Operational Status — ${status.last_verified}`,
    text: textParts.join(" "),
    datePosted: status.last_verified,
    expires: expiresDate.toISOString().split("T")[0],
    category: "https://www.wikidata.org/wiki/Q83",
    ...(pvmbg?.image_url ? { image: pvmbg.image_url } : {}),
    isBasedOn: pvmbg ? { "@id": `${siteUrl}/destinations/${slug}#pvmbg-report` } : undefined,
    spatialCoverage: { "@id": `${siteUrl}/destinations/${slug}` },
    about: { "@id": `${siteUrl}/#organization` },
  };
}

function buildPvmbgReportSchema(
  slug: string,
  destinationName: string,
  status: VolcanicStatusData,
  siteUrl: string,
) {
  const pvmbg = status.pvmbg_report;
  if (!pvmbg) return null;

  const descParts: string[] = [];
  if (pvmbg.visual_en) descParts.push(pvmbg.visual_en);
  if (pvmbg.climate_en) descParts.push(pvmbg.climate_en);

  return {
    "@type": "Report",
    "@id": `${siteUrl}/destinations/${slug}#pvmbg-report`,
    name: `PVMBG Daily Volcano Activity Report — ${destinationName} — ${status.last_verified}`,
    datePublished: pvmbg.fetched_at,
    inLanguage: "id",
    url: status.source_url,
    ...(pvmbg.image_url ? { image: pvmbg.image_url } : {}),
    ...(descParts.length ? { description: descParts.join(" | ") } : {}),
    author: {
      "@type": "Organization",
      name: "Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG)",
      url: "https://pvmbg.bgl.esdm.go.id",
    },
    publisher: {
      "@type": "Organization",
      name: "MAGMA Indonesia / Badan Geologi ESDM",
      url: "https://magma.esdm.go.id",
    },
    about: { "@id": `${siteUrl}/destinations/${slug}` },
  };
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
      ? buildStatusAnnouncementSchema(slug, data.name ?? slug, volcanicStatus, SITE_URL)
      : null;

  const pvmbgReportNode =
    volcanicStatus && data
      ? buildPvmbgReportSchema(slug, data.name ?? slug, volcanicStatus, SITE_URL)
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
      pvmbgReportNode,
    ].filter(Boolean),
  };

  const travelGuideLink = DEST_TRAVEL_GUIDE_LINKS[slug];
  const relatedDests = DEST_RELATED[slug] ?? [];

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView data={data} routeStats={routeStats} volcanicStatus={volcanicStatus} />

      {/* Health Certificate Coordination — Ijen only (wiki spec: ijen_relevant = true) */}
      {slug === "ijen-crater" && (
        <div className="border-t border-amber-200 bg-amber-50">
          <div className="container mx-auto px-4 max-w-6xl py-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">
              Health Certificate Coordination
            </p>
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mb-3">
              Ijen crater access can require a recent health certificate when BBKSDA SE.1658/KSA.9/2024
              thresholds apply. JVTO coordinates the clinic workflow via Dr. Ahmad Irwandanu
              (SIP-licensed, Kemenkes RI) — the certificate carries a QR code verified at the
              crater access gate.
            </p>
            <Link
              href="/travel-guide/ijen-health-screening"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
            >
              How Ijen Health Screening Works →
            </Link>
          </div>
        </div>
      )}

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
