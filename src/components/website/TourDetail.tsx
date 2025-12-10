"use client";

import { useMemo, useState, useEffect } from "react";
import { TourPackageDetail } from "@/interfaces";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

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
  MessageCircle,
  Quote,
} from "lucide-react";

interface Props {
  initialData: TourPackageDetail;
}

// ... (Utilities formatCurrency & getPriceForPax TETAP SAMA) ...
function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
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
    return <Car size={20} className="text-lime-400" />;
  if (lower.includes("guide"))
    return <UserCheck size={20} className="text-lime-400" />;
  if (lower.includes("hotel") || lower.includes("accommodation"))
    return <Home size={20} className="text-lime-400" />;
  if (
    lower.includes("meal") ||
    lower.includes("breakfast") ||
    lower.includes("water")
  )
    return <Utensils size={20} className="text-lime-400" />;
  if (
    lower.includes("ticket") ||
    lower.includes("entrance") ||
    lower.includes("permit")
  )
    return <Ticket size={20} className="text-lime-400" />;
  if (
    lower.includes("equipment") ||
    lower.includes("mask") ||
    lower.includes("pole")
  )
    return <Mountain size={20} className="text-lime-400" />;
  return <Check size={20} className="text-lime-400" />;
}

// ... (Helper getExperienceIcon juga TETAP SAMA jika ada) ...
function getExperienceIcon(name: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes("waterfall") ||
    lower.includes("air") ||
    lower.includes("tumpak")
  )
    return <Waves size={24} className="text-lime-600" />;
  if (
    lower.includes("bromo") ||
    lower.includes("mount") ||
    lower.includes("sunrise")
  )
    return <Mountain size={24} className="text-lime-600" />;
  if (
    lower.includes("ijen") ||
    lower.includes("fire") ||
    lower.includes("blue")
  )
    return <Flame size={24} className="text-lime-600" />;
  return <MapPin size={24} className="text-lime-600" />;
}

export default function PackageDetailPage({ initialData }: Props) {
  const router = useRouter();
  const pkg = initialData.product;

  // --- STATE ---
  // State untuk Hero Background (tetap ada jika ingin bisa ganti hero, tapi trigger lightbox beda)
  const [heroImage, setHeroImage] = useState(pkg.imageUrl || pkg.gallery[0]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isInclusionsExpanded, setIsInclusionsExpanded] = useState(false); // <--- STATE KHUSUS INI

  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [modalOpenDay, setModalOpenDay] = useState<number>(1); // Tab aktif di dalam modal

  // State Lightbox Gallery
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // State Booking Form
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [startDate, setStartDate] = useState("");
  const [pax, setPax] = useState(2);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight")
        setPhotoIndex((prev) => (prev + 1) % pkg.gallery.length);
      if (e.key === "ArrowLeft")
        setPhotoIndex(
          (prev) => (prev - 1 + pkg.gallery.length) % pkg.gallery.length
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
    () => getPriceForPax(pax, pkg.offers.tiers),
    [pax, pkg.offers.tiers]
  );
  const total = pricePerPerson ? pricePerPerson * pax : 0;

  // --- ADD-ON LOGIC ---
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [pendingBasePayload, setPendingBasePayload] = useState<any | null>(
    null
  );
  const [addOnSelections, setAddOnSelections] = useState(
    pkg.addOns?.map((a: any) => ({
      addOnId: a.id,
      label: a.name,
      price: a.price,
      selected: false,
      type: a.type,
      transportType: a.transportType,
    })) ?? []
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
    }[]
  ) => {
    const addOnTotal = addons.reduce((sum, a) => sum + a.subtotal, 0);
    const grandTotal = basePayload.packageTotal + addOnTotal;

    const downPayment = Math.ceil(grandTotal * 0.2);

    const payload = {
      ...basePayload,
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
    router.push("/checkout");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !pax || pax < pkg.channelMetadata.minPaxOperational) {
      alert("Please select a valid date and number of guests.");
      return;
    }

    const packageTotal = pricePerPerson ? pricePerPerson * pax : 0;
    const basePayload = {
      packageId: pkg.id,
      durationId: pkg.durationId,
      date: startDate,
      pax,
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
      .map((a) => ({
        addOnId: a.addOnId,
        qty: pax,
        label: a.label,
        price: a.price,
        subtotal: pax * a.price,
        type: a.type,
      }));
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
    <div className="bg-slate-50 min-h-screen pb-20 font-sans text-slate-900">
      {/* 1. HUGE HERO IMAGE AREA */}
      <div className="relative h-[80vh] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          {/* Tampilkan Hero Image (bisa statis dari pkg.imageUrl atau dinamis jika kita tambah tombol ganti hero) */}
          <img
            src={heroImage}
            alt={pkg.name}
            className="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30"></div>
        </div>

        <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-white hover:text-lime-400 transition-colors text-sm font-bold uppercase tracking-wide bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
          >
            <ArrowLeft size={16} className="mr-2" /> Back
          </button>
          <button className="text-white hover:text-lime-400 transition-colors">
            <Heart size={28} />
          </button>
        </div>

        <div className="absolute bottom-0 w-full z-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-lime-400 text-xs font-black uppercase tracking-widest mb-4">
              <MapPin size={14} /> {pkg.originCity}, Indonesia
            </div>
            <h1 className="text-2xl md:text-5xl font-black uppercase leading-[1.3] text-white shadow-sm mb-6 max-w-5xl">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-10 text-white text-sm font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-lime-400" />
                <span>{pkg.originCity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-lime-400" />
                <span>{pkg.marketedDurationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain size={18} className="text-lime-400" />
                <span>{pkg.physicalDifficulty}</span>
                <div className="flex gap-1 md:ml-2">
                  <div className="w-2 h-2 rounded-full bg-lime-400"></div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ["moderate", "hard"].includes(
                        pkg.physicalDifficulty.toLowerCase()
                      )
                        ? "bg-lime-400"
                        : "bg-slate-600"
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      ["hard"].includes(pkg.physicalDifficulty.toLowerCase())
                        ? "bg-lime-400"
                        : "bg-slate-600"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DARK "WHAT'S INCLUDED" SECTION */}
      <div className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h3 className="text-lg font-black uppercase tracking-widest mb-8 text-white">
                {`What's Included?`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {pkg.inclusions.slice(0, 6).map((inc, idx) => {
                  const title = inc.split(":")[0];
                  const desc = inc.split(":")[1] || inc;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        {getInclusionIcon(title)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm uppercase text-white mb-1">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:w-1/3 shrink-0 flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 lg:border-l border-slate-700 pt-8 lg:pt-0 lg:pl-12">
              <div className="text-left lg:text-right">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-1">
                  From
                </p>
                <div className="text-5xl font-black text-white mb-2">
                  {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                </div>
                <p className="text-xs text-slate-500">excluding flights</p>
              </div>
              <button
                onClick={scrollToBooking}
                className="mt-8 w-full lg:w-auto bg-lime-500 hover:bg-lime-400 text-slate-900 font-bold uppercase tracking-widest px-10 py-4 rounded-lg transition-all shadow-lg shadow-lime-900/50"
              >
                Dates & Prices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GALLERY STRIP (Memicu Lightbox) */}
      <div className="bg-slate-900 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-black uppercase tracking-widest text-white">
              {`What's It Like?`}
            </h3>
            <button
              onClick={() => openLightbox(0)}
              className="text-xs font-bold uppercase text-lime-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View All Photos <ChevronRight size={14} />
            </button>
          </div>

          {/* Thumbnail Container */}
          {/* Mobile: Flex & Scroll Horizontal. Desktop: Grid System. */}
          <div className="flex gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-4 lg:grid-cols-6 md:pb-0 md:overflow-visible no-scrollbar">
            {pkg.gallery.slice(0, 6).map((img, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox(idx)}
                // Class: shrink-0 & fixed width pada mobile agar bisa di-scroll
                className="group relative h-32 w-32 shrink-0 md:h-auto md:w-auto aspect-square overflow-hidden rounded-lg bg-slate-800"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 p-2 rounded-full text-white backdrop-blur-sm">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* --- LIGHTBOX POPUP --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPhotoIndex(
                (prev) => (prev - 1 + pkg.gallery.length) % pkg.gallery.length
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button
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
              alt={`Gallery Full ${photoIndex}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest backdrop-blur-sm">
              {photoIndex + 1} / {pkg.gallery.length}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT GRID (Tetap sama) --- */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: INFO & ITINERARY */}
          <div className="lg:col-span-2 space-y-16">
            {/* Description (With Show More/Less) */}
            <div>
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 text-slate-900">
                <span className="w-8 h-1 bg-lime-500 block"></span>
                About This Trip
              </h2>

              <div className="relative">
                <div
                  className={`text-lg text-slate-600 leading-relaxed whitespace-pre-line transition-all duration-500`}
                >
                  {/* Logika Truncate: Tampilkan full jika expanded ATAU jika teks pendek (< 400 char) */}
                  {isDescriptionExpanded || pkg.description.length < 350
                    ? pkg.description
                    : `${pkg.description.substring(0, 350)}...`}
                </div>

                {/* Tombol Toggle hanya muncul jika teks panjang */}
                {pkg.description.length >= 350 && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-4 flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-lime-600 hover:text-lime-700 transition-colors"
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
            {/* Highlights (Design Gambar 2) */}
            <div>
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                <span className="w-8 h-1 bg-lime-500 block"></span>
                Trip Highlights
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">
                    Key Experiences
                  </h3>
                  <div className="space-y-6">
                    {pkg.keyExperiences?.map((exp: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-xl shrink-0">
                          {getExperienceIcon(exp.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                            {exp.name}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed mt-1">
                            {exp.highlight}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6">
                    Why This Trip is Unique
                  </h3>
                  <ul className="space-y-4">
                    {pkg.marketing.uniqueSellingPoints?.map(
                      (point: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex gap-3 items-start text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {point}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* =========================================================
                ITINERARY SECTION (RESPONSIVE WITH MEALS)
               ========================================================= */}
            <div>
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                <span className="w-8 h-1 bg-lime-500 block"></span>
                Itinerary
              </h2>

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
                        className={`w-full text-left p-4 rounded-lg border-l-4 transition-all duration-300 group ${
                          isActive
                            ? "bg-white border-lime-500 shadow-md translate-x-2"
                            : "bg-slate-50 border-transparent hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        <span
                          className={`block text-xs font-bold uppercase tracking-widest mb-1 ${
                            isActive ? "text-lime-600" : "text-slate-400"
                          }`}
                        >
                          Day {day.day.toString().padStart(2, "0")}
                        </span>
                        <h4
                          className={`font-bold text-sm leading-tight ${
                            isActive
                              ? "text-slate-900"
                              : "text-slate-500 group-hover:text-slate-700"
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
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-right-4 duration-500"
                      >
                        {/* Header Image */}
                        <div className="relative h-64 w-full">
                          <img
                            src={dayImage}
                            alt={day.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <h3 className="text-2xl font-black uppercase leading-none mb-2">
                              {day.title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-lime-400 uppercase tracking-wide">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />{" "}
                                {day.overnight || "On Transport"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <div className="mb-10 p-4 border-l-4 border-lime-300 bg-slate-50 rounded-r-lg italic text-slate-600 text-sm leading-relaxed">
                            {`"${day.summary}"`}
                          </div>

                          {/* Timeline */}
                          <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-4">
                            {day.activities.map((act: any, idx: number) => (
                              <div key={idx} className="relative pl-10">
                                <div
                                  className={`absolute -left-[1.35rem] top-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                                    idx % 2 === 0
                                      ? "bg-lime-500"
                                      : "bg-slate-900"
                                  }`}
                                >
                                  {getActivityIcon(act.name)}
                                </div>
                                <div>
                                  <span className="inline-block mb-1 text-xs font-bold text-lime-600 uppercase tracking-wider bg-lime-50 px-2 py-0.5 rounded">
                                    {act.timeWindow}
                                  </span>
                                  <h4 className="text-base font-bold text-slate-900 mb-1">
                                    {act.name}
                                  </h4>
                                  <p className="text-sm text-slate-500 leading-relaxed">
                                    {act.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* --- MEALS SECTION (NEW) --- */}
                          <div className="mt-8 pt-6 border-t border-slate-100">
                            <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                              <Utensils size={14} /> Meals Included
                            </h5>
                            <div className="flex flex-wrap gap-3">
                              {Object.entries(day.mealsPlan).map(
                                ([meal, status]) => (
                                  <div
                                    key={meal}
                                    className={`px-3 py-1.5 rounded text-xs font-bold uppercase border flex items-center gap-2 ${
                                      (status as string)
                                        .toLowerCase()
                                        .includes("included")
                                        ? "bg-lime-50 text-lime-700 border-lime-200"
                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                    }`}
                                  >
                                    <span className="text-slate-900 capitalize">
                                      {meal}:
                                    </span>
                                    <span>{status as string}</span>
                                  </div>
                                )
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
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  {pkg.itineraryDays[0] && (
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-col items-center mt-1.5">
                        <div className="w-3 h-3 rounded-full bg-lime-500 ring-4 ring-lime-100"></div>
                        <div className="w-0.5 h-full border-l-2 border-dashed border-slate-300 min-h-[40px] mt-1"></div>
                      </div>
                      <div className="flex-1 space-y-3 pb-8">
                        <div>
                          <span className="block text-lg font-black text-slate-900 mb-1">
                            {pkg.itineraryDays[0].activities[0]?.timeWindow}
                          </span>
                          <h4 className="text-base font-bold text-slate-800 leading-snug">
                            {pkg.itineraryDays[0].activities[0]?.name}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {pkg.itineraryDays[0].summary}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent z-10"></div>
                  <div className="absolute bottom-6 left-0 w-full text-center z-20">
                    <button
                      onClick={() => setIsItineraryModalOpen(true)}
                      className="text-lime-600 font-bold text-sm uppercase tracking-widest hover:text-lime-700 transition-colors flex items-center justify-center gap-1 mx-auto"
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

                    <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl h-[85vh] sm:h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                      {/* Header */}
                      <div className="shrink-0 pt-2 pb-0 bg-white rounded-t-3xl z-10 border-b border-slate-100">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4"></div>
                        <div className="flex justify-between items-center px-6 mb-4">
                          <h3 className="text-lg font-black uppercase text-slate-900 tracking-wide">
                            Tour Itinerary
                          </h3>
                          <button
                            onClick={() => setIsItineraryModalOpen(false)}
                            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex overflow-x-auto px-6 pb-0 gap-6 no-scrollbar">
                          {pkg.itineraryDays.map((day) => (
                            <button
                              key={day.day}
                              onClick={() => setModalOpenDay(day.day)}
                              className={`pb-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-4 ${
                                modalOpenDay === day.day
                                  ? "border-lime-500 text-lime-600"
                                  : "border-transparent text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              Day {day.day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                        {pkg.itineraryDays.map((day) => {
                          if (modalOpenDay !== day.day) return null;
                          return (
                            <div
                              key={day.day}
                              className="space-y-6 animate-in fade-in duration-300"
                            >
                              <div className="p-4 bg-white rounded-xl border border-lime-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase text-lime-600 mb-2 tracking-widest">
                                  Overview
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed italic">
                                  {`"${day.summary}"`}
                                </p>
                              </div>

                              {/* Timeline */}
                              <div className="relative pl-2 space-y-0">
                                <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-slate-200"></div>
                                {day.activities.map((act: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="relative pl-8 pb-8 last:pb-0"
                                  >
                                    <div className="absolute left-0 top-1.5 h-4 w-4 transform -translate-x-[50%] rounded-full border-4 border-slate-50 bg-lime-500 z-10"></div>
                                    <span className="inline-block mb-1 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {act.timeWindow}
                                    </span>
                                    <div className="mt-2">
                                      <h5 className="text-base font-bold text-slate-900 mb-1 leading-tight">
                                        {act.name}
                                      </h5>
                                      {act.location && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-lime-600 mb-2 uppercase tracking-wide">
                                          <MapPin size={10} /> {act.location}
                                        </div>
                                      )}
                                      <p className="text-sm text-slate-600 leading-relaxed">
                                        {act.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* --- MEALS SECTION (NEW IN MOBILE) --- */}
                              <div className="bg-white p-4 rounded-xl border border-slate-200">
                                <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                                  <Utensils size={14} /> Meals Plan
                                </h5>
                                <div className="space-y-2">
                                  {Object.entries(day.mealsPlan).map(
                                    ([meal, status]) => (
                                      <div
                                        key={meal}
                                        className="flex justify-between text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0"
                                      >
                                        <span className="font-bold text-slate-700 capitalize">
                                          {meal}
                                        </span>
                                        <span
                                          className={`font-medium uppercase text-xs px-2 py-0.5 rounded ${
                                            (status as string)
                                              .toLowerCase()
                                              .includes("included")
                                              ? "bg-lime-100 text-lime-700"
                                              : "bg-slate-100 text-slate-400"
                                          }`}
                                        >
                                          {status as string}
                                        </span>
                                      </div>
                                    )
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
            <div className="space-y-16 overflow-hidden">
              {/* Added overflow-hidden to prevent horizontal scrollbar on body if swiper goes wide */}

              {/* 1. ACCOMMODATION SLIDER */}
              {initialData.trip?.vehiclePlan && (
                <div>
                  <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                    <span className="w-8 h-1 bg-lime-500 block"></span>
                    Accommodation
                  </h2>

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
                        <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md flex flex-col">
                          {/* Image Container */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                            {acc.image && acc.image.includes("http") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={acc.image}
                                alt={`Accommodation in ${acc.area}`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                <Bed size={48} />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="bg-slate-900/80 backdrop-blur-sm text-lime-400 text-xs font-bold uppercase px-3 py-1.5 rounded-lg">
                                Night {acc.night}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                              <MapPin size={14} /> {acc.area}
                            </h4>
                            <p className="font-bold text-slate-900 text-sm md:text-base leading-tight mb-2">
                              {acc.name}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
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
                  <h2 className="text-2xl font-black uppercase mb-2 flex items-center gap-3 text-slate-900">
                    <span className="w-8 h-1 bg-lime-500 block"></span>
                    Transport
                  </h2>
                  <p className="mb-8 text-slate-600 text-sm">
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
                          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className="relative h-40 w-full bg-slate-50 p-4 flex items-center justify-center shrink-0">
                              {vehicle.banner ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={vehicle.banner}
                                  alt={vehicle.model}
                                  className="max-h-full object-contain"
                                />
                              ) : (
                                <Car size={64} className="text-slate-300" />
                              )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-lg text-slate-900 mb-1">
                                  {vehicle.model}
                                </h4>
                                <p className="text-xs font-bold uppercase text-lime-600 mb-4">
                                  {vehicle.type}
                                </p>

                                <div className="space-y-2 text-sm text-slate-600">
                                  <div className="flex items-center gap-2">
                                    <Users
                                      size={16}
                                      className="text-slate-400"
                                    />
                                    <span className="text-xs font-medium">
                                      Max {vehicle.maxPax} Pax
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Briefcase
                                      size={16}
                                      className="text-slate-400"
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
                                      className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded"
                                    >
                                      {feat}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}

                    {/* Jeep Special Card (Added as the last slide) */}
                    {initialData.trip.vehiclePlan.jeepSpecs && (
                      <SwiperSlide className="h-auto">
                        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                          <div className="relative h-40 w-full bg-slate-50 p-4 flex items-center justify-center shrink-0">
                            <img
                              src="/assets/img/cars/jeep.webp"
                              alt="Bromo Jeep"
                              className="max-h-full object-contain"
                            />
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-slate-900 mb-1">
                                Bromo Jeep
                              </h4>
                              <p className="text-xs font-bold uppercase text-lime-600 mb-4">
                                4x4 Off-Road Vehicle
                              </p>

                              <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Users size={16} className="text-slate-400" />
                                  <span className="text-xs font-medium">
                                    Max 4 Pax
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Briefcase
                                    size={16}
                                    className="text-slate-400"
                                  />
                                  <span className="text-xs font-medium">
                                    2 medium bags
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
                                4X4 DRIVE
                              </span>
                              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded">
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
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                <span className="w-8 h-1 bg-lime-500 block"></span>
                The Practicalities
              </h2>

              {/* Part 1: What's Covered & Not Covered */}
              <div className="mb-12 relative">
                {/* Collapsible Container */}
                <div
                  className={`transition-all duration-700 ease-in-out overflow-hidden ${
                    isInclusionsExpanded ? "max-h-[2000px]" : "max-h-[320px]"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8">
                    {/* Covered */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        {`What's Covered`}
                      </h3>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-slate-600"
                          >
                            <CheckCircle
                              size={18}
                              className="text-lime-500 shrink-0 mt-0.5"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Not Covered */}
                    <div>
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        {`What's Not Covered`}
                      </h3>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-slate-500"
                          >
                            <XCircle
                              size={18}
                              className="text-red-400 shrink-0 mt-0.5"
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
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>
                )}

                {/* Toggle Button for Part 1 Only */}
                <div
                  className={`text-center ${
                    isInclusionsExpanded
                      ? "mt-0"
                      : "absolute bottom-0 left-0 w-full z-20 pb-0"
                  }`}
                >
                  <button
                    onClick={() =>
                      setIsInclusionsExpanded(!isInclusionsExpanded)
                    }
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-600 hover:text-lime-700 transition-colors bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full border border-lime-200 hover:bg-white shadow-sm"
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

              {/* Part 2: Essential Info Cards */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Fitness Level */}
                  <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm hover:border-lime-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity size={24} className="text-lime-600" />
                      <h4 className="font-bold text-slate-900">
                        Fitness Level
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pkg.physicalDifficulty.toLowerCase() === "moderate"
                        ? "Requires good physical condition. Expect hiking on uneven terrain for 2-4 hours, including steep sections."
                        : "Suitable for most travelers. Involves light walking on relatively flat terrain with minimal physical exertion."}
                    </p>
                  </div>

                  {/* Health & Safety */}
                  <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm hover:border-lime-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Thermometer size={24} className="text-lime-600" />
                      <h4 className="font-bold text-slate-900">
                        Health & Safety
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pkg.marketing.safetyPositioning}
                    </p>
                  </div>

                  {/* Essential Gear */}
                  <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm hover:border-lime-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingBag size={24} className="text-lime-600" />
                      <h4 className="font-bold text-slate-900">
                        Essential Gear
                      </h4>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      {pkg.gear.recommended.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* --- Why Travel With Us Section (FINAL REVISION) --- */}
            <div className="py-12 border-t border-slate-200 mt-12">
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3 text-slate-900">
                <span className="w-8 h-1 bg-lime-500 block"></span>
                Why Travel With Us?
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* LEFT COLUMN: PART 1 - GUEST REVIEWS (SWIPER) */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
                  <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-100 pb-4">
                    Guest Reviews
                  </h3>

                  {/* Rating Big Display */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                      4.9
                      <span className="text-3xl text-slate-400 font-medium">
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
                              star === 5 ? "text-slate-200 fill-slate-200" : ""
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-500">
                        Rated by 112 adventurers
                      </span>
                    </div>
                  </div>

                  {/* SWIPER TESTIMONIALS */}
                  <div className="w-full">
                    <Swiper
                      modules={[Pagination, Autoplay]}
                      spaceBetween={20}
                      slidesPerView={1}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      className="pb-10" // Padding bawah untuk dots pagination
                    >
                      {/* Review 1 */}
                      <SwiperSlide>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative h-full">
                          <Quote
                            size={40}
                            className="text-lime-300 absolute top-4 left-4 opacity-40"
                          />
                          <div className="relative z-10 pt-2">
                            <p className="text-base text-slate-700 leading-relaxed mb-6 italic font-medium">
                              {`"An absolutely unforgettable adventure. The
                              logistics were seamless, and the guides were
                              fantastic. Bromo's sunrise was a life-changing
                              moment!"`}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white">
                                S
                              </div>
                              <div>
                                <span className="block text-sm font-bold text-slate-900 uppercase tracking-wide">
                                  Sarah M.
                                </span>
                                <span className="block text-xs text-slate-500">
                                  November 2024
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>

                      {/* Review 2 */}
                      <SwiperSlide>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative h-full">
                          <Quote
                            size={40}
                            className="text-lime-300 absolute top-4 left-4 opacity-40"
                          />
                          <div className="relative z-10 pt-2">
                            <p className="text-base text-slate-700 leading-relaxed mb-6 italic font-medium">
                              {`"Challenging but so rewarding. The operator was
                              very professional, especially regarding the Ijen
                              safety requirements. Highly recommend!"`}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white">
                                M
                              </div>
                              <div>
                                <span className="block text-sm font-bold text-slate-900 uppercase tracking-wide">
                                  Mark T.
                                </span>
                                <span className="block text-xs text-slate-500">
                                  October 2024
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>

                {/* RIGHT COLUMN: PART 2 & 3 */}
                <div className="flex flex-col gap-8">
                  {/* PART 2: COMMITMENT TO SAFETY */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest border-b border-slate-100 pb-4">
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
                          <div className="w-20 h-20 rounded-full border-2 border-slate-200 text-slate-600 flex items-center justify-center bg-white shadow-sm transition-all group-hover:border-lime-400 group-hover:text-lime-600 group-hover:shadow-md">
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold text-slate-700 leading-tight max-w-[100px]">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PART 3: ABOUT THE PROVIDER (Re-Layout) */}
                  <div>
                    <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
                      {/* Row Icon & Text */}
                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left mb-8">
                        <div className="shrink-0 p-4 bg-white rounded-full border border-orange-100 shadow-sm text-orange-500">
                          <Shield size={32} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            This tour is operated by{" "}
                            <span className="font-bold text-slate-900">
                              {pkg.provider.brand}
                            </span>
                            , a fully licensed and insured local expert
                            committed to sustainable tourism.
                          </p>
                        </div>
                      </div>

                      {/* Contact Info (Placed Below) */}
                      <div className="pt-6 border-t border-orange-200/50 flex flex-col items-center sm:items-start">
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
                          className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-lime-600 transition-colors bg-white px-5 py-3 rounded-xl border border-orange-100 shadow-sm w-full sm:w-auto justify-center"
                        >
                          <MessageCircle size={18} className="text-lime-600" />
                          Contact us on WhatsApp:{" "}
                          {pkg.provider.official.whatsapp}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR */}
          <div className="lg:col-span-1 relative">
            <div
              id="booking-card"
              className="sticky top-32 h-fit z-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
              <div className="bg-slate-900 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-lime-400">
                  Private Expedition
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xs text-slate-400">from</span>
                  <span className="text-3xl font-black text-white">
                    {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                  </span>
                  <span className="text-xs text-slate-400">/person</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-4 mb-6 text-xs font-bold text-slate-500 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-lime-600" /> Safe
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-lime-600" /> Private
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-lime-600" /> Flexible
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-xs font-bold uppercase text-slate-900 mb-1"
                    >
                      Travel Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      min={todayISO}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pax"
                      className="block text-xs font-bold uppercase text-slate-900 mb-1"
                    >
                      Travelers{" "}
                      <span className="text-slate-400 font-normal capitalize">
                        (Min {pkg.channelMetadata.minPaxOperational})
                      </span>
                    </label>
                    <input
                      id="pax"
                      type="number"
                      min={pkg.channelMetadata.minPaxOperational}
                      max={pkg.channelMetadata.maxPaxRecommended}
                      value={pax}
                      onChange={(e) =>
                        setPax(
                          Math.max(
                            pkg.channelMetadata.minPaxOperational,
                            Number(e.target.value)
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200"
                      required
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-2 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price per person:</span>
                      <span className="font-bold text-slate-700">
                        {pricePerPerson ? formatCurrency(pricePerPerson) : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                      <span className="font-bold text-slate-900">
                        Grand Total :
                      </span>
                      <span className="font-black text-lg text-slate-900">
                        {pricePerPerson ? formatCurrency(total) : "-"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-lime-400 text-slate-900 font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-lime-500 transition-all shadow-md active:scale-[0.98]"
                  >
                    Check Availability
                  </button>
                </form>
                <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                  Powered by Xendit/Midtrans. Instant Confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD-ON MODAL (TETAP SAMA) --- */}
      {showAddOnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* ... (Konten Modal Sama Seperti Sebelumnya) ... */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">
                  Enhance Your Trip
                </h2>
                <p className="text-xs text-slate-400">
                  Optional extras for your group
                </p>
              </div>
              <button
                onClick={() => setShowAddOnModal(false)}
                className="text-white hover:text-lime-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              {addOnSelections.map((item, idx) => {
                // --- LOGIC FILTER TRANSPORT BERDASARKAN PAX ---
                if (item.type === "transport") {
                  let requiredType = "big";
                  if (pax <= 3) {
                    requiredType = "small";
                  } else if (pax >= 4 && pax <= 9) {
                    requiredType = "medium";
                  }

                  // Jika tipe transport item ini TIDAK SAMA dengan yang dibutuhkan user, JANGAN TAMPILKAN
                  if (
                    item.transportType &&
                    item.transportType !== requiredType
                  ) {
                    return null;
                  }
                }
                // ---------------------------------------------

                return (
                  <label
                    key={item.addOnId}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                      item.selected
                        ? "border-lime-500 bg-lime-50"
                        : "border-slate-200 bg-white hover:border-lime-300"
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.price)} x {pax} pax
                      </p>

                      {/* Optional: Tampilkan badge tipe transport untuk debug/info */}
                      {item.type === "transport" && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {item.transportType} Vehicle
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setAddOnSelections((prev) =>
                            prev.map((p, i) =>
                              i === idx ? { ...p, selected: checked } : p
                            )
                          );
                        }}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-6 rounded border-2 border-slate-300 peer-checked:border-lime-500 peer-checked:bg-lime-500 transition-all flex items-center justify-center">
                        {item.selected && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-6">
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="font-medium text-slate-600">
                  Add-ons Total:
                </span>
                <span className="font-bold text-slate-900 text-lg">
                  {formatCurrency(
                    addOnSelections.reduce(
                      (sum, a) => (a.selected ? sum + pax * a.price : sum),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOnModal(false);
                    setPendingBasePayload(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 bg-white py-3 text-sm font-bold uppercase text-slate-600 hover:bg-slate-100"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddOns}
                  className="flex-1 rounded-lg bg-lime-400 py-3 text-sm font-bold uppercase text-slate-900 hover:bg-lime-500 shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- MOBILE STICKY BOTTOM BAR (New) --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-5">
          {/* Price Info */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Start From
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-lime-600">
                {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                /pax
              </span>
            </div>
            {/* Optional Strikethrough Price (Mockup) */}
          </div>

          {/* Action Button */}
          <button
            onClick={scrollToBooking}
            className="flex-1 text-sm bg-lime-500 hover:bg-lime-600 text-black font-bold uppercase tracking-wide py-3 px-2 rounded-lg shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            Check Availability <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
