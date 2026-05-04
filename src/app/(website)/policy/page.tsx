// src/app/(website)/policy/page.tsx
import Link from "next/link";
import { type Metadata } from "next";
import Sidebar from "./sidebar";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { Faq } from "@/components/content/Faq";
import { buildPolicyHubItemListSchema } from "@/lib/schemas/buildPolicySchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage(`/policy`, "en");

  if (!row) {
    return {
      title: "Page Not Found",
    };
  }

  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = (row.content as Record<string, any> | null) ?? {};

  return {
    title: seo.title ?? content.h1 ?? row.route,
    description: seo.description ?? undefined,
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
  const row = await getContentPage(`/policy`, "en");
  if (!row) {
    return null;
  }
  const seo = (row.seo as Record<string, any> | null) ?? {};
  const content = row.content as any;
  const h1 = content?.h1 ?? seo.title ?? "JVTO Policies";
  // Phase 5 (2026-04-29): canonical hub Q&A via resolver + ItemList of 3 sub-pages.
  // /policy has 0 narrative_claims wired → falls through to CMS fallback (no override).
  // Per cluster_role_contracts.md Cluster 6 hub MH.
  const faqResolution = await resolveFaqsForPage("/policy");
  const policyHubExtraSchemas = [
    buildPolicyHubItemListSchema(),
    buildResolvedFaqSchema(faqResolution, "/policy"),
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined
        pageRow={{
          route: row.route,
          lang: row.lang,
          seo: row.seo,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }}
        extraSchemas={policyHubExtraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

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
                {h1}
              </h1>
              <p className="text-muted-foreground max-w-3xl">
                This page is a navigation hub. For binding terms, open the
                relevant policy below and refer to your booking-specific
                documents (Official E-Voucher / Invoice).
              </p>
            </div>

            {/* Notice: precedence + contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 text-left rounded-sm">
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

              <div className="bg-blue-50 border border-blue-200 p-4 text-left rounded-sm">
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
                      className="inline-flex items-center justify-center w-full rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      {card.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {content?.faq && (
              <Faq items={content?.faq} title={content?.faq_title ?? "FAQ"} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
