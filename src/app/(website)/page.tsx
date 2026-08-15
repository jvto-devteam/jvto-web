// app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import Hero from "@/components/website/Home/Hero";
import Differentiators from "@/components/website/Home/Differentiators";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import HomeVolcanoStatus from "@/components/website/Home/HomeVolcanoStatus";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import { GoogleReviewsCarousel } from "@/components/website/Home/GoogleReviewsCarousel";
import TrustVerification from "@/components/website/Home/TrustVerification";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import HomeCTA from "@/components/website/Home/HomeCTA";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getDestinationsForHomepage } from "@/lib/destinations/getWebDestinationsList";
import { getAllVolcanicStatus } from "@/lib/ops/getVolcanicStatus";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { getGoogleReviewStats } from "@/lib/publicContent/getReviewStats";
import {
  BBKSDA_REGULATION_SCHEMA,
  DEFINED_TERMS,
  DOCTOR_SCHEMA,
  FOUNDER_SCHEMA,
} from "@/lib/schemas/entityGraph";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE;
export const revalidate = 3600;

const fallbackSeo = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  h1: "Tourist Police-Led Private Volcano Tours in East Java",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/", fallbackSeo);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: SITE_URL,
    },
  };
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getDestinations(): Promise<Destination[]> {
  return getDestinationsForHomepage();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  const [seo, destinations] = await Promise.all([
    getPageSeo("/", fallbackSeo),
    getDestinations(),
  ]);
  const volcanicStatus = getAllVolcanicStatus();

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

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

  // ── FAQPage schema (AEO — emits JSON-LD even without visual FAQ section) ────
  const faqResolution = await resolveFaqsForPage("/");
  const faqNode = buildResolvedFaqSchema(faqResolution, "/");
  const googleStats = await getGoogleReviewStats();
  const aggregateRatingNode = buildHomepageAggregateRatingSchema(googleStats);

  // ── WebApplication schema (Ijen Health Screening — schema-only, no visual) ─
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
      "QR-based clearance flow",
      "Supports go/no-go safety decisions",
    ],
    inLanguage: "en",
    usageInfo:
      "Operational safety screening only. Does not replace medical diagnosis or treatment.",
  };

  return (
    <div>
      {/* JSON-LD schema injection — AEO/GEO signal layer (no visual output) */}
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          FOUNDER_SCHEMA,
          DOCTOR_SCHEMA,
          BBKSDA_REGULATION_SCHEMA,
          ...Object.values(DEFINED_TERMS),
          serviceNode,
          healthAppNode,
          aggregateRatingNode,
          faqNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      {/* 1. Hero */}
      <Hero title={seo.h1} description={seo.description} />

      {/* 2. WHY JVTO — 6 Differentiators */}
      <Differentiators />

      {/* 3. Destinations */}
      <HomeDestinations destinations={destinations} />

      {/* 3b. Live volcano status (PVMBG/MAGMA feed) */}
      <HomeVolcanoStatus statuses={volcanicStatus} />

      {/* 4. Tour Packages */}
      <FeaturedTours />

      {/* 5. Reviews */}
      <section className="bg-jvto-navy py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Trusted by travelers
                </span>
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 md:max-w-2xl"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
              >
                <em className="text-jvto-orange not-italic">Loved by the travelers.</em>
              </h2>
              <p className="text-white/60 text-sm md:text-base md:max-w-xl leading-relaxed">
                Ratings verified across two independent platforms. Every review links
                to the original profile — browse by guide, by destination, or by trip length
                to find what matters to you.
              </p>
            </div>

            <a
              href="https://www.google.com/maps?cid=1266403973589689021"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-white/90 text-jvto-navy font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] transition-colors self-center md:self-end"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              See all Google reviews
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </a>
          </div>

          <GoogleReviewsCarousel />
        </div>
      </section>

      {/* 6. Trust & Verification */}
      <TrustVerification />

      {/* 7. Our Story */}
      <WhyJVTO />

      {/* 8. CTA */}
      <HomeCTA />
    </div>
  );
};

export default Home;
