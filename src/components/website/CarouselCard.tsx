import React from "react";
import Link from "next/link";
import { Star, Dumbbell, ArrowRight } from "lucide-react";
import { TourPackage } from "@/types";

interface CarouselCardProps {
  tour: TourPackage;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ tour }) => {
  const getDisplayPrice = () => {
    if (tour.priceTiers && tour.priceTiers.length > 0) {
      const minPrice = Math.min(
        ...tour.priceTiers.map((p) => p.pricePerPerson)
      );
      return `${new Intl.NumberFormat("id-ID").format(minPrice)} IDR`;
    }

    if (tour.price) {
      return tour.price
        .replace("Starts from ", "")
        .replace(" / person", "");
    }

    return "On Request";
  };

  const fullTourSlug = `/tours/${tour.slug}`;

  return (
    <div className="snap-start flex-shrink-0 w-80 md:w-96">
      <Link
        href={fullTourSlug}
        className="group rounded-2xl bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden block transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={tour.imageUrl}
            alt={tour.label}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Tour Type */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-ink-accentC/90 text-ink-primary px-2 py-1 rounded-md text-xs font-bold">
            Private Tour
          </div>

          {/* Featured */}
          {tour.isFeatured && (
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-yellow-400/90 text-ink-primary px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <Star className="h-4 w-4" fill="currentColor" aria-hidden="true" />
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-ink-primary dark:text-white truncate">
            {tour.label}
          </h3>

          <p className="mt-1 text-sm text-ink-neutral-500 dark:text-ink-neutral-400 line-clamp-2 min-h-[2.5rem]">
            {tour.description}
          </p>

          {/* Physicality */}
          <div className="mt-2 text-sm text-ink-neutral-500 dark:text-ink-neutral-400 flex items-center gap-1 capitalize">
            <Dumbbell
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
            {tour.physicality}
          </div>

          {/* Price & CTA */}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-lg text-ink-primary dark:text-white">
              {getDisplayPrice()}
            </span>

            <div className="text-ink-accentA font-semibold flex items-center gap-1">
              Learn more
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarouselCard;
