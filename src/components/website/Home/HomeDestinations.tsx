import Image from "next/image";
import Link from "@/components/website/AppLink";
import { getHomeImageVariantSet } from "@/lib/assets/homeImageVariants";
import type { Destination } from "@/interfaces";

interface HomeDestinationsProps {
  destinations: Destination[];
}

const HomeDestinations: React.FC<HomeDestinationsProps> = ({ destinations }) => {
  if (!destinations.length) return null;

  return (
    <section className="bg-jvto-navy py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-tags border border-white/20 bg-white/5 backdrop-blur-sm mb-5">
            <span className="text-micro font-semibold uppercase tracking-[0.2em] text-white/70">
              Destinations
            </span>
          </div>
          <h2 className="font-display text-subheading md:text-heading-sm font-black text-white mb-4 max-w-2xl">
            Five destinations.{" "}
            <em className="text-jvto-orange not-italic">One licensed operator</em>{" "}
            covering all of them.
          </h2>
          <p className="text-white/70 text-caption md:text-body-sm max-w-xl">
            All JVTO tours start and end with full logistics covered. Every destination below is
            served by dedicated private transport — no public buses, no group vans shared with strangers.
          </p>
        </div>

        {/* Desktop — hover expansion row */}
        <div className="dest-row hidden lg:flex gap-4" style={{ height: "440px" }}>
          {destinations.map((dest, index) => {
            const isPopular = dest.slug === "mount-bromo";
            const variantSet = getHomeImageVariantSet(dest.banner.url);
            const imgSrc = variantSet?.medium || dest.banner.url;
            const metaLine = (dest as any).hero_meta_line ?? dest.description?.slice(0, 60);

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                prefetch={false}
                target="_blank"
                className="dest-card group relative overflow-hidden rounded-largecards flex-1 min-w-0 hover:rounded-jvto-xl block"
              >
                {variantSet ? (
                  <img
                    src={imgSrc}
                    srcSet={`${variantSet.small} 240w, ${variantSet.medium} 420w`}
                    sizes="20vw"
                    alt={dest.banner.alt || dest.name}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name}
                    fill
                    unoptimized
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover"
                    sizes="20vw"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {isPopular && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 inline-flex items-center gap-1.5 bg-jvto-lime/15 border border-jvto-lime/35 rounded-tags px-3 py-1 mb-3">
                      <span className="text-micro font-semibold uppercase tracking-[0.15em] text-jvto-lime">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3 className="font-display text-caption group-hover:text-body-lg font-black text-white transition-all duration-500">
                    {dest.name}
                  </h3>
                  {metaLine && (
                    <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-micro text-white/70 uppercase tracking-[0.1em] font-semibold mt-1">
                      {metaLine}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile — horizontal scroll carousel */}
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mr-6">
          <div className="flex gap-4 pb-6 pr-6">
            {destinations.map((dest, index) => {
              const isPopular = dest.slug === "mount-bromo";
              const variantSet = getHomeImageVariantSet(dest.banner.url);
              const imgSrc = variantSet?.medium || dest.banner.url;
              const metaLine = (dest as any).hero_meta_line ?? dest.description?.slice(0, 60);

              return (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  prefetch={false}
                  target="_blank"
                  className="relative overflow-hidden rounded-largecards flex-shrink-0 snap-start block w-[72vw] sm:w-[300px]"
                  style={{ height: "360px" }}
                >
                  {variantSet ? (
                    <img
                      src={imgSrc}
                      alt={dest.banner.alt || dest.name}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={dest.banner.url}
                      alt={dest.banner.alt || dest.name}
                      fill
                      unoptimized
                      loading={index < 2 ? "eager" : "lazy"}
                      className="object-cover"
                      sizes="72vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {isPopular && (
                      <div className="inline-flex items-center gap-1.5 bg-jvto-lime/15 border border-jvto-lime/35 rounded-tags px-3 py-1 mb-2">
                        <span className="text-micro font-semibold uppercase tracking-[0.15em] text-jvto-lime">
                          Popular
                        </span>
                      </div>
                    )}
                    <h3 className="font-display text-body-lg font-black text-white mb-1">
                      {dest.name}
                    </h3>
                    {metaLine && (
                      <p className="text-micro text-white/70 uppercase tracking-[0.1em] font-semibold">
                        {metaLine}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDestinations;
