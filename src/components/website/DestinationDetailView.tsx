// src/components/website/DestinationDetailView.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "@/components/website/AppLink";
import {
  MapPin,
  Mountain,
  Thermometer,
  Clock,
  ShieldAlert,
  Info,
  CheckCircle2,
  Footprints,
  Wind,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HardHat,
  Star,
  Calendar,
  XCircle,
  TrendingUp,
  Route,
  Ticket,
  UserCheck,
  Users,
  Waves,
  Landmark,
  CloudRain,
  Compass,
  Eye,
} from "lucide-react";
import type { DestinationDetail } from "@/interfaces";
import type { RouteStats } from "@/app/(website)/destinations/[slug]/page";
import VolcanicStatusBadge from "@/components/website/VolcanicStatusBadge";
import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";
import PvmbgFieldReport from "@/components/website/PvmbgFieldReport";
import DestinationTourCard from "@/components/website/DestinationTourCard";
import type { ToursByDestinationItem } from "@/lib/queries/toursByDestination";

const Route3DEmbedded = dynamic(
  () => import("@/components/website/Route3DEmbedded"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] md:h-[560px] rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 animate-pulse">
          Loading 3D terrain…
        </span>
      </div>
    ),
  },
);

// ─── Design-reference per-destination copy ─────────────────────────────────
// docs/design-reference/destination-{ijen,bromo,tumpak-sewu,madakaripura,papuma}.html
//
// Elevation values for Ijen/Bromo are the CANONICAL_FACTS.md-locked figures
// (Kawah Ijen 2,386 m · Mount Bromo 2,329 m). These intentionally override the
// DB `data.altitude` field for Ijen (2,769 m — a different summit reference
// point, not the crater-lake elevation the brand publishes everywhere else).
// Waterfall/cape "heights" for the other three destinations are not covered by
// the facts lock; they follow the design spec's own stated estimates verbatim.

interface HeroMetaRow {
  label: string;
  value: string;
}

interface DestChrome {
  eyebrow: string;
  heroLede: string;
  metaRows: HeroMetaRow[];
}

const DEST_CHROME: Record<string, DestChrome> = {
  "ijen-crater": {
    eyebrow: "Banyuwangi · Active stratovolcano",
    heroLede:
      "The world's highest-volume acidic crater lake, a pre-dawn blue-fire phenomenon, and a working sulfur-miner trail — there is no other experience like it in Java.",
    metaRows: [
      { label: "Elevation", value: "2,386 m" },
      { label: "Ascent", value: "~3 km · ~90 min" },
      { label: "Trailhead", value: "Paltuding" },
      { label: "Park authority", value: "BBKSDA Jawa Timur" },
    ],
  },
  "mount-bromo": {
    eyebrow: "Probolinggo · Tengger Caldera",
    heroLede:
      "The smoking crater and the sunrise that justifies a 03:00 start. JVTO holds BBKSDA park clearance and a POLPAR licence issued to a serving Tourist Police officer — every document is publicly verifiable before you pay.",
    metaRows: [
      { label: "Elevation", value: "2,329 m" },
      { label: "Viewpoint", value: "Penanjakan · 2,770 m" },
      { label: "From Surabaya", value: "~3 hours" },
      { label: "Caldera traverse", value: "4WD private jeep" },
    ],
  },
  "tumpak-sewu-waterfall": {
    eyebrow: "Lumajang · Java's Niagara",
    heroLede:
      "A curved cliff face sends dozens of streams over its edge in one continuous curtain — Java's Niagara. See it from the rim, or descend ~300 steps to stand at its misted base.",
    metaRows: [
      { label: "Height", value: "~120 m curtain" },
      { label: "Nickname", value: "Java's Niagara" },
      { label: "Location", value: "Lumajang, East Java" },
      { label: "Descent", value: "~300 steps" },
    ],
  },
  "madakaripura-waterfall": {
    eyebrow: "Probolinggo · Tallest in Java",
    heroLede:
      "A narrow canyon walls you in for ~1.5 km before the gorge opens into a horseshoe of falling water — the tallest waterfall in Java. Bring a raincoat; the spray reaches everywhere.",
    metaRows: [
      { label: "Distinction", value: "Tallest in Java" },
      { label: "Main curtain", value: "~100 m (est.)" },
      { label: "Total height", value: "~200 m (est.)" },
      { label: "Approach", value: "~1.5 km canyon walk" },
    ],
  },
  "papuma-beach": {
    eyebrow: "Jember · Coastal headland",
    heroLede:
      "The only coastal stop on a JVTO East Java circuit. After Ijen's night hike, Papuma resets the pace — white sand, offshore rock formations, and a short headland walk with views along the coast.",
    metaRows: [
      { label: "Location", value: "Jember, East Java" },
      { label: "Type", value: "White-sand beach + cape" },
      { label: "Cape headland", value: "~86 m" },
      { label: "In itinerary", value: "Papuma-family (4D+)" },
    ],
  },
};

interface QuickFact {
  icon: any;
  k: string;
  v: string;
  sub?: string;
  span2?: boolean;
}

const DEST_QUICK_FACTS: Record<string, QuickFact[]> = {
  "ijen-crater": [
    { icon: Mountain, k: "Elevation", v: "2,386 m" },
    { icon: MapPin, k: "Location", v: "Banyuwangi", sub: "Bondowoso Regency, East Java" },
    { icon: Flame, k: "Type", v: "Active stratovolcano" },
    { icon: Calendar, k: "Best season", v: "Dry: Apr–Oct" },
    { icon: Footprints, k: "Access", v: "Night hike", sub: "Paltuding trailhead · ~3 km, ~90 min ascent" },
    { icon: ShieldAlert, k: "Regulatory authority", v: "BBKSDA Jawa Timur" },
  ],
  "mount-bromo": [
    { icon: Mountain, k: "Elevation", v: "2,329 m" },
    { icon: MapPin, k: "Location", v: "Tengger Caldera", sub: "Probolinggo Regency, East Java" },
    { icon: Compass, k: "Signature viewpoint", v: "Penanjakan · 2,770 m" },
    { icon: Route, k: "Caldera traverse", v: "4WD private jeep" },
    { icon: Clock, k: "From Surabaya", v: "~3 hours", sub: "Midnight departure to Cemoro Lawang" },
    { icon: Calendar, k: "Best season", v: "Dry: Apr–Oct" },
  ],
  "tumpak-sewu-waterfall": [
    { icon: Waves, k: "Height", v: "~120 m", sub: "Multi-tiered curtain" },
    { icon: MapPin, k: "Location", v: "Lumajang Regency", sub: "East Java, Indonesia" },
    { icon: Star, k: "Nickname", v: "Java's Niagara" },
    { icon: Waves, k: "Type", v: "Multi-tiered curtain" },
    {
      icon: Footprints,
      k: "Access",
      v: "Rim viewpoint — short walk from parking",
      sub: "Canyon descent: ~300 steps, moderate–challenging fitness",
      span2: true,
    },
  ],
  "madakaripura-waterfall": [
    { icon: Star, k: "Distinction", v: "Tallest waterfall in Java" },
    { icon: Waves, k: "Main curtain", v: "~100 m", sub: "Estimate (SSOT §9_4)" },
    { icon: TrendingUp, k: "Total height", v: "~200 m", sub: "Incl. upper tiers (estimate)" },
    { icon: MapPin, k: "Location", v: "Probolinggo Regency", sub: "East Java, Indonesia" },
    { icon: Footprints, k: "Approach", v: "~1.5 km · ~20 min", sub: "Canyon walk from parking; horse option available" },
    { icon: CloudRain, k: "Type", v: "Horseshoe curtain", sub: "In a narrow canyon" },
  ],
  "papuma-beach": [
    { icon: MapPin, k: "Location", v: "Jember Regency", sub: "East Java, Indonesia" },
    { icon: Waves, k: "Type", v: "White-sand beach", sub: "Rocky cape headland — Tanjung Papuma" },
    { icon: Mountain, k: "Cape headland", v: "~86 m" },
    { icon: Compass, k: "Role in itinerary", v: "Coastal contrast", sub: "Between Ijen & Tumpak Sewu legs · 4D+ packages" },
  ],
};

// Overview stat-card headline figure, decoupled from DEST_CHROME.metaRows (whose first row
// is not always an elevation/height metric — e.g. Madakaripura leads with "Distinction").
const DEST_ELEVATION_STAT: Record<string, { label: string; value: string }> = {
  "ijen-crater": { label: "Elevation", value: "2,386 m" },
  "mount-bromo": { label: "Elevation", value: "2,329 m" },
  "tumpak-sewu-waterfall": { label: "Height", value: "~120 m" },
  "madakaripura-waterfall": { label: "Height", value: "~100 m" },
  "papuma-beach": { label: "Cape height", value: "~86 m" },
};

// --- SHARED VISUAL PRIMITIVES (design-system-local, tokens per docs/design-reference) ---

const Callout = ({
  icon: Icon,
  title,
  children,
  tone = "orange",
  dark = false,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  tone?: "orange" | "lime" | "gold";
  dark?: boolean;
}) => {
  const borderColor =
    tone === "lime" ? "border-l-jvto-lime" : tone === "gold" ? "border-l-jvto-gold" : "border-l-jvto-orange";
  const iconColor = tone === "lime" ? "text-jvto-lime" : tone === "gold" ? "text-jvto-gold" : "text-jvto-orange";

  if (dark) {
    return (
      <div className="flex gap-4 items-start rounded-[18px] border border-white/10 bg-white/[0.04] border-l-4 border-l-jvto-lime p-6">
        <Icon size={22} className="text-jvto-lime shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-1.5">
            {title}
          </div>
          <p className="text-sm text-white/72 font-light leading-relaxed">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 items-start rounded-[18px] border border-jvto-border ${borderColor} border-l-4 ${
        tone === "gold" ? "bg-amber-50/60" : "bg-white"
      } p-6 my-6`}
    >
      <Icon size={22} className={`${iconColor} shrink-0 mt-0.5`} aria-hidden="true" />
      <div>
        <div
          className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5 ${
            tone === "gold" ? "text-amber-700" : "text-jvto-navy"
          }`}
        >
          {title}
        </div>
        <p className="text-sm text-jvto-muted font-light leading-relaxed">{children}</p>
      </div>
    </div>
  );
};

const Vantage = ({
  tag,
  icon: Icon,
  title,
  children,
  foot,
}: {
  tag: string;
  icon: any;
  title: string;
  children: React.ReactNode;
  foot: string;
}) => (
  <div className="rounded-[28px] border border-jvto-border bg-white shadow-sm p-8 flex flex-col gap-3.5">
    <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-orange">
      <Icon size={14} aria-hidden="true" /> {tag}
    </span>
    <h3 className="text-2xl leading-tight tracking-[-0.02em] font-bold text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>
      {title}
    </h3>
    <p className="text-[15px] text-jvto-muted font-light leading-relaxed">{children}</p>
    <div className="mt-auto pt-4 border-t border-jvto-border font-mono text-[10px] uppercase tracking-[0.18em] text-jvto-navy">
      {foot}
    </div>
  </div>
);

const SectionHead = ({
  num,
  title,
  accent,
  meta,
  dark = false,
}: {
  num?: string;
  title: React.ReactNode;
  accent: string;
  meta?: string;
  dark?: boolean;
}) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-end gap-4 md:gap-12 mb-10 pb-6 border-b ${
      dark ? "border-white/10" : "border-jvto-border"
    }`}
  >
    {num ? (
      <span
        className={`font-mono text-[11px] font-semibold uppercase tracking-[0.24em] ${
          dark ? "text-white/55" : "opacity-55"
        }`}
      >
        {num}
      </span>
    ) : (
      <span aria-hidden="true" />
    )}
    <h2
      className={`text-3xl md:text-5xl leading-none tracking-[-0.03em] font-bold max-w-[16ch] ${
        dark ? "text-white" : "text-jvto-navy"
      }`}
      style={{ fontFamily: "Raleway, Inter, sans-serif" }}
    >
      {title} <span className="text-jvto-orange">{accent}</span>
    </h2>
    {meta && (
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.22em] text-right ${
          dark ? "text-white/55" : "opacity-55"
        }`}
      >
        {meta}
      </span>
    )}
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="bg-white border border-jvto-border shadow-sm p-4 rounded-[14px] flex items-center gap-4 hover:border-jvto-orange transition-colors">
    <div className="p-2 rounded-full bg-jvto-off text-jvto-navy">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-jvto-muted uppercase font-bold tracking-wider">
        {label}
      </p>
      <p className="text-jvto-navy font-bold">{value}</p>
    </div>
  </div>
);

const RiskAccordion = ({ risk }: { risk: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isHigh = risk.level === "high";

  return (
    <div
      className={`border rounded-[14px] mb-3 overflow-hidden transition-all ${
        isOpen ? "bg-jvto-off border-jvto-border" : "bg-white border-jvto-border"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-jvto-off transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={20}
            className={isHigh ? "text-red-600" : "text-amber-600"}
          />
          <span className="text-jvto-navy font-bold">
            {risk.type.toUpperCase()} RISK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
              isHigh
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {risk.level}
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="text-jvto-muted" />
          ) : (
            <ChevronDown size={16} className="text-jvto-muted" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 text-sm">
          <p className="text-jvto-muted mb-3">{risk.description}</p>
          <div className="bg-jvto-lime/5 p-3 rounded-[10px] border border-jvto-lime/30">
            <p className="text-jvto-navy font-bold text-xs mb-1 uppercase">
              Mitigation Strategy:
            </p>
            <p className="text-jvto-muted">{risk.mitigation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SIGNATURE SECTION (bespoke per-destination narrative, design-reference §02/§03) ---

function SignatureSection({
  slug,
  volcanicStatus,
}: {
  slug: string;
  volcanicStatus?: VolcanicStatusData | null;
}) {
  if (slug === "ijen-crater") {
    return (
      <>
        {/* The Blue Fire */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div
                className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-lg"
                style={{ background: "linear-gradient(135deg, #2a1810 0%, #3b1d0c 60%, #1c0f08 100%)" }}
              >
                <span className="absolute left-4 top-4 z-[3] rounded-md border border-white/15 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Photo · blue fire at the crater floor
                </span>
              </div>
              <div>
                <span className="block mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-muted">
                  The phenomenon
                </span>
                <h2
                  className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-jvto-navy mb-5"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  The Blue Fire.
                </h2>
                <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
                  Inside Ijen&apos;s crater, sulfuric gases emerge from vents under pressure and ignite
                  on contact with the air, burning an electric blue. The flames are visible only in
                  darkness — which is why JVTO groups depart for the rim around midnight and descend
                  toward the crater floor before first light.
                </p>
                <p className="text-[17px] text-jvto-navy leading-relaxed">
                  It is one of only a handful of places on earth where the effect occurs at this
                  scale. The reward at sunrise — a turquoise acidic lake filling the crater — is
                  extraordinary in its own right.
                </p>
                <Callout icon={AlertTriangle} title="Weather & gas conditions apply" tone="orange">
                  The blue fire is a natural phenomenon, subject to weather and volcanic gas
                  activity. It is not guaranteed on any given night. We plan around the optimal
                  viewing window — we do not promise an outcome we cannot control.
                </Callout>
              </div>
            </div>
          </div>
        </section>

        {/* The Hike */}
        <section className="bg-jvto-off py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHead num="§ 02" title="The" accent="hike." meta="Paltuding → crater rim" />
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-start">
              <ol className="flex flex-col gap-8">
                {[
                  ["Departure timing", "00:00 for the blue-fire window; 03:00 for sunrise only. Your guide confirms the plan based on conditions."],
                  ["The ascent", "~3 km one-way from the Paltuding trailhead, roughly 90 minutes of steady switchbacks to the crater rim."],
                  ["Optional crater descent", "A steeper ~700 m path drops to the crater floor for the closest blue-fire view. Optional, and only when conditions and your guide allow."],
                ].map(([h, p], i) => (
                  <li key={h} className="grid grid-cols-[auto_1fr] gap-6 items-start pb-8 border-b border-jvto-border last:border-0 last:pb-0">
                    <span className="font-mono text-[11px] tracking-[0.22em] text-jvto-orange pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="text-xl font-bold text-jvto-navy mb-1.5" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>
                        {h}
                      </h4>
                      <p className="text-jvto-muted font-light text-[15px]">{p}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="grid grid-cols-2 gap-6 rounded-[28px] border border-jvto-border bg-white p-8">
                {[
                  ["Distance (one-way)", "~3 km"],
                  ["Ascent time", "~90 min"],
                  ["Trailhead", "Paltuding"],
                  ["Crater descent", "~700 m (optional)"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-jvto-muted mb-1.5">{k}</div>
                    <div className="font-semibold text-jvto-navy">{v}</div>
                  </div>
                ))}
                <div className="col-span-2 border-t border-jvto-border pt-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-jvto-muted mb-2.5">
                    Equipment provided by JVTO
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Gas masks", "Headlamps"].map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex items-center gap-1.5 rounded-full border border-jvto-border px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-navy"
                      >
                        <CheckCircle2 size={12} className="text-jvto-lime" /> {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Certificate Coordination */}
        <section className="bg-jvto-navy py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <span className="block mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-jvto-lime">
                  Conditional · BBKSDA SE.1658/KSA.9/2024
                </span>
                <h2
                  className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-white mb-5"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  Health certificate <span className="text-jvto-orange">coordination.</span>
                </h2>
                <p className="text-white/74 text-base font-light leading-relaxed mb-4">
                  A recent health certificate is mandatory for every guest under BBKSDA Surat
                  Edaran SE.1658/KSA.9/2024. JVTO coordinates the clinic workflow — there is
                  nothing for you to arrange separately.
                </p>
                <p className="text-white/74 text-base font-light leading-relaxed">
                  The BSrE-signed surat sehat is issued through Dr. Ahmad Irwandanu (SIP, Kemenkes
                  RI) and is checked at the crater access gate.
                </p>
                <Link
                  href="/travel-guide/ijen-health-screening"
                  className="mt-7 inline-flex items-center gap-3 border-b border-white/40 pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-white hover:text-jvto-lime hover:border-jvto-lime transition-colors"
                >
                  How Ijen health screening works →
                </Link>
              </div>
              <Callout icon={CheckCircle2} title="Coordinated when rules require it" tone="lime" dark>
                This is a regulatory step under BBKSDA, not a JVTO-imposed formality. When the rule
                is active, oxygen saturation, blood pressure, heart rate and respiratory history
                are recorded before crater access. No valid health certificate, no crater entry — that rule is
                BBKSDA&apos;s.
              </Callout>
            </div>
          </div>
        </section>

        {/* Sulfur Miners */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-[64ch]">
              <span className="block mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-muted">
                A shared working path
              </span>
              <h2
                className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-jvto-navy mb-5 flex items-center gap-3"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                <Users size={32} className="text-jvto-orange" aria-hidden="true" /> Sulfur miners.
              </h2>
              <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
                The trail you climb is a working route. Local miners carry 70–90 kg loads of
                sulfur blocks from the crater floor by hand — daily, at the same pre-dawn hours
                visitors are ascending. JVTO guides brief every group before departure: move aside
                for load-carriers, and never photograph a miner without first asking.
              </p>
              <p className="text-[17px] text-jvto-muted font-light leading-relaxed">
                The mining operation is part of the reality of Ijen — a human one, not a
                photographic attraction. The briefing is standard on every Ijen route, not
                optional.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug === "mount-bromo") {
    const status = volcanicStatus;
    const exclusionActive = status?.exclusion_zone_active ?? false;
    const radiusKm = status?.exclusion_zone_radius_km;

    return (
      <>
        {/* Volcanic status notice — dynamic from public/ops/volcanic-status.json (MAGMA/PVMBG feed) */}
        {status && (
          <section className="bg-jvto-off py-20 md:py-28">
            <div className="container mx-auto px-4 max-w-6xl">
              <SectionHead num="§ 02" title="Volcanic status" accent="notice." meta="Verify before travel" />
              <Callout icon={AlertTriangle} title={`${status.alert_level} · verified ${status.last_verified}`} tone="gold">
                {status.notes} Verify the current PVMBG/BBKSDA status before you travel — this
                notice reflects a one-time reading and no live update feed exists.
              </Callout>
              <div className="grid md:grid-cols-2 gap-6 mt-2">
                <div className="rounded-[18px] border-l-4 border-l-jvto-lime bg-white p-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                    Fully accessible
                  </span>
                  <h3 className="text-xl font-bold text-jvto-navy mt-2 mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>
                    The core experience is unaffected.
                  </h3>
                  <p className="text-[15px] text-jvto-muted font-light leading-relaxed">
                    The Penanjakan sunrise viewpoint, the sea-of-sand jeep traverse, and the
                    caldera-floor temple area {exclusionActive && radiusKm ? `sit outside the ${radiusKm} km radius and ` : ""}
                    remain open.
                  </p>
                </div>
                <div className="rounded-[18px] border-l-4 border-l-jvto-gold bg-white p-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
                    {exclusionActive ? "Currently restricted" : "Status"}
                  </span>
                  <h3 className="text-xl font-bold text-jvto-navy mt-2 mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>
                    {exclusionActive ? "The crater lip only." : "Open, standard precautions apply."}
                  </h3>
                  <p className="text-[15px] text-jvto-muted font-light leading-relaxed">
                    {exclusionActive
                      ? `The final approach to the crater rim — directly over the active vent — falls within the exclusion zone${radiusKm ? ` (${radiusKm} km)` : ""}. JVTO will not take guests to the crater lip while this status is in effect.`
                      : "No active exclusion zone is in effect. JVTO still briefs every group on standard volcanic-hazard precautions before departure."}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Callout icon={CheckCircle2} title="Effect on your itinerary · minimal" tone="lime">
                  The Penanjakan sunrise, sea-of-sand crossing, and caldera-floor exploration are
                  the primary experiences of a JVTO Bromo tour. JVTO&apos;s Plan-B framework is
                  active: your guide contacts you before arrival to confirm the adjusted
                  itinerary. No day is lost.
                </Callout>
              </div>
            </div>
          </section>
        )}

        {/* Why JVTO for Bromo */}
        <section className="bg-jvto-navy py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHead
              num="§ 03"
              title="Why JVTO"
              accent="for Bromo."
              meta="Police-led · private · verifiable"
              dark
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: ShieldAlert,
                  h: "Police-led",
                  p: "Founder Mr. Sam (Bripka Agung Sambuko) is an active Ditpamobvit officer. Route decisions answer to police protocol, not marketing metrics.",
                  meta: "Authority",
                },
                {
                  icon: Users,
                  h: "100% private",
                  p: "Your own vehicle, driver, and crew — no shared jeeps, no strangers, no compromise on timing.",
                  meta: "Private",
                },
                {
                  icon: CheckCircle2,
                  h: "All-inclusive",
                  p: "Transport, entrance fees, the 4WD jeep, accommodation, water and T-shirt bundled. No surprise local payments.",
                  meta: "Written inclusions",
                },
                {
                  icon: Ticket,
                  h: "Verifiable",
                  p: "NIB 1102230032918 checkable at OSS. POLPAR, BBKSDA and HPWKI credentials listed. Trustpilot 4.8/5 from 51 reviews.",
                  meta: "Proof library",
                },
              ].map((tile) => (
                <div
                  key={tile.h}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 flex flex-col hover:-translate-y-1 hover:border-jvto-orange transition-all"
                >
                  <tile.icon size={28} className="text-jvto-lime mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>
                    {tile.h}
                  </h3>
                  <p className="text-white/70 text-sm font-light leading-relaxed">{tile.p}</p>
                  <span className="mt-auto pt-4 border-t border-white/10 font-mono text-[10px] uppercase tracking-[0.22em] text-jvto-lime">
                    {tile.meta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug === "tumpak-sewu-waterfall") {
    return (
      <>
        {/* Two Ways to See It */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHead num="§ 02" title="Two ways to" accent="see it." meta="Rim · or canyon base" />
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Vantage tag="The Rim Viewpoint" icon={Eye} title="The full curtain, in one frame." foot="Short walk · all fitness levels">
                A short walk from the parking area brings you to the panoramic rim — the classic
                view of the entire horseshoe curtain falling into the canyon. Suitable for all
                fitness levels, no descent required.
              </Vantage>
              <Vantage tag="The Canyon Descent" icon={Footprints} title="At the base, inside the mist." foot="~300 steps · ropes in places">
                A steep descent of ~300 steps — with ropes in places — drops into the canyon to
                stand at the foot of the falls, surrounded by spray and noise. Guides assess
                conditions and fitness on the day and brief the route before starting.
              </Vantage>
            </div>
            <Callout icon={CheckCircle2} title="The decision stays with you" tone="lime">
              The choice to descend stays with the guest. Guides assess conditions on the day and
              brief the route before starting — there is no pressure to go down.
            </Callout>
          </div>
        </section>

        {/* Conditions on the Ground */}
        <section className="bg-jvto-navy py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div>
                <span className="block mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-jvto-lime">
                  Conditions on the ground
                </span>
                <h2
                  className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-white mb-5"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  Wet year-round. <span className="text-jvto-orange">Plan footwear.</span>
                </h2>
                <p className="text-white/74 text-base font-light leading-relaxed">
                  Trails are wet year-round and the canyon approach involves ropes in places.
                  Guides assess fitness before any descent. Closed-toe, non-slip footwear is
                  strongly recommended.
                </p>
              </div>
              <Callout icon={HardHat} title="Helmets — provided on site" tone="lime" dark>
                Helmets for the canyon section are provided by the local Tumpak Sewu site
                management, not by JVTO. Your guide briefs the route and conditions before you
                start the descent.
              </Callout>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug === "madakaripura-waterfall") {
    return (
      <>
        {/* The Approach */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              <div
                className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-lg"
                style={{ background: "linear-gradient(135deg, #2a1810 0%, #3b1d0c 60%, #1c0f08 100%)" }}
              >
                <span className="absolute left-4 top-4 z-[3] rounded-md border border-white/15 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Photo · the narrowing canyon approach
                </span>
              </div>
              <div>
                <span className="block mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-muted">
                  The approach
                </span>
                <h2
                  className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-jvto-navy mb-5"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  A gorge that builds the anticipation.
                </h2>
                <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
                  The walk in is part of the experience. For about 1.5 km the canyon walls close
                  in around you, the path narrows and turns wet and slippery, and the sound of
                  water grows — until the gorge opens into the horseshoe and the full curtain
                  reveals itself.
                </p>
                <p className="text-[17px] text-jvto-muted font-light leading-relaxed">
                  A horse is available for guests who prefer not to walk the canyon stretch.
                </p>
                <Callout icon={CloudRain} title="You will get wet — bring a raincoat" tone="orange">
                  Spray reaches everywhere inside the canyon. A raincoat is strongly recommended;
                  JVTO guides brief guests before entry.
                </Callout>
                <Callout icon={HardHat} title="Helmets — provided on site" tone="lime">
                  Helmets at the canyon entrance are provided by the local waterfall
                  site-management team, not by JVTO equipment.
                </Callout>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Context */}
        <section className="bg-jvto-navy py-20 md:py-28">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-[1fr_1.1fr] gap-14 items-center">
              <div>
                <span className="block mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-jvto-lime">
                  Historical context
                </span>
                <h2
                  className="text-3xl md:text-5xl leading-tight tracking-[-0.02em] font-bold text-white flex items-center gap-3"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  <Landmark size={34} className="text-jvto-orange" aria-hidden="true" /> Gajah Mada&apos;s{" "}
                  <span className="text-jvto-orange">final days.</span>
                </h2>
              </div>
              <div>
                <p className="text-white/78 text-[17px] font-light leading-relaxed mb-4">
                  The site is held in local tradition to be where Gajah Mada — the 14th-century
                  prime minister of the Majapahit empire, the figure behind its greatest
                  territorial expansion — spent his final days.
                </p>
                <p className="text-white/60 text-base font-light leading-relaxed">
                  That association gives Madakaripura a spiritual significance in East Javanese
                  culture that goes beyond its scale. For many visitors, the walled-in canyon and
                  the curtain of water at its end carry a quiet, contemplative weight.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (slug === "papuma-beach") {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHead num="§ 02" title="What to" accent="expect." meta="The beach · the cape" />
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Vantage tag="The Beach" icon={Waves} title="White sand, calm dry-season water." foot="Dry-season calm · offshore rocks">
              A broad white-sand beach with generally calm conditions during the dry season.
              Dramatic offshore rock formations rise from the water, visible directly from the
              shoreline.
            </Vantage>
            <Vantage tag="The Cape" icon={Mountain} title="A short climb to ~86 m." foot="Short headland walk · coastal views">
              A short walk rises to the Tanjung Papuma headland at roughly 86 m above sea level —
              elevated coastal views with the rock formations laid out below.
            </Vantage>
          </div>
          <Callout icon={Compass} title="Why it's on the circuit" tone="lime">
            Papuma is the only coastal stop on a JVTO East Java circuit — positioned between the
            Ijen night hike and the Tumpak Sewu canyon descent to shift pace, scenery, and
            physicality.
          </Callout>
        </div>
      </section>
    );
  }

  return null;
}

// --- MAIN COMPONENT ---

export default function DestinationDetailView({
  data,
  slug,
  routeStats,
  volcanicStatus,
  relatedTours,
}: {
  data: DestinationDetail;
  slug: string;
  routeStats?: RouteStats | null;
  volcanicStatus?: VolcanicStatusData | null;
  relatedTours?: ToursByDestinationItem[];
}) {
  const [activeSection, setActiveSection] = useState("overview");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "logistics", label: "Logistics", icon: Mountain },
    { id: "safety", label: "Safety", icon: ShieldAlert },
    { id: "culture", label: "Culture", icon: Award },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 20;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };
  const primaryAsset = data.destination_assets?.find(
    (item) => item.type === 'primary'
  );
  const heroImageUrl = primaryAsset
    ? `${primaryAsset.asset.url}`
    : data.featured_image;

  const chrome = DEST_CHROME[slug];
  const quickFacts = DEST_QUICK_FACTS[slug];
  const elevationStat = DEST_ELEVATION_STAT[slug];
  // Prefer the curated per-destination hero lede over the raw DB `summary` field for the
  // overview quote — BBKSDA SE.1658/KSA.9/2024 health-certificate wording is handled
  // separately in the dedicated Health Certificate Coordination section below.
  const overviewLede = chrome?.heroLede ?? data.summary;

  return (
    <div className="min-h-screen bg-jvto-off text-gray-800 font-sans selection:bg-jvto-lime selection:text-jvto-navy">
      {/* HERO SECTION */}
      <header className="relative h-[70vh] md:h-[78vh] w-full overflow-hidden bg-jvto-navy">
        <div className="absolute inset-0 bg-black/25 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy via-jvto-navy/10 to-black/35 z-10" />
        <Image
          src={heroImageUrl}
          alt={data.name}
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-14 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            {chrome && (
              <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-4 py-2 mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" aria-hidden="true" />
                {chrome.eyebrow}
              </span>
            )}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-[-0.03em] leading-[0.95] drop-shadow-lg"
              style={{ fontFamily: "Raleway, Inter, sans-serif" }}
            >
              {data.name}
            </h1>
            <p className="text-white/85 text-base md:text-lg font-light max-w-[46ch] leading-relaxed mb-3 drop-shadow-md">
              {chrome?.heroLede ?? data.highlight}
            </p>
            <div className="flex items-center gap-2 text-base text-white/70 font-medium drop-shadow-md">
              <MapPin className="text-jvto-lime" size={18} aria-hidden="true" />
              {data.region}, {data.province}, {data.country}
            </div>
          </div>
        </div>
      </header>

      {/* Tags — moved below hero for photography-first clarity */}
      {data.tags.length > 0 && (
        <div className="bg-white border-b border-jvto-border py-3 px-4 md:px-8">
          <div className="container mx-auto flex flex-wrap gap-2">
            {data.tags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-jvto-off text-jvto-muted"
              >
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* QUICK FACTS — dest-facts icon grid (design-reference §01) */}
      {quickFacts && (
        <section className="bg-jvto-off py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-jvto-border rounded-[28px] overflow-hidden border border-jvto-border shadow-sm">
              {quickFacts.map((f) => (
                <div
                  key={f.k}
                  className={`bg-white p-7 flex flex-col gap-2 ${f.span2 ? "md:col-span-2" : ""}`}
                >
                  <f.icon size={22} className="text-jvto-orange" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-muted">
                    {f.k}
                  </span>
                  <span
                    className="text-[19px] font-bold tracking-[-0.01em] text-jvto-navy leading-tight"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {f.v}
                    {f.sub && <small className="block font-sans text-[13px] font-normal text-jvto-muted normal-case tracking-normal mt-0.5">{f.sub}</small>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bespoke narrative sections per design-reference */}
      <SignatureSection slug={slug} volcanicStatus={volcanicStatus} />

      {/* STATIC NAVIGATION */}
      <nav className="bg-white border-b border-jvto-border py-4 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 min-w-max">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider py-2 border-b-2 transition-all ${
                  activeSection === item.id
                    ? "border-jvto-orange text-jvto-navy"
                    : "border-transparent text-jvto-muted hover:text-jvto-navy"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT GRID */}
      <main className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-16">
          {/* 1. OVERVIEW */}
          <section id="overview" className="scroll-mt-24">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Mountain}
                label={elevationStat?.label ?? "Elevation"}
                value={elevationStat?.value ?? `${data.altitude} masl`}
              />
              <StatCard
                icon={Thermometer}
                label="Temp"
                value={data.temperature_range.split(",")[0]}
              />
              <StatCard
                icon={HardHat}
                label="Difficulty"
                value={data.difficulty_level}
              />
              <StatCard icon={Clock} label="Duration" value={data.duration} />
              <StatCard
                icon={Ticket}
                label="Permit"
                value={data.permit_required ? "Required" : "Not required"}
              />
              <StatCard
                icon={UserCheck}
                label="Guide"
                value={data.guide_required ? "Mandatory" : "Optional"}
              />
            </div>

            {data.main_attractions && data.main_attractions.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-jvto-muted mb-3">
                  Why Visit
                </p>
                <ul className="space-y-2">
                  {data.main_attractions.slice(0, 3).map((attr, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-jvto-navy">
                      <span className="text-jvto-lime font-black mt-0.5" aria-hidden="true">✓</span>
                      <span>{attr.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <p className="font-light text-xl leading-relaxed italic pl-0 mb-6 text-jvto-navy">
                {overviewLede}
              </p>
              <div className="text-base text-jvto-muted whitespace-pre-line">
                {data.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.main_attractions.map((h, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-[16px] border border-jvto-border shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-jvto-off flex items-center justify-center mb-3 group-hover:bg-jvto-lime transition-colors">
                    <Star size={18} className="text-jvto-navy" />
                  </div>
                  <h4 className="font-bold text-jvto-navy mb-1">{h.title}</h4>
                  <p className="text-sm text-jvto-muted">{h.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. LOGISTICS */}
          <section id="logistics" className="scroll-mt-24">
            <SectionHead title="Trail &" accent="Logistics" />

            {/* Trail stats */}
            {routeStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-jvto-navy border border-white/10 rounded-lg p-4 flex items-center gap-3">
                  <Route size={18} className="text-jvto-lime shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Distance</p>
                    <p className="text-white font-bold text-sm">{routeStats.length_km.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="bg-jvto-navy border border-white/10 rounded-lg p-4 flex items-center gap-3">
                  <TrendingUp size={18} className="text-jvto-lime shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Elev. Gain</p>
                    <p className="text-white font-bold text-sm">+{routeStats.elev_gain_m} m</p>
                  </div>
                </div>
                <div className="bg-jvto-navy border border-white/10 rounded-lg p-4 flex items-center gap-3">
                  <Mountain size={18} className="text-jvto-lime shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Max Elev.</p>
                    <p className="text-white font-bold text-sm">{routeStats.elev_max_m} m</p>
                  </div>
                </div>
                <div className="bg-jvto-navy border border-white/10 rounded-lg p-4 flex items-center gap-3">
                  <Mountain size={18} className="text-white/50 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Min Elev.</p>
                    <p className="text-white font-bold text-sm">{routeStats.elev_min_m} m</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Route Viewer — embedded */}
            {routeStats && (
              <div className="mb-8">
                <Route3DEmbedded
                  slug={routeStats.slug}
                  routeStats={routeStats}
                />
                <p className="text-[9px] text-slate-500 mt-2 text-right">
                  Route data: AllTrails.com · 3D terrain via Mapbox
                </p>
              </div>
            )}

            <div className="bg-white rounded-[20px] border border-jvto-border shadow-sm overflow-hidden mb-8">
              <div className="p-6 md:p-8 border-b border-jvto-border">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h4 className="font-bold text-jvto-navy mb-2 flex items-center gap-2">
                      <Wind size={18} className="text-jvto-navy" /> Terrain & Trail
                    </h4>
                    <p className="text-jvto-muted text-sm leading-relaxed mb-4">
                      {data.terrain}
                    </p>
                    <p className="text-jvto-muted text-sm leading-relaxed mb-4">
                      {data.trail_details}
                    </p>
                    <div className="text-sm bg-jvto-off p-3 rounded border border-jvto-border">
                      <span className="text-jvto-muted block mb-1 uppercase text-[10px] font-bold">
                        Best Time to Visit
                      </span>
                      <span className="text-jvto-navy font-medium">
                        {data.best_time_to_visit}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-jvto-navy mb-4 flex items-center gap-2">
                      <HardHat size={18} className="text-jvto-navy" /> Required Gear
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.required_gear.map((gear, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-jvto-muted"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-jvto-lime"
                          />
                          <span className="capitalize">
                            {gear.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-jvto-border bg-jvto-off/50">
                {data.environmental_factors.map((env, i) => (
                  <div key={i} className="p-4 text-center">
                    <p className="text-[10px] uppercase text-jvto-muted font-bold mb-1">
                      {env.factor.replace("_", " ")}
                    </p>
                    <p className="text-jvto-navy font-bold text-sm">
                      {env.value}{" "}
                      <span className="text-[10px] font-normal text-jvto-muted">
                        {env.unit || ""}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Callout icon={Info} title="Visitor Tips" tone="orange">
              {data.tips_for_visitors}
            </Callout>
          </section>

          {/* 3. SAFETY */}
          <section id="safety" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-jvto-navy uppercase tracking-wide flex items-center gap-3">
                <span className="p-2 rounded-[10px] bg-jvto-off text-jvto-navy"><ShieldAlert size={24} /></span>
                Safety Protocol
              </h2>
              <div className="px-3 py-1 rounded bg-red-100 border border-red-200 text-red-600 text-xs font-bold uppercase flex items-center gap-2">
                <AlertTriangle size={14} /> High Caution Area
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {data.risk_factors.map((risk, i) => (
                <RiskAccordion key={i} risk={risk} />
              ))}
            </div>

            <div className="p-5 rounded-[16px] bg-jvto-off border border-jvto-border">
              <h5 className="font-bold text-jvto-navy text-sm mb-3">
                Important Safety Notes
              </h5>
              <ul className="space-y-2">
                {data.safety_notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-jvto-muted"
                  >
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-red-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Official PVMBG recommendations — sourced from live MAGMA feed */}
            {volcanicStatus?.pvmbg_report?.recommendations_en?.length ? (
              <div className="p-5 rounded-[16px] bg-red-50 border border-red-100 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-red-900 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-600" />
                    Official PVMBG Recommendations
                  </h5>
                  <a
                    href={volcanicStatus.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-red-400 hover:text-red-600 transition-colors"
                  >
                    PVMBG Source ↗
                  </a>
                </div>
                <ul className="space-y-2">
                  {volcanicStatus.pvmbg_report.recommendations_en.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-red-800">
                      <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-red-500 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
                <p className="text-[9px] text-red-400 mt-3">
                  Verified {volcanicStatus.last_verified} · {volcanicStatus.source}
                </p>
              </div>
            ) : null}
          </section>

          {/* 4. CULTURE */}
          <section id="culture" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-jvto-navy uppercase tracking-wide flex items-center gap-3 mb-6">
              <span className="p-2 rounded-[10px] bg-jvto-off text-jvto-navy"><Award size={24} /></span>
              Cultural Significance
            </h2>
            <div className="bg-white border border-jvto-border shadow-sm p-8 rounded-[20px] relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-lg text-jvto-muted italic mb-6 leading-relaxed">
                  &quot;{data.cultural_context}&quot;
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.local_tribes.map((tribe) => (
                    <span
                      key={tribe}
                      className="px-3 py-1 rounded-full bg-jvto-off border border-jvto-border text-xs text-jvto-muted font-medium"
                    >
                      {tribe} Tribe
                    </span>
                  ))}
                </div>
              </div>
              <Flame className="absolute -bottom-10 -right-10 text-jvto-off w-64 h-64 opacity-50" />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            {/* Volcanic status badge — Ijen + Bromo only */}
            {volcanicStatus && (
              <VolcanicStatusBadge
                destinationName={data.name}
                status={volcanicStatus}
              />
            )}

            {/* PVMBG field report — visual observation + summit conditions */}
            {volcanicStatus?.pvmbg_report && (
              <PvmbgFieldReport
                report={volcanicStatus.pvmbg_report}
                sourceUrl={volcanicStatus.source_url}
                lastVerified={volcanicStatus.last_verified}
              />
            )}

            {/* INFO CARD (Permit Details) */}
            <div className="rounded-[20px] p-1 bg-jvto-lime shadow-lg">
              <div className="bg-white rounded-[16px] p-6 h-full">
                <div className="mb-6">
                  <p className="text-xs text-jvto-muted uppercase font-bold tracking-wider mb-1">
                    Permit & Entry
                  </p>
                  <h3 className="text-xl font-black text-jvto-navy">
                    Information
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="text-sm bg-jvto-off p-3 rounded-[12px] border border-jvto-border">
                    <p className="font-bold text-jvto-navy mb-1">
                      Permit Details
                    </p>
                    <p className="text-jvto-muted text-xs leading-relaxed">
                      {data.permit_details}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm py-2 border-b border-jvto-border">
                    <span className="text-jvto-muted">Permit Status</span>
                    <span className="text-jvto-navy flex items-center gap-1 font-bold">
                      {data.permit_required ? (
                        <CheckCircle2 size={14} className="text-jvto-navy" />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      Required
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-jvto-border">
                    <span className="text-jvto-muted">Guide Status</span>
                    <span className="text-jvto-navy flex items-center gap-1 font-bold">
                      {data.guide_required ? (
                        <CheckCircle2 size={14} className="text-jvto-navy" />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      Mandatory
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-jvto-muted">
                  Operated by JVTO • Police-Led Safety
                </p>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white border border-jvto-border shadow-sm rounded-[20px] p-6">
              <h4 className="font-bold text-jvto-navy mb-4 flex items-center gap-2">
                <Calendar size={18} /> Seasonality
              </h4>
              <p className="text-sm text-jvto-muted leading-relaxed mb-4">
                {data.weather_by_season}
              </p>
              <div className="text-xs text-jvto-muted pt-4 border-t border-jvto-border">
                <strong>Rainfall:</strong> {data.rainfall_intensity}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* PACKAGES — full-width, design-reference §pkg-grid */}
      {relatedTours && relatedTours.length > 0 && (
        <section className="bg-jvto-off py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <SectionHead
              title="Packages that include"
              accent={`${data.name}.`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedTours.slice(0, 6).map((tour) => (
                <DestinationTourCard key={tour.id} tour={tour} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center gap-3 border-b border-jvto-navy pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-navy hover:text-jvto-orange hover:border-jvto-orange transition-colors"
              >
                View all packages
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-jvto-navy text-white py-24 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-4xl md:text-6xl leading-none tracking-[-0.03em] font-bold mb-10"
            style={{ fontFamily: "Raleway, Inter, sans-serif" }}
          >
            Visit <span className="text-jvto-orange">{data.name}</span> with JVTO.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jvto-orange px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-jvto-orange-hover transition-colors"
            >
              View {data.name} packages
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://wa.me/6282244788833"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/[0.06] transition-colors"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
