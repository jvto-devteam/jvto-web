import DestinationCard from "@/components/website/DestinationCard";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const HomeDestinations: React.FC<HomeDestinationsProps> = ({
  destinations,
}) => {
  if (!destinations.length) return null;

  return (
    <section className="bg-jvto-navy py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-10 px-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              Destinations
            </span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-black text-white leading-tight"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Four destinations.{" "}
            <span className="text-jvto-orange italic">One licensed operator</span>{" "}
            covering all of them.
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl text-sm md:text-base">
            All JVTO tours start and end with full logistics covered. Every
            destination below is served by dedicated private transport — no
            public buses, no group vans shared with strangers.
          </p>
        </div>

        {/* Scrollable destination cards — layout unchanged */}
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {destinations.map((dest, index) => (
            <div key={dest.id} className="flex-shrink-0 w-56">
              <DestinationCard
                isHome={true}
                destination={dest}
                prioritizeImage={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
