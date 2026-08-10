// src/app/(website)/page.tsx
//
// MILESTONE 2 (2026-08-09): the homepage is served from the static-content SSOT
// (content/pages/home/index.json + content/faqs/home.json). Title, browser title,
// description, the H1, the production canonical, and the FAQ all read from content/;
// this file keeps layout + the JSON-LD projection of that content.
//
// DYNAMIC DATA IS UNCHANGED: the Surabaya/Bali package lists, the destination list,
// the Elfsight review embed, and the aggregate-rating node still come from their own
// runtime sources (getWebPackagesList / getWebDestinationsList / jvtoReviews). No
// package, price, or availability data is migrated into content/.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeHero from "@/components/website/Home/HomeHero";
import HomeVerifyBar from "@/components/website/Home/HomeVerifyBar";
import HomeTrustStrip from "@/components/website/Home/HomeTrustStrip";
import HomeTours from "@/components/website/Home/HomeTours";
import HomeFounder from "@/components/website/Home/HomeFounder";
import HomeConfidence from "@/components/website/Home/HomeConfidence";
import HomeFeatureCarousel from "@/components/website/Home/HomeFeatureCarousel";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import HomeHealthRail from "@/components/website/Home/HomeHealthRail";
import HomeVolcanoStatus from "@/components/website/Home/HomeVolcanoStatus";
import HomeTravelGuideTeaser from "@/components/website/Home/HomeTravelGuideTeaser";
import HomeOurStory from "@/components/website/Home/HomeOurStory";
import Link from "@/components/website/AppLink";
import Script from "next/script";
import HomePartners from "@/components/website/Home/HomePartners";
import { GoogleReviewsCarousel } from "@/components/website/Home/GoogleReviewsCarousel";
import HomeFAQ from "@/components/website/Home/HomeFAQ";
import HomeCTA from "@/components/website/Home/HomeCTA";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
import { getWebDestinationsList } from "@/lib/destinations/getWebDestinationsList";
import { getAllVolcanicStatus } from "@/lib/ops/getVolcanicStatus";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import {
  loadStaticPage,
  staticRouteCanonical,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/static-content";
import {
  BBKSDA_REGULATION_SCHEMA,
  DEFINED_TERMS,
  DOCTOR_SCHEMA,
  FOUNDER_SCHEMA,
} from "@/lib/schemas/entityGraph";

// Spec "Iconic landscapes" order (docs/design-reference/homepage.html §05) —
// filtered/ordered explicitly by slug so DB row order never reshuffles the
// intended reading order.
const LANDSCAPE_SLUG_ORDER = [
  "mount-bromo",
  "ijen-crater",
  "tumpak-sewu-waterfall",
  "madakaripura-waterfall",
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE;
const ROUTE = "/";
export const revalidate = 3600;

// ─── Content access helpers (throw at build so missing copy fails SSG rather
//     than silently rendering an empty section — parity with the hubs). ───
type HomeSection = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): HomeSection {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `homepage: required section "${id}" missing from content/pages/home/index.json`,
    );
  }
  return sec;
}

function sectionText(sec: HomeSection, key: string): string {
  const v = (sec as Record<string, unknown>)[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`homepage: section "${sec.id}" is missing text field "${key}"`);
  }
  return v;
}

function gridItems<T>(sec: HomeSection, role: string): T[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as Record<string, unknown>).role === role,
  );
  if (!block) {
    throw new Error(
      `homepage: section "${sec.id}" is missing its grid block (role="${role}")`,
    );
  }
  return (block as { items: unknown[] }).items as T[];
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs from content/. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };

  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: staticRouteCanonical(ROUTE),
    },
  };
}

const Home = async () => {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const [surabayaTours, baliTours, destinations] = await Promise.all([
    getWebPackagesList({ fromId: 4, limit: 4 }),
    getWebPackagesList({ fromId: 3, limit: 4 }),
    getWebDestinationsList(),
  ]);
  const volcanicStatus = getAllVolcanicStatus();

  const landscapeDestinations = LANDSCAPE_SLUG_ORDER
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const serviceNode = {
    "@type": "Service",
    "@id": `${SITE_URL}/why-jvto#tourService`,
    name: "Private Volcano Tour Operations (Mount Bromo & Mount Ijen)",
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: [
      "Private tour",
      "Volcano tour",
      "Tour guiding service",
      "Travel agency service",
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "East Java" },
      { "@type": "Country", name: "Indonesia" },
    ],
    description:
      "Standardized private operations for active-volcano environments, with disciplined risk protocols, own crew execution (not outsourced), and pre-ascent health screening for Mount Ijen when applicable.",
    termsOfService: `${SITE_URL}/verify-jvto`,
  };

  // FAQ from content/ (content/faqs/home.json) — the SAME array feeds the visible
  // HomeFAQ accordion and the single FAQPage node (AD-08), so HTML and structured
  // data can never diverge.
  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${PRODUCTION_ORIGIN}/#faq`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const aggregateRatingNode = buildHomepageAggregateRatingSchema();

  const healthAppNode = {
    "@type": "WebApplication",
    "@id": "https://health.mountijen.com/#app",
    name: "Mount Ijen Digital Health Screening",
    alternateName: "Ijen Health Screening",
    url: "https://health.mountijen.com/",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: [
      { "@type": "Thing", name: "Pre-ascent health screening (SpO₂ & Blood Pressure)" },
      { "@type": "Place", name: "Mount Ijen" },
    ],
    featureList: [
      "Digital recording of SpO₂ and blood pressure",
      "Supports go/no-go safety decisions",
    ],
    inLanguage: "en",
    usageInfo:
      "Operational safety screening only. Does not replace medical diagnosis or treatment.",
  };

  // Reviews section copy — evergreen narrative from content/pages/home/index.json.
  // (The review WIDGET itself stays dynamic: Elfsight renders the live feed.)
  const reviews = requireSection(page, "reviews-signal");
  const platformLines = gridItems<{ key: string; text: string; accent?: boolean }>(
    reviews,
    "platform-lines",
  );

  return (
    <div>
      <PageJsonLdCombined
        pageRow={staticPageRow(page) as any}
        extraSchemas={[
          FOUNDER_SCHEMA,
          DOCTOR_SCHEMA,
          BBKSDA_REGULATION_SCHEMA,
          ...Object.values(DEFINED_TERMS),
          serviceNode,
          healthAppNode,
          aggregateRatingNode,
          faqNode,
        ].filter(Boolean)}
        suppressCmsFaq
      />

      <HomeHero title={page.meta.title} description={page.meta.description} />
      <HomeVerifyBar />
      <HomeTrustStrip />
      <HomeTours surabayaPackages={surabayaTours} baliPackages={baliTours} />
      <HomeConfidence />
      <HomeFeatureCarousel />
      <HomeFounder />
      <HomeDestinations destinations={landscapeDestinations} />
      <HomeHealthRail />
      <HomeVolcanoStatus statusData={volcanicStatus} />

      {/* Reviews — Elfsight live Google Reviews embed (S4 stitch from production).
          PKG-11a restyled the surrounding frame only: the <Script> src/strategy
          and the Elfsight mount div (class + data-elfsight-app-lazy) are byte-
          identical, and every string still comes from the `reviews` section of
          content/pages/home/index.json via sectionText()/gridItems(). */}
      <Section surface="navy" labelledBy="reviews-heading">
        <SectionHeading
          id="reviews-heading"
          eyebrow={sectionText(reviews, "eyebrow")}
          tone="dark"
          titleClassName="md:max-w-2xl"
          title={platformLines.map((line, i) => (
            <span key={line.key}>
              {line.accent ? (
                <em className="text-jvto-orange not-italic">{line.text}</em>
              ) : (
                line.text
              )}{" "}
              {i < platformLines.length - 1 ? <br /> : null}
            </span>
          ))}
          className="mb-10"
        />

        <p className="mb-12 text-sm leading-relaxed text-jvto-on-navy md:max-w-xl md:text-base">
          {sectionText(reviews, "body_text")}
        </p>

        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />
        <div
          className="elfsight-app-3c356457-8eca-453f-a7e4-055cc0d125c6"
          data-elfsight-app-lazy
        />

        {/* Production-release hardening §3.1: Google review-media carousel,
            ported from `live`. Renders nothing when there are no qualifying
            reviews yet (its own empty state), so it never shows a broken or
            half-loaded block. No new heading/ordinal -- this continues the
            same reviews narrative the section above already established. */}
        <div className="mt-12">
          <GoogleReviewsCarousel />
        </div>

        <div className="mt-10">
          <Link
            href={sectionText(reviews, "link_href")}
            className="jvto-focus-dark rounded-sm text-sm font-bold text-jvto-on-navy transition-colors hover:text-white"
          >
            {sectionText(reviews, "link_label")} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Section>

      <HomePartners />
      {/* PKG-11a composition fix: the travel-guide teaser labels itself "§ 08"
          and the FAQ "§ 09", but the teaser used to render AFTER the FAQ, so the
          page's own section numbering ran 09 → 08 → 10. Swapping the two render
          positions restores a monotonic 02…10 without touching a single string,
          and reads better besides (rulebook → questions → who we are → act). */}
      <HomeTravelGuideTeaser />
      <HomeFAQ items={faqItems} />
      <HomeOurStory />
      <HomeCTA />
    </div>
  );
};

export default Home;
