import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/travel-guide/mount-bromo-logistics";
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

const VIEWPOINTS = [
  { key: "King Kong Hill", value: "Mid-elevation, balanced light, less crowded" },
  { key: "Penanjakan 1", value: "Highest, most iconic, busiest" },
  { key: "Seruni Point", value: "Lowest, quietest, partial caldera view" },
  { key: "Mentigen Hill", value: "Walking-distance from Cemoro Lawang" },
];

const NIGHT_SEQUENCE = [
  { time: "00:30", desc: "Pickup at your hotel in Surabaya / Probolinggo / Cemoro Lawang." },
  { time: "02:30", desc: "Arrive at Cemoro Lawang. Hot drink stop." },
  { time: "03:15", desc: "Transfer to private 4WD jeep." },
  { time: "04:30", desc: "King Kong Hill or Penanjakan 1 viewpoint (your choice)." },
  { time: "05:20", desc: "Sunrise over the Tengger caldera." },
  { time: "06:30", desc: "Descend to the sea of sand for the crater walk." },
  { time: "09:00", desc: "Whispering Sands and Teletubbies Hill." },
  { time: "11:00", desc: "Return to Cemoro Lawang for breakfast." },
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
    title: seo.title ?? "Mount Bromo Logistics: Jeep, Timing & Sunrise — JVTO Travel Guide",
    description:
      seo.description ??
      "Private jeep, sunrise timing, and altitude preparation — what you need to know before arriving at the Tengger caldera.",
    openGraph: {
      title: seo.title ?? "Mount Bromo Logistics — JVTO Travel Guide",
      description:
        seo.description ??
        "Bromo sunrise logistics: jeep, viewpoints, night sequence, and what to wear.",
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function MountBromoLogisticsPage() {
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
            <span className="text-white/70">Mount Bromo Logistics</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Logistics
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / BROMO-LOGISTICS
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Mount Bromo:{" "}
                <em className="italic">jeep, timing &amp; sunrise.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                Bromo sunrise is the most-photographed scene in East Java. It
                also has the busiest logistics. Here&#39;s exactly how JVTO
                sequences the night so your private vehicle gets the right
                viewpoint.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Altitude", value: "2,329 m" },
                { label: "Sunrise", value: "~05:20" },
                { label: "Pickup", value: "00:30–01:00" },
                { label: "Vehicle", value: "4WD jeep" },
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
                Reading time · 5 min
              </p>

              <p className="text-[16px] text-jvto-navy font-medium leading-[1.6] mb-8 border-l-2 border-jvto-orange pl-4">
                The Bromo sunrise window is short, the access road is
                single-lane in places, and the jeep pool at Cemoro Lawang
                clears in waves. Pacing is everything.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                The night sequence
              </h2>
              <ol className="list-none p-0 m-0 mb-10 space-y-0">
                {NIGHT_SEQUENCE.map(({ time, desc }, i) => (
                  <li
                    key={time}
                    className="flex gap-5 py-4 border-t border-[#E3E0DA] last:border-b"
                  >
                    <span
                      className="font-mono text-[12px] font-bold text-jvto-orange flex-shrink-0 pt-0.5 w-14"
                    >
                      {time}
                    </span>
                    <span className="text-[15px] text-[#6b7280] font-light leading-[1.6]">
                      {desc}
                    </span>
                  </li>
                ))}
              </ol>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Viewpoints
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                There are three primary sunrise viewpoints. We default to{" "}
                <strong className="text-jvto-navy font-semibold">King Kong Hill</strong>{" "}
                for the cleanest framing;{" "}
                <strong className="text-jvto-navy font-semibold">Penanjakan 1</strong>{" "}
                for the classic shot;{" "}
                <strong className="text-jvto-navy font-semibold">Seruni Point</strong>{" "}
                if you want to avoid crowds entirely.
              </p>

              {/* Data box — viewpoints */}
              <div className="border border-[#E3E0DA] rounded-xl overflow-hidden mb-10">
                {VIEWPOINTS.map((row, i) => (
                  <div
                    key={row.key}
                    className="flex justify-between items-start px-4 py-3"
                    style={{
                      borderBottom:
                        i < VIEWPOINTS.length - 1 ? "1px solid #E3E0DA" : undefined,
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

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Vehicle &amp; temperature
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                Our 4WD jeeps seat up to 6. Heating is limited. We supply
                blankets and hot drinks at the viewpoint. Expect{" "}
                <strong className="text-jvto-navy font-semibold">3–8°C</strong>{" "}
                at the rim in dry season; freezing in July/August.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                What to wear
              </h2>
              <ul className="space-y-3 mb-6 ml-1">
                {[
                  "Thermal base layer + fleece + windbreaker (4–5 layers in winter)",
                  "Hiking shoes with grip — the caldera floor is volcanic sand",
                  "Buff or scarf for ash protection during the crater walk",
                  "Headlamp (we supply one if you don't have it)",
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
                The crater walk
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                From the jeep drop-off it&#39;s a 30-minute walk across the sea
                of sand, then 253 stone steps up the cone. Horses are available
                locally; we do not bundle them by default for animal-welfare
                reasons.
              </p>

              <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                  Related Destination
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/destinations/mount-bromo"
                    prefetch={false}
                    className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                  >
                    Mount Bromo →
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
