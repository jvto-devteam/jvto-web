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
      <div className="group relative aspect-[2/3] overflow-hidden cursor-pointer rounded-2xl">

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

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-black text-white text-base leading-tight mb-1">
            {destination.name}
            <span className="sr-only"> — explore this destination</span>
          </p>
          {highlight && (
            <p className="text-white/70 text-xs mb-2">{highlight}</p>
          )}
          <span className="text-jvto-green text-xs font-bold">
            View Tours <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
