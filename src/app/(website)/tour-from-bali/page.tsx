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
  BadgeCheck,
  AlertTriangle,
  Zap,
} from "lucide-react";
import LPFaq from "@/components/website/LandingPage/LPFaq";
import WhatsAppCTA from "@/components/website/LandingPage/WhatsAppCTA";
import StickyMobileCTA from "@/components/website/LandingPage/StickyMobileCTA";

const formatIDR = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

async function fetchBaliPrices(): Promise<{ d3: number; d4: number }> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/packages/web?from=3&category=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { d3: 0, d4: 0 };
    const packages: Array<{ duration: { day: number }; startFrom: number }> =
      await res.json();
    const getMin = (day: number) => {
      const prices = packages
        .filter((p) => p.duration.day === day)
        .map((p) => p.startFrom)
        .filter((p) => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    };
    return { d3: getMin(3), d4: getMin(4) };
  } catch {
    return { d3: 0, d4: 0 };
  }
}

export const metadata: Metadata = {
  title: "Ijen & Bromo Tour from Bali — Private, All-Inclusive | JVTO",
  description:
    "Extend your Bali holiday with a private Ijen Blue Fire & Bromo Sunrise tour. Door-to-door pickup from your Bali hotel. Ferry included. Licensed operator, Police-Led safety. 100% all-inclusive.",
  keywords: [
    "ijen tour from bali",
    "bali to ijen tour",
    "bali to bromo ijen private tour",
    "tour from bali to bromo",
    "bromo ijen tour from bali",
    "private tour bali to java",
  ],
  alternates: { canonical: "/tour-from-bali" },
  openGraph: {
    title: "Ijen Blue Fire & Bromo Sunrise — Private Tour from Bali | JVTO",
    description:
      "Door-to-door from your Bali hotel. Ferry included. 100% private, Police-Led, licensed operator. All-inclusive.",
    images: [{ url: "/assets/img/og/tour-from-bali.jpg", width: 1200, height: 630 }],
  },
};

const WA_LINK = "https://wa.me/6282244788833";
const WA_MSG = encodeURIComponent(
  "Hi JVTO, I'm in Bali and interested in a private Ijen & Bromo tour. Can you share options and pricing?"
);
const WA_HREF = `${WA_LINK}?text=${WA_MSG}`;

const STEPS = [
  {
    icon: MessageCircle,
    title: "1. WhatsApp Us",
    desc: "Share your Bali hotel, travel dates & group size. We reply within 1 hour.",
  },
  {
    icon: CheckCircle,
    title: "2. Confirm Your Package",
    desc: "Review the itinerary & pricing. Pay a 30% deposit online — no cash at your door.",
  },
  {
    icon: Car,
    title: "3. We Handle Everything",
    desc: "Our driver picks you up. Ferry, accommodation, meals, guide — all arranged.",
  },
  {
    icon: Star,
    title: "4. You Just Enjoy",
    desc: "Blue Fire at Ijen, Sunrise at Bromo, then drop-off at Surabaya or back to Bali.",
  },
];

const ROUTE_STEPS = [
  { point: "Your Bali Hotel / Villa", detail: "Door-to-door pickup — Kuta, Seminyak, Ubud, anywhere" },
  { point: "Gilimanuk Port (West Bali)", detail: "~3 hrs drive from South Bali. Driver handles port entry." },
  { point: "Ferry: Bali → Java", detail: "30-min crossing. Tickets fully included, no queuing." },
  { point: "Ketapang, Banyuwangi", detail: "East Java. JVTO driver waits at arrival." },
  { point: "Kawah Ijen", detail: "Blue Fire trek at 2AM + Health Screening included." },
  { point: "Mount Bromo", detail: "4WD to sunrise viewpoint at Penanjakan." },
  { point: "Drop-off: Surabaya Airport or Back to Bali", detail: "Your choice — we adjust the itinerary." },
];

const PACKAGES = [
  {
    name: "3D2N Ijen & Bromo from Bali",
    duration: "3 Days · 2 Nights",
    priceKey: "d3" as const,
    highlights: [
      "Pickup from your Bali hotel / villa",
      "Ferry tickets Bali ↔ Java included",
      "Kawah Ijen Blue Fire trek",
      "Mount Bromo sunrise (4WD)",
      "Ijen Health Screening included",
      "2 nights hotel + all meals included",
      "All entrance fees & gas mask",
    ],
    href: "/tours/from-bali/bromo-ijen-3d2n",
    badge: "Best Seller",
    cta_source: "bali_lp_pkg_3d2n",
  },
  {
    name: "4D3N Bromo, Ijen & Tumpak Sewu",
    duration: "4 Days · 3 Nights",
    priceKey: "d4" as const,
    highlights: [
      "All 3D2N inclusions +",
      "Tumpak Sewu Waterfall (Niagara of Java)",
      "Madakaripura Canyon Falls",
      "3 nights hotel included",
      "Relaxed pace — more time to explore",
    ],
    href: "/tours/from-bali/ijen-papuma-tumpak-sewu-bromo-4d3n",
    badge: "Full Experience",
    cta_source: "bali_lp_pkg_4d3n",
  },
];

const INCLUSIONS = [
  { icon: Car, label: "Private 4WD Jeep" },
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
    desc: "License No. 1102230032918 — publicly verifiable on the government database before you pay anything.",
  },
  {
    icon: Shield,
    title: "Founded by Tourist Police",
    desc: 'Founder Agung "Mr. Sam" Sambuko is an active Tourist Police Officer. We built JVTO to be the scam-free alternative.',
  },
  {
    icon: CheckCircle,
    title: "No Cash Collection at Your Door",
    desc: "Deposit paid securely online. No third-party Bali agents collecting cash at your villa.",
  },
  {
    icon: BadgeCheck,
    title: "One Operator, Full Journey",
    desc: "From your Bali pickup to your final drop-off — one contact, one transparent price, zero middlemen.",
  },
];

const REVIEWS = [
  {
    name: "Alydies Yue",
    country: "Hong Kong",
    rating: 5,
    text: "Joined the 3D2N tour starting from Bali. The tour was really well organized — food and accommodation were way better than expected. Guide Gufron was super friendly and professional.",
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocK8V21CQPF5POA68LR0k2Y2DA7-p3isf9yksWYn8O_mAn2iaQ=s120-c-rp-mo-br100",
  },
  {
    name: "Remy H",
    country: "Netherlands",
    rating: 5,
    text: "Me and my girlfriend had an amazing trip from Bali. Everything was well arranged. Special thanks to guide Gufron who made this trip truly unforgettable.",
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocLaF32GQ_E3jcrj4JYyoSVZ54QAdvusR_qhqsnflGpRgEdffg=s120-c-rp-mo-br100",
  },
  {
    name: "Andrés",
    country: "Spain",
    rating: 5,
    text: "Incredible experience starting from Bali. Very honest — you know the hotels before you book. Driver Yandi was always attentive. We were first at Bromo AND Ijen.",
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocKNkXY3yMVG-RG2yywgexvG9F2cDyItZZohmHev2Lu4Y118fA=s120-c-rp-mo-ba2-br100",
  },
];

const COMPARISON = [
  { feature: "Pickup from Bali hotel / villa", jvto: true },
  { feature: "Ferry tickets included", jvto: true },
  { feature: "100% private (no mixed groups)", jvto: true },
  { feature: "Ijen health screening included", jvto: true },
  { feature: "Licensed operator (verifiable)", jvto: true },
  { feature: "Police-Led safety protocols", jvto: true },
  { feature: "Transparent pricing — zero hidden fees", jvto: true },
  { feature: "Hotels disclosed before you pay", jvto: true },
];

const FAQ_ITEMS = [
  {
    question: "Is the Bali–Java ferry ticket included in the package?",
    answer:
      "Yes — the Bali–Java ferry (Gilimanuk to Ketapang) is fully included in your package. Our driver handles all ticketing and port navigation. You don't queue separately or pay anything extra at the port.",
  },
  {
    question: "Can I be picked up from anywhere in Bali — Ubud, Canggu, Nusa Dua?",
    answer:
      "Yes. We pick up from anywhere in Bali: Kuta, Seminyak, Canggu, Ubud, Sanur, Nusa Dua, Jimbaran — anywhere. The further from Gilimanuk Port, the earlier your departure time. Share your hotel address and we will confirm your exact pickup schedule.",
  },
  {
    question: "Are your tours private or shared?",
    answer:
      "All JVTO tours are private only. We do not mix your booking with other guests or sell 'seat in coach' options. Your vehicle, driver and guide are arranged for your group alone.",
  },
  {
    question: "What is included in the package price?",
    answer:
      "Our all-inclusive packages cover: private vehicle and driver, Bromo 4WD jeep, park entrance tickets and permits, hotel breakfasts, select meals, mineral water, Ijen health screening, gas mask, and safety briefing. A full inclusion and exclusion list is on each tour detail page.",
  },
  {
    question: "How does the Ijen health screening work?",
    answer:
      "For tours that include the Ijen night hike, JVTO includes a mandatory health screening by approved medical staff. It takes place at your hotel in Banyuwangi the evening before the trek. The check covers blood pressure, oxygen saturation, and a brief medical history review. Everyone who passes receives a digital QR certificate that is verified at the Ijen gate.",
  },
  {
    question: "Can I return to Bali at the end of the tour?",
    answer:
      "Yes. Tours can be arranged to end at Ketapang Port (ferry back to Bali) or at Surabaya Airport if you have onward flights. Specify your preference when booking — we build the drop-off into your itinerary at no extra cost for standard route distances.",
  },
  {
    question: "Can you guarantee sunrise views or the blue fire at Ijen?",
    answer:
      "No. Weather, cloud cover, volcanic gas activity and other natural factors are outside our control. We design our itineraries to maximise the chance of good conditions and get you there at the right time — the rest depends on nature.",
  },
  {
    question: "How do I book and what is the payment process?",
    answer:
      "Choose your package, Bali pickup location, and group size and complete your booking on the official JVTO website. Pay a 20% deposit online to confirm; the balance is due a few days before Day 1. You receive an official E-Voucher with all details and our contact numbers. Questions before you book? WhatsApp us — every booking is completed on the website.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TouristTrip",
      name: "Ijen Blue Fire & Bromo Sunrise Private Tour from Bali",
      description:
        "Private door-to-door tour from Bali to Kawah Ijen and Mount Bromo. Ferry included. Health screening, guide, meals, and hotels all included.",
      provider: {
        "@type": "TouristInformationCenter",
        name: "Java Volcano Tour Operator (JVTO)",
        url: "https://javavolcano-touroperator.com",
        telephone: "+6282244788833",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Banyuwangi",
          addressRegion: "East Java",
          addressCountry: "ID",
        },
      },
      touristType: "International traveler visiting Bali",
      offers: {
        "@type": "Offer",
        price: "2850000",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: "https://javavolcano-touroperator.com/tour-from-bali",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default async function TourFromBaliPage() {
  const baliPrices = await fetchBaliPrices();
  const pkgPrices: Record<"d3" | "d4", string> = {
    d3: baliPrices.d3 > 0 ? `From ${formatIDR(baliPrices.d3)} / pax` : "Contact us",
    d4: baliPrices.d4 > 0 ? `From ${formatIDR(baliPrices.d4)} / pax` : "Contact us",
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/hero/bali.jpg"
            alt="Private Ijen and Bromo tour starting from Bali — door-to-door pickup"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-5 text-center text-white mt-16 md:mt-20">
          <div className="inline-flex items-center gap-2 bg-jvto-green/20 border border-jvto-green/50 text-jvto-green px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <Ship size={13} />
            Ferry Included · Door-to-Door · 100% Private
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-5 uppercase tracking-tight max-w-4xl mx-auto">
            Ijen Blue Fire & Bromo Sunrise —{" "}
            <span className="text-jvto-green">Private Tour from Bali</span>
          </h1>

          <p className="text-base md:text-xl text-gray-200 mb-3 max-w-2xl mx-auto font-light">
            Extend your Bali holiday to East Java. Pickup from your hotel, ferry handled, back in 3 days.
          </p>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
            Police-Led Safety · Licensed Operator No. 1102230032918 · Zero Hidden Fees
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <WhatsAppCTA
              href={WA_HREF}
              source="bali_lp_hero_primary"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-sm font-black uppercase tracking-wide text-base transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <MessageCircle size={20} />
              Get a Free Quote — WhatsApp
            </WhatsAppCTA>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-wide text-sm transition-all"
            >
              View Tour Packages
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-300">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#9fce33" className="text-jvto-green" />
              ))}
            </div>
            <span className="font-medium">4.9 / 5 · 120+ verified reviews · Google &amp; Trustpilot</span>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <section className="bg-jvto-dark text-white py-5 border-b border-white/10">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {[
              { icon: Shield, title: "Police-Founded", sub: "Active Tourist Police Officer" },
              { icon: Ship, title: "Ferry Included", sub: "Bali → Java, zero hassle" },
              { icon: BadgeCheck, title: "Licensed", sub: "No. 1102230032918" },
              { icon: CheckCircle, title: "All-Inclusive", sub: "One price, zero surprises" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={16} className="text-jvto-green" />
                </div>
                <p className="font-black text-xs uppercase tracking-wide">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="how-it-works">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Simple Process
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Book in Minutes. We Handle the Rest.
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              You're on holiday — the last thing you need is logistics stress.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 p-5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-11 h-11 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={20} className="text-jvto-green" />
                </div>
                <p className="font-black text-sm text-jvto-dark uppercase">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <WhatsAppCTA
              href={WA_HREF}
              source="bali_lp_how_it_works"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-3.5 rounded-full font-bold uppercase text-sm tracking-wide transition-colors shadow-md"
            >
              <MessageCircle size={16} />
              Start with a Free Quote
            </WhatsAppCTA>
          </div>
        </div>
      </section>

      {/* ── ROUTE TIMELINE ────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50" id="route">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Your Full Route
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Bali to Bromo — Every Step Explained
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              No vague itineraries. Here's exactly what happens, step by step.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {ROUTE_STEPS.map((step, i) => (
              <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
                {i < ROUTE_STEPS.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-jvto-green/25" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-jvto-green bg-white flex items-center justify-center z-10">
                  <MapPin size={15} className="text-jvto-green" />
                </div>
                <div className="pt-1">
                  <p className="font-black text-jvto-dark text-sm uppercase tracking-wide">{step.point}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-5 py-4 text-sm text-gray-600">
              <Ship size={18} className="text-jvto-green flex-shrink-0" />
              <span>
                <strong className="text-jvto-dark">Ferry crossing:</strong> 30 minutes, Gilimanuk → Ketapang.
                Tickets fully included — driver handles everything at the port.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────────────────── */}
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Tour Packages
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Choose Your Bali Departure Package
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              All packages include Bali pickup, ferry, health screening, and 100% private service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="bg-jvto-dark px-5 py-4 flex items-center justify-between">
                  <span className="text-white font-black uppercase text-sm tracking-wide">{pkg.name}</span>
                  <span className="bg-jvto-green text-jvto-dark text-xs font-black uppercase px-3 py-1 rounded-full">
                    {pkg.badge}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                    <Clock size={12} />
                    <span>{pkg.duration}</span>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={13} className="text-jvto-green flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-2xl font-black text-jvto-dark mb-4">{pkgPrices[pkg.priceKey]}</p>
                    <div className="flex gap-2">
                      <WhatsAppCTA
                        href={`${WA_LINK}?text=${encodeURIComponent(`Hi JVTO, I'm interested in the ${pkg.name} from Bali. Can you share availability and pricing?`)}`}
                        source={pkg.cta_source}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        <MessageCircle size={14} />
                        Book Now
                      </WhatsAppCTA>
                      <Link
                        href={pkg.href}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white px-4 py-3 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        Details
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours/from-bali"
              className="inline-flex items-center gap-2 border-2 border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white px-7 py-3 rounded-lg font-bold uppercase text-sm tracking-wide transition-colors"
            >
              View All Packages from Bali
              <ArrowRight size={15} />
            </Link>
            <WhatsAppCTA
              href={WA_HREF}
              source="bali_lp_custom_tour"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-7 py-3 rounded-lg font-bold text-sm transition-colors"
            >
              <MessageCircle size={15} />
              Request Custom Itinerary
            </WhatsAppCTA>
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ────────────────────────────────────────────────── */}
      <section className="py-16 bg-jvto-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              What&apos;s Included
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">
              We Handle Everything.{" "}
              <span className="text-jvto-green">You Just Pack.</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Ferry, jeep, guide, hotel, meals, entrance fees — one all-inclusive price.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {INCLUSIONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-4 text-center"
              >
                <div className="w-9 h-9 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={16} className="text-jvto-green" />
                </div>
                <p className="text-xs font-bold text-gray-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEALTH SCREENING ──────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 mb-5">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Safety Standard</span>
                </div>
                <h2 className="font-black text-2xl md:text-4xl text-gray-900 mb-4 leading-tight uppercase">
                  Ijen Health Screening{" "}
                  <span className="text-lime-600">Included</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                  Kawah Ijen has active sulfur gas. A real medical check is mandatory before the trek.
                  Our nurse visits your hotel in Banyuwangi the evening before — included in your package.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Done at your hotel — no extra travel",
                    "Digital QR certificate verified at the gate",
                    "Prevents accidents, not just paperwork",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-800 text-sm">
                      <CheckCircle size={15} className="text-jvto-green flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/travel-guide/ijen-health-screening"
                  className="inline-flex items-center gap-2 text-sm font-bold text-jvto-dark border-b-2 border-jvto-green pb-0.5 w-fit hover:text-jvto-green transition-colors"
                >
                  How the screening works <ArrowRight size={14} />
                </Link>
              </div>
              <div className="relative min-h-[240px]">
                <Image
                  src="/screening/ijen-screening-hotel-02.jpg"
                  alt="Ijen health screening at hotel before trek"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-lime-600" />
                    <p className="font-bold text-xs uppercase text-gray-900">Done at your hotel in Banyuwangi or Bondowoso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCAM PROTECTION ───────────────────────────────────────────── */}
      <section className="py-14 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-7">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase text-jvto-dark mb-2">
                  Protect Yourself from Bali Tour Scams
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dozens of unlicensed "agents" in Bali sell Bromo &amp; Ijen tours with no accountability.
                  Here's how to verify JVTO is real — before you pay anything.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-7">
              {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-amber-100 rounded-lg p-4 flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-jvto-green/10 flex items-center justify-center">
                    <Icon size={16} className="text-jvto-green" />
                  </div>
                  <div>
                    <p className="font-bold text-jvto-dark text-sm mb-0.5">{title}</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/verify-jvto"
                className="inline-flex items-center gap-2 bg-jvto-dark text-white px-5 py-2.5 rounded-sm font-bold uppercase text-xs tracking-wide hover:bg-gray-800 transition-colors"
              >
                <BadgeCheck size={14} />
                Verify JVTO Now
              </Link>
              <Link
                href="/why-jvto/our-story"
                className="inline-flex items-center gap-2 border border-jvto-dark text-jvto-dark px-5 py-2.5 rounded-sm font-bold uppercase text-xs tracking-wide hover:bg-jvto-dark hover:text-white transition-colors"
              >
                Meet the Founder →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Why JVTO
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              JVTO vs. Random Bali Tour Agents
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Not all Ijen &amp; Bromo tours from Bali are equal.
            </p>
          </div>

          <div className="max-w-xl mx-auto overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-jvto-dark text-white">
                  <th className="text-left px-5 py-3 font-bold uppercase text-xs tracking-wider">Feature</th>
                  <th className="px-5 py-3 font-bold uppercase text-xs tracking-wider text-center text-jvto-green">
                    JVTO
                  </th>
                  <th className="px-5 py-3 font-bold uppercase text-xs tracking-wider text-center text-gray-400">
                    Typical Agents
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-5 py-2.5 text-gray-700 text-xs md:text-sm">{row.feature}</td>
                    <td className="px-5 py-2.5 text-center">
                      <CheckCircle size={16} className="text-jvto-green mx-auto" />
                    </td>
                    <td className="px-5 py-2.5 text-center text-red-400 font-bold">✗</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="reviews">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Verified Reviews
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Travelers Who Started from Bali
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Real experiences from international guests on the Bali-to-Java route.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col">
                <div className="flex gap-0.5 mb-3 text-jvto-green">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic mb-5 flex-grow leading-relaxed">"{r.text}"</p>
                <div className="border-t border-gray-200 pt-3 flex items-center gap-3">
                  <div className="relative w-9 h-9 flex-shrink-0">
                    <Image
                      src={r.photo}
                      alt={r.name}
                      fill
                      className="rounded-full object-cover border-2 border-gray-200"
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-jvto-dark">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.country}</p>
                  </div>
                  <span className="ml-auto text-xs uppercase tracking-wider font-semibold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100">
                    Google
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/why-jvto/reviews"
              className="inline-flex items-center gap-2 border-2 border-jvto-dark text-jvto-dark px-8 py-3 font-bold uppercase tracking-widest rounded-lg text-sm hover:bg-jvto-dark hover:text-white transition-colors"
            >
              Read All 120+ Reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDER ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-jvto-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-5 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-5">
                Our Founder
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-5 leading-tight">
                Built by a{" "}
                <span className="text-jvto-green">Tourist Police Officer</span>
              </h2>
              <div className="space-y-3 text-gray-300 text-base leading-relaxed">
                <p>
                  <strong className="text-white">Agung "Mr. Sam" Sambuko</strong> is an active Indonesian
                  Tourist Police officer who founded JVTO after seeing tourists repeatedly scammed or put in
                  danger by unregulated operators.
                </p>
                <p>
                  JVTO was built specifically to be the operator you can verify before paying — real license,
                  real face, real safety standards.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link
                  href="/verify-jvto"
                  className="font-bold border-b-2 border-jvto-green text-white hover:text-jvto-green transition-colors pb-0.5 text-sm"
                >
                  Verify JVTO →
                </Link>
                <Link
                  href="/why-jvto/our-story"
                  className="font-bold border-b-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors pb-0.5 text-sm"
                >
                  Read Our Story →
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-xs aspect-[4/5]">
                <Image
                  src="/founder/mr-sam-tourist-police-portrait.png"
                  alt='Agung "Mr. Sam" Sambuko — JVTO Founder & Tourist Police Officer'
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                  <p className="font-bold text-white text-sm uppercase mb-0.5">Agung "Mr. Sam" Sambuko</p>
                  <p className="text-xs text-jvto-green font-bold uppercase tracking-widest">
                    Founder & Active Tourist Police Officer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50" id="faq">
        <div className="container mx-auto px-5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
                FAQ
              </div>
              <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-sm">
                Everything travelers from Bali ask before booking their cross-island tour.
              </p>
            </div>
            <LPFaq items={FAQ_ITEMS} />
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Can&apos;t find your answer?</p>
              <WhatsAppCTA
                href={WA_HREF}
                source="bali_lp_faq_cta"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-colors shadow-md"
              >
                <MessageCircle size={15} />
                Ask Us Directly
              </WhatsAppCTA>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-jvto-dark text-white" id="book">
        <div className="container mx-auto px-5">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-jvto-green/10 border border-jvto-green/30 text-jvto-green px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-5">
              <Zap size={12} />
              We reply within 1 hour
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-5 leading-tight">
              Ready for the{" "}
              <span className="text-jvto-green">Bali to Java Adventure?</span>
            </h2>
            <p className="text-gray-300 text-base mb-8">
              Message us with your Bali hotel, travel dates, and group size.
              We&apos;ll send a full tailored quote — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppCTA
                href={WA_HREF}
                source="bali_lp_final_cta"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-9 py-4 rounded-sm font-black uppercase tracking-widest text-base transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </WhatsAppCTA>
              <a
                href="tel:+6282244788833"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-9 py-4 rounded-sm font-bold uppercase tracking-wide text-sm transition-all"
              >
                <Phone size={17} />
                +62 822-4478-8833
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-5">
              Available 08:00–22:00 WIB · English speaking · No commitment required
            </p>
          </div>
        </div>
      </section>

      {/* ── EXPLORE MORE ──────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-5">
          <p className="text-center text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
            Explore More
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { label: "Tours from Surabaya", href: "/tour-from-surabaya" },
              { label: "All Tour Packages", href: "/tours" },
              { label: "Why Trust JVTO?", href: "/verify-jvto" },
              { label: "Travel Guide & FAQ", href: "/travel-guide/faq" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs font-bold text-gray-700 hover:border-jvto-green hover:text-jvto-green transition-colors"
              >
                {label}
                <ArrowRight size={12} className="flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────── */}
      <StickyMobileCTA
        href={WA_HREF}
        source="bali_lp_sticky_mobile"
        label="Book Your Bali Tour Now"
      />
    </>
  );
}
