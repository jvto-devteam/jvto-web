import type { Metadata } from "next";
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
import HomeFAQ from "@/components/website/Home/HomeFAQ";
import HomeCTA from "@/components/website/Home/HomeCTA";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
import { getWebDestinationsList } from "@/lib/destinations/getWebDestinationsList";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
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
export const revalidate = 3600;

const fallbackSeo = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  h1: "Tourist Police-Led private\nvolcano tours, Java.",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
};

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

const Home = async () => {
  const [seo, surabayaTours, baliTours, destinations] = await Promise.all([
    getPageSeo("/", fallbackSeo),
    getWebPackagesList({ fromId: 4, limit: 4 }),
    getWebPackagesList({ fromId: 3, limit: 4 }),
    getWebDestinationsList(),
  ]);

  const landscapeDestinations = LANDSCAPE_SLUG_ORDER
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

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

  const faqResolution = await resolveFaqsForPage("/");
  const faqNode = buildResolvedFaqSchema(faqResolution, "/");
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
      "QR-based clearance flow",
      "Supports go/no-go safety decisions",
    ],
    inLanguage: "en",
    usageInfo:
      "Operational safety screening only. Does not replace medical diagnosis or treatment.",
  };

  return (
    <div>
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

      <HomeHero title={seo.h1} description={seo.description} />
      <HomeVerifyBar />
      <HomeTrustStrip />
      <HomeTours surabayaPackages={surabayaTours} baliPackages={baliTours} />
      <HomeConfidence />
      <HomeFeatureCarousel />
      <HomeFounder />
      <HomeDestinations destinations={landscapeDestinations} />
      <HomeHealthRail />
      <HomeVolcanoStatus />

      {/* Reviews — Elfsight live Google Reviews embed (S4 stitch from production) */}
      <section aria-labelledby="reviews-heading" className="bg-jvto-navy py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                Guest Reviews
              </span>
            </div>
            <h2
              id="reviews-heading"
              className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 md:max-w-2xl"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
            >
              51 reviews on Trustpilot.{" "}
              <br />
              <em className="text-jvto-orange not-italic">123 on Google Maps.</em>{" "}
              <br />
              21 on TripAdvisor.
            </h2>
            <p className="text-white/60 text-sm md:text-base md:max-w-xl leading-relaxed">
              Ratings verified across three independent platforms. Every review links
              to the original profile — browse by guide, by destination, or by trip length
              to find what matters to you.
            </p>
          </div>

          <Script
            src="https://elfsightcdn.com/platform.js"
            strategy="lazyOnload"
          />
          <div
            className="elfsight-app-3c356457-8eca-453f-a7e4-055cc0d125c6"
            data-elfsight-app-lazy
          />

          <div className="mt-10 text-center md:text-left">
            <Link
              href="/why-jvto/reviews"
              className="text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              Read all reviews <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <HomePartners />
      <HomeFAQ />
      <HomeTravelGuideTeaser />
      <HomeOurStory />
      <HomeCTA />
    </div>
  );
};

export default Home;
