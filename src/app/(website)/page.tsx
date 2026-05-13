// app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import Hero from "@/components/website/Home/Hero";
import Differentiators from "@/components/website/Home/Differentiators";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import Reviews from "@/components/website/Home/Reviews";
import TrustVerification from "@/components/website/Home/TrustVerification";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import HomeCTA from "@/components/website/Home/HomeCTA";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
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
  return getPublicDestinationList();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  const [seo, destinations] = await Promise.all([
    getPageSeo("/", fallbackSeo),
    getDestinations(),
  ]);

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
  const aggregateRatingNode = buildHomepageAggregateRatingSchema();

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

      {/* 4. Tour Packages */}
      <FeaturedTours />

      {/* 5. Reviews */}
      <div className="bg-white pt-20 pb-20 border-t border-jvto-border">
        <div className="w-full container mx-auto">
          <div className="max-w-3xl mx-auto px-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-off border border-jvto-border mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-muted">
                Guest Reviews
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-jvto-navy leading-tight mb-3"
              style={{
                fontFamily: "Raleway, Inter, sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              51 reviews on Trustpilot.{" "}
              <span className="text-jvto-orange italic">92 on Google Maps.</span>{" "}
              21 on TripAdvisor.
            </h2>
            <p className="text-jvto-muted text-base">
              Trustpilot rating:{" "}
              <strong className="text-jvto-navy">4.8 / 5</strong> (51 reviews).
              Google Maps: <strong className="text-jvto-navy">4.90 / 5</strong>{" "}
              (92 reviews). TripAdvisor:{" "}
              <strong className="text-jvto-navy">4.95 / 5</strong> (21 reviews).
              All platforms link to live profiles — not screenshots.
            </p>
          </div>
          <Reviews />
        </div>
      </div>

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
