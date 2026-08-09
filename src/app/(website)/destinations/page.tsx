// app/(website)/destinations/page.tsx
//
// PACKAGE 06 (2026-08-06): the destinations HUB is served from the static-content
// SSOT for its evergreen narrative — hero copy, the per-slug feature copy, the
// transport note, and the CTA all read from content/pages/destinations/index.json.
// The destination CARDS stay dynamic: the list + counts + the CollectionPage/ItemList
// JSON-LD are still built from the DB-backed snapshot (getPublicDestinationList). No
// package/price/booking/availability data is rendered here. TSX keeps layout/styling.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Destination } from "@/interfaces";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationProfile } from "@/lib/content/getOrganizationProfile";
import { getPublicDestinationList } from "@/lib/publicContent/destinationListSnapshot";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildDestinationsCollectionJsonLd,
} from "@/lib/seo/jsonld/builders";
import { loadStaticPage, staticRouteCanonical, PRODUCTION_ORIGIN, type StaticPage } from "@/lib/static-content";
import { Faq } from "@/components/content/Faq";
import Link from "@/components/website/AppLink";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";
const ROUTE = "/destinations";
export const revalidate = 3600;

type HubCategory = "volcano" | "waterfall" | "coastal";

interface HubFeatureCopy {
  category: HubCategory;
  regionLabel: string;
  diffLine: string;
  elevation: string;
  description: string;
  chips: string[];
  warm: boolean;
}

function deriveCategory(dest: Destination): HubCategory {
  const tags = dest.tags ?? [];
  if (tags.includes("volcano")) return "volcano";
  if (tags.includes("waterfall")) return "waterfall";
  if (tags.includes("beach") || tags.includes("coastal")) return "coastal";
  return "volcano";
}

// ─── Content access helpers (throw at build so missing copy fails SSG, never
//     silently drops narrative — parity with the why-jvto hub). ───
type HubSection = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): HubSection {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `destinations hub: required section "${id}" missing from content/pages/destinations/index.json`,
    );
  }
  return sec;
}

function sectionText(sec: HubSection, key: string): string {
  const v = (sec as Record<string, unknown>)[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`destinations hub: section "${sec.id}" is missing text field "${key}"`);
  }
  return v;
}

function gridItems<T>(sec: HubSection, role: string): T[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as Record<string, unknown>).role === role,
  );
  if (!block) {
    throw new Error(`destinations hub: section "${sec.id}" is missing its grid block (role="${role}")`);
  }
  return (block as { items: unknown[] }).items as T[];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published") return { title: "Destinations" };
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;
  return {
    title,
    description,
    alternates: {
      canonical: staticRouteCanonical(ROUTE),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/assets/img/og/destinations.webp`,
          width: 1200,
          height: 630,
          alt: page.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/assets/img/og/destinations.webp`],
    },
  };
}

// ─── Data fetching (dynamic — DB-backed snapshot) ───────────────────────────────

async function getAllDestinations(): Promise<Destination[]> {
  return getPublicDestinationList();
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DestinationsPage() {
  const page = loadStaticPage(ROUTE);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const [destinations, org] = await Promise.all([
    getAllDestinations(),
    getOrganizationProfile(),
  ]);

  // JSON-LD @graph: no @context per node, only at the root (handled by @graph wrapper).
  const orgNode = buildOrganizationJsonLd(org as never, SITE_URL);
  const siteNode = buildWebSiteJsonLd(SITE_URL);
  const breadcrumb = buildBreadcrumbJsonLd(ROUTE, SITE_URL);
  const collection = buildDestinationsCollectionJsonLd(
    destinations as never,
    SITE_URL,
  );

  // FAQ from content/ (content/faqs/destinations.json) — one array feeds both the
  // visible FAQ section and the FAQPage node (AD-08). @context is omitted here (the
  // @graph root wrapper supplies it, matching the other builders).
  const faqItems = page.faq ?? [];
  const faqNode = faqItems.length
    ? {
        "@type": "FAQPage",
        "@id": `${SITE_URL}${ROUTE}#faq`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [orgNode, siteNode, collection, faqNode, breadcrumb].filter(Boolean),
  };

  const volcanoCount = destinations.filter((d) => deriveCategory(d) === "volcano").length;
  const waterfallCount = destinations.filter((d) => deriveCategory(d) === "waterfall").length;
  const coastalCount = destinations.filter((d) => deriveCategory(d) === "coastal").length;
  const counts: Record<string, number> = {
    total: destinations.length,
    volcano: volcanoCount,
    waterfall: waterfallCount,
    coastal: coastalCount,
  };

  // Content sections — evergreen narrative from content/pages/destinations/index.json.
  const hero = requireSection(page, "hero");
  const featureSection = requireSection(page, "destination-feature-copy");
  const transport = requireSection(page, "transport-note");
  const cta = requireSection(page, "cta");

  const statLabels = gridItems<{ key: string; label: string }>(hero, "stat-labels");
  const featureCopy = gridItems<HubFeatureCopy & { slug: string }>(featureSection, "feature-copy");
  const transportSpecs = gridItems<{ key: string; label: string; value: string }>(transport, "transport-spec");
  const ctaLinks = gridItems<{ key: string; href: string; label: string; variant: string }>(cta, "cta-links");
  const explorePrefix = sectionText(featureSection, "explore_prefix");

  const featureBySlug = new Map<string, HubFeatureCopy>(
    featureCopy.map((f) => [
      f.slug,
      {
        category: f.category,
        regionLabel: f.regionLabel,
        diffLine: f.diffLine,
        elevation: f.elevation,
        description: f.description,
        chips: f.chips,
        warm: f.warm,
      },
    ]),
  );

  return (
    <>
      <JsonLd data={schema} />

      {/* ── 1. HERO (interior, navy) ─────────────────────────────────── */}
      <header className="relative bg-jvto-navy text-white overflow-hidden pt-40 pb-20 md:pt-48 md:pb-24">
        <div
          className="absolute inset-0 opacity-55 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #11253a 0%, #0d1b2a 60%, #1a3a52 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 75% 30%, rgba(232,101,10,0.18) 0%, transparent 55%), linear-gradient(180deg, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.1) 35%, rgba(13,27,42,0.9) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-3 mb-8">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-jvto-lime/30 bg-jvto-lime/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-lime"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime" aria-hidden="true" />
                  {sectionText(hero, "eyebrow_pill")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {sectionText(hero, "eyebrow_meta")}
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-[-0.03em] font-bold mb-8"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {sectionText(hero, "heading")}{" "}
                <em className="font-light not-italic">{sectionText(hero, "heading_accent")}</em>
              </h1>
              <p className="text-lg md:text-xl max-w-[38ch] text-white/78 font-light leading-relaxed">
                {page.lede?.[0] ?? ""}
              </p>
            </div>
            <div className="flex flex-col gap-1 pb-1">
              {statLabels.map((stat) => (
                <div
                  key={stat.key}
                  className="flex justify-between items-center py-3.5 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-white/65"
                >
                  <span>{stat.label}</span>
                  <strong className="text-white font-semibold">{counts[stat.key] ?? 0}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. ALTERNATING DESTINATION FEATURE ROWS ─────────────────────── */}
      <section className="bg-jvto-off py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-20 md:gap-28">
          {destinations.map((dest, i) => {
            const copy = featureBySlug.get(dest.slug) ?? {
              category: deriveCategory(dest),
              regionLabel: "East Java",
              diffLine: dest.keyInfo.difficulty_level ?? "",
              elevation: dest.geo?.altitude ? `${dest.geo.altitude} m` : "",
              description: dest.summary ?? dest.description,
              chips: (dest.tags ?? []).slice(0, 4).map((t) => t.replace(/-/g, " ")),
              warm: i % 2 === 0,
            };
            const reverse = i % 2 === 1;
            const idx = String(i + 1).padStart(2, "0");

            return (
              <div
                key={dest.id}
                className={`grid gap-9 md:gap-18 items-center lg:grid-cols-[1.15fr_1fr] ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className="relative aspect-[5/4] rounded-[40px] overflow-hidden shadow-[0_30px_60px_-25px_rgba(13,27,42,0.22)]"
                  style={{
                    background: copy.warm
                      ? "linear-gradient(135deg, #2a1810 0%, #3b1d0c 60%, #1c0f08 100%)"
                      : "linear-gradient(135deg, #11253a 0%, #0d1b2a 60%, #1a3a52 100%)",
                  }}
                >
                  <Image
                    src={dest.banner.url}
                    alt={dest.banner.alt || dest.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={i < 2}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, rgba(13,27,42,0.9) 100%)",
                    }}
                  />
                  {copy.elevation && (
                    <span className="absolute right-4 top-4 z-[3] rounded-full bg-white/92 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-navy backdrop-blur-sm">
                      {copy.elevation}
                    </span>
                  )}
                  <span className="absolute left-5 bottom-4 z-[3] font-mono text-[10px] uppercase tracking-[0.22em] text-white/72">
                    {idx} — {copy.regionLabel}
                  </span>
                </div>
                <div>
                  <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-orange">
                    {copy.diffLine}
                  </div>
                  <h2
                    className="text-4xl md:text-6xl leading-[0.98] tracking-[-0.03em] font-bold text-jvto-navy mb-5"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {dest.name}
                  </h2>
                  <p className="text-lg text-jvto-muted font-light leading-relaxed max-w-[48ch] mb-7">
                    {copy.description}
                  </p>
                  {copy.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {copy.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-2 rounded-full border border-jvto-border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-navy"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-jvto-lime)" strokeWidth="3" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-3 border-b border-jvto-navy pb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-jvto-navy hover:text-jvto-orange hover:border-jvto-orange hover:gap-5 transition-all"
                  >
                    {explorePrefix} {dest.name}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. TRANSPORT NOTE ─────────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="block mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-jvto-lime">
                {sectionText(transport, "eyebrow")}
              </span>
              <h2
                className="text-3xl md:text-5xl leading-[1.04] tracking-[-0.03em] font-bold mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {sectionText(transport, "heading")}{" "}
                <span className="text-jvto-orange">{sectionText(transport, "heading_accent")}</span>
              </h2>
              <p className="text-white/72 text-base md:text-lg font-light leading-relaxed max-w-[46ch]">
                {sectionText(transport, "body_text")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
              {transportSpecs.map((spec) => (
                <div key={spec.key}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 mb-1.5">
                    {spec.label}
                  </div>
                  <div className="font-semibold text-white">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — same array as the FAQPage JSON-LD (AD-08) ─────────────── */}
      {faqItems.length > 0 && (
        <section className="bg-jvto-off py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems.map((f) => ({ q: f.question, a: f.answer }))}
              title="Frequently Asked Questions"
            />
          </div>
        </section>
      )}

      {/* ── 4. CTA ────────────────────────────────────────────────────── */}
      <section className="bg-jvto-navy text-white py-24 text-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2
            className="text-4xl md:text-6xl lg:text-[80px] leading-none tracking-[-0.03em] font-bold mb-10"
            style={{ fontFamily: "Raleway, Inter, sans-serif" }}
          >
            {sectionText(cta, "heading")}{" "}
            <span className="text-jvto-orange">{sectionText(cta, "heading_accent")}</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {ctaLinks.map((link) =>
              link.variant === "primary" ? (
                <Link
                  key={link.key}
                  href={link.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-jvto-orange px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-jvto-orange-hover transition-colors"
                >
                  {link.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  key={link.key}
                  href={link.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
