"use client"
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Shield,
  CalendarDays,
  MapPin,
  Info,
  CreditCard,
  ArrowRight,
  RefreshCcw,
  Clock,
  FileText,
  Download,
  MessageSquare
} from "lucide-react";

import { tourPackages } from '@/data';
import SEO from './SEO';
import Breadcrumbs from "./Breadcrumbs";
import { PriceTier } from "@/types";

interface TransformedTier {
    id: string;
    label: string;
    min: number;
    max: number | null;
    price: number;
}

const transformPriceTiers = (priceTiers: PriceTier[] | undefined): TransformedTier[] => {
    if (!priceTiers || priceTiers.length === 0) {
        return [];
    }

    const sortedTiers = [...priceTiers].sort((a, b) => a.pax - b.pax);
    
    const groupedByPrice = sortedTiers.reduce((acc: Record<string, number[]>, tier) => {
        if (!acc[tier.pricePerPerson]) {
            acc[tier.pricePerPerson] = [];
        }
        acc[tier.pricePerPerson].push(tier.pax);
        return acc;
    }, {});

    const transformed = Object.entries(groupedByPrice).map(([price, paxCounts]) => {
        const min = Math.min(...paxCounts);
        const max = Math.max(...paxCounts);
        let label;
        if (min === max) {
            label = `Booking for ${min} pax`;
        } else if (max === Infinity || paxCounts.length > 5) {
             label = `Booking for ${min}+ pax`;
        } else {
            label = `Booking for ${min} - ${max} pax`;
        }

        return {
            id: `tier_${min}_${max}`,
            label: `${label} (Price per person)`,
            min: min,
            max: max,
            price: Number(price)
        };
    });
    
    return transformed.sort((a, b) => b.min - a.min);
};


const formatIDR = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

const StepPill: React.FC<{ index: number; label: string; active: boolean; done: boolean; }> = ({ index, label, active, done }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${active ? "bg-black text-white border-black" : done ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-gray-700 border-gray-200"}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? "bg-white text-black" : done ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}>
      {done ? <CheckCircle2 className="w-4 h-4"/> : <span className="text-xs font-semibold">{index}</span>}
    </div>
    <span className="font-medium">{label}</span>
  </div>
);

interface TierCardProps {
  tier: TransformedTier;
  selected: boolean;
  onSelect: (id: string) => void;
  quantity: number;
  onQtyChange: (q: number) => void;
}

const TierCard: React.FC<TierCardProps> = ({ tier, selected, onSelect, quantity, onQtyChange }) => {
  const min = tier.min;
  const max = tier.max ?? 99;
  const canDec = quantity > min;
  const canInc = quantity < max;
  return (
    <motion.div
      layout
      onClick={() => onSelect(tier.id)}
      className={`group cursor-pointer rounded-sm border p-4 md:p-5 shadow-sm transition ${selected ? "border-black shadow-card" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base md:text-lg font-semibold text-gray-900">{tier.label}</p>
          <p className="text-sm text-gray-600 mt-1">Minimum <span className="font-medium">{tier.min}</span> travelers for this tier</p>
          <p className="text-sm text-gray-600">{formatIDR(tier.price)} <span className="text-gray-500">per person</span></p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-medium ${selected ? "bg-black text-white" : "bg-gray-100 text-gray-700"}`}>{selected ? "Selected" : "Select"}</div>
      </div>
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 border-t pt-4"
            onClick={(e)=> e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => canDec && onQtyChange(quantity - 1)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center ${canDec ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"}`}
                aria-label="Decrease quantity"
              >-</button>
              <div className="min-w-[3rem] text-center font-semibold">{quantity}</div>
              <button
                onClick={() => canInc && onQtyChange(quantity + 1)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center ${canInc ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed"}`}
                aria-label="Increase quantity"
              >+</button>
            </div>
            {quantity < min && (
              <p className="text-sm text-red-600 mt-2">Minimum for this tier is {min}.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  badge?: string;
}

const Section: React.FC<SectionProps> = ({ icon: Icon, title, children, badge }) => (
  <div className="rounded-sm border bg-white shadow-card p-5 md:p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-sm bg-gray-900 text-white flex items-center justify-center"><Icon className="w-5 h-5"/></div>
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">{title} {badge && (<span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{badge}</span>)}</h3>
        <p className="text-sm text-gray-600">Interactive demo: no real payment required.</p>
      </div>
    </div>
    {children}
  </div>
);

function createIcs({ title, start, end, location, description }: {title: string, start: string, end: string, location: string, description: string}) {
  const dt = (d: string)=> d.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//JVTO//Booking Guide Demo//EN\nBEGIN:VEVENT\nUID:${Date.now()}@jvto.demo\nDTSTAMP:${dt(new Date().toISOString())}Z\nDTSTART:${dt(start)}Z\nDTEND:${dt(end)}Z\nSUMMARY:${title}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
  return "data:text/calendar;charset=utf8," + encodeURIComponent(ics);
}

function createVoucherDataUrl({ ref, tour, date, qty, tierLabel, total }: {ref: string, tour: string, date: string, qty: number, tierLabel: string, total: number}) {
  const content = `JVTO Voucher (Demo)\n\nReference: ${ref}\nTour: ${tour}\nDate: ${date}\nTier: ${tierLabel}\nQuantity: ${qty}\nTotal Paid: ${formatIDR(total)}\n\nThis is a demonstration voucher from the interactive guide.`;
  return "data:text/plain;charset=utf-8," + encodeURIComponent(content);
}

const OrderSummaryCard: React.FC<{
  date: string;
  tierLabel: string;
  unitPrice: number;
  tier: TransformedTier | null;
  quantity: number;
  total: number;
  onReset: () => void;
  showSecureMessage?: boolean;
}> = ({ date, tierLabel, unitPrice, tier, quantity, total, onReset, showSecureMessage = false }) => (
    <div className="sticky top-24 rounded-sm border bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
                <FileText className="w-5 h-5"/>
                <h4 className="font-semibold">Order summary</h4>
            </div>
            <button onClick={onReset} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors group">
                <RefreshCcw className="w-3 h-3 group-hover:rotate-[-90deg] transition-transform"/>
                <span className="group-hover:underline">Clear</span>
            </button>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Date</span><span>{date || "—"}</span></div>
            <div className="flex justify-between"><span>Tier</span><span>{tierLabel}</span></div>
            <div className="flex justify-between"><span>Price per person</span><span>{tier ? formatIDR(unitPrice) : "—"}</span></div>
            <div className="flex justify-between"><span>Quantity</span><span>{quantity || "—"}</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatIDR(total)}</span></div>
        </div>
        {showSecureMessage && (
            <div className="mt-4 text-xs text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4"/> Secure checkout: your payment is encrypted.
            </div>
        )}
    </div>
);

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const tour = useMemo(() => tourPackages.find(t => t.slug === slug), [slug]);
  const tiers = useMemo(() => transformPriceTiers(tour?.priceTiers), [tour?.priceTiers]);

  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [paid, setPaid] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [pickupType, setPickupType] = useState("");
  const [flight, setFlight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelAddr, setHotelAddr] = useState("");
  const [notes, setNotes] = useState("");
  const [detailsSaved, setDetailsSaved] = useState(false);

  const tier = useMemo(()=> tiers.find(t=> t.id === selectedTierId) || null, [selectedTierId, tiers]);
  const unitPrice = tier?.price || 0;
  const total = unitPrice * (quantity || 0);
  const tierLabel = tier?.label?.split("(Price")[0]?.trim() || "—";

  const readyStep1 = Boolean(date && tier && quantity >= tier.min && email && phone);
  const readyStep2 = Boolean(consent && readyStep1);

  const resetAll = () => {
    setStep(1);
    setDate("");
    setSelectedTierId(null);
    setQuantity(0);
    setEmail("");
    setPhone("");
    setConsent(false);
    setPaid(false);
    setBookingRef("");
    setPickupType("");
    setFlight("");
    setArrivalDate("");
    setArrivalTime("");
    setHotelName("");
    setHotelAddr("");
    setNotes("");
    setDetailsSaved(false);
  };

  const handleSelectTier = (id: string) => {
    setSelectedTierId(id);
    const t = tiers.find(x=> x.id===id);
    setQuantity(t?.min || 0);
  };

  const handlePay = async () => {
    setPaid(false);
    await new Promise(r=> setTimeout(r, 800));
    setPaid(true);
    const ref = "JVTO-" + Math.random().toString(36).slice(2,8).toUpperCase();
    setBookingRef(ref);
    setStep(3);
  };

  const icsHref = useMemo(()=> {
    if(!tour) return "";
    return createIcs({
      title: `JVTO Tour: ${tour.label} (Demo)`,
      start: new Date().toISOString(),
      end: new Date(Date.now()+ 3*60*60*1000).toISOString(),
      location: pickupType === "meet" ? "Meeting Point" : pickupType === "hotel" ? (hotelName || "Hotel pickup") : "Airport pickup",
      description: `Booking ${bookingRef}`
    })
  }, [bookingRef, pickupType, hotelName, tour?.label]);

  const voucherHref = useMemo(()=> {
    if(!tour) return "";
    return createVoucherDataUrl({
      ref: bookingRef || "JVTO-DEMO",
      tour: tour.label,
      date: date || "TBD",
      qty: quantity || 0,
      tierLabel,
      total
    })
  }, [bookingRef, date, quantity, tierLabel, total, tour?.label]);

  if (!tour) {
    return redirect("/tours");
  }
  
  const fullTourSlug = `/tours/${tour.slug}`;

  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tours', path: '/tours' },
    { name: tour.label, path: fullTourSlug },
    { name: 'Book', path: `${fullTourSlug}/book` },
  ];

  return (
    <>
    <SEO title={`Book "${tour.label}" | JVTO`} description={`Secure your spot for the ${tour.label}. All-inclusive, private tours with transparent pricing.`} />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 text-gray-900">
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <Breadcrumbs crumbs={breadcrumbCrumbs} />
        
        <div className="text-center my-6">
            <p className="text-sm text-gray-500">{tour.label}</p>
            <h1 className="text-2xl md:text-3xl font-semibold">Interactive Booking Guide</h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <StepPill index={1} label="Select options" active={step===1} done={step>1}/>
          <StepPill index={2} label="Review & Pay" active={step===2} done={step>2}/>
          <StepPill index={3} label="Confirmation" active={step===3} done={step>3}/>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section icon={CalendarDays} title="Choose your date & options">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Date</label>
                    <input type="date" value={date} onChange={e=> setDate(e.target.value)} className="mt-1 w-full rounded-sm border px-4 h-12 focus:outline-none focus:ring-2 focus:ring-black"/>
                    {!date && (<p className="text-xs text-gray-500 mt-1">Pick your preferred tour date.</p>)}
                  </div>
                  <div className="rounded-sm border p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-800 mb-2">Group Discount Available</p>
                    <div className="text-xs bg-emerald-100 text-emerald-700 inline-block px-2 py-0.5 rounded-full mb-2">FREE OF CHARGE</div>
                    <p className="text-sm text-gray-700">Book for larger groups and save more! Special discounts apply for bookings of 18+ people.</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {tiers.length > 0 ? tiers.map((t)=> (
                    <TierCard
                      key={t.id}
                      tier={t}
                      selected={selectedTierId===t.id}
                      onSelect={handleSelectTier}
                      quantity={selectedTierId===t.id ? quantity : t.min}
                      onQtyChange={(q)=> setQuantity(Math.max(t.min, Math.min(q, t.max ?? 99)))}
                    />
                  )) : (
                    <div className="rounded-sm border p-4 bg-gray-50 text-center">
                      <p className="text-gray-700">Pricing for this tour is available on request.</p>
                      <p className="text-sm text-gray-500 mt-1">Please contact us for a custom quote.</p>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Email</label>
                    <input type="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-sm border px-4 h-12 focus:outline-none focus:ring-2 focus:ring-black"/>
                    {email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && (
                      <p className="text-xs text-red-600 mt-1">Enter a valid email address.</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-800">WhatsApp / Phone</label>
                    <input type="tel" value={phone} onChange={e=> setPhone(e.target.value)} placeholder="+62 812-xxxx-xxxx" className="mt-1 w-full rounded-sm border px-4 h-12 focus:outline-none focus:ring-2 focus:ring-black"/>
                    {phone && !/^\+?\d[\d\s-]{7,}$/.test(phone) && (
                      <p className="text-xs text-red-600 mt-1">Enter a valid phone number.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-2"><Info className="w-4 h-4"/> This demo enforces each {`tier's`} minimum quantity.</div>
                  <button
                    onClick={()=> setStep(2)}
                    disabled={!readyStep1}
                    className={`inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-sm text-white ${readyStep1 ? "bg-black hover:bg-gray-900" : "bg-gray-300 cursor-not-allowed"}`}
                  >Continue <ArrowRight className="w-4 h-4"/></button>
                </div>
              </Section>
            </div>

            <div className="lg:col-span-1">
              <OrderSummaryCard
                date={date}
                tierLabel={tierLabel}
                unitPrice={unitPrice}
                tier={tier}
                quantity={quantity}
                total={total}
                onReset={resetAll}
                showSecureMessage={true}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section icon={CreditCard} title="Review & Pay">
                <div className="rounded-sm border p-4 bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between"><span>Tour</span><span className="font-medium text-right">{tour.label}</span></div>
                    <div className="flex justify-between"><span>Date</span><span className="font-medium">{date}</span></div>
                    <div className="flex justify-between"><span>Tier</span><span className="font-medium">{tierLabel}</span></div>
                    <div className="flex justify-between"><span>Quantity</span><span className="font-medium">{quantity}</span></div>
                    <div className="flex justify-between"><span>Price per person</span><span className="font-medium">{formatIDR(unitPrice)}</span></div>
                    <div className="flex justify-between font-semibold border-t pt-2 md:col-span-2"><span>Total</span><span>{formatIDR(total)}</span></div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <input id="consent" type="checkbox" checked={consent} onChange={e=> setConsent(e.target.checked)} className="mt-1"/>
                  <label htmlFor="consent" className="text-sm text-gray-700">I agree to the <a className="underline" href="#" onClick={(e)=> e.preventDefault()}>Terms</a> and <a className="underline" href="#" onClick={(e)=> e.preventDefault()}>Privacy Policy</a>.</label>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-2"><Shield className="w-4 h-4"/> Secure checkout: your payment is encrypted.</div>
                  <button
                    onClick={handlePay}
                    disabled={!readyStep2}
                    className={`inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-sm text-white ${readyStep2 ? "bg-black hover:bg-gray-900" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    {paid ? "Processing…" : "Pay Now"} <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              </Section>
            </div>

            <div className="lg:col-span-1">
              <OrderSummaryCard
                date={date}
                tierLabel={tierLabel}
                unitPrice={unitPrice}
                tier={tier}
                quantity={quantity}
                total={total}
                onReset={resetAll}
                showSecureMessage={true}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section icon={CheckCircle2} title="You're booked!">
                <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 border rounded-sm p-4">
                  <div className="flex justify-between"><span>Booking reference</span><span className="font-medium">{bookingRef}</span></div>
                  <div className="flex justify-between"><span>Date</span><span>{date}</span></div>
                  <div className="flex justify-between"><span>Tier</span><span>{tierLabel}</span></div>
                  <div className="flex justify-between"><span>Quantity</span><span>{quantity}</span></div>
                  <div className="flex justify-between"><span>Total paid</span><span>{formatIDR(total)}</span></div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={voucherHref} download={`JVTO-${bookingRef}-voucher.txt`} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border hover:bg-gray-50"><Download className="w-4 h-4"/> Download voucher</a>
                  <a href={icsHref} download={`JVTO-${bookingRef}.ics`} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border hover:bg-gray-50"><CalendarDays className="w-4 h-4"/> Add to Calendar</a>
                  <button onClick={()=> document.getElementById("details")?.scrollIntoView({behavior:'smooth'})} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-black text-white hover:bg-gray-900"><FileText className="w-4 h-4"/> Complete Your Details</button>
                  <a href="#" onClick={(e)=> e.preventDefault()} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border hover:bg-gray-50"><MessageSquare className="w-4 h-4"/> WhatsApp support</a>
                </div>
              </Section>

              <Section icon={MapPin} title="Pickup & Preferences" badge="Action required">
                <div id="details" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-800">Pickup option</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button onClick={()=> setPickupType("airport")} className={`px-4 py-3 min-h-[48px] rounded-sm border ${pickupType==='airport' ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>Airport</button>
                      <button onClick={()=> setPickupType("hotel")} className={`px-4 py-3 min-h-[48px] rounded-sm border ${pickupType==='hotel' ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>Hotel</button>
                      <button onClick={()=> setPickupType("meet")} className={`px-4 py-3 min-h-[48px] rounded-sm border ${pickupType==='meet' ? 'bg-black text-white border-black' : 'hover:bg-gray-50'}`}>Meet point</button>
                    </div>
                  </div>

                  {pickupType === "airport" && (<div className="grid md:grid-cols-3 gap-3"><div><label className="text-sm font-medium text-gray-800">Arrival flight</label><input value={flight} onChange={e=> setFlight(e.target.value)} placeholder="QZ 123" className="mt-1 w-full rounded-sm border px-4 h-12"/></div><div><label className="text-sm font-medium text-gray-800">Arrival date</label><input type="date" value={arrivalDate} onChange={e=> setArrivalDate(e.target.value)} className="mt-1 w-full rounded-sm border px-4 h-12"/></div><div><label className="text-sm font-medium text-gray-800">Arrival time</label><input type="time" value={arrivalTime} onChange={e=> setArrivalTime(e.target.value)} className="mt-1 w-full rounded-sm border px-4 h-12"/></div></div>)}
                  {pickupType === "hotel" && (<div className="grid md:grid-cols-2 gap-3"><div><label className="text-sm font-medium text-gray-800">Hotel name</label><input value={hotelName} onChange={e=> setHotelName(e.target.value)} className="mt-1 w-full rounded-sm border px-4 h-12"/></div><div><label className="text-sm font-medium text-gray-800">Address</label><input value={hotelAddr} onChange={e=> setHotelAddr(e.target.value)} className="mt-1 w-full rounded-sm border px-4 h-12"/></div></div>)}
                  {pickupType === "meet" && (<div className="rounded-sm border p-4 bg-gray-50 text-sm text-gray-700">Meeting point: <strong>Probolinggo Station (Demo)</strong><br/> Show this voucher to your guide.</div>)}

                  <div>
                    <label className="text-sm font-medium text-gray-800">Additional requests (optional)</label>
                    <textarea value={notes} onChange={e=> setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-sm border px-3 py-2" placeholder="Dietary, mobility, infant seat, etc."/>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={()=> setDetailsSaved(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-black text-white hover:bg-gray-900">Save Details <CheckCircle2 className="w-4 h-4"/></button>
                    {detailsSaved && <span className="text-sm text-emerald-700">Details saved</span>}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center gap-2 mt-2"><Clock className="w-4 h-4"/> Please complete your pickup details at least **48 hours** before your tour.</div>
                </div>
              </Section>
            </div>

            <div className="lg:col-span-1">
              <OrderSummaryCard
                date={date}
                tierLabel={tierLabel}
                unitPrice={unitPrice}
                tier={tier}
                quantity={quantity}
                total={total}
                onReset={resetAll}
              />
            </div>
          </div>
        )}
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur p-3">
        <div className="max-w-6xl mx-auto px-1 flex items-center justify-between">
          <div><p className="text-xs text-gray-500">Total</p><p className="text-base font-semibold">{formatIDR(total)}</p></div>
          {step === 1 && (<button onClick={()=> readyStep1 && setStep(2)} disabled={!readyStep1} className={`inline-flex items-center justify-center gap-2 px-6 h-12 rounded-sm text-white ${readyStep1 ? 'bg-black hover:bg-gray-900' : 'bg-gray-300 cursor-not-allowed'}`}>Continue <ArrowRight className="w-4 h-4"/></button>)}
          {step === 2 && (<button onClick={handlePay} disabled={!readyStep2} className={`inline-flex items-center justify-center gap-2 px-6 h-12 rounded-sm text-white ${readyStep2 ? 'bg-black hover:bg-gray-900' : 'bg-gray-300 cursor-not-allowed'}`}>Pay Now <ArrowRight className="w-4 h-4"/></button>)}
          {step === 3 && (<a href={voucherHref} download={`JVTO-${bookingRef}-voucher.txt`} className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-sm border hover:bg-gray-50"><Download className="w-4 h-4"/> Voucher</a>)}
        </div>
      </div>
    </div>
    </>
  );
}