// @ts-nocheck
"use client";

import { useMemo, useState, useEffect } from "react";
import { TourPackageDetail } from "@/interfaces";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import TourRequirements from "./TourRequirements";
import type { IjenCraterRequirementsContent } from "@/lib/ecosystemContent/ijenCraterRequirements";
import LegalBadge from "@/components/website/LegalBadge";
// NOTE: the commented-out ReviewStats block below (~1447–1609) used to reference a
// hardcoded AGGREGATE_RATING constant. That constant carried a stale blended
// 4.91 / 203 and has been deleted. If that block is ever uncommented, feed it the
// live Google Maps figure — `getPublicAggregateRating()` on the server, drilled in
// as a prop (this is a Client Component and cannot read it directly).
import AuthorityShield from "@/components/website/AuthorityShield";
import TrustBar, { type TrustBarReviewProfile } from "@/components/website/TrustBar";
import Image from "next/image";
import ReviewsClient from "@/components/website/Home/ReviewsClient";
// import Reviews from "@/components/website/Home/Reviews";
import Link from "next/link";
import { getTourSpineQaPairs } from "@/lib/tourFaqs";

// Import CSS Swiper (Wajib)
import "swiper/css";
import "swiper/css/pagination";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Check,
  X,
  Shield,
  Users,
  Calendar,
  Flame,
  Mountain,
  Waves,
  Car,
  Footprints,
  Camera,
  Coffee,
  Heart,
  Star,
  Utensils,
  Home,
  Ticket,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Bed,
  Briefcase,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle,
  Activity,
  Thermometer,
  ShoppingBag,
  Award,
  Stethoscope,
  HardHat,
  Message,
  Search,
  Quote,
  MessageCircle,
} from "lucide-react";

/**
 * Section head. The page used to open every block with a 32×4 lime tick beside
 * a 24px uppercase Inter line — the quietest device on the site while every
 * neighbouring surface had moved to the Raleway display face and a full-width
 * rule. This is that same idea at the scale the rest of the site already uses.
 */
function SectionHead({
  children,
  kicker,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  kicker?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2
          className={`font-black leading-[1.02] ${isDark ? "text-white" : "text-jvto-navy"}`}
          style={{
            fontFamily: "Raleway, Georgia, serif",
            fontSize: "clamp(26px, 3.4vw, 42px)",
            letterSpacing: "-0.03em",
          }}
        >
          {children}
        </h2>
        {kicker ? (
          <span
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-jvto-muted"}`}
          >
            {kicker}
          </span>
        ) : null}
      </div>
      <div
        className={`mt-5 h-px w-full ${isDark ? "bg-white/12" : "bg-jvto-border"}`}
      >
        <div className="h-px w-16 bg-jvto-orange" />
      </div>
    </div>
  );
}

interface Props {
  initialData: TourPackageDetail;
  reviews?: any[];
  /** AEO/GEO port (2026-04-29): when true, includes the Ijen-specific spine Q&A pair (BBKSDA SE.1658). */
  ijenRelevant?: boolean;
  /**
   * Per-platform review profiles from getEcosystemReviewProfiles(), fetched by the
   * Server Component page. Drilled through because TrustBar sits in the client bundle.
   */
  reviewProfiles?: TrustBarReviewProfile[];
  /**
   * Ijen Crater mandatory-requirements table + FAQ from
   * getEcosystemIjenCraterRequirements(), fetched by the Server Component page.
   * Drilled through because TourRequirements sits in the client bundle.
   */
  ijenCraterRequirements?: Partial<IjenCraterRequirementsContent> | null;
}

// ... (Utilities formatCurrency & getPriceForPax TETAP SAMA) ...
function formatCurrency(value: number) {
  return `IDR ${Math.round(value).toLocaleString("id-ID")}`;
}

function getPriceForPax(pax: number, tiers: any[]) {
  if (!tiers || !tiers.length) return null;
  const tier = tiers.find((t) => {
    const minOk = pax >= t.paxMin;
    const maxOk = t.paxMax === 0 ? true : pax <= t.paxMax;
    return minOk && maxOk;
  });
  return tier ? tier.pricePerPerson : null;
}

// Helper icons
function getActivityIcon(name: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes("jeep") ||
    lower.includes("transfer") ||
    lower.includes("journey") ||
    lower.includes("transport")
  )
    return <Car size={18} className="text-white" />;
  if (
    lower.includes("trek") ||
    lower.includes("hike") ||
    lower.includes("walk")
  )
    return <Footprints size={18} className="text-white" />;
  if (
    lower.includes("photo") ||
    lower.includes("view") ||
    lower.includes("sight")
  )
    return <Camera size={18} className="text-white" />;
  if (
    lower.includes("meal") ||
    lower.includes("lunch") ||
    lower.includes("dinner") ||
    lower.includes("breakfast")
  )
    return <Coffee size={18} className="text-white" />;
  return <MapPin size={18} className="text-white" />;
}

function getInclusionIcon(text: string) {
  const lower = text.toLowerCase();
  if (
    lower.includes("transport") ||
    lower.includes("jeep") ||
    lower.includes("vehicle")
  )
    return <Car size={20} className="text-jvto-lime" />;
  if (lower.includes("guide"))
    return <UserCheck size={20} className="text-jvto-lime" />;
  if (lower.includes("hotel") || lower.includes("accommodation"))
    return <Home size={20} className="text-jvto-lime" />;
  if (
    lower.includes("meal") ||
    lower.includes("breakfast") ||
    lower.includes("water")
  )
    return <Utensils size={20} className="text-jvto-lime" />;
  if (
    lower.includes("ticket") ||
    lower.includes("entrance") ||
    lower.includes("permit")
  )
    return <Ticket size={20} className="text-jvto-lime" />;
  if (
    lower.includes("equipment") ||
    lower.includes("mask") ||
    lower.includes("pole")
  )
    return <Mountain size={20} className="text-jvto-lime" />;
  return <Check size={20} className="text-jvto-lime" />;
}

// ... (Helper getExperienceIcon juga TETAP SAMA jika ada) ...
function getExperienceIcon(name: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes("waterfall") ||
    lower.includes("air") ||
    lower.includes("tumpak")
  )
    return <Waves size={24} className="text-jvto-orange" />;
  if (
    lower.includes("bromo") ||
    lower.includes("mount") ||
    lower.includes("sunrise")
  )
    return <Mountain size={24} className="text-jvto-orange" />;
  if (
    lower.includes("ijen") ||
    lower.includes("fire") ||
    lower.includes("blue")
  )
    return <Flame size={24} className="text-jvto-orange" />;
  return <MapPin size={24} className="text-jvto-orange" />;
}
function calculateDownPayment(dateStr: string, total: number) {
  if (!dateStr) return 0;

  // Parse input "YYYY-MM-DD" menjadi tahun, bulan, tanggal local
  const [y, m, d] = dateStr.split("-").map(Number);
  const tripDate = new Date(y, m - 1, d); // Bulan di JS mulai dari 0
  tripDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hitung selisih hari
  const diffTime = tripDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(`📅 Date Check: Trip=${dateStr}, H-${diffDays}`);

  // Jika H-7 atau kurang (bahkan minus/hari H), wajib Full Payment
  if (diffDays <= 7) {
    return total;
  }
  // Jika lebih dari 7 hari, DP 20%
  return Math.ceil(total * 0.2);
}
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

export default function PackageDetailPage({ initialData, reviews, ijenRelevant = false, reviewProfiles = [], ijenCraterRequirements = null }: Props) {
  const router = useRouter();
  const pkg = initialData.product;

  // AEO/GEO port (2026-04-29): canonical spine Q&A pairs for visible AnswerBlock cluster.
  // Same source as the FAQPage JSON-LD on the server (single source of truth via lib/tourFaqs.ts).
  // Inlined here to avoid prop drilling 4-5 strings; pure data: zero runtime cost.
  const spineQaPairs = getTourSpineQaPairs({ ijenRelevant }, reviewProfiles);

  // --- STATE ---
  // State untuk Hero Background (tetap ada jika ingin bisa ganti hero, tapi trigger lightbox beda)
  const [heroImage, setHeroImage] = useState(pkg.imageUrl || pkg.gallery[0]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isInclusionsExpanded, setIsInclusionsExpanded] = useState(false); // <--- STATE KHUSUS INI
  const [showTravelersPicker, setShowTravelersPicker] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [modalOpenDay, setModalOpenDay] = useState<number>(1); // Tab aktif di dalam modal

  // State Lightbox Gallery
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // State Booking Form
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [startDate, setStartDate] = useState("");
  const [pax, setPax] = useState<number | string>(
    pkg.channelMetadata.minPaxOperational,
  );
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const isTransportItem = (type: string | null | undefined) =>
    type === "transport";

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight")
        setPhotoIndex((prev) => (prev + 1) % pkg.gallery.length);
      if (e.key === "ArrowLeft")
        setPhotoIndex(
          (prev) => (prev - 1 + pkg.gallery.length) % pkg.gallery.length,
        );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, pkg.gallery.length]);

  const getDayImage = (dayNum: number) => {
    return pkg.gallery && pkg.gallery[dayNum - 1]
      ? pkg.gallery[dayNum - 1]
      : pkg.imageUrl;
  };

  const pricePerPerson = useMemo(
    () => getPriceForPax(Number(pax), pkg.offers.tiers),
    [pax, pkg.offers.tiers],
  );
  const total = pricePerPerson ? pricePerPerson * Number(pax) : 0;
  // --- ADD-ON LOGIC ---
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [pendingBasePayload, setPendingBasePayload] = useState<any | null>(
    null,
  );
  const [addOnSelections, setAddOnSelections] = useState(
    pkg.addOns?.map((a: any) => ({
      addOnId: a.id,
      label: a.name,
      price: a.price,
      selected: false,
      type: a.type,
      transportType: a.transportType,
      transportDestination: a.transportDestination,
    })) ?? [],
  );

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  // --- HANDLERS ---
  const finalizeBooking = (
    basePayload: any,
    addons: {
      addOnId: string;
      label: string;
      qty: number;
      price: number;
      subtotal: number;
      type?: string | null;
    }[],
  ) => {
    const addOnTotal = addons.reduce((sum, a) => sum + a.subtotal, 0);
    const grandTotal = basePayload.packageTotal + addOnTotal;

    const downPayment = calculateDownPayment(basePayload.date, grandTotal);

    const payload = {
      ...basePayload,
      packageCategory: pkg.category_id,
      packageLabel: pkg.name,
      paxMin: pkg.channelMetadata.minPaxOperational,
      priceTiers: pkg.offers.tiers,
      allAddOns: pkg.addOns,
      imageUrl: pkg.imageUrl,
      addon: addons,
      grandTotal,
      totalPackage: basePayload.packageTotal,
      totalAddons: addOnTotal,
      downPayment: downPayment,
    };
    localStorage.setItem("checkoutPayload", JSON.stringify(payload));
    router.push(`/checkout?pid=${encodeURIComponent(pkg.packageId)}`);
  };
  // Daftar tanggal yang ditutup (Format: YYYY-MM-DD)
  const BLOCKED_RANGES = [
    { start: "2026-03-16", end: "2026-03-20" },
    { start: "2026-04-05", end: "2026-04-11" },
    { start: "2026-05-01", end: "2026-05-01" },
    { start: "2026-05-30", end: "2026-05-30" },
    { start: "2026-05-02", end: "2026-05-02" },
    { start: "2026-05-29", end: "2026-06-01" },
    { start: "2026-07-25", end: "2026-07-25" },
    { start: "2026-08-11", end: "2026-08-12" },
    { start: "2026-08-14", end: "2026-08-15" },
  ];

  const isDateBlocked = (dateStr) => {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    return BLOCKED_RANGES.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return target >= start && target <= end;
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPax = Number(pax);

    if (
      !startDate ||
      !numPax ||
      numPax < pkg.channelMetadata.minPaxOperational
    ) {
      alert("Please select a valid date and number of guests.");
      return;
    }
    if (isDateBlocked(startDate)) {
      alert(
        "Sorry, registration for the selected date is fully booked or closed. Please choose another date.",
      );
      return;
    }
    const packageTotal = pricePerPerson ? pricePerPerson * pax : 0;
    const basePayload = {
      packageId: pkg.id,
      durationId: pkg.durationId,
      date: startDate,
      pax: numPax,
      pricePerPerson,
      packageTotal,
    };

    if (pkg.addOns && pkg.addOns.length > 0) {
      setPendingBasePayload(basePayload);
      setShowAddOnModal(true);
      return;
    }
    finalizeBooking(basePayload, []);
  };

  const handleConfirmAddOns = () => {
    if (!pendingBasePayload) return;
    const selectedAddOns = addOnSelections
      .filter((a) => a.selected)
      .map((a) => {
        // LOGIC PENTING: Jika Transport, Qty = 1. Jika Lainnya, Qty = Pax.
        const quantity = isTransportItem(a.type) ? 1 : Number(pax);

        return {
          addOnId: a.addOnId,
          qty: quantity,
          label: a.label,
          price: a.price,
          subtotal: quantity * a.price,
          type: a.type,
          transportType: a.transportType,
          transportDestination: a.transportDestination,
        };
      });
    finalizeBooking(pendingBasePayload, selectedAddOns);
    setShowAddOnModal(false);
    setPendingBasePayload(null);
  };

  const scrollToBooking = () => {
    const element = document.getElementById("booking-card");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="bg-jvto-off min-h-screen pb-28 lg:pb-20 font-sans text-jvto-navy">
      {/* 1. HERO — the decision opens here: identity on the left, evidence and
          the action on the right. DS v2 vocabulary (navy ground, Raleway
          display, mono chrome, orange action) so the page reads as the same
          site as the card the visitor just clicked. */}
      <header className="relative min-h-[68vh] md:min-h-[76vh] w-full overflow-hidden bg-jvto-navy flex flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={pkg.name}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-jvto-navy/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy via-jvto-navy/55 to-jvto-navy/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-jvto-navy/75 via-transparent to-transparent" />
        </div>


        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pb-12 md:pb-16 pt-[148px] md:pt-[190px]">
          <div className="grid md:grid-cols-[1.45fr_1fr] gap-10 md:gap-14 items-end">

            {/* Identity */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {pkg.route.map((stop: string) => (
                  <span
                    key={stop}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.07] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
                  >
                    {stop}
                  </span>
                ))}
              </div>

              <h1
                className="font-black text-white leading-[0.96] mb-5"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(38px, 6vw, 78px)",
                  letterSpacing: "-0.035em",
                }}
              >
                {pkg.name}
              </h1>

              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-orange">
                <MapPin size={13} className="inline-block mb-0.5 mr-2" />
                From {pkg.originCity}, Indonesia · {pkg.marketedDurationLabel}
              </p>
            </div>

            {/* Evidence + action */}
            <div className="rounded-[20px] border border-white/15 bg-jvto-navy/45 p-5 md:p-6 backdrop-blur-md">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Starts from
              </p>
              <div className="mt-1.5 mb-5 flex items-baseline gap-2">
                <span
                  className="font-black text-white leading-none"
                  style={{
                    fontFamily: "Raleway, Georgia, serif",
                    fontSize: "clamp(28px, 3.4vw, 40px)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  / person
                </span>
              </div>

              {[
                { k: "Trip type", v: pkg.category },
                { k: "Duration", v: pkg.marketedDurationLabel },
              ].map(({ k, v }) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-white/10 py-3"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {k}
                  </span>
                  <strong className="max-w-[58%] text-right text-sm font-semibold leading-snug text-white">
                    {v}
                  </strong>
                </div>
              ))}

              <div className="flex items-center justify-between border-b border-white/10 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  Physicality
                </span>
                <div className="flex items-center gap-2.5">
                  <strong className="text-sm font-semibold capitalize text-white">
                    {pkg.physicalDifficulty}
                  </strong>
                  <div className="flex gap-1" aria-hidden>
                    <span className="h-1.5 w-4 rounded-full bg-jvto-orange" />
                    <span
                      className={`h-1.5 w-4 rounded-full ${["moderate", "hard"].includes(
                        pkg.physicalDifficulty.toLowerCase(),
                      )
                        ? "bg-jvto-orange"
                        : "bg-white/20"
                        }`}
                    />
                    <span
                      className={`h-1.5 w-4 rounded-full ${["hard"].includes(pkg.physicalDifficulty.toLowerCase())
                        ? "bg-jvto-orange"
                        : "bg-white/20"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToBooking}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-jvto-orange px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-jvto-orange-hover"
              >
                Check dates & prices <ChevronRight size={14} />
              </button>
            </div>

          </div>
        </div>
      </header>
      <AuthorityShield ijenRelevant={ijenRelevant} />
      {/* 2. THE DARK BAND — inclusions and the gallery share one navy floor so
          the page has a single dark passage between the hero and the article,
          instead of two adjacent slabs of the same grey. */}
      <section className="bg-jvto-navy text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 min-w-0">
              <SectionHead tone="dark" kicker={`${pkg.inclusions.length} items covered`}>
                {`What's Included`}
              </SectionHead>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {pkg.inclusions.slice(0, 6).map((inc, idx) => {
                  const title = inc.split(":")[0];
                  const desc = inc.split(":")[1] || inc;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="shrink-0 mt-0.5">
                        {getInclusionIcon(title)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white mb-1.5">
                          {title}
                        </h4>
                        <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-[340px] shrink-0 flex flex-col justify-between items-start rounded-[24px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-jvto-orange mb-3">
                  Hassle-free
                </p>
                <div
                  className="font-black text-white leading-[0.94] mb-3"
                  style={{
                    fontFamily: "Raleway, Georgia, serif",
                    fontSize: "clamp(34px, 4vw, 52px)",
                    letterSpacing: "-0.035em",
                  }}
                >
                  All inclusive
                </div>
                <p className="text-[13px] leading-relaxed text-white/50">
                  Meals, gear and medical checkup covered.
                </p>
              </div>
              <button
                onClick={scrollToBooking}
                className="mt-8 w-full rounded-full bg-jvto-orange px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-jvto-orange-hover"
              >
                Dates & prices
              </button>
            </div>
          </div>

          {/* 3. GALLERY STRIP (Memicu Lightbox) */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-white/10">
            <div className="flex justify-between items-baseline gap-6 mb-6">
              <h3
                className="font-black text-white leading-none"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "clamp(20px, 2.2vw, 28px)",
                  letterSpacing: "-0.03em",
                }}
              >
                {`What's it like?`}
              </h3>
              <button
                onClick={() => openLightbox(0)}
                className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange transition-colors hover:text-white"
              >
                All {pkg.gallery.length} photos <ChevronRight size={13} />
              </button>
            </div>

            {/* Mobile: horizontal scroll. Desktop: grid. */}
            <div className="flex gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-4 lg:grid-cols-6 md:pb-0 md:overflow-visible no-scrollbar">
              {pkg.gallery.slice(0, 6).map((img, idx) => (
                <button
                  key={idx}
                  aria-label={`View photo ${idx + 1} of ${pkg.gallery.length}`}
                  onClick={() => openLightbox(idx)}
                  className="group relative h-32 w-32 shrink-0 md:h-auto md:w-auto aspect-square overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.04]"
                >
                  <Image
                    src={img}
                    alt={`${pkg.name} — photo ${idx + 1}`}
                    fill
                    className="object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 768px) 128px, 200px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-jvto-navy/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full bg-white/15 p-2.5 text-white backdrop-blur-sm">
                      <Maximize2 size={15} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- LIGHTBOX POPUP --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            aria-label="Close photo gallery"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex(
                (prev) => (prev - 1 + pkg.gallery.length) % pkg.gallery.length,
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex((prev) => (prev + 1) % pkg.gallery.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
            <img
              src={pkg.gallery[photoIndex]}
              alt={`${pkg.name} — tour photo ${photoIndex + 1} of ${pkg.gallery.length}`}
              className="max-h-full max-w-full rounded-[20px] object-contain shadow-2xl"
            />
            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest backdrop-blur-sm">
              {photoIndex + 1} / {pkg.gallery.length}
            </div>
          </div>
        </div>
      )}
      {/* --- MAIN CONTENT GRID (Tetap sama) --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* LEFT COLUMN: INFO & ITINERARY */}
          <div className="lg:col-span-2 space-y-20 md:space-y-28">
            {/* Description (With Show More/Less) */}
            <div>
              <SectionHead>About This Trip</SectionHead>

              <div className="relative">
                {/* FULL HTML */}
                {isDescriptionExpanded ? (
                  <div
                    className="max-w-[640px] text-[17px] text-jvto-ink-soft leading-[1.7] transition-all duration-500"
                    dangerouslySetInnerHTML={{ __html: pkg.description }}
                  />
                ) : (
                  <div
                    className="max-w-[640px] text-[17px] text-jvto-ink-soft leading-[1.7] transition-all duration-500"
                    dangerouslySetInnerHTML={{
                      __html:
                        stripHtml(pkg.description).length < 350
                          ? pkg.description
                          : stripHtml(pkg.description).substring(0, 350) +
                          "...",
                    }}
                  />
                )}

                {/* TOGGLE BUTTON */}
                {stripHtml(pkg.description).length >= 350 && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange-ink transition-colors hover:text-jvto-navy"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Read Less <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {/* AEO/GEO port (2026-04-29): Quick Answers cluster: visible Q&A bridges that mirror */}
            {/* the FAQPage JSON-LD schema (single source of truth via getTourSpineQaPairs).         */}
            {/* Hedge against AI engines that prefer natural-language over structured data (F14).    */}
            <div>
              <SectionHead>Quick Answers</SectionHead>
              <div className="space-y-5">
                {spineQaPairs.map((qa) => (
                  <div
                    key={qa.question}
                    className="rounded-[20px] border border-jvto-border bg-white p-7 card-jvto"
                  >
                    <h3 className="text-base font-bold text-jvto-navy mb-3 leading-snug">
                      {qa.question}
                    </h3>
                    <p className="text-sm text-jvto-ink-soft leading-relaxed mb-3">
                      {qa.answer}
                    </p>
                    {qa.uiMeta && (
                      qa.uiLink ? (
                        <Link
                          href={qa.uiLink}
                          className="inline-block text-[10px] font-bold uppercase tracking-widest text-jvto-lime-ink bg-jvto-lime/5 px-3 py-1 rounded-full hover:bg-jvto-lime/15 transition-colors"
                        >
                          {qa.uiMeta} →
                        </Link>
                      ) : (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-jvto-lime-ink bg-jvto-lime/5 px-3 py-1 rounded-full">
                          {qa.uiMeta}
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Highlights (Design Gambar 2) */}
            <div>
              <SectionHead>Trip Highlights</SectionHead>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                    Key Experiences
                  </h3>
                  <div className="space-y-6">
                    {pkg.keyExperiences?.map((exp: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="p-3 bg-white border border-jvto-border shadow-sm rounded-[16px] shrink-0">
                          {getExperienceIcon(exp.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-jvto-navy text-sm md:text-base leading-tight">
                            {exp.name}
                          </h4>
                          <p className="text-sm text-jvto-ink-soft leading-relaxed mt-1">
                            {exp.highlight}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                    Why This Trip is Unique
                  </h3>
                  <ul className="space-y-4">
                    {pkg.marketing.uniqueSellingPoints?.map(
                      (point: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex gap-3 items-start text-jvto-ink-soft"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-jvto-orange shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* =========================================================
                ITINERARY SECTION (RESPONSIVE WITH MEALS)
               ========================================================= */}
            <div>
              <SectionHead kicker={`${pkg.itineraryDays.length}-day plan`}>Itinerary</SectionHead>

              {/* --- A. DESKTOP VIEW --- */}
              <div className="hidden lg:grid grid-cols-12 gap-10 items-start">
                {/* Left Day Selector (Sticky) */}
                <div className="col-span-4 space-y-3 sticky top-32 h-fit">
                  {pkg.itineraryDays.map((day) => {
                    const isActive = openDay === day.day;
                    return (
                      <button
                        key={day.day}
                        onClick={() => setOpenDay(day.day)}
                        className={`group w-full rounded-[16px] border p-4 text-left transition-all duration-300 ${isActive
                          ? "border-jvto-orange bg-white translate-x-2 shadow-[0_20px_40px_-24px_rgba(13,27,42,0.35)]"
                          : "border-jvto-border/60 bg-transparent hover:border-jvto-border hover:bg-white"
                          }`}
                      >
                        <span
                          className={`mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${isActive ? "text-jvto-orange-ink" : "text-jvto-muted"
                            }`}
                        >
                          Day {day.day.toString().padStart(2, "0")}
                        </span>
                        <h4
                          className={`font-bold text-sm leading-tight ${isActive
                            ? "text-jvto-navy"
                            : "text-jvto-muted group-hover:text-jvto-navy"
                            }`}
                        >
                          {day.title}
                        </h4>
                      </button>
                    );
                  })}
                </div>

                {/* Right Detail View */}
                <div className="col-span-8">
                  {pkg.itineraryDays.map((day) => {
                    if (openDay !== day.day) return null;

                    const dayImage =
                      pkg.gallery && pkg.gallery[day.day - 1]
                        ? pkg.gallery[day.day - 1]
                        : pkg.imageUrl;

                    return (
                      <div
                        key={day.day}
                        className="overflow-hidden rounded-[24px] border border-jvto-border bg-white animate-in fade-in slide-in-from-right-4 duration-500"
                      >
                        {/* Header Image */}
                        <div className="relative h-64 w-full">
                          <Image
                            src={dayImage}
                            alt={day.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-jvto-navy/95 via-jvto-navy/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <h3 className="text-2xl font-black uppercase leading-none mb-2">
                              {day.title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-jvto-lime uppercase tracking-wide">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />{" "}
                                {day.overnight || "On Transport"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <div className="mb-10 p-4 border border-jvto-border bg-jvto-off rounded-[16px] italic text-jvto-ink-soft text-sm leading-relaxed">
                            {`"${day.summary}"`}
                          </div>

                          {/* Timeline */}
                          <div className="relative border-l-2 border-jvto-border ml-4 space-y-10 pb-4">
                            {day.activities.map((act: any, idx: number) => (
                              <div key={idx} className="relative pl-10">
                                <div
                                  className={`absolute -left-[1.35rem] top-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-sm ${idx % 2 === 0
                                    ? "bg-jvto-lime"
                                    : "bg-jvto-navy"
                                    }`}
                                >
                                  {getActivityIcon(act.name)}
                                </div>
                                <div>
                                  <span className="inline-block mb-1.5 rounded-full bg-jvto-orange/[0.08] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-orange-ink">
                                    {act.timeWindow}
                                  </span>
                                  <h4 className="text-base font-bold text-jvto-navy mb-1">
                                    {act.name}
                                  </h4>
                                  <p className="text-sm text-jvto-muted leading-relaxed">
                                    {act.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* --- MEALS SECTION (NEW) --- */}
                          <div className="mt-8 pt-6 border-t border-jvto-border">
                            <h5 className="text-xs font-bold uppercase text-jvto-muted mb-3 flex items-center gap-2">
                              <Utensils size={14} /> Meals Included
                            </h5>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(day.mealsPlan).map(
                                ([meal, status]) => (
                                  <div
                                    key={meal}
                                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase border flex items-center gap-2 ${(status as string)
                                      .toLowerCase()
                                      .includes("included")
                                      ? "bg-jvto-lime/[0.08] text-jvto-lime-ink border-jvto-lime/30"
                                      : "bg-jvto-off text-jvto-muted border-jvto-border"
                                      }`}
                                  >
                                    <span className="text-jvto-navy capitalize">
                                      {meal}:
                                    </span>
                                    <span>{status as string}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- B. MOBILE VIEW --- */}
              <div className="block lg:hidden">
                {/* Preview Snippet */}
                <div className="relative overflow-hidden rounded-[16px] border border-jvto-border bg-white p-6 shadow-sm">
                  {pkg.itineraryDays[0] && (
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-col items-center mt-1.5">
                        <div className="w-3 h-3 rounded-full bg-jvto-lime ring-4 ring-jvto-lime/10"></div>
                        <div className="w-0.5 h-full border-l-2 border-dashed border-jvto-border min-h-[40px] mt-1"></div>
                      </div>
                      <div className="flex-1 space-y-3 pb-8">
                        <div>
                          <span className="block text-lg font-black text-jvto-navy mb-1">
                            {pkg.itineraryDays[0].activities[0]?.timeWindow}
                          </span>
                          <h4 className="text-base font-bold text-jvto-navy leading-snug">
                            {pkg.itineraryDays[0].activities[0]?.name}
                          </h4>
                        </div>
                        <p className="text-sm text-jvto-muted leading-relaxed line-clamp-3">
                          {pkg.itineraryDays[0].summary}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent z-10"></div>
                  <div className="absolute bottom-6 left-0 w-full text-center z-20">
                    <button
                      onClick={() => setIsItineraryModalOpen(true)}
                      className="mx-auto flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange-ink transition-colors hover:text-jvto-navy"
                    >
                      Show More <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Mobile Popup Modal */}
                {isItineraryModalOpen && (
                  <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
                    <div
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                      onClick={() => setIsItineraryModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl h-[85vh] sm:h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                      {/* Header */}
                      <div className="shrink-0 pt-2 pb-0 bg-white rounded-t-[28px] z-10 border-b border-jvto-border">
                        <div className="w-12 h-1.5 bg-jvto-border rounded-full mx-auto mt-3 mb-4"></div>
                        <div className="flex justify-between items-center px-6 mb-4">
                          <h3 className="text-lg font-black uppercase text-jvto-navy tracking-wide">
                            Tour Itinerary
                          </h3>
                          <button
                            aria-label="Close itinerary"
                            onClick={() => setIsItineraryModalOpen(false)}
                            className="p-2 bg-jvto-off rounded-full text-jvto-muted hover:bg-jvto-border transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex overflow-x-auto px-6 pb-0 gap-6 no-scrollbar">
                          {pkg.itineraryDays.map((day) => (
                            <button
                              key={day.day}
                              onClick={() => setModalOpenDay(day.day)}
                              className={`pb-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-4 ${modalOpenDay === day.day
                                ? "border-jvto-orange text-jvto-orange-ink"
                                : "border-transparent text-jvto-muted hover:text-jvto-ink-soft"
                                }`}
                            >
                              Day {day.day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 overflow-y-auto p-6 bg-jvto-off">
                        {pkg.itineraryDays.map((day) => {
                          if (modalOpenDay !== day.day) return null;
                          return (
                            <div
                              key={day.day}
                              className="space-y-6 animate-in fade-in duration-300"
                            >
                              <div className="p-4 bg-white rounded-[16px] border border-jvto-lime/30 shadow-sm">
                                <h4 className="text-xs font-bold uppercase text-jvto-lime-ink mb-2 tracking-widest">
                                  Overview
                                </h4>
                                <p className="text-sm text-jvto-ink-soft leading-relaxed italic">
                                  {`"${day.summary}"`}
                                </p>
                              </div>

                              {/* Timeline */}
                              <div className="relative pl-2 space-y-0">
                                <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-jvto-border"></div>
                                {day.activities.map((act: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="relative pl-8 pb-8 last:pb-0"
                                  >
                                    <div className="absolute left-0 top-1.5 h-4 w-4 transform -translate-x-[50%] rounded-full border-4 border-jvto-border bg-jvto-lime z-10"></div>
                                    <span className="inline-block mb-1 text-xs font-bold text-jvto-muted bg-jvto-off px-2 py-0.5 rounded border border-jvto-border">
                                      {act.timeWindow}
                                    </span>
                                    <div className="mt-2">
                                      <h5 className="text-base font-bold text-jvto-navy mb-1 leading-tight">
                                        {act.name}
                                      </h5>
                                      {act.location && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-jvto-lime-ink mb-2 uppercase tracking-wide">
                                          <MapPin size={10} /> {act.location}
                                        </div>
                                      )}
                                      <p className="text-sm text-jvto-ink-soft leading-relaxed">
                                        {act.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* --- MEALS SECTION (NEW IN MOBILE) --- */}
                              <div className="bg-white p-4 rounded-[16px] border border-jvto-border">
                                <h5 className="text-xs font-bold uppercase text-jvto-muted mb-3 flex items-center gap-2">
                                  <Utensils size={14} /> Meals Plan
                                </h5>
                                <div className="space-y-2">
                                  {Object.entries(day.mealsPlan).map(
                                    ([meal, status]) => (
                                      <div
                                        key={meal}
                                        className="flex justify-between text-sm border-b border-jvto-border last:border-0 pb-2 last:pb-0"
                                      >
                                        <span className="font-bold text-jvto-navy capitalize">
                                          {meal}
                                        </span>
                                        <span
                                          className={`font-medium uppercase text-xs px-2 py-0.5 rounded ${(status as string)
                                            .toLowerCase()
                                            .includes("included")
                                            ? "bg-jvto-lime/10 text-jvto-lime-ink"
                                            : "bg-jvto-off text-jvto-muted"
                                            }`}
                                        >
                                          {status as string}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* --- Accommodation & Transport Section (SWIPER VERSION) --- */}
            <div className="space-y-20 md:space-y-28 overflow-hidden">
              {/* Added overflow-hidden to prevent horizontal scrollbar on body if swiper goes wide */}

              {/* 1. ACCOMMODATION SLIDER */}
              {initialData.trip?.vehiclePlan && (
                <div>
                  <SectionHead kicker={`${pkg.durationNights} night${pkg.durationNights === 1 ? "" : "s"}`}>Accommodation</SectionHead>

                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={24}
                    slidesPerView={1.1} // Mobile: 1.1 card agar terlihat bisa discroll
                    breakpoints={{
                      640: { slidesPerView: 2.1 }, // Tablet: 2.1 card
                      1024: { slidesPerView: 3 }, // Desktop: 3 card (Sesuai Request)
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    className="!pb-12 !px-1" // Padding bottom untuk dots pagination
                  >
                    {pkg.accommodationPlan?.map((acc: any, idx: number) => (
                      <SwiperSlide key={idx} className="h-auto">
                        <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-jvto-border bg-white card-jvto">
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-jvto-off shrink-0">
                            {acc.image && acc.image.includes("http") ? (
                              <Image
                                src={acc.image}
                                alt={`Accommodation in ${acc.area}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 400px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-jvto-off text-jvto-border">
                                <Bed size={48} />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="rounded-full bg-jvto-navy/85 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-lime backdrop-blur-sm">
                                Night {acc.night}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-jvto-muted mb-2">
                              <MapPin size={14} /> {acc.area}
                            </h4>
                            <p className="font-bold text-jvto-navy text-sm md:text-base leading-tight mb-2">
                              {acc.name}
                            </p>
                            <p className="text-xs text-jvto-muted line-clamp-3 leading-relaxed">
                              Relax in a curated accommodation selected for
                              comfort and proximity to nature.
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {/* 2. TRANSPORT SLIDER */}
              {initialData.trip?.vehiclePlan && (
                <div>
                  <SectionHead className="mb-5" kicker="Private fleet">
                    Transport
                  </SectionHead>
                  <p className="mb-8 max-w-[60ch] text-jvto-ink-soft text-[15px] leading-relaxed">
                    Travel in comfort and safety with our private fleet.
                  </p>

                  <Swiper
                    modules={[Pagination]}
                    spaceBetween={24}
                    slidesPerView={1.1}
                    breakpoints={{
                      640: { slidesPerView: 2.1 },
                      1024: { slidesPerView: 3 }, // Desktop: 3 card
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    className="!pb-12 !px-1"
                  >
                    {/* Map Primary Vehicles */}
                    {initialData.trip.vehiclePlan.primary.map(
                      (vehicle: any, idx: number) => (
                        <SwiperSlide key={`vehicle-${idx}`} className="h-auto">
                          <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-jvto-border bg-white card-jvto">
                            <div className="relative h-40 w-full bg-jvto-off p-4 flex items-center justify-center shrink-0">
                              {vehicle.banner ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={vehicle.banner}
                                  alt={vehicle.model}
                                  className="max-h-full object-contain"
                                />
                              ) : (
                                <Car size={64} className="text-jvto-border" />
                              )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-lg text-jvto-navy mb-1">
                                  {vehicle.model}
                                </h4>
                                <p className="text-xs font-bold uppercase text-jvto-lime-ink mb-4">
                                  {vehicle.type}
                                </p>

                                <div className="space-y-2 text-sm text-jvto-ink-soft">
                                  <div className="flex items-center gap-2">
                                    <Users
                                      size={16}
                                      className="text-jvto-muted"
                                    />
                                    <span className="text-xs font-medium">
                                      Max {vehicle.maxPax} Pax
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Briefcase
                                      size={16}
                                      className="text-jvto-muted"
                                    />
                                    <span className="text-xs font-medium">
                                      {vehicle.baggageCapacity}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {vehicle.features.map(
                                  (feat: string, i: number) => (
                                    <span
                                      key={i}
                                      className="bg-jvto-off text-jvto-muted text-[10px] font-bold uppercase px-2 py-1 rounded"
                                    >
                                      {feat}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ),
                    )}

                    {/* Jeep Special Card (Added as the last slide) */}
                    {initialData.trip.vehiclePlan.jeepSpecs && (
                      <SwiperSlide className="h-auto">
                        <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-jvto-border bg-white card-jvto">
                          <div className="relative h-40 w-full bg-jvto-off p-4 flex items-center justify-center shrink-0">
                            <img
                              src="/assets/img/cars/jeep.webp"
                              alt="Bromo Jeep"
                              className="max-h-full object-contain"
                            />
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-jvto-navy mb-1">
                                Bromo Jeep
                              </h4>
                              <p className="text-xs font-bold uppercase text-jvto-lime-ink mb-4">
                                4x4 Off-Road Vehicle
                              </p>

                              <div className="space-y-2 text-sm text-jvto-ink-soft">
                                <div className="flex items-center gap-2">
                                  <Users size={16} className="text-jvto-muted" />
                                  <span className="text-xs font-medium">
                                    Max 4 Pax
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Briefcase
                                    size={16}
                                    className="text-jvto-muted"
                                  />
                                  <span className="text-xs font-medium">
                                    2 medium bags
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                              <span className="bg-jvto-off text-jvto-muted text-[10px] font-bold uppercase px-2 py-1 rounded">
                                4X4 DRIVE
                              </span>
                              <span className="bg-jvto-off text-jvto-muted text-[10px] font-bold uppercase px-2 py-1 rounded">
                                OPEN-AIR
                              </span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>
              )}
            </div>
            {/* --- The Practicalities Section (NEW) --- */}
            <div>
              <SectionHead>The Practicalities</SectionHead>

              {/* Part 1: What's Covered & Not Covered */}
              <div className="mb-12 relative">
                {/* Collapsible Container */}
                <div
                  className={`transition-all duration-700 ease-in-out overflow-hidden ${isInclusionsExpanded ? "max-h-[2000px]" : "max-h-[320px]"
                    }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8">
                    {/* Covered */}
                    <div>
                      <h3 className="mb-5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                        {`What's Covered`}
                      </h3>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-jvto-ink-soft"
                          >
                            <CheckCircle
                              size={18}
                              className="text-jvto-lime-ink shrink-0 mt-0.5"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Not Covered */}
                    <div>
                      <h3 className="mb-5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                        {`What's Not Covered`}
                      </h3>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-jvto-muted"
                          >
                            <XCircle
                              size={18}
                              className="text-jvto-status-closed shrink-0 mt-0.5"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Gradient Overlay (Visible only when collapsed) */}
                {!isInclusionsExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-jvto-off via-jvto-off/85 to-transparent z-10 pointer-events-none"></div>
                )}

                {/* Toggle Button for Part 1 Only */}
                <div
                  className={`text-center ${isInclusionsExpanded
                    ? "mt-0"
                    : "absolute bottom-0 left-0 w-full z-20 pb-0"
                    }`}
                >
                  <button
                    onClick={() =>
                      setIsInclusionsExpanded(!isInclusionsExpanded)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-jvto-border bg-white/95 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange-ink shadow-[0_12px_32px_-16px_rgba(13,27,42,0.25)] backdrop-blur-sm transition-colors hover:border-jvto-orange/40 hover:text-jvto-navy"
                  >
                    {isInclusionsExpanded ? (
                      <>
                        Show Less <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        View Full Inclusions <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Part 2: know-before-you-go. These three answer one question
                  between them, so they read as one panel divided by rules
                  rather than three identical cards floating apart. */}
              <div className="overflow-hidden rounded-[24px] border border-jvto-border bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-jvto-border md:divide-y-0 md:divide-x">
                  <div className="p-7 md:p-8">
                    <Activity size={20} className="text-jvto-orange mb-4" />
                    <h4 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy">
                      Fitness level
                    </h4>
                    <p className="text-sm text-jvto-ink-soft leading-relaxed">
                      {pkg.physicalDifficulty.toLowerCase() === "moderate"
                        ? "Requires good physical condition. Expect hiking on uneven terrain for 2-4 hours, including steep sections."
                        : "Suitable for most travelers. Involves light walking on relatively flat terrain with minimal physical exertion."}
                    </p>
                  </div>

                  <div className="p-7 md:p-8">
                    <Thermometer size={20} className="text-jvto-orange mb-4" />
                    <h4 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy">
                      Health &amp; safety
                    </h4>
                    <p className="text-sm text-jvto-ink-soft leading-relaxed">
                      {pkg.marketing.safetyPositioning}
                    </p>
                  </div>

                  <div className="p-7 md:p-8">
                    <ShoppingBag size={20} className="text-jvto-orange mb-4" />
                    <h4 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy">
                      Essential gear
                    </h4>
                    <ul className="space-y-1.5 text-sm text-jvto-ink-soft">
                      {pkg.gear.recommended.map((g, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-jvto-orange" />
                          <span className="leading-relaxed">{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {pkg.route.includes("Ijen Crater") && <TourRequirements pageContent={ijenCraterRequirements} />}
            {/* --- Why Travel With Us Section (FINAL REVISION) --- */}
            <div className="md:py-12 border-t border-jvto-border mt-12">
              <SectionHead className="mb-8 hidden md:block">
                Why Travel With Us?
              </SectionHead>
              <ReviewsClient
                reviews={reviews}
                totalCount={reviews?.length ?? 0}
              />
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-white rounded-[16px] border border-jvto-border p-8 shadow-sm flex flex-col">
                  <h3 className="text-sm font-bold text-jvto-navy mb-6 uppercase tracking-widest border-b border-jvto-border pb-4">
                    Guest Reviews
                  </h3>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    <span className="text-6xl font-black text-jvto-navy tracking-tighter">
                      {AGGREGATE_RATING.ratingValue.toFixed(1)}
                      <span className="text-3xl text-jvto-muted font-medium">
                        /5
                      </span>
                    </span>
                    <div className="flex flex-col justify-center pt-2">
                      <div className="flex text-orange-400 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            fill="currentColor"
                            className={
                              star === 5 ? "text-jvto-border fill-jvto-border" : ""
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-jvto-muted">
                        Rated by 112 adventurers
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <Swiper
                      modules={[Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      className="pb-10"
                    >
                      {[
                        {
                          customer_name: "Jeremy Teo",
                          profile_photo:
                            "https://lh3.googleusercontent.com/a-/ALV-UjWa-RMLudsDhNwpmpsIBwsgbZ34fLvnurqo2Qg8DdMUJFtR8k2s=s120-c-rp-mo-br100",
                          date: "2025-10-28",
                          star: 5,
                          review:
                            "We recently completed a tour by Java Volcano Tour Operator (JVTO) to Mt Bromo as well as IJEN and we were very satisfied with the arrangements made by the team. The team was very responsive, the trip was organised smoothly and our driver, Fredi, did a fantastic job, ensuring that we got from place to place safely and on time. We would certainly recommend going for a tour with JVTO!",
                        },
                        {
                          customer_name: "Samia Amrani",
                          profile_photo:
                            "https://lh3.googleusercontent.com/a/ACg8ocJ4eOWcIFSgTsYGvX-1TDyCTZjuzn4AVC7Oc5enXGTNU54tczQI=s120-c-rp-mo-br100",
                          date: "2025-10-14",
                          star: 5,
                          review:
                            "It was the best experience ever!! Our driver Pras and guide Rendi were the best, great people, super professionals and thoughtful, they took care of every detail and made us feel super safe and good.\nI recommended it 100%",
                        },
                        {
                          customer_name: "Remy H",
                          profile_photo:
                            "https://lh3.googleusercontent.com/a/ACg8ocLaF32GQ_E3jcrj4JYyoSVZ54QAdvusR_qhqsnflGpRgEdffg=s120-c-rp-mo-br100",
                          date: "2025-10-03",
                          star: 5,
                          review:
                            "Me and my girlfriend had an amazing trip over here. We did the 3D2N Ijen + Bromo tour and everything was well arranged. Special thanks to the guide Gufron, who made this trip special ❤️",
                        },
                      ].map((review, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="bg-jvto-off p-6 rounded-[16px] border border-jvto-border relative h-full">
                            <Quote
                              size={40}
                              className="text-jvto-lime/60 absolute top-4 left-4 opacity-40"
                            />
                            <div className="relative z-10 pt-2">
                              <p className="text-base text-jvto-navy leading-relaxed mb-6 italic font-medium">
                                {review.review}
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={review.profile_photo}
                                    alt={
                                      review.customer_name + " Profile Photo"
                                    }
                                    fill
                                    className="rounded-full object-cover border-2 border-gray-200"
                                    sizes="48px"
                                  />
                                </div>
                                <div>
                                  <span className="block text-sm font-bold text-jvto-navy uppercase tracking-wide">
                                    {review.customer_name}
                                  </span>
                                  <span className="block text-xs text-jvto-muted">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-jvto-navy mb-6 uppercase tracking-widest border-b border-jvto-border pb-4">
                      Our Commitment to Safety
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Award size={28} />,
                          label: "Certified Guides",
                        },
                        {
                          icon: <Stethoscope size={28} />,
                          label: "Health Screening",
                        },
                        { icon: <HardHat size={28} />, label: "Safety Gear" },
                        { icon: <Car size={28} />, label: "Expert Drivers" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center gap-3 group"
                        >
                          <div className="w-20 h-20 rounded-full border-2 border-jvto-border text-jvto-ink-soft flex items-center justify-center bg-white shadow-sm transition-all group-hover:border-jvto-lime group-hover:text-jvto-lime-ink group-hover:shadow-md">
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold text-jvto-navy leading-tight max-w-[100px]">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <LegalBadge />
                    <div>
                      <p className="text-xs font-bold uppercase text-orange-800 mb-2">
                        Questions?
                      </p>
                      <a
                        href={`https://wa.me/${pkg.provider.official.whatsapp.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-jvto-navy hover:text-jvto-lime-ink transition-colors bg-white px-5 py-3 rounded-[16px] border border-orange-100 shadow-sm w-full sm:w-auto justify-center"
                      >
                        <MessageCircle size={18} className="text-jvto-lime-ink" />
                        Contact us on WhatsApp: {pkg.provider.official.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR */}
          <div className="lg:col-span-1 relative">
            <div
              id="booking-card"
              className="sticky top-32 h-fit z-10 overflow-auto rounded-[24px] border border-jvto-border bg-white card-jvto"
            >
              <div className="bg-jvto-navy p-7 text-white">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-jvto-orange">
                  Private expedition
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className="font-black text-white leading-none"
                    style={{
                      fontFamily: "Raleway, Georgia, serif",
                      fontSize: "clamp(30px, 3vw, 40px)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {formatCurrency(total)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    total
                  </span>
                </div>
              </div>
              <div className="p-7">
                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 border-b border-jvto-border pb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-jvto-muted">
                  <div className="flex items-center gap-1.5">
                    <Shield size={13} className="text-jvto-lime-ink" /> Safe
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-jvto-lime-ink" /> Private
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-jvto-lime-ink" /> Flexible
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-navy"
                    >
                      Travel date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      min={todayISO}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-[12px] border border-jvto-border bg-white px-4 py-3.5 text-sm font-medium text-jvto-navy transition-colors focus:border-jvto-orange focus:outline-none focus:ring-2 focus:ring-jvto-orange/20"
                      required
                    />
                  </div>
                  {/* UBAH BAGIAN INPUT TRAVELERS - FIX Z-INDEX */}
                  <div className="relative z-50">
                    <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-navy">
                      Travelers
                    </label>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowTravelersPicker(!showTravelersPicker)
                      }
                      className="relative z-10 flex w-full items-center justify-between rounded-[12px] border border-jvto-border bg-white px-4 py-3.5 text-left transition-colors hover:border-jvto-navy/30"
                    >
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-jvto-muted" />
                        <div>
                          <span className="text-sm font-semibold text-jvto-navy">
                            {pax} Travelers
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-jvto-muted transition-transform ${showTravelersPicker ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Panel - FIX POSITIONING */}
                    {showTravelersPicker && (
                      <>
                        {/* Backdrop - Optional */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowTravelersPicker(false)}
                        />

                        <div className="absolute left-0 right-0 z-50 mt-2 space-y-2 rounded-[16px] border border-jvto-border bg-white p-2.5 shadow-[0_30px_60px_-25px_rgba(13,27,42,0.35)]">
                          {pkg.offers.tiers.map((tier, idx) => {
                            const isInRange =
                              Number(pax) >= tier.paxMin &&
                              (tier.paxMax === 0 || Number(pax) <= tier.paxMax);
                            const tierPax = isInRange ? Number(pax) : 0;

                            return (
                              <div
                                key={idx}
                                className={`rounded-[12px] p-3 transition-colors ${isInRange
                                  ? "bg-jvto-orange/[0.06] border border-jvto-orange"
                                  : "bg-jvto-off border border-jvto-border"
                                  }`}
                              >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-xs text-jvto-navy">
                                      {tier.paxMin}
                                      {tier.paxMax === 0
                                        ? "+"
                                        : `-${tier.paxMax}`}{" "}
                                      Travelers
                                    </h4>
                                  </div>
                                </div>

                                {/* Price & Counter */}
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-bold text-jvto-navy">
                                    {formatCurrency(tier.pricePerPerson)}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newVal = tierPax - 1;
                                        if (newVal >= tier.paxMin) {
                                          setPax(newVal);
                                        } else if (tierPax > 0) {
                                          setPax(
                                            pkg.channelMetadata
                                              .minPaxOperational,
                                          );
                                        }
                                      }}
                                      disabled={tierPax === 0}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-jvto-border bg-white text-lg font-bold text-jvto-navy transition-colors hover:border-jvto-navy/40 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      −
                                    </button>

                                    <div className="w-12 text-center font-bold text-jvto-navy">
                                      {tierPax}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newVal =
                                          tierPax === 0
                                            ? tier.paxMin
                                            : tierPax + 1;
                                        const maxLimit =
                                          tier.paxMax === 0
                                            ? pkg.channelMetadata
                                              .maxPaxRecommended
                                            : tier.paxMax;
                                        if (
                                          newVal <= maxLimit &&
                                          newVal <=
                                          pkg.channelMetadata
                                            .maxPaxRecommended
                                        ) {
                                          setPax(newVal);
                                        }
                                      }}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-jvto-border bg-white text-lg font-bold text-jvto-navy transition-colors hover:border-jvto-navy/40"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Done Button */}
                          <button
                            type="button"
                            onClick={() => setShowTravelersPicker(false)}
                            className="mt-2 w-full rounded-full bg-jvto-navy py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-jvto-navy-raise"
                          >
                            Done
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="rounded-[16px] border border-jvto-border bg-jvto-off p-5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-jvto-muted">
                        Price per person
                      </span>
                      <span className="font-semibold text-jvto-navy">
                        {pricePerPerson ? formatCurrency(pricePerPerson) : "-"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between border-t border-jvto-border pt-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-navy">
                        Grand total
                      </span>
                      <span
                        className="font-black text-jvto-navy leading-none"
                        style={{
                          fontFamily: "Raleway, Georgia, serif",
                          fontSize: "22px",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {pricePerPerson ? formatCurrency(total) : "-"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-jvto-orange py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-jvto-orange-hover active:scale-[0.99]"
                  >
                    Instant Book
                  </button>
                  <div className="text-center">
                    <a
                      href="/policy/booking-payment-cancellation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] uppercase tracking-[0.14em] text-jvto-muted underline underline-offset-4 transition-colors hover:text-jvto-navy"
                    >
                      View Cancellation Policy
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TrustBar reviewProfiles={reviewProfiles} />
      {/* --- ADD-ON MODAL WITH SEARCH --- */}
      {showAddOnModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-jvto-navy/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-jvto-navy px-6 py-5 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                  Enhance Your Trip
                </h2>
                <p className="text-xs text-jvto-muted">
                  Optional extras for your group
                </p>
              </div>
              <button
                aria-label="Close add-ons"
                onClick={() => {
                  setShowAddOnModal(false);
                  setSearchTerm(""); // Reset search saat close
                }}
                className="text-white hover:text-jvto-lime transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* SEARCH BAR SECTION */}
            <div className="px-6 py-4 border-b border-jvto-border bg-white shrink-0">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-jvto-muted"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search add-ons"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-jvto-off border border-jvto-border rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-jvto-lime/20 focus:border-jvto-lime transition-all"
                />
              </div>
            </div>

            {/* List Content */}
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {(() => {
                // 1. Filter berdasarkan pencarian DAN aturan transport
                const filteredItems = addOnSelections.filter((item) => {
                  // A. Filter Search
                  const matchesSearch = item.label
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                  // B. Filter Transport (Logika Pax kamu tetap terjaga)
                  let matchesTransport = true;
                  if (item.type === "transport") {
                    let requiredType = "big";
                    if (Number(pax) <= 3) requiredType = "small";
                    else if (Number(pax) >= 4 && Number(pax) <= 9)
                      requiredType = "medium";

                    if (
                      item.transportType &&
                      item.transportType !== requiredType
                    ) {
                      matchesTransport = false;
                    }
                  }

                  return matchesSearch && matchesTransport;
                });

                // 2. Tampilkan Empty State jika tidak ada hasil
                if (filteredItems.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <p className="text-jvto-muted text-sm italic">
                        No add-ons found for "{searchTerm}"
                      </p>
                    </div>
                  );
                }

                // 3. Map items yang sudah difilter
                return filteredItems.map((item) => {
                  const originalIndex = addOnSelections.findIndex(
                    (a) => a.addOnId === item.addOnId,
                  );

                  // Logika Pemilihan Gambar Transport
                  let transportImage = null;
                  if (item.type === "transport") {
                    if (item.transportType === "small")
                      transportImage = "/assets/img/cars/avanza.png";
                    else if (item.transportType === "medium")
                      transportImage = "/assets/img/cars/elf-short.png";
                    else if (item.transportType === "big")
                      transportImage = "/assets/img/cars/elf-long.jpg";
                  }

                  return (
                    <label
                      key={item.addOnId}
                      className={`flex cursor-pointer items-center gap-4 rounded-[16px] border p-4 transition-all ${item.selected
                        ? "border-jvto-lime bg-jvto-lime/5"
                        : "border-jvto-border bg-white hover:border-jvto-lime/40"
                        }`}
                    >
                      {/* Gambar Transport (Hanya muncul jika tipe transport) */}
                      {item.type === "transport" && transportImage && (
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-[16px] bg-jvto-off border border-jvto-border">
                          <img
                            src={transportImage}
                            alt={item.label}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                      )}

                      {/* Info Teks */}
                      <div className="flex-1">
                        <p className="font-bold text-jvto-navy leading-tight">
                          {item.label}
                        </p>
                        <p className="text-xs text-jvto-muted mt-1">
                          {formatCurrency(item.price)}
                          {item.type === "transport"
                            ? " / unit (Flat Rate)"
                            : ` x ${pax} pax`}
                        </p>
                        {item.type === "transport" && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-white border border-jvto-border text-jvto-muted px-1.5 py-0.5 rounded">
                            {item.transportType} Car
                          </span>
                        )}
                      </div>

                      {/* Checkbox */}
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAddOnSelections((prev) =>
                              prev.map((p, i) =>
                                i === originalIndex
                                  ? { ...p, selected: checked }
                                  : p,
                              ),
                            );
                          }}
                          className="peer sr-only"
                        />
                        <div className="h-6 w-6 rounded border-2 border-jvto-border peer-checked:border-jvto-lime peer-checked:bg-jvto-lime transition-all flex items-center justify-center">
                          {item.selected && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                    </label>
                  );
                });
              })()}
            </div>

            {/* Footer Modal */}
            <div className="border-t border-jvto-border bg-jvto-off p-6 shrink-0">
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="font-medium text-jvto-ink-soft">
                  Add-ons Total:
                </span>
                <span className="font-bold text-jvto-navy text-lg">
                  {formatCurrency(
                    addOnSelections.reduce((sum, a) => {
                      if (!a.selected) return sum;
                      const qty = a.type === "transport" ? 1 : Number(pax);
                      return sum + qty * a.price;
                    }, 0),
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOnModal(false);
                    setPendingBasePayload(null);
                    setSearchTerm("");
                  }}
                  className="flex-1 rounded-[16px] border border-jvto-border bg-white py-3 text-sm font-bold uppercase text-jvto-ink-soft hover:bg-jvto-off"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddOns}
                  className="flex-1 rounded-[16px] bg-jvto-lime py-3 text-sm font-bold uppercase text-jvto-navy hover:bg-[#8cb82b] shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* --- MOBILE STICKY BOTTOM BAR --- */}
      {/* One row that must never wrap: the price block holds its intrinsic
          width, the action takes the rest, and the right inset keeps both
          clear of the floating WhatsApp button. */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-jvto-border bg-white/95 px-5 py-3.5 backdrop-blur-md lg:hidden shadow-[0_-12px_32px_-16px_rgba(13,27,42,0.25)]">
        <div className="flex items-center gap-3 pr-[64px]">
          <div className="shrink-0 whitespace-nowrap">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-jvto-muted">
              Starts from
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className="font-black text-jvto-navy leading-none"
                style={{
                  fontFamily: "Raleway, Georgia, serif",
                  fontSize: "18px",
                  letterSpacing: "-0.03em",
                }}
              >
                {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-jvto-muted">
                /pax
              </span>
            </div>
          </div>

          <button
            onClick={scrollToBooking}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-jvto-orange px-4 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-jvto-orange-hover active:scale-[0.98]"
          >
            Instant book <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
