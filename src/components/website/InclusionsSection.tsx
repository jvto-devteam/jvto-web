import React from 'react';
import { inclusions } from '@/constants';

const InclusionsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-background-light dark:bg-ink-primary border border-ink-neutral-200 dark:border-ink-neutral-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700 dark:text-green-400">
                <span className="material-symbols-outlined">check_circle</span>
                Included (All-inclusive)
              </h3>
              <ul className="mt-4 space-y-2 list-none text-ink-neutral-700 dark:text-ink-neutral-200">
                {inclusions.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                     <span className="material-symbols-outlined text-green-500 text-sm mt-1">check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <span className="material-symbols-outlined">add_circle</span>
                Optional Extras
              </h3>
              <ul className="mt-4 space-y-2 list-none text-ink-neutral-700 dark:text-ink-neutral-200">
                {inclusions.optional.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-blue-500 text-sm mt-1">add</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InclusionsSection;
