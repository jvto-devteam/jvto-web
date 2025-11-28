// FIX: Implemented the SocialProof component to display logos, resolving placeholder content errors.
import React from 'react';
import { proofLinks } from '@/constants';

const logos = [
  { name: 'TripAdvisor', src: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg', alt: 'TripAdvisor Logo', href: proofLinks.tripadvisor },
  { name: 'Google Reviews', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png', alt: 'Google Logo', href: proofLinks.googleMaps },
  { name: 'Trustpilot', src: 'https://cdn.trustpilot.net/brand-assets/4.3.0/logo-wordmark/light-bg/logo-black.svg', alt: 'Trustpilot Logo', href: proofLinks.trustpilot },
];

declare global {
    interface Window {
        gtag?: (type: string, event: string, params: object) => void;
    }
}

const SocialProof: React.FC = () => {

  return (
    <div className="bg-background-light dark:bg-ink-primary py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold leading-8 text-ink-neutral-700 dark:text-ink-neutral-200">
              Recent guests consistently highlight safety briefings, smooth logistics, and genuine local insight.
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <blockquote className="p-4 bg-white dark:bg-background-dark rounded-xl shadow-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
                    <p className="text-ink-neutral-700 dark:text-ink-neutral-200">“Flawless planning and calm, safety-first guidance at every step.”</p>
                </blockquote>
                <blockquote className="p-4 bg-white dark:bg-background-dark rounded-xl shadow-sm border border-ink-neutral-200 dark:border-ink-neutral-700">
                     <p className="text-ink-neutral-700 dark:text-ink-neutral-200">“Our guide’s local knowledge turned a good tour into a memorable journey.”</p>
                </blockquote>
            </div>
        </div>
        <div className="mt-12 grid grid-cols-3 max-w-md mx-auto gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none items-center">
          {logos.map((logo) => (
            <a 
              key={logo.name}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 flex justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                className="max-h-10 w-full object-contain dark:invert"
                src={logo.src}
                alt={logo.name}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProof;