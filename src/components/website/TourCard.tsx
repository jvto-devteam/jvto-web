'use client';

import React, { useState } from 'react';
import Image from 'next/image';           // ← PAKAI NEXT/IMAGE
import Link from 'next/link';
import { ListTourPackage } from '@/types';
import { formatIDR } from '@/utils/formatting';
import Modal from './Modal';

// Skeleton tetap sama
// const TourCardSkeleton: React.FC = () => { /* ... sama seperti sebelumnya ... */ };

interface TourCardProps {
  tour?: ListTourPackage;
  isLoading?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PASTIKAN images selalu array yang valid + fallback
  const images = tour?.images && Array.isArray(tour.images) && tour.images.length > 0
    ? tour.images
    : tour?.banner?.url
      ? [{ url: tour.banner.url, alt: tour.banner.alt || tour.name }]
      : [{ url: '/images/fallback-banner.jpg', alt: tour?.name || 'Tour package' }];

  // if (isLoading || !tour) return <TourCardSkeleton />;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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

  const currentImg = images[currentImageIndex];

  const durationString = `${tour.duration.day}D/${tour.duration.night}N`;
  const originCityDisplay = tour.startDestination;
  const fullTourSlug = `/tours/${tour.slug}`;
  const displayPrice = `From ${formatIDR(tour.startFrom)}`;

  return (
    <>
      <div
        role="article"
        aria-labelledby={`tour-title-${tour.id}`}
        className="group flex flex-col rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full"
      >
        {/* GAMBAR UTAMA – NEXT/IMAGE */}
        <div className="relative group/carousel overflow-hidden" onClick={handleImageClick}>
          <div className="relative aspect-[4/3] w-full bg-ink-neutral-200 dark:bg-ink-neutral-700 cursor-pointer">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0}
              />
            ))}
          </div>

          {/* Gradient overlay + badge + nav sama seperti sebelumnya */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3 z-20 bg-ink-primary/80 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-white/20">
            <span className="material-symbols-outlined text-sm">fitness_center</span>
            <span className="capitalize">{tour.physicality}</span>
          </div>

          {images.length > 1 && (
            <>
              {/* Arrow kiri */}
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
              </button>

              {/* Arrow kanan */}
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleDotClick(index, e)}
                    aria-label={`Go to image ${index + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bagian bawah card (text + harga) – tidak berubah */}
        <div className="p-5 flex flex-col flex-grow">
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
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg text-yellow-400 fill-current">star</span>
              <span className="text-ink-primary dark:text-white font-bold">49</span>
              <span className="text-ink-neutral-400 normal-case">(122)</span>
            </div>
          </div>

          <Link href={fullTourSlug} className="group/title block mb-3">
            <h3
              id={`tour-title-${tour.id}`}
              className="text-lg font-bold text-ink-primary dark:text-white leading-tight group-hover/title:text-primary transition-colors line-clamp-3"
            >
              {tour.label || tour.name}
            </h3>
          </Link>

          <div className="flex-grow" />

          <div className="mt-auto pt-4 border-t border-ink-neutral-100 dark:border-ink-neutral-800">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400 font-medium uppercase tracking-wider">
                  Starts from
                </span>
                <span className="text-3xl font-black tracking-tight text-primary ml-1">
                  {formatIDR(tour.startFrom)}
                </span>
                <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400">/ person</span>
              </div>

              <Link
                href={fullTourSlug}
                className="text-primary hover:text-primary/80 transition-colors p-2 -mr-2 rounded-full hover:bg-primary/5"
                aria-label="View tour details"
              >
                <span className="material-symbols-outlined text-3xl">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL – JUGA PAKAI NEXT/IMAGE */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={tour.label || tour.name}>
        <div className="relative w-full h-[60vh] md:h-[80vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={currentImg.url}
            alt={currentImg.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 text-white hover:bg-black/80 transition z-50"
              >
                <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 text-white hover:bg-black/80 transition z-50"
              >
                <span className="material-symbols-outlined text-3xl">arrow_forward_ios</span>
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm font-medium">
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