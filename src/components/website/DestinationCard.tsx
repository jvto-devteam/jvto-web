import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/interfaces";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => (
  <Link
    href={`/destinations/${destination.slug}`}
    className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-all duration-300 transform hover:-translate-y-1 h-full"
  >
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
      <Image
        src={destination.banner.url}
        alt={destination.banner.alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={90}
        priority={false} // true hanya untuk card yang langsung kelihatan (LCP)
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-ink-primary dark:text-white">
        {destination.name}
      </h3>
      <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200 flex-grow line-clamp-2">
        {destination.description}
      </p>

      <div className="mt-4 pt-4 border-t border-ink-neutral-200/60 dark:border-ink-neutral-700/60 flex flex-wrap items-center text-xs text-ink-neutral-500 dark:text-neutral-400 gap-x-3 gap-y-1">
        <span className="flex items-center gap-1 capitalize">
          <span className="material-symbols-outlined text-sm text-primary">
            hiking
          </span>
          {destination.keyInfo.difficulty_level}
        </span>
        <span className="flex items-center gap-1 capitalize">
          <span className="material-symbols-outlined text-sm text-primary">
            landscape
          </span>
          {destination.keyInfo.temperature_range}
        </span>
        <span className="flex items-center gap-1 capitalize">
          <span className="material-symbols-outlined text-sm text-primary">
            calendar_month
          </span>
          {destination.keyInfo.best_time_to_visit}
        </span>
      </div>

      <div className="mt-4 text-primary font-semibold">
        <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
          Learn more
          <span className="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    </div>
  </Link>
);

export default DestinationCard;
