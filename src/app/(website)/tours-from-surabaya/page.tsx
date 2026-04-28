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
} from "lucide-react";
import LPFaq from "@/components/website/LandingPage/LPFaq";

export const metadata: Metadata = {
  title: "Private Bromo & Ijen Tour from Surabaya | Police-Led, All-Inclusive — JVTO",
  description:
    "Book private Bromo & Ijen tours from Surabaya with Police-Led safety. Pickup from Juanda Airport, Surabaya hotels, or Malang. 100% all-inclusive, no hidden fees. WhatsApp: +62 822-4478-8833.",
};

const WA_LINK = "https://wa.me/6282244788833";
const WA_MSG_SURABAYA = "Hi JVTO, I'm interested in a private tour from Surabaya. Can you share availability and pricing?";

const PACKAGES = [
  {
    name: "2D1N Bromo & Ijen",
    duration: "2 Days 1 Night",
    price: "From IDR 1.750.000/pax",
    highlights: ["Mt. Bromo Sunrise", "Ijen Blue Fire", "Health Screening Included", "4WD & Licensed Guide"],
    href: "/tours/from-surabaya",
    badge: "Most Popular",
  },
  {
    name: "3D2N Bromo, Ijen & Tumpak Sewu",
    duration: "3 Days 2 Nights",
    price: "From USD 280/pax",
    highlights: ["Mt. Bromo Sunrise", "Ijen Blue Fire", "Tumpak Sewu Waterfall", "Hotel + All Meals Included"],
    href: "/tours/from-surabaya",
    badge: "Best Value",
  },
];

const INCLUSIONS = [
  { icon: Car, label: "Private 4WD Vehicle" },
  { icon: Users, label: "Licensed English Guide" },
  { icon: Shield, label: "Ijen Health Screening" },
  { icon: CheckCircle, label: "All Entrance Fees" },
  { icon: Utensils, label: "Meals as per Itinerary" },
  { icon: Hotel, label: "Hotel (3D2N package)" },
  { icon: CheckCircle, label: "Gas Mask at Ijen" },
  { icon: CheckCircle, label: "No Hidden Fees" },
];

const PICKUP_POINTS = [
  { name: "Juanda International Airport (SUB)", note: "24-hour pickup available" },
  { name: "Surabaya City Hotels", note: "All major hotel areas" },
  { name: "Malang City Center", note: "Hotel or landmark pickup" },
  { name: "Malang Train Station (Kotabaru)", note: "Direct from platform" },
];

const ITINERARY = [
  {
    day: "Day 1",
    title: "Pickup → Bromo Sunrise",
    steps: [
      "11:00 PM – Pickup from Surabaya/Malang",
      "03:00 AM – Arrive Cemoro Lawang (Bromo base)",
      "04:30 AM – 4WD to viewpoint, watch sunrise over Bromo",
      "07:00 AM – Hike to Bromo crater rim",
      "10:00 AM – Drive to Ijen area, check-in hotel",
    ],
  },
  {
    day: "Day 2",
    title: "Ijen Blue Fire → Blue Flame Trek",
    steps: [
      "01:00 AM – Health screening at hotel",
      "02:00 AM – Trek to Kawah Ijen (3 km each way)",
      "03:00 AM – Witness rare Blue Fire phenomenon",
      "06:00 AM – Sunrise at crater rim + sulfur lake views",
      "09:00 AM – Return, breakfast, check-out",
    ],
  },
  {
    day: "End",
    title: "Drop-off Surabaya / Banyuwangi",
    steps: [
      "12:00 PM – Depart to final destination",
      "Optional: Drop-off Ketapang Port (ferry to Bali)",
      "Arrive Surabaya ~17:00 or Banyuwangi ~13:00",
    ],
  },
];

const REVIEWS = [
  {
    name: "Jeremy Teo",
    country: "Singapore",
    rating: 5,
    text: "Very satisfied with the arrangements. The team was responsive, the trip organised smoothly, and our driver Fredi did a fantastic job ensuring we got from place to place safely and on time.",
    photo: "https://lh3.googleusercontent.com/a-/ALV-UjWa-RMLudsDhNwpmpsIBwsgbZ34fLvnurqo2Qg8DdMUJFtR8k2s=s120-c-rp-mo-br100",
  },
  {
    name: "Andrés",
    country: "Spain",
    rating: 5,
    text: "Incredible experience! Very honest compared to others because you know the hotels upfront. Driver Yandi was always kind — we were literally first to reach Bromo and Ijen.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocKNkXY3yMVG-RG2yywgexvG9F2cDyItZZohmHev2Lu4Y118fA=s120-c-rp-mo-ba2-br100",
  },
  {
    name: "Samia Amrani",
    country: "France",
    rating: 5,
    text: "Best experience ever! Driver Pras and guide Rendi were super professional and thoughtful. They took care of every detail and made us feel super safe.",
    photo: "https://lh3.googleusercontent.com/a/ACg8ocJ4eOWcIFSgTsYGvX-1TDyCTZjuzn4AVC7Oc5enXGTNU54tczQI=s120-c-rp-mo-br100",
  },
];

const FAQ_ITEMS = [
  {
    question: "Bisa pickup dari Juanda Airport jam 11 malam atau tengah malam?",
    answer:
      "Ya, kami menyediakan pickup 24 jam dari Bandara Juanda (SUB). Banyak paket kami memang berangkat malam hari karena perjalanan ke Bromo memerlukan waktu sekitar 4-5 jam dan kita perlu tiba sebelum subuh untuk menyaksikan sunrise. Tim kami akan menunggu di area arrival.",
  },
  {
    question: "Apakah aman membawa anak-anak?",
    answer:
      "Paket Bromo aman untuk anak usia 8 tahun ke atas. Untuk Ijen, kami merekomendasikan usia minimal 15 tahun karena trek lebih menantang dan ada gas sulfur. Semua peserta Ijen wajib lolos health screening terlebih dahulu. Tim kami akan memberikan briefing safety sebelum setiap aktivitas.",
  },
  {
    question: "Guide berbicara bahasa apa?",
    answer:
      "Guide kami fasih berbahasa Inggris. Untuk grup yang berbicara bahasa Mandarin, Prancis, atau bahasa lain, mohon informasikan saat booking agar kami dapat mengatur guide yang sesuai.",
  },
  {
    question: "Apa yang dimaksud 'No Hidden Fees'?",
    answer:
      "Harga yang kami quote sudah termasuk semua biaya: 4WD, guide, tiket masuk, health screening Ijen, gas mask, dan makan sesuai itinerary. Tidak ada biaya tambahan tersembunyi. Satu-satunya pengeluaran opsional adalah oleh-oleh dan tips untuk guide/driver (opsional, tapi sangat diapresiasi).",
  },
  {
    question: "Berapa minimum peserta untuk booking private tour?",
    answer:
      "Minimum 1 orang — ini benar-benar private tour, bukan join group. Semakin banyak peserta dalam satu grup, semakin murah harga per orang. Kami tidak mencampur grup Anda dengan orang lain.",
  },
  {
    question: "Bagaimana proses health screening Ijen?",
    answer:
      "Screening dilakukan oleh tenaga medis terlatih di hotel Anda atau kantor JVTO, biasanya malam sebelum pendakian. Ini termasuk pengecekan tekanan darah, kondisi pernafasan, dan riwayat kesehatan. Hasilnya dikirim digital dengan QR code yang diverifikasi di gerbang Ijen.",
  },
  {
    question: "Bagaimana cara booking?",
    answer:
      "Hubungi kami via WhatsApp di +62 822-4478-8833 atau isi form di bawah. Kami akan kirimkan quotation dalam 1 jam. Booking dikonfirmasi setelah pembayaran deposit 30%.",
  },
];

export default function ToursFromSurabayaLP() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/hero/surabaya.jpg"
            alt="Mount Bromo sunrise from Surabaya"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/20 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white mt-20">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-jvto-green/20 border border-jvto-green/40 text-jvto-green px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Shield size={14} />
            Founded by Active Tourist Police Officer
          </div>

          <h1 className="text-3xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-tight max-w-4xl mx-auto">
            Private Bromo & Ijen Tour{" "}
            <span className="text-jvto-green">from Surabaya</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-3xl mx-auto font-light">
            Police-Led Safety · 100% All-Inclusive · No Hidden Fees
          </p>
          <p className="text-sm md:text-base text-gray-300 mb-10 max-w-2xl mx-auto">
            Pickup from Juanda Airport, Surabaya hotels, or Malang — 24 hours, any time you land.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`${WA_LINK}?text=${encodeURIComponent(WA_MSG_SURABAYA)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-sm font-black uppercase tracking-wide text-base transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <MessageCircle size={20} />
              Book via WhatsApp
            </a>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-wide text-sm transition-all"
            >
              See Tour Packages
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trustpilot */}
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
              { icon: Shield, title: "Police-Led Safety", sub: "Founder: Active Tourist Police" },
              { icon: CheckCircle, title: "Licensed Operator", sub: "License No. 1102230032918" },
              { icon: Star, title: "4.9 / 5 Rating", sub: "120+ Google & Trustpilot Reviews" },
              { icon: CheckCircle, title: "All-Inclusive", sub: "Zero Hidden Fees Guarantee" },
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

      {/* ── PICKUP POINTS ────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              Pickup Service
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              We Pick You Up — Anywhere in Surabaya or Malang
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              No need to arrange your own transport. Tell us where you are, we'll be there.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {PICKUP_POINTS.map((pt) => (
              <div
                key={pt.name}
                className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <MapPin size={20} className="text-jvto-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-jvto-dark text-sm">{pt.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            Need a different pickup point? Just let us know via WhatsApp — we accommodate all locations.
          </p>
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
              Choose Your Adventure
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Transparent pricing. 100% private. No surprise costs.
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
                        href={`${WA_LINK}?text=${encodeURIComponent(`Hi JVTO, I'm interested in the ${pkg.name} from Surabaya. Can you share availability and pricing?`)}`}
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
              100% All-Inclusive. Zero Surprises.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need from pickup to drop-off — in one transparent price.
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

      {/* ── ITINERARY TIMELINE ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-4">
              Itinerary
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-jvto-dark mb-3">
              Hour-by-Hour Itinerary
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Know exactly what happens and when — no vague "flexible" schedules.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {ITINERARY.map((day, dayIdx) => (
              <div key={dayIdx} className="relative pl-8 border-l-2 border-jvto-green/30">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-jvto-green flex items-center justify-center">
                  <span className="text-xs font-black text-jvto-dark">{dayIdx + 1}</span>
                </div>
                <div className="mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-jvto-green">
                    {day.day}
                  </span>
                  <h3 className="text-lg font-black text-jvto-dark uppercase">{day.title}</h3>
                </div>
                <ul className="space-y-2">
                  {day.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEALTH SCREENING ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 mb-6">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Mandatory Requirement
                  </span>
                </div>
                <h2 className="font-black text-3xl md:text-5xl text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                  Real Medical Check{" "}
                  <span className="text-lime-600">Included</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Kawah Ijen is a high-altitude volcano with active sulfur gas. We include a{" "}
                  <span className="font-bold text-gray-900 bg-lime-100 px-1">
                    REAL screening
                  </span>{" "}
                  by trained medical staff at your hotel — before you even start the trek.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Included in your package cost",
                    "Digital QR verification at the gate",
                    "Done at your hotel lobby — no extra travel",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-800">
                      <CheckCircle size={18} className="text-jvto-green flex-shrink-0" />
                      <span className="font-medium">{item}</span>
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
                  src="/screening/ijen-screening-hotel-01.jpeg"
                  alt="Health screening at hotel before Ijen trek"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-lime-600" />
                    <p className="font-bold text-xs uppercase text-gray-900">
                      Location: Your Hotel Lobby
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER / TRUST ─────────────────────────────────────────── */}
      <section className="py-20 bg-jvto-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-jvto-green/5 skew-x-12 transform translate-x-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-6">
                Why Trust Us
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-6 leading-tight">
                Led by an{" "}
                <span className="text-jvto-green">Active Police Officer</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  JVTO was founded by{" "}
                  <strong className="text-white">Agung "Mr. Sam" Sambuko</strong>, an active
                  Indonesian Tourist Police officer who saw the gap in safety standards firsthand.
                </p>
                <p>
                  We operate with police-level safety protocols: clear written rules, realistic
                  driving schedules, and mandatory health checks — not just lip service.
                </p>
                <p>
                  Our operator license (No. <strong className="text-jvto-green">1102230032918</strong>)
                  is publicly verifiable. You can check it before you book.
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
                  Our Story →
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-sm aspect-[4/5]">
                <Image
                  src="/founder/mr-sam-tourist-police-portrait.png"
                  alt='Agung "Mr. Sam" Sambuko — JVTO Founder & Tourist Police Officer'
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
              What Our Guests Say
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Real reviews from travelers who started from Surabaya.
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
                Everything travelers from Surabaya & Malang ask before booking.
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
              Ready to Book Your{" "}
              <span className="text-jvto-green">East Java Adventure?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Message us on WhatsApp with your travel dates and group size.
              We'll reply within 1 hour with a full quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`${WA_LINK}?text=${encodeURIComponent(WA_MSG_SURABAYA)}`}
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
              Available 08:00 – 22:00 WIB · Reply within 1 hour · No commitment required
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
