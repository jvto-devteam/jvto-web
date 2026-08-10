// src/app/(website)/tours/from-bali/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/tours/from-bali.json). Evergreen narrative, SEO, canonical, and
// the FAQ come from content/; the PACKAGE LIST stays DYNAMIC
// (getPublicPackageList, the DB-derived package snapshot) exactly as before —
// content/ never carries a package, a price, or a package count.
//
// PKG-11b (visual layer): this is a DEPARTURE route, not the hub. It carries no
// hub fork; instead it opens on the crossing that only this route has — the
// Bali→Java ferry — and its hero ledger states the hub, the package count, the
// duration range and the entry price, so the page identifies itself inside one
// screen. The ferry end-point callout used to be rendered TWICE (§ 01 and again
// beside the exclusions); it is now rendered once, in § 01, where it belongs to
// the route narrative. Everything below the package grid is the shared hub
// funnel from ../hubContent, identical to /tours/from-surabaya by design.
//
// No copy was written for this pass.
import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
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
  HUB_CREDENTIALS,
  HubBookDirect,
  HubClosingCta,
  HubFaqSection,
  HubInclusions,
  HubProse,
  HubSignals,
  HubWhyGrid,
  buildHubFaqSchema,
  hubGrid,
  hubGridItem,
  hubProse,
  type HubBookingStep,
  type HubCallout,
  type HubExclusion,
  type HubInclusion,
  type HubNote,
  type HubSignal,
  type HubTerm,
  type HubWhyItem,
} from "../hubContent";
import HubHero from "@/components/design/HubHero";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";
import { formatIDR } from "@/utils/formatting";
import { Ship } from "lucide-react";

export const revalidate = 3600;

const ROUTE = "/tours/from-bali";

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

async function getToursFromBali(): Promise<ListTourPackage[]> {
  return getPublicPackageList({ fromId: 3, categoryId: 1 });
}

export default async function ToursPageBali() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const [initialTours, org] = await Promise.all([getToursFromBali(), getOrganizationProfile()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://javavolcano-touroperator.com";
  const pageUrl = `${siteUrl}/tours/from-bali`;
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const pageTitle = page.meta.browserTitle ?? page.meta.title;
  const pageDescription = page.meta.description;

  // Content-owned narrative (evergreen). Package data is never sourced from here.
  const routeProse = hubProse(page, "the-route");
  const packagesIntro = hubProse(page, "packages-intro");
  const inclusions = hubGrid<HubInclusion>(page, "whats-included", "inclusions");
  const exclusions = hubGrid<HubExclusion>(page, "whats-included", "exclusions");
  const endPointNote = hubGridItem<HubCallout>(page, "whats-included", "callouts", "end-point");
  const writtenNote = hubGridItem<HubCallout>(page, "whats-included", "callouts", "written");
  const whyItems = hubGrid<HubWhyItem>(page, "why-jvto", "why");
  const checkUsSignals = hubGrid<HubSignal>(page, "check-us", "signals");
  const checkUsProse = hubProse(page, "check-us");
  const bookingSteps = hubGrid<HubBookingStep>(page, "book-direct", "steps");
  const bookingTerms = hubGrid<HubTerm>(page, "book-direct", "terms");
  const bookingNotes = hubGrid<HubNote>(page, "book-direct", "notes");

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
          { "@type": "ListItem", position: 2, name: "Tours From Bali", item: pageUrl },
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
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: "from-bali" });

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

      {/* ── HERO ──────────────────────────────────────── */}
      <HubHero
        id="tours-bali-h1"
        eyebrow="Departure hub · Bali"
        title={
          <>
            Tours from <span className="text-jvto-orange">Bali.</span>
          </>
        }
        lede={page.lede?.[0] ?? ""}
        credentials={HUB_CREDENTIALS}
        actions={[
          { href: "#packages", label: `Browse ${initialTours.length} Packages` },
          { href: "/verify-jvto", label: "Verify JVTO" },
        ]}
        ledger={[
          ["Hub", "Bali"],
          ["Private packages", String(initialTours.length)],
          ["Duration range", durationRange],
          ["From / person", formatIDR(startingFrom)],
        ]}
      />

      {/* ── 1. THE ROUTE — the crossing only this departure has ─────────── */}
      <Section surface="light" labelledBy="the-route-heading">
        <SectionHeading
          id="the-route-heading"
          eyebrow="§ 01"
          title={
            <>
              Bali to East Java —{" "}
              <span className="text-jvto-orange">the route.</span>
            </>
          }
          aside="Ferry included"
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <HubProse paragraphs={routeProse} />

          {endPointNote && (
            <div className="relative overflow-hidden rounded-sm border border-jvto-border bg-white p-6 shadow-jvto-soft">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-jvto-orange"
              />
              <Ship
                aria-hidden="true"
                className="mb-4 h-7 w-7 text-jvto-orange"
                strokeWidth={1.5}
              />
              <p className="font-jvto-heading mb-2 text-base font-black text-jvto-navy">
                {endPointNote.lead}
              </p>
              <p className="text-sm leading-relaxed text-jvto-ink-soft">
                {endPointNote.body}
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* ── 2. PACKAGES ───────────────────────────────── */}
      <Section
        surface="off"
        id="packages"
        labelledBy="bali-packages-heading"
        className="scroll-mt-24 md:scroll-mt-32"
      >
        <SectionHeading
          id="bali-packages-heading"
          eyebrow="§ 02"
          title={
            <>
              {initialTours.length} private tours{" "}
              <span className="text-jvto-orange">from Bali.</span>
            </>
          }
          aside="Day-by-day"
          className="mb-8 md:mb-10"
        />

        <HubProse paragraphs={packagesIntro} className="mb-10 md:mb-12" />

        <ToursPageClient initialTours={initialTours} />
      </Section>

      {/* ── 3. WHAT'S INCLUDED ────────────────────────── */}
      <HubInclusions
        eyebrow="§ 03"
        headingId="bali-included-heading"
        title={
          <>
            Every Bali package{" "}
            <span className="text-jvto-orange">includes — in writing.</span>
          </>
        }
        aside="No surprise local payments"
        inclusions={inclusions}
        exclusions={exclusions}
        note={writtenNote}
      />

      {/* ── 4. WHY JVTO ───────────────────────────────── */}
      <HubWhyGrid
        eyebrow="§ 04"
        headingId="bali-why-heading"
        title={
          <>
            The facts behind{" "}
            <span className="text-jvto-orange">the booking.</span>
          </>
        }
        aside="Why JVTO"
        items={whyItems}
      />

      {/* ── 5. CHECK US BEFORE YOU BOOK ───────────────── */}
      <HubSignals
        eyebrow="§ 05"
        headingId="bali-signals-heading"
        title={
          <>
            Check us <span className="text-jvto-orange">before you book.</span>
          </>
        }
        aside="Independent signals"
        signals={checkUsSignals}
        prose={checkUsProse}
      />

      {/* ── 6. BOOK DIRECT ────────────────────────────── */}
      <HubBookDirect
        eyebrow="§ 06"
        headingId="bali-book-heading"
        title={
          <>
            Book direct — <span className="text-jvto-orange">no agency fees.</span>
          </>
        }
        aside="Four steps"
        steps={bookingSteps}
        terms={bookingTerms}
        notes={bookingNotes}
        primaryLabel="WhatsApp Us"
        secondaryLabel="Browse All Tours"
      />

      {/* ── 7. COMMON QUESTIONS (content/ FAQ — same array as the FAQPage node) ── */}
      <HubFaqSection eyebrow="§ 07" items={faqItems} surface="off" />

      {/* ── CLOSING PLATE ─────────────────────────────── */}
      <HubClosingCta
        headingId="bali-cta-heading"
        title={
          <>
            Plan your <span className="text-jvto-orange">trip from Bali.</span>
          </>
        }
        primary={{
          href: "https://wa.me/6282244788833",
          label: "Contact the team",
          external: true,
        }}
        secondary={{ href: "/tours", label: "View all routes" }}
      />
    </>
  );
}
