// src/app/(website)/tours/page.tsx
//
// Milestone 2 (2026-08-09): served from the static-content SSOT
// (content/pages/tours/index.json). Evergreen narrative, SEO, canonical, and the
// FAQ come from content/; the PACKAGE LIST stays DYNAMIC (getPublicPackageList,
// the DB-derived package snapshot) exactly as before — content/ never carries a
// package, a price, or a package count.
//
// PKG-11b (visual layer): this is the ALL-ROUTES HUB, and its job is the fork —
// pick a departure city, or browse everything. So the departure hubs were moved
// out from § 03 (below the grid and the comparison matrix) to § 01, directly
// under the hero: the first decision on the page is now the first thing on the
// page. The catalogue follows, then the archetype comparison as the decision
// aid for people who did not take the fork, then planning. The two departure
// routes deliberately do NOT have this fork band — that is the structural
// difference between the hub and its children.
//
// No copy was written for this pass. Every visible string is either the content
// record (content/pages/tours/index.json, content/faqs/tours-hub.json) or a
// pre-existing local constant in this file, re-ordered or re-wrapped only.
import { ListTourPackage } from "@/types";
import StructuredData from "@/components/website/StructuredData";
import ToursPageClient from "@/components/website/ToursPageClient";
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
  HUB_CREDENTIALS,
  HubClosingCta,
  HubFaqSection,
  HubProse,
  buildHubFaqSchema,
  hubGrid,
  hubGridBlock,
  hubProse,
} from "./hubContent";
import HubHero from "@/components/design/HubHero";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";
import Link from "@/components/website/AppLink";
import { formatIDR } from "@/utils/formatting";
import { Clock, Gauge, Compass, MapPin } from "lucide-react";
export const revalidate = 3600;

const ROUTE = "/tours";

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

      {/* ── HERO ──────────────────────────────────────── */}
      <HubHero
        id="tours-hub-h1"
        eyebrow="Private Expedition Routes"
        title={
          <>
            The art of <span className="text-jvto-orange">route</span> selection.
          </>
        }
        lede={`${page.lede?.[0] ?? ""} ${pageDescription}`}
        credentials={HUB_CREDENTIALS}
        actions={[
          { href: "#packages", label: `Browse All ${initialTours.length} Packages` },
          { href: "/verify-jvto", label: "Verify JVTO" },
        ]}
        ledger={[
          ["Total routes", String(initialTours.length)],
          ["Avg. rating", "4.8 / 5"],
          ["Starting from", formatIDR(startingFrom)],
        ]}
      />

      {/* ── 1. DEPARTURE HUBS — the fork, and the thing that makes this page
             the HUB rather than a third departure page. ───────────────── */}
      <Section surface="light" labelledBy="departure-hubs-heading">
        <SectionHeading
          id="departure-hubs-heading"
          eyebrow="§ 01"
          title={
            <>
              Departure <span className="text-jvto-orange">hubs.</span>
            </>
          }
          aside="Surabaya · Bali"
        />

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {departureHubs.map((hub) => (
            <li key={hub.key} className="flex">
              <Link
                href={hub.href}
                className="jvto-focus group relative flex w-full flex-col overflow-hidden rounded-sm border border-jvto-border bg-white p-7 pt-8 shadow-jvto-soft transition-all duration-300 hover:-translate-y-1 hover:border-jvto-navy/25 hover:shadow-jvto-card-hover"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-jvto-navy/15 transition-colors duration-300 group-hover:bg-jvto-orange group-focus-visible:bg-jvto-orange"
                />
                <MapPin
                  aria-hidden="true"
                  className="mb-5 h-7 w-7 text-jvto-orange"
                  strokeWidth={1.5}
                />
                <h3 className="font-jvto-heading mb-3 text-xl font-black text-jvto-navy md:text-2xl">
                  {hub.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-jvto-ink-soft">
                  {hub.body}
                </p>
                <span className="mt-auto border-t border-jvto-border pt-4 font-mono text-[10px] font-bold tracking-[0.2em] text-jvto-navy uppercase transition-transform duration-200 group-hover:translate-x-0.5">
                  {hub.cta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 2. THE CATALOGUE ──────────────────────────── */}
      <Section
        surface="off"
        id="packages"
        labelledBy="route-selection-heading"
        className="scroll-mt-24 md:scroll-mt-32"
      >
        <SectionHeading
          id="route-selection-heading"
          eyebrow="§ 02"
          title={
            <>
              Find your <span className="text-jvto-orange">perfect route.</span>
            </>
          }
          aside="Filter by origin, days, fitness"
          className="mb-8 md:mb-10"
        />

        <HubProse paragraphs={routeSelectionProse} className="mb-10 md:mb-12" />

        <ToursPageClient initialTours={initialTours} showLocationFilter />
      </Section>

      {/* ── 3. ROUTE COMPARISON ──────────────────────── */}
      <Section surface="light" labelledBy="route-comparison-heading">
        <SectionHeading
          id="route-comparison-heading"
          eyebrow="§ 03"
          title={
            <>
              Route <span className="text-jvto-orange">comparison.</span>
            </>
          }
          aside={`${routeArchetypes.length} archetypes`}
        />

        {/* The feature column is sticky, so a phone that scrolls the matrix
            sideways never loses the row it is reading. */}
        <div className="overflow-x-auto rounded-sm border border-jvto-border bg-white">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-jvto-off px-4 py-4 font-mono text-[10px] font-bold tracking-[0.18em] text-jvto-ink-soft uppercase md:px-5"
                >
                  Feature
                </th>
                {routeArchetypes.map((archetype) => (
                  <th
                    key={archetype.name}
                    scope="col"
                    className="font-jvto-heading bg-jvto-off px-4 py-4 text-base font-black text-jvto-navy md:px-5 md:text-lg"
                  >
                    {archetype.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routeCompareFeatures.map((feature, rowIdx) => (
                <tr key={feature} className="border-t border-jvto-border">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-white px-4 py-4 align-top font-mono text-[10px] font-bold tracking-[0.16em] text-jvto-navy uppercase md:px-5"
                  >
                    {feature}
                  </th>
                  {routeArchetypes.map((archetype) => (
                    <td
                      key={archetype.name}
                      className="px-4 py-4 align-top text-[13px] leading-snug text-jvto-ink-soft md:px-5"
                    >
                      {archetype.rows[rowIdx]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 4. PLANNING YOUR EXPEDITION ───────────────── */}
      <Section surface="off" labelledBy="planning-heading">
        <SectionHeading
          id="planning-heading"
          eyebrow="§ 04"
          title={
            <>
              Planning your <span className="text-jvto-orange">expedition.</span>
            </>
          }
          aside="Three decision factors"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {planningTiles.map((tile) => {
            const Icon = PLANNING_ICONS[tile.icon] ?? Compass;
            return (
              <div
                key={tile.title}
                className="relative overflow-hidden rounded-sm border border-jvto-border bg-white p-7 pt-8 shadow-jvto-soft"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-jvto-navy/15"
                />
                <Icon
                  aria-hidden="true"
                  className="mb-5 h-6 w-6 text-jvto-orange"
                  strokeWidth={1.5}
                />
                <h3 className="font-jvto-heading mb-2.5 text-lg font-black text-jvto-navy">
                  {tile.title}
                </h3>
                <p className="text-sm leading-relaxed text-jvto-ink-soft">{tile.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 5. COMMON QUESTIONS (content/ FAQ — same array as the FAQPage node) ── */}
      <HubFaqSection eyebrow="§ 05" items={faqItems} surface="light" />

      {/* ── CLOSING PLATE ─────────────────────────────── */}
      <HubClosingCta
        headingId="tours-cta-heading"
        title={
          <>
            Ready for operational{" "}
            <span className="text-jvto-orange">certainty?</span>
          </>
        }
        primary={{
          href: "https://wa.me/6282244788833",
          label: "Contact the team",
          external: true,
        }}
        secondary={{ href: "/verify-jvto", label: "Verify JVTO" }}
      />
    </>
  );
}
