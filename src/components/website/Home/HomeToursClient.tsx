// src/components/website/Home/HomeToursClient.tsx
"use client";

import { useState } from "react";
import Link from "@/components/website/AppLink";
import TourCard from "@/components/website/TourCard";
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";
import type { ListTourPackage } from "@/types";

interface HomeToursClientProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

type Tab = "surabaya" | "bali";

function toListTour(pkg: PackageListItem): ListTourPackage {
  return {
    id: pkg.id,
    name: pkg.name ?? "",
    slug: pkg.slug,
    startDestination: pkg.startDestination,
    endDestination: pkg.endDestination,
    duration: pkg.duration,
    banner: pkg.banner,
    images: pkg.images,
    keyExperiences: pkg.keyExperiences,
    startFrom: pkg.startFrom,
    physicality: pkg.physicality,
    tags: pkg.tags,
    highlights: pkg.highlights,
  };
}

export default function HomeToursClient({
  surabayaPackages,
  baliPackages,
}: HomeToursClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("surabaya");

  const packages = activeTab === "surabaya" ? surabayaPackages : baliPackages;
  const viewAllHref =
    activeTab === "surabaya" ? "/tours/from-surabaya" : "/tours/from-bali";

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-2 mb-8">
        {(["surabaya", "bali"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab
                ? "bg-jvto-navy text-white"
                : "bg-white text-jvto-navy/60 hover:text-jvto-navy"
            }`}
          >
            {tab === "surabaya" ? "From Surabaya" : "From Bali"}
          </button>
        ))}
      </div>

      {/* Mobile: full-bleed scroll */}
      <div className="md:hidden -mx-6 overflow-hidden mb-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pl-6 scroll-pl-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {packages.map((pkg) => (
            <div key={pkg.id} className="flex-shrink-0 w-72 snap-start">
              <TourCard tour={toListTour(pkg)} headingLevel={3} />
            </div>
          ))}
          <div className="flex-shrink-0 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {packages.map((pkg) => (
          <TourCard key={pkg.id} tour={toListTour(pkg)} headingLevel={3} />
        ))}
      </div>

      {/* View all */}
      <div className="text-center">
        <Link
          href={viewAllHref}
          className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
        >
          View all packages <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
