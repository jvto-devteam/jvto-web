import TourDetail from "@/components/website/TourDetail";
import { notFound } from "next/navigation";
import type { TourPackageDetail } from "@/interfaces";
import type { Metadata, ResolvingMetadata } from "next";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// --- HELPER FUNCTIONS ---

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

// Helper untuk membuat URL dummy destinasi (Untuk Schema Itinerary)
function getDestinationUrl(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  return `https://javavolcano-touroperator.com/destinations/${slug}`;
}

// --- INTERNAL COMPONENT: STRUCTURED DATA (SCHEMA) ---
// Komponen ini menangani Organization, Website, TouristTrip, Product, Offer, dan FAQ
function StructuredData({ data }: { data: TourPackageDetail }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pkg = data.product || data;
  
  // Logic URL Halaman
  // Menangani slug array dari [...slug] atau string biasa
  const slugString = Array.isArray(pkg.slug) ? pkg.slug.join('/') : pkg.slug;
  const cleanSlug = slugString.startsWith("tours/") ? slugString : `tours/from-surabaya/${slugString}`;
  const pageUrl = `${siteUrl}/${cleanSlug}`;

  // Logic URL Gambar Absolute
  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]);
  const schemaImageUrl = rawImage && !rawImage.startsWith("http") 
    ? `${siteUrl}${rawImage}` 
    : rawImage;

  // 1. Dynamic Offers Logic (Looping Tier Harga)
  const dynamicOffers = pkg.offers?.tiers?.map((tier: any) => ({
    "@type": "Offer",
    "sku": tier.sku,
    "price": tier.pricePerPerson,
    "priceCurrency": "IDR",
    "eligibleQuantity": {
      "@type": "QuantitativeValue",
      "minValue": tier.paxMin,
      ...(tier.paxMax > 0 && { "maxValue": tier.paxMax })
    },
    "availability": "https://schema.org/InStock",
    "url": pageUrl
  })) || [];

  // 2. Dynamic Itinerary Logic (Looping Route)
  const itineraryList = pkg.route?.map((place: string, index: number) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "TouristAttraction",
      "name": place,
      "url": getDestinationUrl(place)
    }
  })) || [];

  // Schema Organization (Static)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${siteUrl}/#organization`,
    "name": "Java Volcano Tour Operator (JVTO)",
    "url": siteUrl,
    "logo": `${siteUrl}/assets/img/jvto-color.png`,
    "image": [`${siteUrl}/assets/img/office-front.jpg`],
    "email": "hello@javavolcano-touroperator.com",
    "telephone": "+62 822-4478-8833",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Khairil Anwar No.102 A, Badean",
      "addressLocality": "Bondowoso",
      "addressRegion": "East Java",
      "postalCode": "68214",
      "addressCountry": "ID"
    },
    "sameAs": [
      "https://www.tripadvisor.com/Attraction_Review-g297715-d19983165-Reviews-Java_Volcano_Tour_Operator-Surabaya_East_Java_Java.html",
      "https://www.trustpilot.com/review/javavolcano-touroperator.com"
    ]
  };

  // Schema Website (Static)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "Java Volcano Tour Operator (JVTO)",
    "publisher": { "@id": `${siteUrl}/#organization` },
    "inLanguage": "en"
  };

  // Schema Main Graph (Product, Tour, Breadcrumb)
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": pkg.name,
        "description": stripHtml(pkg.description).substring(0, 160),
        "inLanguage": "en",
        "primaryImageOfPage": { "@type": "ImageObject", "url": schemaImageUrl },
        "breadcrumb": { "@id": `${pageUrl}#breadcrumb` },
        "isPartOf": { "@id": `${siteUrl}/#website` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
          { "@type": "ListItem", "position": 2, "name": "Tours", "item": `${siteUrl}/tours` },
          { "@type": "ListItem", "position": 3, "name": pkg.name, "item": pageUrl }
        ]
      },
      {
        "@type": "TouristTrip",
        "@id": `${pageUrl}#tour`,
        "name": pkg.name,
        "description": stripHtml(pkg.description),
        "url": pageUrl,
        "image": [schemaImageUrl],
        "touristType": pkg.marketing?.perfectFor || ["Adventure seekers"],
        "tripOrigin": { "@type": "Place", "name": pkg.originCity },
        "itinerary": {
          "@type": "ItemList",
          "itemListElement": itineraryList
        },
        "provider": { "@id": `${siteUrl}/#organization` },
        "offers": { "@id": `${pageUrl}#aggregateOffer` }
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        "name": pkg.name,
        "description": stripHtml(pkg.description),
        "image": [schemaImageUrl],
        "sku": pkg.packageId,
        "brand": { "@id": `${siteUrl}/#organization` },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": pkg.aggregateRating?.ratingValue || "4.9", 
          "reviewCount": pkg.aggregateRating?.reviewCount || "112"
        },
        "offers": { "@id": `${pageUrl}#aggregateOffer` },
        "potentialAction": { "@type": "ReserveAction", "target": pageUrl }
      },
      {
        "@type": "AggregateOffer",
        "@id": `${pageUrl}#aggregateOffer`,
        "priceCurrency": "IDR",
        "lowPrice": pkg.offers?.aggregateOffer?.lowPrice,
        "highPrice": pkg.offers?.aggregateOffer?.highPrice,
        "offerCount": pkg.offers?.tiers?.length || 0,
        "offers": dynamicOffers
      }
    ]
  };

  // Schema FAQ (Hardcoded Sementara)
  // const faqSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "FAQPage",
  //   "mainEntity": [
  //     {
  //       "@type": "Question",
  //       "name": "Is this tour suitable for beginners?",
  //       "acceptedAnswer": { "@type": "Answer", "text": "Yes, moderate fitness is required for Ijen. Bromo is leisure." }
  //     },
  //     {
  //       "@type": "Question",
  //       "name": "What is included?",
  //       "acceptedAnswer": { "@type": "Answer", "text": "Private transport, guide, accommodation, Jeep, and entrance fees." }
  //     },
  //     {
  //       "@type": "Question",
  //       "name": "Is health certificate required?",
  //       "acceptedAnswer": { "@type": "Answer", "text": "Yes for Ijen Crater. We assist you to get one in Bondowoso." }
  //     }
  //   ]
  // };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }} />
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> */}
    </>
  );
}

// --- METADATA GENERATION ---

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  
  const { slug } = await params;
  const fullSlug = `tours/from-surabaya/${slug}`;

  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Tour Not Found",
      description: "The tour package you are looking for does not exist."
    };
  }

  const tour: TourPackageDetail = await res.json();
  const pkg = tour.product || tour; 

  const cleanDesc = stripHtml(pkg.description).substring(0, 160);
  const price = formatCurrency(pkg.offers?.aggregateOffer?.lowPrice || 0);
  const metaTitle = `${pkg.name} | Private Tour from ${pkg.originCity}`;
  const metaDesc = `Book ${pkg.name}. Starts from ${price}. ${cleanDesc}...`;

  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]) || "/assets/img/og/default.jpg";
  const imageUrl = rawImage.startsWith("http") 
    ? rawImage 
    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `${siteUrl}/tours/from-surabaya/${slug}`,
      siteName: 'Java Volcano Tour Operator',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: imageUrl, 
          width: 1200,
          height: 630,
          alt: pkg.name,
        }
      ], 
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [imageUrl],
    },
  };
}

// --- MAIN PAGE COMPONENT ---

export default async function Page({ params }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const { slug } = await params;
  const fullSlug = `tours/from-surabaya/${slug}`

  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const tour: TourPackageDetail = await res.json();

  return (
    <>
      {/* Menggunakan Internal Component 'StructuredData' yang sudah disatukan di file ini.
        Passing 'tour' (full data object), bukan hanya potongan jsonld sederhana.
      */}
      <StructuredData data={tour} />
      <TourDetail initialData={tour} />
    </>
  );
}