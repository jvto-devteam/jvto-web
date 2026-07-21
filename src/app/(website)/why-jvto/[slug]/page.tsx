// app/(website)/why-jvto/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { EvidenceBox } from "@/components/content/EvidenceBox";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import SidebarDesktop from "../SidebarDesktop";
import { WHY_MENU } from "../sidebarMenu";
import { WHY_JVTO_STYLES } from "../whyJvtoTokens";
import { ChevronRight, Home, Star } from "lucide-react";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import { getReviewsForSchema } from "@/lib/queries/schemaReviews";
import {
  buildIndividualReviewSchemas,
  buildWhyJvtoReviewsAggregateRatingSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";
import { REVIEW_PLATFORMS } from "@/lib/jvtoReviews";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

// ── DB-preferred rendering (widened from the community-standards pilot) ──────
// why-jvto pages prefer the live content_pages row at runtime, so a CMS block
// edit + Publish (revalidatePath) surfaces on the live page. This is now enabled
// for ALL why-jvto slugs, not just the pilot: getPublicPageSnapshot only serves a
// DB row when it carries the required content fields ("sections"); any slug whose
// DB row is missing/incomplete falls back to the static snapshot (now v2-clean),
// so widening is regression-safe by construction. The snapshot is also DB-free at
// build (CI) time and the DB read is try/caught, so the build never depends on it.
function prefersDbForSlug(): boolean {
  return true;
}

export function generateStaticParams() {
  return listPublicPageRoutesByPrefix("/why-jvto").map((route) => ({
    slug: route.replace("/why-jvto/", ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageSnapshot(`/why-jvto/${slug}`, {
    allowDatabaseFallback: prefersDbForSlug(),
    requiredContentFields: ["sections"],
  });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const content = (page.pageRow.content as Record<string, any> | null) ?? {};
  if (!Array.isArray(content.sections) || content.sections.length === 0) {
    return { title: "Page Not Found" };
  }
  return {
    title: seo.title ?? content.h1 ?? page.pageRow.route,
    description: seo.description ?? undefined,
  };
}

function SectionNav({
  items,
}: {
  items?: Array<{ id: string; label: string; href: string }>;
}) {
  if (!items?.length) return null;
  return (
    <nav className="jw-data-box" style={{ display: "block" }}>
      <div className="jw-micro" style={{ marginBottom: "0.75rem" }}>
        ◆ On this page
      </div>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.375rem",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={it.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "#1C2E40",
                textDecoration: "none",
              }}
            >
              <ChevronRight size={12} color="#E8650A" />
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Aggregate rating cards for /why-jvto/reviews — real canonical platform data, HTML-only (not schema). */
function ReviewsAggregateCards() {
  const platforms = REVIEW_PLATFORMS.filter((p) => p.rating != null && p.count != null);
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
            <span>{p.count} reviews</span>
            <span>{p.lastVerified ? `Verified ${p.lastVerified}` : "—"}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/why-jvto/${slug}`;

  const [page, reviewsData, faqResolution] = await Promise.all([
    getPublicPageSnapshot(route, {
      allowDatabaseFallback: prefersDbForSlug(),
      requiredContentFields: ["sections"],
    }),
    slug === "reviews" ? getReviewsForSchema().catch(() => []) : Promise.resolve([]),
    resolveFaqsForPage(route),
  ]);
  const content = page.pageRow.content as any;
  if (!Array.isArray(content?.sections) || content.sections.length === 0) {
    return notFound();
  }

  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Why JVTO";
  const faqSchemaNode = buildResolvedFaqSchema(faqResolution, route);

  const slugExtraSchemas = [
    faqSchemaNode,
    ...(slug === "reviews"
      ? [
          buildWhyJvtoReviewsAggregateRatingSchema(),
          ...buildIndividualReviewSchemas(
            reviewsData as Awaited<ReturnType<typeof getReviewsForSchema>>,
          ),
        ]
      : []),
  ].filter(Boolean);

  return (
    <>
      <style>{WHY_JVTO_STYLES}</style>

      <div className="jw-root" style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
        <SidebarDesktop currentPath={`/why-jvto/${slug}`} />
        <PageJsonLdCombined
          pageRow={page.pageRow}
          extraSchemas={slugExtraSchemas}
          suppressCmsFaq={faqResolution.suppressCmsFaq}
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
                {content?.hero_subhead && (
                  <p className="jw-hero-lede" style={{ marginBottom: "0.5rem" }}>
                    {content.hero_subhead}
                  </p>
                )}
                {Array.isArray(content?.lede) && content.lede.length > 0 && (
                  <p className="jw-hero-lede">{content.lede[0]}</p>
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
                {/* ── Section nav (optional) ── */}
                <SectionNav items={content?.section_nav} />

                {/* ── Reviews-only aggregate score cards ── */}
                {slug === "reviews" && <ReviewsAggregateCards />}

                {/* ── Sections ── */}
                {Array.isArray(content?.sections) &&
                  content.sections.map((sec: any) => (
                    <section
                      key={sec.id}
                      id={sec.id}
                      style={{ marginBottom: "3.5rem", scrollMarginTop: "7rem" }}
                    >
                      <div className="jw-section-head">
                        <h2 className="jw-section-h2">{sec.title}</h2>
                        {sec.summary && <p className="jw-section-sub">{sec.summary}</p>}
                      </div>

                      <div>
                        {sec.blocks ? (
                          <BlocksRenderer blocks={sec.blocks} sectionId={sec.id} />
                        ) : sec.body_md ? (
                          <MarkdownRenderer markdown={sec.body_md} />
                        ) : null}
                      </div>

                      <EvidenceBox
                        evidence={sec.evidence}
                        title="Evidence"
                        description="Open the Proof Library for documents and verification links related to this claim."
                      />
                    </section>
                  ))}

                {/* ── Fallback body_md ── */}
                {content?.body_md && (
                  <section style={{ marginTop: "2.5rem" }}>
                    <MarkdownRenderer markdown={content.body_md} />
                  </section>
                )}

                {/* ── FAQ ── */}
                {content?.faq && (
                  <Faq items={content.faq} title={content?.faq_title ?? "FAQ"} />
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
