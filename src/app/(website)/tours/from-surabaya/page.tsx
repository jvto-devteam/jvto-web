// src/app/(website)/tours/from-surabaya/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/tours/from-surabaya.json). Evergreen narrative, SEO, canonical,
// and the FAQ come from content/; the PACKAGE LIST stays DYNAMIC
// (getPublicPackageList, the DB-derived package snapshot) exactly as before —
// content/ never carries a package, a price, or a package count.
import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
import Link from "@/components/website/AppLink";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicPackageList } from "@/lib/publicContent/packageListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/jsonld/builders";
import { buildToursHubAggregateRatingSchema } from "@/lib/schemas/buildToursHubSchemas";
import { loadStaticPage, staticRouteCanonical } from "@/lib/static-content";
import {
  HubFaqSection,
  buildHubFaqSchema,
  hubGrid,
  hubGridItem,
  hubProse,
} from "../hubContent";
import { formatIDR } from "@/utils/formatting";
import { ArrowRight, Shield, Users, FileText, Award, Check } from "lucide-react";

export const revalidate = 3600;

const ROUTE = "/tours/from-surabaya";

const DISPLAY_FONT = { fontFamily: "Raleway, Inter, sans-serif" };

/** Content-owned copy → the icons that render it (icons stay presentational). */
const WHY_ICONS = { shield: Shield, users: Users, "file-text": FileText, award: Award } as const;

type Inclusion = { label: string; detail: string };
type Exclusion = { label: string };
type Callout = { key: string; lead: string; body: string };
type WhyItem = { icon: keyof typeof WHY_ICONS; title: string; body: string };
type Signal = { signal: string; source: string };
type BookingStep = { step: string; title: string; text: string };
type Term = { k: string; v: string };
type Note = { key: string; lead: string; body: string; linkHref?: string; linkLabel?: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

async function getToursFromSurabaya(): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: 4, categoryId: 1 });
}

export default async function ToursPageSurabaya() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const [initialTours, org] = await Promise.all([
    getToursFromSurabaya(),
    getOrganizationProfile(),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-surabaya`;
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const pageTitle = page.meta.browserTitle ?? page.meta.title;
  const pageDescription = page.meta.description;

  // Content-owned narrative (evergreen). Package data is never sourced from here.
  const whySurabayaProse = hubProse(page, "why-surabaya");
  const packagesIntro = hubProse(page, "packages-intro");
  const inclusions = hubGrid<Inclusion>(page, "whats-included", "inclusions");
  const exclusions = hubGrid<Exclusion>(page, "whats-included", "exclusions");
  const writtenNote = hubGridItem<Callout>(page, "whats-included", "callouts", "written");
  const whyItems = hubGrid<WhyItem>(page, "why-jvto", "why");
  const checkUsSignals = hubGrid<Signal>(page, "check-us", "signals");
  const checkUsProse = hubProse(page, "check-us");
  const bookingSteps = hubGrid<BookingStep>(page, "book-direct", "steps");
  const bookingTerms = hubGrid<Term>(page, "book-direct", "terms");
  const bookingNotes = hubGrid<Note>(page, "book-direct", "notes");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#collection` },
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: page.meta.title,
        description: pageDescription,
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tours From Surabaya", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: page.meta.title,
        numberOfItems: initialTours.length,
        itemListElement: initialTours.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/${tour.slug}`,
          name: tour.name,
        })),
      },
    ],
  };

  // Exactly ONE FAQPage node, built from the same page.faq array the visible
  // Q&A block renders (AD-08).
  const faqItems = page.faq ?? [];
  const hubFaqSchema = faqItems.length ? buildHubFaqSchema(ROUTE, faqItems) : null;
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: "from-surabaya" });

  const days = initialTours.map((t) => t.duration.day);
  const durationRange = days.length > 0
    ? (Math.min(...days) === Math.max(...days) ? `${Math.min(...days)} days` : `${Math.min(...days)}–${Math.max(...days)} days`)
    : "—";
  const startingFrom = initialTours.length > 0 ? Math.min(...initialTours.map((t) => t.startFrom)) : 0;

  return (
    <>
      <StructuredData data={schema} />
      {hubFaqSchema && <StructuredData data={hubFaqSchema} />}
      <StructuredData data={hubAggregateRatingSchema} />

      {/* ── 1. HERO ───────────────────────────────────── */}
      <section className="bg-jvto-navy text-white pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-jvto-lime) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime">
                  Departure hub · Surabaya
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 max-w-3xl"
                style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
              >
                Tours from <em className="text-jvto-orange not-italic italic">Surabaya.</em>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-light">
                {page.lede?.[0]}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {["NIB 1102230032918", "Trustpilot 4.8/5 · 51 reviews", "Founded 2015"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 uppercase tracking-[0.1em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#packages"
                  prefetch={false}
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  Browse {initialTours.length} Packages
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify-jvto"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
                >
                  Verify JVTO
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-1">
              {[
                ["Hub", "Surabaya"],
                ["Private packages", String(initialTours.length)],
                ["Duration range", durationRange],
                ["From / person", formatIDR(startingFrom)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3.5 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65"
                >
                  <span>{label}</span>
                  <strong className="text-white font-semibold normal-case tracking-normal text-sm">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHY START FROM SURABAYA ─────────────────── */}
      <section className="bg-jvto-off py-20 md:py-24 rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-32px_80px_-36px_rgba(13,27,42,0.10)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 01</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Why start from <em className="text-jvto-orange not-italic">Surabaya?</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Hub overview</span>
          </div>
          <div className="max-w-[70ch] space-y-5">
            {whySurabayaProse.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-jvto-muted text-base md:text-lg leading-relaxed font-light">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PACKAGES ───────────────────────────────── */}
      <section id="packages" className="bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 02</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              {initialTours.length} private tours <em className="text-jvto-orange not-italic">from Surabaya.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">{durationRange}</span>
          </div>
          {packagesIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-jvto-muted text-sm md:text-base max-w-2xl leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <ToursPageClient
          initialTours={initialTours}
          destinationName="Surabaya"
          title={page.meta.title}
          description={pageDescription}
          hideHeader
        />
      </section>

      {/* ── 4. WHAT'S INCLUDED ────────────────────────── */}
      <section className="bg-jvto-off py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 03</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Every package <em className="text-jvto-orange not-italic">includes — in writing.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">No surprise local payments</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ul className="space-y-4">
              {inclusions.map((item) => (
                <li key={item.label} className="grid grid-cols-[22px_1fr] gap-4 items-start">
                  <Check className="w-5 h-5 text-jvto-lime mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm text-jvto-navy leading-relaxed">
                    <strong className="font-semibold">{item.label}.</strong>{" "}
                    <span className="text-jvto-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div>
              <div className="bg-white border border-jvto-border rounded-[24px] p-8">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-muted mb-4">Not included</span>
                <ul className="flex flex-wrap gap-2.5">
                  {exclusions.map((x) => (
                    <li key={x.label} className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-jvto-muted border border-jvto-border rounded-full px-3.5 py-2 bg-jvto-off">
                      {x.label}
                    </li>
                  ))}
                </ul>
              </div>
              {writtenNote && (
                <div className="mt-5 border border-jvto-lime/50 rounded-[16px] p-5 bg-jvto-lime/[0.07] text-sm text-jvto-navy leading-relaxed">
                  <strong className="font-bold">{writtenNote.lead}</strong> {writtenNote.body}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WHY JVTO ───────────────────────────────── */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-jvto-muted/70">§ 04</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              The facts behind <em className="text-jvto-orange not-italic">the booking.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Why JVTO</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyItems.map((item) => {
              const Icon = WHY_ICONS[item.icon] ?? Shield;
              return (
                <div key={item.title} className="bg-jvto-off border border-jvto-border rounded-[24px] p-8 card-jvto">
                  <Icon className="w-6 h-6 text-jvto-orange mb-4" strokeWidth={1.5} />
                  <h3 className="text-xl font-black text-jvto-navy mb-3" style={DISPLAY_FONT}>{item.title}</h3>
                  <p className="text-sm text-jvto-muted leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. CHECK US BEFORE YOU BOOK ───────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">§ 05</span>
            <h2
              className="text-3xl md:text-5xl font-black leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Check us <em className="text-jvto-orange not-italic">before you book.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Independent signals</span>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 bg-white/[0.04]">Signal</th>
                  <th className="text-left p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 bg-white/[0.04]">Source</th>
                </tr>
              </thead>
              <tbody>
                {checkUsSignals.map((row) => (
                  <tr key={row.signal} className="border-t border-white/10">
                    <td className="p-5 font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-white">{row.signal}</td>
                    <td className="p-5 text-white/60">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {checkUsProse.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-white/50 text-[13px] max-w-[70ch] mt-6 leading-relaxed font-light">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* ── 7. BOOKING CTA ────────────────────────────── */}
      <section className="py-20 md:py-24 bg-jvto-off">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 06</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Book direct — <em className="text-jvto-orange not-italic">no agency fees.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Four steps</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ol className="space-y-0">
              {bookingSteps.map(({ step, title, text }) => (
                <li key={step} className="grid grid-cols-[auto_1fr] gap-6 items-start py-6 border-b border-jvto-border last:border-0">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-jvto-orange pt-1">{step}</span>
                  <div>
                    <h4 className="text-xl font-black text-jvto-navy mb-1" style={DISPLAY_FONT}>{title}</h4>
                    <p className="text-jvto-muted text-sm font-light leading-relaxed">{text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white border border-jvto-border rounded-[24px] p-9">
                {bookingTerms.map(({ k, v }) => (
                  <div key={k}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-muted mb-1">{k}</div>
                    <div className="text-jvto-navy font-semibold text-sm leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
              {bookingNotes.map((note, index) => (
                <div
                  key={note.key}
                  className={`${index === 0 ? "mt-5" : "mt-4"} border border-jvto-border rounded-[16px] p-5 bg-white text-sm text-jvto-navy leading-relaxed`}
                >
                  <strong className="font-bold">{note.lead}</strong> {note.body}
                  {note.linkHref && note.linkLabel && (
                    <>
                      {" "}
                      <Link href={note.linkHref} prefetch={false} className="text-jvto-orange font-semibold hover:underline">
                        {note.linkLabel}
                      </Link>
                    </>
                  )}
                </div>
              ))}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/6282244788833"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  WhatsApp Us
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/tours"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-jvto-navy/30 text-jvto-navy px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-navy hover:text-white transition-colors"
                >
                  Browse All Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. COMMON QUESTIONS (content/ FAQ — same array as the FAQPage node) ── */}
      <HubFaqSection eyebrow="§ 07" items={faqItems} />

      {/* ── 9. CTA ─────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-24 text-center rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-40px_90px_-40px_rgba(0,0,0,0.45)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="text-4xl md:text-6xl font-black leading-tight mb-10"
            style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
          >
            Plan your <em className="text-jvto-orange not-italic">trip from Surabaya.</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/6282244788833"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvto-orange text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              Contact the team
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
            >
              View all routes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
