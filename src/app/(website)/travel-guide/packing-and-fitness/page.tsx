import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/static-content";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";

export const revalidate = 86400;

const ROUTE = "/travel-guide/packing-and-fitness";
const SITE_URL = "https://javavolcano-touroperator.com";

// Fallback copy — only used if content/pages/travel-guide/packing-and-fitness.md
// is ever unavailable at build/runtime (should not happen; kept for safety).
const FALLBACK_SEO = {
  title: "Packing & Fitness Expectations — JVTO Travel Guide",
  description:
    "What to pack and how fit you need to be for Bromo, Ijen, Tumpak Sewu and Madakaripura — gear list, terrain demands, and what JVTO provides.",
};

const GUIDE_NAV = [
  { href: "/travel-guide", label: "Guide overview" },
  { href: "/travel-guide/ijen-health-screening", label: "Ijen Health Screening" },
  { href: "/travel-guide/packing-and-fitness", label: "Packing & Fitness" },
  { href: "/travel-guide/weather-and-closures", label: "Weather & Closures" },
  { href: "/travel-guide/safety-on-tours", label: "Safety on Tours" },
  { href: "/travel-guide/booking-information", label: "Booking Information" },
  { href: "/travel-guide/police-escort-for-groups", label: "Police Escort for Groups" },
  { href: "/travel-guide/faq", label: "FAQ" },
];

/**
 * Hero fact card — presentational chrome only. Difficulty bands summarise the
 * per-destination "Fitness level" statements in
 * content/pages/travel-guide/packing-and-fitness.md.
 */
const HERO_META_ROWS = [
  { label: "Bromo", value: "Easy–Moderate" },
  { label: "Ijen", value: "Moderate" },
  { label: "Tumpak Sewu", value: "Moderate" },
  { label: "Madakaripura", value: "Moderate" },
];

/**
 * Optional conditioning plan. Not part of the ported markdown SSOT — this is an
 * additive preparation aid rendered as page chrome, so it does not duplicate or
 * contradict any statement in packing-and-fitness.md.
 */
const TRAINING_PLAN = [
  "3 × per week: 45 min uphill walking on a treadmill at 6–8% incline.",
  "2 × per week: stair-master or actual stairs, 20 min.",
  "1 × per week: long walk, 90 min, with the day-pack you plan to bring.",
];

const RELATED_DESTINATIONS = [
  { href: "/destinations/ijen-crater", label: "Ijen Crater" },
  { href: "/destinations/mount-bromo", label: "Mount Bromo" },
  { href: "/destinations/tumpak-sewu-waterfall", label: "Tumpak Sewu Waterfall" },
];

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export async function generateMetadata(): Promise<Metadata> {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? FALLBACK_SEO.title;
  const description = page?.meta.description ?? FALLBACK_SEO.description;
  return buildStaticRouteMetadata(ROUTE, {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  });
}

export default async function PackingAndFitnessPage() {
  const page = loadStaticPage(ROUTE);
  const title = page?.meta.browserTitle ?? page?.meta.title ?? FALLBACK_SEO.title;
  const description = page?.meta.description ?? FALLBACK_SEO.description;
  const h1 = page?.meta.title ?? FALLBACK_SEO.title;
  const body = page?.body ?? "";
  const faqItems = (page?.faq ?? []).map((f) => ({ q: f.question, a: f.answer }));

  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}${ROUTE}#faq`,
        mainEntity: faqItems.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      }
    : null;

  const pageRow = {
    route: ROUTE,
    lang: "en",
    seo: { title, description },
    content: { h1 },
  };

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow}
        extraSchemas={[faqSchema].filter(Boolean) as any[]}
        suppressCmsFaq={true}
      />

      {/* ── Hero — navy ───────────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/travel-guide" prefetch={false} className="hover:text-white/70 transition-colors">
              Travel Guide
            </Link>
            <span>›</span>
            <span className="text-white/70">Packing &amp; Fitness</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Prep
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / FITNESS
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Packing &amp;{" "}
                <em className="italic">fitness expectations.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                A practical view on what physical effort each route requires,
                and how to train for it if you have a couple of months.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {HERO_META_ROWS.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">
                    {label}
                  </span>
                  <strong className="text-white text-sm font-semibold text-right">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Article — off-white, stacked ─────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">

            {/* Sidebar nav */}
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Travel Guide
              </p>
              <nav className="space-y-0.5">
                {GUIDE_NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={`block text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
                      href === ROUTE
                        ? "bg-jvto-navy text-white"
                        : "text-[#6b7280] hover:text-jvto-navy hover:bg-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/tours"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Browse tours <ArrowRight />
              </Link>
            </aside>

            {/* Article body — prose driven by content/pages/travel-guide/packing-and-fitness.md */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-6">
                Reading time · 5 min
              </p>

              <MarkdownRendererTravelGuide markdown={body} />

              {/* Optional conditioning plan — additive chrome, not in the SSOT markdown */}
              <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                <h2
                  className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-2"
                  style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
                >
                  Optional: an 8-week conditioning plan
                </h2>
                <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                  None of the routes above require training. If you would simply like the climbs to
                  feel easier — particularly the Ijen ascent — this is the pattern we suggest.
                </p>
                <ul className="space-y-3 mb-2 ml-1">
                  {TRAINING_PLAN.map((item) => (
                    <li
                      key={item}
                      className="text-[15px] text-[#6b7280] font-light leading-[1.6] flex gap-2"
                    >
                      <span className="text-jvto-orange mt-1 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                  Related Destinations
                </p>
                <div className="flex flex-wrap gap-4">
                  {RELATED_DESTINATIONS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      prefetch={false}
                      className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                    >
                      {label} →
                    </Link>
                  ))}
                </div>
              </div>

              <Faq items={faqItems} title="Packing & Fitness: Common Questions" />
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
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 4vw, 44px)",
            }}
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
