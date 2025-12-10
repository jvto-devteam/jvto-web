"use client"; // Wajib karena ada onClick dan useState

import { useState } from "react";
import TourCard from "../Tours/TourCard";
import { ListTourPackage } from "@/types";

interface FeaturedToursClientProps {
  surabayaTours: ListTourPackage[];
  baliTours: ListTourPackage[];
}

const FeaturedToursClient = ({
  surabayaTours,
  baliTours,
}: FeaturedToursClientProps) => {
  // State untuk Tab Lokasi (Default Surabaya)
  const [activeLocation, setActiveLocation] = useState<"surabaya" | "bali">(
    "surabaya"
  );

  // State untuk Filter Durasi (Default null/All)
  const [activeDuration, setActiveDuration] = useState<number | null>(null);

  // 1. Pilih Datasource berdasarkan Tab Lokasi
  const currentData = activeLocation === "surabaya" ? surabayaTours : baliTours;

  // 2. Filter data terpilih berdasarkan Durasi (jika ada filter aktif)
  const filteredData = activeDuration
    ? currentData.filter((tour) => tour.duration.day === activeDuration)
    : currentData;

  // 3. Slice data agar tidak terlalu banyak (misal max 6)
  const displayData = filteredData;

  // Handler untuk toggle durasi (klik lagi untuk uncheck)
  const handleDurationClick = (day: number) => {
    setActiveDuration(activeDuration === day ? null : day);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-yellow-400">★★★★★</span>
          <span className="font-bold text-sm">Trustpilot</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
          Tried & Trusted Adventures
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Our most popular private, all-inclusive routes. We handle the permits,
          transport, and Ijen health screening so you can focus on the
          adventure.{" "}
        </p>

        {/* --- TAB TOGGLE LOCATION (Menyatu) --- */}
        <div className="inline-flex bg-gray-200 p-1 rounded-full mb-6 relative">
          {/* Tombol Surabaya */}
          <button
            onClick={() => {
              setActiveLocation("surabaya");
              setActiveDuration(null);
            }} // Reset duration saat ganti lokasi
            className={`px-8 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
              activeLocation === "surabaya"
                ? "bg-white text-jvto-dark shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            From Surabaya
          </button>

          {/* Tombol Bali */}
          <button
            onClick={() => {
              setActiveLocation("bali");
              setActiveDuration(null);
            }}
            className={`px-8 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
              activeLocation === "bali"
                ? "bg-white text-jvto-dark shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            From Bali
          </button>
        </div>

        {/* --- FILTER DURATION --- */}
        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5].map((day) => (
            <button
              key={day}
              onClick={() => handleDurationClick(day)}
              className={`px-4 py-1 border rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                activeDuration === day
                  ? "bg-jvto-dark border-jvto-dark text-white" // Active Style
                  : "bg-transparent border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700" // Inactive Style
              }`}
            >
              {day} Day{day > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRID CONTENT (Dinamis tanpa reload) --- */}
      {displayData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animation-fade-in">
          {displayData.map((tour) => (
            <div key={tour.id} className="h-[500px]">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">
            No tours found for {activeDuration} Days from{" "}
            {activeLocation === "bali" ? "Bali" : "Surabaya"}.
          </p>
          <button
            onClick={() => setActiveDuration(null)}
            className="text-jvto-dark font-bold text-sm mt-2 underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="text-center mt-16">
        <a
          href="/tours"
          className="inline-block border-2 border-jvto-dark text-jvto-dark px-8 py-3 font-bold uppercase tracking-wide hover:bg-jvto-dark hover:text-white transition-all"
        >
          See All Private Tours
        </a>
      </div>
    </div>
  );
};

export default FeaturedToursClient;
