// src/app/(website)/policy/page.tsx
import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "JVTO Policies",
  description:
    "Official JVTO policies: Privacy, Booking/Payment/Cancellation, and Inclusions/Exclusions. Read these documents for binding terms and operational rules.",
  openGraph: {
    title: "JVTO Policies",
    description:
      "Official JVTO policies: Privacy, Booking/Payment/Cancellation, and Inclusions/Exclusions. Read these documents for binding terms and operational rules.",
    url: `${siteUrl}/policy`,
    siteName: "Java Volcano Tour Operator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/assets/img/hero/home.webp",
        width: 1200,
        height: 630,
        alt: "JVTO Policies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JVTO Policies",
    description:
      "Official JVTO policies: Privacy, Booking/Payment/Cancellation, and Inclusions/Exclusions. Read these documents for binding terms and operational rules.",
    images: [siteUrl + "/assets/img/hero/home.webp"],
  },
};

export default function PolicyHubPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://javavolcano-touroperator.com/#website",
        url: "https://javavolcano-touroperator.com",
        name: "Java Volcano Tour Operator",
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": "https://javavolcano-touroperator.com/policy#webpage",
        url: "https://javavolcano-touroperator.com/policy",
        name: "JVTO Policies",
        description:
          "Official JVTO policies: Privacy, Booking/Payment/Cancellation, and Inclusions/Exclusions.",
        inLanguage: "en",
        isPartOf: {
          "@id": "https://javavolcano-touroperator.com/#website",
        },
        breadcrumb: {
          "@id": "https://javavolcano-touroperator.com/policy#breadcrumb",
        },
        hasPart: [
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/policy/privacy#webpage",
            url: "https://javavolcano-touroperator.com/policy/privacy",
            name: "Privacy Policy",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/policy/booking-payment-cancellation#webpage",
            url: "https://javavolcano-touroperator.com/policy/booking-payment-cancellation",
            name: "Booking, Payment & Cancellation Policy",
          },
          {
            "@type": "WebPage",
            "@id":
              "https://javavolcano-touroperator.com/policy/inclusions-exclusions#webpage",
            url: "https://javavolcano-touroperator.com/policy/inclusions-exclusions",
            name: "Inclusions & Exclusions Policy",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://javavolcano-touroperator.com/policy#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Policy",
            item: "https://javavolcano-touroperator.com/policy",
          },
        ],
      },
    ],
  };

  const policyCards = [
    {
      id: "privacy",
      title: "Privacy Policy",
      desc: "Explains what personal data JVTO collects, why it is collected, how it is used, and when it may be shared to operate your tour booking and comply with applicable requirements.",
      bullets: [
        "Data collection categories for booking operations",
        "When and why data is shared with partners",
        "Payment security and data protection measures",
      ],
      href: "/policy/privacy",
      cta: "Read Privacy Policy",
      accent: "border-blue-400 bg-blue-50",
      lastUpdated: "17 January 2026",
    },
    {
      id: "booking-payment-cancellation",
      title: "Booking, Payment & Cancellation Policy",
      desc: "Defines how bookings become confirmed, payment rules, cancellation policy with 48-hour cut-off, and operational terms for JVTO private tours.",
      bullets: [
        "20% deposit requirement and payment deadlines",
        "48-hour cancellation cut-off for travel credit",
        "Force majeure and operational adjustments",
      ],
      href: "/policy/booking-payment-cancellation",
      cta: "Read Booking Policy",
      accent: "border-yellow-400 bg-yellow-50",
      lastUpdated: "17 January 2026",
    },
    {
      id: "inclusions-exclusions",
      title: "Inclusions & Exclusions Policy",
      desc: "Clarifies what is included vs not included in JVTO private tour packages using the 'Write-it-to-bind-it' principle for contractual inclusions.",
      bullets: [
        "Standard inclusions (transport, accommodation, crew)",
        "Conditional inclusions (only if written on voucher)",
        "Simple exclusion principle",
      ],
      href: "/policy/inclusions-exclusions",
      cta: "Read Inclusions & Exclusions",
      accent: "border-green-400 bg-green-50",
      lastUpdated: "17 January 2026",
    },
  ] as const;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-1/4 space-y-6">
          <div class="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <div class="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold">
              <span class="material-symbols-outlined text-primary">gavel</span>
              <h2>Policy Index</h2>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 -mt-3">
              Legal Documents
            </p>
            <nav class="space-y-1">
              <a
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-green-50 dark:bg-green-900/20 border-l-4 border-primary rounded-r-md transition"
                href="#"
              >
                <span class="material-symbols-outlined text-primary text-lg">
                  hub
                </span>
                Policy Hub
              </a>
              <a
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
                href="#"
              >
                <span class="material-symbols-outlined text-lg">
                  privacy_tip
                </span>
                Privacy Policy
              </a>
              <a
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
                href="#"
              >
                <span class="material-symbols-outlined text-lg">
                  receipt_long
                </span>
                Booking &amp; Payments
              </a>
              <a
                class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
                href="#"
              >
                <span class="material-symbols-outlined text-lg">list_alt</span>
                Inclusions &amp; Exclusions
              </a>
            </nav>
          </div>
          <div class="bg-gray-900 dark:bg-gray-800 text-white rounded-2xl p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10">
              <span class="material-symbols-outlined text-8xl">
                headset_mic
              </span>
            </div>
            <h3 class="text-lg font-bold mb-2">Need Help?</h3>
            <p class="text-gray-400 text-sm mb-4">
              Our team is available 24/7 for your questions.
            </p>
            <a
              class="inline-flex items-center justify-center w-full bg-primary text-gray-900 font-bold py-2.5 px-4 rounded-lg hover:bg-lime-400 transition"
              href="#"
            >
              <span class="material-symbols-outlined mr-2 text-lg">chat</span>
              Chat on WhatsApp
            </a>
          </div>
        </aside>
        <main class="w-full lg:w-3/4">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
            <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">
              Legal &amp; Policies Hub
            </h1>
            <a
              class="mt-4 md:mt-0 inline-flex items-center justify-center bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:border-primary hover:text-primary transition group"
              href="#"
            >
              <span class="material-symbols-outlined mr-2 text-xl text-red-500 group-hover:text-primary transition-colors">
                picture_as_pdf
              </span>
              Download PDF
            </a>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Transparency is key to a smooth journey. Here you can access all our
            official policies regarding privacy, booking terms, payments,
            cancellations, and exactly what is included in your tour package.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:shadow-md transition flex flex-col h-full">
              <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <span class="material-symbols-outlined text-2xl">
                  privacy_tip
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Privacy Policy
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                We value your privacy. Learn how we collect, use, and protect
                your personal data, from your initial inquiry to the completion
                of your tour. We are committed to GDPR compliance and data
                security.
              </p>
              <a
                class="inline-flex items-center text-primary font-bold text-sm hover:underline mt-auto"
                href="#"
              >
                Read Policy
                <span class="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </a>
            </div>
            <div class="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:shadow-md transition flex flex-col h-full">
              <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <span class="material-symbols-outlined text-2xl">
                  receipt_long
                </span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Booking &amp; Payments
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                Understand our booking process, deposit requirements, payment
                methods, cancellation policies, and refund terms. This policy
                ensures clarity on financial transactions for your peace of
                mind.
              </p>
              <a
                class="inline-flex items-center text-primary font-bold text-sm hover:underline mt-auto"
                href="#"
              >
                Read Policy
                <span class="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </a>
            </div>
            <div class="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:shadow-md transition flex flex-col h-full">
              <div class="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                <span class="material-symbols-outlined text-2xl">list_alt</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Inclusions &amp; Exclusions
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                Avoid surprises by knowing exactly what is covered in your tour
                package. We detail everything from transportation and
                accommodation to entrance fees and meals, as well as what
                remains your responsibility.
              </p>
              <a
                class="inline-flex items-center text-primary font-bold text-sm hover:underline mt-auto"
                href="#"
              >
                Read Policy
                <span class="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </a>
            </div>
            <div class="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:shadow-md transition flex flex-col h-full">
              <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 mb-4">
                <span class="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                General Terms of Service
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                The overarching agreement governing the use of our website and
                services. This document outlines the legal relationship between
                you (the client) and PT Java Volcano Rendezvous.
              </p>
              <a
                class="inline-flex items-center text-primary font-bold text-sm hover:underline mt-auto"
                href="#"
              >
                Read Policy
                <span class="material-symbols-outlined text-sm ml-1">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
          <div class="mt-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-8">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span class="material-symbols-outlined text-3xl">mail</span>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Have specific legal questions?
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  If you cannot find the answer you are looking for in our
                  policy documents, please contact our legal compliance team
                  directly.
                </p>
                <div class="flex flex-wrap gap-4">
                  <a
                    class="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200"
                    href="mailto:legal@javavolcano-touroperator.com"
                  >
                    <span class="material-symbols-outlined text-lg">send</span>
                    legal@javavolcano-touroperator.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
