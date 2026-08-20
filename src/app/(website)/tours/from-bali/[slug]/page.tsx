import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import type { TourPackageDetail as TourPackageDetailResponse } from "@/interfaces";
import TourDetail from "@/components/website/TourDetail"; // Pastikan path ini sesuai
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicHomeReviews } from "@/lib/publicContent/getHomeReviews";
import {
  buildOrganizationJsonLd,
  toOrganizationReferenceOnly,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getEcosystemNarrativeClaims } from "@/lib/ecosystemContent/narrativeClaims";
import {
  getEcosystemTourPackageDetail,
  getEcosystemTourPackageRoutes,
} from "@/lib/ecosystemContent/tourPackageDetail";
import {
  buildTourFaqSchema,
  pickTourRelevantClaims,
  type TourDetailSeed,
  type FullPackageDbDataSeed,
  type NarrativeClaimLite,
} from "@/lib/schemas/buildTourSchemas";
import { DEFINED_TERM_IDS } from "@/lib/schemas/entityGraph";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { getEcosystemIjenCraterRequirements } from "@/lib/ecosystemContent/ijenCraterRequirements";
import { getEcosystemTourSchemaNodes } from "@/lib/ecosystemContent/tourSchemaOutput";

export const revalidate = 3600;

// --- 1. TYPE DEFINITIONS (SESUAI JSON API) ---

interface Activity {
  type: string;
  name: string;
  description: string;
  location?: string;
  timeWindow: string; // Format "HH:MM"
  durationMinutes: number;
}

interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  activities: Activity[];
}

interface OfferTier {
  sku: string;
  paxMin: number;
  paxMax: number;
  pricePerPerson: number;
}

interface ProductData {
  packageId: string;
  name: string;
  slug: string | string[];
  seoTitle?: string;
  seoDescription?: string;
  description: string;
  imageUrl?: string;
  gallery?: string[];
  originCity: string;
  marketing?: {
    perfectFor: string[];
  };
  offers?: {
    tiers: OfferTier[];
    aggregateOffer?: {
      lowPrice: number;
      highPrice: number;
    };
  };
  itineraryDays: ItineraryDay[];
  aggregateRating?: {
    ratingValue: number | string;
    reviewCount: number | string;
  };
  route?: string[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEcosystemTourPackageRoutes("tours/from-bali");
}

// --- 2. HELPER FUNCTIONS ---

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

// --- 3. DATA FETCHING (DEDUPLICATED) ---
// Refactored 2026-04-29: was self-fetch to /api/packages/web/details (broke SSG with ECONNREFUSED).
// Now calls the same transform logic directly via shared helper. React `cache` still memoizes per-request
// so generateMetadata + Page don't double-query Prisma.
const getTourData = cache(async (slugParam: string) => {
  return getEcosystemTourPackageDetail(
    slugParam.includes("tours/")
      ? slugParam
      : `tours/from-bali/${slugParam}`,
  ) as Promise<TourPackageDetailResponse | null>;
});

// --- 4. INTERNAL COMPONENT: STRUCTURED DATA ---

function StructuredData({
  data,
  globalNodes,
  googleStats,
  tourAugment,
  ecosystemNodes,
}: {
  data: TourPackageDetailResponse;
  globalNodes: any[];
  googleStats: { rating: number; count: number } | null;
  tourAugment?: { subjectOf: { "@id": string }; mentions: { "@id": string }[] } | null;
  ecosystemNodes: Record<string, unknown>[] | null;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pkg = data.product;

  const slugString = Array.isArray(pkg.slug) ? pkg.slug.join("/") : pkg.slug;
  const pageUrl = `${siteUrl}/${
    slugString.startsWith("/") ? slugString.substring(1) : slugString
  }`;

  // Wiki 82c1270: all Bali tours include Ijen → Geopark briefing as fallback image.
  const FALLBACK_IMAGE = `${siteUrl}/ops/ijen-geopark-briefing.png`;
  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]) || FALLBACK_IMAGE;
  const schemaImageUrl =
    rawImage && !rawImage.startsWith("http")
      ? `${siteUrl}${rawImage}`
      : rawImage;

  // TouristTrip + per-day TouristTrip + AggregateOffer now come pre-rendered
  // from ekosistem (design spec Bagian 3, 2026-08-20). Augment the TouristTrip
  // node with the DefinedTerm mentions/subjectOf that stay page-local (never
  // sent to ekosistem — see plan Global Constraints) by @id match, rather
  // than rebuilding the node here.
  const augmentedEcosystemNodes = (ecosystemNodes ?? []).map((node) =>
    node["@id"] === `${pageUrl}#tour` && tourAugment
      ? { ...node, subjectOf: tourAugment.subjectOf, mentions: tourAugment.mentions }
      : node,
  );

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pkg.name,
        description: stripHtml(pkg.description).substring(0, 160),
        inLanguage: "en",
        dateModified: new Date().toISOString(),
        primaryImageOfPage: { "@type": "ImageObject", url: schemaImageUrl },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tours",
            item: `${siteUrl}/tours`,
          },
          { "@type": "ListItem", position: 3, name: "From Bali", item: `${siteUrl}/tours/from-bali` },
          { "@type": "ListItem", position: 4, name: pkg.name, item: pageUrl },
        ],
      },
      ...augmentedEcosystemNodes,
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: pkg.name,
        description: stripHtml(pkg.description),
        image: [schemaImageUrl],
        sku: pkg.packageId,
        productID: pkg.packageId,
        brand: { "@id": `${siteUrl}/#organization` },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: pkg.aggregateRating?.ratingValue || String(googleStats?.rating ?? 4.8),
          reviewCount: pkg.aggregateRating?.reviewCount || String(googleStats?.count ?? 141),
        },
        offers: { "@id": `${pageUrl}#aggregateOffer` },
        potentialAction: { "@type": "ReserveAction", target: pageUrl },
      },
    ],
  };

  return (
    <JsonLd data={[...globalNodes, graphSchema]} />
  );
}

// --- 5. METADATA GENERATION ---
const getReviewsData = cache(async () => getPublicHomeReviews());

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTourData(slug);

  if (!data || !data.product) {
    return {
      title: "Tour Not Found",
      description: "The tour package you are looking for does not exist.",
    };
  }

  const pkg = data.product;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

  const cleanDesc = stripHtml(pkg.description).substring(0, 160);
  const price = formatCurrency(pkg.offers?.aggregateOffer?.lowPrice || 0);
  const metaTitle =
    pkg.seoTitle?.trim() || `${pkg.name} | Private Tour from ${pkg.originCity}`;
  const metaDesc =
    pkg.seoDescription?.trim() ||
    `Book ${pkg.name}. Starts from ${price}. ${cleanDesc}...`;

  const rawImage =
    pkg.imageUrl ||
    (pkg.gallery && pkg.gallery[0]) ||
    "/assets/img/og/default.jpg";
  const imageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `${siteUrl}/${pkg.slug}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [imageUrl],
    },
  };
}

// --- 6. AEO/GEO PORT (2026-04-29): FAQPage + narrative_claims composition ---
// Better-than-regex Ijen detection: prefer pkg.route[] (destinations array) which carries
// canonical destination names like "Kawah Ijen". Fallback to name/slug regex for resilience.
function deriveIjenRelevant(
  name: string,
  slug: string | string[],
  route: string[] | undefined,
): boolean {
  if (route?.some((r) => /ijen/i.test(r))) return true;
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;
  return /ijen/i.test(name) || /ijen/i.test(slugStr);
}

// Adapter: live's TourPackageDetailResponse → ported builders' minimal seed contracts.
function adaptToTourDetailSeed(
  data: TourPackageDetailResponse,
): TourDetailSeed {
  const pkg = data.product;
  return {
    name: pkg.name,
    shortDesc: stripHtml(pkg.description).substring(0, 160),
    image: pkg.imageUrl ?? (pkg.gallery && pkg.gallery[0]) ?? "",
    priceFrom: pkg.offers?.aggregateOffer?.lowPrice ?? 0,
    duration: `${pkg.itineraryDays?.length ?? 1}D${(pkg.itineraryDays?.length ?? 1) - 1}N`,
    origin: pkg.originCity,
    ijenRelevant: deriveIjenRelevant(pkg.name, pkg.slug, (pkg as any).route),
    inclusions: pkg.inclusions ?? [],
    itinerary: pkg.itineraryDays?.map((d) => ({ day: `Day ${d.day}`, title: d.title, summary: d.summary })) ?? [],
  };
}

// --- 7. MAIN PAGE COMPONENT ---

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [data, reviews, org, allClaims, googleStats, reviewProfiles, ijenCraterRequirements, ecosystemNodes] = await Promise.all([
    getTourData(slug),
    getReviewsData(),
    getOrganizationProfile(),
    getEcosystemNarrativeClaims(),
    getPublicAggregateRating(),
    // Per-platform badge figures for TrustBar (client bundle — must be drilled in).
    getEcosystemReviewProfiles(),
    // Ijen Crater mandatory-requirements table + FAQ for TourRequirements (client bundle — must be drilled in).
    getEcosystemIjenCraterRequirements(),
    // Pre-rendered TouristTrip/AggregateOffer nodes (design spec Bagian 3).
    getEcosystemTourSchemaNodes(`tours/from-bali/${slug}`),
  ]);

  if (!data) notFound();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const globalNodes = [
    toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, siteUrl)),
    buildWebSiteJsonLd(siteUrl),
  ].filter(Boolean);

  // FAQPage composed from 3 sources: spine Q&A + narrative_claims relevant + published package_faqs.
  // Spine pairs hand-written canonical (always present); narrative_claims wired per-tour-relevance;
  // package faqs add tour-specific Q&A, both ekosistem-sourced as of 2026-08-18.
  const tourSeed = adaptToTourDetailSeed(data);
  const claimsLite: NarrativeClaimLite[] = (allClaims ?? [])
    .filter((c) => c.pillar && c.core_claim)
    .map((c) => ({ id: c.id, pillar: c.pillar as string, core_claim: c.core_claim as string }));
  const relevantClaims = pickTourRelevantClaims(tourSeed, claimsLite);
  const packageFaqs = (data.product as any).faqs as Array<{ question: string; answer: string }> ?? [];
  const fullData: FullPackageDbDataSeed | null = {
    destinations: [],
    faqs: packageFaqs,
  };
  const faqSchema = buildTourFaqSchema({ tour: tourSeed, fullData, narrativeClaims: relevantClaims, reviewProfiles });

  // Augment the TouristTrip node (emitted inside StructuredData below) with
  // mentions[] (DefinedTerm @ids) + subjectOf founder — merged directly onto
  // that node rather than declared again in a second <script> tag, which
  // used to ship a duplicate `@id ...#tour` node (fixed 2026-08-19).
  const tourMentions: { "@id": string }[] = [
    { "@id": DEFINED_TERM_IDS.NIB },
    { "@id": DEFINED_TERM_IDS.TDUP },
    { "@id": DEFINED_TERM_IDS.HPWKI },
    { "@id": DEFINED_TERM_IDS.POLPAR },
  ];
  if (tourSeed.ijenRelevant) {
    tourMentions.push(
      { "@id": DEFINED_TERM_IDS.KTA },
      { "@id": DEFINED_TERM_IDS.BBKSDA },
      { "@id": DEFINED_TERM_IDS.SE1658 },
    );
  }
  const tourAugment = {
    subjectOf: { "@id": `${siteUrl}/#agung-sambuko` },
    mentions: tourMentions,
  };

  // Spine Q&A pairs for client-side AnswerBlock rendering (single source of truth with FAQPage schema).
  const spineQa = relevantClaims.length > 0 ? null : null; // computed inside TourDetail via getTourSpineQaPairs to avoid prop drilling
  void spineQa;

  return (
    <>
      <StructuredData data={data} globalNodes={globalNodes} googleStats={googleStats} tourAugment={tourAugment} ecosystemNodes={ecosystemNodes} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <TourDetail initialData={data} reviews={reviews} ijenRelevant={tourSeed.ijenRelevant} reviewProfiles={reviewProfiles} ijenCraterRequirements={ijenCraterRequirements} />
    </>
  );
}
