import React from 'react';
import Link from "next/link";
import { SectionCopy } from '@/types';
import { destinationsData } from '@/data/destinations';
import DestinationCard from './DestinationCard';

interface DestinationsSectionProps {
  copy: SectionCopy;
  destinations: typeof destinationsData;
}

const DestinationsSection: React.FC<DestinationsSectionProps> = ({ copy, destinations }) => {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase">{copy.overline}</p>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">{copy.title}</h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-300 max-w-2xl mx-auto">{copy.subhead}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/destinations"
            className="px-8 py-4 rounded-xl border-2 border-primary text-primary text-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
