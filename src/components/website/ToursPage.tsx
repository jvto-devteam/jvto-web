// app/tours/page.tsx   atau   app/components/EnhancedToursPage.tsx
// ← TIDAK PERLU "use client" di file ini!

import { TourPackage } from "@/types";
import ToursPageClient from "./ToursPageClient"; // yang interaktif saja

// Fungsi untuk fetch semua data tours (bisa dipanggil di server)
async function getAllTours(): Promise<TourPackage[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${siteUrl}/api/packages/web`, { // Tanpa ?from untuk fetch semua tours
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all tours");
  return res.json();
}

export default async function ToursPage() {
  const initialTours = await getAllTours();
  
  return (
    // Pass data ke Client Component untuk handling interaksi dan filtering
    <ToursPageClient initialTours={initialTours} />
  );
}