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
    <section className="py-16 md:py-24 bg-white">
      {/* Section header */}
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
            Tour Packages
          </span>
        </div>
        <h2
          className="text-3xl md:text-5xl font-black text-jvto-navy mb-4 leading-tight"
          style={{
            fontFamily: "Raleway, Inter, sans-serif",
            letterSpacing: "-0.025em",
          }}
        >
          16 private tours.{" "}
          <span className="text-jvto-orange italic">From Surabaya or Bali.</span>{" "}
          1 to 6 days.
        </h2>
        <p className="text-jvto-muted max-w-2xl mx-auto text-base md:text-lg">
          All 16 packages are 100% private. Prices are per person, in IDR, and
          scale down with group size. Every package includes: accommodation,
          breakfast, entrance fees, Bromo 4WD jeep (where applicable), gas
          masks, transfers, and a T-shirt. No surprise local payments.
        </p>

        {/* Origin selector pills */}
        <div className="flex mt-8 items-center justify-center gap-3 relative z-10">
          <a
            href="#featured-tours-surabaya"
            className="px-8 py-3 rounded-full bg-jvto-navy text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-navy-mid transition-colors"
          >
            From Surabaya
          </a>
          <a
            href="#featured-tours-bali"
            className="px-8 py-3 rounded-full border border-jvto-navy text-jvto-navy font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-navy hover:text-white transition-colors"
          >
            From Bali
          </a>
        </div>
      </div>

      {/* Tour rows — data logic unchanged */}
      <TourRowStatic
        id="featured-tours-surabaya"
        title="Tours From Surabaya"
        tours={surabayaTours}
      />
      <TourRowStatic
        id="featured-tours-bali"
        title="Tours From Bali"
        tours={baliTours}
      />

      <div className="text-center container mx-auto px-6 pt-8">
        <Link
          target="_blank"
          href="/tours"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-jvto-navy text-white px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy-mid transition-colors"
          style={{ boxShadow: "var(--shadow-jvto-cta)" }}
        >
          View All 16 Tours
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
      className="py-6 md:py-12 scroll-mt-24 border-b border-jvto-border last:border-0"
      intrinsicSize="780px"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3
              className="text-2xl md:text-3xl font-black text-jvto-navy tracking-tight"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {title}
            </h3>
            <p className="text-jvto-muted mt-1 text-sm md:text-base">
              {tours.length} private itineraries available
            </p>
          </div>
        </div>

        <div className="relative -mx-6 md:mx-0 md:px-0">
          <div className="flex md:gap-6 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0">
            {tours.map((tour, index) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic
                  isNewTab
                  tour={tour}
                  prioritizeImage={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewportSection>
  );
}

export default FeaturedTours;
