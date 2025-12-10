// src/app/(website)/destinations/[slug]/page.tsx

import { notFound } from "next/navigation";
import DestinationDetailView from "@/components/website/DestinationDetailView"; 
import type { DestinationDetail } from "@/interfaces";
interface Props {
  params: Promise<{ slug: string }>; 
}
// Fungsi Fetcher (Hanya berjalan di server)
async function getDestination(slug: string): Promise<DestinationDetail> {
  // Menggunakan Site URL dari ENV atau fallback ke localhost jika dev
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch ke endpoint dinamis
  const res = await fetch(`${siteUrl}/api/destinations/web/${slug}`, {
    method: "GET",
    cache: "no-store", // Data selalu fresh, tidak di-cache
  });

  if (!res.ok) {
    if (res.status === 404) return undefined as any; // Trigger notFound() nanti
    throw new Error(`Failed to fetch destination details: ${res.status}`);
  }

  return res.json();
}

// Page Component
export default async function Page({ params }: Props) {
  // Await params karena di Next.js versi terbaru params bisa jadi promise
  const { slug } = await params;
  
  const data = await getDestination(slug);

  // Jika data tidak ditemukan di API, tampilkan halaman 404 bawaan Next.js
  if (!data) {
    notFound();
  }

  // Render Client Component dengan data yang sudah di-fetch
  return <DestinationDetailView data={data} />;
}