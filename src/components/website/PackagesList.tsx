import React, { useState } from 'react';
import Link from "next/link";
import { TourPackage } from '@/types';
import TourCard from './TourCard';
import AccordionItem from './AccordionItem';
import { formatIDR } from '@/utils/formatting';

interface PackagesListProps {
  tours: TourPackage[];
  viewMode: 'grid' | 'list';
}

const PackagesList: React.FC<PackagesListProps> = ({ tours, viewMode }) => {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const handleAccordionClick = (tourId: string) => {
    setOpenAccordionId(openAccordionId === tourId ? null : tourId);
  };
  
  const getDisplayPrice = (tour: TourPackage) => {
    if (tour.priceTiers && tour.priceTiers.length > 0) {
      const minPrice = Math.min(...tour.priceTiers.map(p => p.pricePerPerson));
      return `From ${formatIDR(minPrice)} / person`;
    }
    return 'Price on request';
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-ink-primary rounded-2xl shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700">
      {tours.map(tour => (
        <AccordionItem
          key={tour.id}
          title={tour.label}
          isOpen={openAccordionId === tour.id}
          onClick={() => handleAccordionClick(tour.id)}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <p className="text-sm">{tour.description}</p>
              <div>
                <h4 className="font-semibold text-sm text-ink-primary dark:text-white mb-2">Key Experiences</h4>
                <div className="flex flex-wrap gap-2">
                  {tour.keyExperiences.map(exp => (
                    <span key={exp} className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full">{exp}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-1 space-y-4">
               <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg">
                    <p className="text-xs text-ink-neutral-500">Duration</p>
                    <p className="font-semibold">{tour.durationDays} Days, {tour.durationNights} Nights</p>
                    <p className="text-xs text-ink-neutral-500 mt-2">Physicality</p>
                    <p className="font-semibold">{tour.physicality}</p>
                    <p className="text-xs text-ink-neutral-500 mt-2">Starts From</p>
                    <p className="font-bold text-lg text-primary">{getDisplayPrice(tour)}</p>
               </div>
               <Link 
                 href={tour.slug} 
                 className="block w-full text-center px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
               >
                 View Details & Book
               </Link>
            </div>
          </div>
        </AccordionItem>
      ))}
    </div>
  );
};

export default PackagesList;