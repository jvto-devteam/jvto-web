import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/travel-guide/tumpak-sewu-logistics";
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

const CONDITIONS = [
  { key: "Best season", value: "April–October (dry)" },
  { key: "Avoid", value: "January–February (peak monsoon)" },
  { key: "Footwear", value: "Hiking shoes that grip wet rock" },
  { key: "Bag", value: "Dry bag for phone/wallet" },
];

const ROUTE_STEPS = [
  "Panorama viewpoint (rim) — first stop, photo opportunity.",
  "Stairs into the canyon (~600 steps, irregular, slippery in places).",
  "Bamboo ladder section — assisted by local guides.",
  "River crossing (knee-deep in dry season, waist-deep in monsoon).",
  "Base of falls — wide pool, water spray, dramatic light through the gorge.",
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
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? "Tumpak Sewu Logistics: Trek & Safety — JVTO Travel Guide",
    description:
      seo.description ??
      "Canyon descent, river crossings, and fitness expectations for Java's most dramatic waterfall trail.",
    openGraph: {
      title: seo.title ?? "Tumpak Sewu Logistics — JVTO Travel Guide",
      description:
        seo.description ??
        "What to expect on the Tumpak Sewu canyon descent — route, conditions, and safety.",
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function TumpakSewuLogisticsPage() {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={[faqNode].filter(Boolean)}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
            <span className="text-white/70">Tumpak Sewu Logistics</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Logistics
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / TUMPAK-SEWU
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Tumpak Sewu:{" "}
                <em className="italic">trek &amp; safety.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                The thousand-stream waterfall is reached by a steep, slippery
                descent through a jungle ravine — visually unmatched, physically
                demanding. Here&#39;s what to expect.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Trek length", value: "~2 km descent" },
                { label: "Difficulty", value: "Moderate" },
                { label: "Footwear", value: "Grippy hiking shoes" },
                { label: "Time on-site", value: "2–3 hours" },
              ].map(({ label, value }) => (
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
                {GUIDE_NAV.map(({ href, label }) => {
                  const isActive = href === ROUTE;
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
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-6">
                Reading time · 4 min
              </p>

              <p className="text-[16px] text-jvto-navy font-medium leading-[1.6] mb-8 border-l-2 border-jvto-orange pl-4">
                The viewpoint at the rim takes 10 minutes. The descent into the
                canyon takes 90 minutes if you take it slowly. You will get wet.
                Bring shoes that grip wet stone.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                The route
              </h2>
              <ol className="list-none p-0 m-0 mb-10 space-y-0">
                {ROUTE_STEPS.map((step, i) => (
                  <li
                    key={i}
                    className="grid gap-x-4 py-4 border-t border-[#E3E0DA] last:border-b"
                    style={{ gridTemplateColumns: "32px 1fr" }}
                  >
                    <span
                      className="font-mono text-[12px] font-bold text-jvto-orange bg-orange-50 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0"
                    >
                      {i + 1}
                    </span>
                    <span className="text-[15px] text-[#6b7280] font-light leading-[1.6] pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                When NOT to go
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                During and immediately after heavy rain, the canyon floor floods
                rapidly. Flash floods are real. JVTO guides cancel descent if
                rainfall in the previous 12 hours exceeds threshold; we
                substitute Goa Tetes (a nearby cave system) or reschedule.
              </p>

              {/* Data box — conditions */}
              <div className="border border-[#E3E0DA] rounded-xl overflow-hidden mb-6">
                {CONDITIONS.map((row, i) => (
                  <div
                    key={row.key}
                    className="flex justify-between items-start px-4 py-3"
                    style={{
                      borderBottom:
                        i < CONDITIONS.length - 1 ? "1px solid #E3E0DA" : undefined,
                    }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] pt-0.5">
                      {row.key}
                    </span>
                    <span className="text-jvto-navy text-[14px] font-medium text-right max-w-[60%]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                  Related Destination
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/destinations/tumpak-sewu-waterfall"
                    prefetch={false}
                    className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                  >
                    Tumpak Sewu Waterfall →
                  </Link>
                </div>
              </div>
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
