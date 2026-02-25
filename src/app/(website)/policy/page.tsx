// src/app/(website)/policy/page.tsx
import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";
import Sidebar from "./sidebar";


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
    <div className="flex min-h-screen bg-background">
      <StructuredData data={pageSchema} />
      <Sidebar />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        {/* Header */}
        <section className="bg-accent border-b pb-12">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-4  text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Policy</span>
            </nav>

            {/* Title */}
            <div className=" mb-10">
              <h1 className="font-black text-2xl md:text-5xl mb-4">
                JVTO Policies
              </h1>
              <p className="text-muted-foreground max-w-3xl">
                This page is a navigation hub. For binding terms, open the
                relevant policy below and refer to your booking-specific
                documents (Official E-Voucher / Invoice).
              </p>
            </div>

            {/* Notice: precedence + contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  Document precedence (if anything differs):
                </p>
                <p className="font-semibold text-foreground mb-2">
                  Order of authority:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    Your Official E‑Voucher / Invoice (for your confirmed
                    booking)
                  </li>
                  <li>Booking, Payment & Cancellation Policy</li>
                  <li>Inclusions & Exclusions Policy</li>
                  <li>Official Booking Guide (How to Book)</li>
                </ol>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded-r-lg">
                <p className="font-semibold text-foreground mb-2">
                  Need help? Contact JVTO:
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/6282244788833"
                    className="text-primary hover:underline"
                  >
                    +62 822-4478-8833
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:hello@javavolcano-touroperator.com"
                    className="text-primary hover:underline"
                  >
                    hello@javavolcano-touroperator.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {policyCards.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl border shadow-sm overflow-hidden bg-card hover:shadow-md transition-shadow duration-300`}
                >
                  <div className={`p-5 border-l-4 ${card.accent}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-black text-foreground">
                        {card.title}
                      </h2>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        Updated: {card.lastUpdated}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {card.desc}
                    </p>

                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-5">
                      {card.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <Link
                      href={card.href}
                      className="inline-flex items-center justify-center w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Note */}
            <div className="mt-12 p-4 border border-border rounded-lg bg-accent">
              <h3 className="font-bold text-foreground mb-2">
                Important Note:
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>Write-it-to-Bind-it Principle:</strong> Only inclusions
                explicitly listed on the official JVTO package page and/or your
                Official E-Voucher / Invoice (PDF) are contractually binding. If
                something is not written as included, it is excluded by default.
              </p>
            </div>

            {/* Optional: quick links */}
            <div className="mt-10 text-center text-sm text-muted-foreground">
              Looking for trip operations guidance? Visit{" "}
              <Link
                href="/travel-guide"
                className="text-[var(--color-jvto-green)] hover:underline"
              >
                Travel Guide
              </Link>
              .
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
