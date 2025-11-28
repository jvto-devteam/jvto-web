
import React, { useRef } from 'react';
import { tourPackages } from '@/data';
import CarouselCard from './CarouselCard';

const TourCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.9; // A bit less than full width for peeking
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        <header className="mb-8 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-ink-primary dark:text-white">Explore Popular Itineraries</h2>
            <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200">Hand-picked tours that our travelers love the most.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
            <button
              aria-label="Scroll left"
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </header>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-snap-x snap-mandatory scrollbar-hide"
          >
            {tourPackages.map(tour => (
              <CarouselCard key={tour.id} tour={tour} />
            ))}
          </div>
          <div className="md:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-2 pointer-events-none">
             <button
              aria-label="Scroll left"
              onClick={() => scroll('left')}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scroll('right')}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-md hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourCarousel;
