"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { PublicReviewApiFeedItem } from "@/lib/publicContent/types";

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

const TRUNCATE = 200;

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

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "#E5E7EB"} aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function ReviewCard({ review }: { review: PublicReviewApiFeedItem }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.review ?? "";
  const canExpand = text.length > TRUNCATE;
  const displayText =
    expanded || !canExpand ? text : `${text.slice(0, TRUNCATE)}…`;

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 w-[272px] flex-shrink-0 snap-start"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.10)" }}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {review.profile_photo ? (
            <Image
              src={review.profile_photo}
              alt={review.customer_name ?? "Reviewer"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0D1B2A] flex items-center justify-center text-white text-[13px] font-bold">
              {initials(review.customer_name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-[13px] text-[#111827] truncate max-w-[130px] leading-tight">
              {review.customer_name ?? "Anonymous"}
            </span>
            <VerifiedBadge />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-[#9ca3af]">{timeAgo(review.date)}</span>
            <GoogleGIcon />
          </div>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5" aria-label={`${review.star} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < review.star} />
        ))}
      </div>

      {/* Review text */}
      <p className="text-[13px] text-[#374151] leading-relaxed">
        {displayText}
        {canExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-[#4285F4] text-[12px] font-medium hover:underline focus-visible:outline-none"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>
    </div>
  );
}

interface Props {
  reviews: PublicReviewApiFeedItem[];
}

export function GoogleReviewsCarouselClient({ reviews }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    trackRef.current?.scrollBy({ left: dir === "right" ? 288 : -288, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Navigation arrows — top-right */}
      <div className="absolute -top-14 right-0 flex gap-2 z-10">
        <button
          onClick={() => scroll("left")}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Previous reviews"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Next reviews"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      >
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
}
