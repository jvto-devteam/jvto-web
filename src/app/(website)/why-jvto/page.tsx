// src/app/(website)/why-jvto/page.tsx
//
// PACKAGE 05c (2026-08-04): the hub is fully content-driven. Every company
// claim, number, badge, quote, and description renders from
// content/pages/why-jvto/index.json (+ content/entities/*); this file keeps
// only layout, styling, icon mapping, and interaction wiring (owner
// directive: TSX must not store public narrative for migrated routes).
// Crew stats are COMPUTED from the published crew_grid roster in
// content/pages/why-jvto/our-team.json — never TSX literals. Review ratings
// come from the review-platforms entity via @/lib/jvtoReviews. The
// narrative-claims ItemList reads content/entities/narrative-claims.json —
// this route performs zero database reads.
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import Link from "@/components/website/AppLink";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  BookOpen,
  Star,
  ArrowRight,
  CheckCircle2,
  Search,
  MessageCircleQuestion,
  ShieldAlert,
  Scale,
  Mountain,
  Handshake,
  Lock,
  ExternalLink,
  FileDigit,
  ChevronRight,
  Fingerprint,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import {
  buildWhyJvtoHubItemListSchema,
  buildNarrativeClaimsItemList,
} from "@/lib/schemas/buildWhyJvtoSchemas";
import {
  loadEntity,
  loadStaticPage,
  staticRouteCanonical,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/static-content";
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";
import SidebarDesktop from "./SidebarDesktop";
import { WHY_JVTO_STYLES } from "./whyJvtoTokens";
import {
  DifferenceChips,
  ReviewQuoteRotator,
  StoryTimelineTabs,
  StandardsAccordion,
  type DiffItem,
  type QuoteItem,
  type StoryTab,
  type StandardItem,
} from "./HubInteractive";

const siteUrl = PRODUCTION_ORIGIN;

/* ── Design-side icon maps (keyed by content item `key` — never narrative) ── */
const TRUST_CARD_ICONS: Record<string, LucideIcon> = {
  difference: ShieldAlert,
  story: Scale,
  team: Mountain,
  reviews: Star,
  standards: Handshake,
  verify: Search,
};
const CHIP_ICONS: Record<string, LucideIcon> = {
  isic: CheckCircle2,
  hpwki: ShieldCheck,
};

/* ── Content access helpers — throw at build so missing content fails the
      SSG build (prebuild gates + deploy build), never silently drops copy. ── */
type HubSection = NonNullable<StaticPage["sections"]>[number];

function requireSection(page: StaticPage, id: string): HubSection {
  const sec = page.sections?.find((s) => s.id === id);
  if (!sec) {
    throw new Error(
      `why-jvto hub: required section "${id}" missing from content/pages/why-jvto/index.json`,
    );
  }
  return sec;
}

function sectionText(sec: HubSection, key: string): string {
  const v = (sec as Record<string, unknown>)[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`why-jvto hub: section "${sec.id}" is missing text field "${key}"`);
  }
  return v;
}

function gridItems<T>(sec: HubSection, role: string): T[] {
  const block = (sec.blocks ?? []).find(
    (b) => b.type === "grid" && (b as Record<string, unknown>).role === role,
  );
  if (!block) {
    throw new Error(`why-jvto hub: section "${sec.id}" is missing its grid block (role="${role}")`);
  }
  return (block as { items: unknown[] }).items as T[];
}

function sectionImage(sec: HubSection): { src: string; alt: string } {
  const block = (sec.blocks ?? []).find((b) => b.type === "image");
  if (!block) {
    throw new Error(`why-jvto hub: section "${sec.id}" is missing its image block`);
  }
  return block as { src: string; alt: string };
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      schema_type: page.meta.schemaTypes.find((t) => t !== "WebPage") ?? null,
    },
    content: { h1: page.meta.title },
  };
}

/** Visible FAQ HTML and FAQPage JSON-LD share this one array (AD-08). */
function buildStaticFaqSchema(route: string, faq: NonNullable<StaticPage["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PRODUCTION_ORIGIN}${route}#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage("/why-jvto");
  if (!page || page.meta.status !== "published") return { title: "Why JVTO" };
  const title = page.meta.browserTitle ?? page.meta.title;
  const description = page.meta.description;

  return {
    title,
    description,
    alternates: { canonical: staticRouteCanonical("/why-jvto") },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/why-jvto`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/assets/img/og/why-jvto.webp`,
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
      images: [`${siteUrl}/assets/img/og/why-jvto.webp`],
    },
  };
}

export default async function WhyJvtoPage() {
  const page = loadStaticPage("/why-jvto");
  if (!page || page.meta.status !== "published") return notFound();

  // Crew stats + portrait rail — computed from the published crew_grid roster
  // (content/pages/why-jvto/our-team.json). Counts are never TSX literals.
  const teamPage = loadStaticPage("/why-jvto/our-team");
  const crew = (teamPage?.sections ?? [])
    .flatMap((s) => s.blocks ?? [])
    .filter((b) => b.type === "crew_grid")
    .flatMap(
      (b) =>
        ((b as { items?: unknown[] }).items ?? []) as Array<{
          name: string;
          role: string;
          photo_url?: string;
        }>,
    );
  if (crew.length === 0) {
    throw new Error(
      "why-jvto hub: crew_grid items missing from content/pages/why-jvto/our-team.json",
    );
  }
  const crewStats: Record<string, number> = {
    guides: crew.filter((m) => m.role === "Guide").length,
    drivers: crew.filter((m) => m.role === "Driver").length,
    total: crew.length,
  };
  const crewRail = crew.filter((m) => m.photo_url).slice(0, 8);

  // Narrative claims — evergreen public knowledge, served from content/
  // (content/entities/narrative-claims.json), never the DB on this route.
  const claimsEntity = loadEntity("narrative-claims") as {
    claims?: Array<{ pillar?: string; primary_page?: string }>;
  } | null;
  if (!claimsEntity?.claims?.length) {
    throw new Error("why-jvto hub: content/entities/narrative-claims.json missing or empty");
  }
  const narrativeClaims = claimsEntity.claims.map((c) => ({
    pillar: c.pillar ?? null,
    primary_page: c.primary_page ?? null,
  }));

  // Sections (throw at build when absent — content is the contract).
  const heroSignals = requireSection(page, "hero-signals");
  const difference = requireSection(page, "difference");
  const press = requireSection(page, "press-evidence");
  const reviewsSec = requireSection(page, "reviews-signal");
  const story = requireSection(page, "story-timeline");
  const team = requireSection(page, "team-strip");
  const standards = requireSection(page, "standards-accordion");
  const trustStack = requireSection(page, "trust-stack");
  const proofLocker = requireSection(page, "proof-locker");
  const cta = requireSection(page, "cta");

  const heroMetaRows = gridItems<{ key: string; label: string; value: string }>(heroSignals, "meta-rows");
  const credentialChips = gridItems<{ key: string; label: string }>(heroSignals, "credential-chips");
  const diffItems = gridItems<DiffItem>(difference, "differentiators");
  const quotes = gridItems<QuoteItem>(reviewsSec, "quotes");
  const storyTabs = gridItems<StoryTab>(story, "timeline-tabs");
  const statLabels = gridItems<{ key: string; label: string }>(team, "stat-labels");
  const standardItems = gridItems<StandardItem>(standards, "standards");
  const trustCards = gridItems<{ key: string; href: string; title: string; summary: string }>(trustStack, "cards");
  const proofDocs = gridItems<{ key: string; title: string; img: string; sha256_short: string }>(proofLocker, "docs");
  const ctaLinks = gridItems<{ key: string; href: string; label: string; variant: string }>(cta, "cta-links");

  const differenceImage = sectionImage(difference);
  const pressImage = sectionImage(press);
  const storyImage = sectionImage(story);

  const heroH1 = page.meta.title;
  const heroLede = page.lede ?? [];
  const teamHeading = sectionText(team, "heading_template").replace(
    "{count}",
    String(crewStats.total),
  );

  // Review ratings/counts — content entity via @/lib/jvtoReviews (dynamic data
  // stays entity/DB-owned; no literal fallbacks in TSX).
  const ratedPlatforms = REVIEW_PLATFORMS.filter((p) => p.rating != null && p.count != null);
  const primaryPlatform =
    ratedPlatforms.find((p) => p.platform === "Trustpilot") ?? ratedPlatforms[0];

  const faqSource = page.faq ?? [];
  const faqSchemaNode = faqSource.length ? buildStaticFaqSchema("/why-jvto", faqSource) : null;
  const extraSchemas = [
    buildWhyJvtoHubItemListSchema(),
    buildNarrativeClaimsItemList(narrativeClaims),
    faqSchemaNode,
  ].filter(Boolean);
  const visibleFaqs = faqSource.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      <style>{WHY_JVTO_STYLES}</style>
      <style>{`
        .jw-feat { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .jw-feat.jw-reverse .jw-feat-media { order: 2; }
        @media (max-width: 940px) { .jw-feat { grid-template-columns: 1fr; gap: 2rem; } .jw-feat.jw-reverse .jw-feat-media { order: 0; } }
        .jw-feat-eyebrow { display: inline-flex; align-items: center; gap: .5rem; font-family: var(--jw-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #E8650A; margin-bottom: 1rem; }
        .jw-feat-eyebrow .jw-fe-num { color: #6B7280; }
        .jw-feat-body h3 { font-family: var(--jw-font-display); font-size: clamp(24px, 3.2vw, 38px); letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 1rem; color: #0D1B2A; }
        .jw-feat-body.jw-on-dark h3 { color: #fff; }
        .jw-feat-lede { color: #6B7280; font-size: 15.5px; font-weight: 400; line-height: 1.6; max-width: 46ch; margin-bottom: 1.5rem; }
        .jw-feat-body.jw-on-dark .jw-feat-lede { color: rgba(255,255,255,0.72); }
      `}</style>

      <div className="jw-root flex min-h-screen bg-white">
        <SidebarDesktop currentPath="/why-jvto" />
        <PageJsonLdCombined
          pageRow={staticPageRow(page)}
          extraSchemas={extraSchemas}
          suppressCmsFaq
        />

        <main className="pt-24 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          {/* ══════════ HERO ══════════ */}
          <section style={{ padding: "1.5rem 1.5rem 0" }}>
            <header className="jw-hero">
              <div className="jw-hero-inner">
                <div className="jw-hero-eyebrow-row">
                  <span className="jw-eyebrow-pill">{sectionText(heroSignals, "eyebrow_pill")}</span>
                  <span className="jw-eyebrow-meta">{sectionText(heroSignals, "eyebrow_meta")}</span>
                </div>
                <h1 className="jw-hero-h1" style={{ maxWidth: "24ch" }}>
                  {heroH1}
                </h1>
                {heroLede.slice(0, 2).map((p, i) => (
                  <p key={i} className="jw-hero-lede" style={{ marginBottom: i === 0 ? "0.6rem" : 0 }}>
                    {p}
                  </p>
                ))}
                <div className="jw-hero-meta">
                  {heroMetaRows.map((row) => (
                    <div key={row.key} className="jw-meta-row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            {/* Trust bar — platform chips from the review-platforms entity; credential chips from content */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1.25rem 2.5rem",
                padding: "1.5rem",
                marginTop: "-1px",
              }}
            >
              {ratedPlatforms.map((p) => (
                <div
                  key={p.platform}
                  style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#0D1B2A", fontWeight: 700, fontSize: "0.85rem" }}
                >
                  <Star size={15} color="#E8650A" />
                  {p.platform} {p.rating}
                </div>
              ))}
              {credentialChips.map((chip) => {
                const Icon = CHIP_ICONS[chip.key] ?? CheckCircle2;
                return (
                  <div
                    key={chip.key}
                    style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#0D1B2A", fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    <Icon size={15} color="#E8650A" />
                    {chip.label}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════ 01 · THE JVTO DIFFERENCE ══════════ */}
          <section style={{ padding: "4rem 1.5rem" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  <img src={differenceImage.src} alt={differenceImage.alt} loading="lazy" />
                  <span className="jw-media-tag">{sectionText(difference, "media_tag")}</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <ShieldCheck />
                    <div>
                      <div className="jw-fb-title">{sectionText(difference, "badge_title")}</div>
                      <div className="jw-fb-sub">{sectionText(difference, "badge_sub")}</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">{sectionText(difference, "eyebrow_num")}</span> ·{" "}
                  {sectionText(difference, "eyebrow_label")}
                </span>
                <h3>
                  {sectionText(difference, "heading")}{" "}
                  <span className="jw-accent-orange">{sectionText(difference, "heading_accent")}</span>
                </h3>
                <p className="jw-feat-lede">{sectionText(difference, "lede_text")}</p>
                <DifferenceChips items={diffItems} />
                <Link href="/why-jvto/the-jvto-difference" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  Read the difference →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ Press evidence ══════════ */}
          <section style={{ background: "#0D1B2A", padding: "3.5rem 1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="jw-press-grid">
              <div>
                <div className="jw-micro" style={{ color: "#8CC63F", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
                  <Newspaper size={13} /> {sectionText(press, "eyebrow")}
                </div>
                <h3 style={{ fontFamily: "var(--jw-font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 1rem" }}>
                  {sectionText(press, "heading")}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {sectionText(press, "body_text")}
                </p>
                <div className="jw-cred jw-dark" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <span className="jw-cred-text" style={{ fontFamily: "var(--jw-font-display)", fontStyle: "italic", fontSize: "1rem", color: "#fff" }}>
                    &ldquo;{sectionText(press, "quote")}&rdquo;
                  </span>
                  <span className="jw-cred-label">{sectionText(press, "quote_attribution")}</span>
                </div>
                <a
                  href={sectionText(press, "article_url")}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="jw-inline-link jw-light"
                  style={{ marginTop: "1.25rem" }}
                >
                  Read original article <ExternalLink size={12} />
                </a>
              </div>
              <div>
                <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "var(--jw-shadow-hover)" }}>
                  <img
                    src={pressImage.src}
                    alt={pressImage.alt}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", display: "block" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.9rem", background: "rgba(0,0,0,0.4)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--jw-font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                      <Fingerprint size={11} /> SHA-256: {sectionText(press, "sha256_short")}
                    </span>
                    <span style={{ fontFamily: "var(--jw-font-mono)", fontSize: "10px", background: "rgba(140,198,63,0.15)", color: "#8CC63F", padding: "2px 8px", borderRadius: "4px" }}>
                      {sectionText(press, "article_date")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════ 02 · REVIEWS ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div className="jw-feat" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {crewRail[0]?.photo_url && (
                    <img
                      src={crewRail[0].photo_url}
                      alt={`${crewRail[0].name} — ${crewRail[0].role}, Java Volcano Tour Operator crew`}
                      loading="lazy"
                    />
                  )}
                  <span className="jw-media-tag">{sectionText(reviewsSec, "media_tag")}</span>
                  {primaryPlatform && (
                    <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                      <Star fill="#F5A623" color="#F5A623" />
                      <div>
                        <div className="jw-fb-title">
                          {primaryPlatform.rating} ★ {primaryPlatform.platform}
                        </div>
                        <div className="jw-fb-sub">{primaryPlatform.count} verified reviews</div>
                      </div>
                    </div>
                  )}
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">{sectionText(reviewsSec, "eyebrow_num")}</span> ·{" "}
                  {sectionText(reviewsSec, "eyebrow_label")}
                </span>
                <h3>
                  {sectionText(reviewsSec, "heading")}{" "}
                  <span className="jw-accent-orange">{sectionText(reviewsSec, "heading_accent")}</span>
                </h3>
                <p className="jw-feat-lede">{sectionText(reviewsSec, "lede_text")}</p>
                <div className="jw-agg-grid" style={{ marginBottom: "1.25rem" }}>
                  {ratedPlatforms.map((p) => (
                    <div key={p.platform} className="jw-agg" style={{ padding: "1rem 1.1rem" }}>
                      <span className="jw-agg-plat">{p.platform}</span>
                      <span className="jw-agg-score" style={{ fontSize: "1.6rem" }}>
                        {p.rating}
                      </span>
                      <span className="jw-agg-meta" style={{ border: 0, paddingTop: 0 }}>
                        {p.count} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <ReviewQuoteRotator quotes={quotes} />
                <Link href="/why-jvto/reviews" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  Read all reviews →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ 03 · OUR STORY ══════════ */}
          <section style={{ padding: "4rem 1.5rem" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  <img src={storyImage.src} alt={storyImage.alt} loading="lazy" />
                  <span className="jw-media-tag">{sectionText(story, "media_tag")}</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <BookOpen />
                    <div>
                      <div className="jw-fb-title">{sectionText(story, "badge_title")}</div>
                      <div className="jw-fb-sub">{sectionText(story, "badge_sub")}</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body jw-on-dark" style={{ background: "#0D1B2A", borderRadius: "28px", padding: "2.5rem" }}>
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {sectionText(story, "eyebrow_num")}
                  </span>{" "}
                  · {sectionText(story, "eyebrow_label")}
                </span>
                <h3>
                  {sectionText(story, "heading")}{" "}
                  <span className="jw-accent-orange">{sectionText(story, "heading_accent")}</span>
                </h3>
                <p className="jw-feat-lede">{sectionText(story, "lede_text")}</p>
                <StoryTimelineTabs tabs={storyTabs} />
                <Link href="/why-jvto/our-story" prefetch={false} className="jw-inline-link jw-light" style={{ marginTop: "1.5rem" }}>
                  Read our story →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ 04 · OUR TEAM ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#0D1B2A" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginBottom: "2.25rem",
                }}
              >
                <div>
                  <span className="jw-feat-eyebrow" style={{ color: "#8CC63F" }}>
                    <span className="jw-fe-num" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {sectionText(team, "eyebrow_num")}
                    </span>{" "}
                    · {sectionText(team, "eyebrow_label")}
                  </span>
                  <h3 style={{ fontFamily: "var(--jw-font-display)", fontSize: "clamp(24px,3.2vw,38px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.08, maxWidth: "18ch", margin: 0 }}>
                    {teamHeading} <span className="jw-accent-orange">{sectionText(team, "heading_accent")}</span>
                  </h3>
                </div>
                <div
                  style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  aria-label={`Crew composition: ${crewStats.total} active crew — ${crewStats.guides} guides, ${crewStats.drivers} drivers`}
                >
                  {statLabels.map((stat) => (
                    <div key={stat.key}>
                      <div style={{ fontFamily: "var(--jw-font-display)", fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em", color: "#8CC63F", lineHeight: 1 }}>
                        {crewStats[stat.key] ?? 0}
                      </div>
                      <div className="jw-micro" style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.35rem" }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                {crewRail.map((m) => (
                  <div
                    key={m.photo_url}
                    style={{
                      position: "relative",
                      width: "150px",
                      aspectRatio: "3/4",
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "#1C2E40",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={m.photo_url}
                      alt={`${m.name} — ${m.role}, Java Volcano Tour Operator crew`}
                      loading="lazy"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, transparent 45%, rgba(13,27,42,0.92) 100%)",
                      }}
                    />
                    <div style={{ position: "absolute", left: "12px", bottom: "10px" }}>
                      <div style={{ fontFamily: "var(--jw-font-display)", fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                        {m.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="jw-micro" style={{ color: "rgba(255,255,255,0.5)", marginTop: "1.25rem" }}>
                {sectionText(team, "footer_note")}
              </p>
              <Link href="/why-jvto/our-team" prefetch={false} className="jw-inline-link jw-light" style={{ marginTop: "1rem" }}>
                Meet the full team →
              </Link>
            </div>
          </section>

          {/* ══════════ 05 · COMMUNITY STANDARDS ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div className="jw-feat jw-reverse" style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-feat-media">
                <figure className="jw-media-frame">
                  {crewRail[1]?.photo_url && (
                    <img
                      src={crewRail[1].photo_url}
                      alt={`${crewRail[1].name} — ${crewRail[1].role}, Java Volcano Tour Operator crew`}
                      loading="lazy"
                    />
                  )}
                  <span className="jw-media-tag">{sectionText(standards, "media_tag")}</span>
                  <div className="jw-floating-badge" style={{ right: "-14px", top: "24px" }}>
                    <Handshake />
                    <div>
                      <div className="jw-fb-title">{sectionText(standards, "badge_title")}</div>
                      <div className="jw-fb-sub">{sectionText(standards, "badge_sub")}</div>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="jw-feat-body">
                <span className="jw-feat-eyebrow">
                  <span className="jw-fe-num">{sectionText(standards, "eyebrow_num")}</span> ·{" "}
                  {sectionText(standards, "eyebrow_label")}
                </span>
                <h3>
                  {sectionText(standards, "heading")}{" "}
                  <span className="jw-accent-orange">{sectionText(standards, "heading_accent")}</span>
                </h3>
                <p className="jw-feat-lede">{sectionText(standards, "lede_text")}</p>
                <StandardsAccordion items={standardItems} />
                <Link href="/why-jvto/community-standards" prefetch={false} className="jw-inline-link" style={{ marginTop: "1.5rem" }}>
                  See the standards →
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════ TRUST STACK INDEX ══════════ */}
          <section style={{ padding: "5rem 1.5rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="jw-section-head" style={{ textAlign: "center" }}>
                <div className="jw-section-eyebrow" style={{ justifyContent: "center" }}>
                  <span className="jw-micro">{sectionText(trustStack, "eyebrow")}</span>
                </div>
                <h2 className="jw-section-h2">{trustStack.title}</h2>
                <p className="jw-section-sub" style={{ margin: "0.6rem auto 0" }}>
                  {sectionText(trustStack, "sub")}
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.25rem",
                  marginTop: "2.5rem",
                }}
              >
                {trustCards.map((card) => {
                  const Icon = TRUST_CARD_ICONS[card.key] ?? ShieldCheck;
                  return (
                    <Link
                      key={card.key}
                      href={card.href}
                      prefetch={false}
                      style={{
                        background: "#fff",
                        border: "1px solid #E3E0DA",
                        borderRadius: "18px",
                        padding: "1.5rem",
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        transition: "box-shadow .2s, border-color .2s",
                      }}
                    >
                      <div
                        style={{
                          width: "2.75rem",
                          height: "2.75rem",
                          borderRadius: "12px",
                          background: "#0D1B2A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <Icon size={20} color="#8CC63F" />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D1B2A", marginBottom: "0.4rem" }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "1rem" }}>
                        {card.summary}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 700, color: "#E8650A" }}>
                        Explore proof <ChevronRight size={14} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══════════ PROOF LOCKER ══════════ */}
          <section style={{ padding: "4rem 1.5rem", background: "#F6F5F2" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                  <h2 className="jw-section-h2">{sectionText(proofLocker, "heading")}</h2>
                  <p className="jw-section-sub">{sectionText(proofLocker, "sub")}</p>
                </div>
                <Link href="/verify-jvto" prefetch={false} className="jw-inline-link">
                  <Lock size={14} /> Enter proof library
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="jw-proof-grid">
                {proofDocs.map((doc) => (
                  <div key={doc.key} style={{ background: "#fff", border: "1px solid #E3E0DA", borderRadius: "14px", padding: "0.75rem" }}>
                    <div style={{ background: "#eceae4", borderRadius: "8px", overflow: "hidden", height: "9rem", position: "relative", marginBottom: "0.75rem" }}>
                      <img src={doc.img} alt={doc.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                      <FileDigit size={26} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#9aa08e" }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0D1B2A", marginBottom: "0.3rem" }}>{doc.title}</div>
                    <span style={{ fontFamily: "var(--jw-font-mono)", fontSize: "0.6rem", color: "#6B7280", background: "#F6F5F2", padding: "0.25rem 0.5rem", borderRadius: "4px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      SHA-256: {doc.sha256_short}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════ FAQ — same array as the FAQPage JSON-LD (AD-08) ══════════ */}
          {visibleFaqs.length > 0 && (
            <section style={{ padding: "5rem 1.5rem" }}>
              <div style={{ maxWidth: "820px", margin: "0 auto" }}>
                <div className="jw-section-head" style={{ textAlign: "center" }}>
                  <div className="jw-section-eyebrow" style={{ justifyContent: "center" }}>
                    <span className="jw-micro">◆ Quick Answers</span>
                  </div>
                  <h2 className="jw-section-h2">FAQ</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {visibleFaqs.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#F6F5F2",
                        border: "1px solid #E3E0DA",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          flexShrink: 0,
                          borderRadius: "10px",
                          background: "#0D1B2A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageCircleQuestion size={17} color="#8CC63F" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D1B2A", marginBottom: "0.375rem" }}>{item.q}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.6 }}>{item.a}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══════════ CTA ══════════ */}
          <div style={{ padding: "0 1.5rem 2rem" }}>
            <div className="jw-cta-block" style={{ marginTop: 0 }}>
              <h2>
                {sectionText(cta, "heading")} <span className="jw-accent-orange">{sectionText(cta, "heading_accent")}</span>
              </h2>
              <div className="jw-cta-ctas">
                {ctaLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    prefetch={false}
                    className={link.variant === "primary" ? "jw-primary" : "jw-ghost"}
                  >
                    {link.label}
                    {link.variant === "primary" && <ArrowRight size={14} />}
                  </Link>
                ))}
              </div>
              <p className="jw-micro" style={{ color: "rgba(255,255,255,0.5)", marginTop: "2rem" }}>
                {sectionText(cta, "footer_identity")}
                {primaryPlatform
                  ? ` · ${primaryPlatform.platform} ${primaryPlatform.rating} / 5 (${primaryPlatform.count} reviews${primaryPlatform.lastVerified ? `, verified ${primaryPlatform.lastVerified}` : ""})`
                  : ""}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
