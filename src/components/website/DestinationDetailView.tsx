"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Mountain, MapPin, Clock, Calendar, Navigation, Zap, AlertTriangle } from "lucide-react";
import type { FeatureCollection } from "geojson";
import type { DestinationDetail } from "@/interfaces";
import type { RouteStats } from "@/app/(website)/destinations/[slug]/page";
import type { VolcanicStatusData } from "@/components/website/VolcanicStatusBadge";
import AppLink from "@/components/website/AppLink";

const Route3DEmbedded = dynamic(
  () => import("@/components/website/Route3DEmbedded"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] md:h-[560px] rounded-[28px] bg-jvto-navy/10 flex items-center justify-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-navy/30 animate-pulse">
          Loading 3D terrain…
        </span>
      </div>
    ),
  }
);

// ─── Editorial maps (canonical per slug) ─────────────────────────────────────

const DEST_HERO_META: Record<string, {
  elevation: string; viewpoint: string; fromSurabaya: string; difficulty: string;
}> = {
  "mount-bromo": {
    elevation: "2,329 m", viewpoint: "Penanjakan · 2,770 m",
    fromSurabaya: "~3 hours", difficulty: "Easy to Moderate",
  },
  "ijen-crater": {
    elevation: "2,386 m", viewpoint: "Crater rim · 2,386 m",
    fromSurabaya: "~5 hours", difficulty: "Moderate to Hard",
  },
  "kawah-ijen": {
    elevation: "2,386 m", viewpoint: "Crater rim · 2,386 m",
    fromSurabaya: "~5 hours", difficulty: "Moderate to Hard",
  },
  "tumpak-sewu-waterfall": {
    elevation: "~120 m waterfall", viewpoint: "Canyon rim viewpoint",
    fromSurabaya: "~4 hours", difficulty: "Moderate to Hard",
  },
  "madakaripura-waterfall": {
    elevation: "~100 m waterfall", viewpoint: "Horseshoe basin",
    fromSurabaya: "~3 hours", difficulty: "Easy to Moderate",
  },
  "papuma-beach": {
    elevation: "~86 m cape", viewpoint: "Coastal headland",
    fromSurabaya: "~4 hours", difficulty: "Easy",
  },
};

const DEST_VOLCANIC_VANTAGES: Record<string, {
  accessible: { title: string; text: string };
  restricted: { title: string; text: string };
  planB: string;
}> = {
  "mount-bromo": {
    accessible: {
      title: "The core experience is unaffected.",
      text: "Penanjakan sunrise viewpoint (2,770 m), the sea-of-sand jeep traverse, and the Pura Luhur Poten temple area all sit outside the exclusion radius and remain open.",
    },
    restricted: {
      title: "The crater lip only.",
      text: "The final approach to the crater rim may fall within the exclusion zone during elevated status. JVTO will not take guests to the crater lip while restrictions are in effect.",
    },
    planB: "The Penanjakan sunrise, sea-of-sand crossing, and caldera-floor exploration are the primary experiences. Your guide confirms the adjusted itinerary before arrival. No day is lost.",
  },
  "ijen-crater": {
    accessible: {
      title: "The rim and night hike typically proceed.",
      text: "The crater rim viewpoint and blue-fire observation point remain accessible during normal operations. The night hike proceeds during the dry season (April–October).",
    },
    restricted: {
      title: "Crater floor access is regulated.",
      text: "Descending to the crater floor requires PVMBG clearance. JVTO guides assess on-site and update your itinerary if restrictions apply.",
    },
    planB: "JVTO holds BBKSDA park clearance for Ijen. If any restriction affects your route, your guide contacts you before the trek. The rim sunrise remains the primary experience.",
  },
  "kawah-ijen": {
    accessible: {
      title: "The rim and night hike typically proceed.",
      text: "The crater rim viewpoint and blue-fire observation point remain accessible during normal operations. The night hike proceeds during the dry season (April–October).",
    },
    restricted: {
      title: "Crater floor access is regulated.",
      text: "Descending to the crater floor requires PVMBG clearance. JVTO guides assess on-site and update your itinerary if restrictions apply.",
    },
    planB: "JVTO holds BBKSDA park clearance for Ijen. If any restriction affects your route, your guide contacts you before the trek. The rim sunrise remains the primary experience.",
  },
};

const WHY_TILES = [
  {
    title: "Police-led",
    desc: "Founder Mr. Sam (Bripka Agung Sambuko) is an active Ditpamobvit officer. Route decisions answer to police protocol, not marketing metrics.",
    meta: "Authority",
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: "100% private",
    desc: "Your own vehicle, driver, and crew — no shared jeeps, no strangers, no compromise on timing or pace.",
    meta: "Private",
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      </svg>
    ),
  },
  {
    title: "All-inclusive",
    desc: "Transport, entrance fees, accommodation, water, and T-shirt bundled. No surprise local payments on the day.",
    meta: "Written inclusions",
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    title: "Verifiable",
    desc: "NIB 1102230032918 checkable at OSS. POLPAR, BBKSDA, and HPWKI credentials listed. Every document publicly verifiable before you pay.",
    meta: "Proof library",
    Icon: () => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 4v16"/>
      </svg>
    ),
  },
];

const GENERIC_INCLUSIONS = [
  "Private AC transport (fuel, tolls, parking)",
  "Dedicated driver and English-speaking guide",
  "BBKSDA national-park entrance fees",
  "Daily mineral water · JVTO T-shirt",
  "Accommodation & breakfast (overnight packages)",
];

// ─── Inline SVG helpers ───────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const CheckMark = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-jvto-lime shrink-0" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function DestinationDetailView({
  data,
  routeStats,
  volcanicStatus,
  slug = "",
}: {
  data: DestinationDetail;
  routeStats?: RouteStats | null;
  volcanicStatus?: VolcanicStatusData | null;
  slug?: string;
}) {
  const heroMeta = DEST_HERO_META[slug] ?? {
    elevation: `${data.altitude} m`,
    viewpoint: data.region,
    fromSurabaya: data.duration,
    difficulty: data.difficulty_level,
  };

  const displayHeight = data.display_height_m
    ? data.category === "volcano"
      ? `${data.display_height_m.toLocaleString()} m`
      : data.category === "waterfall"
      ? `~${data.display_height_m} m drop`
      : `~${data.display_height_m} m`
    : heroMeta.elevation;

  const demandDots = data.physical_demand
    ? "●".repeat(data.physical_demand) + "○".repeat(5 - data.physical_demand)
    : null;

  const volcanicVantage = volcanicStatus ? (DEST_VOLCANIC_VANTAGES[slug] ?? null) : null;

  const inclusions =
    slug === "mount-bromo"
      ? [...GENERIC_INCLUSIONS, "Bromo 4WD private jeep"]
      : GENERIC_INCLUSIONS;

  const primaryAsset = data.destination_assets?.find((a) => a.type === "primary");
  const heroImageUrl = primaryAsset?.asset?.url ?? data.featured_image;

  const quickFacts = [
    { Icon: Mountain,   label: "Elevation",        value: displayHeight },
    { Icon: MapPin,     label: "Location",         value: `${data.region}, ${data.province}` },
    { Icon: Navigation, label: "Trailhead",        value: data.trailhead ?? heroMeta.viewpoint },
    { Icon: Clock,      label: "From Surabaya",    value: heroMeta.fromSurabaya },
    { Icon: Calendar,   label: "Best season",      value: data.best_time_to_visit ?? "Dry: Apr–Oct" },
    { Icon: Zap,        label: "Physical demand",  value: demandDots ?? heroMeta.difficulty },
  ];

  return (
    <div className="min-h-screen bg-[#F6F5F2]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="relative min-h-[72vh] md:min-h-[80vh] w-full overflow-hidden bg-jvto-navy flex flex-col justify-end">
        {heroImageUrl && (
          <>
            <div className="absolute inset-0 bg-black/20 z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/30 to-transparent z-[1]" />
            <Image
              src={heroImageUrl}
              alt={data.name}
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              sizes="100vw"
            />
          </>
        )}
        <div className="relative z-[2] pb-14 md:pb-20 px-6 md:px-8 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-end">

            {/* Left: heading + lede */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.07] font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {data.region} · East Java
                </span>
              </div>
              <h1
                className="font-black text-white leading-[0.98] mb-3"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(40px, 6.5vw, 86px)",
                  letterSpacing: "-0.035em",
                }}
              >
                {data.name}
              </h1>
              {data.nickname && (
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange/80 mb-4">
                  {data.nickname}
                </p>
              )}
              {data.summary && (
                <p className="text-white/65 text-[17px] font-light leading-relaxed max-w-[54ch]">
                  {data.summary}
                </p>
              )}
            </div>

            {/* Right: meta block */}
            <div className="bg-white/[0.06] border border-white/10 rounded-[20px] p-5 md:p-6 backdrop-blur-sm">
              {[
                { k: "Elevation",     v: displayHeight },
                { k: "Trailhead",     v: data.trailhead ?? heroMeta.viewpoint },
                { k: "From Surabaya", v: heroMeta.fromSurabaya },
                { k: "Difficulty",    v: heroMeta.difficulty },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="flex justify-between items-center border-b border-white/10 last:border-0 py-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {k}
                  </span>
                  <strong className="text-white font-semibold text-sm text-right max-w-[55%] leading-snug">
                    {v}
                  </strong>
                </div>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* ── Quick Facts ──────────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {quickFacts.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-[20px] p-5 md:p-6 border border-[#E3E0DA]"
                style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
              >
                <Icon size={20} className="text-jvto-orange mb-3" />
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] mb-1.5">
                  {label}
                </p>
                <p
                  className="font-black text-jvto-navy leading-tight"
                  style={{ fontFamily: "Raleway, Georgia, serif", fontSize: "clamp(15px,1.8vw,19px)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <section
        className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Text */}
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] mb-4">
                Destination overview
              </p>
              <h2
                className="font-black text-jvto-navy leading-[1.02] mb-6"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(26px, 3vw, 42px)",
                  letterSpacing: "-0.025em",
                }}
              >
                {data.description?.split(".")[0]?.trim()}.
              </h2>
              <div className="space-y-4">
                {data.description &&
                  data.description
                    .split(/\n\n/)
                    .slice(0, 3)
                    .map((para, i) => (
                      <p key={i} className="text-[17px] text-[#6b7280] font-light leading-relaxed">
                        {para.trim()}
                      </p>
                    ))}
              </div>
            </div>

            {/* Image */}
            <div
              className="relative rounded-[40px] overflow-hidden bg-jvto-navy"
              style={{
                aspectRatio: "4/5",
                boxShadow: "0 30px 60px -25px rgba(13,27,42,0.22), 0 4px 12px -4px rgba(13,27,42,0.06)",
              }}
            >
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt={data.name}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1C2E40] to-jvto-navy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/40 via-transparent to-transparent" />
            </div>

          </div>

          {/* Attractions grid */}
          {data.main_attractions?.length > 0 && (
            <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.main_attractions.slice(0, 4).map((attr, i) => (
                <div
                  key={i}
                  className="bg-[#F6F5F2] rounded-[20px] p-6 border border-[#E3E0DA]"
                >
                  <p
                    className="font-black text-jvto-navy text-base mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    {attr.title}
                  </p>
                  <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                    {attr.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Key highlights — distinguishing features */}
          {data.key_highlights?.length > 0 && (
            <div className="mt-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] mb-4">
                What makes it remarkable
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.key_highlights.slice(0, 4).map((kh, i) => (
                  <div
                    key={i}
                    className="bg-jvto-navy rounded-[20px] p-6"
                  >
                    <p
                      className="font-black text-white text-base mb-2"
                      style={{ fontFamily: "Raleway, Georgia, serif" }}
                    >
                      {kh.title}
                    </p>
                    <p className="text-sm text-white/55 font-light leading-relaxed">
                      {kh.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Volcanic Status (Bromo / Ijen only) ──────────────────────────── */}
      {volcanicStatus && (
        <section
          className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">

            <div className="mb-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-2">
                Verify before travel
              </p>
              <h2
                className="font-black text-jvto-navy leading-[1.02]"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 50px)",
                  letterSpacing: "-0.03em",
                }}
              >
                Volcanic status <span className="text-jvto-orange">notice.</span>
              </h2>
            </div>

            {/* Gold alert */}
            <div className="flex gap-4 p-5 md:p-6 rounded-[20px] bg-[#FEF7E6] border border-[#F5A623]/30 mb-5">
              <AlertTriangle size={20} className="text-[#F5A623] shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A6A05] mb-1">
                  {volcanicStatus.alert_level ?? "Elevated status"}
                </p>
                <p className="text-[15px] text-[#6b7280] font-light leading-relaxed">
                  {volcanicStatus.notes ??
                    `PVMBG has issued an elevated notice for ${data.name}. Verify the current PVMBG/BBKSDA status before you travel — this notice reflects a one-time reading, not a live feed.`}
                </p>
                {volcanicStatus.source_url && (
                  <a
                    href={volcanicStatus.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A6A05]/70 hover:text-[#9A6A05] transition-colors mt-2"
                  >
                    PVMBG source ↗
                  </a>
                )}
              </div>
            </div>

            {/* Vantage cards */}
            {volcanicVantage && (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div
                    className="bg-white rounded-[20px] p-6 border border-[#E3E0DA] border-l-[3px] border-l-jvto-lime"
                    style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-lime mb-2">
                      Fully accessible
                    </p>
                    <h3
                      className="font-black text-jvto-navy text-base mb-2"
                      style={{ fontFamily: "Raleway, Georgia, serif" }}
                    >
                      {volcanicVantage.accessible.title}
                    </h3>
                    <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                      {volcanicVantage.accessible.text}
                    </p>
                  </div>
                  <div
                    className="bg-white rounded-[20px] p-6 border border-[#E3E0DA] border-l-[3px] border-l-[#F5A623]"
                    style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
                  >
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A6A05] mb-2">
                      Currently restricted
                    </p>
                    <h3
                      className="font-black text-jvto-navy text-base mb-2"
                      style={{ fontFamily: "Raleway, Georgia, serif" }}
                    >
                      {volcanicVantage.restricted.title}
                    </h3>
                    <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                      {volcanicVantage.restricted.text}
                    </p>
                  </div>
                </div>

                {/* Lime callout */}
                <div className="flex gap-4 p-5 md:p-6 rounded-[20px] bg-jvto-lime/[0.07] border border-jvto-lime/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-jvto-lime shrink-0 mt-0.5" aria-hidden="true">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-lime mb-1">
                      Effect on your itinerary · minimal
                    </p>
                    <p className="text-[15px] text-[#6b7280] font-light leading-relaxed">
                      {volcanicVantage.planB}
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>
        </section>
      )}

      {/* ── Why JVTO ─────────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[5]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.22)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-10 md:mb-14">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-2">
              Police-led · private · verifiable
            </p>
            <h2
              className="font-black text-white leading-[1.02]"
              style={{
                fontFamily: "Raleway, Georgia, serif",
                fontSize: "clamp(28px, 3.8vw, 50px)",
                letterSpacing: "-0.03em",
              }}
            >
              Why JVTO for <span className="text-jvto-orange">{data.name}.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_TILES.map(({ title, desc, meta, Icon }) => (
              <div
                key={title}
                className="bg-white/[0.05] border border-white/10 rounded-[20px] p-6 md:p-7"
              >
                <div className="text-jvto-lime mb-4">
                  <Icon />
                </div>
                <h3
                  className="font-black text-white text-lg mb-2"
                  style={{ fontFamily: "Raleway, Georgia, serif" }}
                >
                  {title}
                </h3>
                <p className="text-white/55 text-sm font-light leading-relaxed mb-4">
                  {desc}
                </p>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tours / Packages ─────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[6]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-10 md:mb-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-2">
              Book your trip
            </p>
            <h2
              className="font-black text-jvto-navy leading-[1.02]"
              style={{
                fontFamily: "Raleway, Georgia, serif",
                fontSize: "clamp(28px, 3.8vw, 50px)",
                letterSpacing: "-0.03em",
              }}
            >
              {data.name} tour <span className="text-jvto-orange">packages.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <AppLink
              href="/tours/from-surabaya"
              prefetch={false}
              className="group bg-white rounded-[20px] p-6 md:p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 transition-colors"
              style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
            >
              <div className="mb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white bg-jvto-navy px-3 py-1.5 rounded-full">
                  From Surabaya
                </span>
              </div>
              <h3
                className="font-black text-jvto-navy text-xl mb-2"
                style={{ fontFamily: "Raleway, Georgia, serif" }}
              >
                {data.name} from Surabaya
              </h3>
              <p className="text-sm text-[#6b7280] font-light leading-relaxed mb-5">
                Midnight departure. Private vehicle, sunrise at the viewpoint, dedicated crew throughout.
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                View packages <ArrowRight />
              </span>
            </AppLink>
            <AppLink
              href="/tours/from-bali"
              prefetch={false}
              className="group bg-white rounded-[20px] p-6 md:p-7 border border-[#E3E0DA] hover:border-jvto-orange/30 transition-colors"
              style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
            >
              <div className="mb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white bg-jvto-navy px-3 py-1.5 rounded-full">
                  From Bali
                </span>
              </div>
              <h3
                className="font-black text-jvto-navy text-xl mb-2"
                style={{ fontFamily: "Raleway, Georgia, serif" }}
              >
                {data.name} from Bali
              </h3>
              <p className="text-sm text-[#6b7280] font-light leading-relaxed mb-5">
                Cross-island private package. Bali pickup, East Java circuit, return or drop at your next stop.
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                View packages <ArrowRight />
              </span>
            </AppLink>
          </div>
          <p className="text-center font-mono text-[11px] text-[#9ca3af] tracking-[0.14em] uppercase">
            Multi-destination packages (3D2N to 6D5N) also available ·{" "}
            <AppLink href="/tours" prefetch={false} className="text-jvto-navy hover:text-jvto-orange transition-colors">
              See full list
            </AppLink>
          </p>
        </div>
      </section>

      {/* ── Practical Info ────────────────────────────────────────────────── */}
      <section
        className="bg-white py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[7]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-10 md:mb-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] mb-2">
              Plan your day
            </p>
            <h2
              className="font-black text-jvto-navy leading-[1.02]"
              style={{
                fontFamily: "Raleway, Georgia, serif",
                fontSize: "clamp(28px, 3.8vw, 50px)",
                letterSpacing: "-0.03em",
              }}
            >
              Practical <span className="text-jvto-orange">information.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

            {/* Left prose */}
            <div className="space-y-7">
              {data.best_time_to_visit && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Best season
                  </h3>
                  <p className="text-[16px] text-[#6b7280] font-light leading-relaxed">
                    {data.best_time_to_visit}
                  </p>
                </div>
              )}
              {data.temperature_range && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Temperature
                  </h3>
                  <p className="text-[16px] text-[#6b7280] font-light leading-relaxed">
                    {data.temperature_range}. Warm layers are recommended — wind chill at viewpoints is significant regardless of daytime temperatures lower down.
                  </p>
                </div>
              )}
              {(data.physical_requirements || data.terrain) && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Physical requirements
                  </h3>
                  <p className="text-[16px] text-[#6b7280] font-light leading-relaxed">
                    {data.physical_requirements ?? data.terrain}
                  </p>
                </div>
              )}
              {data.tips_for_visitors && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Visitor tips
                  </h3>
                  <p className="text-[16px] text-[#6b7280] font-light leading-relaxed">
                    {data.tips_for_visitors}
                  </p>
                </div>
              )}
              {data.cultural_context && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-2"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Cultural context
                  </h3>
                  <p className="text-[16px] text-[#6b7280] font-light leading-relaxed">
                    {data.cultural_context}
                  </p>
                </div>
              )}
              {data.safety_notes?.length > 0 && (
                <div>
                  <h3
                    className="font-black text-jvto-navy text-lg mb-3"
                    style={{ fontFamily: "Raleway, Georgia, serif" }}
                  >
                    Safety notes
                  </h3>
                  <ul className="space-y-2.5">
                    {data.safety_notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <AlertTriangle size={14} className="text-jvto-orange shrink-0 mt-1" />
                        <span className="text-[15px] text-[#6b7280] font-light leading-relaxed">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right data boxes */}
            <div className="space-y-4">
              <div className="bg-[#F6F5F2] rounded-[20px] p-6 border border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-4">
                  Included on all {data.name} packages
                </p>
                <ul className="space-y-3">
                  {inclusions.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-jvto-navy font-light">
                      <CheckMark /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#F6F5F2] rounded-[20px] p-6 border border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-3">
                  Not included
                </p>
                <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                  Flights · gratuities (guest discretion) · personal expenses · optional horse riding arranged on-site where available.
                </p>
              </div>
              {data.permit_details && (
                <div className="bg-[#F6F5F2] rounded-[20px] p-6 border border-[#E3E0DA]">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-3">
                    Permit & entry
                  </p>
                  <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                    {data.permit_details}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Trek & Terrain Profile ────────────────────────────────────────── */}
      {routeStats && (
        <section
          className="bg-[#F6F5F2] py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[8]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="mb-10 md:mb-12">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] mb-2">
                {heroMeta.difficulty} · {displayHeight}
              </p>
              <h2
                className="font-black text-jvto-navy leading-[1.02]"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 50px)",
                  letterSpacing: "-0.03em",
                }}
              >
                Trek &amp; terrain <span className="text-jvto-orange">profile.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-[260px_1fr] gap-8 md:gap-12">

              {/* Stats panel */}
              <div
                className="bg-white rounded-[20px] p-6 border border-[#E3E0DA] h-fit"
                style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-1">
                  Difficulty
                </p>
                <p
                  className="font-black text-jvto-navy text-xl mb-6"
                  style={{ fontFamily: "Raleway, Georgia, serif" }}
                >
                  {heroMeta.difficulty}
                </p>
                {[
                  { k: "Distance",      v: `${routeStats.length_km.toFixed(1)} km` },
                  { k: "Elev. gain",    v: `+${routeStats.elev_gain_m} m` },
                  { k: "Max elevation", v: `${routeStats.elev_max_m} m` },
                  { k: "Min elevation", v: `${routeStats.elev_min_m} m` },
                  { k: "Best season",   v: data.best_time_to_visit ?? "Dry: Apr–Oct" },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between border-b border-[#F6F5F2] py-2.5 last:border-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af]">{k}</span>
                    <span className="font-semibold text-sm text-jvto-navy">{v}</span>
                  </div>
                ))}
              </div>

              {/* 3D terrain + details */}
              <div className="space-y-6">
                <Route3DEmbedded
                  slug={routeStats.slug}
                  routeStats={routeStats}
                  geojson={data.route_geojson as FeatureCollection | null | undefined}
                />
                <p className="text-[10px] text-[#9ca3af] text-right font-mono">
                  Route data: AllTrails.com · 3D terrain via Mapbox
                </p>

                {data.trail_details && (
                  <div
                    className="bg-white rounded-[20px] p-6 border border-[#E3E0DA]"
                    style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
                  >
                    <h3
                      className="font-black text-jvto-navy text-base mb-3"
                      style={{ fontFamily: "Raleway, Georgia, serif" }}
                    >
                      On the trail
                    </h3>
                    <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                      {data.trail_details}
                    </p>
                  </div>
                )}

                {data.required_gear?.length > 0 && (
                  <div
                    className="bg-white rounded-[20px] p-6 border border-[#E3E0DA]"
                    style={{ boxShadow: "0 2px 8px -4px rgba(13,27,42,0.06)" }}
                  >
                    <h3
                      className="font-black text-jvto-navy text-base mb-4"
                      style={{ fontFamily: "Raleway, Georgia, serif" }}
                    >
                      What to bring
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.required_gear.map((gear) => (
                        <span
                          key={gear}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/25 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-jvto-navy"
                        >
                          <CheckMark />
                          {gear.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.environmental_factors?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.environmental_factors.map((env) => (
                      <div
                        key={env.factor}
                        className="bg-white rounded-[16px] p-4 border border-[#E3E0DA] text-center"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af] mb-1">
                          {env.factor.replace(/_/g, " ")}
                        </p>
                        <p className="font-semibold text-jvto-navy text-sm">
                          {env.value}{" "}
                          {env.unit && (
                            <span className="font-normal text-[#9ca3af] text-xs">{env.unit}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-24 md:py-32 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[9]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.22)" }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-4"
            style={{
              fontFamily: "Raleway, Georgia, serif",
              fontSize: "clamp(30px, 4.5vw, 58px)",
              letterSpacing: "-0.03em",
            }}
          >
            Visit <span className="text-jvto-orange">{data.name}</span> with JVTO.
          </h2>
          <p className="text-white/55 text-[17px] font-light mb-10 max-w-[46ch] mx-auto">
            Police-led. 100% private. BBKSDA clearance in hand. Verifiable before you pay.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <AppLink
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              View {data.name} packages <ArrowRight />
            </AppLink>
            <AppLink
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              WhatsApp us
            </AppLink>
          </div>
        </div>
      </section>

    </div>
  );
}
