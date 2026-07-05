"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ListTourPackage } from "@/types";
import TourCard from "@/components/website/TourCard";
import { formatIDR } from "@/utils/formatting";
import {
  Filter,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Mountain,
  Waves,
  Umbrella,
  PawPrint,
  Check,
  RotateCcw,
  MapPin // Icon baru untuk lokasi
} from "lucide-react";

// --- TYPES ---
interface ToursPageClientProps {
  initialTours: ListTourPackage[];
  destinationName: string;
  description: string;
  title?: string;
  showLocationFilter?: boolean;
  hideHeader?: boolean;
}

type TourCategory = "Volcano" | "Waterfall" | "Beach" | "Wildlife";
type DurationRange = "1-2" | "3-4" | "5+";
type StartLocation = "Surabaya" | "Bali"; 

// --- COMPONENT: ACCORDION SECTION ---
const FilterSection = ({
  title,
  isOpen = true,
  children,
}: {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="border-b border-jvto-border py-5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-bold text-jvto-navy hover:text-jvto-orange mb-3 transition-colors"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.18em]">{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <div
        className={`space-y-3 overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ToursPageClient({
  initialTours,
  destinationName,
  description,
  title,
  showLocationFilter = false,
  hideHeader = false,
}: ToursPageClientProps) {
  
  // 1. Hitung Max Price Dinamis
  const globalMaxPrice = useMemo(() => {
    if (initialTours.length === 0) return 10000000;
    return Math.max(...initialTours.map((t) => t.startFrom)) + 500000;
  }, [initialTours]);

  // 2. State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    startLocations: StartLocation[];
    durationRanges: DurationRange[];
    maxPrice: number;
    categories: TourCategory[];
  }>({
    search: "",
    startLocations: [], 
    durationRanges: [],
    maxPrice: globalMaxPrice,
    categories: [],
  });

  // Update maxPrice jika data berubah
  useEffect(() => {
    setFilters((prev) => ({ ...prev, maxPrice: globalMaxPrice }));
  }, [globalMaxPrice]);

  // Prevent scroll saat mobile drawer open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileFilterOpen]);

  // 3. Handlers
  const handleLocationToggle = (loc: StartLocation) => {
    setFilters((prev) => {
      const exists = prev.startLocations.includes(loc);
      return {
        ...prev,
        startLocations: exists
          ? prev.startLocations.filter((l) => l !== loc)
          : [...prev.startLocations, loc],
      };
    });
  };

  const handleDurationToggle = (range: DurationRange) => {
    setFilters((prev) => {
      const exists = prev.durationRanges.includes(range);
      return {
        ...prev,
        durationRanges: exists
          ? prev.durationRanges.filter((r) => r !== range)
          : [...prev.durationRanges, range],
      };
    });
  };

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

  const clearFilters = () => {
    setFilters({
      search: "",
      startLocations: [],
      durationRanges: [],
      maxPrice: globalMaxPrice,
      categories: [],
    });
  };

  // 4. Logic Filtering
  const filteredTours = useMemo(() => {
    return initialTours.filter((tour) => {
      // Search
      if (
        filters.search &&
        !tour.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      // START LOCATION FILTER (Hanya jalan jika filternya dipilih)
      // Kita tidak perlu cek showLocationFilter disini, karena jika UI-nya hidden,
      // filters.startLocations pasti kosong, jadi logic ini otomatis terlewati (pass through).
      if (filters.startLocations.length > 0) {
        if (!filters.startLocations.includes(tour.startDestination as StartLocation)) 
          return false;
      }

      // Price
      if (tour.startFrom > filters.maxPrice) return false;

      // Duration
      if (filters.durationRanges.length > 0) {
        const day = tour.duration.day;
        const matches = filters.durationRanges.some((range) => {
          if (range === "1-2") return day >= 1 && day <= 2;
          if (range === "3-4") return day >= 3 && day <= 4;
          if (range === "5+") return day >= 5;
          return false;
        });
        if (!matches) return false;
      }

      // Categories
      if (filters.categories.length > 0) {
        const tourTags = tour.tags.map((t) => t.toLowerCase());
        const hasMatch = filters.categories.some((cat) => {
          if (cat === "Volcano")
            return tourTags.some(
              (t) =>
                t.includes("volcano") ||
                t.includes("bromo") ||
                t.includes("ijen")
            );
          if (cat === "Waterfall")
            return tourTags.some(
              (t) =>
                t.includes("waterfall") ||
                t.includes("madakaripura") ||
                t.includes("tumpak")
            );
          if (cat === "Beach")
            return tourTags.some(
              (t) => t.includes("beach") || t.includes("papuma")
            );
          if (cat === "Wildlife")
            return tourTags.some(
              (t) =>
                t.includes("wildlife") ||
                t.includes("safari") ||
                t.includes("animal")
            );
          return false;
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [initialTours, filters]);

  // 5. VARIABLE JSX
  const filterContent = (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-jvto-muted w-4 h-4" />
        <input
          type="text"
          placeholder="Search tours..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="w-full pl-9 pr-4 py-3 border border-jvto-border bg-jvto-off rounded-full text-sm focus:outline-none focus:border-jvto-navy focus:bg-white transition-all text-jvto-navy placeholder:text-jvto-muted/60"
        />
      </div>

      {/* Location filter — shown only on /tours all-tours page */}
      {showLocationFilter && (
        <FilterSection title="Start Location">
          <div className="grid grid-cols-1 gap-2">
            {["Surabaya", "Bali"].map((loc) => {
              const isSelected = filters.startLocations.includes(loc as StartLocation);
              return (
                <button
                  key={loc}
                  onClick={() => handleLocationToggle(loc as StartLocation)}
                  className={`
                    flex items-center justify-between p-3 rounded-[12px] border transition-all text-sm group
                    ${
                      isSelected
                        ? "border-jvto-navy bg-jvto-navy/5 text-jvto-navy font-semibold"
                        : "border-transparent hover:bg-jvto-off text-jvto-muted"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} strokeWidth={1.5} />
                    <span className="text-sm">From {loc}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-jvto-navy" />}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Duration */}
      <FilterSection title="Duration">
        <div className="flex flex-wrap gap-2">
          {(["1-2", "3-4", "5+"] as DurationRange[]).map((range) => {
            const isSelected = filters.durationRanges.includes(range);
            return (
              <button
                key={range}
                onClick={() => handleDurationToggle(range)}
                className={`
                  px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-jvto-lime border-jvto-lime text-jvto-navy shadow-sm scale-105"
                      : "bg-white border-jvto-border text-jvto-muted hover:border-jvto-navy"
                  }
                `}
              >
                {range} Days
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="px-1 py-2">
          <input
            type="range"
            min={0}
            max={globalMaxPrice}
            step={100000}
            aria-label="Price Range"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number(e.target.value),
              }))
            }
            className="w-full h-2 bg-jvto-border rounded-full appearance-none cursor-pointer accent-jvto-lime"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-jvto-muted">Up to</span>
            <span className="text-sm font-bold text-jvto-navy">
              {formatIDR(filters.maxPrice)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Experience Type">
        <div className="grid grid-cols-1 gap-2">
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
                onClick={() => handleCategoryToggle(type.value as TourCategory)}
                className={`
                  flex items-center justify-between p-3 rounded-[12px] border transition-all text-sm group
                  ${
                    isSelected
                      ? "border-jvto-navy bg-jvto-navy/5 text-jvto-navy font-semibold"
                      : "border-transparent hover:bg-jvto-off text-jvto-muted"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <type.icon size={16} strokeWidth={1.5} />
                  <span className="text-sm">{type.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-jvto-navy" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <button
        onClick={clearFilters}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs text-jvto-muted hover:text-jvto-orange transition-colors uppercase tracking-[0.1em] font-semibold"
      >
        <RotateCcw size={14} />
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8">
      {/* HEADER — hidden when page provides its own heading */}
      {!hideHeader && (
        <div className="mb-12">
          <h1
            className="text-3xl md:text-4xl font-black text-jvto-navy mb-4"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            {title ?? `${destinationName} Tours`}
          </h1>
          <p className="text-jvto-muted max-w-2xl leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-32 bg-white p-6 rounded-[24px] border border-jvto-border card-jvto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-jvto-border">
              <h3 className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-jvto-navy">
                Filters
              </h3>
              <span className="font-mono text-[9px] font-bold bg-jvto-lime/15 border border-jvto-lime/30 px-2.5 py-1 rounded-full text-jvto-navy">
                {filteredTours.length} tours
              </span>
            </div>
            {filterContent}
          </div>
        </aside>

        {/* --- MOBILE CONTROL BAR --- */}
        <div className="lg:hidden mb-6 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-full shadow-sm border border-jvto-border flex items-center justify-between sticky top-24 z-30">
          <div>
            <span className="block text-[9px] text-jvto-muted font-semibold uppercase tracking-[0.12em]">
              Showing
            </span>
            <span className="font-bold text-jvto-navy text-sm">
              {filteredTours.length} tours
            </span>
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-jvto-orange text-white rounded-full text-[10px] font-bold uppercase tracking-[0.12em] active:scale-95 transition-transform"
          >
            <Filter size={14} /> Filters
          </button>
        </div>

        {/* --- MOBILE DRAWER (OVERLAY) --- */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
            isMobileFilterOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className={`absolute right-0 top-0 h-full w-[85%] max-w-[360px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
              isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-5 border-b border-jvto-border flex items-center justify-between">
              <h3
                className="text-[9px] font-black text-jvto-navy uppercase tracking-[0.2em]"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                Filter Tours
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-jvto-off rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X size={18} className="text-jvto-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {filterContent}
            </div>
            <div className="p-5 border-t border-jvto-border">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-jvto-orange text-white py-3.5 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-jvto-orange-hover transition-colors"
                style={{ boxShadow: "var(--shadow-jvto-orange)" }}
              >
                Show {filteredTours.length} Results
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN GRID CONTENT --- */}
        <div className="flex-1 min-h-[600px]">
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="h-full">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white rounded-[24px] border border-jvto-border">
              <div className="w-14 h-14 bg-jvto-off rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-jvto-muted" />
              </div>
              <h3
                className="text-lg font-black text-jvto-navy mb-2"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                No tours found
              </h3>
              <p className="text-jvto-muted text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                Try adjusting your filters to find matching tours.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-jvto-orange text-white rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-jvto-orange-hover transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
