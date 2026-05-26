"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";

interface HomeToursClientProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

type Tab = "surabaya" | "bali";

function TourCard({ pkg }: { pkg: PackageListItem }) {
  const price = `From IDR ${new Intl.NumberFormat("id-ID").format(pkg.startFrom)}`;
  const duration = `${pkg.duration.day}D${pkg.duration.night > 0 ? ` ${pkg.duration.night}N` : ""}`;
  const highlights = pkg.keyExperiences.slice(0, 3);

  return (
    <Link
      href={`/${pkg.slug}`}
      className="group relative bg-white rounded-sm border border-jvto-border overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(13,27,42,0.15)] transition-all duration-200"
    >
      <div className="relative h-56 sm:h-64 w-full flex-shrink-0">
        <Image
          src={pkg.banner.url}
          alt={pkg.banner.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/70 via-jvto-navy/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-white font-black text-base sm:text-lg leading-snug drop-shadow-sm">
              {pkg.name}
            </p>
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold text-white uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-sm">
            {duration}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        {highlights.length > 0 && (
          <ul className="flex flex-col gap-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-xs text-jvto-muted flex gap-1.5">
                <span className="flex-shrink-0 text-jvto-green">·</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-jvto-border">
          <p className="font-black text-jvto-navy text-lg">{price}</p>
          <span className="text-xs font-bold text-jvto-green group-hover:translate-x-0.5 transition-transform">
            View details &rarr;
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

  const packages = activeTab === "surabaya" ? surabayaPackages : baliPackages;
  const viewAllHref =
    activeTab === "surabaya" ? "/tours/from-surabaya" : "/tours/from-bali";

  return (
    <div>
      <div className="flex gap-2 mb-8" role="tablist">
        {(["surabaya", "bali"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            className={`px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? "bg-jvto-navy text-white"
                : "bg-white text-jvto-muted border border-jvto-border hover:text-jvto-navy"
            }`}
          >
            From {tab === "surabaya" ? "Surabaya" : "Bali"}
          </button>
        ))}
      </div>

      {packages.length === 0 ? (
        <p className="text-jvto-muted text-sm py-12 text-center">
          No packages available for this departure city.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {packages.map((pkg) => (
              <TourCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 bg-jvto-navy text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm hover:bg-jvto-navy/90 transition-colors"
            >
              View all packages &rarr;
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
