"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ListTourPackage } from "@/types";
import TourCard from "@/components/website/TourCard";
import { formatIDR } from "@/utils/formatting";
import { 
  Filter, X, Search, ChevronDown, ChevronUp, 
  Mountain, Waves, Umbrella, PawPrint, Check 
} from "lucide-react";

// --- TYPES ---
interface ToursPageClientProps {
  initialTours: ListTourPackage[];
  destinationName: string; 
  description: string;
}

type TourCategory = "Volcano" | "Waterfall" | "Beach" | "Wildlife";
type DurationRange = "1-2" | "3-4" | "5+";

// --- COMPONENT: ACCORDION SECTION (Tetap di luar) ---
const FilterSection = ({ 
  title, 
  isOpen = true, 
  children 
}: { title: string, isOpen?: boolean, children: React.ReactNode }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <button 
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-bold text-gray-800 hover:text-jvto-green mb-3 transition-colors"
      >
        <span className="text-sm uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div className={`space-y-3 overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ToursPageClient({ 
  initialTours, 
  destinationName,
  description
}: ToursPageClientProps) {
  
  // 1. Hitung Max Price Dinamis
  const globalMaxPrice = useMemo(() => {
    if (initialTours.length === 0) return 10000000;
    return Math.max(...initialTours.map(t => t.startFrom)) + 500000;
  }, [initialTours]);

  // 2. State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    durationRanges: DurationRange[];
    maxPrice: number;
    categories: TourCategory[];
  }>({
    search: "",
    durationRanges: [],
    maxPrice: globalMaxPrice,
    categories: [],
  });

  // Update maxPrice jika data berubah
  useEffect(() => {
    setFilters(prev => ({ ...prev, maxPrice: globalMaxPrice }));
  }, [globalMaxPrice]);

  // Prevent scroll saat mobile drawer open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFilterOpen]);

  // 3. Handlers
  const handleDurationToggle = (range: DurationRange) => {
    setFilters(prev => {
      const exists = prev.durationRanges.includes(range);
      return {
        ...prev,
        durationRanges: exists 
          ? prev.durationRanges.filter(r => r !== range)
          : [...prev.durationRanges, range]
      };
    });
  };

  const handleCategoryToggle = (cat: TourCategory) => {
    setFilters(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists 
          ? prev.categories.filter(c => c !== cat)
          : [...prev.categories, cat]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      durationRanges: [],
      maxPrice: globalMaxPrice,
      categories: [],
    });
  };

  // 4. Logic Filtering
  const filteredTours = useMemo(() => {
    return initialTours.filter(tour => {
      // Search
      if (filters.search && !tour.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      
      // Price
      if (tour.startFrom > filters.maxPrice) return false;

      // Duration
      if (filters.durationRanges.length > 0) {
        const day = tour.duration.day;
        const matches = filters.durationRanges.some(range => {
          if (range === "1-2") return day >= 1 && day <= 2;
          if (range === "3-4") return day >= 3 && day <= 4;
          if (range === "5+") return day >= 5;
          return false;
        });
        if (!matches) return false;
      }

      // Categories
      if (filters.categories.length > 0) {
        const tourTags = tour.tags.map(t => t.toLowerCase());
        const hasMatch = filters.categories.some(cat => {
          if (cat === "Volcano") return tourTags.some(t => t.includes("volcano") || t.includes("bromo") || t.includes("ijen"));
          if (cat === "Waterfall") return tourTags.some(t => t.includes("waterfall") || t.includes("madakaripura") || t.includes("tumpak"));
          if (cat === "Beach") return tourTags.some(t => t.includes("beach") || t.includes("papuma"));
          if (cat === "Wildlife") return tourTags.some(t => t.includes("wildlife") || t.includes("safari") || t.includes("animal"));
          return false;
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [initialTours, filters]);

  // 5. PERBAIKAN: Gunakan Variable JSX, BUKAN Component Function
  // Ini mencegah input kehilangan fokus saat mengetik (re-render)
  const filterContent = (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search tours..." 
          value={filters.search}
          onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
          className="w-full pl-9 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:outline-none focus:border-jvto-dark focus:bg-white transition-all"
        />
      </div>

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
                  ${isSelected 
                    ? "bg-yellow-400 border-yellow-400 text-black shadow-sm transform scale-105" 
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                  }
                `}
              >
                {range} Days
              </button>
            )
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
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jvto-dark"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-400">Up to</span>
            <span className="text-sm font-bold text-jvto-dark">{formatIDR(filters.maxPrice)}</span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Tour Type">
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "Volcano", icon: Mountain, value: "Volcano" },
            { label: "Waterfall", icon: Waves, value: "Waterfall" },
            { label: "Beach", icon: Umbrella, value: "Beach" },
            { label: "Wildlife", icon: PawPrint, value: "Wildlife" },
          ].map((type) => {
            const isSelected = filters.categories.includes(type.value as TourCategory);
            return (
              <button 
                key={type.value}
                onClick={() => handleCategoryToggle(type.value as TourCategory)}
                className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all text-sm group
                  ${isSelected ? "border-jvto-dark bg-gray-50 text-jvto-dark font-semibold" : "border-transparent hover:bg-gray-50 text-gray-600"}
                `}
              >
                <div className="flex items-center gap-3">
                  <type.icon size={18} strokeWidth={1.5} />
                  <span>{type.label}</span>
                </div>
                {isSelected && <Check size={16} className="text-jvto-dark" />}
              </button>
            )
          })}
        </div>
      </FilterSection>
      
      <button 
        onClick={clearFilters}
        className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">restart_alt</span>
        Reset all filters
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-6">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 text-jvto-dark">
          Tours From {destinationName}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-32 bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black uppercase tracking-wide">Filters</h3>
              <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
                {filteredTours.length}
              </span>
            </div>
            
            {/* RENDER VARIABLE JSX (bukan <FilterContent />) */}
            {filterContent}

          </div>
        </aside>

        {/* --- MOBILE CONTROL BAR --- */}
        <div className="lg:hidden mb-6  bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <span className="block text-xs text-gray-500 font-medium">Showing</span>
            <span className="font-bold text-jvto-dark">{filteredTours.length} Adventures</span>
          </div>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-jvto-dark text-white rounded-lg text-sm font-bold shadow-lg active:scale-95 transition-transform"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* --- MOBILE DRAWER (OVERLAY) --- */}
        <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            <div className={`absolute right-0 top-0 h-full w-[85%] max-w-[360px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-jvto-dark">Filter Tours</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close Button">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                
                {/* RENDER VARIABLE JSX DISINI JUGA */}
                {filterContent}

              </div>
              <div className="p-5 border-t border-gray-100 bg-white">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-jvto-dark text-white py-3.5 rounded-lg font-bold shadow-lg hover:bg-gray-800 transition-colors"
                >
                  Show {filteredTours.length} Results
                </button>
              </div>
            </div>
        </div>

        {/* --- MAIN GRID CONTENT --- */}
        <div className="flex-1 min-h-[600px]">
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="h-full">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No adventures found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-6">
                We couldn't find any tours matching your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-jvto-dark text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}