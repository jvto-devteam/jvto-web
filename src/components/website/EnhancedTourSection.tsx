// app/tours/page.tsx   atau   app/components/EnhancedTourSection.tsx
// ← TIDAK PERLU "use client" di file ini!

import { TourPackage } from "@/types";
import TourCarouselClient from "./TourCarouselClient"; // yang interaktif saja

// Fungsi untuk fetch data (bisa dipanggil paralel)
async function getTours(from: number): Promise<TourPackage[]> {
  const res = await fetch(
    `http://localhost:3000/api/packages/web?from=${from}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch tours");
  return res.json();
}

export default async function EnhancedTourSection() {
  // Fetch paralel biar cepat (hanya butuh ~1 request time)
  const [surabayaTours, baliTours] = await Promise.all([
    getTours(4), // Surabaya
    getTours(3), // Bali
  ]);

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4">
        {/* SEMUA INI LANGSUNG ADA DI HTML → GOOGLE SENYUM LEBAR */}
        <div className="max-w-8xl mx-auto mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white">
            Start Your Private Route
          </h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-300">
            Choose where you begin and how fast you travel. We arrange private
            vehicles, professional drivers, Bromo jeeps, park tickets, Ijen
            health screening, comfortable hotels, all breakfasts, extra meals in
            Bondowoso, drinking water and essential gear – all planned only for
            your group.
          </p>

          {/* Hanya bagian interaktif (tab + scroll) yang dikirim ke Client Component */}
          <TourCarouselClient
            initialSurabayaTours={surabayaTours}
            initialBaliTours={baliTours}
          />
        </div>
      </div>
    </section>
  );
}
