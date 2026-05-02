import React from 'react';
import Link from "next/link";

const GroupsAndEscortsSection = () => (
    <div className="py-12 bg-background-light dark:bg-ink-primary">
        <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-white dark:bg-background-dark p-8 rounded-sm shadow-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
                <h3 className="text-2xl font-bold text-ink-primary dark:text-white">For Large Groups & Schools</h3>
                <p className="mt-3 text-ink-neutral-700 dark:text-ink-neutral-200">
                   For groups of 18 guests or more, we can coordinate an official traffic police escort on specific routes (e.g., Gending exit to Bondowoso) when approved under Indonesian law. This support is arranged transparently through the relevant police units.
                </p>
                <Link href="/travel-guide" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                    Learn more in our FAQ →
                </Link>
            </div>
        </div>
    </div>
);
export default GroupsAndEscortsSection;