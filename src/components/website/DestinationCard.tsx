import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/interfaces";

interface DestinationCardProps {
  destination: Destination;
  isHome?: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, isHome }) => {
  return (
    <Link target={isHome ? "_blank" : "_self"} href={`/destinations/${destination.slug}`}>
      <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-sm">

        <Image
          src={destination.banner.url}
          alt={destination.banner.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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
