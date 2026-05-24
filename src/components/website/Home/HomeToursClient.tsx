// src/components/website/Home/HomeToursClient.tsx
"use client";

import { useState } from "react";
import Link from "@/components/website/AppLink";
import DifficultyBadge from "@/components/website/DifficultyBadge";
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";

interface HomeToursClientProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

type Tab = "surabaya" | "bali";

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

      {/* Tour cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {packages.map((pkg) => {
          const highlights = pkg.keyExperiences.slice(0, 2);
          const price = `From IDR ${new Intl.NumberFormat("id-ID").format(pkg.startFrom)}`;
          const duration = `${pkg.duration.day}D · ${pkg.duration.night}N`;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-sm border border-jvto-navy/5 overflow-hidden flex flex-col"
            >
              <div className="h-1 bg-jvto-green" />
              <div className="p-5 flex flex-col gap-3 flex-1">
              <p className="font-bold text-jvto-navy text-base leading-snug">
                {pkg.name}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-jvto-navy/60">{duration}</span>
                <DifficultyBadge physicality={pkg.physicality} />
              </div>

              <p className="font-black text-jvto-navy text-lg">{price}</p>

              {highlights.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {highlights.map((h, i) => (
                    <li key={i} className="text-xs text-jvto-navy/60 flex gap-1">
                      <span className="flex-shrink-0">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/${pkg.slug}`}
                className="text-jvto-green font-bold text-sm mt-auto hover:underline"
              >
                See Details <span aria-hidden="true">→</span>
              </Link>
              </div>
            </div>
          );
        })}
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
