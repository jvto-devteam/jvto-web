// app/(website)/why-jvto/reviews/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import { Faq } from "@/components/content/Faq";
import { loadEcosystemPage, buildStaticRouteMetadata } from "@/lib/ecosystemContent/staticPageAdapter";
import { getReviewsForSchema } from "@/lib/queries/schemaReviews";
import { buildIndividualReviewSchemas } from "@/lib/schemas/buildWhyJvtoSchemas";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";
import { REVIEW_THEMES, type ReviewTheme } from "./reviewThemes";
import { whyLede } from "@/lib/ecosystemContent/whyJvto";

export const revalidate = 86400;

const ROUTE = "/why-jvto/reviews";

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadEcosystemPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? "Guest Reviews · Why JVTO";
  const description =
    page?.meta.description ??
    "Reviews organized by platform and by theme — Trustpilot 4.8, Google 4.90, TripAdvisor 4.95. Five recurring patterns across 195+ verified reviews from independent guests.";
  return buildStaticRouteMetadata(ROUTE, { title, description });
}

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function WhyJvtoReviewsPage() {
  const page = await loadEcosystemPage(ROUTE);
  const pageContentPayload = (page?.raw as any)?.page?.content?.payload?.pageContent ?? {};
  // FALLBACK: REVIEW_THEMES (imported above) — used only if ekosistem doesn't
  // return a `pageContent.reviewThemes` for this route.
  const reviewThemes: ReviewTheme[] = pageContentPayload.reviewThemes ?? REVIEW_THEMES;
  const sections = page?.sections ?? [];
  const faqItems = (page?.faq ?? []).map((item) => ({
    q: item.question,
    a: item.answer,
  }));
  // Preserved DB exception: real review records feed the individual Review
  // JSON-LD nodes. Dynamic data is allowed to stay DB-owned.
  const reviewsData = await getReviewsForSchema().catch(() => []);
  // Per-platform figures come from the ekosistem review-platforms.json record —
  // its own `_comment` declares it the single source of truth for these totals.
  // Empty array (record unreachable) => the platform blocks render without
  // numbers rather than showing a figure nobody can vouch for.
  const reviewProfiles = (await getEcosystemReviewProfiles()).filter(
    (p) => typeof p.rating === "number" && typeof p.reviewCount === "number",
  );
  const excerptReviews = reviewsData.slice(0, 8).map((review) => ({
    tag: `${review.platform} · ${review.star ?? 5} star`,
    quote: review.review,
    name: review.customer_name,
    source: `${review.platform} · ${review.date.toISOString().slice(0, 10)}`,
  }));
  // aggregateRating no longer assembled here — it's an inline property of the
  // Organization node PageJsonLdCombined already reads from ekosistem
  // (Bagian 1 of the 2026-08-20 schema-rendering-consolidation design).
  const extraSchemas = buildIndividualReviewSchemas(reviewsData);

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title: page?.meta.title, description: page?.meta.description },
    content: { h1: page?.meta.title ?? "Reviews" },
  };
  const sectionBody = (section: (typeof sections)[number]) =>
    (section.blocks ?? [])
      .filter((b: any) => b.type === "markdown")
      .map((b: any) => b.body_md)
      .join("\n\n");

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={extraSchemas as any} suppressCmsFaq />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Why JVTO</Link>
            <span>›</span>
            <span className="text-white/70">Reviews</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · Reviews
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">FILE 004B</span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {page?.meta.title ?? "Guest Reviews"}
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                {whyLede(page) || page?.meta.description || "Reviews organized by platform and by theme — so you can check patterns, not cherry-picked excerpts."}
              </p>
              {(page?.lede?.length ?? 0) > 1 ? (
                <div className="mt-5 space-y-2 max-w-[58ch]">
                  {page!.lede!.slice(1).map((line) => (
                    <p key={line} className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-white/45">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                ...reviewProfiles.slice(0, 3).map((platform) => ({
                  label: platform.platform,
                  value: `${platform.rating} / 5 · ${platform.reviewCount}`,
                })),
                { label: "Themes", value: `${reviewThemes.length} patterns` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article section — off-white, stacked ──────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">Why JVTO</p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
                  const isActive = href === ROUTE;
                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                        isActive ? "bg-jvto-navy text-white" : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
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

            <article className="min-w-0">
              {sections.length > 0 && (
                <div className="grid gap-5 mb-14">
                  {sections.map((section) => (
                    <section
                      key={section.id}
                      className="bg-white border border-[#E3E0DA] rounded-xl p-7 jvto-prose"
                    >
                      <h2
                        className="font-black text-jvto-navy mb-5"
                        style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(22px,2.5vw,32px)", letterSpacing: "-0.02em" }}
                      >
                        {section.title}
                      </h2>
                      <MarkdownRenderer markdown={sectionBody(section)} />
                    </section>
                  ))}
                </div>
              )}

              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">Platform Aggregate</span>
              <h2 className="font-black text-jvto-navy mb-8" style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-0.02em" }}>
                Verified across three platforms.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
                {reviewProfiles.slice(0, 3).map((p) => (
                  <div key={p.platform} className="bg-white border border-[#E3E0DA] rounded-xl p-9 flex flex-col gap-2" style={{ boxShadow: "0 1px 8px 0 rgba(13,27,42,0.06)" }}>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#9ca3af]">{p.platform}</span>
                    <span className="font-black text-jvto-navy leading-none" style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "56px", letterSpacing: "-0.03em" }}>
                      {p.rating}
                      <small className="text-[22px] font-medium text-[#9ca3af]"> / 5</small>
                    </span>
                    <div className="flex gap-0.5 text-[#F5A623]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon key={s} />
                      ))}
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.14em] text-[#9ca3af] mt-auto pt-4 flex justify-between" style={{ borderTop: "1px solid #E3E0DA" }}>
                      <span>{p.reviewCount} reviews</span>
                      <span>{p.verifiedAt ? `Verified ${p.verifiedAt}` : "Verified externally"}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-mono text-[11px] tracking-[0.12em] text-[#9ca3af] leading-[1.9] mb-14">
                Live profiles:{" "}
                {reviewProfiles.slice(0, 3).map((p, i, arr) => (
                  <span key={p.platform}>
                    <a href={p.profileUrl} target="_blank" rel="noopener noreferrer" className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity">
                      {p.platform}
                    </a>
                    {i < arr.length - 1 && " · "}
                  </span>
                ))}
              </p>

              <hr className="border-0 border-t border-[#E3E0DA] mb-14" />

              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">What guests say · Five themes</span>
              <h2 className="font-black text-jvto-navy mb-8" style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-0.02em" }}>
                Five recurring patterns.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {reviewThemes.map((t) => (
                  <div key={t.themeId} className="bg-white border border-[#E3E0DA] rounded-xl p-8 flex flex-col gap-3" style={{ boxShadow: "0 1px 8px 0 rgba(13,27,42,0.06)" }}>
                    <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-jvto-orange">{t.themeId} · {t.claimLinkage}</span>
                    <h3 className="font-bold text-jvto-navy" style={{ fontSize: "22px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>{t.theme}</h3>
                    <p className="text-[#6b7280] text-[14.5px] font-light leading-relaxed">{t.pattern}</p>
                  </div>
                ))}
              </div>

              <hr className="border-0 border-t border-[#E3E0DA] mb-14" />

              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">Selected excerpts</span>
              <h2 className="font-black text-jvto-navy mb-8" style={{ fontFamily: "Raleway, Inter, sans-serif", fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-0.02em" }}>
                In guests&apos; own words.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {excerptReviews.map((e, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange">{e.tag}</span>
                    <p className="text-jvto-navy leading-snug" style={{ fontSize: "19px", lineHeight: 1.4 }}>{e.quote}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-semibold text-[13px] text-jvto-navy">{e.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af]">{e.source}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 border border-[#E3E0DA] rounded-xl overflow-hidden">
                <div className="px-6 py-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] block mb-3">Named guide attribution</span>
                  <p className="text-jvto-navy text-[15px] leading-relaxed font-light">
                    Reviews that name guides — Anjas, Taufik, Rendi, Gufron, Kiki, Fauzi, Boy (Ahboy) — are linked to their profiles in{" "}
                    <Link href="/why-jvto/our-team" prefetch={false} className="text-jvto-orange border-b border-current hover:opacity-75 transition-opacity">
                      Our Team
                    </Link>
                    . Each profile includes the guide&apos;s KTA credential, languages, routes, and selected review mentions. Named guides are verified against the HPWKI crew registry, not sourced from freelance marketplaces.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {faqItems.length ? (
        <section
          className="bg-white py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.08)" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <Faq
              items={faqItems}
              title="Reviews: Common Questions"
              eyebrow="FAQ"
            />
          </div>
        </section>
      ) : null}

      {/* ── CTA — navy, stacked ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.04] mb-4"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px,4vw,56px)" }}
          >
            Read the patterns. <span className="text-jvto-orange">Then verify.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/why-jvto/our-team" prefetch={false} className="inline-flex items-center gap-2 bg-jvto-orange text-white font-bold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-[#C4520A] transition-colors">
              Meet the named crew <ArrowRight />
            </Link>
            <Link href="/verify-jvto" prefetch={false} className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-[12px] text-[15px] hover:bg-white/10 transition-colors">
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
