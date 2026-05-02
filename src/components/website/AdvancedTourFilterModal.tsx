// components/AdvancedTourFilterModal.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Check, X } from "lucide-react";
import { ListTourPackage } from "@/types";

export interface AdvancedFilters {
  maxDuration: number;
  startCities: string[];
  endCities: string[];
  experiences: string[];
  physicality?: string;
}

interface AdvancedTourFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
  initialFilters: AdvancedFilters;
  tours: ListTourPackage[];
}

const CustomCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer text-ink-primary dark:text-white text-sm">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all ${
            checked
              ? "bg-primary border-primary"
              : "bg-transparent border-ink-neutral-500"
          }`}
        />
        {checked && (
          <Check
            className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white"
            strokeWidth={3}
            aria-hidden="true"
          />
        )}
      </div>
      <span>{label}</span>
    </label>
  );
};

const AdvancedTourFilterModal: React.FC<AdvancedTourFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  tours,
}) => {
  const [maxDuration, setMaxDuration] = useState(initialFilters.maxDuration);
  const [startCities, setStartCities] = useState<string[]>(
    initialFilters.startCities
  );
  const [endCities, setEndCities] = useState<string[]>(
    initialFilters.endCities
  );
  const [experiences, setExperiences] = useState<string[]>(
    initialFilters.experiences
  );

  const filterOptions = useMemo(() => {
    if (!tours?.length) return { cities: [], keyExperiences: [] };

    const capitalize = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    const validCities = tours
      .flatMap((t) => [t.startDestination, t.endDestination])
      .filter((city): city is string => !!city);

    const uniqueCities = [...new Set(validCities)]
      .map(capitalize)
      .sort();

    const keyExperiences = [
      ...new Set(
        tours.flatMap((t) => t.keyExperiences.filter(Boolean))
      ),
    ].sort();

    return { cities: uniqueCities, keyExperiences };
  }, [tours]);

  useEffect(() => {
    if (isOpen) {
      setMaxDuration(initialFilters.maxDuration);
      setStartCities(initialFilters.startCities);
      setEndCities(initialFilters.endCities);
      setExperiences(initialFilters.experiences);
    }
  }, [isOpen, initialFilters]);

  const matchingTourCount = useMemo(() => {
    if (!tours?.length) return 0;

    return tours.filter((tour) => {
      if (tour.duration.day > maxDuration) return false;

      if (
        startCities.length > 0 &&
        (!tour.startDestination ||
          !startCities.some(
            (c) => tour.startDestination!.toLowerCase() === c.toLowerCase()
          ))
      )
        return false;

      if (
        endCities.length > 0 &&
        (!tour.endDestination ||
          !endCities.some(
            (c) => tour.endDestination!.toLowerCase() === c.toLowerCase()
          ))
      )
        return false;

      if (
        experiences.length > 0 &&
        !experiences.some((exp) => tour.keyExperiences.includes(exp))
      )
        return false;

      return true;
    }).length;
  }, [tours, maxDuration, startCities, endCities, experiences]);

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    isChecked: boolean
  ) => {
    setter((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i !== item)
    );
  };

  const handleApply = () => {
    onApplyFilters({ maxDuration, startCities, endCities, experiences });
  };

  const handleReset = () => {
    setMaxDuration(7);
    setStartCities([]);
    setEndCities([]);
    setExperiences([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-background-dark rounded-sm shadow-xl w-11/12 max-w-3xl m-4 relative animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-ink-neutral-200 dark:border-ink-neutral-700">
          <h3 className="text-xl font-bold text-ink-primary dark:text-white">
            Find Your Perfect Tour
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-ink-neutral-500 hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
          {/* Duration */}
          <div className="mb-6">
            <label
              htmlFor="duration-slider"
              className="block text-lg font-semibold mb-2 text-ink-primary dark:text-white"
            >
              Maximum Duration:{" "}
              <span className="text-primary font-bold">
                {maxDuration} days
              </span>
            </label>
            <input
              id="duration-slider"
              type="range"
              min="1"
              max="7"
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              className="w-full h-2 bg-ink-neutral-200 dark:bg-ink-neutral-700 rounded-sm appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-sm text-ink-neutral-500 dark:text-ink-neutral-400 mt-1">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>

          {/* Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-ink-primary dark:text-white">
                Starting City
              </h4>
              <div className="space-y-3">
                {filterOptions.cities.map((city) => (
                  <CustomCheckbox
                    key={`start-${city}`}
                    label={city}
                    checked={startCities.includes(city)}
                    onChange={(checked) =>
                      handleCheckboxChange(setStartCities, city, checked)
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-ink-primary dark:text-white">
                Ending City
              </h4>
              <div className="space-y-3">
                {filterOptions.cities.map((city) => (
                  <CustomCheckbox
                    key={`end-${city}`}
                    label={city}
                    checked={endCities.includes(city)}
                    onChange={(checked) =>
                      handleCheckboxChange(setEndCities, city, checked)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-ink-primary dark:text-white">
              Key Experiences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {filterOptions.keyExperiences.map((exp) => (
                <CustomCheckbox
                  key={exp}
                  label={exp}
                  checked={experiences.includes(exp)}
                  onChange={(checked) =>
                    handleCheckboxChange(setExperiences, exp, checked)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-6 border-t border-ink-neutral-200 dark:border-ink-neutral-700">
          <button
            onClick={handleReset}
            className="font-semibold text-ink-neutral-500 dark:text-ink-neutral-400 hover:text-primary dark:hover:text-white transition-colors py-2 px-4 rounded-sm"
          >
            Reset Filters
          </button>
          <button
            onClick={handleApply}
            className="w-full sm:w-auto mt-2 sm:mt-0 px-8 py-4 rounded-sm bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
          >
            Show {matchingTourCount} Matching Tour
            {matchingTourCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTourFilterModal;
