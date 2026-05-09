// components/TourCarouselClient.tsx
"use client";

import { useState, useRef } from "react";
import Link from "@/components/website/AppLink";
import { ListTourPackage } from "@/types";
import TourCarouselRow from "./TourCarouselRow";

type Props = {
  initialSurabayaTours: ListTourPackage[];
  initialBaliTours: ListTourPackage[];
};

export default function TourCarouselClient({
  initialSurabayaTours,
  initialBaliTours,
}: Props) {
  const [activeTab, setActiveTab] = useState<"surabaya" | "bali">("surabaya");
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const surabayaRef = useRef<HTMLElement>(null);
  const baliRef = useRef<HTMLElement>(null);

  const handleTabClick = (tab: "surabaya" | "bali") => {
    setActiveTab(tab);
    const ref = tab === "surabaya" ? surabayaRef : baliRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // === DURATION CHIPS + FILTERING ===
  const allTours = [...initialSurabayaTours, ...initialBaliTours];
  const durationMap = new Map<string, ListTourPackage[]>();

  allTours.forEach((tour) => {
    const label = tour.duration.day >= 5 ? "5D+" : `${tour.duration.day}D${tour.duration.night}N`;
    if (!durationMap.has(label)) durationMap.set(label, []);
    durationMap.get(label)!.push(tour);
  });

  const sortedDurations = Array.from(durationMap.keys()).sort((a, b) => {
    const aNum = a === "5D+" ? 99 : parseInt(a);
    const bNum = b === "5D+" ? 99 : parseInt(b);
    return aNum - bNum;
  });

  const getFilteredTours = (tours: ListTourPackage[]) => {
    if (!selectedDuration) return tours;
    return tours.filter((tour) => {
      const label = tour.duration.day >= 5 ? "5D+" : `${tour.duration.day}D${tour.duration.night}N`;
      return label === selectedDuration;
    });
  };

  const surabayaTours = getFilteredTours(initialSurabayaTours);
  const baliTours = getFilteredTours(initialBaliTours);

  return (
    <>
      {/* SEMUA DI KIRI — RATA KIRI SEPERTI JUDUL & PARAGRAF DI ATASNYA */}
      <div className="mt-6 flex flex-col gap-5 max-w-8xl mx-auto text-left">
        {/* Tabs — rata kiri */}
        <div className="flex items-center gap-1 p-1 bg-ink-neutral-100 dark:bg-background-dark rounded-full shadow-inner w-fit">
          <button
            onClick={() => handleTabClick("surabaya")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              activeTab === "surabaya"
                ? "bg-primary text-white"
                : "text-ink-neutral-700 dark:text-ink-neutral-200"
            }`}
          >
            From Surabaya
          </button>
          <button
            onClick={() => handleTabClick("bali")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              activeTab === "bali"
                ? "bg-primary text-white"
                : "text-ink-neutral-700 dark:text-ink-neutral-200"
            }`}
          >
            From Bali
          </button>
        </div>

        {/* Microcopy — rata kiri */}
        <p className="text-sm text-ink-neutral-600 dark:text-ink-neutral-300 leading-relaxed max-w-2xl">
          No transport-only bookings. Every itinerary is a complete private tour with clear inclusions and support from our local team.
        </p>

        {/* Duration Chips — rata kiri + wrap rapi */}
        <div className="flex flex-wrap items-center gap-3">
          {/* All Durations */}
          <button
            onClick={() => setSelectedDuration(null)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDuration === null
                ? "bg-primary text-white shadow-sm"
                : "bg-ink-neutral-100 dark:bg-ink-neutral-800 text-ink-neutral-700 dark:text-ink-neutral-200 border border-ink-neutral-300 dark:border-ink-neutral-700 hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700"
            }`}
          >
            All Durations
          </button>

          {sortedDurations.map((duration) => (
            <button
              key={duration}
              onClick={() => setSelectedDuration(duration)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedDuration === duration
                  ? "bg-primary text-white shadow-sm"
                  : "bg-ink-neutral-100 dark:bg-ink-neutral-800 text-ink-neutral-700 dark:text-ink-neutral-200 border border-ink-neutral-300 dark:border-ink-neutral-700 hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700"
              }`}
            >
              <span className="material-symbols-outlined text-base">schedule</span>
              {duration}
            </button>
          ))}
        </div>
      </div>

      {/* TOUR ROWS */}
      <div className="max-w-8xl mx-auto mt-12">
        <TourCarouselRow
          ref={surabayaRef}
          title="Tours from Surabaya"
          subtitle="Fly into Surabaya and start your trip from the airport, train station or city hotel."
          tours={surabayaTours}
        />
        <TourCarouselRow
          ref={baliRef}
          title="Tours from Bali"
          subtitle="Begin on Bali and cross to East Java with one private operator handling your ferry, transfers and onward route."
          tours={baliTours}
        />

        <div className="mt-12 text-center">
          <Link
            href="/tours"
            className="inline-block px-6 py-2 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            View All Tours
          </Link>
        </div>
      </div>
    </>
  );
}