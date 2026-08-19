import Link from "@/components/website/AppLink";
import { ArrowRight } from "lucide-react";
import { ListTourPackage } from "@/types";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";
import TourRowClient from "./TourRowClient";

async function getToursByLocation(
  fromPrefix: "tours/from-bali" | "tours/from-surabaya",
): Promise<ListTourPackage[]> {
  return getEcosystemPackagesList({ fromPrefix, limit: 6 });
}

const FeaturedTours = async () => {
  const [surabayaTours, baliTours] = await Promise.all([
    getToursByLocation("tours/from-surabaya"),
    getToursByLocation("tours/from-bali"),
  ]);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-tags bg-jvto-off border border-jvto-border mb-6">
          <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-muted">
            Tour Packages
          </span>
        </div>
        <h2 className="font-display text-subheading md:text-heading-sm font-black text-jvto-navy mb-5">
          Private tours.{" "}
          <em className="text-jvto-orange-ink not-italic">From Surabaya or Bali.</em>{" "}
          1 to 6 days.
        </h2>
        <p className="text-jvto-muted max-w-2xl mx-auto text-body-sm md:text-body">
          Prices are per person in IDR and drop with group size — starting around{" "}
          <strong className="text-jvto-navy">IDR 1,000,000</strong> (~USD 60) for a 1-day tour.
          Accommodation, breakfast, entrance fees, jeep, gas masks, and transfers included on all packages.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <a
            href="#featured-tours-surabaya"
            className="px-7 py-3 rounded-navsegments bg-jvto-navy text-white font-semibold text-micro uppercase tracking-[0.2em] hover:bg-jvto-navy-mid transition-colors"
          >
            From Surabaya
          </a>
          <a
            href="#featured-tours-bali"
            className="px-7 py-3 rounded-navsegments border border-jvto-navy text-jvto-navy font-semibold text-micro uppercase tracking-[0.2em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            From Bali
          </a>
        </div>
      </div>

      <TourRowClient id="featured-tours-surabaya" title="Tours From Surabaya" tours={surabayaTours} />
      <TourRowClient id="featured-tours-bali" title="Tours From Bali" tours={baliTours} />

      <div className="text-center max-w-7xl mx-auto px-6 md:px-8 pt-10">
        <Link
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-navy text-white px-10 py-4 font-semibold text-micro uppercase tracking-[0.2em] rounded-buttons hover:bg-jvto-navy-mid transition-colors"
          style={{ boxShadow: "var(--shadow-jvto-cta)" }}
        >
          View All Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedTours;
