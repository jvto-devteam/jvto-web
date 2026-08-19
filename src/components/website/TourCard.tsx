"use client";

import React from "react";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { ListTourPackage } from "@/types";
import { formatIDR } from "@/utils/formatting";
import { Clock, MapPin, ArrowRight } from "lucide-react";

interface TourCardProps {
  tour?: ListTourPackage;
  isNewTab?: boolean;
  isLoading?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const TourCard: React.FC<TourCardProps> = ({ tour, isNewTab, headingLevel = 3 }) => {
  if (!tour) return null;

  const bannerImage =
    tour.images && Array.isArray(tour.images) && tour.images.length > 0
      ? {
          url: tour.images[0].url,
          alt: tour.images[0].alt?.trim() || tour.banner?.alt || tour.name || "Tour package",
        }
      : tour.banner?.url
        ? { url: tour.banner.url, alt: tour.banner.alt || tour.name }
        : { url: "/images/fallback-banner.jpg", alt: tour.name || "Tour package" };

  const durationString = `${tour.duration.day}D / ${tour.duration.night}N`;
  const fullTourSlug = `/${tour.slug}`;
  const target = isNewTab ? "_blank" : "_self";
  const Tag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <div
      role="article"
      aria-labelledby={`tour-title-${tour.id}`}
      className="group flex flex-col rounded-largecards bg-white border border-jvto-border overflow-hidden card-jvto h-full"
    >
      {/* Image */}
      <Link
        target={target}
        href={fullTourSlug}
        prefetch={false}
        aria-label={tour.name}
        className="relative block overflow-hidden flex-shrink-0"
      >
        <div className="relative aspect-[4/3] w-full bg-jvto-off">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt}
            fill
            sizes="(max-width: 640px) 80vw, 350px"
            quality={64}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Physicality badge */}
        {tour.physicality && (
          <div
            aria-hidden="true"
            className="absolute top-3 left-3 z-20 bg-jvto-navy/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-micro font-semibold uppercase tracking-[0.12em]"
          >
            {tour.physicality}
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-micro text-jvto-muted font-semibold uppercase tracking-[0.08em]">
            <Clock className="w-3 h-3 text-jvto-orange flex-shrink-0" />
            <span>{durationString}</span>
          </div>
          <span className="text-jvto-border text-micro">·</span>
          <div className="flex items-center gap-1 text-micro text-jvto-muted font-semibold uppercase tracking-[0.08em]">
            <MapPin className="w-3 h-3 text-jvto-orange flex-shrink-0" />
            <span>{tour.startDestination}</span>
          </div>
        </div>

        {/* Title */}
        <Link
          target={target}
          href={fullTourSlug}
          prefetch={false}
          aria-label={tour.name}
          className="block mb-4 flex-grow"
        >
          <Tag
            id={`tour-title-${tour.id}`}
            className="font-display text-body-sm font-black text-jvto-navy line-clamp-2 group-hover:text-jvto-orange-ink transition-colors"
          >
            {tour.name}
          </Tag>
        </Link>

        {/* Price + CTA */}
        <div className="border-t border-jvto-border pt-4 mt-auto">
          <span className="block text-micro text-jvto-muted font-semibold uppercase tracking-[0.14em] mb-1">
            Starts from
          </span>
          <div className="flex items-center justify-between gap-2">
            <div>
              <span
                className="font-display text-body-lg font-black text-jvto-navy tracking-tight"
              >
                {formatIDR(tour.startFrom)}
              </span>
              <span className="text-micro text-jvto-muted ml-1">/ person</span>
            </div>
            <Link
              target={target}
              href={fullTourSlug}
              prefetch={false}
              aria-label={`View ${tour.name}`}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-jvto-orange flex items-center justify-center hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
