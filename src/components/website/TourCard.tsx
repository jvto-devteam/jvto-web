"use client";

import React from "react";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { ListTourPackage } from "@/types";
import DifficultyBadge from "@/components/website/DifficultyBadge";

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
      ? { url: tour.images[0].url, alt: tour.images[0].alt?.trim() || tour.banner?.alt || tour.name }
      : tour.banner?.url
        ? { url: tour.banner.url, alt: tour.banner.alt || tour.name }
        : { url: "/images/fallback-banner.jpg", alt: tour.name };

  const durationString = `${tour.duration.day}D · ${tour.duration.night}N`;
  const price = `From IDR ${new Intl.NumberFormat("id-ID").format(tour.startFrom)}`;
  const fullTourSlug = `/${tour.slug}`;
  const target = isNewTab ? "_blank" : "_self";
  const Tag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const highlights = (tour.keyExperiences ?? []).slice(0, 2);

  return (
    <div
      role="article"
      aria-labelledby={`tour-title-${tour.id}`}
      className="bg-white rounded-2xl shadow-sm border border-jvto-navy/5 overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <Link
        target={target}
        href={fullTourSlug}
        prefetch={false}
        aria-label={tour.name}
        className="relative block flex-shrink-0"
      >
        <div className="relative h-44 w-full bg-jvto-off">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt}
            fill
            sizes="(max-width: 640px) 80vw, 350px"
            quality={64}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-wide">
              {durationString}
            </span>
            {tour.physicality && (
              <DifficultyBadge physicality={tour.physicality} />
            )}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link target={target} href={fullTourSlug} prefetch={false}>
          <Tag
            id={`tour-title-${tour.id}`}
            className="font-bold text-jvto-navy text-base leading-snug line-clamp-2"
          >
            {tour.name}
          </Tag>
        </Link>

        <p className="font-black text-jvto-navy text-lg">{price}</p>

        {highlights.length > 0 && (
          <ul className="flex flex-col gap-1">
            {highlights.map((h, i) => (
              <li key={i} className="text-xs text-jvto-navy/60 flex gap-1">
                <span className="flex-shrink-0">·</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <Link
          target={target}
          href={fullTourSlug}
          prefetch={false}
          className="text-jvto-green font-bold text-sm mt-auto hover:underline"
        >
          See Details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

export default TourCard;
