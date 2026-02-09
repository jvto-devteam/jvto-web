"use client";

import { useMemo, useRef, useState } from "react";
import { Star, Quote, Users, ShieldCheck } from "lucide-react";

type Platform = "Google" | "Trustpilot" | "TripAdvisor";

type Review = {
  id: string;
  platform: Platform;
  rating: number; // 1..5
  title: string;
  text: string;
  author: string;
  country?: string;
  date: string; // display text (dummy)
  crewMentions?: string[]; // e.g. ["Rizal", "Arif"]
};

const TABS: Platform[] = ["Google", "Trustpilot", "TripAdvisor"];

// DUMMY DATA (replace later with real reviews)
const REVIEWS: Review[] = [
  // Google
  {
    id: "g-1",
    platform: "Google",
    rating: 5,
    title: "Disciplined crew, no outsourcing",
    text: "Pickup was on time. Briefing was clear. Same JVTO team handled everything end-to-end — driver Arif and escort Rizal were consistently professional.",
    author: "Kevin M.",
    country: "Singapore",
    date: "Jan 2025",
    crewMentions: ["Arif", "Rizal"],
  },
  {
    id: "g-2",
    platform: "Google",
    rating: 5,
    title: "Calm under pressure at Ijen",
    text: "Conditions changed fast but the JVTO crew stayed calm and controlled. Our Ijen guide Bayu managed pacing and safety without rushing.",
    author: "Amanda L.",
    country: "Australia",
    date: "Feb 2025",
    crewMentions: ["Bayu"],
  },
  {
    id: "g-3",
    platform: "Google",
    rating: 5,
    title: "Standardized operation, not a random open trip",
    text: "No confusion, no last-minute changes. The team followed a clear protocol. You can feel this is a real operator with real SOP.",
    author: "Wei T.",
    country: "Malaysia",
    date: "Mar 2025",
    crewMentions: ["Rizal"],
  },

  // Trustpilot
  {
    id: "tp-1",
    platform: "Trustpilot",
    rating: 5,
    title: "Accountable company, consistent standards",
    text: "Everything felt structured and accountable. We met the same JVTO crew across multiple days — not outsourced freelancers rotated each leg.",
    author: "Sophie K.",
    country: "UK",
    date: "Nov 2024",
    crewMentions: ["Arif"],
  },
  {
    id: "tp-2",
    platform: "Trustpilot",
    rating: 5,
    title: "Professional handling and transparent communication",
    text: "Clear communication, transparent inclusions, and no hidden charges. The escort guide Rizal stayed proactive and organized throughout.",
    author: "Daniel R.",
    country: "Germany",
    date: "Dec 2024",
    crewMentions: ["Rizal"],
  },

  // TripAdvisor
  {
    id: "ta-1",
    platform: "TripAdvisor",
    rating: 5,
    title: "Guide quality shows in the details",
    text: "Our guide Bayu didn’t just ‘lead’ — he explained what was happening and why we were adjusting timing. You can tell he’s JVTO crew, not a subcontractor.",
    author: "Chloe P.",
    country: "France",
    date: "Oct 2024",
    crewMentions: ["Bayu"],
  },
  {
    id: "ta-2",
    platform: "TripAdvisor",
    rating: 5,
    title: "End-to-end execution by the same team",
    text: "Same driver and escort from pickup to drop-off. That consistency matters in an active volcanic environment. JVTO felt like a single operation, not a marketplace.",
    author: "Jason N.",
    country: "USA",
    date: "Sep 2024",
    crewMentions: ["Arif"],
  },
];

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
        <Star key={i} className="w-4 h-4 fill-current" />
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

export default function TriangulationReviews() {
  const [active, setActive] = useState<Platform>("Google");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(
    () => REVIEWS.filter((r) => r.platform === active),
    [active],
  );

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card='true']");
    const step = (card?.offsetWidth ?? 360) + 16; // card + gap
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const crewNames = useMemo(() => {
    const set = new Set<string>();
    for (const r of REVIEWS) r.crewMentions?.forEach((n) => set.add(n));
    return Array.from(set).slice(0, 6);
  }, []);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm w-full md:w-auto">
          {TABS.map((t) => {
            const isActive = t === active;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActive(t)}
                className={[
                  "h-11 px-5 rounded-lg font-bold text-sm transition-all w-full md:w-auto",
                  isActive
                    ? "bg-[#111827] text-white shadow-sm"
                    : "bg-transparent text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Controls (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm font-bold text-sm text-slate-700 transition-all"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm font-bold text-sm text-slate-700 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* Swipeable carousel */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
        aria-label={`${active} reviews carousel`}
      >
        {items.map((r) => {
          const acc = platformAccent(r.platform);
          return (
            <article
              key={r.id}
              data-review-card="true"
              className="snap-start shrink-0 w-[86%] sm:w-[520px] bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-2px_rgba(17,24,39,0.05)] hover:shadow-[0_20px_40px_-5px_rgba(17,24,39,0.1)] transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${acc.top}`} />

              <div className="p-8">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {r.platform}
                    </p>
                    <h3 className="text-xl font-bold text-[#111827] mt-1 leading-snug">
                      {r.title}
                    </h3>
                  </div>
                  <div className="text-slate-300">
                    <Quote className="w-6 h-6" />
                  </div>
                </div>

                <div className="mb-6">
                  <Stars rating={r.rating} accentClass={acc.stars} />
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {r.text}
                </p>

                {r.crewMentions && r.crewMentions.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {r.crewMentions.map((n) => (
                      <span
                        key={n}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A6CE39]/10 border border-[#A6CE39]/20 text-xs font-bold text-[#111827]"
                      >
                        <Users className="w-3.5 h-3.5 text-[#8ab51a]" />
                        JVTO Crew: {n}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#111827]">
                      {r.author}
                      {r.country ? (
                        <span className="text-slate-400 font-semibold">
                          {" "}
                          · {r.country}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">{r.date}</p>
                  </div>

                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                    Dummy Review
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile hint */}
      <p className="mt-4 text-center text-xs text-slate-500 md:hidden">
        Swipe horizontally to read more reviews.
      </p>
    </div>
  );
}
