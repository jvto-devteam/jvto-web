// app/(website)/why-jvto/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { EvidenceBox } from "@/components/content/EvidenceBox";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { listPublicPageRoutesByPrefix } from "@/lib/publicContent/pageSnapshots";
import { getReviewsForSchema } from "@/lib/queries/schemaReviews";
import {
  buildIndividualReviewSchemas,
  buildWhyJvtoReviewsAggregateRatingSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];

type HeroMeta = {
  eyebrow: string;
  eyebrowMeta?: string;
  lede: string;
  metaRows: Array<{ label: string; value: string }>;
};

const SLUG_HERO: Record<string, HeroMeta> = {
  "the-jvto-difference": {
    eyebrow: "Why JVTO · The Difference",
    eyebrowMeta: "FILE 004A",
    lede: "Safety leadership, documented operational discipline, and credentials you can verify before you book.",
    metaRows: [
      { label: "01 · Authority", value: "Police-led" },
      { label: "02 · Format", value: "100% private" },
      { label: "05 · Licenses", value: "Proof library" },
      { label: "06 · Plan B", value: "Written SOP" },
    ],
  },
  "reviews": {
    eyebrow: "Why JVTO · Reviews",
    eyebrowMeta: "FILE 004B",
    lede: "Independent platform scores from Trustpilot, Google, TripAdvisor, ISIC, and Indecon.",
    metaRows: [
      { label: "Trustpilot", value: "4.8 / 5 · 51 reviews" },
      { label: "Google Maps", value: "4.90 / 5 · 123 reviews" },
      { label: "TripAdvisor", value: "4.95 / 5 · 21 reviews" },
      { label: "Themes", value: "5 patterns" },
    ],
  },
  "our-story": {
    eyebrow: "Why JVTO · Our Story",
    eyebrowMeta: "FILE 004C",
    lede: "JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the Tourist Police experience of our founder, Mr. Sam.",
    metaRows: [
      { label: "2015", value: "Ijen Bondowoso Homestay" },
      { label: "2016", value: "PT incorporated" },
      { label: "2023", value: "TDUP formalized" },
      { label: "Evidence span", value: "11 years" },
    ],
  },
  "our-team": {
    eyebrow: "Why JVTO · Our Team",
    eyebrowMeta: "FILE 004D",
    lede: "7 guides and 7 drivers — individually named, photographed, and license-linked. Five guides hold HPWKI KTA credentials from BBKSDA-supervised volcanic safety training.",
    metaRows: [
      { label: "Guides", value: "7" },
      { label: "Drivers", value: "7" },
      { label: "KTA-credentialed", value: "11 registered" },
      { label: "Recruited from", value: "Bondowoso · Banyuwangi" },
    ],
  },
  "community-standards": {
    eyebrow: "Why JVTO · Community Standards",
    eyebrowMeta: "FILE 004E",
    lede: "JVTO publishes its rules, policies, and commitments before you pay anything. Guests who understand the terms before booking have better trips.",
    metaRows: [
      { label: "Policies", value: "Published pre-booking" },
      { label: "Binding document", value: "E-Voucher PDF" },
      { label: "Ijen briefing", value: "Miner etiquette" },
      { label: "Employment", value: "Local Boys · ecotourism-aligned" },
    ],
  },
};

const DEFAULT_HERO: HeroMeta = {
  eyebrow: "Why JVTO",
  lede: "Operational certainty for private East Java volcano tours.",
  metaRows: [],
};

type SlugCta = {
  h2: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  secondaryExternal?: boolean;
};

const SLUG_CTA: Record<string, SlugCta> = {
  "the-jvto-difference": {
    h2: "Don’t guess. Verify.",
    primaryHref: "/verify-jvto",
    primaryLabel: "Open the proof library",
    secondaryHref: "/tours",
    secondaryLabel: "Explore private tours",
  },
  "reviews": {
    h2: "Read the patterns. Then verify.",
    primaryHref: "/why-jvto/our-team",
    primaryLabel: "Meet the named crew",
    secondaryHref: "/verify-jvto",
    secondaryLabel: "Verify JVTO",
  },
  "our-story": {
    h2: "The same operation, documented.",
    primaryHref: "/why-jvto/our-team",
    primaryLabel: "Meet the team",
    secondaryHref: "/verify-jvto",
    secondaryLabel: "Verify JVTO",
  },
  "our-team": {
    h2: "Real people. Real credentials.",
    primaryHref: "/why-jvto/reviews",
    primaryLabel: "Read their reviews",
    secondaryHref: "/why-jvto/the-jvto-difference",
    secondaryLabel: "The JVTO Difference",
  },
  "community-standards": {
    h2: "Clear rules. Better trips.",
    primaryHref: "/policy",
    primaryLabel: "Read the full policies",
    secondaryHref: "/why-jvto/our-team",
    secondaryLabel: "Meet the team",
  },
};

const DEFAULT_CTA: SlugCta = {
  h2: "Don’t guess. Verify.",
  primaryHref: "/verify-jvto",
  primaryLabel: "Open the proof library",
  secondaryHref: "/tours",
  secondaryLabel: "Explore private tours",
};

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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9fce33" strokeWidth="2.5" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/why-jvto/${slug}`;
  const heroMeta = SLUG_HERO[slug] ?? DEFAULT_HERO;
  const slugCta = SLUG_CTA[slug] ?? DEFAULT_CTA;
  const currentHref = route;

  const [page, reviewsData] = await Promise.all([
    getPublicPageSnapshot(route, {
      allowDatabaseFallback: false,
      requiredContentFields: ["sections"],
    }),
    slug === "reviews" ? getReviewsForSchema().catch(() => []) : Promise.resolve([]),
  ]);
  const content = page.pageRow.content as any;
  if (!Array.isArray(content?.sections) || content.sections.length === 0) {
    return notFound();
  }

  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const h1 = content?.h1 ?? seo.title ?? "Why JVTO";
  const slugExtraSchemas =
    slug === "reviews"
      ? [
          buildWhyJvtoReviewsAggregateRatingSchema(),
          ...buildIndividualReviewSchemas(
            reviewsData as Awaited<ReturnType<typeof getReviewsForSchema>>,
          ),
        ].filter(Boolean)
      : undefined;

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={slugExtraSchemas}
      />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Why JVTO</Link>
            <span>›</span>
            <span className="text-white/70">{h1}</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              {heroMeta.eyebrow && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    {heroMeta.eyebrow}
                  </span>
                  {heroMeta.eyebrowMeta && (
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      {heroMeta.eyebrowMeta}
                    </span>
                  )}
                </div>
              )}
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {h1}
              </h1>
              {content?.hero_subhead && (
                <p className="text-white/80 text-[17px] font-semibold mb-3">{content.hero_subhead}</p>
              )}
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {heroMeta.lede}
              </p>
            </div>
            {heroMeta.metaRows.length > 0 && (
              <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
                {heroMeta.metaRows.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                    <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Article section — off-white, stacked ──────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Why JVTO
              </p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
                  const isActive = href === currentHref;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-jvto-navy text-white"
                          : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              {/* Lede paragraphs */}
              {Array.isArray(content?.lede) && content.lede.length > 0 && (
                <div className="mb-8">
                  <MarkdownRenderer markdown={content.lede.join("\n\n")} />
                </div>
              )}

              {/* Section nav (on-page TOC) */}
              <SectionNav items={content?.section_nav} />

              {/* Sections */}
              {Array.isArray(content?.sections) &&
                content.sections.map((sec: any) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    style={{ marginBottom: "3.5rem", scrollMarginTop: "7rem" }}
                  >
                    <h2
                      style={{
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

              {/* Fallback body_md */}
              {content?.body_md && (
                <section style={{ marginTop: "2.5rem" }}>
                  <MarkdownRenderer markdown={content.body_md} />
                </section>
              )}

              {/* FAQ */}
              {content?.faq && (
                <Faq items={content.faq} title={content?.faq_title ?? "FAQ"} />
              )}

              {/* Our team → safety cross-link */}
              {slug === "our-team" && (
                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #E3E0DA" }}>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange mb-2">
                    Safety on Tours
                  </div>
                  <Link href="/travel-guide/safety-on-tours" prefetch={false} className="text-[15px] font-semibold text-jvto-navy hover:text-jvto-orange transition-colors">
                    How JVTO manages safety on the road, at viewpoints, and on the mountain →
                  </Link>
                </div>
              )}
            </article>

          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            {slugCta.h2}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={slugCta.primaryHref}
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              {slugCta.primaryLabel} <ArrowRight />
            </Link>
            {slugCta.secondaryExternal ? (
              <a
                href={slugCta.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
              >
                {slugCta.secondaryLabel}
              </a>
            ) : (
              <Link
                href={slugCta.secondaryHref}
                prefetch={false}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
              >
                {slugCta.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
