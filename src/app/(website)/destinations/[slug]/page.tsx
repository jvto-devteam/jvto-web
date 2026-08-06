// app/(website)/destinations/[slug]/page.tsx
//
// PACKAGE 06 (2026-08-06): the detail route's evergreen narrative + SEO come from the
// static-content SSOT (content/pages/destinations/<slug>.json) — hero chrome, quick
// facts, the signature narrative, the TouristAttraction facts, the travel-guide handoff
// and related destinations. Dynamic data stays DB-sourced: identity, coordinates, media,
// route stats, volcanic status, tours (+ prices), org profile. Importing loadStaticPage
// also flips the authority manifest to "content/ (Git SSOT)". The evergreen narrative and
// SEO no longer read the DB CMS page table or the DB page-SEO resolver.
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
import { getToursByDestination } from "@/lib/queries/toursByDestination";
import {
  buildToursIncludingDestSchema,
  buildDestinationTravelGuideHandoffSchema,
  buildTouristAttractionSchema,
  type ContentAttraction,
} from "@/lib/schemas/buildDestinationsSchemas";
import { loadStaticPage, type StaticPage } from "@/lib/static-content";
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

// ─── Content accessors (evergreen narrative from content/pages/destinations/<slug>.json) ───
type ContentSection = NonNullable<StaticPage["sections"]>[number] & Record<string, unknown>;

function findSection(page: StaticPage, id: string): ContentSection | undefined {
  return page.sections?.find((s) => s.id === id) as ContentSection | undefined;
}
function sectionGrid(sec: ContentSection | undefined, role: string): Record<string, unknown>[] {
  const block = (sec?.blocks ?? []).find(
    (b) => b.type === "grid" && (b as { role?: string }).role === role,
  );
  return block ? ((block as { items?: Record<string, unknown>[] }).items ?? []) : [];
}

export interface QuickFact {
  icon: string;
  k: string;
  v: string;
  sub?: string;
  span2?: boolean;
}
export interface DestChrome {
  eyebrow: string;
  locationLabel: string;
}
export interface SignatureBlock {
  body_md: string;
}

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

  const content = loadStaticPage(`/destinations/${slug}`);
  const title =
    content?.meta.title ?? data.seo_title?.trim() ?? `${data.name} | JVTO Tours`;
  const description =
    content?.meta.description ??
    data.seo_description?.trim() ??
    data.summary ??
    data.highlight ??
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

  // Evergreen narrative + SEO from content/ (Git SSOT). dynamicParams=false + the
  // ownership gate guarantee a published content record for every rendered slug.
  const content = loadStaticPage(`/destinations/${slug}`);
  if (!content || content.meta.status !== "published") {
    throw new Error(
      `destinations detail: missing published content/pages/destinations/${slug}.json`,
    );
  }

  const chromeSec = findSection(content, "chrome");
  const attractionSec = findSection(content, "attraction");
  const signatureSec = findSection(content, "signature");
  const handoffSec = findSection(content, "handoff");

  const chrome: DestChrome = {
    eyebrow: String(chromeSec?.eyebrow ?? ""),
    locationLabel: String(chromeSec?.location_label ?? ""),
  };
  const quickFacts = sectionGrid(chromeSec, "quick-facts") as unknown as QuickFact[];
  const elevationStat = (sectionGrid(chromeSec, "elevation-stat")[0] ?? {
    label: "Elevation",
    value: "",
  }) as { label: string; value: string };
  const overviewLede = content.lede?.[0] ?? "";
  const signatureBlocks: SignatureBlock[] = (signatureSec?.blocks ?? [])
    .filter((b) => b.type === "markdown" && typeof (b as { body_md?: unknown }).body_md === "string")
    .map((b) => ({ body_md: (b as { body_md: string }).body_md }));
  const attraction = attractionSec as unknown as ContentAttraction | undefined;
  const travelGuideLink =
    (handoffSec?.travel_guide as { href: string; label: string } | undefined) ?? null;
  const relatedDests = sectionGrid(handoffSec, "related") as unknown as Array<{
    slug: string;
    name: string;
  }>;

  // ── Schema @graph ──────────────────────────────────────────────────────────
  const orgNode = buildOrganizationJsonLd(org as unknown as Parameters<typeof buildOrganizationJsonLd>[0], SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const destNodes = extractDestinationNodes(data.schema_json ?? null);

  const tours = await getToursByDestination(slug);
  const destinationName = data.name ?? slug;
  const toursIncludingNode = buildToursIncludingDestSchema({
    destinationSlug: slug,
    destinationName,
    tours,
  });
  const travelGuideHandoffNode = buildDestinationTravelGuideHandoffSchema({
    slug,
    name: destinationName,
    href: travelGuideLink?.href ?? null,
  });

  const statusAnnouncementNode = volcanicStatus
    ? buildStatusAnnouncementSchema(slug, destinationName, volcanicStatus, SITE_URL)
    : null;
  const pvmbgReportNode = volcanicStatus
    ? buildPvmbgReportSchema(slug, destinationName, volcanicStatus, SITE_URL)
    : null;

  // TouristAttraction facts from content; coordinates from the DB record (geo-feed
  // override applied inside the builder). geo.elevation is never emitted (facts-lock).
  const touristAttractionNode = attraction
    ? buildTouristAttractionSchema(slug, attraction, {
        lat: data.latitude,
        lng: data.longitude,
      })
    : null;

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/destinations/${slug}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/destinations` },
      { "@type": "ListItem", position: 3, name: destinationName, item: `${SITE_URL}/destinations/${slug}` },
    ],
  };

  // WebPage node: name + description from the canonical content record (metadata==JSON-LD).
  // destNodes from the DB schema_json would carry a WebPage/CollectionPage in rare cases;
  // only inject the fallback when one is absent.
  const hasWebPage = destNodes.some((n: Record<string, unknown>) =>
    ([] as string[]).concat(n["@type"] as string).some((t) => t === "WebPage" || t === "CollectionPage"),
  );
  const webPageFallbackNode = hasWebPage
    ? null
    : {
        "@type": "WebPage",
        "@id": `${SITE_URL}/destinations/${slug}#webpage`,
        url: `${SITE_URL}/destinations/${slug}`,
        name: content.meta.title,
        description: content.meta.description,
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

  return (
    <>
      <JsonLd data={schema} />
      <DestinationDetailView
        data={data}
        slug={slug}
        routeStats={routeStats}
        volcanicStatus={volcanicStatus}
        relatedTours={tours}
        chrome={chrome}
        quickFacts={quickFacts}
        elevationStat={elevationStat}
        signatureBlocks={signatureBlocks}
        overviewLede={overviewLede}
      />

      {(travelGuideLink || relatedDests.length > 0) && (
        <div className="border-t border-jvto-border bg-jvto-off">
          <div className="container mx-auto px-4 max-w-6xl py-10 flex flex-col sm:flex-row gap-10">
            {travelGuideLink && (
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-muted mb-2">Travel Guide</p>
                <Link href={travelGuideLink.href} className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors">
                  {travelGuideLink.label} →
                </Link>
              </div>
            )}
            {relatedDests.length > 0 && (
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-muted mb-2">Related Destinations</p>
                <div className="flex flex-wrap gap-6">
                  {relatedDests.map((d) => (
                    <Link key={d.slug} href={`/destinations/${d.slug}`} className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors">
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

/** Nodes from the DB schema_json, stripping Organization & WebSite (handled separately). */
function extractDestinationNodes(
  schema_json: Record<string, unknown> | null,
): Record<string, unknown>[] {
  if (!schema_json) return [];

  const graph: Record<string, unknown>[] = Array.isArray(schema_json)
    ? (schema_json as Record<string, unknown>[])
    : Array.isArray((schema_json as { "@graph"?: unknown })["@graph"])
      ? ((schema_json as { "@graph": Record<string, unknown>[] })["@graph"])
      : [];

  const SKIP_TYPES = ["Organization", "LocalBusiness", "TravelAgency", "WebSite"];

  return graph.filter((node) => {
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    return !(types as string[]).some((t) => SKIP_TYPES.includes(t));
  });
}
