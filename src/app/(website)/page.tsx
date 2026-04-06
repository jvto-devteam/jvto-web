// app/(website)/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import Hero from "@/components/website/Home/Hero";
import HomeAuthorityReality from "@/components/website/Home/HomeAuthorityReality";
import FeaturedTours from "@/components/website/Home/FeaturedTours";
import HomeFinalCta from "@/components/website/Home/HomeFinalCta";
import HomeTrustGateway from "@/components/website/Home/HomeTrustGateway";
import HomeDestinations from "@/components/website/Home/HomeDestinations";
import TravelGuideTeaser from "@/components/website/Home/TravelGuideTeaser";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getWebDestinations } from "@/lib/destinations/webDestinations";
import { BASE_URL } from "@/lib/site";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";

const SITE_URL = BASE_URL;
export const revalidate = 3600;
const fallbackSeo = {
  title: "Tourist Police-Led Private Volcano Tours in East Java | JVTO",
  h1: "Tourist Police-Led Private Volcano Tours in East Java",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed operator (No.1102230032918), led by an active Tourist Police officer.",
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/", fallbackSeo);

  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/",
    imageAlt: seo.h1,
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  const seo = await getPageSeo("/", fallbackSeo);
  // Fetch sekali — dipakai untuk schema DAN HomeDestinations
  const destinations: Destination[] = await getWebDestinations();
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

  // ── TouristAttraction — dari schema_json DB (konsisten dengan detail pages)
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

      // Strip verbose fields — homepage hanya butuh core identity
      const core = { ...node };
      delete core["@context"];
      delete core.additionalProperty;
      delete core.amenityFeature;
      delete core.subjectOf;
      delete core.mainEntityOfPage;

      return core;
    })
    .filter(Boolean);

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
        extraSchemas={[serviceNode, ...attractionNodes, healthAppNode]}
      />
      <Hero title={seo.h1} description={seo.description} />
      <HomeAuthorityReality />
      <FeaturedTours />
      <HomeDestinations destinations={destinations} />
      <HomeTrustGateway />
      <TravelGuideTeaser />
      <HomeFinalCta />
    </main>
  );
};

export default Home;
