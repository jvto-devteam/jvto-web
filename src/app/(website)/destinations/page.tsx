// app/(website)/destinations/page.tsx
import type { Metadata } from "next";
import type { Destination } from "@/interfaces";
import DestinationCard from "@/components/website/DestinationCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getWebDestinationsList } from "@/lib/destinations/getWebDestinationsList";
import Link from "@/components/website/AppLink";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";
const ROUTE = "/destinations";
export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

const fallbackSeo = {
  title: "East Java Destinations | Bromo, Ijen & More",
  h1: "Destinations",
  description:
    "Explore breathtaking destinations in East Java with JVTO. Discover our expert guides for Mount Bromo, Ijen Crater, Tumpak Sewu Waterfall, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}${ROUTE}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/assets/img/og/destinations.webp`,
          width: 1200,
          height: 630,
          alt: seo.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${SITE_URL}/assets/img/og/destinations.webp`],
    },
  };
}

// ─── Data fetching ─────────────────────────────────────────────────────────────

async function getAllDestinations(): Promise<Destination[]> {
  return getPublicDestinationList();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationsPage() {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  const [destinations, org] = await Promise.all([
    getAllDestinations(),
    getOrganizationProfile(),
  ]);

  // Build @graph: tidak ada @context di tiap node, hanya di root
  const orgNode = buildOrganizationJsonLd(org as any, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const breadcrumb = buildBreadcrumbJsonLd(ROUTE, SITE_URL);
  const collection = buildDestinationsCollectionJsonLd(
    destinations as any,
    SITE_URL,
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, collection, breadcrumb].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={schema} />

      {/* ── 1. HERO ───────────────────────────────────── */}
      <section className="bg-jvto-navy text-white pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-jvto-lime) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 mb-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
              East Java Destinations
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black leading-[1.05] mb-6 max-w-3xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            {seo.h1} —{" "}
            <em className="text-jvto-orange not-italic">Active Volcanoes, Real Wilderness.</em>
          </h1>

          <p className="text-white/60 text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-light">
            {seo.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {["NIB 1102230032918", "Trustpilot 4.8/5 · 51 reviews", "Founded 2015"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 uppercase tracking-[0.1em]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. DESTINATIONS GRID ─────────────────────── */}
      <section className="bg-jvto-off py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
              {destinations.length} Destinations
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-jvto-navy leading-tight mb-10 max-w-2xl"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Choose where you&apos;re going.{" "}
            <em className="text-jvto-orange not-italic">We handle the rest.</em>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CTA ────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">
            Ready to Book
          </p>
          <h2
            className="text-3xl md:text-5xl font-black leading-tight mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
          >
            Browse tours by{" "}
            <em className="text-jvto-orange not-italic">departure city.</em>
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto mb-10">
            Every destination is served from both Surabaya and Bali. Choose your starting point and
            pick the route that fits your schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours/from-surabaya"
              className="inline-flex items-center justify-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              Tours from Surabaya
            </Link>
            <Link
              href="/tours/from-bali"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
            >
              Tours from Bali
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
