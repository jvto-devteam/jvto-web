'use client'
import React, { useState, useMemo, FormEvent } from "react";
import ToursSection from "./ToursSection";
import AdvancedTourFilterModal, {
  AdvancedFilters,
} from "./AdvancedTourFilterModal";
import Breadcrumbs from "./Breadcrumbs";
import { parseNL } from "@/utils/nl-parser";
import { tourPackages } from "@/data";
import { TourPackage } from "@/types";

const ToursPage: React.FC = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    maxDuration: 7,
    startCities: [],
    endCities: [],
    experiences: [],
    physicality: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExplanation, setSearchExplanation] = useState("");

  const handleApplyFilters = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
    setSearchQuery("");
    setSearchExplanation("");
    setIsFilterModalOpen(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseNL(searchQuery);

    const explanationParts: string[] = [];
    if (parsed.origin) explanationParts.push(`Origin=${parsed.origin}`);
    if (parsed.durationDays)
      explanationParts.push(`Duration=${parsed.durationDays}d`);
    if (parsed.destinations && parsed.destinations.length > 0)
      explanationParts.push(`Destinations=${parsed.destinations.join(", ")}`);
    if (parsed.private) explanationParts.push("Private=true");
    setSearchExplanation(
      explanationParts.length > 0
        ? `Matched because: ${explanationParts.join(". ")}.`
        : "Showing all tours. Try a more specific search."
    );

    const keyExperienceMap: { [key: string]: string } = {
      bromo: "Bromo Sunrise Tour",
      ijen: "Ijen Crater Hike",
      "tumpak sewu": "Tumpak Sewu Waterfall Tour",
      madakaripura: "Madakaripura Waterfall Tour",
      papuma: "Papuma Beach Sunset",
    };

    const newFilters: AdvancedFilters = {
      maxDuration: parsed.durationDays || 7,
      startCities: parsed.origin ? [parsed.origin] : [],
      endCities: parsed.end ? [parsed.end] : [],
      experiences: parsed.destinations
        ? parsed.destinations.map((d) => keyExperienceMap[d]).filter(Boolean)
        : [],
      physicality: parsed.physicality,
    };
    setFilters(newFilters);
  };

  const filteredTours = useMemo(() => {
    return tourPackages.filter((tour: TourPackage) => {
      if (tour.durationDays > filters.maxDuration) return false;
      if (
        filters.startCities.length > 0 &&
        !filters.startCities.some(
          (city) => tour.originCity.toLowerCase() === city.toLowerCase()
        )
      )
        return false;
      if (
        filters.endCities.length > 0 &&
        !filters.endCities.some(
          (city) => tour.endCity.toLowerCase() === city.toLowerCase()
        )
      )
        return false;
      if (
        filters.experiences.length > 0 &&
        !filters.experiences.every((exp) => tour.keyExperiences.includes(exp))
      )
        return false;
      if (
        filters.physicality &&
        tour.physicality.toLowerCase() !== filters.physicality
      )
        return false;
      return true;
    });
  }, [filters]);

  const breadcrumbCrumbs = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
  ];

  const toursSectionCopy = {
    overline: "Our Tours",
    title: "Find Your Perfect Private Tour",
    subhead:
      "Browse our curated, all-inclusive tours, or use the AI search to find exactly what you're looking for.",
  };

  return (
    <main className="pt-20 bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs crumbs={breadcrumbCrumbs} />
        <div className="bg-white dark:bg-ink-primary p-6 rounded-2xl shadow-card my-8">
          <form onSubmit={handleSearch}>
            <label
              htmlFor="ai-search"
              className="block text-lg font-semibold mb-2 text-ink-primary dark:text-white"
            >
              Find Your Tour with AI Search
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="ai-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask: ‘3-day private Bromo–Ijen from Surabaya for 4 people’"
                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-ink-neutral-200 dark:border-ink-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
            {searchExplanation && (
              <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-400 mt-2 italic">
                {searchExplanation}
              </p>
            )}
          </form>
        </div>
      </div>

      <ToursSection
        copy={toursSectionCopy}
        tours={filteredTours}
        onFindTourClick={() => setIsFilterModalOpen(true)}
      />
      <AdvancedTourFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </main>
  );
};

export default ToursPage;
