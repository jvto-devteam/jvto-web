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

function TourCard({ pkg, index, cityLabel }: { pkg: PackageListItem; index: number; cityLabel: string }) {
  const price = `IDR ${new Intl.NumberFormat("id-ID").format(pkg.startFrom)}`;
  const duration = `${pkg.duration.day}D${pkg.duration.night > 0 ? ` ${pkg.duration.night}N` : ""}`;
  const highlights = pkg.keyExperiences.slice(0, 2);
  const hasIjen =
    pkg.tags.some((t) => t.toLowerCase().includes("ijen")) ||
    (pkg.name ?? "").toLowerCase().includes("ijen");

  return (
    <Link
      href={`/${pkg.slug}`}
      className="group relative bg-white rounded-sm border border-jvto-border overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-[0_14px_28px_-14px_rgba(13,27,42,0.18)] transition-all duration-300"
    >
      <div className="relative h-52 sm:h-60 w-full flex-shrink-0">
        <Image
          src={pkg.banner.url}
          alt={pkg.banner.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/60 via-jvto-navy/10 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          <span className="text-[9px] font-bold text-jvto-navy uppercase tracking-wider bg-white px-2 py-1 rounded-sm">
            From {cityLabel}
          </span>
          <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-jvto-navy px-2 py-1 rounded-sm">
            &#10003; Police-Led
          </span>
          {hasIjen && (
            <span className="text-[9px] font-bold text-jvto-navy uppercase tracking-wider bg-jvto-lime px-2 py-1 rounded-sm">
              &#9877; Health Check
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 font-mono text-[9px] font-bold text-white/70 uppercase tracking-wider">
          JVTO-{String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <p className="font-black text-base sm:text-lg leading-snug text-jvto-navy">
          {pkg.name}
        </p>
        {highlights.length > 0 && (
          <ul className="flex flex-col gap-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-xs text-jvto-muted flex gap-1.5">
                <span className="flex-shrink-0 text-jvto-green">&middot;</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-jvto-border">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-jvto-muted mb-0.5">
              {duration} &middot; From
            </p>
            <p className="font-black text-jvto-navy text-base">
              {price}
              <small className="text-jvto-muted font-normal text-xs ml-1">/pax</small>
            </p>
          </div>
          <span className="text-xs font-bold text-jvto-navy group-hover:translate-x-0.5 transition-transform">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {packages.map((pkg, i) => (
              <TourCard
                key={pkg.id}
                pkg={pkg}
                index={i}
                cityLabel={activeTab === "surabaya" ? "Surabaya" : "Bali"}
              />
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
