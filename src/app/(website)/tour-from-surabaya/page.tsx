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
  BadgeCheck,
  Zap,
  Plane,
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

async function fetchSubPrices(): Promise<{
  d3_bali: number;
  d3_sub: number;
  d4_bali: number;
  d4_sub: number;
}> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${siteUrl}/api/packages/web?from=4&category=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { d3_bali: 0, d3_sub: 0, d4_bali: 0, d4_sub: 0 };
    const packages: Array<{
      duration: { day: number };
      endDestination: string | null;
      startFrom: number;
    }> = await res.json();
    const getMin = (day: number, end: string) => {
      const prices = packages
        .filter((p) => p.duration.day === day && p.endDestination === end)
        .map((p) => p.startFrom)
        .filter((p) => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    };
    return {
      d3_bali: getMin(3, "Bali"),
      d3_sub: getMin(3, "Surabaya"),
      d4_bali: getMin(4, "Bali"),
      d4_sub: getMin(4, "Surabaya"),
    };
  } catch {
    return { d3_bali: 0, d3_sub: 0, d4_bali: 0, d4_sub: 0 };
  }
}

export const metadata: Metadata = {
  title: "Private Bromo & Ijen Tour from Surabaya | Airport Pickup 24H | JVTO",
  description:
    "Private Bromo & Ijen tours from Surabaya with 24-hour Juanda Airport pickup. Police-Led safety, 100% all-inclusive, licensed operator No. 1102230032918. Zero hidden fees.",
  keywords: [
    "bromo ijen tour from surabaya",
    "private bromo ijen tour from surabaya",
    "tour from surabaya to bromo",
    "bromo tour surabaya pickup",
    "ijen tour from surabaya",
    "surabaya bromo ijen private tour",
  ],
  alternates: { canonical: "/tour-from-surabaya" },
  openGraph: {
    title: "Private Bromo & Ijen Tour from Surabaya | Airport Pickup | JVTO",
    description:
      "24H Juanda Airport pickup. Police-Led safety. 100% all-inclusive, licensed operator. Zero hidden fees.",
    images: [{ url: "/assets/img/og/tour-from-surabaya.jpg", width: 1200, height: 630 }],
  },
};

const WA_LINK = "https://wa.me/6282244788833";
const WA_MSG = encodeURIComponent(
  "Hi JVTO, I'm interested in a private Bromo & Ijen tour from Surabaya. Can you share availability and pricing?"
);
const WA_HREF = `${WA_LINK}?text=${WA_MSG}`;

const PICKUP_POINTS = [
  { name: "Juanda International Airport (SUB)", note: "24-hour pickup — anytime you land", icon: Plane },
  { name: "Surabaya City Hotels", note: "All major hotel areas covered", icon: Hotel },
  { name: "Malang City Center", note: "Hotel, landmark, or train station", icon: MapPin },
  { name: "Malang Train Station (Kotabaru)", note: "Direct from the platform", icon: MapPin },
];

const buildPackages = (prices: {
  d3_bali: number;
  d3_sub: number;
  d4_bali: number;
  d4_sub: number;
}) => [
  {
    name: "3D2N — Start Surabaya, Finish Bali",
    duration: "3 Days · 2 Nights",
    price:
      prices.d3_bali > 0
        ? `From ${formatIDR(prices.d3_bali)} / pax`
        : "Contact us",
    highlights: [
      "Pickup from Surabaya or Malang",
      "Mount Bromo Sunrise (4WD)",
      "Kawah Ijen Blue Fire Trek",
      "Ijen Health Screening included",
      "Ferry crossing included (Java → Bali)",
      "Drop-off at your Bali hotel / villa",
    ],
    href: "/tours/from-surabaya/bromo-madakaripura-ijen-3d2n",
    badge: "Overland",
    cta_source: "sub_lp_pkg_3d2n_bali",
    note: "Ideal if your trip ends in Bali",
  },
  {
    name: "3D2N — Start & Finish Surabaya",
    duration: "3 Days · 2 Nights",
    price:
      prices.d3_sub > 0
        ? `From ${formatIDR(prices.d3_sub)} / pax`
        : "Contact us",
    highlights: [
      "Pickup from Surabaya or Malang",
      "Mount Bromo Sunrise (4WD)",
      "Kawah Ijen Blue Fire Trek",
      "Ijen Health Screening included",
      "Drop-off back to Surabaya / Malang",
      "All entrance fees & gas mask",
    ],
    href: "/tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
    badge: "Loop Trip",
    cta_source: "sub_lp_pkg_3d2n_sub",
    note: "Ideal if you are returning to Surabaya",
  },
  {
    name: "4D3N — Start Surabaya, Finish Bali",
    duration: "4 Days · 3 Nights",
    price:
      prices.d4_bali > 0
        ? `From ${formatIDR(prices.d4_bali)} / pax`
        : "Contact us",
    highlights: [
      "All 3D2N inclusions +",
      "Tumpak Sewu Waterfall",
      "Relaxed pace, more time at each site",
      "3 nights hotel + all meals",
      "Ferry crossing included (Java → Bali)",
      "Drop-off at your Bali hotel / villa",
    ],
    href: "/tours/from-surabaya/tumpak-sewu-bromo-ijen-4d3n",
    badge: "Extended",
    cta_source: "sub_lp_pkg_4d3n_bali",
    note: "More relaxed pace, ends in Bali",
  },
  {
    name: "4D3N — Start & Finish Surabaya",
    duration: "4 Days · 3 Nights",
    price:
      prices.d4_sub > 0
        ? `From ${formatIDR(prices.d4_sub)} / pax`
        : "Contact us",
    highlights: [
      "Pickup from Surabaya or Malang",
      "Bromo + Ijen + Tumpak Sewu",
      "Papuma Beach option available",
      "3 nights hotel + all meals",
      "Drop-off back to Surabaya / Malang",
      "All entrance fees & gas mask",
    ],
    href: "/tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
    badge: "Best Value",
    cta_source: "sub_lp_pkg_4d3n_sub",
    note: "Full East Java experience, back to Surabaya",
  },
];

const INCLUSIONS = [
  { icon: Car, label: "Private 4WD Jeep" },
  { icon: Users, label: "Licensed English Guide" },
  { icon: Shield, label: "Ijen Health Screening" },
  { icon: CheckCircle, label: "All Entrance Fees" },
  { icon: Utensils, label: "Meals as per Itinerary" },
  { icon: Hotel, label: "Hotel (3D2N Package)" },
  { icon: CheckCircle, label: "Gas Mask at Ijen" },
  { icon: CheckCircle, label: "Zero Hidden Fees" },
];

const ITINERARY = [
  {
    day: "Day 1",
    title: "Pickup → Bromo Sunrise",
    steps: [
      "11:00 PM — Pickup from Surabaya/Malang (night departure)",
      "03:00 AM — Arrive Cemoro Lawang (Bromo base village)",
      "04:30 AM — 4WD to Penanjakan viewpoint, sunrise watch",
      "07:00 AM — Hike to Bromo crater rim",
      "10:00 AM — Drive to Banyuwangi / Ijen area, check-in hotel",
      "08:00 PM — Rest before Ijen trek",
    ],
  },
  {
    day: "Day 2",
    title: "Ijen Blue Fire → Sunrise Crater",
    steps: [
      "01:00 AM — Health screening at your hotel",
      "02:00 AM — Begin Ijen trek (3 km each way, ~90 min up)",
      "03:00 AM — Witness the rare Blue Fire phenomenon",
      "05:30 AM — Sunrise at crater rim, turquoise sulfur lake views",
      "08:00 AM — Return, breakfast, check-out",
      "12:00 PM — Depart to Surabaya / Banyuwangi Port",
    ],
  },
  {
    day: "End",
    title: "Drop-off Options",
    steps: [
      "Option A: Surabaya Airport/City — arrive ~17:00",
      "Option B: Ketapang Port (Banyuwangi) — ferry back to Bali ~13:00",
      "Option C: Malang Hotel/Station — arrive ~14:00",
    ],
  },
];

const REVIEWS = [
  {
    name: "Jeremy Teo",
    country: "Singapore",
    rating: 5,
    text: "Very satisfied. The team was responsive, trip was smooth, and driver Fredi made sure we got from place to place safely and on time. Everything as described — no surprises.",
    photo:
      "https://lh3.googleusercontent.com/a-/ALV-UjWa-RMLudsDhNwpmpsIBwsgbZ34fLvnurqo2Qg8DdMUJFtR8k2s=s120-c-rp-mo-br100",
  },
  {
    name: "Andrés",
    country: "Spain",
    rating: 5,
    text: "Very honest because you know the hotels upfront before you pay. Driver Yandi was kind — we were literally first to reach Bromo AND Ijen. Incredible value.",
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocKNkXY3yMVG-RG2yywgexvG9F2cDyItZZohmHev2Lu4Y118fA=s120-c-rp-mo-ba2-br100",
  },
  {
    name: "Samia Amrani",
    country: "France",
    rating: 5,
    text: "Best experience ever! Driver Pras and guide Rendi were super professional. They took care of every detail and made us feel completely safe throughout the whole tour.",
    photo:
      "https://lh3.googleusercontent.com/a/ACg8ocJ4eOWcIFSgTsYGvX-1TDyCTZjuzn4AVC7Oc5enXGTNU54tczQI=s120-c-rp-mo-br100",
  },
];

const TRUST_SIGNALS = [
  { icon: Shield, title: "Police-Led Safety", sub: "Founder: Active Tourist Police Officer" },
  { icon: BadgeCheck, title: "Licensed Operator", sub: "No. 1102230032918 — verifiable" },
  { icon: Star, title: "4.9 / 5 Rating", sub: "120+ Google & Trustpilot reviews" },
  { icon: CheckCircle, title: "All-Inclusive", sub: "Zero hidden fees — one transparent price" },
];

const FAQ_ITEMS = [
  {
    question: "Can you pick me up from Juanda Airport at any hour?",
    answer:
      "Yes — we offer 24-hour pickup from Juanda International Airport (SUB). Most tours depart late evening because the drive to Bromo takes 4–5 hours and you need to arrive before dawn for the sunrise. Our driver waits at the arrivals hall with a name sign.",
  },
  {
    question: "Can I also be picked up from Malang?",
    answer:
      "Yes. We pick up from Malang city hotels, Malang Train Station (Kotabaru), and Malang Airport. Malang is closer to Bromo, which typically means a slightly later departure time compared to Surabaya. Share your Malang address and we will calculate your exact pickup schedule.",
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
      "For tours that include the Ijen night hike, JVTO includes a mandatory health screening by approved medical staff. It takes place at your hotel in Banyuwangi the evening before the trek. The check covers blood pressure, oxygen saturation, and a brief medical history review. Everyone who passes receives a digital QR certificate that is verified at the Ijen gate. Included in your package at no extra cost.",
  },
  {
    question: "What happens if Bromo or Ijen is closed on my dates?",
    answer:
      "We follow official instructions from Indonesian authorities and park management. Depending on the situation, we may adjust timings or use alternative viewpoints, replace certain stops with other local visits, or in more serious cases, cancel specific segments with a partial refund under our booking policy.",
  },
  {
    question: "Can you guarantee sunrise views or the blue fire at Ijen?",
    answer:
      "No. Weather, cloud cover, volcanic gas activity and other natural factors are outside our control. We design itineraries to maximise the chance of good conditions and get you there at the right time — the rest depends on nature.",
  },
  {
    question: "How do I book and what is the payment process?",
    answer:
      "Choose your package, travel dates, group size, and pickup location and complete your booking on the official JVTO website. Pay a 20% deposit online to confirm; the balance is due a few days before Day 1. You receive an official E-Voucher with full details and our contact numbers. Questions before you book? WhatsApp us — every booking is completed on the website.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TouristTrip",
      name: "Private Bromo & Ijen Tour from Surabaya",
      description:
        "Private tour from Surabaya (24H airport pickup) to Mount Bromo and Kawah Ijen. Health screening, guide, meals, and all entrance fees included.",
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
      touristType: "International traveler arriving in Surabaya",
      offers: {
        "@type": "Offer",
        price: "2450000",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: "https://javavolcano-touroperator.com/tour-from-surabaya",
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

export default async function TourFromSurabayaPage() {
  const subPrices = await fetchSubPrices();
  const PACKAGES = buildPackages(subPrices);
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
            src="/assets/img/hero/surabaya.jpg"
            alt="Mount Bromo sunrise private tour from Surabaya airport pickup"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-5 text-center text-white mt-16 md:mt-20">
          <div className="inline-flex items-center gap-2 bg-jvto-green/20 border border-jvto-green/50 text-jvto-green px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5">
            <Plane size={13} />
            24H Airport Pickup · 100% Private · Police-Led Safety
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-5 uppercase tracking-tight max-w-4xl mx-auto">
            Private Bromo & Ijen Tour —{" "}
            <span className="text-jvto-green">from Surabaya</span>
          </h1>

          <p className="text-base md:text-xl text-gray-200 mb-3 max-w-2xl mx-auto font-light">
            Pickup from Juanda Airport, Surabaya hotels, or Malang — day or night, any time you arrive.
          </p>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
            All-Inclusive · Licensed Operator No. 1102230032918 · Zero Hidden Fees ·
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <WhatsAppCTA
              href={WA_HREF}
              source="sub_lp_hero_primary"
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
            {TRUST_SIGNALS.map(({ icon: Icon, title, sub }) => (
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

      {/* ── PICKUP POINTS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="pickup">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Pickup Service
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              We Pick You Up — Anywhere, Any Time
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Including 24-hour Juanda Airport pickup. Tell us where you are, we&apos;ll be there.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
            {PICKUP_POINTS.map(({ name, note, icon: Icon }) => (
              <div
                key={name}
                className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-jvto-green/10 flex items-center justify-center">
                  <Icon size={16} className="text-jvto-green" />
                </div>
                <div>
                  <p className="font-bold text-jvto-dark text-sm">{name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{note}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Different location? Just ask — we accommodate all pickup points in East Java.
            </p>
            <WhatsAppCTA
              href={WA_HREF}
              source="sub_lp_pickup_cta"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-3 rounded-full font-bold uppercase text-sm tracking-wide transition-colors shadow-md"
            >
              <MessageCircle size={15} />
              Confirm Your Pickup Point
            </WhatsAppCTA>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────────────────── */}
      <section id="packages" className="py-16 bg-gray-50">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Tour Packages
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Which Package Fits Your Schedule?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Transparent pricing. 100% private. No mixed groups, no surprise costs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="bg-jvto-dark px-4 py-3 flex items-start justify-between gap-2">
                  <span className="text-white font-black text-xs tracking-wide leading-snug">{pkg.name}</span>
                  <span className="flex-shrink-0 bg-jvto-green text-jvto-dark text-xs font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                    {pkg.badge}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Clock size={11} />
                    <span>{pkg.duration}</span>
                  </div>
                  <p className="text-xs text-jvto-green font-bold uppercase tracking-wider mb-3">{pkg.note}</p>
                  <ul className="space-y-1 mb-4 flex-1">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle size={11} className="text-jvto-green flex-shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 pt-3 mt-auto">
                    <p className="text-lg font-black text-jvto-dark mb-3">{pkg.price}</p>
                    <div className="flex gap-2">
                      <WhatsAppCTA
                        href={`${WA_LINK}?text=${encodeURIComponent(`Hi JVTO, I'm interested in the ${pkg.name}. Can you share availability and pricing?`)}`}
                        source={pkg.cta_source}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2.5 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        <MessageCircle size={13} />
                        Book
                      </WhatsAppCTA>
                      <Link
                        href={pkg.href}
                        className="flex-1 inline-flex items-center justify-center gap-1 border border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white px-3 py-2.5 rounded-sm font-bold uppercase text-xs tracking-wide transition-colors"
                      >
                        Details
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours/from-surabaya"
              className="inline-flex items-center gap-2 border-2 border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white px-7 py-3 rounded-lg font-bold uppercase text-sm tracking-wide transition-colors"
            >
              View All Packages from Surabaya
              <ArrowRight size={15} />
            </Link>
            <WhatsAppCTA
              href={WA_HREF}
              source="sub_lp_custom_tour"
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
              100% All-Inclusive.{" "}
              <span className="text-jvto-green">Zero Surprises.</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Every cost is in your quote. The only optional spend: tips and souvenirs.
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

      {/* ── ITINERARY ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white" id="itinerary">
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-3">
              Itinerary
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-jvto-dark mb-2">
              Hour-by-Hour Itinerary
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Know exactly what happens and when — no vague "flexible" schedules.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-7">
            {ITINERARY.map((day, dayIdx) => (
              <div key={dayIdx} className="relative pl-8 border-l-2 border-jvto-green/30">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-jvto-green flex items-center justify-center">
                  <span className="text-xs font-black text-jvto-dark">{dayIdx + 1}</span>
                </div>
                <div className="mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-jvto-green">{day.day}</span>
                  <h3 className="text-base font-black text-jvto-dark uppercase">{day.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {day.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <Clock size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <WhatsAppCTA
              href={WA_HREF}
              source="sub_lp_itinerary_cta"
              className="inline-flex items-center gap-2 bg-jvto-dark hover:bg-gray-800 text-white px-7 py-3.5 rounded-full font-bold uppercase text-sm tracking-wide transition-colors shadow-md"
            >
              <MessageCircle size={15} />
              Customize This Itinerary
            </WhatsAppCTA>
          </div>
        </div>
      </section>

      {/* ── HEALTH SCREENING ──────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 mb-5">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Mandatory Requirement</span>
                </div>
                <h2 className="font-black text-2xl md:text-4xl text-gray-900 mb-4 leading-tight uppercase">
                  Real Medical Check{" "}
                  <span className="text-lime-600">Included</span>
                </h2>
                <p className="text-gray-600 mb-5 leading-relaxed text-sm md:text-base">
                  Kawah Ijen is an active volcano with sulfuric gas. We include a real screening by trained
                  medical staff at your hotel — before you even start the trek.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Included in your package cost",
                    "Digital QR verification at the Ijen gate",
                    "Done at your hotel lobby — no extra travel",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-800 text-sm">
                      <CheckCircle size={14} className="text-jvto-green flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/travel-guide/ijen-health-screening"
                  className="inline-flex items-center gap-2 text-sm font-bold text-jvto-dark border-b-2 border-jvto-green pb-0.5 w-fit hover:text-jvto-green transition-colors"
                >
                  How the screening works <ArrowRight size={13} />
                </Link>
              </div>
              <div className="relative min-h-[240px]">
                <Image
                  src="/screening/ijen-screening-hotel-01.jpeg"
                  alt="Ijen health screening at hotel before trek"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-lime-600" />
                    <p className="font-bold text-xs uppercase text-gray-900">Done at your hotel lobby</p>
                  </div>
                </div>
              </div>
            </div>
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
              What Travelers from Surabaya Say
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Real reviews from international guests who started their East Java journey with JVTO.
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
                Why Trust Us
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-5 leading-tight">
                Led by an{" "}
                <span className="text-jvto-green">Active Police Officer</span>
              </h2>
              <div className="space-y-3 text-gray-300 text-base leading-relaxed">
                <p>
                  JVTO was founded by{" "}
                  <strong className="text-white">Agung "Mr. Sam" Sambuko</strong>, an active Indonesian
                  Tourist Police officer who saw the safety gap firsthand.
                </p>
                <p>
                  We operate with police-level protocols: written safety rules, realistic driving
                  schedules, and mandatory medical checks — not just marketing promises.
                </p>
                <p>
                  Our operator license (No.{" "}
                  <strong className="text-jvto-green">1102230032918</strong>) is publicly verifiable.
                  Check it before you book.
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
                  Our Story →
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
                Everything travelers from Surabaya and Malang ask before booking.
              </p>
            </div>
            <LPFaq items={FAQ_ITEMS} />
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-3">Still have questions?</p>
              <WhatsAppCTA
                href={WA_HREF}
                source="sub_lp_faq_cta"
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
              Ready to Book Your{" "}
              <span className="text-jvto-green">East Java Adventure?</span>
            </h2>
            <p className="text-gray-300 text-base mb-8">
              Message us with your travel dates, group size, and pickup location.
              We&apos;ll reply with a full tailored quote — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppCTA
                href={WA_HREF}
                source="sub_lp_final_cta"
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
              Available 08:00–22:00 WIB · English speaking · Reply within 1 hour
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
              { label: "Tours from Bali", href: "/tour-from-bali" },
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
        source="sub_lp_sticky_mobile"
        label="Book Your Surabaya Tour Now"
      />
    </>
  );
}
