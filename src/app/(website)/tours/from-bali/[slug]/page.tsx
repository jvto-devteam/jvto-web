// app/(website)/tours/[slug]/page.tsx
import TourDetail from "@/components/website/TourDetail";
import StructuredData from "@/components/website/StructuredData";
import { notFound } from "next/navigation";
import type { TourPackageDetail } from "@/interfaces";
import type { Metadata, ResolvingMetadata } from "next";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// 1. Helper untuk membersihkan HTML tags dari deskripsi (Server Side)
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

// 2. Helper format currency (Opsional, untuk ditampilkan di deskripsi)
function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

// 3. Fungsi Utama Generate Metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { slug } = await params;
  const fullSlug = `tours/from-bali/${slug}`;

  // Fetch data (Deduplicated automatically by Next.js)
  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" } // Sesuaikan cache strategi Anda
  );

  if (!res.ok) {
    return {
      title: "Tour Not Found",
      description: "The tour package you are looking for does not exist."
    };
  }

  const tour: TourPackageDetail = await res.json();
  const product = tour.product; // Sesuaikan struktur response API Anda (di kode asli Anda ada 'tour.product' atau langsung 'tour')
  // Note: Di kode asli Anda di "Page", variable 'tour' langsung dipakai, tapi di "TourDetail" ada 'initialData.product'.
  // Saya asumsikan struktur datanya: const pkg = tour.product || tour; 
  const pkg = tour.product || tour; 

  // Siapkan Data
  const previousImages = (await parent).openGraph?.images || [];
  const cleanDesc = stripHtml(pkg.description).substring(0, 160); // Max 160 chars untuk SEO
  const price = formatCurrency(pkg.offers?.aggregateOffer?.lowPrice || 0);
  
  const metaTitle = `${pkg.name} | Private Tour from ${pkg.originCity}`;
  const metaDesc = `Book ${pkg.name}. Starts from ${price}. ${cleanDesc}...`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `${siteUrl}/${slug}`,
      siteName: 'Java Volcano Tour Operator',
      images: [
        {
          url: siteUrl+pkg.imageUrl || siteUrl+pkg.gallery[0], // Gambar utama paket
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
        ...previousImages,
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [pkg.imageUrl || pkg.gallery[0]],
    },
  };
}

export default async function Page({ params }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { slug } = await params;
  const fullSlug = `tours/from-bali/${slug}`

  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const tour: TourPackageDetail = await res.json();

  // JSON-LD untuk SEO Google Rich Snippets (Product / Event)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": tour.product?.name || tour.name,
    "image": tour.product?.imageUrl || tour.imageUrl,
    "description": stripHtml(tour.product?.description || tour.description),
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": tour.product?.offers?.aggregateOffer?.lowPrice,
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