// src/app/(website)/policy/page.tsx
// PACKAGE 03 (2026-08-04): the hub's meta/SEO comes from content/pages/policy/index.md
// (static-content SSOT); the card layout below is navigational chrome and stays TSX.
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Sidebar from "./sidebar";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildPolicyHubItemListSchema } from "@/lib/schemas/buildPolicySchemas";
import { loadStaticPage } from "@/lib/static-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage("/policy");
  if (!page || page.meta.status !== "published") {
    return { title: "JVTO Policies | Booking, Privacy & Inclusions" };
  }
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  };
}
export default async function PolicyHubPage() {
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
        "48-hour cancellation cut-off for package credit",
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
  const page = loadStaticPage("/policy");
  if (!page || page.meta.status !== "published") return notFound();
  const h1 = page.meta.title;
  const policyHubExtraSchemas = [buildPolicyHubItemListSchema()].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined
        pageRow={{
          route: "/policy",
          lang: "en",
          seo: {
            title: page.meta.browserTitle ?? page.meta.title,
            description: page.meta.description,
          },
          content: { h1: page.meta.title },
        }}
        extraSchemas={policyHubExtraSchemas}
        suppressCmsFaq
      />

      <main className="flex-1 pt-24 md:pt-36 pb-20">
        {/* Header */}
        <section className="bg-jvto-navy text-white pb-12 pt-8 md:pt-12">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-white/50">
              <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white/80">Policy</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime mb-5">
              Policy Hub · 3 published
            </span>

            {/* Title */}
            <div className="mb-10">
              <h1
                className="font-black text-3xl md:text-5xl mb-4 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {h1}
              </h1>
              <p className="text-white/70 max-w-3xl">
                This page is a navigation hub. For binding terms, open the
                relevant policy below and refer to your booking-specific
                documents (Official E-Voucher / Invoice).
              </p>
            </div>

            {/* Notice: precedence + contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/15 p-4 text-left rounded-lg backdrop-blur-sm">
                <p className="text-sm italic mb-2 text-white/60">
                  Document precedence (if anything differs):
                </p>
                <p className="font-semibold text-white mb-2">
                  Order of authority:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-white/70">
                  <li>
                    Your Official E‑Voucher / Invoice (for your confirmed
                    booking)
                  </li>
                  <li>Booking, Payment & Cancellation Policy</li>
                  <li>Inclusions & Exclusions Policy</li>
                  <li>Official Booking Guide (How to Book)</li>
                </ol>
              </div>

              <div className="bg-white/5 border border-white/15 p-4 text-left rounded-lg backdrop-blur-sm">
                <p className="font-semibold text-white mb-2">
                  Need help? Contact JVTO:
                </p>
                <p className="text-sm text-white/70 mb-2">
                  <strong className="text-white">WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/6282244788833"
                    className="text-jvto-lime hover:underline"
                  >
                    +62 822-4478-8833
                  </a>
                </p>
                <p className="text-sm text-white/70">
                  <strong className="text-white">Email:</strong>{" "}
                  <a
                    href="mailto:hello@javavolcano-touroperator.com"
                    className="text-jvto-lime hover:underline"
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
                  className={`rounded-sm border shadow-sm overflow-hidden bg-card hover:shadow-md transition-shadow duration-300`}
                >
                  <div className={`p-5 ${card.accent}`}>
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
                      prefetch={false}
                      className="inline-flex items-center justify-center w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
