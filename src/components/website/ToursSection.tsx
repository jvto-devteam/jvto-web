import React from 'react';
// FIX: The type 'Tour' was not exported from '@/types'. Replaced with 'ListTourPackage' which is the correct type for tour data.
import { SectionCopy, ListTourPackage } from '@/types';
import TourCard from './TourCard';

interface ToursSectionProps {
  copy: SectionCopy;
  isFilter: boolean;
  tours: ListTourPackage[];
  onFindTourClick: () => void;
  onCtaClick?: (ctaId: string, ctaText: string, section: string) => void;
}

const ToursSection: React.FC<ToursSectionProps> = ({ copy, isFilter, tours, onFindTourClick, onCtaClick }) => {
  const handleFindClick = () => {
    onFindTourClick();
    if (onCtaClick) {
      onCtaClick('funnel_find_tour', 'Find Your Perfect Tour', 'tours_section');
    }
  };

  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-ink-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-repeat bg-center opacity-5 dark:opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%230B1F3A\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"/%3E%3C/g%3E%3C/svg%3E')"}}></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-lg tracking-wide uppercase">{copy.overline}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-ink-primary dark:text-white mt-2">{copy.title}</h2>
          <p className="mt-4 text-ink-neutral-500 dark:text-ink-neutral-300 text-lg max-w-2xl mx-auto">{copy.subhead}</p>
        </div>
        {isFilter && (
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          <button
              onClick={handleFindClick}
              className="flex items-center gap-2 px-6 py-3 text-lg rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 bg-white text-ink-primary hover:bg-primary hover:text-white"
          >
              <span className="material-symbols-outlined">tune</span>
              Find Your Perfect Tour
          </button>
        </div>
        )}
          
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white/30 dark:bg-ink-primary/50 backdrop-blur-sm p-8 rounded-2xl max-w-md mx-auto">
              <span className="material-symbols-outlined text-5xl text-ink-primary dark:text-white">search_off</span>
              <h3 className="text-2xl font-bold text-ink-primary dark:text-white mt-4">No Matching Tours Found</h3>
              <p className="text-ink-neutral-700 dark:text-ink-neutral-200 mt-2">Try adjusting your filters or view all tours.</p>
          </div>
        )}


        {/* <div className="mt-12 text-center">
            <a href="#" className="px-8 py-3 rounded-xl border-2 border-primary text-primary text-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300">
                View All Tours
            </a>
        </div> */}

      </div>
    </section>
  );
};

export default ToursSection;