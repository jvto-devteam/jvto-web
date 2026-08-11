"use client";

// src/components/website/ToursPageClient.tsx
//
// The filterable package catalogue shared by the three tours-discovery routes
// (/tours, /tours/from-bali, /tours/from-surabaya) — and by nothing else.
//
// PKG-11b is a VISUAL + ACCESSIBILITY pass. Everything about the DATA is
// untouched: `initialTours` still arrives from getPublicPackageList, the
// filter predicate (search / start location / price / duration / category) is
// byte-for-byte the previous logic, result ordering is still the incoming
// order (no sort control was added — sorting semantics must not change), and
// TourCard renders every card exactly as before. This file owns the chrome
// around the card, never the card.
//
// What changed:
//   • The outer max-w container moved OUT to the page's <Section>, so the
//     catalogue sits on the same 11a container/gutter rhythm as every other
//     section instead of nesting a second one.
//   • The dead `!hideHeader` block was removed. All three routes passed
//     `hideHeader`, so it never rendered — but it carried a second <h1>, one
//     prop-flip away from breaking the one-h1-per-route rule. Its `title`,
//     `description`, `destinationName` and `hideHeader` props went with it.
//   • Filter a11y: the accordions expose aria-expanded/aria-controls, every
//     toggle exposes aria-pressed, the price slider exposes aria-valuetext,
//     the sidebar is a named landmark, and the mobile drawer is a real modal
//     dialog (role/aria-modal/labelled by its own heading, Escape to close,
//     focus moved in on open and returned to the trigger on close).
//   • Mobile comparison flow: an active-filter chip rail under the sticky bar,
//     so what is filtering the list stays visible after the drawer closes.
//     Each chip is a toggle button whose label is the SAME string its filter
//     control already uses; pressing it calls the same handler.
//   • Contrast: white-on-orange buttons measured 3.34:1 and are now navy fills
//     (16.5:1); muted/60 placeholders and labels moved to --color-jvto-ink-soft.
import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
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
  MapPin,
} from "lucide-react";

// --- TYPES ---
interface ToursPageClientProps {
  initialTours: ListTourPackage[];
  showLocationFilter?: boolean;
}

type TourCategory = "Volcano" | "Waterfall" | "Beach" | "Wildlife";
type DurationRange = "1-2" | "3-4" | "5+";
type StartLocation = "Surabaya" | "Bali";

const SEARCH_LABEL = "Search tours...";

// The drawer is portalled to <body>. It has to be: <Section> paints on
// `relative isolate`, which is a stacking context, so a z-50 drawer rendered
// inside the catalogue section can never rise above the z-50 fixed navbar and
// its top edge (close button included) ends up underneath it on a phone.
// useSyncExternalStore rather than a mount-flag effect, so the server render
// and the first client render agree without a setState inside an effect.
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

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
  const panelId = useId();

  return (
    <div className="border-b border-jvto-border py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="jvto-focus mb-3 flex w-full items-center justify-between rounded-sm font-mono text-[10px] font-bold tracking-[0.18em] text-jvto-navy uppercase transition-colors hover:text-jvto-orange-hover"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp aria-hidden="true" size={14} />
        ) : (
          <ChevronDown aria-hidden="true" size={14} />
        )}
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="space-y-3"
      >
        {children}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ToursPageClient({
  initialTours,
  showLocationFilter = false,
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

  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const drawerTitleId = useId();
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

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

  // Modal behaviour for the mobile drawer: Escape closes it, focus moves into
  // it on open and returns to the trigger on close, and Tab stays inside it
  // (without a trap, tabbing walks straight onto the covered page behind).
  useEffect(() => {
    if (!isMobileFilterOpen) return;
    drawerCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileFilterOpen(false);
        drawerTriggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = drawerRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      // Collapsed accordion panels are `hidden`, so their controls are still in
      // the NodeList but are not focusable — drop anything with no box.
      const items = Array.from(focusable).filter(
        (el) => !el.hasAttribute("disabled") && el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileFilterOpen]);

  const closeDrawer = () => {
    setIsMobileFilterOpen(false);
    drawerTriggerRef.current?.focus();
  };

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

  // 4b. Active-filter rail. Every label here is the exact string its own filter
  // control renders; each chip is a pressed toggle that calls the same handler,
  // so the chip rail can never diverge from the filter state or its semantics.
  const activeChips: { key: string; label: string; toggle: () => void }[] = [
    ...filters.startLocations.map((loc) => ({
      key: `location-${loc}`,
      label: `From ${loc}`,
      toggle: () => handleLocationToggle(loc),
    })),
    ...filters.durationRanges.map((range) => ({
      key: `duration-${range}`,
      label: `${range} Days`,
      toggle: () => handleDurationToggle(range),
    })),
    ...filters.categories.map((cat) => ({
      key: `category-${cat}`,
      label: cat,
      toggle: () => handleCategoryToggle(cat),
    })),
    ...(filters.maxPrice < globalMaxPrice
      ? [
          {
            key: "price",
            label: `Up to ${formatIDR(filters.maxPrice)}`,
            toggle: () =>
              setFilters((prev) => ({ ...prev, maxPrice: globalMaxPrice })),
          },
        ]
      : []),
    ...(filters.search
      ? [
          {
            key: "search",
            label: filters.search,
            toggle: () => setFilters((prev) => ({ ...prev, search: "" })),
          },
        ]
      : []),
  ];

  const optionClass = (isSelected: boolean) =>
    `jvto-focus flex w-full items-center justify-between gap-3 rounded-sm border px-3 py-2.5 text-left text-sm transition-colors ${
      isSelected
        ? "border-jvto-navy bg-jvto-navy/[0.06] font-semibold text-jvto-navy"
        : "border-transparent text-jvto-ink-soft hover:border-jvto-border hover:bg-jvto-off hover:text-jvto-navy"
    }`;

  // 5. VARIABLE JSX
  const filterContent = (
    <div className="space-y-1">
      {/* Search Input */}
      <div className="relative mb-5">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-jvto-ink-soft"
        />
        <input
          type="text"
          aria-label={SEARCH_LABEL}
          placeholder={SEARCH_LABEL}
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="jvto-focus w-full rounded-sm border border-jvto-border bg-jvto-off py-2.5 pr-4 pl-9 text-sm text-jvto-navy transition-colors placeholder:text-jvto-ink-soft focus:border-jvto-navy focus:bg-white"
        />
      </div>

      {/* Location filter — shown only on /tours all-tours page */}
      {showLocationFilter && (
        <FilterSection title="Start Location">
          <div className="grid grid-cols-1 gap-1.5">
            {["Surabaya", "Bali"].map((loc) => {
              const isSelected = filters.startLocations.includes(loc as StartLocation);
              return (
                <button
                  key={loc}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleLocationToggle(loc as StartLocation)}
                  className={optionClass(isSelected)}
                >
                  <span className="flex items-center gap-3">
                    <MapPin aria-hidden="true" size={16} strokeWidth={1.5} />
                    <span>From {loc}</span>
                  </span>
                  {isSelected && (
                    <Check aria-hidden="true" size={14} className="text-jvto-navy" />
                  )}
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
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleDurationToggle(range)}
                className={`jvto-focus rounded-sm border px-3.5 py-2 text-xs font-bold transition-colors ${
                  isSelected
                    ? "border-jvto-lime bg-jvto-lime text-jvto-navy"
                    : "border-jvto-border bg-white text-jvto-ink-soft hover:border-jvto-navy hover:text-jvto-navy"
                }`}
              >
                {range} Days
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="px-1 py-1">
          <input
            type="range"
            min={0}
            max={globalMaxPrice}
            step={100000}
            aria-label="Price Range"
            aria-valuetext={formatIDR(filters.maxPrice)}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number(e.target.value),
              }))
            }
            className="jvto-focus h-2 w-full cursor-pointer appearance-none rounded-full bg-jvto-border accent-jvto-lime"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-jvto-ink-soft">Up to</span>
            <span className="text-sm font-bold text-jvto-navy">
              {formatIDR(filters.maxPrice)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Experience Type">
        <div className="grid grid-cols-1 gap-1.5">
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
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCategoryToggle(type.value as TourCategory)}
                className={optionClass(isSelected)}
              >
                <span className="flex items-center gap-3">
                  <type.icon aria-hidden="true" size={16} strokeWidth={1.5} />
                  <span>{type.label}</span>
                </span>
                {isSelected && (
                  <Check aria-hidden="true" size={14} className="text-jvto-navy" />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={clearFilters}
        className="jvto-focus mt-4 flex w-full items-center justify-center gap-2 rounded-sm py-2 text-[11px] font-bold tracking-[0.12em] text-jvto-ink-soft uppercase transition-colors hover:text-jvto-navy"
      >
        <RotateCcw aria-hidden="true" size={14} />
        Reset filters
      </button>
    </div>
  );

  // --- MOBILE DRAWER (MODAL) --- portalled to <body>, see subscribeNoop above.
  const drawer = (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
        isMobileFilterOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-jvto-navy/70 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={drawerTitleId}
        className={`absolute top-0 right-0 flex h-full w-[88%] max-w-[360px] transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-jvto-border p-5">
          <h2
            id={drawerTitleId}
            className="font-mono text-[10px] font-black tracking-[0.2em] text-jvto-navy uppercase"
          >
            Filter Tours
          </h2>
          <button
            ref={drawerCloseRef}
            type="button"
            onClick={closeDrawer}
            className="jvto-focus rounded-sm p-2 transition-colors hover:bg-jvto-off"
            aria-label="Close filters"
          >
            <X aria-hidden="true" size={18} className="text-jvto-ink-soft" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{filterContent}</div>
        <div className="border-t border-jvto-border p-5">
          <button
            type="button"
            onClick={closeDrawer}
            className="jvto-focus w-full rounded-sm bg-jvto-navy py-3.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-jvto-navy-raise"
          >
            Show {filteredTours.length} Results
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside
          aria-labelledby="tours-filters-heading"
          className="hidden w-[272px] flex-shrink-0 lg:block"
        >
          <div className="sticky top-32 rounded-sm border border-jvto-border bg-white p-5 shadow-jvto-soft">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-jvto-border pb-4">
              <h3
                id="tours-filters-heading"
                className="font-mono text-[10px] font-black tracking-[0.2em] text-jvto-navy uppercase"
              >
                Filters
              </h3>
              <span
                aria-live="polite"
                className="rounded-sm border border-jvto-lime/40 bg-jvto-lime/15 px-2.5 py-1 font-mono text-[10px] font-bold text-jvto-navy"
              >
                {filteredTours.length} tours
              </span>
            </div>
            {filterContent}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* --- MOBILE CONTROL BAR --- */}
          <div className="sticky top-24 z-30 mb-4 flex items-center justify-between gap-4 rounded-sm border border-jvto-border bg-white/95 px-4 py-3 shadow-jvto-soft backdrop-blur-md lg:hidden">
            <p>
              <span className="block font-mono text-[9px] font-bold tracking-[0.16em] text-jvto-ink-soft uppercase">
                Showing
              </span>
              <span
                aria-live="polite"
                className="text-sm font-bold text-jvto-navy"
              >
                {filteredTours.length} tours
              </span>
            </p>
            <button
              ref={drawerTriggerRef}
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isMobileFilterOpen}
              className="jvto-focus flex items-center gap-2 rounded-sm bg-jvto-navy px-4 py-2.5 text-[11px] font-bold tracking-[0.12em] text-white uppercase transition-transform active:scale-95"
            >
              <Filter aria-hidden="true" size={14} /> Filters
            </button>
          </div>

          {/* --- ACTIVE FILTER RAIL (mobile: the drawer hides the controls) --- */}
          {activeChips.length > 0 && (
            <ul className="mb-6 flex flex-wrap gap-2 lg:hidden">
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    aria-pressed={true}
                    onClick={chip.toggle}
                    className="jvto-focus inline-flex max-w-full items-center gap-2 rounded-sm border border-jvto-navy bg-jvto-navy/[0.06] px-3 py-1.5 text-xs font-semibold text-jvto-navy"
                  >
                    <span className="truncate">{chip.label}</span>
                    <X aria-hidden="true" size={12} className="flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* --- MAIN GRID CONTENT --- */}
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="h-full">
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border border-jvto-border bg-white px-6 py-20 text-center">
              <span
                aria-hidden="true"
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jvto-off"
              >
                <Search className="h-6 w-6 text-jvto-ink-soft" />
              </span>
              <h3 className="font-jvto-heading mb-2 text-lg font-black text-jvto-navy">
                No tours found
              </h3>
              <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-jvto-ink-soft">
                Try adjusting your filters to find matching tours.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="jvto-focus rounded-sm bg-jvto-navy px-6 py-3 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-jvto-navy-raise"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isHydrated ? createPortal(drawer, document.body) : null}
    </div>
  );
}
