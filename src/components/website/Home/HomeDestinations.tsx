// src/components/website/Home/HomeDestinations.tsx
import type { Destination } from "@/interfaces";
import DestinationCard from "@/components/website/DestinationCard";

const DEST_HIGHLIGHTS: Record<string, string> = {
  "mount-bromo": "Sunrise over Tengger Caldera",
  "ijen-crater": "Blue Fire at 2am",
  "tumpak-sewu-waterfall": "Niagara of East Java",
  "papuma-beach": "Hidden beach, East Java coast",
  "madakaripura-waterfall": "Sacred waterfall, Majapahit heritage",
};

interface HomeDestinationsProps {
  destinations: Destination[];
}

export default function HomeDestinations({ destinations }: HomeDestinationsProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      {/* Heading — padded */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Destinations
        </p>
        <h2
          className="font-black text-3xl md:text-4xl text-jvto-navy"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Explore East Java&apos;s Volcanoes
        </h2>
      </div>

      {/* Mobile: full-bleed horizontal scroll */}
      <div className="md:hidden overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pl-6 scroll-pl-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {destinations.map((dest) => (
            <div key={dest.slug} className="flex-shrink-0 w-48 snap-start">
              <DestinationCard
                destination={dest}
                isHome={true}
                highlight={DEST_HIGHLIGHTS[dest.slug]}
              />
            </div>
          ))}
          <div className="flex-shrink-0 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* Desktop: padded 5-column grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-4 max-w-7xl mx-auto px-8">
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.slug}
            destination={dest}
            isHome={true}
            highlight={DEST_HIGHLIGHTS[dest.slug]}
          />
        ))}
      </div>
    </section>
  );
}
