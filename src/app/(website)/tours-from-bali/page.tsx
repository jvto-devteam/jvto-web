import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Users,
  Car,
  Utensils,
  Hotel,
  MessageCircle,
  Ship,
  AlertTriangle,
  BadgeCheck,
  GraduationCap,
} from "lucide-react";
import LPFaq from "@/components/website/LandingPage/LPFaq";

export const metadata: Metadata = {
  title: "Bali to Bromo & Ijen Tour — Private, Door-to-Door from Your Villa | JVTO",
  description:
    "Fully private Bali to Bromo & Ijen tours. Door-to-door from your Bali villa. Ferry included, Police-Led safety, licensed operator. Book online on the official JVTO website.",
};

const WA_LINK = "https://wa.me/6282244788833";
const WA_MSG_BALI = "Hi JVTO, I'm in Bali and interested in a private tour to Bromo & Ijen. Can you share options and pricing?";

const ROUTE_STEPS = [
  { point: "Your Bali Villa / Hotel", detail: "Door-to-door pickup anywhere in Bali" },
  { point: "Gilimanuk Port (West Bali)", detail: "~3 hrs drive from Kuta/Seminyak" },
  { point: "Ferry Crossing", detail: "Bali → Java (30 min, ferry included)" },
  { point: "Ketapang Port, Banyuwangi", detail: "Arrive East Java — JVTO driver waits" },
  { point: "Kawah Ijen", detail: "Blue Fire trek, health screening included" },
  { point: "Mount Bromo", detail: "Sunrise at Penanjakan viewpoint" },
  { point: "Drop-off: Surabaya or Back to Bali", detail: "Your choice of final destination" },
];

const PACKAGES = [
  {
    name: "3D2N Bromo & Ijen from Bali",
    duration: "3 Days 2 Nights",
    price: "From USD 320/pax",
    highlights: [
      "Pickup from your Bali villa/hotel",
      "Ferry tickets Bali ↔ Java included",
      "Mt. Bromo Sunrise + Ijen Blue Fire",
      "Health Screening Included",
      "2 nights hotel included",
      "All meals, entrance fees, 4WD",
    ],
    href: "/tours/from-bali",
    badge: "Best Seller",
  },
  {
    name: "4D3N Bromo, Ijen & Tumpak Sewu",
    duration: "4 Days 3 Nights",
    price: "From USD 420/pax",
    highlights: [
      "All 3D2N inclusions +",
      "Tumpak Sewu Waterfall",
      "Madakaripura Falls",
      "3 nights hotel included",
      "More relaxed pace — no rushing",
    ],
    href: "/tours/from-bali",
    badge: "Full Experience",
  },
];

const INCLUSIONS = [
  { icon: Car, label: "Bali → Java Private 4WD" },
  { icon: Ship, label: "Ferry Tickets Included" },
  { icon: Users, label: "Licensed English Guide" },
  { icon: Shield, label: "Ijen Health Screening" },
  { icon: CheckCircle, label: "All Entrance Fees" },
  { icon: Utensils, label: "All Meals Included" },
  { icon: Hotel, label: "Hotels Included" },
  { icon: CheckCircle, label: "Gas Mask at Ijen" },
];

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    title: "Verifiable License",
    desc: "License No. 1102230032918 — publicly verifiable before you pay a single rupiah.",
  },
  {
    icon: Shield,
    title: "Police Founder",
    desc: "Founded by an Active Tourist Police Officer. We've seen the scams — we built JVTO to be the alternative.",
  },
  {
    icon: CheckCircle,
    title: "No Cash Upfront in Bali",
    desc: "Deposit paid securely online. No one from 'Bali agents' collecting cash at your villa door.",
  },
  {
    icon: BadgeCheck,
    title: "One Operator, Full Journey",
    desc: "From your Bali pickup to final drop-off — one contact, one price, no middlemen.",
  },
];

const REVIEWS = [
  {
    name: "Alydies Yue",
    country: "Hong Kong",
    rating: 5,
    text: "Joined the 3D2N tour starting from Bali. The tour was really well organized — food and accommodation were way better than expected. Guide Gufron was super friendly and professional.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocK8V21CQPF5POA68LR0k2Y2DA7-p3isf9yksWYn8O_mAn2iaQ=s120-c-rp-mo-br100",
  },
  {
    name: "Remy H",
    country: "Netherlands",
    rating: 5,
    text: "Me and my girlfriend had an amazing trip from Bali. The 3D2N Ijen + Bromo tour — everything was well arranged. Special thanks to guide Gufron who made this trip special.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocLaF32GQ_E3jcrj4JYyoSVZ54QAdvusR_qhqsnflGpRgEdffg=s120-c-rp-mo-br100",
  },
  {
    name: "Andrés",
    country: "Spain",
    rating: 5,
    text: "Incredible experience, starting from Bali. Very honest — you know the hotels before booking. Driver Yandi was always attentive, we were first at Bromo and Ijen.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKNkXY3yMVG-RG2yywgexvG9F2cDyItZZohmHev2Lu4Y118fA=s120-c-rp-mo-ba2-br100",
  },
];

const FAQ_ITEMS = [
  {
    question: "How far is Bali to Bromo? Is it really door-to-door?",
    answer:
      "Total driving + ferry time is around 12-14 hours from South Bali to Ijen/Bromo area. Yes, we pick you up directly from your villa/hotel in Bali, handle the ferry crossing at Gilimanuk/Ketapang, and drop you at Bromo or Surabaya at the end. You don't need to arrange anything yourself.",
  },
  {
    question: "Is JVTO a legitimate operator? How do I avoid Bali tour scams?",
    answer:
      "Legitimate concern — there are many fake operators targeting tourists in Bali. JVTO's license number is 1102230032918, which you can verify on the Indonesian government's TDUP database. Our founder is an active Tourist Police officer. Never pay full cash to someone at your villa door claiming to represent us — our payment process is transparent and documented.",
  },
  {
    question: "Are ferry tickets included in the price?",
    answer:
      "Yes — the Bali-Java ferry (Gilimanuk to Ketapang) is fully included in your package. You don't need to buy tickets, queue, or navigate the port. Our driver handles everything.",
  },
  {
    question: "Can I go back to Bali at the end of the tour?",
    answer:
      "Yes. Most 3D2N packages end with a drop-off at either Surabaya Airport (for onward flights) or Ketapang Port (for the return ferry to Bali). Let us know your preference at booking.",
  },
  {
    question: "I'm a student — is there a discount?",
    answer:
      "Yes! We offer ISIC (International Student Identity Card) discounts. Show your valid ISIC card and ask about student pricing when you contact us. We believe adventure should be accessible to travelers on a budget.",
  },
  {
    question: "What if I'm solo traveling from Bali — is it safe?",
    answer:
      "Absolutely. Solo travelers are among our most common guests. You get a private vehicle and guide — no strangers in your group. Our Police-Led safety culture means your wellbeing is taken seriously at every step of the journey.",
  },
  {
    question: "How far in advance should I book from Bali?",
    answer:
      "We recommend at least 3-5 days in advance, especially during peak season (July-August, December-January). Ferry slots and accommodations near Ijen fill up fast. Contact us as early as possible to secure your preferred dates.",
  },
];

const COMPARISON = [
  { feature: "Pickup from Bali hotel/villa", jvto: true, others: false },
  { feature: "Ferry tickets included", jvto: true, others: false },
  { feature: "100% private tour (no groups)", jvto: true, others: false },
  { feature: "Ijen health screening included", jvto: true, others: false },
  { feature: "Licensed operator (verifiable)", jvto: true, others: false },
  { feature: "Police-Led safety protocols", jvto: true, others: false },
  { feature: "Transparent pricing (no hidden fees)", jvto: true, others: false },
  { feature: "Hotel rooms disclosed before booking", jvto: true, others: false },
];

export default function ToursFromBaliLP() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/hero/bali.jpg"
            alt="Bali to Bromo Ijen private tour"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white mt-20">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-jvto-green/20 border border-jvto-green/40 text-jvto-green px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Shield size={14} />
            Door-to-Door · Ferry Included · 100% Private
          </div>

          <h1 className="text-3xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-tight max-w-4xl mx-auto">
            Bali to Bromo & Ijen —{" "}
            <span className="text-jvto-green">Fully Private, From Your Villa</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl mx-auto font-light">
            Ferry included · Police-Led Safety · No Scams, No Middlemen
          </p>
          <p className="text-sm md:text-base text-gray-300 mb-10 max-w-2xl mx-auto">
            One operator. Door-to-door from your Bali hotel to Bromo & Ijen and back — or drop-off in Surabaya.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${WA_LINK}?text=${encodeURIComponent(WA_MSG_BALI)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-sm font-black uppercase tracking-wide text-base transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <MessageCircle size={20} />
              Ask on WhatsApp
            </a>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-wide text-sm transition-all"
            >
              See Tour Packages
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Rating */}
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-gray-300">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#9fce33" className="text-jvto-green" />
              ))}
            </div>
            <span className="font-medium">4.9/5 · 120+ verified reviews</span>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────── */}
      <section className="bg-jvto-dark text-white py-6 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, title: "Police-Led", sub: "Founded by Tourist Police Officer" },
              { icon: Ship, title: "Ferry Included", sub: "Bali–Java crossing handled" },
              { icon: BadgeCheck, title: "Licensed Operator", sub: "No. 1102230032918" },
              { icon: CheckCircle, title: "All-Inclusive", sub: "Door-to-door, zero hidden fees" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={18} className="text-jvto-green" />
                </div>
                <p className="font-black text-sm uppercase tracking-wide">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVOID SCAMS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
                <AlertTriangle size={22} className="text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-jvto-dark mb-2">
                  Protect Yourself from Bali Tour Scams
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Dozens of unofficial "agents" in Bali sell Bromo & Ijen tours with no license, no safety protocol, and no accountability. Here's how to verify JVTO is real before you pay anything.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-amber-100 rounded-lg p-5 flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-jvto-green/10 flex items-center justify-center">
                    <Icon size={18} className="text-jvto-green" />
                  </div>
                  <div>
                    <p className="font-bold text-jvto-dark text-sm mb-1">{title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/verify-jvto"
                target="_blank"
                className="inline-flex items-center gap-2 bg-jvto-dark text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors"
              >
                <BadgeCheck size={16} />
                Verify JVTO Now
              </Link>
              <Link
                href="/why-jvto/our-story"
                target="_blank"
                className="inline-flex items-center gap-2 border border-jvto-dark text-jvto-dark px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-wide hover:bg-jvto-dark hover:text-white transition-colors"
              >
                Meet the Founder →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTE MAP ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              Your Route
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              Bali to Bromo — Full Route Breakdown
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Full transparency on every step of your journey. No surprises.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Line */}
                {i < ROUTE_STEPS.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-jvto-green/20" />
                )}
                {/* Dot */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-jvto-green bg-white flex items-center justify-center z-10">
                  <MapPin size={16} className="text-jvto-green" />
                </div>
                <div className="pt-1">
                  <p className="font-black text-jvto-dark text-sm uppercase tracking-wide">
                    {step.point}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 text-sm text-gray-600">
              <Ship size={18} className="text-jvto-green" />
              <span>
                <strong className="text-jvto-dark">Ferry (Bali → Java):</strong> 30-minute crossing.
                All tickets handled by JVTO. No port queuing.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────────────────── */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              Tour Packages
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              Choose Your Package
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              All packages include Bali pickup, ferry, health screening, and 100% private service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-jvto-dark px-6 py-4 flex items-center justify-between">
                  <span className="text-white font-black uppercase text-sm tracking-wide">
                    {pkg.name}
                  </span>
                  <span className="bg-jvto-green text-jvto-dark text-xs font-black uppercase px-3 py-1 rounded-full">
                    {pkg.badge}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Clock size={14} />
                    <span>{pkg.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={14} className="text-jvto-green flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-2xl font-black text-jvto-dark mb-4">{pkg.price}</p>
                    <div className="flex gap-3">
                      <a
                        href={`${WA_LINK}?text=${encodeURIComponent(`Hi JVTO, I'm interested in the ${pkg.name}. Can you share availability and pricing?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        <MessageCircle size={16} />
                        Book Now
                      </a>
                      <Link
                        href={pkg.href}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white px-4 py-3 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        View Details
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-jvto-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              What's Included
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-3">
              We Handle Everything.{" "}
              <span className="text-jvto-green">You Just Pack.</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Ferry tickets, 4WD, guide, hotel, meals — one price covers it all.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {INCLUSIONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={18} className="text-jvto-green" />
                </div>
                <p className="text-sm font-bold text-gray-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISIC STUDENT PACKAGE ─────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-jvto-green/10 flex items-center justify-center">
              <GraduationCap size={36} className="text-jvto-green" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
                Student Discount
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-jvto-dark mb-3">
                ISIC Student Package — Budget-Friendly Adventure
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Hold a valid ISIC card? Show it when booking and ask about our student rates.
                The same private, police-led, all-inclusive experience — at a price built for budget travelers.
              </p>
              <a
                href={`${WA_LINK}?text=${encodeURIComponent("Hi JVTO, I'm a student with an ISIC card interested in the student package from Bali. What discounts are available?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-jvto-dark text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors"
              >
                <MessageCircle size={16} />
                Ask About Student Rates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              Why JVTO
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              JVTO vs. Generic Bali Agents
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Not all Bromo tours from Bali are equal. Here's the difference.
            </p>
          </div>

          <div className="max-w-2xl mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-jvto-dark text-white">
                  <th className="text-left px-6 py-4 font-bold uppercase text-xs tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-center text-jvto-green">
                    JVTO
                  </th>
                  <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-center text-gray-400">
                    Generic Agents
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-3 text-gray-700">{row.feature}</td>
                    <td className="px-6 py-3 text-center">
                      {row.jvto ? (
                        <CheckCircle size={18} className="text-jvto-green mx-auto" />
                      ) : (
                        <span className="text-red-400 font-bold text-base mx-auto block text-center">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {row.others ? (
                        <CheckCircle size={18} className="text-jvto-green mx-auto" />
                      ) : (
                        <span className="text-red-400 font-bold text-base mx-auto block text-center">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HEALTH SCREENING ────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 mb-6">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Safety Standard
                  </span>
                </div>
                <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                  Ijen Health Screening{" "}
                  <span className="text-lime-600">Included</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Kawah Ijen has active sulfur gas. A real medical check is mandatory.
                  Our nurse visits your hotel in Banyuwangi before the trek — included in your package.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Done at your hotel in Banyuwangi or Bondowoso, evening before trek",
                    "Digital QR certificate verified at Ijen gate",
                    "Reduces fake letters & preventable accidents",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-800">
                      <CheckCircle size={18} className="text-jvto-green flex-shrink-0" />
                      <span className="font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/travel-guide/ijen-health-screening"
                  target="_blank"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-black hover:bg-lime-600 rounded-lg uppercase tracking-widest group transition-colors w-fit"
                >
                  See How It Works
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="relative min-h-[280px]">
                <Image
                  src="/screening/ijen-screening-hotel-02.jpg"
                  alt="Health screening at hotel before Ijen trek"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-lime-600" />
                    <p className="font-bold text-xs uppercase text-gray-900">
                      Done at your hotel in Banyuwangi or Bondowoso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER TRUST ───────────────────────────────────────────── */}
      <section className="py-20 bg-jvto-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-6">
                Our Founder
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 leading-tight">
                Built by a{" "}
                <span className="text-jvto-green">Tourist Police Officer</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  <strong className="text-white">Agung "Mr. Sam" Sambuko</strong> is an active
                  Indonesian Tourist Police officer who founded JVTO after seeing too many tourists
                  get scammed or put in danger by unregulated operators.
                </p>
                <p>
                  We built JVTO specifically to be the operator you can verify before paying —
                  with a real license, a real face behind the company, and real safety standards.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/verify-jvto"
                  target="_blank"
                  className="font-bold border-b-2 border-jvto-green text-white hover:text-jvto-green transition-colors pb-1"
                >
                  Verify JVTO →
                </Link>
                <Link
                  href="/why-jvto/our-story"
                  target="_blank"
                  className="font-bold border-b-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors pb-1"
                >
                  Read Our Story →
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-sm aspect-[4/5]">
                <Image
                  src="/founder/mr-sam-tourist-police-portrait.png"
                  alt='Agung "Mr. Sam" Sambuko — Founder & Tourist Police Officer'
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <p className="font-bold text-white text-base uppercase mb-1">
                    Agung "Mr. Sam" Sambuko
                  </p>
                  <p className="text-xs text-jvto-green font-bold uppercase tracking-widest">
                    Founder & Active Tourist Police Officer
                  </p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-jvto-green/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4 text-jvto-green">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              Travelers Who Started from Bali
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Real experiences from international travelers who trusted us with their cross-island adventure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="bg-gray-50 p-8 rounded-sm border border-gray-100 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4 text-jvto-green">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic mb-6 flex-grow leading-relaxed">
                  "{r.text}"
                </p>
                <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={r.photo}
                      alt={r.name}
                      fill
                      className="rounded-full object-cover border-2 border-gray-200"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-jvto-dark">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.country}</p>
                  </div>
                  <span className="ml-auto text-xs uppercase tracking-wider font-semibold text-gray-400 bg-white px-2 py-1 rounded-sm border border-gray-100">
                    Google
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/why-jvto/reviews"
              target="_blank"
              className="inline-flex items-center gap-2 bg-jvto-dark text-white px-10 py-4 font-bold uppercase tracking-widest rounded-lg shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all"
            >
              View All Reviews <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
                FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Everything travelers from Bali ask before booking their cross-island tour.
              </p>
            </div>
            <LPFaq items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ─────────────────────────────────────────────── */}
      <section className="py-20 bg-jvto-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 leading-tight">
              Ready for the{" "}
              <span className="text-jvto-green">Bali to Bromo Adventure?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Message us with your dates, group size, and Bali hotel location.
              We'll reply within 1 hour with a tailored quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WA_LINK}?text=${encodeURIComponent(WA_MSG_BALI)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-10 py-4 rounded-sm font-black uppercase tracking-widest text-base transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <MessageCircle size={22} />
                Chat on WhatsApp
              </a>
              <a
                href="tel:+6282244788833"
                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-10 py-4 rounded-sm font-bold uppercase tracking-wide text-sm transition-all"
              >
                <Phone size={18} />
                +62 822-4478-8833
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-6">
              Available 08:00 – 22:00 WIB · English speaking · No commitment required
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
