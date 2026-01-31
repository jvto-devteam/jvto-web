// components/TravelGuideContent.tsx
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  MapPin,
  ReceiptText,
  HelpCircle,
  Shield,
  Backpack,
  CloudSun,
  ShieldAlert,
  Headphones,
  ChevronDown,
  Globe,
  MessageCircle,
  AlertTriangle,
  CheckSquare,
  Filter,
  ChevronUp,
  Mail,
  Phone,
  MapPin as MapPinIcon,
  ExternalLink,
  Users,
  Mountain,
  Thermometer,
  Wind,
  Sun,
  Activity,
  Heart,
  Stethoscope,
  Smartphone,
  Calendar,
  CreditCard,
  FileText,
  Banknote,
  Car,
  Hotel,
  Umbrella,
  AlertCircle,
  Lock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const TravelGuideContent = () => {
  const [openSections, setOpenSections] = useState({
    hub: true,
    booking: false,
    faq: false,
    ijen: false,
    safety: false,
    packing: false,
    weather: false,
    police: false,
  });

  const [openFaqItems, setOpenFaqItems] = useState<Record<number, boolean>>({});

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // JSON-LD Schema untuk SEO
  const travelGuideSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Comprehensive Travel Guide - Java Volcano Tour Operator",
    description:
      "Complete travel guide for Bromo, Ijen, and Tumpak Sewu tours. Includes booking information, safety guidelines, packing lists, and frequently asked questions.",
    url: "https://www.javavolcano-touroperator.com/travel-guide",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How to book a private tour with JVTO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Book through website secure checkout or contact WhatsApp +62 822-4478-8833. 20% deposit required, full payment due 5 days before tour.",
          },
        },
        {
          "@type": "Question",
          name: "What is included in JVTO tour packages?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Private transport, Bromo jeep, entrance tickets, accommodation when included, Ijen safety gear and health screening.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Travel Credit policy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JVTO uses Travel Credit instead of cash refunds. Cancellations 48+ hours before get 100% Travel Credit, valid indefinitely and transferable.",
          },
        },
      ],
    },
    publisher: {
      "@type": "TravelAgency",
      name: "Java Volcano Tour Operator",
      description:
        "Specializing in sustainable eco-tourism across East Java's volcanic landscapes since 2010.",
      url: "https://javavolcano-touroperator.com",
      telephone: "+62 822-4478-8833",
      email: "hello@javavolcano-touroperator.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Indonesia",
      },
    },
    datePublished: "2026-01-19",
    dateModified: "2026-01-19",
    inLanguage: "en",
  };

  const faqData = [
    {
      q: "Q1. Are your tours private or shared?",
      a: "All JVTO tours are private tours. We do not mix you with other groups or sell 'seat-in-coach' departures. Each itinerary is planned only for your party.",
    },
    {
      q: "Q2. What is included in the tour price?",
      a: "The binding list of inclusions is written on your Official E‑Voucher / Invoice (PDF). Depending on the package, inclusions may include private transport, Bromo jeep (if included), listed tickets/permits, accommodation + breakfasts (if included), and Ijen safety gear/screening (if included). Anything not written as included on your voucher is excluded by default.",
    },
    {
      q: "Q3. What is not included?",
      a: "Normally not included: flights, long-distance trains, visas, travel insurance, personal expenses (extra drinks, snacks, souvenirs, etc.), tips and gratuities, optional activities not listed.",
    },
    {
      q: "Q4. How do I book a tour with JVTO?",
      a: "A booking is confirmed only when (1) the required payment is successfully processed and (2) JVTO issues your Official E‑Voucher / Invoice (PDF). Enquiries and quotations are not binding until confirmation.",
    },
    {
      q: "Q5. Do you require a deposit and when is full payment due?",
      a: "Standard deposit: 20% of the total booking value. If Day 1 is within 14 days, JVTO may require up to 100% full payment. By card: no later than 5 days before Day 1. By bank transfer / Wise: no later than 3 days before Day 1.",
    },
    {
      q: "Q6. Do you offer cash refunds?",
      a: "JVTO uses a Travel Credit system instead of cash refunds. We do not offer cash refunds, except where required by applicable law.",
    },
    {
      q: "Q7. Can I change my dates or reschedule?",
      a: "Where possible, JVTO may allow a date change for the same package if requested 48 hours or more before Day 1 (local Indonesia time). All changes are subject to availability and any supplier cost differences. Requests made less than 48 hours before Day 1 are generally not permitted.",
    },
    {
      q: "Q8. What happens if Bromo or Ijen is closed?",
      a: "If a core activity is fully closed by authorities or unsafe to attempt, we first look for reasonable alternatives within safety limits. If no meaningful alternative is possible, we apply our Travel Credit policy for the affected part of your program.",
    },
    {
      q: "Q9. How does the Ijen health screening work?",
      a: "For tours that include the Ijen night hike: A proper health screening is included in your package. Checks are carried out by trained medical staff and recorded digitally. The result can be verified using a QR code to help prevent fake certificates.",
    },
    {
      q: "Q10. Can you arrange official traffic police escort for our group?",
      a: "For large groups, JVTO may help coordinate official traffic police escort on certain segments, subject to availability, local regulations, route feasibility, and any additional costs imposed by authorities.",
    },
    {
      q: "Q11. Do you offer student deals with ISIC?",
      a: "Yes. We collaborate with ISIC so that verified ISIC cardholders can access fair rates on selected packages, while keeping the same safety standards and inclusions as other guests.",
    },
    {
      q: "Q12. Do I need travel insurance?",
      a: "We strongly recommend you purchase comprehensive travel insurance that covers: medical care, cancellations, delays, and activities such as hiking and outdoor tours. JVTO does not sell insurance and cannot act as your insurer.",
    },
    {
      q: "Q13. I have a medical condition. Can I still join?",
      a: "Many guests with mild or managed conditions can still travel comfortably, but you must consult your doctor before the trip. Please inform us of any relevant conditions in advance, especially if you plan to hike Ijen.",
    },
    {
      q: "Q14. What should I pack and how fit do I need to be?",
      a: "Packing and fitness requirements depend on your itinerary (Bromo, Ijen, Tumpak Sewu). We summarize this in a dedicated page.",
    },
    {
      q: "Q15. Who can I contact during the tour if I need help?",
      a: "During your private tour, you will be accompanied by a dedicated driver and, on some segments, local guides. For any serious concern, the contact number on your confirmation remains active.",
    },
  ];

  return (
    <>
      {/* JSON-LD Schema untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelGuideSchema) }}
      />

      <div className="bg-background-light py-30 font-display text-[#111811] min-h-screen">
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 lg:px-10 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="text-[#9fce33]" size={20} />
                    <div>
                      <h3 className="text-base font-bold text-[#1a1a1a]">
                        Table of Contents
                      </h3>
                      <p className="text-xs text-gray-500">Quick Navigation</p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-1">
                    <a
                      href="#hub"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#9fce33]/10 text-[#9fce33] font-bold border-l-4 border-[#9fce33] hover:bg-[#9fce33]/20 transition-colors"
                    >
                      <MapPin size={20} />
                      <span className="text-sm">Travel Guide Hub</span>
                    </a>
                    <a
                      href="#booking"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <ReceiptText size={20} />
                      <span className="text-sm">Booking & Payments</span>
                    </a>
                    <a
                      href="#faq"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <HelpCircle size={20} />
                      <span className="text-sm">FAQ</span>
                    </a>
                    <a
                      href="#ijen"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <Filter size={20} />
                      <span className="text-sm">Ijen Health Screening</span>
                    </a>
                    <a
                      href="#safety"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <Shield size={20} />
                      <span className="text-sm">Safety on Tours</span>
                    </a>
                    <a
                      href="#packing"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <Backpack size={20} />
                      <span className="text-sm">Packing & Fitness</span>
                    </a>
                    <a
                      href="#weather"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <CloudSun size={20} />
                      <span className="text-sm">Weather & Closures</span>
                    </a>
                    <a
                      href="#police"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      <ShieldAlert size={20} />
                      <span className="text-sm">Police Escort for Groups</span>
                    </a>
                  </nav>
                </div>

                <div className="bg-[#1a1a1a] text-white p-6 rounded-xl relative overflow-hidden shadow-lg">
                  <div className="absolute -right-4 -top-4 text-white/5">
                    <Headphones size={120} />
                  </div>
                  <h4 className="font-bold mb-2 relative z-10">Need Help?</h4>
                  <p className="text-sm text-gray-300 mb-4 relative z-10">
                    Our team is available 24/7 for your questions.
                  </p>
                  <Link
                    target="_blank"
                    href="https://wa.me/6282244788833"
                    className="w-full py-2 bg-[#9fce33] text-[#1a1a1a] font-bold text-sm rounded-lg relative z-10 hover:bg-white transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <div className="mb-10">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-3">
                  Comprehensive Travel Guide
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Everything you need to know for your journey with JVTO. Please
                  read through carefully to ensure a safe and memorable
                  adventure.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Section 1: Travel Guide Hub */}
                <section
                  id="hub"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("hub")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Travel Guide — Booking, Safety & Practical Info
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.hub ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.hub ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This Travel Guide is your practical handbook for
                        traveling with Java Volcano Tour Operator (JVTO). Here
                        you'll find clear information on bookings, payments,
                        reschedules, health screening for Ijen, safety on tours,
                        packing, weather-related closures, and when police
                        escort can be arranged for groups.
                      </p>
                      <p>
                        For binding legal terms, please refer to:
                        <Link
                          href="/policy/booking-payment-cancellation/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                        >
                          /policy/booking-payment-cancellation/
                        </Link>
                        ,
                        <Link
                          href="/policy/inclusions-exclusions/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                        >
                          /policy/inclusions-exclusions/
                        </Link>
                        , and{" "}
                        <Link
                          href="/policy/privacy/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded mx-1"
                        >
                          /policy/privacy
                        </Link>
                        .
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="font-bold text-blue-800 mb-2">
                          Official channels:
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              Website: https://javavolcano-touroperator.com
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              WhatsApp: +62 822-4478-8833
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              Email: hello@javavolcano-touroperator.com
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-[#1a1a1a] mb-4">
                      Topics
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "FAQ — Short Answers to Common Questions",
                          desc: "Start here if you're not sure where to look. We answer the most common questions about private tours, what's included, payments, reschedules, and safety.",
                        },
                        {
                          title: "Booking & Payments",
                          desc: "Details on how to book, deposits, final payments, Travel Credit, and why we don't offer cash refunds.",
                        },
                        {
                          title: "Ijen Health Screening",
                          desc: "How our health checks work for Ijen night hikes, what is included for JVTO guests, and how the digital system helps prevent fake certificates.",
                        },
                        {
                          title: "Safety on Tours",
                          desc: "How we make decisions about safety on the road, at viewpoints, and on the mountain, including how we monitor conditions and when we change plans.",
                        },
                        {
                          title: "Packing & Fitness",
                          desc: "What to pack for Bromo, Ijen and Tumpak Sewu, what kind of fitness you need, and a few tips to keep your belongings safe.",
                        },
                        {
                          title: "Weather & Closures",
                          desc: "How rain, fog, or volcanic activity can affect your itinerary, which sources we follow, and what happens to your booking if part of the tour is closed.",
                        },
                        {
                          title: "Police Escort for Groups",
                          desc: "When and how official traffic police escort can be arranged for large groups, and why it is always done through formal channels.",
                        },
                      ].map((topic, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:border-[#9fce33] transition-colors"
                        >
                          <h4 className="font-bold text-[#1a1a1a] mb-2">
                            {topic.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {topic.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 2: Booking Information */}
                <section
                  id="booking"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("booking")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ReceiptText size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Booking Information — Payments, Changes & Travel
                          Credit
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.booking ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.booking ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This section explains how bookings, payments, changes,
                        and Travel Credit work for private tours with JVTO. It
                        is a plain-language summary. For the full legal policy,
                        see{" "}
                        <Link
                          href="/policy/booking-payment-cancellation/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/booking-payment-cancellation/
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 2.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.1
                          </span>
                          How to Book a Private Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO operates private tours only. We do not sell
                            shared-group or "seat-in-coach" trips.
                          </p>
                          <p>
                            The standard way to book is through our website
                            secure checkout:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Choose your route/package on our website.</li>
                            <li>
                              Select your travel date and click Instant Book.
                            </li>
                            <li>
                              Enter the lead traveler contact details (email +
                              WhatsApp).
                            </li>
                            <li>Review & pay via secure checkout.</li>
                            <li>
                              After successful payment, JVTO issues your
                              Official E‑Voucher / Invoice (PDF) and you can
                              access My Booking Portal.
                            </li>
                            <li>
                              If you need help (or have a custom request),
                              contact us via WhatsApp +62 822-4478-8833 or email
                              hello@javavolcano-touroperator.com.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.2
                          </span>
                          Deposits & Final Payment
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <div>
                            <p className="font-bold">Deposit</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Standard deposit: <strong>20%</strong> of the
                                total booking value.
                              </li>
                              <li>
                                If Day 1 is within <strong>14 days</strong>,
                                JVTO may require up to <strong>100%</strong>{" "}
                                full payment.
                              </li>
                              <li>
                                A booking is confirmed only after the required
                                payment is successfully processed and JVTO
                                issues your{" "}
                                <strong>
                                  Official E-Voucher / Invoice (PDF)
                                </strong>
                                .
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold">
                              Final payment (if applicable)
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                By card: no later than{" "}
                                <strong>5 days before Day 1</strong>.
                              </li>
                              <li>
                                By bank transfer / Wise: no later than{" "}
                                <strong>3 days before Day 1</strong>.
                              </li>
                              <li>
                                Cash at the JVTO office (IDR only): allowed only
                                if approved in writing in advance.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 mb-2">
                              Bank transfer details (balance payments only)
                            </h4>
                            <p className="text-sm mb-2">
                              Use bank details only when instructed through
                              official channels.
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-yellow-600" />
                                <span>
                                  Bank BRI — PT Java Volcano Rendezvous —
                                  001301001779564 — SWIFT: BRINIDJAXXX
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-yellow-600" />
                                <span>
                                  Bank BCA — PT Java Volcano Rendezvous —
                                  1200944352 — SWIFT: CENAIDJAXXX
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-bold text-red-800 mb-2">
                              Payment security & anti-fraud
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              <li>
                                Checkout is SSL-encrypted and processed via a
                                PCI DSS-compliant payment gateway.
                              </li>
                              <li>
                                JVTO does not store full card numbers, CVV
                                codes, or online banking passwords.
                              </li>
                              <li>
                                JVTO will never ask you for full card details,
                                CVV, or banking credentials via chat or email.
                                If you are unsure, verify via WhatsApp or email
                                before paying.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 2.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.3
                          </span>
                          What's Included in the Tour Price
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Your Official E‑Voucher / Invoice (PDF) is the
                            binding reference for what is included in your
                            specific booking.
                          </p>
                          <p>
                            Depending on the package and what is written on your
                            voucher, inclusions may include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Private air‑conditioned transport with driver for
                              the confirmed itinerary.
                            </li>
                            <li>
                              Private 4WD jeep at Mount Bromo (when Bromo is
                              included).
                            </li>
                            <li>
                              Entrance tickets and permits for the sites listed
                              in the confirmed itinerary.
                            </li>
                            <li>
                              Accommodation and hotel breakfasts for the nights
                              listed (when accommodation is included).
                            </li>
                            <li>
                              Mount Ijen safety gear (gas mask, trekking poles)
                              and required health screening (when Ijen is
                              included).
                            </li>
                            <li>
                              Bottled mineral water during overland sectors.
                            </li>
                            <li>
                              Any additional meals, transfers, or extras only
                              when explicitly written as included on your
                              voucher.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.4
                          </span>
                          What's Not Included
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Unless clearly stated otherwise on your program, the
                            tour price does <strong>not</strong> include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>International or domestic flights</li>
                            <li>
                              Long-distance trains to/from East Java (unless
                              explicitly added)
                            </li>
                            <li>Visas or immigration fees</li>
                            <li>
                              Travel insurance (we strongly recommend you
                              purchase your own)
                            </li>
                            <li>
                              Personal expenses (snacks, drinks outside the
                              meals described, souvenirs, laundry, etc.)
                            </li>
                            <li>
                              Tips and gratuities for crew, guides, or hotel
                              staff
                            </li>
                            <li>
                              Optional activities not listed in the program
                            </li>
                            <li>
                              Medical treatment costs not related to the Ijen
                              health screening service
                            </li>
                          </ul>
                          <p>
                            If you are unsure whether a cost is included, please
                            ask us before you travel.
                          </p>
                        </div>
                      </div>

                      {/* 2.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.5
                          </span>
                          Travel Credit (No Cash Refund Policy)
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO uses a <strong>Travel Credit</strong> system
                            instead of cash refunds.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              If you cancel or change your tour under conditions
                              allowed by our policy, we issue{" "}
                              <strong>Travel Credit</strong> for the eligible
                              amount you already paid.
                            </li>
                            <li>
                              Travel Credit can be used for future private tours
                              with JVTO.
                            </li>
                            <li>
                              Travel Credit is <strong>non-expiring</strong> and
                              can be transferred to another traveler with your
                              written authorization.
                            </li>
                            <li>
                              We do not offer cash refunds, except where
                              required by applicable law.
                            </li>
                          </ul>
                          <p>
                            The exact conditions for Travel Credit (when it
                            applies, and how much) are defined in your full
                            Booking & Cancellation Policy.
                          </p>
                        </div>
                      </div>

                      {/* 2.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.6
                          </span>
                          Changes & Reschedules
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Where possible, JVTO may allow a date change for the
                            same package if requested 48 hours or more before
                            Day 1 (local Indonesia time).
                          </p>
                          <p>
                            All changes are subject to availability (vehicles,
                            hotels, guides) and any supplier cost differences.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Requests made less than 48 hours before Day 1 are
                              generally not permitted and may be treated as a
                              late cancellation.
                            </li>
                            <li>
                              Any approved change must be confirmed in writing
                              and reflected in an updated Official E‑Voucher /
                              Invoice (PDF).
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 2.7 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.7
                          </span>
                          Cancellations & No-Shows
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>If you decide to cancel:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Please inform us as soon as possible through our
                              official contact channels.
                            </li>
                            <li>
                              Any eligible amount is converted into{" "}
                              <strong>Travel Credit</strong> according to the
                              time of cancellation and the rules in our policy.
                            </li>
                            <li>
                              In some cases, late cancellations or no-shows may
                              result in reduced or zero Travel Credit if
                              suppliers have already been paid and cannot
                              refund.
                            </li>
                          </ul>

                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-bold text-amber-800 mb-2">
                              48-hour cut-off (local Indonesia time)
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span>
                                  If you cancel{" "}
                                  <strong>48 hours or more before Day 1</strong>
                                  : payments are{" "}
                                  <strong>not refundable in cash</strong>;{" "}
                                  <strong>
                                    100% converts to JVTO Travel Credit
                                  </strong>{" "}
                                  (issued in IDR, non-expiring, transferable
                                  with written confirmation).
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                                <span>
                                  If you cancel{" "}
                                  <strong>
                                    less than 48 hours before Day 1
                                  </strong>
                                  : the booking may be forfeited up to{" "}
                                  <strong>100%</strong>; Travel Credit and cash
                                  refunds are generally{" "}
                                  <strong>not provided</strong>.
                                </span>
                              </div>
                            </div>
                          </div>

                          <p>We will always:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Explain clearly which parts can be converted to
                              Travel Credit,
                            </li>
                            <li>
                              Provide written confirmation of any Travel Credit
                              issued.
                            </li>
                          </ul>
                          <p>
                            Full details:{" "}
                            <Link
                              href="/policy/booking-payment-cancellation/"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              /policy/booking-payment-cancellation/
                            </Link>
                          </p>
                        </div>
                      </div>

                      {/* 2.8 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.8
                          </span>
                          Changes Caused by Weather, Volcano Alerts, or Other
                          External Factors
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Some elements of your itinerary depend on local
                            conditions and official regulations (weather,
                            volcanic activity, closures, road conditions).
                          </p>
                          <p>
                            If a site is closed by authorities or conditions are
                            unsafe, JVTO will adjust the program where feasible
                            (change order, alternative stops, or timing
                            adjustments).
                          </p>
                          <p>
                            If a key part cannot operate, remedies follow the
                            Booking, Payment & Cancellation Policy (including
                            force majeure rules).
                          </p>
                        </div>
                      </div>

                      {/* 2.9 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.9
                          </span>
                          Your Responsibilities as a Guest
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            To keep the tour smooth and safe, we ask you to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Provide correct personal and contact information.
                            </li>
                            <li>
                              Inform us in advance of any{" "}
                              <strong>medical conditions</strong> that may be
                              relevant (especially for Ijen).
                            </li>
                            <li>
                              Read and follow our{" "}
                              <strong>Safety on Tours</strong> and{" "}
                              <strong>Packing & Fitness</strong> guidelines.
                            </li>
                            <li>
                              Use only our{" "}
                              <strong>official contact channels</strong>{" "}
                              (website, WhatsApp number, email) for payments and
                              changes.
                            </li>
                          </ul>
                          <p>
                            If you have any questions before you pay, please
                            ask. We prefer to explain everything clearly
                            upfront.
                          </p>
                        </div>
                      </div>

                      {/* 2.10 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            2.10
                          </span>
                          After Checkout: My Booking Portal
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            After payment success, you can access{" "}
                            <strong>My Booking Portal</strong> to manage your
                            confirmed booking.
                          </p>

                          <div>
                            <p className="font-bold">How to log in</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Use the <strong>same email</strong> you entered
                                at checkout (Lead Traveler email).
                              </li>
                              <li>
                                The portal access method may use a secure
                                sign‑in link or verification code sent to your
                                email.
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-bold">
                              What you can see in My Booking Portal
                            </p>
                            <p>Your portal page may include:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Tour dates (Day 1 – End date)</li>
                              <li>Package / route summary</li>
                              <li>Pickup details (location, time, notes)</li>
                              <li>
                                Vehicle & crew assignment (when available)
                              </li>
                              <li>Accommodation plan (when included)</li>
                              <li>Daily itinerary overview</li>
                              <li>
                                Important notes (meeting points, what to bring,
                                health/safety reminders)
                              </li>
                              <li>
                                Your Official E‑Voucher / Invoice download link
                                (PDF)
                              </li>
                              <li>
                                A "To‑Do" section to submit missing required
                                details (guest list, pickup/drop-off, rooming,
                                dietary notes), if needed
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: FAQ */}
                <section
                  id="faq"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("faq")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <HelpCircle size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Frequently Asked Questions
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.faq ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.faq ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This FAQ covers the most common questions about private
                        tours with JVTO. For detailed rules, please check the
                        specific Travel Guide pages linked in each answer.
                      </p>
                      <p>
                        For binding terms, see{" "}
                        <Link
                          href="/policy/booking-payment-cancellation/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/booking-payment-cancellation/
                        </Link>
                        and{" "}
                        <Link
                          href="/policy/inclusions-exclusions/"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/inclusions-exclusions/
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-4">
                      {faqData.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleFaq(index)}
                          >
                            <span className="font-bold text-[#1a1a1a]">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`text-gray-400 transition-transform ${openFaqItems[index] ? "rotate-180" : ""}`}
                              size={20}
                            />
                          </div>
                          <div
                            className={`px-4 pb-4 pt-2 text-gray-600 ${openFaqItems[index] ? "block" : "hidden"}`}
                          >
                            {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 4: Ijen Health Screening */}
                <section
                  id="ijen"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("ijen")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Filter size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Ijen Health Screening — Real Checks, Digital Proof
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.ijen ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.ijen ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        Kawah Ijen is a demanding night hike with steep sections
                        and potential sulfur gas exposure. This section explains
                        health screening requirements for Ijen tours and what
                        guests need to prepare. For data handling related to
                        screening, see{" "}
                        <Link
                          href="/policy/privacy"
                          className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                        >
                          /policy/privacy
                        </Link>
                        .
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 4.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.1
                          </span>
                          Why Health Screening Is Necessary
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Health screening may be required by local
                            authorities or park/permit conditions for access to
                            certain Ijen areas.
                          </p>
                          <p>
                            Screening supports safer decisions for guests and
                            local teams.
                          </p>
                        </div>
                      </div>

                      {/* 4.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.2
                          </span>
                          What JVTO Includes for Its Guests
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            If your confirmed JVTO tour includes an Ijen night
                            hike, required health screening is arranged as part
                            of the Ijen segment (as written on your voucher).
                          </p>
                        </div>
                      </div>

                      {/* 4.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.3
                          </span>
                          Digital System & QR Verification
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Screening results are stored in a digital system
                            that allows:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              staff at checkpoints to <strong>verify</strong>{" "}
                              that a real screening was done,
                            </li>
                            <li>
                              less reliance on paper letters that can be forged,
                            </li>
                            <li>
                              clearer documentation for both guests and
                              authorities.
                            </li>
                          </ul>
                          <p>
                            JVTO supports this digital approach as part of a
                            wider effort to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>reduce fake certificates,</li>
                            <li>improve consistency of checks,</li>
                            <li>and keep more visitors within safe limits.</li>
                          </ul>
                        </div>
                      </div>

                      {/* 4.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.4
                          </span>
                          For Non-JVTO Travelers
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            The same digital system is also available to
                            travelers who are <strong>not</strong> touring with
                            JVTO, through participating clinics and hotels in
                            the Ijen area.
                          </p>
                          <p>
                            The goal is not to restrict competition, but to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>raise the overall standard of safety,</li>
                            <li>
                              make it harder for fake letters to circulate,
                            </li>
                            <li>
                              and give everyone clearer information about their
                              own condition.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 4.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.5
                          </span>
                          What Screening Does Not Do
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Health screening:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>helps reduce risk,</li>
                            <li>supports better decisions,</li>
                            <li>and provides documentation.</li>
                          </ul>
                          <p>
                            It does <strong>not</strong>:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>guarantee that nothing can go wrong,</li>
                            <li>
                              replace your own responsibility to disclose
                              medical conditions,
                            </li>
                            <li>replace the advice of your personal doctor.</li>
                          </ul>
                          <p>
                            Conditions on the mountain (gas, weather, crowding)
                            can still change. We may still decide to modify or
                            cancel the hike if we believe it is the safest
                            option for the group.
                          </p>
                        </div>
                      </div>

                      {/* 4.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            4.6
                          </span>
                          Data & Privacy (Short Summary)
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Health data collected during screening is:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              used only for safety and operational purposes
                              related to your Ijen hike,
                            </li>
                            <li>
                              shared only with parties who need to verify you
                              are fit to join,
                            </li>
                            <li>
                              handled according to our Privacy & Data Protection
                              Policy:{" "}
                              <Link
                                href="/policy/privacy"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                /policy/privacy
                              </Link>
                              .
                            </li>
                          </ul>
                          <p>
                            For how we handle personal data related to permits
                            and health screening, see{" "}
                            <Link
                              href="/policy/privacy"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              /policy/privacy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Safety on Tours */}
                <section
                  id="safety"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("safety")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Safety on Tours — How We Make Decisions
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.safety ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.safety ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This section explains how JVTO thinks about safety
                        across all tours — on the road, at viewpoints, on
                        trails, and around volcanoes.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 5.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.1
                          </span>
                          Responsibility & Roles
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              JVTO is a registered Indonesian travel company
                              specializing in private volcano tours.
                            </li>
                            <li>
                              JVTO operates under local regulations and works
                              with licensed partners and authorities where
                              required for safety and access.
                            </li>
                            <li>
                              Our crews (drivers and guides) are trained to
                              follow internal procedures and local regulations,
                              not just chase "the best photo".
                            </li>
                          </ul>
                          <p>On tour:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              The <strong>tour leader/guide</strong> and{" "}
                              <strong>driver</strong> are your first line of
                              support.
                            </li>
                            <li>
                              For larger groups, coordination may also involve
                              local authorities when needed.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 5.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.2
                          </span>
                          Before the Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Before your trip starts, we:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              check recent updates on road and park conditions,
                            </li>
                            <li>
                              review weather patterns and any official alerts,
                            </li>
                            <li>confirm hotel and transport availability,</li>
                            <li>
                              and align with local partners in key areas like
                              Bromo, Ijen, and Tumpak Sewu.
                            </li>
                          </ul>
                          <p>
                            For Ijen, health screening is a mandatory part of
                            preparation for those doing the night hike.
                          </p>
                        </div>
                      </div>

                      {/* 5.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.3
                          </span>
                          During the Tour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>During your tour, our crew:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              monitors conditions on the ground: weather, road
                              status, crowding, and local announcements,
                            </li>
                            <li>
                              communicates with other operators and local
                              contacts when necessary,
                            </li>
                            <li>
                              adjusts timings if there are delays or sudden
                              changes.
                            </li>
                          </ul>
                          <p>We may:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              leave earlier or later to avoid traffic or unsafe
                              crowding,
                            </li>
                            <li>
                              switch viewpoints if one area is too congested or
                              temporarily restricted,
                            </li>
                            <li>
                              choose safer walking paths at waterfalls or along
                              crater rims.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 5.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.4
                          </span>
                          When Plans Need to Change
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Sometimes, the safest decision is to change or
                            cancel part of the plan. Reasons can include:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>heavy rain, strong winds, or dense fog,</li>
                            <li>volcanic gas levels or alerts,</li>
                            <li>road closures, landslides, or accidents,</li>
                            <li>local ceremonies or regulations.</li>
                          </ul>
                          <p>If we need to change plans:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>we will explain why,</li>
                            <li>
                              we will propose reasonable alternatives where
                              possible,
                            </li>
                            <li>
                              and we will apply our Travel Credit rules if key
                              elements cannot be operated.
                            </li>
                          </ul>
                          <p>
                            See:{" "}
                            <Link
                              href="/travel-guide#weather"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              Weather & Closures
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/travel-guide#booking"
                              className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                            >
                              Booking Information
                            </Link>
                            .
                          </p>
                        </div>
                      </div>

                      {/* 5.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.5
                          </span>
                          Your Role as a Guest
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Safety works best when everyone plays their part. We
                            ask you to:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Wear appropriate clothing and footwear (see{" "}
                              <Link
                                href="/travel-guide#packing"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                Packing & Fitness
                              </Link>
                              ).
                            </li>
                            <li>
                              Follow instructions from guides and drivers,
                              especially in narrow, wet, or crowded areas.
                            </li>
                            <li>
                              Tell the crew immediately if you feel unwell,
                              dizzy, or anxious.
                            </li>
                            <li>
                              Be honest about your health and any conditions
                              that might affect the trip.
                            </li>
                          </ul>
                          <p>
                            If you feel something is unsafe, you can always ask
                            to slow down, stop, or skip an activity. There is no
                            pressure to "push through" discomfort.
                          </p>
                        </div>
                      </div>

                      {/* 5.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            5.6
                          </span>
                          Alcohol, Substances & Risky Behaviour
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>For safety reasons:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Guests under the influence of alcohol or other
                              substances may be refused participation in certain
                              activities (especially hikes and steep trails).
                            </li>
                            <li>
                              Dangerous behaviour that puts yourself or others
                              at risk may result in parts of the tour being
                              modified or stopped.
                            </li>
                          </ul>
                          <p>
                            Our priority is that everyone finishes the trip
                            safely — guests, crew, and local communities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6: Packing & Fitness */}
                <section
                  id="packing"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("packing")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <Backpack size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Packing & Fitness — Bromo, Ijen & Tumpak Sewu
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.packing ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.packing ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        This page helps you prepare realistically for your
                        private tour. We cover what to pack, how fit you should
                        be for each destination, and a few practical tips to
                        protect your belongings.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 6.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.1
                          </span>
                          General Clothing & Essentials
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            For all routes (Bromo, Ijen, waterfalls), we
                            recommend:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Light, quick-drying layers</li>
                            <li>
                              A warm jacket or fleece (for early mornings and
                              higher altitude)
                            </li>
                            <li>
                              Long trousers or leggings (more comfortable for
                              hiking than jeans)
                            </li>
                            <li>
                              Comfortable walking shoes with good grip (avoid
                              smooth soles)
                            </li>
                            <li>
                              A small daypack for water, snacks, and extra
                              layers
                            </li>
                            <li>
                              Sunscreen, sunglasses, and a hat for daytime
                            </li>
                            <li>
                              A light rain jacket or poncho (especially in the
                              rainy season)
                            </li>
                            <li>Personal medication you use regularly</li>
                          </ul>
                          <p>
                            Your main luggage stays in the car/hotel; you only
                            carry what you need for the activity.
                          </p>
                        </div>
                      </div>

                      {/* 6.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.2
                          </span>
                          Bromo — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Warm layers (early morning can feel near 5–10°C at
                              viewpoints).
                            </li>
                            <li>Hat, gloves, scarf or buff are helpful.</li>
                            <li>
                              Comfortable shoes; you may walk on sand and dust.
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Bromo sunrise is suitable for most guests with
                              basic mobility.
                            </li>
                            <li>
                              You should be able to step in and out of the jeep,
                              walk short distances on uneven ground, and climb
                              modest stair sections if you choose to.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.3
                          </span>
                          Ijen — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Warm layers for the night (start can feel cold).
                            </li>
                            <li>
                              Long sleeves and trousers (for comfort and basic
                              protection).
                            </li>
                            <li>
                              Good hiking shoes with grip (the trail can be
                              dusty or slippery).
                            </li>
                            <li>
                              A light headlamp or torch (often provided, but
                              bring your own if you prefer).
                            </li>
                            <li>
                              Spare mask or scarf for general dust (this is not
                              a replacement for the gas mask we provide in the
                              crater area).
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              The trail to the crater rim includes a sustained
                              uphill walk.
                            </li>
                            <li>
                              You should be able to walk uphill at a steady pace
                              for 1–2 hours with short breaks.
                            </li>
                            <li>
                              Guests with heart, lung, or circulation conditions
                              should consult a doctor in advance and be very
                              cautious.
                            </li>
                            <li>
                              Final permission to join the night hike depends on
                              the <strong>Ijen health screening</strong> results
                              and on-the-ground conditions.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.4
                          </span>
                          Tumpak Sewu — Packing & Fitness
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Packing</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Clothing and shoes that can get wet and muddy.
                            </li>
                            <li>
                              Sandals or water shoes with grip for river
                              sections.
                            </li>
                            <li>
                              A small towel and a change of clothes can be
                              useful.
                            </li>
                          </ul>
                          <p className="font-bold">Fitness</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              The trail can be steep, with sections of stairs,
                              rocks, and wet surfaces.
                            </li>
                            <li>
                              You should be comfortable with balance, descending
                              and ascending with support from ropes/handholds,
                              and walking on slippery ground.
                            </li>
                            <li>
                              This activity is not recommended for guests with
                              serious knee, ankle, or balance issues.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 6.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.5
                          </span>
                          Private Tour & Crew Support
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Because your tour is private, your JVTO crew (driver
                            and local guides) are focused on your group only:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              You can ask for extra stops for rest, toilets, or
                              minimarkets.
                            </li>
                            <li>
                              If you feel tired or unwell, tell the crew early —
                              they can slow the pace, offer alternatives, or
                              help you skip a section safely.
                            </li>
                          </ul>
                          <p>
                            Please do not hesitate to speak up; the crew is
                            there to support you, not to rush you.
                          </p>
                        </div>
                      </div>

                      {/* 6.6 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.6
                          </span>
                          Valuables & Jewellery
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            We recommend minimizing valuables on outdoor days:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Avoid wearing expensive jewellery or watches on
                              hikes and waterfall days.
                            </li>
                            <li>
                              Water, mud, and tight spaces make it easy for
                              items to be dropped, scratched, or lost.
                            </li>
                            <li>
                              Crowded areas are not ideal for showing valuables.
                            </li>
                          </ul>
                          <p>
                            If you bring valuables, keep them secured in your
                            main luggage or hotel safe whenever possible.
                          </p>
                        </div>
                      </div>

                      {/* 6.7 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            6.7
                          </span>
                          Special Note for Silver Items at Ijen
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>At Ijen, volcanic gases can tarnish silver:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Sulfur in the air can react with silver and cause
                              it to darken or change colour.
                            </li>
                            <li>
                              In some cases this is difficult or impossible to
                              fully reverse.
                            </li>
                          </ul>
                          <p>For this reason, we strongly recommend:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Do <strong>not</strong> wear silver jewellery
                              (rings, bracelets, necklaces, earrings) during the
                              Ijen activity.
                            </li>
                            <li>
                              Avoid taking silver-coated watches or accessories
                              close to the crater area.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7: Weather & Closures */}
                <section
                  id="weather"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("weather")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <CloudSun size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Weather, Volcanic Activity & Closures
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.weather ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.weather ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        East Java's volcano and waterfall routes are dynamic.
                        Weather and volcanic activity can change quickly, and
                        local authorities may issue temporary restrictions or
                        closures. This section explains how we monitor
                        conditions and what happens to your tour when plans must
                        change.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 7.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.1
                          </span>
                          Weather Patterns on Our Routes
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p className="font-bold">Bromo & Ijen</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Main activities (Bromo sunrise, Ijen night hike)
                              typically happen between late night and early
                              morning.
                            </li>
                            <li>
                              In many seasons, heavier rain is more common later
                              in the day.
                            </li>
                            <li>
                              At higher viewpoints, conditions may be dry or
                              lightly drizzling while lower areas have heavier
                              rain.
                            </li>
                          </ul>
                          <p>
                            Weather is never fully predictable, but we plan
                            schedules to{" "}
                            <strong>
                              maximise the chance of safe and enjoyable
                              conditions
                            </strong>
                            .
                          </p>
                        </div>
                      </div>

                      {/* 7.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.2
                          </span>
                          Volcanic Activity & Official Alerts
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Our destinations are part of the{" "}
                            <strong>Ring of Fire</strong>. Low-level activity
                            (gas, tremors, minor events at volcanoes in the
                            region) can occur.
                          </p>
                          <p>For safety, we:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              refer to official Indonesian sources for volcanic
                              alert information,
                            </li>
                            <li>
                              follow restrictions and recommendations issued by
                              the relevant authorities,
                            </li>
                            <li>
                              and adjust activities when alert levels or local
                              regulations change.
                            </li>
                          </ul>
                          <p>
                            If authorities restrict access or close specific
                            areas, we will not attempt to bypass those rules.
                          </p>
                        </div>
                      </div>

                      {/* 7.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.3
                          </span>
                          Types of Changes You Might Experience
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Depending on conditions, we might need to:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              adjust <strong>timing</strong> (leave
                              earlier/later to avoid storms or congestion),
                            </li>
                            <li>
                              change <strong>viewpoints</strong> (alternative
                              sunrise spots or observation points),
                            </li>
                            <li>
                              modify <strong>walking routes</strong> (avoid
                              sections that are too slippery or crowded),
                            </li>
                            <li>
                              replace certain activities with safer alternatives
                              if a site is fully closed.
                            </li>
                          </ul>
                          <p>
                            Our crew will explain what is happening and why
                            adjustments are necessary.
                          </p>
                        </div>
                      </div>

                      {/* 7.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.4
                          </span>
                          If a Key Activity Cannot Run
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Sometimes, despite planning, a core activity may be
                            fully closed by authorities or unsafe to attempt.
                          </p>
                          <p>In those cases:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              We first look for reasonable alternatives within
                              safety limits.
                            </li>
                            <li>
                              If no meaningful alternative is possible, we apply
                              our <strong>Travel Credit</strong> policy for the
                              affected part of your program, as described in{" "}
                              <Link
                                href="/travel-guide#booking"
                                className="underline font-mono text-[#9fce33] text-sm bg-[#9fce33]/10 px-1 rounded"
                              >
                                Booking Information
                              </Link>
                              .
                            </li>
                            <li>
                              We will always explain clearly which parts of the
                              tour are affected and how any Travel Credit is
                              calculated.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 7.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            7.5
                          </span>
                          Communication During Disruptions
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>When conditions change:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Your driver/guide will update you during the tour.
                            </li>
                            <li>
                              Our office remains reachable via official contact
                              channels for further clarification.
                            </li>
                            <li>
                              We encourage you to ask questions if you are
                              unsure about any decision.
                            </li>
                          </ul>
                          <p>
                            Our priority is to keep you informed and safe while
                            respecting local communities and regulations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 8: Police Escort */}
                <section
                  id="police"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50"
                    onClick={() => toggleSection("police")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">
                          Police Escort for Tourist Groups in East Java
                        </h2>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${openSections.police ? "rotate-180" : ""}`}
                      size={28}
                    />
                  </div>

                  <div
                    className={`px-6 pb-6 pt-2 border-t border-gray-100 ${openSections.police ? "block" : "hidden"}`}
                  >
                    <div className="text-gray-600 mb-6 mt-2 space-y-4">
                      <p>
                        In some situations, large tourist groups may benefit
                        from official traffic police escort — when moving
                        several vehicles together through busy routes. This page
                        explains when and how JVTO can help coordinate{" "}
                        <strong>legal, documented</strong> escort services.
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* 8.1 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.1
                          </span>
                          When Escort May Be Considered
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            Official traffic police escort may be relevant for:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>school or university groups,</li>
                            <li>incentive or corporate groups,</li>
                            <li>
                              other large groups traveling in multiple vehicles.
                            </li>
                          </ul>
                          <p>Typical segments include:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              connections from major road exits or meeting
                              points to partner accommodations,
                            </li>
                            <li>
                              specific routes agreed in advance with the traffic
                              police.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 8.2 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.2
                          </span>
                          How Escort Is Arranged
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            JVTO does <strong>not</strong> provide escort
                            vehicles ourselves. Instead:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              We submit a formal request to the competent{" "}
                              <strong>Traffic Police</strong> unit,
                            </li>
                            <li>
                              Escort is approved or declined according to
                              regulations, availability, and clear route
                              definitions,
                            </li>
                            <li>
                              When approved, the escort is carried out by{" "}
                              <strong>uniformed traffic police</strong> in
                              official vehicles, based on written orders.
                            </li>
                          </ul>
                          <p>
                            All arrangements are done transparently and in line
                            with Indonesian law.
                          </p>
                        </div>
                      </div>

                      {/* 8.3 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.3
                          </span>
                          What Escort Is Not
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>Police escort:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              is <strong>not</strong> automatic for all tours,
                            </li>
                            <li>
                              is <strong>not</strong> a guarantee of special
                              treatment everywhere,
                            </li>
                            <li>
                              is <strong>not</strong> a tool to ignore speed
                              limits or basic road rules.
                            </li>
                          </ul>
                          <p>
                            Its purpose is safe and orderly convoy movement for
                            qualifying groups, not to bypass public safety.
                          </p>
                        </div>
                      </div>

                      {/* 8.4 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.4
                          </span>
                          Costs & Confirmation
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              If your group is eligible and escort is approved,
                              any related costs will be clearly listed in your
                              program and invoice.
                            </li>
                            <li>
                              No unofficial payments are requested from guests
                              on the road.
                            </li>
                            <li>
                              If escort is not available or not approved, we
                              will inform you and operate the tour using
                              standard safe convoy procedures.
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* 8.5 */}
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                          <span className="bg-[#9fce33] text-white text-sm font-bold px-2 py-1 rounded">
                            8.5
                          </span>
                          How to Request Escort Consideration
                        </h3>
                        <div className="text-gray-600 space-y-3 ml-8">
                          <p>
                            If you are planning a large group program and wish
                            to explore the possibility of official escort:
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Inform us of your group size, vehicle count, and
                              route.
                            </li>
                            <li>
                              We will advise whether escort is realistic and
                              what information we need to submit a request.
                            </li>
                            <li>
                              Final decision always rests with the relevant
                              authorities.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelGuideContent;
