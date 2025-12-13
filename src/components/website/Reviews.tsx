// FIX: Implemented the Reviews component to resolve the 'not a module' error in App.tsx.
import React from "react";
import Image from "next/image";
import { SectionCopy, Review } from "@/types";
import { reviews } from "@/data";
import {
  Globe,
  Map,
  BadgeCheck,
  ThumbsUp,
  Star,
  LucideIcon,
} from "lucide-react";

/**
 * Platform icon + style map
 */
const platformMap: Record<
  Review["platform"],
  {
    icon: LucideIcon;
    label: string;
    color: string;
  }
> = {
  google: {
    icon: Map,
    label: "Google",
    color: "text-blue-500",
  },
  tripadvisor: {
    icon: Globe,
    label: "TripAdvisor",
    color: "text-green-500",
  },
  trustpilot: {
    icon: BadgeCheck,
    label: "Trustpilot",
    color: "text-teal-500",
  },
  facebook: {
    icon: ThumbsUp,
    label: "Facebook",
    color: "text-indigo-600",
  },
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const PlatformDisplay: React.FC = () => {
    const platform = platformMap[review.platform];

    if (!platform) return null;

    const Icon = platform.icon;

    return (
      <div
        className={`flex items-center gap-1.5 text-xs mt-1.5 ${platform.color} dark:opacity-80`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="font-semibold">on {platform.label}</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-background-dark p-6 rounded-2xl shadow-card hover:shadow-cardHover h-full flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
      
      {/* Title */}
      <h3
        className="font-bold text-lg text-ink-primary dark:text-white line-clamp-2"
        title={review.title}
      >
        {review.title}
      </h3>

      {/* Rating */}
      <div className="flex items-center mt-2">
        {[...Array(review.rating)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-5 h-5 text-yellow-400 fill-yellow-400"
            aria-hidden="true"
          />
        ))}
        {[...Array(5 - review.rating)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="w-5 h-5 text-ink-neutral-300 dark:text-ink-neutral-600"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review text */}
      <div className="relative mt-4 flex-grow">
        <span className="absolute -top-2 -left-3 text-6xl text-ink-neutral-200 dark:text-ink-neutral-700 font-serif opacity-50 z-0">
          “
        </span>
        <p className="text-ink-neutral-700 dark:text-ink-neutral-200 relative z-10">
          {review.text}
        </p>
      </div>

      {/* Author */}
      <div className="mt-auto pt-4 flex items-center">
        <div className="relative w-12 h-12 rounded-full mr-4 overflow-hidden flex-shrink-0">
          <Image
            src={review.avatar}
            alt={review.name}
            width={48}
            height={48}
            className="object-cover"
            sizes="48px"
            quality={85}
          />
        </div>

        <div>
          <p className="font-bold text-ink-primary dark:text-white">
            {review.name}
          </p>
          <p className="text-sm text-ink-neutral-500 dark:text-ink-neutral-200">
            {review.location} · {review.date}
          </p>
          <PlatformDisplay />
        </div>
      </div>
    </div>
  );
};

interface ReviewsProps {
  copy: SectionCopy;
}

const Reviews: React.FC<ReviewsProps> = ({ copy }) => {
  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-ink-primary">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-wide uppercase">
            {copy.overline}
          </p>
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">
            {copy.title}
          </h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">
            {copy.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
