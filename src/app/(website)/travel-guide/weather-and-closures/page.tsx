import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/travel-guide/weather-and-closures";
const SITE_URL = "https://javavolcano-touroperator.com";

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
  const { pageRow } = await getPublicPageSnapshot(ROUTE, {
    allowDatabaseFallback: false,
  });
  const seo = (pageRow.seo as Record<string, any> | null) ?? {};
  const title = seo.title ?? "Weather & Closures — JVTO Travel Guide";
  const description =
    seo.description ??
    "PVMBG alerts, seasonal access windows, scheduled closures, and how JVTO reroutes your East Java volcano tour when conditions change.";
  return {
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
  };
}

export default async function WeatherAndClosuresPage() {
  const [{ pageRow }, faqResolution] = await Promise.all([
    getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false }),
    resolveFaqsForPage(ROUTE),
  ]);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow}
        extraSchemas={[faqNode].filter(Boolean)}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      {/* ── Interior hero — navy ────────────────────────────────────────── */}
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
            <span className="text-white/70">Weather &amp; Closures</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Conditions
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / WEATHER
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Weather,{" "}
                <em className="italic">PVMBG alerts &amp; closures.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                When the volcanoes are off-limits, when the rains close the trails, and how JVTO
                reroutes without leaving you in a hotel for two days.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Dry season", value: "Apr–Oct" },
                { label: "Wet season", value: "Nov–Mar" },
                { label: "Best for Ijen", value: "Jun–Sep" },
                { label: "PVMBG", value: "Always primary" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">
                    {label}
                  </span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Article section — off-white, stacked ───────────────────────── */}
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

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-orange mb-4 block">
                Reading time · 4 min
              </span>
              <p className="text-[16px] text-[#6b7280] leading-[1.7] mb-8 font-medium">
                PVMBG (Volcanology of Indonesia) is the only voice that matters on closure decisions.
                If they raise alert status, we do not enter.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Seasonal expectations
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                Bromo and Ijen are best in dry season (April through October). Visibility at sunrise is
                highest in July and August, but those are the coldest months too — pack accordingly.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                What triggers closures
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "Increased volcanic gas emissions (sulfur dioxide above safe threshold)",
                  "Seismic activity flagged by PVMBG",
                  "Heavy rainfall causing flash-flood risk in Tumpak Sewu",
                  "National observance / cultural ceremony days",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-[15px] text-[#6b7280] font-light leading-[1.6] flex gap-2"
                  >
                    <span className="text-jvto-orange mt-1 flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Scheduled closures you can plan around
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-3">
                Two closures are known in advance, and JVTO schedules around both:
              </p>
              <ul className="space-y-3 mb-6 ml-4">
                <li className="text-[15px] text-[#6b7280] font-light leading-[1.6] flex gap-2">
                  <span className="text-jvto-orange mt-1 flex-shrink-0">→</span>
                  <span>
                    <strong className="font-semibold text-jvto-navy">
                      Ijen monthly closure (Ijen Rijik).
                    </strong>{" "}
                    Kawah Ijen closes to all tourism and mining on the{" "}
                    <strong className="font-semibold text-jvto-navy">
                      first Friday of every month
                    </strong>{" "}
                    for ecosystem cleaning. Guests booked through JVTO are never caught out by it.
                  </span>
                </li>
                <li className="text-[15px] text-[#6b7280] font-light leading-[1.6] flex gap-2">
                  <span className="text-jvto-orange mt-1 flex-shrink-0">→</span>
                  <span>
                    <strong className="font-semibold text-jvto-navy">Yadnya Kasada.</strong> The
                    annual Tengger Hindu ceremony on the Bromo caldera floor follows the lunar calendar
                    and shifts each year; the Bromo area becomes extremely crowded. JVTO activates its
                    Plan-B framework for bookings in this window.
                  </span>
                </li>
              </ul>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                JVTO reroute policy
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                If your primary site is closed, we use an alternative-route approach and substitute a
                same-day equivalent. A closed Ijen becomes Bromo + Madakaripura; a closed Bromo
                becomes Tumpak Sewu + Goa Tetes. No guest is left in a hotel for two days. Where a
                closure makes the program unworkable, we reschedule or issue Travel Credit per our{" "}
                <Link
                  href="/policy/booking-payment-cancellation"
                  prefetch={false}
                  className="text-jvto-navy font-medium underline decoration-jvto-orange/30 hover:decoration-jvto-orange transition-colors"
                >
                  cancellation policy
                </Link>{" "}
                — JVTO uses Lifetime Travel Credit rather than cash refunds.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ────────────────────────────────────────── */}
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
