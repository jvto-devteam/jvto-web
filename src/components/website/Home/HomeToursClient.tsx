"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";

interface HomeToursClientProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

type Tab = "surabaya" | "bali";

const TABS: Tab[] = ["surabaya", "bali"];
const cityLabelOf = (tab: Tab) => (tab === "surabaya" ? "Surabaya" : "Bali");

// PKG-11a card: crisp 2px geometry kept (the dossier read), depth added through
// the shared elevation tokens — shadow-jvto-soft at rest, shadow-jvto-card-hover
// on lift — replacing the ad-hoc arbitrary shadow this file used to inline.
function TourCard({
  pkg,
  index,
  cityLabel,
}: {
  pkg: PackageListItem;
  index: number;
  cityLabel: string;
}) {
  const price = `IDR ${new Intl.NumberFormat("id-ID").format(pkg.startFrom)}`;
  const duration = `${pkg.duration.day}D${pkg.duration.night > 0 ? ` ${pkg.duration.night}N` : ""}`;
  const highlights = pkg.keyExperiences.slice(0, 2);
  const hasIjen =
    pkg.tags.some((t) => t.toLowerCase().includes("ijen")) ||
    (pkg.name ?? "").toLowerCase().includes("ijen");

  return (
    <Link
      href={`/${pkg.slug}`}
      className="jvto-focus group relative flex flex-col overflow-hidden rounded-sm border border-jvto-border bg-white shadow-jvto-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-jvto-navy/25 hover:shadow-jvto-card-hover"
    >
      <div className="relative h-52 w-full flex-shrink-0 overflow-hidden sm:h-60">
        <Image
          src={pkg.banner.url}
          alt={pkg.banner.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-jvto-navy/75 via-jvto-navy/10 to-jvto-navy/25"
          aria-hidden="true"
        />
        <div className="absolute top-3 right-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-sm bg-white px-2 py-1 text-[9px] font-bold tracking-wider text-jvto-navy uppercase">
            From {cityLabel}
          </span>
          <span className="rounded-sm bg-jvto-navy px-2 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            &#10003; Police-Led
          </span>
          {hasIjen && (
            <span className="rounded-sm bg-jvto-lime px-2 py-1 text-[9px] font-bold tracking-wider text-jvto-navy uppercase">
              &#9877; Health Check
            </span>
          )}
        </div>
        <span className="absolute right-3 bottom-3 font-mono text-[9px] font-bold tracking-wider text-white uppercase">
          JVTO-{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-jvto-heading text-base leading-snug font-black text-jvto-navy sm:text-lg">
          {pkg.name}
        </p>
        {highlights.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-xs text-jvto-ink-soft">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-jvto-lime-ink"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-end justify-between border-t border-jvto-border pt-3">
          <div>
            <p className="mb-0.5 font-mono text-[9px] font-bold tracking-wider text-jvto-ink-soft uppercase">
              {duration} &middot; From
            </p>
            <p className="font-jvto-heading text-lg font-black text-jvto-navy">
              {price}
              <small className="ml-1 text-xs font-normal text-jvto-ink-soft">/pax</small>
            </p>
          </div>
          <span className="text-xs font-bold text-jvto-navy transition-transform group-hover:translate-x-0.5">
            Book inquiry &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeToursClient({
  surabayaPackages,
  baliPackages,
}: HomeToursClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("surabaya");
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});

  const packages = activeTab === "surabaya" ? surabayaPackages : baliPackages;
  const viewAllHref =
    activeTab === "surabaya" ? "/tours/from-surabaya" : "/tours/from-bali";

  // Roving tabindex needs arrow keys, or the unselected tab becomes
  // keyboard-unreachable. ArrowLeft/Right + Home/End per the ARIA tabs pattern.
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const from = TABS.indexOf(activeTab);
    let to: number | null = null;
    if (event.key === "ArrowRight") to = (from + 1) % TABS.length;
    else if (event.key === "ArrowLeft") to = (from - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = TABS.length - 1;
    if (to === null) return;
    event.preventDefault();
    const next = TABS[to];
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {/* PKG-11a a11y: the role="tablist" this already declared had no
          aria-controls and no tabpanel, so the relationship was announced but
          unresolvable. Wired properly here — same interaction, same data. */}
      <div className="mb-8 flex gap-2" role="tablist" aria-label="Departure city">
        {TABS.map((tab) => {
          const selected = activeTab === tab;
          return (
            <button
              key={tab}
              id={`tours-tab-${tab}`}
              ref={(el) => {
                tabRefs.current[tab] = el;
              }}
              type="button"
              onClick={() => setActiveTab(tab)}
              onKeyDown={onTabKeyDown}
              role="tab"
              aria-selected={selected}
              aria-controls="tours-tabpanel"
              tabIndex={selected ? 0 : -1}
              className={`jvto-focus rounded-sm px-5 py-2.5 text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                selected
                  ? "bg-jvto-navy text-white shadow-jvto-soft"
                  : "border border-jvto-border bg-white text-jvto-ink-soft hover:border-jvto-navy/30 hover:text-jvto-navy"
              }`}
            >
              From {cityLabelOf(tab)}
            </button>
          );
        })}
      </div>

      <div
        id="tours-tabpanel"
        role="tabpanel"
        aria-labelledby={`tours-tab-${activeTab}`}
      >
        {packages.length === 0 ? (
          <p className="py-12 text-center text-sm text-jvto-ink-soft">
            No packages available for this departure city.
          </p>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, i) => (
                <TourCard
                  key={pkg.id}
                  pkg={pkg}
                  index={i}
                  cityLabel={cityLabelOf(activeTab)}
                />
              ))}
            </div>

            <div className="text-center">
              <Link
                href={viewAllHref}
                className="jvto-focus inline-flex items-center gap-2 rounded-sm bg-jvto-navy px-6 py-3 text-sm font-bold tracking-wider text-white uppercase shadow-jvto-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-jvto-navy-raise hover:shadow-jvto-card-hover"
              >
                View all packages &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
