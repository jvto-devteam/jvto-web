// PackageDetailPage.tsx
"use client";

import { useMemo, useState } from "react";
import { TourPackageDetail } from "@/interfaces";
import { useRouter } from "next/navigation";

interface Props {
  initialData: TourPackageDetail;
}

// =================================================================
// 1. UTILITIES & COMPONENTS
// =================================================================

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

// Reusable "JVTO" Style Section Header
const SectionHeader = ({ title, icon }: { title: string; icon?: string }) => (
  <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold uppercase tracking-wide text-slate-900">
    {icon && <span className="text-xl">{icon}</span>}
    {title}
  </h3>
);

// =================================================================
// 2. MAIN PAGE COMPONENT
// =================================================================

export default function PackageDetailPage({ initialData }: Props) {
  const router = useRouter();
  const pkg = initialData.product;

  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState(
    pkg.imageUrl || pkg.gallery[0]
  );
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "details">("overview");
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [startDate, setStartDate] = useState("");
  const [pax, setPax] = useState(2);

  const pricePerPerson = useMemo(
    () => getPriceForPax(pax, pkg.offers.tiers),
    [pax, pkg.offers.tiers]
  );
  const total = pricePerPerson ? pricePerPerson * pax : 0;

  // --- ADD-ON LOGIC ---
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [pendingBasePayload, setPendingBasePayload] = useState<any | null>(null);
  const [addOnSelections, setAddOnSelections] = useState(
    pkg.addOns?.map((a: any) => ({
      addOnId: a.id,
      label: a.name,
      price: a.price,
      selected: false,
    })) ?? []
  );

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  // --- HANDLERS ---
  const finalizeBooking = (
    basePayload: any,
    addons: { addOnId: string; label: string; qty: number; price: number; subtotal: number }[]
  ) => {
    const addOnTotal = addons.reduce((sum, a) => sum + a.subtotal, 0);
    const grandTotal = basePayload.packageTotal + addOnTotal;

    const payload = {
      ...basePayload,
      packageLabel: pkg.name,
      paxMin: pkg.channelMetadata.minPaxOperational,
      priceTiers: pkg.offers.tiers,
      allAddOns: pkg.addOns,
      imageUrl: pkg.imageUrl,
      addon: addons,
      addOnTotal,
      grandTotal,
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
      }));

    finalizeBooking(pendingBasePayload, selectedAddOns);
    setShowAddOnModal(false);
    setPendingBasePayload(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-900 md:py-30">
      <div className="mx-auto container px-4">
        
        {/* HEADER SECTION */}
        <header className="mb-8 border-b border-slate-200 pb-8">
          {/* Breadcrumb / Meta Tags */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="bg-slate-200 px-2 py-1 text-slate-700">
              {pkg.originCity} → {pkg.endCity}
            </span>
            <span>/</span>
            <span className="text-lime-600">
              {pkg.marketedDurationLabel} • {pkg.route.join(" + ")}
            </span>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 md:text-5xl">
                {pkg.name}
              </h1>
              <p className="max-w-2xl text-base text-slate-600 md:text-lg">
                Explore Ijen, Bromo and Madakaripura in one seamless, private
                adventure starting and ending in Surabaya.
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                   ⚡ Level: {pkg.physicalDifficulty}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                   🛡️ Tourist Police Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                   👥 Private Group
                </span>
              </div>
            </div>

            {/* Price Teaser (Mobile Only - Desktop in Sidebar) */}
            <div className="flex flex-col items-start lg:items-end lg:hidden">
                <span className="text-xs font-bold uppercase text-slate-400">Starts From</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-lime-600">
                        {formatCurrency(pkg.offers.aggregateOffer.lowPrice)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/pax</span>
                </div>
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)]">
          
          {/* LEFT COLUMN: CONTENT */}
          <main className="space-y-10">
            
            {/* Gallery */}
            <section className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-200 shadow-lg md:aspect-[16/9] lg:aspect-[2/1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt={pkg.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {pkg.gallery.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === img
                        ? "border-lime-500 opacity-100 ring-2 ring-lime-200"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* TABS NAVIGATION */}
            <div className="sticky top-0 z-10 bg-slate-50 pt-2 pb-4">
                <div className="flex w-full border-b-2 border-slate-200">
                {[
                    { id: "overview", label: "Overview" },
                    { id: "itinerary", label: "Itinerary" },
                    { id: "details", label: "Gear & Details" },
                ].map((tab) => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-widest transition-colors ${
                        activeTab === tab.id
                        ? "border-b-4 border-lime-400 text-slate-900"
                        : "border-b-4 border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                    >
                    {tab.label}
                    </button>
                ))}
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
                    <p>{pkg.description}</p>
                  </div>

                  {/* Highlights & Perfect For */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-lime-600">
                        <span className="text-lg">✨</span> Highlights
                      </h4>
                      <ul className="space-y-3">
                        {pkg.marketing.highlightsBullets.map((h) => (
                          <li key={h} className="flex items-start gap-3 text-sm text-slate-700">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900">
                        <span className="text-lg">🎯</span> Who is this for?
                      </h4>
                      <ul className="space-y-3">
                        {pkg.marketing.perfectFor.map((p) => (
                          <li key={p} className="flex items-start gap-3 text-sm text-slate-700">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-900" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Safety Card */}
                  <div className="rounded-xl border-l-4 border-lime-500 bg-white p-6 shadow-sm">
                    <div className="flex gap-4">
                        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xl text-lime-400 sm:flex">
                            🛡️
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-900">Safety & Standards</h4>
                            <p className="text-sm text-slate-600">{pkg.marketing.safetyPositioning}</p>
                            <p className="mt-2 text-xs font-medium text-slate-400">
                                Operated by: {pkg.provider.brand} ({pkg.provider.legalEntity})
                            </p>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "itinerary" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  {pkg.itineraryDays.map((day) => {
                    const isOpen = openDay === day.day;
                    return (
                      <div
                        key={day.day}
                        className={`overflow-hidden rounded-xl border transition-all ${
                          isOpen
                            ? "border-slate-300 bg-white shadow-md"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenDay(isOpen ? null : day.day)}
                          className="flex w-full items-center gap-4 px-6 py-4 text-left"
                        >
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                              isOpen ? "bg-slate-900 text-lime-400" : "bg-slate-200 text-slate-500"
                          }`}>
                            {day.day}
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-bold uppercase tracking-wide ${isOpen ? "text-slate-900" : "text-slate-600"}`}>
                                {day.title}
                            </h4>
                            <p className="text-xs text-slate-400">{day.overnight || "Day Trip"}</p>
                          </div>
                          <span className="text-xl font-bold text-slate-300">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-100 px-6 py-5 pl-[4.5rem]">
                            <p className="mb-4 text-sm leading-relaxed text-slate-600">
                              {day.summary}
                            </p>
                            <div className="relative space-y-6 border-l-2 border-slate-100 pl-6">
                              {day.activities.map((act: any, idx: number) => (
                                <div key={idx} className="relative">
                                  <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-lime-500 shadow-sm" />
                                  <span className="block text-xs font-bold text-slate-400 mb-1">
                                    {act.timeWindow?.split(" ")[0]}
                                  </span>
                                  <h5 className="text-sm font-bold text-slate-900">
                                    {act.name || act.description}
                                  </h5>
                                  {act.location && (
                                    <p className="text-xs text-slate-500">📍 {act.location}</p>
                                  )}
                                  {act.description && act.name && (
                                    <p className="mt-1 text-xs text-slate-600">
                                      {act.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Meals */}
                            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                {Object.entries(day.mealsPlan).map(([meal, status]) => (
                                    <span key={meal} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                        {meal}: <span className="text-slate-900">{status as string}</span>
                                    </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid gap-8 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-6">
                    <div>
                        <SectionHeader title="Included" icon="✅" />
                        <ul className="space-y-2">
                            {pkg.inclusions.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-slate-700">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <SectionHeader title="Gear Provided" icon="🎒" />
                        <ul className="space-y-2">
                            {pkg.gear.provided.map((item: string) => (
                                <li key={item} className="flex gap-3 text-sm text-slate-700">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                        <SectionHeader title="Not Included" icon="❌" />
                        <ul className="space-y-2">
                            {pkg.exclusions.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-slate-500">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <SectionHeader title="Bring Your Own" icon="🧢" />
                        <ul className="space-y-2">
                            {pkg.gear.recommended.map((item: string) => (
                                <li key={item} className="flex gap-3 text-sm text-slate-700">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT COLUMN: STICKY BOOKING CARD */}
          <aside className="relative">
            <div className="sticky top-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              {/* Card Header */}
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

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="startDate" className="mb-1 block text-xs font-bold uppercase text-slate-900">
                       Start Date <span className="text-slate-400 font-normal normal-case">(Min lead time: {pkg.channelMetadata.minLeadTimeHours}h)</span>
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
                    <label htmlFor="pax" className="mb-1 block text-xs font-bold uppercase text-slate-900">
                       Group Size <span className="text-slate-400 font-normal normal-case">({pkg.channelMetadata.minPaxOperational}-{pkg.channelMetadata.maxPaxRecommended} pax)</span>
                    </label>
                    <input
                      id="pax"
                      type="number"
                      min={pkg.channelMetadata.minPaxOperational}
                      max={pkg.channelMetadata.maxPaxRecommended}
                      value={pax}
                      onChange={(e) => setPax(Math.max(pkg.channelMetadata.minPaxOperational, Number(e.target.value)))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200"
                      required
                    />
                  </div>

                  {/* Dynamic Price Calculation */}
                  <div className="rounded-lg bg-slate-50 p-4 text-sm">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500">Price per person</span>
                        <span className="font-bold text-slate-900">{pricePerPerson ? formatCurrency(pricePerPerson) : "..."}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="font-bold text-slate-900">Total Estimate</span>
                        <span className="font-black text-lg text-slate-900">{pricePerPerson ? formatCurrency(total) : "..."}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-lime-400 px-4 py-4 text-sm font-bold uppercase tracking-widest text-slate-900 shadow-md transition-all hover:bg-lime-500 hover:shadow-lg active:scale-[0.98]"
                  >
                    Check Availability
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    Secure checkout powered by Xendit/Midtrans. <br/>
                    Instant confirmation available.
                  </p>
                </form>

                {/* Contact Links */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <a 
                        href={`https://wa.me/${pkg.provider.official.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-bold uppercase text-slate-700 hover:bg-slate-50"
                    >
                        💬 WhatsApp
                    </a>
                    <a 
                        href={`mailto:${pkg.provider.official.email}`}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-bold uppercase text-slate-700 hover:bg-slate-50"
                    >
                        ✉️ Email
                    </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ADD-ON MODAL */}
      {showAddOnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-slate-900 px-6 py-4">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Enhance Your Trip</h2>
                <p className="text-xs text-slate-400">Select optional add-ons for your group</p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
              {addOnSelections.map((item, idx) => (
                <label
                  key={item.addOnId}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
                    item.selected
                      ? "border-lime-500 bg-lime-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(item.price)} x {pax} pax
                    </p>
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
                    <div className="h-6 w-6 rounded border-2 border-slate-300 peer-checked:border-lime-500 peer-checked:bg-lime-500 transition-all"></div>
                    {item.selected && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-6">
                <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="font-medium text-slate-600">Add-ons Total:</span>
                    <span className="font-bold text-slate-900">
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
                        className="flex-1 rounded-lg border border-slate-300 bg-white py-3 text-sm font-bold uppercase text-slate-600 hover:bg-slate-50"
                    >
                        Skip
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmAddOns}
                        className="flex-1 rounded-lg bg-lime-400 py-3 text-sm font-bold uppercase text-slate-900 hover:bg-lime-500"
                    >
                        Continue
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}