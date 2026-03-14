import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import TourDetail from "@/components/website/TourDetail"; // Pastikan path ini sesuai
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

interface TourPackageDetail {
  product: ProductData;
  // field lain di root response jika dibutuhkan
}

interface Props {
  params: Promise<{ slug: string[] }>;
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
const getTourData = cache(async (slugParam: string[]) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";

  // Handling slug: gabungkan array menjadi string path
  const slugString = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;

  // Sesuaikan logic path ini dengan struktur URL API Anda
  // Jika URL browser: /tours/from-bali/bromo-3d2n, maka slugString sudah lengkap jika file di [...slug]
  // Jika file di [slug] tapi API butuh full path:
  const fullSlug = slugString.includes("tours/")
    ? slugString
    : `tours/from-bali/${slugString}`;

  try {
    const res = await fetch(
      `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
      { cache: "no-store" },
    );

    if (!res.ok) return null;
    return (await res.json()) as TourPackageDetail;
  } catch (error) {
    console.error("Error fetching tour details:", error);
    return null;
  }
});

// --- 4. INTERNAL COMPONENT: STRUCTURED DATA ---

function StructuredData({ data }: { data: TourPackageDetail }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pkg = data.product;

  const slugString = Array.isArray(pkg.slug) ? pkg.slug.join("/") : pkg.slug;
  const pageUrl = `${siteUrl}/${
    slugString.startsWith("/") ? slugString.substring(1) : slugString
  }`;

  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]);
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
            lastActivity.timeWindow,
            lastActivity.durationMinutes,
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
                url: getDestinationUrl(act.location || act.name),
              },
            })) || [],
        },
        provider: { "@id": `${siteUrl}/#organization` },
        partOfTrip: { "@id": `${pageUrl}#tour` },
      };
    }) || [];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    name: "Java Volcano Tour Operator (JVTO)",
    url: siteUrl,
    logo: `${siteUrl}/assets/img/jvto-logo.png`,
    image: [`${siteUrl}/assets/img/office-front.jpg`],
    email: "hello@javavolcano-touroperator.com",
    telephone: "+62 822-4478-8833",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Khairil Anwar No.102 A, Badean",
      addressLocality: "Bondowoso",
      addressRegion: "East Java",
      postalCode: "68214",
      addressCountry: "ID",
    },
    sameAs: [
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://www.trustpilot.com/review/javavolcano-touroperator.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Java Volcano Tour Operator (JVTO)",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };

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
          { "@type": "ListItem", position: 3, name: pkg.name, item: pageUrl },
        ],
      },
      {
        "@type": "TouristTrip",
        "@id": `${pageUrl}#tour`,
        name: pkg.name,
        description: stripHtml(pkg.description),
        url: pageUrl,
        image: [schemaImageUrl],
        touristType: pkg.marketing?.perfectFor || ["Adventure seekers"],
        tripOrigin: { "@type": "Place", name: pkg.originCity },
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
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: pkg.name,
        description: stripHtml(pkg.description),
        image: [schemaImageUrl],
        sku: pkg.packageId,
        brand: { "@id": `${siteUrl}/#organization` },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: pkg.aggregateRating?.ratingValue || "4.9",
          reviewCount: pkg.aggregateRating?.reviewCount || "112",
        },
        offers: { "@id": `${pageUrl}#aggregateOffer` },
        potentialAction: { "@type": "ReserveAction", target: pageUrl },
      },
      {
        "@type": "AggregateOffer",
        "@id": `${pageUrl}#aggregateOffer`,
        priceCurrency: "IDR",
        lowPrice: pkg.offers?.aggregateOffer?.lowPrice,
        highPrice: pkg.offers?.aggregateOffer?.highPrice,
        offerCount: pkg.offers?.tiers?.length || 0,
        offers: dynamicOffers,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
      />
    </>
  );
}

// --- 5. METADATA GENERATION ---
const getReviewsData = cache(async () => {
  const raw = await prisma.reviews.findMany({
    where: { platform: { equals: "Trustpilot" } },
    orderBy: { date: "desc" },
  });

  return raw.map((r) => ({
    name: r.customer_name,
    date: r.date.toISOString(), // Ubah Date ke String
    url: r.url || r.url_reference || "",
    stars: Number(r.star),
    title: r.review?.substring(0, 60) ?? "",
    text: r.review ?? "",
    verified: true,
  }));
});

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
  const metaTitle = `${pkg.name} | Private Tour from ${pkg.originCity}`;
  const metaDesc = `Book ${pkg.name}. Starts from ${price}. ${cleanDesc}...`;

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [data, reviews] = await Promise.all([
    getTourData(slug),
    getReviewsData(),
  ]);
  
  if (!data) notFound();

  return (
    <>
      <StructuredData data={data} />
      <TourDetail initialData={data} reviews={reviews} />{" "}
    </>
  );
}
