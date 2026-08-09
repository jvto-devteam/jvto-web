// src/app/(website)/tours/from-surabaya/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/tours/from-surabaya.json). Evergreen narrative, SEO, canonical,
// and the FAQ come from content/; the PACKAGE LIST stays DYNAMIC
// (getPublicPackageList, the DB-derived package snapshot) exactly as before —
// content/ never carries a package, a price, or a package count.
//
// PKG-11b (visual layer): this is a DEPARTURE route, not the hub. No hub fork;
// it opens on the hub-overview narrative and its hero ledger states the hub,
// the package count, the duration range and the entry price. This record has no
// ferry/end-point callout — the § 01 narrative therefore runs as a single
// full-measure column, a visibly different silhouette from /tours/from-bali's
// prose + crossing-callout pair. Everything below the package grid is the
// shared hub funnel from ../hubContent.
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

export const revalidate = 3600;

const ROUTE = "/tours/from-surabaya";

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
  const inclusions = hubGrid<HubInclusion>(page, "whats-included", "inclusions");
  const exclusions = hubGrid<HubExclusion>(page, "whats-included", "exclusions");
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

      {/* ── HERO ──────────────────────────────────────── */}
      <HubHero
        id="tours-surabaya-h1"
        eyebrow="Departure hub · Surabaya"
        title={
          <>
            Tours from <span className="text-jvto-orange">Surabaya.</span>
          </>
        }
        lede={page.lede?.[0] ?? ""}
        credentials={HUB_CREDENTIALS}
        actions={[
          { href: "#packages", label: `Browse ${initialTours.length} Packages` },
          { href: "/verify-jvto", label: "Verify JVTO" },
        ]}
        ledger={[
          ["Hub", "Surabaya"],
          ["Private packages", String(initialTours.length)],
          ["Duration range", durationRange],
          ["From / person", formatIDR(startingFrom)],
        ]}
      />

      {/* ── 1. WHY START FROM SURABAYA ─────────────────── */}
      <Section surface="light" labelledBy="why-surabaya-heading">
        <SectionHeading
          id="why-surabaya-heading"
          eyebrow="§ 01"
          title={
            <>
              Why start from{" "}
              <span className="text-jvto-orange">Surabaya?</span>
            </>
          }
          aside="Hub overview"
        />

        <HubProse paragraphs={whySurabayaProse} />
      </Section>

      {/* ── 2. PACKAGES ───────────────────────────────── */}
      <Section
        surface="off"
        id="packages"
        labelledBy="surabaya-packages-heading"
        className="scroll-mt-24 md:scroll-mt-32"
      >
        <SectionHeading
          id="surabaya-packages-heading"
          eyebrow="§ 02"
          title={
            <>
              {initialTours.length} private tours{" "}
              <span className="text-jvto-orange">from Surabaya.</span>
            </>
          }
          aside={durationRange}
          className="mb-8 md:mb-10"
        />

        <HubProse paragraphs={packagesIntro} className="mb-10 md:mb-12" />

        <ToursPageClient initialTours={initialTours} />
      </Section>

      {/* ── 3. WHAT'S INCLUDED ────────────────────────── */}
      <HubInclusions
        eyebrow="§ 03"
        headingId="surabaya-included-heading"
        title={
          <>
            Every package{" "}
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
        headingId="surabaya-why-heading"
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
        headingId="surabaya-signals-heading"
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
        headingId="surabaya-book-heading"
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
        headingId="surabaya-cta-heading"
        title={
          <>
            Plan your{" "}
            <span className="text-jvto-orange">trip from Surabaya.</span>
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
