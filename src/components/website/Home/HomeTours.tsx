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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 02
            </p>
            <h2
              id="tours-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Find your <span className="text-jvto-orange">perfect route.</span>
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-jvto-muted">
            16 private itineraries · 1D&ndash;6D
          </span>
        </div>
        <HomeToursClient
          surabayaPackages={surabayaPackages}
          baliPackages={baliPackages}
        />
      </div>
    </section>
  );
}
