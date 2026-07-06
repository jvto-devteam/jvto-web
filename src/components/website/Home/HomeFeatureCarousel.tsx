"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Users,
  BadgeCheck,
  HeartPulse,
  FileCheck2,
  Map,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  id: string;
  label: string;
  Icon: LucideIcon;
  caption: string;
}

const FEATURES: Feature[] = [
  {
    id: "police",
    label: "Police-Led",
    Icon: ShieldCheck,
    caption:
      "Founder Bripka Agung Sambuko is an active officer of the Indonesian Tourist Police (Ditpamobvit, East Java). Every route, rule, and safety boundary answers to police protocol — not a marketing brief.",
  },
  {
    id: "private",
    label: "100% Private",
    Icon: Users,
    caption:
      "Every tour is private by default — your vehicle, your driver, your guide. No shared transfers, no schedule compromises with strangers, no last-minute logistics surprises.",
  },
  {
    id: "inclusive",
    label: "All-Inclusive",
    Icon: BadgeCheck,
    caption:
      "Entrance fees, the Bromo 4WD jeep, accommodation, breakfast, gas masks, and transfers are bundled in writing — published before you pay. No surprise local payments.",
  },
  {
    id: "health",
    label: "Ijen Health-Screening",
    Icon: HeartPulse,
    caption:
      "A recent health certificate is mandatory for every Ijen guest under BBKSDA SE.1658/KSA.9/2024 — we coordinate the clinic before the hike, with Dr. Ahmad Irwandanu, SIP-verified at satusehat.kemkes.go.id (Kemenkes RI).",
  },
  {
    id: "licenses",
    label: "Verifiable Licenses",
    Icon: FileCheck2,
    caption:
      "NIB 1102230032918 at oss.go.id, HPWKI specialist guide training, BBKSDA park clearance, ISIC Provider 259268 — every credential is independently checkable.",
  },
  {
    id: "planb",
    label: "Plan B When Conditions Change",
    Icon: Map,
    caption:
      "Bromo and Ijen can both close without warning. Our written Plan-B framework gives you an alternative route — briefed in advance, not improvised at the gate. You don't lose a day.",
  },
];

const AUTO_INTERVAL_MS = 4200;

function FeatureCarouselWidget() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = FEATURES.length;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, total]);

  const active = FEATURES[current];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-8 md:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Chip stack */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
        {FEATURES.map((f, i) => {
          const isActive = i === current;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-pressed={isActive}
              className={`flex-shrink-0 flex items-center gap-3 rounded-sm px-4 py-3 text-left text-sm font-bold transition-all duration-300 border ${
                isActive
                  ? "bg-jvto-navy text-white border-jvto-navy"
                  : "bg-white text-jvto-muted border-jvto-border hover:border-jvto-navy/30 hover:text-jvto-navy"
              }`}
            >
              <f.Icon
                size={18}
                className={isActive ? "text-jvto-lime" : "text-jvto-muted"}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap md:whitespace-normal">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active card */}
      <div
        key={active.id}
        className="relative rounded-sm bg-jvto-navy text-white p-8 md:p-12 flex flex-col justify-end min-h-[280px] md:min-h-[340px] overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(140,198,63,0.18), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Live · {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 mb-4">
            <active.Icon size={14} className="text-jvto-lime" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wide">
              {String(current + 1).padStart(2, "0")} · {active.label}
            </span>
          </div>
          <p className="text-base md:text-lg font-light leading-relaxed max-w-[52ch] text-white/90">
            {active.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeatureCarousel() {
  return (
    <section aria-labelledby="apart-heading" className="bg-jvto-off py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10 md:mb-14">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 04
            </p>
            <h2
              id="apart-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Six things that <span className="text-jvto-orange">set us apart.</span>
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-jvto-muted">
            Police-led · private · verifiable
          </span>
        </div>

        <FeatureCarouselWidget />
      </div>
    </section>
  );
}
