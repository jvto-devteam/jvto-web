// src/components/website/Home/HomeTours.tsx
import type { PackageListItem } from "@/lib/packages/getWebPackagesList";
import HomeToursClient from "./HomeToursClient";

interface HomeToursProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

export default function HomeTours({ surabayaPackages, baliPackages }: HomeToursProps) {
  return (
    <section className="bg-jvto-off py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Packages
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Browse Packages
        </h2>
        <p className="text-jvto-navy/60 text-base mb-10">
          Private departures from Surabaya and Bali — choose your starting point.
        </p>
        <HomeToursClient
          surabayaPackages={surabayaPackages}
          baliPackages={baliPackages}
        />
      </div>
    </section>
  );
}
