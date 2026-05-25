import Link from "@/components/website/AppLink";
import Image from "next/image";
import type { Destination } from "@/interfaces";
import { getHomeImageVariantSet } from "@/lib/assets/homeImageVariants";

interface DestinationCardProps {
  destination: Destination;
  isHome?: boolean;
  prioritizeImage?: boolean;
  highlight?: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isHome,
  prioritizeImage = false,
  highlight,
}) => {
  const homeVariantSet = isHome
    ? getHomeImageVariantSet(destination.banner.url)
    : null;
  const bannerSrc = homeVariantSet?.medium || destination.banner.url;

  return (
    <Link
      target={isHome ? "_blank" : "_self"}
      href={`/destinations/${destination.slug}`}
      prefetch={false}
    >
      <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-2xl">

        {isHome && homeVariantSet ? (
          <img
            src={homeVariantSet.medium}
            srcSet={`${homeVariantSet.small} 240w, ${homeVariantSet.medium} 420w`}
            sizes="(max-width: 768px) 42vw, 224px"
            alt={destination.banner.alt || destination.name}
            aria-hidden="true"
            loading={prioritizeImage ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={prioritizeImage ? "high" : "low"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <Image
            src={bannerSrc}
            alt={destination.banner.alt || destination.name}
            aria-hidden="true"
            fill
            unoptimized
            loading={prioritizeImage ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={prioritizeImage ? "high" : "low"}
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={46}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-3 left-3 right-3 text-white">
          {highlight && (
            <p className="text-white/70 text-xs mb-1">{highlight}</p>
          )}
          <div className="font-bold text-base md:text-xl uppercase tracking-wider line-clamp-2 leading-tight">
            {destination.name}
            <span className="sr-only"> — explore this destination</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
