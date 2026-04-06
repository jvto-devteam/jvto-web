"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import TourCard from "../TourCard";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";

// --- TIPE DATA ---
interface FeaturedToursClientProps {
  surabayaTours: ListTourPackage[];
  baliTours: ListTourPackage[];
}

interface TourRowProps {
  title: string;
  tours: ListTourPackage[];
  hubHref: string;
}

const TourCarouselRow = ({ title, tours, hubHref }: TourRowProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (tours.length === 0) return null;

  return (
    <section className="border-t border-[#e7ebdd] bg-white py-8 md:py-10">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-wide text-jvto-dark md:text-3xl">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              {tours.length} private route options
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={hubHref}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d6dfbf] px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-jvto-dark transition-colors hover:bg-[#f4f6ed]"
            >
              Open hub
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="hidden gap-3 md:flex">
              <button
                onClick={() => scroll("left")}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-jvto-dark hover:bg-jvto-dark hover:text-white"
                aria-label="Scroll Left"
              >
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-jvto-dark hover:bg-jvto-dark hover:text-white"
                aria-label="Scroll Right"
              >
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative -mx-6 md:mx-0 md:px-0">
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide md:gap-6"
            style={{ scrollBehavior: "smooth" }}
          >
            {tours.map((tour, key) => (
              <div
                key={tour.id}
                className={`${key === 0 ? "ml-6" : ""} ${
                  key + 1 === tours.length ? "mr-6" : ""
                } w-[80vw] flex-shrink-0 sm:w-[350px]`}
              >
                <TourCard isNewTab={true} tour={tour} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN CLIENT COMPONENT ---
const FeaturedToursClient = ({
  surabayaTours,
  baliTours,
}: FeaturedToursClientProps) => {
  const [activeOrigin, setActiveOrigin] = useState<"surabaya" | "bali">(
    "surabaya",
  );
  const activeRow =
    activeOrigin === "surabaya"
      ? {
          key: "surabaya",
          label: "From Surabaya",
          hubHref: "/tours/from-surabaya",
          note: "Best when you want the widest East Java route spread with cleaner mainland airport logic.",
          tours: surabayaTours,
        }
      : {
          key: "bali",
          label: "From Bali",
          hubHref: "/tours/from-bali",
          note: "Best when East Java is one leg of a Bali trip and you want the cross-island handoff handled for you.",
          tours: baliTours,
        };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#e7f1d3] rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-jvto-dark" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green mb-4">
          Discovery System
        </p>
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 text-jvto-dark">
          Start With The Right Route
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Choose your real departure point first, then move straight into the
          route shapes that fit your trip. The goal here is not to read a long
          brochure, but to reach the right package faster.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dfc9] px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-jvto-green" />
            Private route handling
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dfc9] px-3 py-2">
            <Users className="h-4 w-4 text-jvto-green" />
            No merged stranger groups
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d9dfc9] px-3 py-2">
            <Waypoints className="h-4 w-4 text-jvto-green" />
            Pickup logic already mapped
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Homepage tour origins"
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-4"
        >
          <button
            id="tab-surabaya"
            role="tab"
            aria-selected={activeOrigin === "surabaya"}
            aria-controls="homepage-origin-panel"
            onClick={() => setActiveOrigin("surabaya")}
            className={`w-full rounded-lg border-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 sm:w-auto md:px-8 ${
              activeOrigin === "surabaya"
                ? "border-jvto-dark bg-jvto-dark text-white shadow-xl"
                : "border-jvto-dark bg-white text-jvto-dark shadow-sm hover:-translate-y-1 hover:bg-jvto-dark hover:text-white"
            }`}
          >
            From Surabaya
          </button>
          <button
            id="tab-bali"
            role="tab"
            aria-selected={activeOrigin === "bali"}
            aria-controls="homepage-origin-panel"
            onClick={() => setActiveOrigin("bali")}
            className={`w-full rounded-lg border-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 sm:w-auto md:px-8 ${
              activeOrigin === "bali"
                ? "border-jvto-dark bg-jvto-dark text-white shadow-xl"
                : "border-jvto-dark bg-white text-jvto-dark shadow-sm hover:-translate-y-1 hover:bg-jvto-dark hover:text-white"
            }`}
          >
            From Bali
          </button>
        </div>

        <div className="mt-5 text-sm text-gray-600">
          {activeRow.note}
        </div>
      </div>

      <div id="homepage-origin-panel" role="tabpanel" aria-labelledby={`tab-${activeRow.key}`}>
        <TourCarouselRow
          title={activeRow.label}
          tours={activeRow.tours}
          hubHref={activeRow.hubHref}
        />
      </div>

      <div className="text-center container mx-auto px-6">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 bg-jvto-dark text-white px-10 py-4 font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all"
        >
          View All Tours
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedToursClient;
