import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/travel-guide/packing-list";
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

const TEMP_DATA = [
  { key: "Bromo lowest temp", value: "0°C (July–August)" },
  { key: "Ijen wind chill", value: "−5°C at the rim" },
  { key: "Lowland day temp", value: "28–32°C" },
  { key: "Tumpak Sewu humidity", value: "95%+ in canyon" },
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
  const title = seo.title ?? "Packing List for East Java — JVTO Travel Guide";
  const description =
    seo.description ??
    "What to bring to Bromo, Ijen, and Tumpak Sewu: clothing layers, headlamp, footwear, equipment, and personal items for East Java's tropical-to-alpine climate.";
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

export default async function PackingListPage() {
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
            <span className="text-white/70">Packing List</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Prep
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / PACKING
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                What to pack <em className="italic">for East Java.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                East Java spans tropical lowlands and 2,300+ metre volcanic rims in one trip. Layers,
                grip, and a headlamp are non-negotiable.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Climate", value: "Tropical → alpine" },
                { label: "Temp range", value: "5°C – 32°C" },
                { label: "Bag size", value: "40–60L sufficient" },
                { label: "Total layers", value: "5+" },
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
                Most travelers underpack for the cold, overpack for the heat, and forget the headlamp.
                This list fixes that.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Clothing — base layers
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "Thermal long-sleeve top (merino or synthetic — not cotton)",
                  "Thermal leggings (one pair)",
                  "Quick-dry t-shirts × 3",
                  "Hiking pants × 2 (one quick-dry, one warm)",
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
                Clothing — outer layers
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "Fleece or mid-layer down jacket",
                  "Windproof + waterproof shell",
                  "Buff / neck scarf (for sulfur protection at Ijen)",
                  "Beanie and gloves",
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
                Footwear
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "Trail running shoes or light hiking shoes with grip",
                  "Sandals for lodge / clinic visits",
                  "Thick wool socks × 3",
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
                Equipment
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "Headlamp with spare batteries",
                  "Dry bag for phone / wallet (Tumpak Sewu)",
                  "Refillable water bottle × 1L",
                  "Power bank",
                  "Universal travel adapter (Indonesia uses Type C/F)",
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
                Personal &amp; medical
              </h2>
              <ul className="space-y-2 mb-8 ml-4">
                {[
                  "Personal medication (full course + 3 days buffer)",
                  "Sunscreen SPF 50",
                  "Lip balm (the rim air is very dry)",
                  "Hand sanitizer",
                  "Small first-aid kit (we carry one too)",
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

              {/* Temperature data box */}
              <div className="border border-[#E3E0DA] rounded-xl overflow-hidden mb-6">
                {TEMP_DATA.map((row, i) => (
                  <div
                    key={row.key}
                    className="flex justify-between items-start px-4 py-3"
                    style={{
                      borderBottom:
                        i < TEMP_DATA.length - 1 ? "1px solid #E3E0DA" : undefined,
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
