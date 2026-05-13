import Link from "@/components/website/AppLink";
import { ArrowRight } from "lucide-react";
import { ListTourPackage } from "@/types";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import TourCardStatic from "@/components/website/TourCardStatic";
import ViewportSection from "@/components/website/ViewportSection";

async function getToursByLocation(id: number): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: id, limit: 6 });
}

const FeaturedTours = async () => {
  const [surabayaTours, baliTours] = await Promise.all([
    getToursByLocation(4),
    getToursByLocation(3),
  ]);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
            Tour Packages
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl font-black text-jvto-navy mb-5 leading-tight"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
        >
          Private tours.{" "}
          <em className="text-jvto-orange not-italic">From Surabaya or Bali.</em>{" "}
          1 to 6 days.
        </h2>
        <p className="text-jvto-muted max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Prices are per person in IDR and drop with group size — starting around{" "}
          <strong className="text-jvto-navy">IDR 1,000,000</strong> (~USD 60) for a 1-day tour.
          Accommodation, breakfast, entrance fees, jeep, gas masks, and transfers included on all packages.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <a
            href="#featured-tours-surabaya"
            className="px-7 py-3 rounded-full bg-jvto-navy text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-jvto-navy-mid transition-colors"
          >
            From Surabaya
          </a>
          <a
            href="#featured-tours-bali"
            className="px-7 py-3 rounded-full border border-jvto-navy text-jvto-navy font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            From Bali
          </a>
        </div>
      </div>

      <TourRowStatic id="featured-tours-surabaya" title="Tours From Surabaya" tours={surabayaTours} />
      <TourRowStatic id="featured-tours-bali" title="Tours From Bali" tours={baliTours} />

      <div className="text-center max-w-7xl mx-auto px-6 md:px-8 pt-10">
        <Link
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-navy text-white px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy-mid transition-colors"
          style={{ boxShadow: "var(--shadow-jvto-cta)" }}
        >
          View All Tours
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

function TourRowStatic({
  id,
  title,
  tours,
}: {
  id: string;
  title: string;
  tours: ListTourPackage[];
}) {
  if (!tours.length) return null;

  return (
    <ViewportSection
      as="section"
      id={id}
      className="py-6 md:py-10 scroll-mt-24 border-b border-jvto-border last:border-0"
      intrinsicSize="780px"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-3">
          <div>
            <h3
              className="text-2xl md:text-3xl font-black text-jvto-navy tracking-tight"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {title}
            </h3>
            <p className="text-jvto-muted mt-1 text-sm">
              {tours.length} private itineraries available
            </p>
          </div>
        </div>
        <div className="relative -mx-6 md:mx-0">
          <div className="flex md:gap-5 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0">
            {tours.map((tour, index) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic isNewTab tour={tour} prioritizeImage={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}

export default FeaturedTours;
