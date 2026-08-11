// src/components/website/DestinationTourCard.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { Clock, MapPin } from "lucide-react";
import type { ToursByDestinationItem } from "@/lib/queries/toursByDestination";
import { formatIDR } from "@/utils/formatting";

interface DestinationTourCardProps {
  tour: ToursByDestinationItem;
}

export default function DestinationTourCard({ tour }: DestinationTourCardProps) {
  if (!tour.slug || !tour.name) return null;
  const href = `/${tour.slug}`;
  const durationLabel =
    tour.duration_day != null && tour.duration_night != null
      ? `${tour.duration_day}D/${tour.duration_night}N`
      : null;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[24px] border border-jvto-border bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {tour.banner_url ? (
          <Image
            src={tour.banner_url}
            alt={tour.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={24} className="text-slate-400" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
          {tour.name}
        </p>
        {(durationLabel || tour.start_from != null) && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            {durationLabel && (
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" /> {durationLabel}
              </span>
            )}
            {tour.start_from != null && (
              <span className="font-bold text-jvto-green">
                {formatIDR(tour.start_from)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
