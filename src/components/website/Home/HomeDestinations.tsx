// src/components/website/Home/HomeDestinations.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import type { Destination } from "@/interfaces";

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

      {/* Mobile: full-bleed horizontal scroll with pl-6 for left alignment */}
      <div className="md:hidden overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pl-6 scroll-pl-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {destinations.map((dest) => {
            const highlight = DEST_HIGHLIGHTS[dest.slug] ?? "";
            return (
              <div
                key={dest.slug}
                className="relative overflow-hidden rounded-2xl aspect-[2/3] flex-shrink-0 w-48 snap-start"
              >
                <Image
                  src={dest.banner.url}
                  alt={dest.banner.alt}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-black text-white text-base leading-tight mb-1">{dest.name}</p>
                  {highlight && <p className="text-white/70 text-xs mb-2">{highlight}</p>}
                  <Link href={`/destinations/${dest.slug}`} className="text-jvto-green text-xs font-bold hover:underline">
                    View Tours <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
          {/* Right breathing room */}
          <div className="flex-shrink-0 w-6" aria-hidden="true" />
        </div>
      </div>

      {/* Desktop: padded grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-4 max-w-7xl mx-auto px-8">
        {destinations.map((dest) => {
          const highlight = DEST_HIGHLIGHTS[dest.slug] ?? "";
          return (
            <div
              key={dest.slug}
              className="relative overflow-hidden rounded-2xl aspect-[2/3]"
            >
              <Image
                src={dest.banner.url}
                alt={dest.banner.alt}
                fill
                sizes="20vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-black text-white text-base leading-tight mb-1">{dest.name}</p>
                {highlight && <p className="text-white/70 text-xs mb-2">{highlight}</p>}
                <Link href={`/destinations/${dest.slug}`} className="text-jvto-green text-xs font-bold hover:underline">
                  View Tours <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
