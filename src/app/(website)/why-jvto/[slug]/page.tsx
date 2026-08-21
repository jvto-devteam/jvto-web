// app/(website)/why-jvto/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { EvidenceBox } from "@/components/content/EvidenceBox";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import SidebarDesktop from "../SidebarDesktop";
import { WHY_MENU } from "../sidebarMenu";
import { WHY_JVTO_STYLES } from "../whyJvtoTokens";
import { Home, Star } from "lucide-react";
import {
  getEcosystemReviewProfiles,
  type EcosystemReviewProfile,
} from "@/lib/ecosystemContent/reviewPlatforms";
import {
  listPublishedStaticPages,
  loadEcosystemPage,
  staticRouteCanonical,
  PRODUCTION_ORIGIN,
  type StaticPage,
} from "@/lib/ecosystemContent/staticPageAdapter";

// PACKAGE 05 (2026-08-04): why-jvto structured pages are served from
// jvto-ekosistem via loadEcosystemPage/staticPageAdapter (single-content-
// source migration, 2026-08). The former DB-preferred path (prefersDbForSlug
// — a live content_pages row could override the seed at runtime) is removed
// per AD-10: a migrated route reads only ekosistem. CMS edits to these routes
// no longer surface — content changes go through jvto-ekosistem (Package 09
// formally disables CMS editing for migrated routes). Dynamic review records
// (Prisma) remain for the reviews page's schema nodes — dynamic data is
// allowed to stay DB-owned (AD-02).

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

// Slugs that have their own dedicated folder page (own visual shell, ported
// from the pre-port live design rather than this catch-all's). Next.js
// resolves the static folder segment before this dynamic one regardless, but
// the filter is kept explicit so this route never generates a duplicate
// static param for them.
const WHY_JVTO_FOLDER_ROUTED_SLUGS = new Set([
  "our-story",
  "the-jvto-difference",
  "community-standards",
  "our-team",
  "reviews",
]);

export async function generateStaticParams() {
  const pages = await listPublishedStaticPages({ section: "why-jvto" });
  return pages
    .filter((p) => p.meta.route !== "/why-jvto")
    .map((p) => p.meta.route.replace("/why-jvto/", ""))
    .filter((slug) => !slug.includes("/"))
    .filter((slug) => !WHY_JVTO_FOLDER_ROUTED_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

/** Minimal PageRowLike so PageJsonLdCombined emits WebPage/breadcrumbs for a static page. */
function staticPageRow(page: StaticPage) {
  return {
    route: page.meta.route,
    lang: "en",
    seo: {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
      // Non-default schema classification from the content file (null = WebPage only).
      schema_type: page.meta.schemaTypes?.find((t) => t !== "WebPage") ?? null,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadEcosystemPage(`/why-jvto/${slug}`);
  if (!page || page.meta.status !== "published") {
    return { title: "Page Not Found" };
  }
  return {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: staticRouteCanonical(`/why-jvto/${slug}`),
      languages: { en: staticRouteCanonical(`/why-jvto/${slug}`), "x-default": staticRouteCanonical(`/why-jvto/${slug}`) },
    },
  };
}

/**
 * Aggregate rating cards for /why-jvto/reviews — HTML-only (not schema).
 * `profiles` come from the ekosistem review-platforms.json record, which declares
 * itself the single source of truth for the public platform totals. Renders
 * nothing when that record is unreachable rather than showing a stale figure.
 */
function ReviewsAggregateCards({ profiles }: { profiles: EcosystemReviewProfile[] }) {
  const platforms = profiles.filter(
    (p) => typeof p.rating === "number" && typeof p.reviewCount === "number",
  );
  if (!platforms.length) return null;
  return (
    <div className="jw-agg-grid" style={{ marginBottom: "2rem" }}>
      {platforms.map((p) => (
        <div key={p.platform} className="jw-agg">
          <span className="jw-agg-plat">{p.platform}</span>
          <span className="jw-agg-score">
            {p.rating}
            <small> / 5</small>
          </span>
          <span className="jw-stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span className="jw-agg-meta">
            <span>{p.reviewCount} reviews</span>
            <span>{p.verifiedAt ? `Verified ${p.verifiedAt}` : "—"}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/why-jvto/${slug}`;

  const page = await loadEcosystemPage(route);
  if (!page || page.meta.status !== "published" || !page.sections?.length) {
    return notFound();
  }

  const reviewProfiles =
    slug === "reviews" ? await getEcosystemReviewProfiles() : [];

  const h1 = page.meta.title;
  const faqItems = page.faq ?? [];
  const faqSchemaNode = faqItems.length ? buildStaticFaqSchema(route, faqItems) : null;

  // Individual Review nodes are no longer built here — they now come from
  // jvto-ekosistem's why-jvto__reviews.schema-output.json, merged in automatically
  // by PageJsonLdCombined's ecosystemNodes fetch for this route (Bagian 2, 2026-08-20).
  const slugExtraSchemas = [faqSchemaNode].filter(Boolean);

  return (
    <>
      <style>{WHY_JVTO_STYLES}</style>

      <div className="jw-root" style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
        <SidebarDesktop currentPath={`/why-jvto/${slug}`} />
        <PageJsonLdCombined
          pageRow={staticPageRow(page)}
          extraSchemas={slugExtraSchemas}
          suppressCmsFaq
        />

        <main
          className="pt-30 md:pt-40"
          style={{
            flex: 1,
            paddingBottom: "6rem",
            fontFamily: "'Inter', system-ui, sans-serif",
            color: "#0D1B2A",
          }}
        >
          <div
            className="container mx-auto px-4 max-w-6xl"
            style={{ margin: "0 auto", padding: "0 1.5rem" }}
          >
            {/* ── Breadcrumb ── */}
            <nav className="jw-crumbs" style={{ marginTop: 0 }}>
              <Link href="/" prefetch={false}>
                <Home size={13} />
              </Link>
              <span className="jw-sep">/</span>
              <Link href="/why-jvto" prefetch={false}>
                Why JVTO
              </Link>
              <span className="jw-sep">/</span>
              <span className="jw-here">{h1}</span>
            </nav>

            {/* ── Interior hero ── */}
            <header className="jw-hero" style={{ marginBottom: "2.5rem" }}>
              <div className="jw-hero-inner">
                <div className="jw-hero-eyebrow-row">
                  <span className="jw-eyebrow-pill">Why JVTO</span>
                  <span className="jw-eyebrow-meta">
                    {WHY_MENU.find((m) => m.href === route)?.label ?? h1}
                  </span>
                </div>
                <h1 className="jw-hero-h1" style={{ maxWidth: "26ch" }}>
                  {h1}
                </h1>
                {Array.isArray(page.lede) && page.lede.length > 0 && (
                  <p className="jw-hero-lede">{page.lede[0]}</p>
                )}
              </div>
            </header>

            {/* ── Mobile cross-link strip (desktop uses the persistent rail) ── */}
            <nav
              className="md:hidden"
              style={{
                display: "flex",
                gap: "0.5rem",
                overflowX: "auto",
                paddingBottom: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {WHY_MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="jw-inline-link"
                  style={{
                    whiteSpace: "nowrap",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid #E3E0DA",
                    borderBottom: "1px solid #E3E0DA",
                    background: item.href === route ? "#0D1B2A" : "#fff",
                    color: item.href === route ? "#fff" : "#0D1B2A",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="jw-article-layout">
              <aside className="jw-article-side hidden md:block">
                <div className="jw-side-label">Why JVTO</div>
                <ul>
                  {WHY_MENU.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={item.href === route ? "jw-active" : ""}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/verify-jvto" prefetch={false} className="jw-inline-link">
                  Open proof library →
                </Link>
              </aside>

              <div style={{ minWidth: 0 }}>
                {/* ── Reviews-only aggregate score cards ── */}
                {slug === "reviews" && <ReviewsAggregateCards profiles={reviewProfiles} />}

                {/* ── Sections ── */}
                {page.sections.map((sec) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    style={{ marginBottom: "3.5rem", scrollMarginTop: "7rem" }}
                  >
                    <div className="jw-section-head">
                      <h2 className="jw-section-h2">{sec.title}</h2>
                      {(sec as any).summary && (
                        <p className="jw-section-sub">{(sec as any).summary}</p>
                      )}
                    </div>

                    <div>
                      {sec.blocks ? (
                        <BlocksRenderer blocks={sec.blocks as any} sectionId={sec.id} />
                      ) : null}
                    </div>

                    <EvidenceBox
                      evidence={(sec as any).evidence}
                      title="Evidence"
                      description="Open the Proof Library for documents and verification links related to this claim."
                    />
                  </section>
                ))}

                {/* ── FAQ — same array as the FAQPage JSON-LD (AD-08) ── */}
                {faqItems.length > 0 && (
                  <Faq
                    items={faqItems.map((f) => ({ q: f.question, a: f.answer }))}
                    title="FAQ"
                  />
                )}

                {slug === "our-team" && (
                  <div className="jw-data-box">
                    <div className="jw-k">Safety on Tours</div>
                    <Link
                      href="/travel-guide/safety-on-tours"
                      prefetch={false}
                      className="jw-v"
                      style={{ color: "#0D1B2A", textDecoration: "none" }}
                    >
                      How JVTO manages safety on the road, at viewpoints, and on the mountain →
                    </Link>
                  </div>
                )}

                {/* ── Cross-cluster CTA ── */}
                <div className="jw-cta-block">
                  <h2>
                    Don&rsquo;t guess. <span className="jw-accent-orange">Verify.</span>
                  </h2>
                  <div className="jw-cta-ctas">
                    <Link href="/verify-jvto" prefetch={false} className="jw-primary">
                      Open the proof library →
                    </Link>
                    <Link href="/why-jvto" prefetch={false} className="jw-ghost">
                      Back to Why JVTO
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
