// src/app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import HomeHero from "@/components/website/Home/HomeHero";
import HomeTrustStrip from "@/components/website/Home/HomeTrustStrip";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import HomeTours from "@/components/website/Home/HomeTours";
import HomeHowItWorks from "@/components/website/Home/HomeHowItWorks";
import HomeReviews from "@/components/website/Home/HomeReviews";
import HomeTravelGuideTeaser from "@/components/website/Home/HomeTravelGuideTeaser";
import HomeWhyJVTO from "@/components/website/Home/HomeWhyJVTO";
import HomeFAQ from "@/components/website/Home/HomeFAQ";
import HomeCTA from "@/components/website/Home/HomeCTA";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import { getWebPackagesList } from "@/lib/packages/getWebPackagesList";
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
  h1: "Private Volcano Tours.\nPolice-Led.",
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

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  // getPublicDestinationList is synchronous (reads a static JSON snapshot)
  const destinations: Destination[] = getPublicDestinationList() as Destination[];

  const [seo, surabayaTours, baliTours] = await Promise.all([
    getPageSeo("/", fallbackSeo),
    getWebPackagesList({ fromId: 4, limit: 4 }),
    getWebPackagesList({ fromId: 3, limit: 4 }),
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

  // ── AEO schema nodes ────────────────────────────────────────────────────────
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

      <HomeHero title={seo.h1} description={seo.description} />
      <HomeTrustStrip />
      <HomeDestinations destinations={destinations} />
      <HomeTours surabayaPackages={surabayaTours} baliPackages={baliTours} />
      <HomeWhyJVTO />
      <HomeHowItWorks />
      <HomeReviews />
      <HomeTravelGuideTeaser />
      <HomeFAQ />
      <HomeCTA />
    </div>
  );
};

export default Home;
