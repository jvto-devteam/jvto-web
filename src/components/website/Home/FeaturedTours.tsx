import Link from "@/components/website/AppLink";
import { MapPin, ArrowRight } from "lucide-react";
import { ListTourPackage } from "@/types";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import TourCardStatic from "@/components/website/TourCardStatic";

async function getToursByLocation(id: number): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: id, limit: 6 });
}

const FeaturedTours = async () => {
  const [surabayaTours, baliTours] = await Promise.all([
    getToursByLocation(4),
    getToursByLocation(3),
  ]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-jvto-green rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
          Start Your Route
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Choose your origin. We handle the rest — private vehicle, drivers, Bromo jeep, permits, and no shared groups.
        </p>
        <div className="flex mt-8 items-center justify-center md:gap-4 gap-2 relative z-10">
          <a
            href="#featured-tours-surabaya"
            className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-jvto-dark hover:text-white transition-all duration-300"
          >
            From Surabaya
          </a>
          <a
            href="#featured-tours-bali"
            className="w-full sm:w-auto md:px-8 py-3 bg-white border-2 border-jvto-dark text-jvto-dark font-bold uppercase tracking-wider rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-jvto-dark hover:text-white transition-all duration-300"
          >
            From Bali
          </a>
        </div>
      </div>

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
          className="inline-flex items-center gap-2 bg-jvto-dark text-white px-10 py-4 font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all"
        >
          View All Tours
          <ArrowRight className="w-5 h-5" />
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
    <section
      id={id}
      className="py-6 md:py-12 scroll-mt-24 border-b border-gray-100 last:border-0"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black uppercase text-jvto-dark tracking-wide">
              {title}
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {tours.length} adventures available
            </p>
          </div>
        </div>

        <div className="relative -mx-6 md:mx-0 md:px-0">
          <div className="flex md:gap-6 gap-3 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-6 md:px-0">
            {tours.map((tour) => (
              <div key={tour.id} className="flex-shrink-0 w-[80vw] sm:w-[350px]">
                <TourCardStatic isNewTab tour={tour} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedTours;
