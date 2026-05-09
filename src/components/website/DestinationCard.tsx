import Link from "@/components/website/AppLink";
import Image from "next/image";
import type { Destination } from "@/interfaces";
import { getHomeImageVariant } from "@/lib/assets/homeImageVariants";

interface DestinationCardProps {
  destination: Destination;
  isHome?: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, isHome }) => {
  const bannerSrc =
    (isHome ? getHomeImageVariant(destination.banner.url) : null) ||
    destination.banner.url;

  return (
    <Link
      target={isHome ? "_blank" : "_self"}
      href={`/destinations/${destination.slug}`}
      prefetch={false}
      aria-label={`Explore destination: ${destination.name}`}
    >
      <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm">

        <Image
          src={bannerSrc}
          alt={destination.banner.alt || destination.name}
          fill
          unoptimized
          loading="lazy"
          decoding="async"
          sizes={
            isHome
              ? "(max-width: 768px) 42vw, 224px"
              : "(max-width: 768px) 100vw, 33vw"
          }
          quality={46}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* TITLE */}
        <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-3 left-3 right-3 text-white">
          <div className="font-bold text-base md:text-xl uppercase tracking-wider line-clamp-2 leading-tight">
            {destination.name}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
