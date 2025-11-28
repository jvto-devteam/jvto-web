import React from 'react';
import Link from "next/link";
import { pillarsOfTrust } from '@/constants';

const pillars = pillarsOfTrust;

interface PillarCardProps {
  pillar: typeof pillars[0];
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  return (
    <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
        </div>
        <h3 className="text-xl font-bold text-ink-primary dark:text-white">{pillar.title}</h3>
        <p className="mt-2 text-ink-neutral-700 dark:text-ink-neutral-200 flex-grow text-sm">{pillar.description}</p>
        <Link 
            href={pillar.link} 
            className="mt-6 inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-all"
        >
            {pillar.cta}
        </Link>
    </div>
  );
};

const PillarsOfTrust: React.FC<PillarsOfTrustProps> = () => {
  return (
    <section className="py-16 md:py-28 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">The Pillars of Trust</h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-300 max-w-2xl mx-auto">How we ensure every journey with us is safe, transparent, and authentic.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsOfTrust;