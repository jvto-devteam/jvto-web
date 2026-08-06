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
  type LucideIcon,
} from "lucide-react";
import type { DestinationDetail } from "@/interfaces";
import type {
  RouteStats,
  QuickFact,
  DestChrome,
  SignatureBlock,
} from "@/app/(website)/destinations/[slug]/page";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
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

// Per-destination narrative — hero chrome (eyebrow), quick facts, elevation stat, the
// signature prose, and the overview lede — is sourced from content/pages/destinations/
// <slug>.json and passed in as props (PACKAGE 06). This file keeps layout + icon mapping.

// Maps the lowercase icon token carried by a content quick-fact to a lucide component.
// New tokens must be added here AND kept lowercase in the content JSON. Unknown tokens
// fall back to Mountain so an authoring typo never crashes the render.
const ICON_MAP: Record<string, LucideIcon> = {
  mountain: Mountain,
  mappin: MapPin,
  flame: Flame,
  calendar: Calendar,
  footprints: Footprints,
  shieldalert: ShieldAlert,
  compass: Compass,
  route: Route,
  clock: Clock,
  waves: Waves,
  star: Star,
  trendingup: TrendingUp,
  cloudrain: CloudRain,
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


// --- MAIN COMPONENT ---

export default function DestinationDetailView({
  data,
  routeStats,
  volcanicStatus,
  relatedTours,
  chrome,
  quickFacts,
  elevationStat,
  signatureBlocks,
  overviewLede,
}: {
  data: DestinationDetail;
  slug: string;
  routeStats?: RouteStats | null;
  volcanicStatus?: VolcanicStatusData | null;
  relatedTours?: ToursByDestinationItem[];
  chrome: DestChrome;
  quickFacts: QuickFact[];
  elevationStat: { label: string; value: string };
  signatureBlocks: SignatureBlock[];
  overviewLede: string;
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
            {chrome.eyebrow && (
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
              {overviewLede || data.highlight}
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
      {quickFacts.length > 0 && (
        <section className="bg-jvto-off py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-jvto-border rounded-[28px] overflow-hidden border border-jvto-border shadow-sm">
              {quickFacts.map((f) => {
                const Icon = ICON_MAP[f.icon] ?? Mountain;
                return (
                  <div
                    key={f.k}
                    className={`bg-white p-7 flex flex-col gap-2 ${f.span2 ? "md:col-span-2" : ""}`}
                  >
                    <Icon size={22} className="text-jvto-orange" aria-hidden="true" />
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Signature narrative — evergreen prose from content/pages/destinations/<slug>.json
          (markdown blocks); the live volcanic status (Ijen/Bromo) stays DB-sourced above it. */}
      {(signatureBlocks.length > 0 || volcanicStatus) && (
        <section className="bg-jvto-off pb-4">
          <div className="container mx-auto px-4 max-w-6xl">
            {volcanicStatus && (
              <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 mb-2">
                  Volcanic status · verified {volcanicStatus.last_verified}
                </p>
                <p className="text-sm text-jvto-navy leading-relaxed">
                  <strong>{volcanicStatus.alert_level}.</strong> {volcanicStatus.notes} Verify the
                  current PVMBG/BBKSDA status before you travel — this reflects a one-time reading;
                  no live feed exists.
                </p>
              </div>
            )}
            {signatureBlocks.length > 0 && (
              <div className="max-w-none space-y-8 destination-signature">
                {signatureBlocks.map((b, i) => (
                  <MarkdownRenderer key={i} markdown={b.body_md} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
                label={elevationStat.label || "Elevation"}
                value={elevationStat.value || `${data.altitude} masl`}
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
