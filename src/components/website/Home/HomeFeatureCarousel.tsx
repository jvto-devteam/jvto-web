"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  BadgeCheck,
  HeartPulse,
  FileCheck2,
  Map,
  type LucideIcon,
} from "lucide-react";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

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
  const [reducedMotion, setReducedMotion] = useState(false);
  const total = FEATURES.length;

  // PKG-11a a11y: honour prefers-reduced-motion (WCAG 2.2.2 — auto-advancing
  // content must be stoppable). Focus pauses it too, not just hover, so a
  // keyboard user is never overtaken mid-read.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, total]);

  const active = FEATURES[current];

  return (
    <div
      className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Chip stack — index rail. Mono ordinals give it the survey-log read. */}
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
        {FEATURES.map((f, i) => {
          const isActive = i === current;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-pressed={isActive}
              className={`jvto-focus flex flex-shrink-0 items-center gap-3 rounded-sm border px-4 py-3 text-left text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "border-jvto-navy bg-jvto-navy text-white shadow-jvto-soft"
                  : "border-jvto-border bg-white text-jvto-ink-soft hover:border-jvto-navy/30 hover:text-jvto-navy"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-mono text-[10px] font-bold tracking-[0.1em] ${
                  isActive ? "text-jvto-lime" : "text-jvto-ink-soft"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <f.Icon
                size={18}
                className={isActive ? "text-jvto-lime" : "text-jvto-ink-soft"}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap md:whitespace-normal">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active plate */}
      {/* aria-live sits on the STABLE wrapper — the keyed child below remounts
          on every step, and a live region that is itself replaced never
          announces. */}
      <div
        aria-live="polite"
        className="relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden rounded-sm bg-jvto-navy p-8 text-white md:min-h-[340px] md:p-12"
      >
        <div
          aria-hidden="true"
          className="jvto-topo pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-jvto-navy-deep via-transparent to-transparent"
        />
        <div key={active.id} className="relative">
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-white/20"
            />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-jvto-on-navy-dim uppercase">
              Live · {String(current + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-jvto-lime/35 bg-jvto-lime/10 px-3.5 py-1.5">
            <active.Icon size={14} className="text-jvto-lime" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide uppercase">
              {String(current + 1).padStart(2, "0")} · {active.label}
            </span>
          </div>
          <p className="max-w-[52ch] text-base leading-relaxed font-light text-jvto-on-navy md:text-lg">
            {active.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeatureCarousel() {
  return (
    <Section surface="off" labelledBy="apart-heading">
      <SectionHeading
        id="apart-heading"
        eyebrow="§ 04"
        title={
          <>
            Six things that <span className="text-jvto-orange">set us apart.</span>
          </>
        }
        aside={<>Police-led &middot; private &middot; verifiable</>}
      />
      <FeatureCarouselWidget />
    </Section>
  );
}
