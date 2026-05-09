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
import { ChevronRight, Home } from "lucide-react";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import { getActiveCrewMembers } from "@/lib/queries/crewMembers";
import { getReviewsForSchema } from "@/lib/queries/schemaReviews";
import { buildCrewPersonSchema } from "@/lib/schemas/entityGraph";
import {
  buildIndividualReviewSchemas,
  buildWhyJvtoBreadcrumbSchema,
  buildWhyJvtoReviewsAggregateRatingSchema,
  buildWhyJvtoWebPageSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listPublicPageRoutesByPrefix("/why-jvto").map((route) => ({
    slug: route.replace("/why-jvto/", ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPageSnapshot(`/why-jvto/${slug}`, {
    allowDatabaseFallback: false,
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
    <nav
      style={{
        marginBottom: "2rem",
        borderRadius: "0.875rem",
        border: "1px solid #dde8c0",
        background: "#f7faf0",
        padding: "1.125rem 1.375rem",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#7aaa1a",
          marginBottom: "0.75rem",
        }}
      >
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
                color: "#3a5218",
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ChevronRight size={12} color="#9fce33" />
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/why-jvto/${slug}`;
  const [page, faqResolution, crewMembers, reviewsData] = await Promise.all([
    getPublicPageSnapshot(route, {
      allowDatabaseFallback: false,
      requiredContentFields: ["sections"],
    }),
    resolveFaqsForPage(route),
    slug === "our-team" ? getActiveCrewMembers().catch(() => []) : Promise.resolve([]),
    slug === "reviews" ? getReviewsForSchema().catch(() => []) : Promise.resolve([]),
  ]);
  const content = page.pageRow.content as any;
  if (!Array.isArray(content?.sections) || content.sections.length === 0) {
    return notFound();
  }

  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Why JVTO";

  const faqSchema = buildResolvedFaqSchema(faqResolution, route);

  const crewSchemas = crewMembers.map((m) => buildCrewPersonSchema(m));

  const reviewsAggregateSchema =
    slug === "reviews" ? buildWhyJvtoReviewsAggregateRatingSchema() : null;

  const reviewsIndividualSchemas =
    slug === "reviews"
      ? buildIndividualReviewSchemas(reviewsData as Awaited<ReturnType<typeof getReviewsForSchema>>)
      : [];

  const slugExtraSchemas = [
    buildWhyJvtoWebPageSchema({
      subpath: slug as
        | "our-story"
        | "our-team"
        | "the-jvto-difference"
        | "community-standards"
        | "reviews",
      pageName: h1,
      description: seo.description ?? h1,
    }),
    buildWhyJvtoBreadcrumbSchema({
      subpath: slug as
        | "our-story"
        | "our-team"
        | "the-jvto-difference"
        | "community-standards"
        | "reviews",
      pageName: h1,
      description: seo.description ?? h1,
    }),
    faqSchema,
    ...crewSchemas,
    reviewsAggregateSchema,
    ...reviewsIndividualSchemas,
  ].filter(Boolean);

  return (
    <>
      {/* Font import */}
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        .jvto-lede .jvto-prose { font-size: 0.95rem; line-height: 1.75; color: #4a5a35; }
.jvto-lede .jvto-prose p { margin: 0; }
      `}</style>

      <div
        style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}
      >
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
            fontFamily: "'DM Sans', sans-serif",
            color: "#0c0e09",
          }}
        >
          <div
            className="container mx-auto px-4 max-w-5xl"
            style={{
              margin: "0 auto",
              padding: "0 1.5rem",
            }}
          >
            {/* ── Breadcrumb ── */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                flexWrap: "wrap",
                marginBottom: "2rem",
                fontSize: "0.78rem",
                color: "#6b7a55",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Link
                href="/"
                prefetch={false}
                style={{ color: "#6b7a55", textDecoration: "none" }}
              >
                <Home size={13} />
              </Link>
              <span style={{ color: "#c0cca8" }}>›</span>
              <Link
                href="/why-jvto"
                prefetch={false}
                style={{ color: "#6b7a55", textDecoration: "none" }}
              >
                Why JVTO
              </Link>
              <span style={{ color: "#c0cca8" }}>›</span>
              <span style={{ color: "#0c0e09", fontWeight: 600 }}>
                {h1}
              </span>
            </nav>

            {/* ── Page Header ── */}
            <header
              style={{
                paddingBottom: "2rem",
                marginBottom: "2.5rem",
                borderBottom: "1px solid #dde3d0",
              }}
            >
              {/* Eyebrow */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#7aaa1a",
                  marginBottom: "0.875rem",
                }}
              >
                <span>◆</span> Why JVTO
              </div>

              {/* H1 */}
              <h1
                style={{
                //   fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.65rem, 3.5vw, 2.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  color: "#0c0e09",
                  marginBottom: "1.25rem",
                  margin: "0 0 1.25rem 0",
                }}
              >
                {h1}
              </h1>

              {/* Hero subhead */}
              {content?.hero_subhead && (
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "#4a5a35",
                    lineHeight: 1.65,
                    marginBottom: "0.875rem",
                  }}
                >
                  {content.hero_subhead}
                </p>
              )}

              {/* Lede paragraphs */}
              {Array.isArray(content?.lede) && content.lede.length > 0 && (
                <div className="jvto-lede">
                  <MarkdownRenderer markdown={content.lede.join("\n\n")} />
                </div>
              )}
            </header>

            {/* ── Section nav (optional) ── */}
            <SectionNav items={content?.section_nav} />

            {/* ── Sections ── */}
            {Array.isArray(content?.sections) &&
              content.sections.map((sec: any) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  style={{ marginBottom: "3.5rem", scrollMarginTop: "7rem" }}
                >
                  {/* Section heading with brand-green underline */}
                  <h2
                    style={{
                    //   fontFamily: "'Syne', sans-serif",
                      fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      color: "#0c0e09",
                      margin: "0 0 1.25rem 0",
                      paddingBottom: "0.625rem",
                      borderBottom: "2px solid #9fce33",
                      display: "inline-block",
                    }}
                  >
                    {sec.title}
                  </h2>

                  {sec.summary && (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#6b7a55",
                        lineHeight: 1.65,
                        marginBottom: "1.25rem",
                        maxWidth: "600px",
                      }}
                    >
                      {sec.summary}
                    </p>
                  )}

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
              <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #dde3d0" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#7aaa1a", marginBottom: "0.625rem" }}>
                  Safety on Tours
                </div>
                <Link href="/travel-guide/safety-on-tours" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0c0e09", textDecoration: "none" }}>
                  How JVTO manages safety on the road, at viewpoints, and on the mountain →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
