import React from 'react';
import { challengesCopy, badges } from '@/constants';
import BadgeCard from './BadgeCard';

const ChallengeBadges: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase">{challengesCopy.overline}</p>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">{challengesCopy.title}</h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">{challengesCopy.subhead}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map(badge => (
            <BadgeCard key={badge.name} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengeBadges;