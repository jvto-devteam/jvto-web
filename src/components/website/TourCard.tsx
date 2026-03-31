"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ListTourPackage } from "@/types";
import { formatIDR } from "@/utils/formatting";
import { notFound } from "next/navigation";
import { Dumbbell, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

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
  const routeLabel =
    tour.endDestination && tour.endDestination !== tour.startDestination
      ? `${tour.startDestination} to ${tour.endDestination}`
      : `Round trip from ${tour.startDestination}`;
  const highlightPreview = tour.highlights.slice(0, 2);

  return (
    <div
      role="article"
      aria-labelledby={`tour-title-${tour.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#dce4c7] bg-white shadow-[0_20px_40px_rgba(35,48,18,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(35,48,18,0.1)] dark:bg-background-dark"
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

        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-white/20 bg-lime-600/50 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            <Dumbbell className="h-3.5 w-3.5" />
            <span className="capitalize">{tour.physicality}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-white/20 bg-black/45 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Private tour</span>
          </div>
        </div>
      </Link>

      {/* CARD BODY */}
      <div className="flex flex-grow flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-ink-neutral-500 dark:text-ink-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-lime-600" />
              <span>{durationString}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-lime-600" />
              <span>{tour.startDestination}</span>
            </div>
          </div>
          <div className="rounded-full border border-[#dce4c7] bg-[#f7faef] px-2.5 py-1 text-[11px] font-bold normal-case text-jvto-dark">
            Proof before payment
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
            className="line-clamp-2 text-lg font-bold leading-tight text-ink-primary transition-colors group-hover/title:text-lime-600"
          >
            {tour.name}
          </h3>
        </Link>

        <p className="mb-3 text-sm font-medium text-ink-neutral-500">
          {routeLabel}
        </p>

        {highlightPreview.length > 0 ? (
          <ul className="mb-5 space-y-2 text-sm leading-relaxed text-ink-neutral-600">
            {highlightPreview.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-600" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="my-3 border-t border-[#e8edd9]" />

        <div className="mt-auto">
          <span className="text-xs font-medium uppercase tracking-wider text-ink-neutral-500 dark:text-ink-neutral-400">
            Starts from
          </span>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-lime-600">
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
              className="text-lime-600 hover:text-lime-600/80 transition-colors p-2 -mr-2 rounded-full hover:bg-primary/5"
            >
              <ArrowRight className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
