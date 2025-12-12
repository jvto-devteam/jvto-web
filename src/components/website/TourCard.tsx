"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import { formatIDR } from "@/utils/formatting";
import Modal from "./Modal";
import { notFound } from "next/navigation";
import { 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight 
} from "lucide-react";

// Skeleton tetap sama
// const TourCardSkeleton: React.FC = () => { /* ... sama seperti sebelumnya ... */ };

interface TourCardProps {
  tour?: ListTourPackage;
  isLoading?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, isLoading }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!tour) return notFound();

  // PASTIKAN images selalu array yang valid + fallback
  const images =
    tour?.images && Array.isArray(tour.images) && tour.images.length > 0
      ? tour.images
      : tour?.banner?.url
      ? [{ url: tour.banner.url, alt: tour.banner.alt || tour.name }]
      : [
          {
            url: "/images/fallback-banner.jpg",
            alt: tour?.name || "Tour package",
          },
        ];

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
  const fullTourSlug = tour.slug;
  const displayPrice = `From ${formatIDR(tour.startFrom)}`;

  return (
    <>
      <div
        role="article"
        aria-labelledby={`tour-title-${tour.id}`}
        className="group flex flex-col rounded bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full shadow"
      >
        {/* GAMBAR UTAMA – NEXT/IMAGE */}
        <div
          className="relative group/carousel overflow-hidden"
          onClick={handleImageClick}
        >
          <div className="relative aspect-[4/3] w-full bg-ink-neutral-200 dark:bg-ink-neutral-700 cursor-pointer">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                priority={index === 0}
              />
            ))}
          </div>

          {/* Gradient overlay + badge + nav sama seperti sebelumnya */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge Physicality */}
          <div className="absolute top-3 left-3 z-20 bg-lime-600/50 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-white/20">
            <Dumbbell className="w-3.5 h-3.5" />
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
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Arrow kanan */}
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleDotClick(index, e)}
                    aria-label={`Go to image ${index + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bagian bawah card (text + harga) */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3 text-xs font-medium text-ink-neutral-500 dark:text-ink-neutral-400 uppercase tracking-wide">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-lime-600" />
                <span>{durationString}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span>{originCityDisplay}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Star dengan fill agar solid */}
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-ink-primary dark:text-white font-bold">
                49
              </span>
              <span className="text-ink-neutral-400 normal-case">(122)</span>
            </div>
          </div>

          <Link href={fullTourSlug} className="group/title block mb-3">
            <h3
              id={`tour-title-${tour.id}`}
              className="text-lg font-bold text-ink-primary dark:text-white leading-tight group-hover/title:text-lime-600 transition-colors line-clamp-2"
            >
              {tour.name}
            </h3>
          </Link>

          {/* <div className="flex-grow" /> */}
          <hr className="border-gray-200 my-3" />
          <div>
            <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400 font-medium uppercase tracking-wider">
              Starts from
            </span>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-lime-600">
                  {formatIDR(tour.startFrom)}
                </span>
                <div>
                  <span className="text-sm text-nowrap text-ink-neutral-500 dark:text-ink-neutral-400">
                    / person
                  </span>
                </div>
              </div>

              <Link
                href={fullTourSlug}
                className="text-lime-600 hover:text-lime-600/80 transition-colors p-2 -mr-2 rounded-full hover:bg-primary/5"
                aria-label="View tour details"
              >
                <ArrowRight className="w-7 h-7" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL – JUGA PAKAI NEXT/IMAGE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={tour.name}
      >
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
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 text-white hover:bg-black/80 transition z-50"
              >
                <ChevronRight className="w-8 h-8" />
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