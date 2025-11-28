import React from 'react';
import Link from "next/link";
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => (
  <Link href={`/destinations/${destination.slug}`} className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-all duration-300 transform hover:-translate-y-1 h-full">
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <img src={destination.images[0]} alt={destination.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-ink-primary dark:text-white">{destination.name}</h3>
      <p className="mt-2 text-sm text-ink-neutral-700 dark:text-ink-neutral-200 flex-grow line-clamp-2">{destination.description}</p>
      
      <div className="mt-4 pt-4 border-t border-ink-neutral-200/60 dark:border-ink-neutral-700/60 flex flex-wrap items-center text-xs text-ink-neutral-500 dark:text-neutral-400 gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 capitalize"><span className="material-symbols-outlined text-sm text-primary">hiking</span> {destination.keyInfo.difficulty}</span>
          {/* FIX: Replaced `destination.keyInfo.altitude` with `destination.keyInfo.elevation` to match the `Destination` type definition and resolve the property access error. */}
          <span className="flex items-center gap-1 capitalize"><span className="material-symbols-outlined text-sm text-primary">landscape</span> {destination.keyInfo.elevation}</span>
          <span className="flex items-center gap-1 capitalize"><span className="material-symbols-outlined text-sm text-primary">calendar_month</span> {destination.keyInfo.bestSeason}</span>
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