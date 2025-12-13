import TourDetail from "@/components/website/TourDetail";
import StructuredData from "@/components/website/StructuredData";
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

// --- METADATA GENERATION ---

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Pastikan ada fallback URL jika env belum tersetting
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  
  const { slug } = await params;
  const fullSlug = `tours/from-bali/${slug}`;

  // Fetch data
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

  // Format Data untuk SEO
  const cleanDesc = stripHtml(pkg.description).substring(0, 160);
  const price = formatCurrency(pkg.offers?.aggregateOffer?.lowPrice || 0);
  const metaTitle = `${pkg.name} | Private Tour from ${pkg.originCity}`;
  const metaDesc = `Book ${pkg.name}. Starts from ${price}. ${cleanDesc}...`;

  // LOGIC GAMBAR ABSOLUT (Sangat Penting untuk WA/FB/Twitter)
  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]) || "/assets/img/og/default.jpg";
  
  // Cek apakah rawImage sudah ada 'http'. Jika belum, tempel dengan siteUrl.
  const imageUrl = rawImage.startsWith("http") 
    ? rawImage 
    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `${siteUrl}/tours/from-bali/${slug}`, // Canonical URL
      siteName: 'Java Volcano Tour Operator',
      locale: 'id_ID',
      type: 'website',
      // DITEMPATKAN DISINI AGAR OVERRIDE LAYOUT DEFAULT
      images: [
        {
          url: imageUrl, 
          width: 1200,
          height: 630,
          alt: pkg.name,
        }
      ], 
      // Penting: Jangan gunakan ...previousImages disini agar gambar default layout tidak muncul
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [imageUrl], // Gunakan URL absolut
    },
  };
}

// --- MAIN PAGE COMPONENT ---

export default async function Page({ params }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const { slug } = await params;
  const fullSlug = `tours/from-bali/${slug}`

  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const tour: TourPackageDetail = await res.json();
  const pkg = tour.product || tour;

  // Logic URL Gambar untuk Schema (Product)
  const rawImage = pkg.imageUrl || (pkg.gallery && pkg.gallery[0]);
  const schemaImageUrl = rawImage && !rawImage.startsWith("http") 
    ? `${siteUrl}${rawImage}` 
    : rawImage;

  // JSON-LD untuk SEO Google Rich Snippets (Product)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.name,
    "image": schemaImageUrl,
    "description": stripHtml(pkg.description),
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": pkg.offers?.aggregateOffer?.lowPrice,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <TourDetail initialData={tour} />
    </>
  );
}