import type { PackageListItem } from "@/lib/packages/getWebPackagesList";
import HomeToursClient from "./HomeToursClient";

interface HomeToursProps {
  surabayaPackages: PackageListItem[];
  baliPackages: PackageListItem[];
}

export default function HomeTours({ surabayaPackages, baliPackages }: HomeToursProps) {
  return (
    <section aria-labelledby="tours-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
          Packages
        </p>
        <h2
          id="tours-heading"
          className="font-black text-2xl md:text-3xl text-jvto-navy mb-3"
        >
          Choose Your Expedition
        </h2>
        <p className="text-jvto-muted text-sm mb-10">
          Private departures from Surabaya and Bali. Choose your starting point.
        </p>
        <HomeToursClient
          surabayaPackages={surabayaPackages}
          baliPackages={baliPackages}
        />
      </div>
    </section>
  );
}
