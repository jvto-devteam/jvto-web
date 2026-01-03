import Link from "next/link";
import { type Metadata } from "next";
import StructuredData from "@/components/website/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Policies",
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
        name: "Policies",
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
              "https://javavolcano-touroperator.com/policy/booking-cancellation#webpage",
            url: "https://javavolcano-touroperator.com/policy/booking-cancellation",
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
      desc:
        "Explains what data JVTO collects, why it is collected, how it is used/shared, and what rights you have.",
      bullets: [
        "Data collection & usage for bookings and operations",
        "Security and retention approach",
        "Your rights and how to contact JVTO",
      ],
      href: "/policy/privacy",
      cta: "Read Privacy Policy",
      accent: "border-blue-400 bg-blue-50",
    },
    {
      id: "booking-cancellation",
      title: "Booking, Payment & Cancellation Policy",
      desc:
        "Defines how bookings become confirmed, payment rules, cancellation/amendment handling, and what documents are binding.",
      bullets: [
        "Booking confirmation rules and timelines",
        "Payment & deposit handling",
        "Cancellations, amendments, and operational constraints",
      ],
      href: "/policy/booking-cancellation",
      cta: "Read Booking Policy",
      accent: "border-yellow-400 bg-yellow-50",
    },
    {
      id: "inclusions-exclusions",
      title: "Inclusions & Exclusions Policy",
      desc:
        "Clarifies what is included vs not included, and how inclusions are determined for your specific booking.",
      bullets: [
        "What is typically included (and what is not)",
        "Conditional inclusions (must be written on voucher)",
        "Scope boundaries and responsibility lines",
      ],
      href: "/policy/inclusions-exclusions",
      cta: "Read Inclusions & Exclusions",
      accent: "border-green-400 bg-green-50",
    },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData data={pageSchema} />

      <main className="flex-grow pt-24">
        {/* Header */}
        <section className="py-12 md:py-16 bg-accent border-b">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-foreground font-medium">Policy</span>
            </nav>

            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="font-black text-2xl md:text-5xl mb-4">
                Policies
              </h1>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                This page is a navigation hub. For binding terms, open the
                relevant policy below and refer to your booking-specific
                documents (E-Voucher / Invoice / Receipt).
              </p>
            </div>

            {/* Notice: precedence + contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left rounded-r-lg">
                <p className="text-sm italic mb-2">
                  Practical rule:
                </p>
                <p className="font-semibold text-foreground mb-2">
                  If a policy and your booking documents conflict:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    Your booking-specific E-Voucher / Invoice (PDF) is the final
                    reference for that booking.
                  </li>
                  <li>
                    These policies define the standard rules and definitions.
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left rounded-r-lg">
                <p className="font-semibold text-foreground mb-2">
                  Need help?
                </p>
                <p className="text-sm text-muted-foreground">
                  WhatsApp{" "}
                  <a
                    href="https://wa.me/6282244788833"
                    className="text-primary hover:underline"
                  >
                    +62 822-4478-8833
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:hello@javavolcano-touroperator.com"
                    className="text-primary hover:underline"
                  >
                    hello@javavolcano-touroperator.com
                  </a>
                  .
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
                  className={`rounded-2xl border shadow-sm overflow-hidden bg-card`}
                >
                  <div className={`p-5 border-l-4 ${card.accent}`}>
                    <h2 className="text-xl font-black text-foreground mb-2">
                      {card.title}
                    </h2>
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

            {/* Optional: quick links */}
            <div className="mt-10 text-center text-sm text-muted-foreground">
              Looking for trip operations guidance? Visit{" "}
              <Link href="/travel-guide" className="text-primary hover:underline">
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
