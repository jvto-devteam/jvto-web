import React from 'react';
import { Badge } from '@/types';

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
  <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-card hover:shadow-cardHover h-full flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${badge.iconBgColor}`}>
      <span className={`material-symbols-outlined text-4xl ${badge.iconTextColor}`}>{badge.icon}</span>
    </div>
    <h3 className="font-bold text-lg mt-4 text-ink-primary dark:text-white">{badge.name}</h3>
    <div className="w-full bg-ink-neutral-200 dark:bg-ink-neutral-700 rounded-full h-2.5 mt-4">
      <div
        className={`${badge.progressBgColor} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${badge.progress}%` }}
      ></div>
    </div>
    <p className="text-sm mt-2 text-ink-neutral-500 dark:text-ink-neutral-200">{badge.progress}% Complete</p>
  </div>
);

export default BadgeCard;