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
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  ORG_ID,
  WEBSITE_ID,
  DEFAULT_SITE,
} from "@/lib/seo/jsonld/builders";
import { miniFaqs, faqsCopy } from "@/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:
    "Tourist Police-Led Private Volcano Tours in East Java | Java Volcano Tour Operator",
  description:
    "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed Indonesian operator (Licence 1102230032918), police-led safety culture, all-inclusive packages, Ijen health screening included.",
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/destinations/web`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const Home = async () => {
  // Fetch sekali — dipakai untuk schema DAN HomeDestinations
  const [org, destinations] = await Promise.all([
    getOrganizationProfile(),
    getDestinations(),
  ]);

  // ── Organization + WebSite (dari DB) ──────────────────────────────────────
  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);

  // ── WebPage homepage ──────────────────────────────────────────────────────
  const webPageNode = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: "Java Volcano Tour Operator — Private Volcano Tours in East Java",
    description:
      "Private Bromo, Ijen & Tumpak Sewu tours led by an active Tourist Police officer. Licensed, all-inclusive, safety-first.",
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };

  // ── BreadcrumbList ────────────────────────────────────────────────────────
  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    ],
  };

  // ── Service ───────────────────────────────────────────────────────────────
  const serviceNode = {
    "@type": "Service",
    "@id": `${SITE_URL}/why-jvto#tourService`,
    name: "Private Volcano Tour Operations (Mount Bromo & Mount Ijen)",
    provider: { "@id": ORG_ID },
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

  // ── FAQPage ───────────────────────────────────────────────────────────────
  const faqNode =
    miniFaqs?.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${SITE_URL}/#faqpage`,
          mainEntity: miniFaqs.map(
            (faq: { question: string; answer: string }) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            }),
          ),
        }
      : null;

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
    publisher: { "@id": ORG_ID },
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

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      webPageNode,
      breadcrumbNode,
      serviceNode,
      ...attractionNodes,
      faqNode,
      healthAppNode,
    ].filter(Boolean),
  };

  return (
    <main>
      <JsonLd data={schema} />
      <Hero />
      {/* Pass destinations dari sini — tidak perlu fetch ulang di HomeDestinations */}
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
