"use client";

import { useMemo, useRef, useState } from "react";
import { Star, Quote, Users, ShieldCheck } from "lucide-react";

type Platform = "Google" | "Trustpilot" | "TripAdvisor";

type Crew = {
  id: string;
  name: string;
  type: string;
  photo_url: string | null;
  tags: string;
};

type Review = {
  id: string;
  customer_name: string;
  platform: Platform;
  date: string | null;
  star: number;
  review: string;
  url?: string;
  profile_photo: string | null;
  package_id: string | null;
  crews: Crew[];
  has_internal_crew: boolean;
};

const TABS: Platform[] = ["Google", "Trustpilot", "TripAdvisor"];

function Stars({
  rating,
  accentClass,
}: {
  rating: number;
  accentClass: string;
}) {
  return (
    <div className={`flex items-center gap-1 ${accentClass}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-current" : "fill-none stroke-current opacity-30"
          }`}
        />
      ))}
      <span className="sr-only">{rating} out of 5</span>
    </div>
  );
}

function platformAccent(platform: Platform) {
  if (platform === "Google")
    return { top: "bg-[#4285f4]", stars: "text-[#F4B400]" };
  if (platform === "Trustpilot")
    return { top: "bg-[#00b67a]", stars: "text-[#00b67a]" };
  return { top: "bg-[#34e0a1]", stars: "text-[#34e0a1]" }; // TripAdvisor
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function TriangulationReviews({
  reviews,
}: {
  reviews: Review[];
}) {
  const [active, setActive] = useState<Platform>("Google");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () => reviews.filter((r) => r.platform === active),
    [reviews, active],
  );

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card='true']");
    const step = (card?.offsetWidth ?? 360) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const crewNames = useMemo(() => {
    const set = new Set<string>();
    for (const r of reviews) {
      r.crews?.forEach((c) => set.add(c.name));
    }
    return Array.from(set).slice(0, 6);
  }, [reviews]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="inline-flex rounded-sm border border-slate-200 bg-white p-1 shadow-sm w-full md:w-auto">
          {TABS.map((t) => {
            const isActive = t === active;
            const count = reviews.filter((r) => r.platform === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActive(t)}
                className={[
                  "h-11 px-5 rounded-sm font-bold text-sm transition-all w-full md:w-auto flex items-center justify-center gap-2",
                  isActive
                    ? "bg-[#111827] text-white shadow-sm"
                    : "bg-transparent text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {t}
                {/* <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span> */}
              </button>
            );
          })}
        </div>

        {/* Controls (desktop) */}
        {items.length > 0 && (
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="h-11 px-4 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 shadow-sm font-bold text-sm text-slate-700 transition-all"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="h-11 px-4 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 shadow-sm font-bold text-sm text-slate-700 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Swipeable carousel */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
        aria-label={`${active} reviews carousel`}
      >
        {items.length > 0 ? (
          items.map((r) => {
            const acc = platformAccent(r.platform);
            return (
              <article
                key={r.id}
                data-review-card="true"
                className="snap-start shrink-0 w-[86%] sm:w-[520px] bg-white rounded-sm border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-all relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${acc.top}`}
                />

                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {r.platform}
                      </p>
                      <h3 className="text-xl font-bold text-[#111827] mt-1 leading-snug line-clamp-1">
                        {r.customer_name}
                      </h3>
                    </div>
                    {r.profile_photo ? (
                      <img
                        src={r.profile_photo}
                        alt={r.customer_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        referrerPolicy="no-referrer" // React props pakai camelCase
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Fallback kalau tetap error
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const initials = r.customer_name
                              .charAt(0)
                              .toUpperCase();
                            parent.innerHTML += `
        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
          <span class="text-sm font-bold text-slate-600">${initials}</span>
        </div>
      `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                        <Quote className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <Stars rating={r.star} accentClass={acc.stars} />
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                    {r.review}
                  </p>

                  {r.crews && r.crews.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {r.crews.slice(0, 3).map((crew) => (
                        <span
                          key={crew.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A6CE39]/10 border border-[#A6CE39]/20 text-xs font-bold text-[#111827]"
                        >
                          <Users className="w-3.5 h-3.5 text-[#8ab51a]" />
                          {crew.type}: {crew.name}
                        </span>
                      ))}
                      {r.crews.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          +{r.crews.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#111827]">
                        {r.customer_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(r.date)}
                      </p>
                    </div>

                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded hover:bg-[#A6CE39] hover:text-white hover:border-[#A6CE39] transition-colors"
                      >
                        View Original
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                        Verified Review
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="w-full py-16 text-center">
            <p className="text-slate-500 text-sm">
              No reviews available for {active}
            </p>
          </div>
        )}
      </div>

      {/* Mobile hint */}
      {items.length > 0 && (
        <p className="mt-4 text-center text-xs text-slate-500 md:hidden">
          Swipe horizontally to read more reviews.
        </p>
      )}
    </div>
  );
}
