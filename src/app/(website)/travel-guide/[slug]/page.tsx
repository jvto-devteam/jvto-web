import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import {
  loadStaticPage,
  listPublishedStaticPages,
  buildStaticRouteMetadata,
} from "@/lib/static-content";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Slugs served from the ported static-content SSOT (content/pages/travel-guide/*.md)
 * rather than the DB (content_pages). Excludes the slugs that have their own
 * folder page — Next.js resolves a static folder segment before this dynamic
 * one, but the filter is kept explicit so this route never generates a
 * duplicate static param for them.
 */
const TRAVEL_GUIDE_FOLDER_ROUTED_SLUGS = new Set([
  "faq",
  "best-time-to-visit",
  "police-escort-for-groups",
  "rijik-monthly-closure",
  // Restored bespoke pages — each reads its own content/pages/travel-guide/*.md
  // via loadStaticPage() and keeps its hand-built tables / callouts / hero.
  "booking-information",
  "ijen-health-screening",
  "packing-and-fitness",
  "safety-on-tours",
  "weather-and-closures",
  "mount-bromo-logistics",
  "packing-list",
  "tumpak-sewu-logistics",
]);

const MIGRATED_TRAVEL_GUIDE_SLUGS = new Set(
  listPublishedStaticPages({ section: "travel-guide" })
    .map((p) => p.meta.route)
    .filter((route) => route.startsWith("/travel-guide/"))
    .map((route) => route.replace("/travel-guide/", ""))
    .filter((slug) => !TRAVEL_GUIDE_FOLDER_ROUTED_SLUGS.has(slug)),
);

export const dynamicParams = false;

const TRAVEL_GUIDE_DEST_LINKS: Record<
  string,
  Array<{ slug: string; name: string }>
> = {};

const GUIDE_NAV = [
  { href: "/travel-guide", label: "Guide overview" },
  { href: "/travel-guide/ijen-health-screening", label: "Ijen Health Screening" },
  { href: "/travel-guide/mount-bromo-logistics", label: "Mount Bromo Logistics" },
  { href: "/travel-guide/tumpak-sewu-logistics", label: "Tumpak Sewu Logistics" },
  { href: "/travel-guide/packing-list", label: "Packing List" },
  { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  { href: "/travel-guide/weather-and-closures", label: "Weather & Closures" },
  { href: "/travel-guide/safety-on-tours", label: "Safety on Tours" },
  { href: "/travel-guide/booking-information", label: "Booking Information" },
  { href: "/travel-guide/police-escort-for-groups", label: "Police Escort for Groups" },
  { href: "/travel-guide/faq", label: "FAQ" },
];

type HeroMeta = {
  eyebrow: string;
  lede: string;
  metaRows: Array<{ label: string; value: string }>;
};

const SLUG_HERO: Record<string, HeroMeta> = {
  "police-escort-for-groups": {
    eyebrow: "Authority · Police",
    lede: "When and how official traffic police escort is arranged for larger groups — always through formal channels.",
    metaRows: [
      { label: "Threshold", value: "Multiple vehicles" },
      { label: "Arranged by", value: "JVTO via formal request" },
      { label: "Authority", value: "Kepolisian RI" },
    ],
  },
};

const DEFAULT_HERO: HeroMeta = {
  eyebrow: "Travel Guide",
  lede: "Essential information for your private East Java tour.",
  metaRows: [],
};

export function generateStaticParams() {
  return [...MIGRATED_TRAVEL_GUIDE_SLUGS].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const page = loadStaticPage(`/travel-guide/${slug}`);
  if (!page) return { title: "Page Not Found" };
  return buildStaticRouteMetadata(page.meta.route, {
    title: page.meta.browserTitle ?? page.meta.title,
    description: page.meta.description,
  });
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function TravelGuideDynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = `/travel-guide/${slug}`;
  const destLinks = TRAVEL_GUIDE_DEST_LINKS[slug] ?? [];
  const heroMeta = SLUG_HERO[slug] ?? DEFAULT_HERO;
  const currentHref = route;

  const staticPage = loadStaticPage(route);
  if (!staticPage) return notFound();

  const h1 = staticPage.meta.title;
  const body = staticPage.body ?? "";
  const faqItems = staticPage.faq ?? [];
  const faqItemsForDisplay = faqItems.map((f) => ({ q: f.question, a: f.answer }));
  const faqTitle = "FAQ";
  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${staticPage.canonicalUrl}#faq`,
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;
  const slugExtraSchemas = [faqSchema].filter(Boolean);
  const suppressCmsFaqValue = true;
  const pageRowForJsonLd = {
    route: staticPage.meta.route,
    lang: "en",
    seo: { title: staticPage.meta.title, description: staticPage.meta.description },
    content: { h1 },
  };

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
            <Link href="/travel-guide" prefetch={false} className="hover:text-white/70 transition-colors">Travel Guide</Link>
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
                    FILE 005 / GUIDE
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
                Travel Guide
              </p>
              <nav className="space-y-0.5">
                {GUIDE_NAV.map(({ href, label }) => {
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
              <MarkdownRendererTravelGuide markdown={body} />
              {faqItemsForDisplay && faqItemsForDisplay.length > 0 && (
                <Faq items={faqItemsForDisplay} title={faqTitle} />
              )}
              {destLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                    Related Destinations
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {destLinks.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/destinations/${d.slug}`}
                        prefetch={false}
                        className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                      >
                        {d.name} →
                      </Link>
                    ))}
                  </div>
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
            Ready for operational <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Explore tours <ArrowRight />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
