// src/components/website/DestinationDetailView.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
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

// --- HELPER COMPONENTS ---

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-sm bg-gray-100 text-black">
      <Icon size={24} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
      {title}
    </h2>
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
  <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-sm flex items-center gap-4 hover:border-[#B2F35F] transition-colors">
    <div className="p-2 rounded-full bg-gray-100 text-gray-900">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
        {label}
      </p>
      <p className="text-gray-900 font-bold">{value}</p>
    </div>
  </div>
);

const RiskAccordion = ({ risk }: { risk: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isHigh = risk.level === "high";

  return (
    <div
      className={`border rounded-sm mb-3 overflow-hidden transition-all ${
        isOpen ? "bg-gray-50 border-gray-300" : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle
            size={20}
            className={isHigh ? "text-red-600" : "text-yellow-600"}
          />
          <span className="text-gray-900 font-bold">
            {risk.type.toUpperCase()} RISK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
              isHigh
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {risk.level}
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 text-sm">
          <p className="text-gray-600 mb-3">{risk.description}</p>
          <div className="bg-jvto-green/5 p-3 rounded-sm border border-jvto-green/30">
            <p className="text-black font-bold text-xs mb-1 uppercase">
              Mitigation Strategy:
            </p>
            <p className="text-gray-600">{risk.mitigation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function DestinationDetailView({
  data,
  routeStats,
  volcanicStatus,
  relatedTours,
}: {
  data: DestinationDetail;
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-[#B2F35F] selection:text-black">
      {/* HERO SECTION */}
      <header className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-10" />
        <Image
          src={heroImageUrl}
          alt={data.name}
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tight uppercase leading-none drop-shadow-lg">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 text-lg text-white font-bold mb-0 drop-shadow-md">
              <MapPin className="text-[#B2F35F]" size={20} />
              {data.region}, {data.province}, {data.country}
            </div>
          </div>
        </div>
      </header>

      {/* Tags — moved below hero for photography-first clarity */}
      {data.tags.length > 0 && (
        <div className="bg-white border-b border-gray-100 py-3 px-4 md:px-8">
          <div className="container mx-auto flex flex-wrap gap-2">
            {data.tags.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600"
              >
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* STATIC NAVIGATION */}
      <nav className="bg-white border-b border-gray-200 py-4 shadow-sm mb-8">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 min-w-max">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider py-2 border-b-2 transition-all ${
                  activeSection === item.id
                    ? "border-[#B2F35F] text-black"
                    : "border-transparent text-gray-500 hover:text-black"
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
      <main className="container mx-auto px-4 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-16">
          {/* 1. OVERVIEW */}
          <section id="overview" className="scroll-mt-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Mountain}
                label="Altitude"
                value={`${data.altitude} masl`}
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
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Why Visit
                </p>
                <ul className="space-y-2">
                  {data.main_attractions.slice(0, 3).map((attr, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-jvto-green font-black mt-0.5" aria-hidden="true">✓</span>
                      <span>{attr.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="prose prose-lg text-gray-700 max-w-none mb-8">
              <p className="font-light text-xl leading-relaxed italic pl-0 mb-6">
                {data.summary}
              </p>
              <div className="text-base text-gray-600 whitespace-pre-line">
                {data.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.main_attractions.map((h, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-[#B2F35F] transition-colors">
                    <Star size={18} className="text-black" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{h.title}</h4>
                  <p className="text-sm text-gray-500">{h.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. LOGISTICS */}
          <section id="logistics" className="scroll-mt-10">
            <SectionHeader title="Trail & Logistics" icon={Footprints} />

            {/* Trail stats */}
            {routeStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <Route size={18} className="text-jvto-green shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Distance</p>
                    <p className="text-white font-bold text-sm">{routeStats.length_km.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <TrendingUp size={18} className="text-jvto-green shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Elev. Gain</p>
                    <p className="text-white font-bold text-sm">+{routeStats.elev_gain_m} m</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <Mountain size={18} className="text-jvto-green shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Max Elev.</p>
                    <p className="text-white font-bold text-sm">{routeStats.elev_max_m} m</p>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
                  <Mountain size={18} className="text-slate-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Min Elev.</p>
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
                <p className="text-[9px] text-slate-700 mt-2 text-right">
                  Route data: AllTrails.com · 3D terrain via Mapbox
                </p>
              </div>
            )}

            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden mb-8">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Wind size={18} className="text-black" /> Terrain & Trail
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {data.terrain}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {data.trail_details}
                    </p>
                    <div className="text-sm bg-gray-100 p-3 rounded border border-gray-200">
                      <span className="text-gray-500 block mb-1 uppercase text-[10px] font-bold">
                        Best Time to Visit
                      </span>
                      <span className="text-gray-900 font-medium">
                        {data.best_time_to_visit}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <HardHat size={18} className="text-black" /> Required Gear
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.required_gear.map((gear, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-[#B2F35F] fill-black"
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
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100 bg-gray-50/50">
                {data.environmental_factors.map((env, i) => (
                  <div key={i} className="p-4 text-center">
                    <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                      {env.factor.replace("_", " ")}
                    </p>
                    <p className="text-gray-900 font-bold text-sm">
                      {env.value}{" "}
                      <span className="text-[10px] font-normal text-gray-500">
                        {env.unit || ""}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-sm">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <Info size={18} /> Visitor Tips
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {data.tips_for_visitors}
              </p>
            </div>
          </section>

          {/* 3. SAFETY */}
          <section id="safety" className="scroll-mt-10">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Safety Protocol" icon={ShieldAlert} />
              <div className="px-3 py-1 rounded bg-red-100 border border-red-200 text-red-600 text-xs font-bold uppercase flex items-center gap-2">
                <AlertTriangle size={14} /> High Caution Area
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {data.risk_factors.map((risk, i) => (
                <RiskAccordion key={i} risk={risk} />
              ))}
            </div>

            <div className="p-5 rounded-sm bg-gray-100 border border-gray-200">
              <h5 className="font-bold text-gray-900 text-sm mb-3">
                Important Safety Notes
              </h5>
              <ul className="space-y-2">
                {data.safety_notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-red-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Official PVMBG recommendations — sourced from live MAGMA feed */}
            {volcanicStatus?.pvmbg_report?.recommendations_en?.length ? (
              <div className="p-5 rounded-sm bg-red-50 border border-red-100">
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
          <section id="culture" className="scroll-mt-10">
            <SectionHeader title="Cultural Significance" icon={Award} />
            <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-sm relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-lg text-gray-600 italic mb-6 leading-relaxed">
                  "{data.cultural_context}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.local_tribes.map((tribe) => (
                    <span
                      key={tribe}
                      className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-600 font-medium"
                    >
                      {tribe} Tribe
                    </span>
                  ))}
                </div>
              </div>
              <Flame className="absolute -bottom-10 -right-10 text-gray-100 w-64 h-64 opacity-50" />
            </div>
          </section>

          {/* Tours Including This Destination */}
          {relatedTours && relatedTours.length > 0 && (
            <section className="scroll-mt-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                Tours to This Destination
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedTours.slice(0, 3).map((tour) => (
                  <DestinationTourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </section>
          )}
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
            <div className="rounded-sm p-1 bg-[#B2F35F] shadow-lg">
              <div className="bg-white rounded-sm p-6 h-full">
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Permit & Entry
                  </p>
                  <h3 className="text-xl font-black text-gray-900">
                    Information
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="text-sm bg-gray-50 p-3 rounded-sm border border-gray-100">
                    <p className="font-bold text-gray-900 mb-1">
                      Permit Details
                    </p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {data.permit_details}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Permit Status</span>
                    <span className="text-gray-900 flex items-center gap-1 font-bold">
                      {data.permit_required ? (
                        <CheckCircle2 size={14} className="text-black" />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      Required
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Guide Status</span>
                    <span className="text-gray-900 flex items-center gap-1 font-bold">
                      {data.guide_required ? (
                        <CheckCircle2 size={14} className="text-black" />
                      ) : (
                        <XCircle size={14} />
                      )}{" "}
                      Mandatory
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-gray-400">
                  Operated by JVTO • Police-Led Safety
                </p>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} /> Seasonality
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {data.weather_by_season}
              </p>
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                <strong>Rainfall:</strong> {data.rainfall_intensity}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
