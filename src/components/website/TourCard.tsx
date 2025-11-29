'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { TourPackage } from '@/types';
import { formatIDR } from '@/utils/formatting';
import Modal from './Modal';

// Skeleton component for loading state
const TourCardSkeleton: React.FC = () => {
    return (
        <div role="status" className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card overflow-hidden animate-pulse">
            <div className="relative aspect-[4/3] w-full bg-gray-300 dark:bg-ink-neutral-700"></div>
            <div className="p-6 flex flex-col flex-grow">
                {/* Metadata placeholder */}
                <div className="flex gap-4 mb-3">
                     <div className="h-4 bg-gray-200 dark:bg-ink-neutral-600 rounded w-16"></div>
                     <div className="h-4 bg-gray-200 dark:bg-ink-neutral-600 rounded w-20"></div>
                </div>

                {/* Title placeholder */}
                <div className="h-5 bg-gray-300 dark:bg-ink-neutral-700 rounded w-3/4"></div>
                
                {/* Spacer */}
                <div className="flex-grow"></div>
                
                {/* Price placeholder */}
                <div className="mt-6 pt-4 border-t border-ink-neutral-200/60 dark:border-ink-neutral-700/60">
                     <div className="h-6 bg-gray-200 dark:bg-ink-neutral-600 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
};

interface TourCardProps {
  tour?: TourPackage;
  isLoading?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, isLoading }) => {
// All hooks at the top — always called in the same order
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe to compute even if tour is undefined — we'll guard inside
  const images = React.useMemo(() => {
    if (!tour) return [];
    return [tour.imageUrl, ...(tour.gallery || [])].filter(Boolean);
  }, [tour?.imageUrl, tour?.gallery]);

  // Early return AFTER all hooks
  if (isLoading || !tour) {
    return <TourCardSkeleton />;
  }

  // Now safe to use `tour` — we know it's defined
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const handleDotClick = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setCurrentImageIndex(index);
  };

  const handleImageClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsModalOpen(true);
  };

  const durationString = `${tour.durationDays}D/${tour.durationNights}N`;
  const originCityDisplay = tour.originCity.charAt(0).toUpperCase() + tour.originCity.slice(1);
  
  const fullTourSlug = `/tours/${tour.slug}`;
  
  const getDisplayPrice = () => {
    if (tour.priceTiers && tour.priceTiers.length > 0) {
      const minPrice = Math.min(...tour.priceTiers.map(p => p.pricePerPerson));
      return `From ${formatIDR(minPrice)}`;
    }
    if (tour.price) {
        return tour.price;
    }
    return 'Price on request';
  };

  const displayPrice = getDisplayPrice();

  return (
    <>
        <div role="article" aria-labelledby={`tour-title-${tour.id}`} className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-[box-shadow,transform] duration-300 ease-in-out transform hover:-translate-y-1 h-full">
            <div className="relative group/carousel overflow-hidden">
                <div 
                    className="relative aspect-[4/3] w-full bg-ink-neutral-200 dark:bg-ink-neutral-700 cursor-pointer"
                    onClick={handleImageClick}
                >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`${tour.label} image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-[transform,opacity] duration-300 ease-in-out group-hover:scale-105 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    />
                ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-3 left-3 z-20 bg-ink-primary/80 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-white/20">
                    <span className="material-symbols-outlined text-sm -ml-0.5">fitness_center</span>
                    <span className="capitalize">{tour.physicality}</span>
                </div>

                <div className="absolute top-3 right-3 z-10 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="material-symbols-outlined text-sm">zoom_in</span>
                </div>

                {images.length > 1 && (
                    <>
                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white transition-opacity hover:bg-black/60 opacity-0 group-hover/carousel:opacity-100"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white transition-opacity hover:bg-black/60 opacity-0 group-hover/carousel:opacity-100"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
                        </button>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => handleDotClick(index, e)}
                                    aria-label={`Go to image ${index + 1}`}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow relative">
                
                {/* Top Metadata Row: Duration, Location, Rating */}
                <div className="flex items-center justify-between mb-3 text-xs font-medium text-ink-neutral-500 dark:text-ink-neutral-400 uppercase tracking-wide">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg text-primary">schedule</span>
                            <span>{durationString}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                            <span>{originCityDisplay}</span>
                        </div>
                    </div>
                    
                    {tour.aggregateRating && (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg text-yellow-400 fill-current">star</span>
                            <span className="text-ink-primary dark:text-white font-bold">{tour.aggregateRating.ratingValue.toFixed(1)}</span>
                            <span className="text-ink-neutral-400 normal-case">({tour.aggregateRating.reviewCount})</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <Link href={fullTourSlug} className="group/title block mb-3">
                    <h3 id={`tour-title-${tour.id}`} className="text-lg font-bold text-ink-primary dark:text-white leading-tight group-hover/title:text-primary transition-colors line-clamp-3">
                        {tour.label}
                    </h3>
                </Link>
                
                <div className="flex-grow"></div>

                {/* Footer: Price Row */}
                <div className="mt-auto pt-4 border-t border-ink-neutral-100 dark:border-ink-neutral-800">
                    <div className="flex items-end justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400 font-medium uppercase tracking-wider">
                                {displayPrice.includes("From") ? "Starts from" : "Price"}
                            </span>
                            <span className="text-3xl font-black tracking-tight text-primary ml-1">
                                {displayPrice.replace('From ', '').replace(' / person', '')}
                            </span>
                            {displayPrice !== 'Price on request' && (
                                <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400">/ person</span>
                            )}
                        </div>
                        
                        <Link 
                            href={fullTourSlug}
                            className="text-primary hover:text-primary/80 transition-colors p-2 -mr-2 rounded-full hover:bg-primary/5 flex items-center justify-center"
                            aria-label="View tour details"
                        >
                             <span className="material-symbols-outlined text-2xl md:text-3xl">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Image Gallery Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={tour.label}>
            <div className="relative w-full h-[60vh] md:h-[70vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                    src={images[currentImageIndex]} 
                    alt={`${tour.label} - view ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain" 
                />
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={handlePrev} 
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
                            aria-label="Previous image"
                        >
                            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-50"
                            aria-label="Next image"
                        >
                            <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    </>
  );
};

export default TourCard;
