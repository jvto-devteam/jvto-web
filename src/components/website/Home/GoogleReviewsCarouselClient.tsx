"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type {
  PublicReviewApiFeedItem,
  PublicReviewMediaItem,
} from "@/lib/publicContent/types";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays < 1) return "today";
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const TEXT_TRUNCATE_WITH_MEDIA = 150;
const TEXT_TRUNCATE_TEXT_ONLY = 430;

const GoogleGIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Google" role="img">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const VerifiedBadge = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-label="Verified" role="img" className="flex-shrink-0">
    <circle cx="12" cy="12" r="12" fill="#4285F4" />
    <path d="M7 12l3.5 3.5L17 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getMediaImage(media: PublicReviewMediaItem) {
  return media.thumbnailUrl || media.videoUrl || "";
}

function ReviewMediaGrid({ media }: { media: PublicReviewMediaItem[] }) {
  if (media.length === 0) return null;

  const visibleMedia = media.slice(0, 4);
  const remainingCount = Math.max(0, media.length - visibleMedia.length);

  return (
    <div className="mt-2 grid grid-cols-2 gap-1.5">
      {visibleMedia.map((item, index) => {
        const src = getMediaImage(item);
        if (!src) return null;

        return (
          <div
            key={item.id}
            className="relative aspect-square overflow-hidden rounded-[10px] bg-slate-100"
          >
            <Image
              src={src}
              alt={item.thumbnailLabel || "Guest photo from Google review"}
              fill
              sizes="(min-width: 1024px) 170px, 45vw"
              className="object-cover"
            />
            {index === visibleMedia.length - 1 && remainingCount > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-3xl font-black text-white">
                +{remainingCount}
              </div>
            ) : null}
            {item.type === "video" ? (
              <div className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Video
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: PublicReviewApiFeedItem }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.review ?? "";
  const media = review.review_media ?? [];
  const textLimit =
    media.length > 0 ? TEXT_TRUNCATE_WITH_MEDIA : TEXT_TRUNCATE_TEXT_ONLY;
  const canExpand = text.length > textLimit;
  const displayText =
    expanded || !canExpand ? text : `${text.slice(0, textLimit)}…`;

  return (
    <article
      className="flex min-h-[520px] w-[320px] flex-shrink-0 snap-start flex-col rounded-[18px] bg-[#f7f7f9] p-6 text-[#202124] sm:w-[360px] lg:w-[392px]"
      style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.12)" }}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          {review.profile_photo ? (
            <Image
              src={review.profile_photo}
              alt={review.customer_name ?? "Reviewer"}
              width={50}
              height={50}
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#69a341] text-[24px] font-medium text-white">
              {initials(review.customer_name)}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
            <GoogleGIcon />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate text-[18px] font-bold leading-tight text-[#202124]">
              {review.customer_name ?? "Anonymous"}
            </span>
            <VerifiedBadge />
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[15px] text-[#8b8b8b]">{timeAgo(review.date)}</span>
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex gap-0.5"
        aria-label={`${review.star} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-7 w-7 ${i < review.star ? "fill-[#fbbc04] text-[#fbbc04]" : "fill-[#e5e7eb] text-[#e5e7eb]"}`}
            strokeWidth={0}
            aria-hidden="true"
          />
        ))}
      </div>

      <p className="mt-4 text-[20px] leading-[1.38] text-[#202124]">
        {displayText}
        {canExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 whitespace-nowrap text-[20px] font-normal text-[#1a73e8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <ReviewMediaGrid media={media} />
    </article>
  );
}

interface Props {
  reviews: PublicReviewApiFeedItem[];
}

export function GoogleReviewsCarouselClient({ reviews }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    trackRef.current?.scrollBy({
      left: dir === "right" ? 408 : -408,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition-colors hover:bg-black/60 md:flex"
        aria-label="Previous reviews"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.6} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition-colors hover:bg-black/60"
        aria-label="Next reviews"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2.6} />
      </button>
    </div>
  );
}
