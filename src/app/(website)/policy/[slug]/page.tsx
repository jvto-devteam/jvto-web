import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  buildResolvedFaqSchema,
  resolveFaqsForPage,
} from "@/lib/content/resolveFaqs";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  getPublicPageSnapshotRecord,
  listPublicPageRoutesByPrefix,
} from "@/lib/publicContent/pageSnapshots";
import {
  loadStaticPage,
  listPublishedStaticPages,
  buildStaticRouteMetadata,
} from "@/lib/static-content";
import {
  buildJvtoTravelCreditAnnouncementSchema,
  buildPolicyWebPageSchema,
  POLICY_SLUG_MENTIONS,
} from "@/lib/schemas/buildPolicySchemas";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

/**
 * Slugs served from the ported static-content SSOT (content/pages/policy/*)
 * rather than the DB (content_pages). All 3 slugs currently named here also
 * have their own dedicated folder page (booking-payment-cancellation/,
 * inclusions-exclusions/, privacy/) — Next.js resolves that static folder
 * segment before this dynamic one, so this route has zero live traffic for
 * them today. It is wired anyway so a future policy slug without a dedicated
 * folder page yet is served correctly from content automatically.
 */
const MIGRATED_POLICY_SLUGS = new Set(
  listPublishedStaticPages({ section: "policy" })
    .map((p) => p.meta.route)
    .filter((route) => route.startsWith("/policy/"))
    .map((route) => route.replace("/policy/", "")),
);

const POLICY_NAV = [
  { href: "/policy", label: "Policy Hub" },
  { href: "/policy/booking-payment-cancellation", label: "Booking, Payment & Cancellation" },
  { href: "/policy/inclusions-exclusions", label: "Inclusions & Exclusions" },
  { href: "/policy/privacy", label: "Privacy & Data Protection" },
];

type HeroMeta = {
  eyebrow: string;
  lede: string;
  metaRows: Array<{ label: string; value: string }>;
};

const SLUG_HERO: Record<string, HeroMeta> = {
  "booking-payment-cancellation": {
    eyebrow: "Policy · Booking",
    lede: "How bookings are confirmed, what payment is due and when, and exactly what happens if plans change — issued by PT Java Volcano Rendezvous.",
    metaRows: [
      { label: "Standard deposit", value: "20%" },
      { label: "Cancellation cut-off", value: "48 hours" },
      { label: "Pricing currency", value: "IDR" },
      { label: "Travel Credit", value: "Non-expiring" },
    ],
  },
  "inclusions-exclusions": {
    eyebrow: "Policy · Inclusions",
    lede: "What is — and is not — included in a confirmed JVTO private tour. Only what is written on your Official E-Voucher is contractually binding.",
    metaRows: [
      { label: "Binding rule", value: "Write-it-to-bind-it" },
      { label: "Tour type", value: "Private, all-inclusive" },
      { label: "Vehicle", value: "By group size" },
      { label: "Binding document", value: "E-Voucher PDF" },
    ],
  },
  "privacy": {
    eyebrow: "Policy · Privacy",
    lede: "What personal data JVTO collects, why, how it is used, and when it may be shared — only as needed to operate your booking and meet applicable requirements.",
    metaRows: [
      { label: "Card data stored", value: "Never" },
      { label: "Payment gateway", value: "PCI DSS-compliant" },
      { label: "Data shared", value: "Only as needed" },
      { label: "Access & deletion", value: "On request" },
    ],
  },
};

const DEFAULT_HERO: HeroMeta = {
  eyebrow: "Policy",
  lede: "JVTO publishes its terms in full — so you know exactly what you are buying, before you confirm.",
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
  "booking-payment-cancellation": {
    h2: "Questions before you book?",
    primaryHref: "/tours",
    primaryLabel: "Explore tours",
    secondaryHref: "https://wa.me/6282244788833",
    secondaryLabel: "Contact us on WhatsApp",
    secondaryExternal: true,
  },
  "inclusions-exclusions": {
    h2: "Know exactly what you're buying.",
    primaryHref: "/tours",
    primaryLabel: "Explore tours",
    secondaryHref: "/policy/booking-payment-cancellation",
    secondaryLabel: "Booking policy",
  },
  "privacy": {
    h2: "Your data, handled carefully.",
    primaryHref: "/policy",
    primaryLabel: "All policies",
    secondaryHref: "https://wa.me/6282244788833",
    secondaryLabel: "Contact us on WhatsApp",
    secondaryExternal: true,
  },
};

const DEFAULT_CTA: SlugCta = {
  h2: "Clear terms. No surprises.",
  primaryHref: "/tours",
  primaryLabel: "Explore tours",
  secondaryHref: "/contact",
  secondaryLabel: "Contact the team",
};

export function generateStaticParams() {
  const dbSlugs = listPublicPageRoutesByPrefix("/policy")
    .map((route) => route.replace("/policy/", ""))
    .filter((slug) => !MIGRATED_POLICY_SLUGS.has(slug));
  return [...MIGRATED_POLICY_SLUGS, ...dbSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (MIGRATED_POLICY_SLUGS.has(slug)) {
    const page = loadStaticPage(`/policy/${slug}`);
    if (!page) return { title: "Page Not Found" };
    return buildStaticRouteMetadata(page.meta.route, {
      title: page.meta.browserTitle ?? page.meta.title,
      description: page.meta.description,
    });
  }

  // Unmigrated slug — existing DB path, unchanged.
  const page = await getPublicPageSnapshot(`/policy/${slug}`, {
    allowDatabaseFallback: false,
    requiredContentFields: ["body_md"],
  });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  const content = (page.pageRow.content as Record<string, any> | null) ?? {};

  if (typeof content.body_md !== "string" || content.body_md.trim().length === 0) {
    return { title: "Page Not Found" };
  }

  return {
    title: seo.title ?? content.h1 ?? page.pageRow.route,
    description: seo.description ?? undefined,
  };
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/policy/${slug}`;
  const heroMeta = SLUG_HERO[slug] ?? DEFAULT_HERO;
  const slugCta = SLUG_CTA[slug] ?? DEFAULT_CTA;
  const currentHref = route;

  let pageRowForJsonLd: { route: string; lang: string; seo: any; content: any };
  let suppressCmsFaqValue: boolean;
  let h1: string;
  let body: string;
  let faqItemsForDisplay: Array<{ q: string; a: string }> | undefined;
  let faqTitle = "FAQ";
  let slugExtraSchemas: unknown[];

  if (MIGRATED_POLICY_SLUGS.has(slug)) {
    // Migrated slug — served from the ported static-content SSOT (content/pages/policy/*).
    const staticPage = loadStaticPage(route);
    if (!staticPage) return notFound();

    h1 = staticPage.meta.title;
    body = staticPage.body ?? "";

    const faqResolution = await resolveFaqsForPage(route);
    const mentionsTermIds = POLICY_SLUG_MENTIONS[slug] ?? [];
    const policyAnchorSchema = buildPolicyWebPageSchema({
      subpath: slug,
      name: staticPage.meta.browserTitle ?? staticPage.meta.title,
      description: staticPage.meta.description ?? `JVTO ${h1} policy.`,
      mentionsTermIds,
    });
    const faqSchema = buildResolvedFaqSchema(faqResolution, route);
    const announcementSchema =
      slug === "booking-payment-cancellation"
        ? buildJvtoTravelCreditAnnouncementSchema()
        : null;

    slugExtraSchemas = [policyAnchorSchema, faqSchema, announcementSchema].filter(Boolean);
    suppressCmsFaqValue = faqResolution.suppressCmsFaq;

    // None of the 3 known policy content files declare a faqKey, so
    // staticPage.faq is never populated — there is no page.faq to render
    // inline here. If this route's FAQ source resolves to 'cms' (no
    // narrative_claims, no CANONICAL_FAQ_REGISTRY entry — as it will for any
    // future policy slug that isn't booking-payment-cancellation or
    // inclusions-exclusions), buildResolvedFaqSchema() returns null and the
    // only FAQPage schema comes from PageJsonLdCombined's own
    // buildFaqJsonLdFromContent(pageRow.content.faq) fallback — feed it from
    // the static (DB-free) content_pages snapshot, same fix already applied
    // to policy/page.tsx and policy/privacy/page.tsx.
    const cmsContent = getPublicPageSnapshotRecord(route)?.content ?? {};
    pageRowForJsonLd = {
      route: staticPage.meta.route,
      lang: "en",
      seo: {
        title: staticPage.meta.browserTitle ?? staticPage.meta.title,
        description: staticPage.meta.description,
      },
      content: { h1, faq: cmsContent.faq, faq_title: cmsContent.faq_title },
    };
  } else {
    // Unmigrated slug — existing DB path, unchanged.
    const [page, faqResolution] = await Promise.all([
      getPublicPageSnapshot(route, {
        allowDatabaseFallback: false,
        requiredContentFields: ["body_md"],
      }),
      resolveFaqsForPage(route),
    ]);
    const content = page.pageRow.content as any;
    const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
    h1 = content?.h1 ?? seo.title ?? "Policy";
    body = content?.body_md ?? "";
    faqItemsForDisplay = content?.faq;
    faqTitle = content?.faq_title ?? "FAQ";

    const mentionsTermIds = POLICY_SLUG_MENTIONS[slug] ?? [];
    const policyAnchorSchema = buildPolicyWebPageSchema({
      subpath: slug,
      name: seo.title ?? h1,
      description: seo.description ?? `JVTO ${h1} policy.`,
      mentionsTermIds,
    });
    const faqSchema = buildResolvedFaqSchema(faqResolution, route);
    const announcementSchema =
      slug === "booking-payment-cancellation"
        ? buildJvtoTravelCreditAnnouncementSchema()
        : null;

    slugExtraSchemas = [policyAnchorSchema, faqSchema, announcementSchema].filter(Boolean);
    suppressCmsFaqValue = faqResolution.suppressCmsFaq;
    pageRowForJsonLd = page.pageRow as any;
  }

  if (!body.trim().length) return notFound();

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRowForJsonLd}
        extraSchemas={slugExtraSchemas}
        suppressCmsFaq={suppressCmsFaqValue}
      />

      {/* ── Interior hero — navy ───────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/policy" prefetch={false} className="hover:text-white/70 transition-colors">Policy</Link>
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
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    VERSION 2026-01-17 (v5)
                  </span>
                </div>
              )}
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {h1}
              </h1>
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
                Policy
              </p>
              <nav className="space-y-0.5">
                {POLICY_NAV.map(({ href, label }) => {
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
                href="/tours"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Browse tours <ArrowRight />
              </Link>
            </aside>

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <MarkdownRenderer markdown={body} />
              {faqItemsForDisplay && faqItemsForDisplay.length > 0 && (
                <Faq items={faqItemsForDisplay} title={faqTitle} />
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
