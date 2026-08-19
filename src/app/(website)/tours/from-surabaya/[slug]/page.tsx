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
import { DEFINED_TERMS } from "@/lib/schemas/entityGraph";
import { getPublicAggregateRating } from "@/lib/publicContent/getAggregateRating";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { getEcosystemIjenCraterRequirements } from "@/lib/ecosystemContent/ijenCraterRequirements";

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
  return getEcosystemTourPackageRoutes("tours/from-surabaya");
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

// Menghitung waktu selesai berdasarkan start time + durasi menit
function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime) return "17:00";
  try {
    // Asumsi format "HH:MM" atau "HH:MM:SS"
    const timeParts = startTime.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    const date = new Date();
    date.setHours(hours, minutes + durationMinutes);

    // Format kembali ke "HH:MM"
    const endHours = String(date.getHours()).padStart(2, "0");
    const endMinutes = String(date.getMinutes()).padStart(2, "0");
    return `${endHours}:${endMinutes}`;
  } catch (e) {
    return startTime; // Fallback
  }
}

function getDestinationUrl(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `https://javavolcano-touroperator.com/destinations/${slug}`;
}

// --- 3. DATA FETCHING (DEDUPLICATED) ---

// Menggunakan React 'cache' untuk Request Memoization
// API hanya akan dipanggil 1x meskipun dipanggil di generateMetadata dan Page
const getTourData = cache(async (slugParam: string) => {
  return getEcosystemTourPackageDetail(
    slugParam.includes("tours/")
      ? slugParam
      : `tours/from-surabaya/${slugParam}`,
  ) as Promise<TourPackageDetailResponse | null>;
});

// --- 4. INTERNAL COMPONENT: STRUCTURED DATA ---

function StructuredData({
  data,
  globalNodes,
  googleStats,
  tourAugment,
}: {
  data: TourPackageDetailResponse;
  globalNodes: any[];
  googleStats: { rating: number; count: number } | null;
  tourAugment?: { subjectOf: { "@id": string }; mentions: { "@id": string }[] } | null;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pkg = data.product;

  const slugString = Array.isArray(pkg.slug) ? pkg.slug.join("/") : pkg.slug;
  const pageUrl = `${siteUrl}/${
    slugString.startsWith("/") ? slugString.substring(1) : slugString
  }`;

  // Wiki 82c1270: canonical fallback images when no tour-specific photo in DB.
  // Bromo/Safari-only (no Ijen) → hero landscape. All others (Ijen-relevant) → Geopark briefing.
  const BROMO_ONLY_SLUGS = new Set(['bromo-1d1n', 'bromo-2d1n', 'taman-safari-prigen-bromo-madakaripura-3d2n']);
  const bareSlug = slugString.split('/').pop() ?? '';
  const FALLBACK_IMAGE = BROMO_ONLY_SLUGS.has(bareSlug)
    ? `${siteUrl}/assets/img/hero/home.webp`
    : `${siteUrl}/ops/ijen-geopark-briefing.png`;
  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]) || FALLBACK_IMAGE;
  const schemaImageUrl =
    rawImage && !rawImage.startsWith("http")
      ? `${siteUrl}${rawImage}`
      : rawImage;

  // Logic Offers
  const dynamicOffers =
    pkg.offers?.tiers?.map((tier) => ({
      "@type": "Offer",
      sku: tier.sku,
      price: tier.pricePerPerson,
      priceCurrency: "IDR",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: tier.paxMin,
        ...(tier.paxMax > 0 && { maxValue: tier.paxMax }),
      },
      availability: "https://schema.org/InStock",
      url: pageUrl,
    })) || [];

  // Logic SubTrip (Itinerary Harian)
  const subTripList =
    pkg.itineraryDays?.map((dayItem) => {
      const dayId = `${pageUrl}#day-${dayItem.day}`;

      // Ambil waktu
      const firstActivity = dayItem.activities?.[0];
      const lastActivity = dayItem.activities?.[dayItem.activities.length - 1];

      const departureTime = firstActivity?.timeWindow || "08:00";
      const arrivalTime = lastActivity
        ? calculateEndTime(
            lastActivity.timeWindow || "18:00",
            lastActivity.durationMinutes ?? 0
          )
        : "18:00";

      return {
        "@type": "TouristTrip",
        "@id": dayId,
        name: `Day ${dayItem.day}: ${dayItem.title}`,
        description: dayItem.summary,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        itinerary: {
          "@type": "ItemList",
          itemListElement:
            dayItem.activities?.map((act, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "TouristAttraction",
                name: act.name,
                description: act.description,
                url: getDestinationUrl(act.location || act.name || ""),
              },
            })) || [],
        },
        provider: { "@id": `${siteUrl}/#organization` },
        partOfTrip: { "@id": `${pageUrl}#tour` },
      };
    }) || [];

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
          { "@type": "ListItem", position: 3, name: "From Surabaya", item: `${siteUrl}/tours/from-surabaya` },
          { "@type": "ListItem", position: 4, name: pkg.name, item: pageUrl },
        ],
      },
      {
        "@type": "TouristTrip",
        "@id": `${pageUrl}#tour`,
        name: pkg.name,
        description: stripHtml(pkg.description),
        url: pageUrl,
        image: [schemaImageUrl],
        inLanguage: "en",
        duration: pkg.itineraryDays?.length ? `P${pkg.itineraryDays.length}D` : undefined,
        touristType: pkg.marketing?.perfectFor || ["Adventure seekers"],
        tripOrigin: { "@type": "Place", name: pkg.originCity },
        itinerary: {
          "@type": "ItemList",
          itemListElement: subTripList.map((trip, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: { "@id": trip["@id"] },
          })),
        },
        subTrip: subTripList, // <--- New Structure
        provider: { "@id": `${siteUrl}/#organization` },
        offers: { "@id": `${pageUrl}#aggregateOffer` },
        identifier: [
          {
            "@type": "PropertyValue",
            name: "Internal Package ID",
            value: pkg.packageId,
          },
        ],
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        ...(tourAugment
          ? { subjectOf: tourAugment.subjectOf, mentions: tourAugment.mentions }
          : {}),
      },
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
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice: pkg.offers?.aggregateOffer?.lowPrice,
          highPrice: pkg.offers?.aggregateOffer?.highPrice,
          offerCount: pkg.offers?.tiers?.length || 0,
          offers: dynamicOffers,
          availability: "https://schema.org/InStock",
          url: pageUrl,
        },
        potentialAction: { "@type": "ReserveAction", target: pageUrl },
      },
    ],
  };

  return (
    <JsonLd data={[...globalNodes, graphSchema]} />
  );
}

// --- 5. METADATA GENERATION ---

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
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

// --- 6. MAIN PAGE COMPONENT ---
const getReviewsData = cache(async () => getPublicHomeReviews());

// AEO/GEO PORT (2026-04-29): destinations-based ijenRelevant (route[] preferred over name regex).
function deriveIjenRelevant(
  name: string,
  slug: string | string[],
  route: string[] | undefined,
): boolean {
  if (route?.some((r) => /ijen/i.test(r))) return true;
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;
  return /ijen/i.test(name) || /ijen/i.test(slugStr);
}

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [data, reviews, org, allClaims, googleStats, reviewProfiles, ijenCraterRequirements] = await Promise.all([
    getTourData(slug),
    getReviewsData(),
    getOrganizationProfile(),
    getEcosystemNarrativeClaims(),
    getPublicAggregateRating(),
    // Per-platform badge figures for TrustBar (client bundle — must be drilled in).
    getEcosystemReviewProfiles(),
    // Ijen Crater mandatory-requirements table + FAQ for TourRequirements (client bundle — must be drilled in).
    getEcosystemIjenCraterRequirements(),
  ]);

  if (!data) notFound();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const globalNodes = [
    toOrganizationReferenceOnly(buildOrganizationJsonLd(org as any, siteUrl)),
    buildWebSiteJsonLd(siteUrl),
  ].filter(Boolean);

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
    { "@id": DEFINED_TERMS.NIB["@id"] },
    { "@id": DEFINED_TERMS.TDUP["@id"] },
    { "@id": DEFINED_TERMS.HPWKI["@id"] },
    { "@id": DEFINED_TERMS.POLPAR["@id"] },
  ];
  if (tourSeed.ijenRelevant) {
    tourMentions.push(
      { "@id": DEFINED_TERMS.KTA["@id"] },
      { "@id": DEFINED_TERMS.BBKSDA["@id"] },
      { "@id": DEFINED_TERMS.SE1658["@id"] },
    );
  }
  const tourAugment = {
    subjectOf: { "@id": `${siteUrl}/#agung-sambuko` },
    mentions: tourMentions,
  };

  return (
    <>
      <StructuredData data={data} globalNodes={globalNodes} googleStats={googleStats} tourAugment={tourAugment} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <TourDetail initialData={data} reviews={reviews} ijenRelevant={tourSeed.ijenRelevant} reviewProfiles={reviewProfiles} ijenCraterRequirements={ijenCraterRequirements} />
    </>
  );
}
