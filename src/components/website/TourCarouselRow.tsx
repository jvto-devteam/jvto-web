// src/components/website/TourCarouselRow.tsx
"use client";

import React, { useRef } from "react";
import { ListTourPackage } from "@/types";
import TourCard from "./TourCard";

const TourCarouselRow = React.forwardRef<
  HTMLElement,
  { title: string;subtitle: string; tours: ListTourPackage[] }
>(({ title,subtitle, tours }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (tours.length === 0) return null;

  return (
    <section ref={ref} className="py-8 scroll-mt-24">
      <header className="mb-8 md:flex md:items-center md:justify-between">
        <div>
        <h3 className="text-2xl font-bold text-ink-primary dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-300">{subtitle}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
          <button
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll("left")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll("right")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </header>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-snap-x snap-mandatory scrollbar-hide"
        >
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="snap-start flex-shrink-0 w-80 md:w-[24rem]"
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TourCarouselRow.displayName = "TourCarouselRow";
export default TourCarouselRow;