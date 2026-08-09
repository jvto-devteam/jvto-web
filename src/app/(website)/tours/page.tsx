// src/app/(website)/tours/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/tours/index.json). Evergreen narrative, SEO, canonical, and the
// FAQ come from content/; the PACKAGE LIST stays DYNAMIC (getPublicPackageList,
// the DB-derived package snapshot) exactly as before — content/ never carries a
// package, a price, or a package count.
import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient"; // Sesuaikan path
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
  HubFaqSection,
  buildHubFaqSchema,
  hubGrid,
  hubGridBlock,
  hubProse,
} from "./hubContent";
import Link from "@/components/website/AppLink";
import { formatIDR } from "@/utils/formatting";
import { ArrowRight, Clock, Gauge, Compass, MapPin } from "lucide-react";
export const revalidate = 3600;

const ROUTE = "/tours";

const DISPLAY_FONT = { fontFamily: "Raleway, Inter, sans-serif" };

/** Content-owned tile copy → the icons that render it (icons stay presentational). */
const PLANNING_ICONS = { clock: Clock, gauge: Gauge, compass: Compass } as const;

type RouteArchetype = { name: string; rows: string[] };
type DepartureHub = { key: string; title: string; body: string; href: string; cta: string };
type PlanningTile = { icon: keyof typeof PLANNING_ICONS; title: string; body: string };

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Page Not Found" };
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: { canonical: staticRouteCanonical(ROUTE) },
  };
}

async function getAllTours(): Promise<ListTourPackage[]> {
  return getPublicPackageList({ categoryId: 1 });
}

export default async function ToursPageGlobal() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const [initialTours, org] = await Promise.all([getAllTours(), getOrganizationProfile()]);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://javavolcano-touroperator.com";
  const orgNode = buildOrganizationJsonLd(org as any, siteUrl);
  const siteNode = buildWebSiteJsonLd(siteUrl);

  const pageTitle = page.meta.browserTitle ?? page.meta.title;
  const pageDescription = page.meta.description;

  // Content-owned narrative (evergreen). Package data is never sourced from here.
  const routeSelectionProse = hubProse(page, "route-selection");
  const comparisonBlock = hubGridBlock(page, "route-comparison", "archetypes");
  const routeCompareFeatures = (comparisonBlock?.features as string[] | undefined) ?? [];
  const routeArchetypes = (comparisonBlock?.items as RouteArchetype[] | undefined) ?? [];
  const departureHubs = hubGrid<DepartureHub>(page, "departure-hubs", "hubs");
  const planningTiles = hubGrid<PlanningTile>(page, "planning-your-expedition", "planning");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      orgNode,
      siteNode,
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/tours#collection`,
        url: `${siteUrl}/tours`,
        name: pageTitle,
        description: pageDescription,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/tours#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/tours#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://javavolcano-touroperator.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "All Tours",
            item: "https://javavolcano-touroperator.com/tours",
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/tours#itemlist`,
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

  // AEO/GEO: exactly ONE FAQPage node, built from the same page.faq array the
  // visible Q&A block renders (AD-08). Plus a standalone AggregateRating
  // cross-ref to Organization (cluster_role_contracts.md Cluster 1 hub MH).
  const faqItems = page.faq ?? [];
  const hubFaqSchema = faqItems.length ? buildHubFaqSchema(ROUTE, faqItems) : null;
  const hubAggregateRatingSchema = buildToursHubAggregateRatingSchema({ hubPath: '' });

  const startingFrom = initialTours.length > 0
    ? Math.min(...initialTours.map((t) => t.startFrom))
    : 0;

  return (
    <>
      <StructuredData data={schema} />
      {hubFaqSchema && <StructuredData data={hubFaqSchema} />}
      <StructuredData data={hubAggregateRatingSchema} />

      {/* ── 1. HERO ───────────────────────────────────── */}
      <section className="bg-jvto-navy text-white pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-jvto-lime) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime">
                  Private Expedition Routes
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 max-w-3xl"
                style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
              >
                The art of <em className="text-jvto-orange not-italic italic">route</em> selection.
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-2xl mb-8 leading-relaxed font-light">
                {page.lede?.[0]} {pageDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {["NIB 1102230032918", "Trustpilot 4.8/5 · 51 reviews", "Founded 2015"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 uppercase tracking-[0.1em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#packages"
                  prefetch={false}
                  className="inline-flex items-center gap-2 bg-jvto-orange text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
                  style={{ boxShadow: "var(--shadow-jvto-orange)" }}
                >
                  Browse All {initialTours.length} Packages
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify-jvto"
                  prefetch={false}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
                >
                  Verify JVTO
                </Link>
              </div>
            </div>

            {/* Hero stat rail — mirrors spec's hero-meta-block */}
            <div className="flex flex-col gap-1 pb-1">
              {[
                ["Total routes", String(initialTours.length)],
                ["Avg. rating", "4.8 / 5"],
                ["Starting from", formatIDR(startingFrom)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3.5 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65"
                >
                  <span>{label}</span>
                  <strong className="text-white font-semibold normal-case tracking-normal text-sm">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PACKAGES ───────────────────────────────── */}
      <section id="packages" className="bg-jvto-off py-20 md:py-28 rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-32px_80px_-36px_rgba(13,27,42,0.10)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-12">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 01</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Find your <em className="text-jvto-orange not-italic">perfect route.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Filter by origin, days, fitness</span>
          </div>
          {routeSelectionProse.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-jvto-muted text-sm md:text-base max-w-2xl leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <ToursPageClient
          initialTours={initialTours}
          destinationName="All Destinations"
          title={page.meta.title}
          description={pageDescription}
          showLocationFilter={true}
          hideHeader
        />
      </section>

      {/* ── 3. ROUTE COMPARISON ──────────────────────── */}
      <section className="bg-jvto-off py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 02</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Route <em className="text-jvto-orange not-italic">comparison.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">{routeArchetypes.length} archetypes</span>
          </div>

          <div className="overflow-x-auto border border-jvto-border rounded-[24px] bg-white">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-jvto-muted font-semibold bg-jvto-off rounded-tl-[24px]">Feature</th>
                  {routeArchetypes.map((a, i) => (
                    <th
                      key={a.name}
                      className={`text-left p-5 font-black text-jvto-navy text-lg bg-jvto-off ${i === routeArchetypes.length - 1 ? "rounded-tr-[24px]" : ""}`}
                      style={DISPLAY_FONT}
                    >
                      {a.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routeCompareFeatures.map((feature, rowIdx) => (
                  <tr key={feature} className="border-t border-jvto-border">
                    <td className="p-5 font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-navy font-bold align-top">{feature}</td>
                    {routeArchetypes.map((a) => (
                      <td key={a.name} className="p-5 text-jvto-navy/80 align-top">{a.rows[rowIdx]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. DEPARTURE HUBS ────────────────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">§ 03</span>
            <h2
              className="text-3xl md:text-5xl font-black leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Departure <em className="text-jvto-orange not-italic">hubs.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Surabaya · Bali</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departureHubs.map((hub) => (
              <Link
                key={hub.key}
                href={hub.href}
                prefetch={false}
                className="group bg-white/[0.03] border border-white/10 rounded-[24px] p-9 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:border-jvto-orange"
              >
                <MapPin className="w-7 h-7 text-jvto-orange" strokeWidth={1.5} />
                <h3 className="text-2xl font-black" style={DISPLAY_FONT}>{hub.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{hub.body}</p>
                <span className="mt-auto pt-4 border-t border-white/10 font-mono text-[10px] uppercase tracking-[0.22em] text-jvto-lime">
                  {hub.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PLANNING YOUR EXPEDITION ───────────────── */}
      <section className="bg-jvto-off py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-6 border-b border-jvto-border pb-6 mb-10 flex-wrap">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-jvto-muted/70">§ 04</span>
            <h2
              className="text-3xl md:text-5xl font-black text-jvto-navy leading-tight max-w-2xl"
              style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
            >
              Planning your <em className="text-jvto-orange not-italic">expedition.</em>
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-jvto-muted/70">Three decision factors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planningTiles.map((tile) => {
              const Icon = PLANNING_ICONS[tile.icon] ?? Compass;
              return (
                <div
                  key={tile.title}
                  className="bg-white border border-jvto-border rounded-[24px] p-8 card-jvto flex flex-col gap-4"
                >
                  <Icon className="w-7 h-7 text-jvto-orange" strokeWidth={1.5} />
                  <h3 className="text-xl font-black text-jvto-navy" style={DISPLAY_FONT}>{tile.title}</h3>
                  <p className="text-jvto-muted text-sm leading-relaxed">{tile.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. COMMON QUESTIONS (content/ FAQ — same array as the FAQPage node) ── */}
      <HubFaqSection eyebrow="§ 05" items={faqItems} />

      {/* ── 7. CTA ─────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-24 text-center rounded-t-[48px] -mt-8 relative z-10 shadow-[0_-40px_90px_-40px_rgba(0,0,0,0.45)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="text-4xl md:text-6xl font-black leading-tight mb-10"
            style={{ ...DISPLAY_FONT, letterSpacing: "-0.03em" }}
          >
            Ready for operational <em className="text-jvto-orange not-italic">certainty?</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/6282244788833"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvto-orange text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              Contact the team
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center gap-2 border border-white/20 text-white px-9 py-4 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
