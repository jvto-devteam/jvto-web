"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import { formatIDR } from "@/utils/formatting";
import { notFound } from "next/navigation";
import { Dumbbell, Clock, MapPin, Star, ArrowRight } from "lucide-react";

interface TourCardProps {
  tour?: ListTourPackage;
  isNewTab?: boolean;
  isLoading?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab }) => {
  if (!tour) return notFound();

  const bannerImage =
    tour?.images && Array.isArray(tour.images) && tour.images.length > 0
      ? {
          url: tour.images[0].url,
          alt:
            tour.images[0].alt?.trim() ||
            tour.banner?.alt ||
            tour.name ||
            "Tour package",
        }
      : tour?.banner?.url
        ? { url: tour.banner.url, alt: tour.banner.alt || tour.name }
        : {
            url: "/images/fallback-banner.jpg",
            alt: tour?.name || "Tour package",
          };

  const durationString = `${tour.duration.day}D/${tour.duration.night}N`;
  const fullTourSlug = "/" + tour.slug;
  const tourLinkLabel = `View tour details for ${tour.name}`;

  return (
    <div
      role="article"
      aria-labelledby={`tour-title-${tour.id}`}
      className="group flex flex-col rounded bg-white dark:bg-background-dark shadow-card hover:shadow-cardHover overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full shadow"
    >
      {/* BANNER IMAGE */}
      <Link
        target={isNewTab ? "_blank" : "_self"}
        href={fullTourSlug}
        aria-label={tourLinkLabel}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-[4/3] w-full bg-ink-neutral-200 dark:bg-ink-neutral-700">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge Physicality */}
        <div className="absolute top-3 left-3 z-20 bg-jvto-green/80/50 text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm border border-white/20">
          <Dumbbell className="w-3.5 h-3.5" />
          <span className="capitalize">{tour.physicality}</span>
        </div>
      </Link>

      {/* CARD BODY */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3 text-xs font-medium text-ink-neutral-500 dark:text-ink-neutral-400 uppercase tracking-wide">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-jvto-green" />
              <span>{durationString}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-jvto-green" />
              <span>{tour.startDestination}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-ink-primary font-bold">49</span>
            <span className="text-ink-neutral-400 normal-case">(122)</span>
          </div>
        </div>

        <Link
          target={isNewTab ? "_blank" : "_self"}
          href={fullTourSlug}
          aria-label={tourLinkLabel}
          className="group/title block mb-3"
        >
          <h3
            id={`tour-title-${tour.id}`}
            className="text-lg font-bold text-ink-primary leading-tight group-hover/title:text-jvto-green transition-colors line-clamp-2"
          >
            {tour.name}
          </h3>
        </Link>

        <hr className="border-gray-200 my-3" />

        <div>
          <span className="text-xs text-ink-neutral-500 dark:text-ink-neutral-400 font-medium uppercase tracking-wider">
            Starts from
          </span>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-jvto-green">
                {formatIDR(tour.startFrom)}
              </span>
              <span className="text-sm text-nowrap text-ink-neutral-500 dark:text-ink-neutral-400">
                / person
              </span>
            </div>

            <Link
              target={isNewTab ? "_blank" : "_self"}
              href={fullTourSlug}
              aria-label={tourLinkLabel}
              className="text-jvto-green hover:text-jvto-green/80 transition-colors p-2 -mr-2 rounded-full hover:bg-primary/5"
            >
              <ArrowRight className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
