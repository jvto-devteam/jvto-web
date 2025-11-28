import React from 'react';
import Link from "next/link";
import { TourPackage } from '@/types';

interface CarouselCardProps {
  tour: TourPackage;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ tour }) => {
  const getDisplayPrice = () => {
    if (tour.priceTiers && tour.priceTiers.length > 0) {
        const minPrice = Math.min(...tour.priceTiers.map(p => p.pricePerPerson));
        return new Intl.NumberFormat('id-ID').format(minPrice) + ' IDR';
    }
    if (tour.price) {
        return tour.price.replace('Starts from ', '').replace(' / person', ''); // Also remove / person for brevity
    }
    return 'On Request';
  };

  const fullTourSlug = `/tours/${tour.slug}`;

  return (
    <div className="snap-start flex-shrink-0 w-80 md:w-96">
      <Link href={fullTourSlug} className="group rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden block transition-shadow duration-300">
        <div className="relative overflow-hidden">
            <img
                src={tour.imageUrl}
                alt={tour.label}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-ink-accentC/90 text-ink-primary px-2 py-1 rounded-md text-xs font-bold">
              Private Tour
            </div>
            {tour.isFeatured && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-yellow-400/90 text-ink-primary px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">star</span>
                  Featured
              </div>
            )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-ink-primary dark:text-white truncate">{tour.label}</h3>
          <p className="mt-1 text-sm text-ink-neutral-500 dark:text-ink-neutral-400 line-clamp-2 min-h-[2.5rem]">{tour.description}</p>
          <div className="mt-2 text-sm text-ink-neutral-500 dark:text-ink-neutral-400 flex items-center gap-1 capitalize">
            <span className="material-symbols-outlined text-base text-primary">fitness_center</span> {tour.physicality}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-lg text-ink-primary dark:text-white">{getDisplayPrice()}</span>
            <div className="text-ink-accentA font-semibold">
              Learn more <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarouselCard;