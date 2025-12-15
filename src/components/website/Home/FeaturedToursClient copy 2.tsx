"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import { formatIDR } from "@/utils/formatting"; // Pastikan path ini benar
import TourCard from "../TourCard";
import {
  Filter,
  X,
  Mountain,
  Waves,
  Umbrella,
  PawPrint,
  Check,
  RefreshCcw,
} from "lucide-react";

// --- TIPE DATA ---
interface FeaturedToursClientProps {
  surabayaTours: ListTourPackage[];
  baliTours: ListTourPackage[];
}

type TourCategory = "Volcano" | "Waterfall" | "Beach" | "Wildlife";

// --- KOMPONEN FILTER DRAWER ---
interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    duration: number | null;
    maxPrice: number;
    categories: TourCategory[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      duration: number | null;
      maxPrice: number;
      categories: TourCategory[];
    }>
  >;
  priceRange: { min: number; max: number };
  tourCounts: number;
}

const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  priceRange,
  tourCounts,
}: FilterDrawerProps) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCategoryToggle = (cat: TourCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleClear = () => {
    setFilters({
      duration: null,
      maxPrice: priceRange.max,
      categories: [],
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-jvto-dark">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close Button"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 1. Duration Filter */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Duration</h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <button
                  key={day}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      duration: prev.duration === day ? null : day,
                    }))
                  }
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium border transition-all
                    ${
                      filters.duration === day
                        ? "bg-yellow-400 border-yellow-400 text-black shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-yellow-400"
                    }
                  `}
                >
                  {day} Day{day > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Filter */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Price Range</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>0</span>
                <span className="font-bold text-jvto-dark">
                  {formatIDR(filters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Price Range"
                min={0}
                max={priceRange.max}
                step={100000}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jvto-dark"
              />
              <p className="text-xs text-center text-gray-400 mt-2">
                Slide to adjust maximum budget
              </p>
            </div>
          </div>

          {/* 3. Tour Type Filter */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Tour Type</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Volcano", icon: Mountain, value: "Volcano" },
                { label: "Waterfall", icon: Waves, value: "Waterfall" },
                { label: "Beach", icon: Umbrella, value: "Beach" },
                { label: "Wildlife", icon: PawPrint, value: "Wildlife" },
              ].map((type) => {
                const isSelected = filters.categories.includes(
                  type.value as TourCategory
                );
                return (
                  <button
                    key={type.value}
                    onClick={() =>
                      handleCategoryToggle(type.value as TourCategory)
                    }
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "border-jvto-dark bg-jvto-dark/5 text-jvto-dark"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }
                    `}
                  >
                    <type.icon
                      className={`w-4 h-4 ${isSelected ? "fill-current" : ""}`}
                    />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors px-2"
          >
            <RefreshCcw size={18} strokeWidth={2} />
            Clear
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-jvto-dark text-white py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
          >
            Show {tourCounts} Tours
          </button>
        </div>
      </div>
    </>
  );
};

// --- MAIN CLIENT COMPONENT ---
const FeaturedToursClient = ({
  surabayaTours,
  baliTours,
}: FeaturedToursClientProps) => {
  const [activeLocation, setActiveLocation] = useState<"surabaya" | "bali">(
    "surabaya"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Cari harga tertinggi dari semua data untuk batas atas slider
  const globalMaxPrice = useMemo(() => {
    const allTours = [...surabayaTours, ...baliTours];
    return Math.max(...allTours.map((t) => t.startFrom)) + 500000; // Tambah buffer sedikit
  }, [surabayaTours, baliTours]);

  // State Filter
  const [filters, setFilters] = useState<{
    duration: number | null;
    maxPrice: number;
    categories: TourCategory[];
  }>({
    duration: null,
    maxPrice: globalMaxPrice,
    categories: [],
  });

  // Reset filter jika lokasi berubah (optional, bisa dihapus jika ingin filter persisten)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, maxPrice: globalMaxPrice }));
  }, [activeLocation, globalMaxPrice]);

  // Logic Filtering
  const filteredData = useMemo(() => {
    const baseData = activeLocation === "surabaya" ? surabayaTours : baliTours;

    return baseData.filter((tour) => {
      // 1. Duration Check
      if (filters.duration && tour.duration.day !== filters.duration)
        return false;

      // 2. Price Check
      if (tour.startFrom > filters.maxPrice) return false;

      // 3. Category/Tags Check
      if (filters.categories.length > 0) {
        // Mapping category ke keyword tags dari JSON Anda
        const tourTags = tour.tags.map((t) => t.toLowerCase());
        const hasMatch = filters.categories.some((cat) => {
          if (cat === "Volcano")
            return (
              tourTags.includes("volcano") ||
              tourTags.includes("bromo") ||
              tourTags.includes("ijen")
            );
          if (cat === "Waterfall")
            return (
              tourTags.includes("waterfall") ||
              tourTags.includes("madakaripura") ||
              tourTags.includes("tumpak-sewu")
            );
          if (cat === "Beach")
            return (
              tourTags.includes("beach") ||
              tourTags.includes("papuma") ||
              tourTags.includes("papuma-beach")
            );
          if (cat === "Wildlife")
            return (
              tourTags.includes("wildlife") || tourTags.includes("taman-safari")
            );
          return false;
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [activeLocation, surabayaTours, baliTours, filters]);

  // Check apakah ada filter yang aktif
  const activeFilterCount =
    (filters.duration ? 1 : 0) +
    filters.categories.length +
    (filters.maxPrice < globalMaxPrice ? 1 : 0);

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-8">
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
          adventure.
        </p>

        {/* --- CONTROL BAR: LOCATION + FILTER BUTTON --- */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
          {/* Tab Location */}
          <div className="inline-flex bg-gray-100 p-1.5 rounded-full relative">
            <button
              onClick={() => setActiveLocation("surabaya")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
                activeLocation === "surabaya"
                  ? "bg-white text-jvto-dark shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              From Surabaya
            </button>
            <button
              onClick={() => setActiveLocation("bali")}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 ${
                activeLocation === "bali"
                  ? "bg-white text-jvto-dark shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              From Bali
            </button>
          </div>

          {/* Filter Trigger Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold uppercase transition-all
              ${
                activeFilterCount > 0
                  ? "bg-jvto-dark text-white border-jvto-dark hover:bg-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-800"
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-yellow-400 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- GRID CONTENT --- */}
      {filteredData.length > 0 ? (
        <div
          className="
          flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 
          md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3 md:pb-0 md:mx-0 md:px-0 
          scrollbar-hide
        "
        >
          {filteredData.map((tour) => (
            <div
              key={tour.id}
              className="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0"
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 mx-auto max-w-2xl">
          <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
            <Filter className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No matching tours found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or search criteria.
          </p>
          <button
            onClick={() =>
              setFilters({
                duration: null,
                maxPrice: globalMaxPrice,
                categories: [],
              })
            }
            className="text-white bg-jvto-dark px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="text-center mt-8 md:mt-16">
        <Link
          href="/tours"
          className="inline-block border-2 border-jvto-dark text-jvto-dark px-8 py-3 font-bold uppercase tracking-wide hover:bg-jvto-dark hover:text-white transition-all"
        >
          See All Private Tours
        </Link>
      </div>

      {/* --- FILTER DRAWER COMPONENT --- */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        priceRange={{ min: 0, max: globalMaxPrice }}
        tourCounts={filteredData.length}
      />
    </div>
  );
};

export default FeaturedToursClient;
