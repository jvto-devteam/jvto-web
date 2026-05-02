// app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import Hero from "@/components/website/Home/Hero";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import WhyJVTO from "@/components/website/Home/WhyJVTO";
import Reviews from "@/components/website/Home/Reviews";
import IjenHealthScreeningSection from "@/components/website/Home/IjenHealthScreeningSection";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import IsicSection from "@/components/website/Home/IsicSection";
import FAQSection from "@/components/website/FAQSection";
import Contact from "@/components/website/Contact";
import TravelGuideTeaser from "@/components/website/Home/TravelGuideTeaser";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import {
  DEFAULT_SITE,
} from "@/lib/seo/jsonld/builders";
import { miniFaqs, faqsCopy } from "@/constants";
import { buildHomepageAggregateRatingSchema } from "@/lib/schemas/buildHomepageSchemas";
import { getWebDestinationsList } from "@/lib/destinations/getWebDestinationsList";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

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
  // Refactored 2026-04-29 (Phase 4.8): direct helper call (was self-fetch broke SSG with ECONNREFUSED).
  try {
    return (await getWebDestinationsList()) as unknown as Destination[];
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  const seo = await getPageSeo("/", fallbackSeo);
  // Fetch sekali: dipakai untuk schema DAN HomeDestinations
  const destinations = await getDestinations();
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
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
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

  // ── TouristAttraction: dari schema_json DB (konsisten dengan detail pages)
  const attractionNodes = destinations
    .map((dest) => {
      const graph: any[] = Array.isArray(dest.schema_json?.["@graph"])
        ? dest.schema_json!["@graph"]
        : [];

      const node = graph.find((n: any) => {
        const types = Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]];
        return types.some((t: string) =>
          ["TouristAttraction", "Waterfall", "Beach"].includes(t),
        );
      });

      if (!node) return null;

      // Strip verbose fields: homepage hanya butuh core identity
      const {
        "@context": _ctx,
        additionalProperty: _ap,
        amenityFeature: _af,
        subjectOf: _so,
        mainEntityOfPage: _mep,
        ...core
      } = node;

      return core;
    })
    .filter(Boolean);

  // ── FAQPage (Phase 5 resolver-driven) ─────────────────────────────────────
  // Precedence: narrative_claims → canonical hardcoded (HOMEPAGE_FAQS, 9 Q&A) → CMS.
  // resolveFaqsForPage handles the precedence; suppressCmsFaq ensures no double-FAQPage emission.
  const faqResolution = await resolveFaqsForPage("/");
  const faqNode = buildResolvedFaqSchema(faqResolution, "/");
  const aggregateRatingNode = buildHomepageAggregateRatingSchema();

  // ── WebApplication (Ijen Health Screening) ────────────────────────────────
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
      {
        "@type": "Thing",
        name: "Pre-ascent health screening (SpO₂ & Blood Pressure)",
      },
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
    <main>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[serviceNode, ...attractionNodes, faqNode, aggregateRatingNode, healthAppNode]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <Hero title={seo.h1} description={seo.description} />
      {/* Pass destinations dari sini: tidak perlu fetch ulang di HomeDestinations */}
      <HomeDestinations destinations={destinations} />
      <FeaturedTours />
      <WhyJVTO />

      <div className="bg-jvto-green/5 pt-20 pb-20">
        <div className="w-full container mx-auto">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center uppercase mb-3 text-jvto-dark">
              What Our Guests Say
            </h2>
            <p className="text-lg text-center">
              Real experiences from travelers who trusted us with their East
              Java adventure.
            </p>
          </div>
          <Reviews />
        </div>
      </div>

      <IjenHealthScreeningSection />
      <IsicSection />
      <FAQSection copy={faqsCopy} faqs={miniFaqs} />
      <TravelGuideTeaser />
      <Contact />
    </main>
  );
};

export default Home;
