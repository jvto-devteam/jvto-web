import Image from "next/image";
import Link from "@/components/website/AppLink";
import { getHomeImageVariantSet } from "@/lib/assets/homeImageVariants";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const DEST_META: Record<string, string> = {
  "ijen-crater": "Blue Fire Crater · 2,386m · Pre-dawn hike",
  "kawah-ijen": "Blue Fire Crater · 2,386m · Pre-dawn hike",
  "mount-bromo": "Penanjakan Sunrise · 2,329m · 4WD jeep",
  "tumpak-sewu-waterfall": "Curtain Waterfall · ~120m · Canyon descent",
  "tumpak-sewu": "Curtain Waterfall · ~120m · Canyon descent",
  "madakaripura-waterfall": "Tallest Java Waterfall · Canyon wade",
  "madakaripura": "Tallest Java Waterfall · Canyon wade",
};

const HomeDestinations: React.FC<HomeDestinationsProps> = ({ destinations }) => {
  if (!destinations.length) return null;

  return (
    <section className="bg-jvto-navy py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
              Destinations
            </span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Four destinations.{" "}
            <em className="text-jvto-orange not-italic">One licensed operator</em>{" "}
            covering all of them.
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
            All JVTO tours start and end with full logistics covered. Every destination below is served by dedicated private transport — no public buses, no group vans shared with strangers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
          {destinations.map((dest, index) => {
            const isFirst = index === 0;
            const variantSet = getHomeImageVariantSet(dest.banner.url);
            const imgSrc = variantSet?.medium || dest.banner.url;
            const metaLine = DEST_META[dest.slug] ?? dest.description?.slice(0, 60);

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                prefetch={false}
                target="_blank"
                className={`group block relative overflow-hidden ${isFirst ? "rounded-[40px]" : "rounded-[32px]"}`}
                style={{ minHeight: isFirst ? "420px" : "360px" }}
              >
                {variantSet ? (
                  <img
                    src={imgSrc}
                    srcSet={`${variantSet.small} 240w, ${variantSet.medium} 420w`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={dest.banner.alt || dest.name}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name}
                    fill
                    unoptimized
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {isFirst && (
                    <div className="inline-flex items-center gap-1.5 bg-jvto-lime/15 border border-jvto-lime/35 rounded-full px-3 py-1 mb-3">
                      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-jvto-lime">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3
                    className={`font-black text-white leading-tight mb-1 ${isFirst ? "text-2xl md:text-3xl" : "text-lg"}`}
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {dest.name}
                  </h3>
                  {metaLine && (
                    <p className="text-[10px] text-white/55 uppercase tracking-[0.1em] font-semibold">
                      {metaLine}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
