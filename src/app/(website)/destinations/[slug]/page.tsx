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
  getEcosystemDestinationDetail,
  getEcosystemDestinationRoutes,
} from "@/lib/ecosystemContent/destinationDetail";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getToursByDestination } from "@/lib/queries/toursByDestination";
import {
  buildToursIncludingDestSchema,
  buildDestinationTravelGuideHandoffSchema,
  buildTouristAttractionSchema,
} from "@/lib/schemas/buildDestinationsSchemas";
import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";
import { resolveLocalImageDimensions } from "@/lib/ecosystemContent/website";
import fs from "fs";
import path from "path";
export const revalidate = 3600;
// dynamicParams = true (2026-08-21). See why-jvto/our-team/[slug] for the full
// account: with false, any path evicted from the cache 404s instead of
// re-rendering, because Next no longer holds the build-time param list at
// runtime. These routes are all in ekosistem's revalidation set, so every
// ekosistem deploy could evict them and turn live pages into 404s. Unknown
// slugs still 404 through the notFound() guard below, which checks the real
// content source rather than the build list.
export const dynamicParams = true;
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

// Ekosistem-only (single-content-source consolidation, 2026-08-19): these used to be
// slug-keyed maps hardcoded here. Now read per-destination from ekosistem
// (destination-knowledge/<slug>.content.json) via `data.*`, with the original hardcoded
// values kept below as a last-resort FALLBACK if ekosistem doesn't return a field.
//
// SEO AUDIT 2026-05-17 (QW-8): keyword-optimised title tag overrides per destination.
// "Mount Ijen" leads (5-10× more searched than "Kawah Ijen" internationally).
const FALLBACK_TITLE_OVERRIDES: Record<string, string> = {
  "ijen-crater":           "Mount Ijen Blue Fire Tour Guide — Permits, Health, Hike | JVTO",
  "mount-bromo":           "Mount Bromo Sunrise Guide — Tours, Tickets & Tips | JVTO",
  "tumpak-sewu-waterfall": "Tumpak Sewu Waterfall — Tour, Trail & Tips | JVTO",
  "madakaripura-waterfall":"Madakaripura Waterfall — Tour, Canyon Hike, Tips | JVTO",
  "papuma-beach":          "Papuma Beach Jember — Coastal Tour, Rock Formations | JVTO",
};

// SEO AUDIT 2026-05-17 (QW-9): 3-part meta description formula per destination.
// Formula: [Destination + key feature] · [Differentiator] · [Trust signal]
const FALLBACK_DESC_OVERRIDES: Record<string, string> = {
  "ijen-crater":           "Private Ijen blue fire hike from Surabaya or Bali. Gas mask, BBKSDA permit & health certificate coordinated. Tourist Police-led. 4.8★ Trustpilot.",
  "mount-bromo":           "Private Mount Bromo sunrise tour from Surabaya or Bali. Dedicated 4WD jeep, guide & driver, all entrance tickets. Tourist Police-led. 4.8★ Trustpilot.",
  "tumpak-sewu-waterfall": "Private Tumpak Sewu waterfall tour — jungle trail, canyon descent, all-inclusive. Combinable with Bromo & Ijen. Tourist Police-led. 4.8★ Trustpilot.",
  "madakaripura-waterfall":"Private Madakaripura waterfall tour from Surabaya — canyon hike, river crossing, all-inclusive crew. No shared groups. Tourist Police-led. 4.8★ Trustpilot.",
  "papuma-beach":          "Papuma Beach Jember — dramatic rock formations and white sand coastline. Add-on to Bromo or Ijen private tours from Surabaya or Bali.",
};

const FALLBACK_TRAVEL_GUIDE_LINKS: Record<string, { href: string; label: string }> = {
  "ijen-crater": { href: "/travel-guide/ijen-health-screening", label: "Ijen Health Screening" },
  "mount-bromo": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  "tumpak-sewu-waterfall": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  "madakaripura-waterfall": { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
};

const FALLBACK_RELATED: Record<string, Array<{ slug: string; name: string }>> = {
  "ijen-crater": [{ slug: "mount-bromo", name: "Mount Bromo" }, { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }],
  "mount-bromo": [{ slug: "ijen-crater", name: "Ijen Crater" }, { slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }],
  "tumpak-sewu-waterfall": [{ slug: "ijen-crater", name: "Ijen Crater" }, { slug: "mount-bromo", name: "Mount Bromo" }],
  "madakaripura-waterfall": [{ slug: "tumpak-sewu-waterfall", name: "Tumpak Sewu Waterfall" }, { slug: "mount-bromo", name: "Mount Bromo" }],
};

// Health Certificate Coordination block — ijen-crater only (wiki spec: ijen_relevant = true).
const FALLBACK_HEALTH_CERT_COORDINATION = {
  heading: "Health Certificate Coordination",
  paragraph:
    "Ijen crater access can require a recent health certificate when BBKSDA SE.1658/K2/BIDTEK.1/KSA/9/2024 " +
    "thresholds apply. JVTO coordinates the clinic workflow via Dr. Ahmad Irwandanu " +
    "(SIP-licensed, Kemenkes RI) — the certificate carries a QR code verified at the " +
    "crater access gate.",
  linkHref: "/travel-guide/ijen-health-screening",
  linkLabel: "How Ijen Health Screening Works →",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const routes = await getEcosystemDestinationRoutes();
  return routes.map((route) => ({ slug: route.slug }));
}

// ─── Data fetching ─────────────────────────────────────────────────────────────
// Ekosistem-only (single-content-source consolidation, 2026-08-18): destination
// editorial content — every field DestinationDetail declares — now lives in
// jvto-ekosistem, not Prisma. See ecosystemContent/destinationDetail.ts.

const getDestination = cache(async (slug: string): Promise<DestinationDetail | null> =>
  getEcosystemDestinationDetail(slug),
);

// 3D trail data is managed through jvto-cms (GPX upload -> route_geojson + route_* stat
// columns on `destinations`) and preferred here. The static public/routes/index.json export
// is kept only as a fallback for any destination that hasn't had its GPX re-uploaded yet.
function deriveRouteStats(data: DestinationDetail, slug: string): RouteStats | null {
  if (data.route_geojson && data.route_length_m != null) {
    return {
      slug,
      length_km: data.route_length_m / 1000,
      elev_gain_m: data.route_elev_gain_m ?? 0,
      elev_max_m: data.route_max_alt_m ?? 0,
      elev_min_m: data.route_elev_min_m ?? 0,
      bbox: (data.route_bbox as [number, number, number, number]) ?? [0, 0, 0, 0],
    };
  }
  try {
    const indexPath = path.join(process.cwd(), "public", "routes", "index.json");
    const raw = fs.readFileSync(indexPath, "utf8");
    const index = JSON.parse(raw) as { routes: RouteStats[] };
    return index.routes.find((r) => r.slug === slug) ?? null;
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
    // The page defines #attraction; the bare route URL is the page, not the place.
    spatialCoverage: { "@id": `${siteUrl}/destinations/${slug}#attraction` },
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
    about: { "@id": `${siteUrl}/destinations/${slug}#attraction` },
  };
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDestination(slug);

  if (!data) return { title: "Destination Not Found" };

  const title =
    (data.meta_title_override || FALLBACK_TITLE_OVERRIDES[slug]) ||
    data.seo_title?.trim() ||
    `${data.name} | JVTO Tours`;
  const description =
    (data.meta_description_override || FALLBACK_DESC_OVERRIDES[slug]) ||
    data.seo_description?.trim() ||
    data.summary ||
    data.highlight ||
    "";
  const rawImageUrl = data.banner?.url || data.featured_image;
  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith("http")
      ? rawImageUrl
      : `${SITE_URL}${rawImageUrl}`
    : `${SITE_URL}/assets/img/og/destinations.webp`;
  const imageDimensions = resolveLocalImageDimensions(imageUrl);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/destinations/${slug}`,
      languages: { en: `${SITE_URL}/destinations/${slug}`, "x-default": `${SITE_URL}/destinations/${slug}` },
    },
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
          ...(imageDimensions ? { width: imageDimensions.width, height: imageDimensions.height } : {}),
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
  const volcanicStatus = readVolcanicStatus(slug);

  if (!data) notFound();

  const routeStats = deriveRouteStats(data, slug);

  // ── Schema @graph ──────────────────────────────────────────────────────────
  //
  // schema_json dari DB sudah berisi @graph lengkap per destination:
  //   TouristAttraction, WebPage, BreadcrumbList, SafetyProtocol, dll
  //
  // Kita strip Organization & WebSite dari sana (ada di node terpisah),
  // lalu inject Organization + WebSite dari organization_profile DB.

  const orgNode = toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, SITE_URL));
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const destNodes = extractDestinationNodes(data.schema_json ?? null);

  // AEO/GEO port (2026-04-29) Phase 4.8: reverse-lookup tours-including ItemList +
  // travel-guide cross-link handoff. Per cluster_role_contracts.md Cluster 7 destination MH
  // (un-orphans the cluster: gives AI a discoverable tours list per destination).
  const destinationName = data.name ?? slug;
  const tours = await getToursByDestination(destinationName);
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

  // Single-content-source (2026-08-20): pass through the already-fetched destination record
  // + derived route bbox — no new fetch. See buildTouristAttractionSchema for field mapping.
  const touristAttractionNode = buildTouristAttractionSchema(slug, {
    altitude: data.altitude,
    hub_region: data.hub_region,
    route_bbox: routeStats?.bbox,
    tourist_attraction_facts: data.tourist_attraction_facts,
  });

  // BreadcrumbList: required on all destination pages (not auto-injected since we use <JsonLd> directly).
  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/destinations/${slug}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/destinations` },
      { "@type": "ListItem", position: 3, name: destinationName, item: `${SITE_URL}/destinations/${slug}` },
    ],
  };

  // WebPage fallback for destinations without a content_pages DB row (madakaripura, papuma).
  // destNodes from schema_json already includes WebPage for ijen and bromo — only inject when absent.
  const hasWebPage = destNodes.some((n: any) =>
    ([] as string[]).concat(n["@type"]).some((t) => t === "WebPage" || t === "CollectionPage")
  );
  const webPageFallbackNode = hasWebPage ? null : {
    "@type": "WebPage",
    "@id": `${SITE_URL}/destinations/${slug}#webpage`,
    url: `${SITE_URL}/destinations/${slug}`,
    name: (data.meta_title_override || FALLBACK_TITLE_OVERRIDES[slug]) || `${destinationName} | JVTO`,
    description:
      (data.meta_description_override || FALLBACK_DESC_OVERRIDES[slug]) ||
      data.summary ||
      data.highlight ||
      "",
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/destinations/${slug}#attraction` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    breadcrumb: { "@id": `${SITE_URL}/destinations/${slug}#breadcrumb` },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      breadcrumbNode,
      webPageFallbackNode,
      ...destNodes,
      touristAttractionNode,
      toursIncludingNode,
      travelGuideHandoffNode,
      statusAnnouncementNode,
      pvmbgReportNode,
    ].filter(Boolean),
  };

  const travelGuideLink = data.travel_guide_link ?? FALLBACK_TRAVEL_GUIDE_LINKS[slug];
  const relatedDests = data.related_destinations ?? FALLBACK_RELATED[slug] ?? [];
  const healthCert =
    slug === "ijen-crater"
      ? data.health_certificate_coordination ?? FALLBACK_HEALTH_CERT_COORDINATION
      : null;

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView data={data} routeStats={routeStats} volcanicStatus={volcanicStatus} slug={slug} />

      {/* Health Certificate Coordination — Ijen only (wiki spec: ijen_relevant = true) */}
      {healthCert && (
        <div className="border-t border-amber-200 bg-amber-50">
          <div className="container mx-auto px-4 max-w-6xl py-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">
              {healthCert.heading}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mb-3">
              {healthCert.paragraph}
            </p>
            <Link
              href={healthCert.linkHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
            >
              {healthCert.linkLabel}
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
