import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { Faq } from "@/components/content/Faq";
import { loadStaticPage, buildStaticRouteMetadata } from "@/lib/static-content";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import {
  buildIjenHealthHowToSchema,
  buildIjenHealthMedicalWebPageSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";

export const revalidate = 86400;

const ROUTE = "/travel-guide/ijen-health-screening";
const SITE_URL = "https://javavolcano-touroperator.com";

// Fallback copy — only used if content/pages/travel-guide/ijen-health-screening.md
// is ever unavailable at build/runtime (should not happen; kept for safety).
const FALLBACK_SEO = {
  title: "Ijen Health Screening Coordination — JVTO Travel Guide",
  description:
    "Ijen crater access requires a health certificate under BBKSDA SE.1658. JVTO coordinates the clinic workflow with a named, SIP-licensed physician.",
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
 * Hero fact card — presentational chrome only. Every value restates a fact
 * carried in content/pages/travel-guide/ijen-health-screening.md.
 */
const HERO_META_ROWS = [
  { label: "Regulatory basis", value: "BBKSDA SE.1658/KSA.9/2024" },
  { label: "Physician", value: "Dr. Ahmad Irwandanu · SIP" },
  { label: "Where", value: "Your hotel, the evening before" },
  { label: "Certificate", value: "BSrE-signed, checked at the gate" },
];

/**
 * Clinical rationale for each vital. The measured vitals themselves are listed
 * in the SSOT markdown ("What the Screening Checks"); this reference table adds
 * the *why*, which the markdown does not carry, and is therefore complementary
 * page chrome rather than duplicated content.
 */
const VITALS_TABLE = [
  {
    metric: "Oxygen saturation (SpO₂)",
    reason: "Baseline lung function before high-altitude sulfur exposure.",
  },
  {
    metric: "Blood pressure",
    reason: "Cardiovascular risk at 2,386 m (systolic / diastolic).",
  },
  { metric: "Resting heart rate", reason: "Cardiovascular baseline." },
  {
    metric: "Respiratory history",
    reason:
      "Asthma or bronchitis — directly relevant to gas-mask use and sulfur exposure.",
  },
];

/**
 * Physician verification chrome. The SSOT markdown names Dr. Irwandanu and the
 * SatuSehat registry; these deep links (STR record + KKI cek-dokter form) are
 * verification affordances that only exist here.
 */
const PHYSICIAN_TABLE = [
  {
    field: "Dr. Ahmad Irwandanu",
    detail:
      "Licensed Medical Doctor (Dokter Umum), SIP-credentialed. Based in Bondowoso, East Java. Registered with Kemenkes RI · SatuSehat SDMK · KKI.",
    link: null as string | null,
  },
  {
    field: "STR",
    detail: "satusehat.kemkes.go.id",
    link: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217",
  },
  {
    field: "KKI check",
    detail: "kki.go.id/cekdokter",
    link: "https://www.kki.go.id/cekdokter/form",
  },
];

/**
 * Guest-side preparation checklist. Not present in the SSOT markdown — additive
 * chrome, so it cannot duplicate or contradict it.
 */
const BEFORE_TRIP = [
  "Disclose any pre-existing cardiovascular or respiratory condition in your inquiry form.",
  "Bring any home-country medical paperwork relevant to altitude or respiratory conditions.",
  "Get a good night of sleep before the screening session.",
  "Avoid alcohol the night before — it can register as elevated blood pressure.",
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

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4"
    style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
  >
    {children}
  </h2>
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

export default async function IjenHealthScreeningPage() {
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

  const extraSchemas = [
    faqSchema,
    buildIjenHealthMedicalWebPageSchema(),
    buildIjenHealthHowToSchema(),
  ].filter(Boolean) as any[];

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
        extraSchemas={extraSchemas}
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
            <span className="text-white/70">Ijen Health Screening</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Mandatory · BBKSDA SE.1658
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / IJEN-HEALTH
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Ijen health-screening{" "}
                <em className="italic text-jvto-orange">coordination.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                A health certificate is mandatory for every guest before Kawah
                Ijen crater entry under BBKSDA rules. JVTO coordinates the check
                with a named, licensed physician — and the certificate is a
                BSrE-signed digital document, not a souvenir letter.
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

            {/* Article body — prose driven by content/pages/travel-guide/ijen-health-screening.md */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ca3af] mb-6">
                Reading time · 6 min · Medical reference
              </p>

              <MarkdownRendererTravelGuide markdown={body} />

              {/* Gate box — orange */}
              <div
                className="rounded-xl p-6 mt-10 mb-10"
                style={{
                  border: "1px solid #E3E0DA",
                  borderLeft: "3px solid #E8650A",
                  background: "rgba(232,101,10,0.05)",
                }}
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange mb-2">
                  The hard gate
                </p>
                <p className="text-[16px] text-jvto-navy font-medium leading-[1.6] m-0">
                  No valid health certificate = no access to the crater zone.
                  This is a BBKSDA rule. We will not take you up without it.
                </p>
              </div>

              {/* Reference block — clinical rationale (complements the SSOT vitals list) */}
              <div className="pt-8 border-t border-[#E3E0DA]">
                <SectionHeading>Why each vital is measured</SectionHeading>
                <div className="overflow-x-auto mb-10">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA] pr-4">
                          Metric
                        </th>
                        <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA]">
                          Why it matters
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {VITALS_TABLE.map((row) => (
                        <tr key={row.metric}>
                          <td className="py-4 pr-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-bold align-top leading-[1.55]">
                            {row.metric}
                          </td>
                          <td className="py-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-normal align-top leading-[1.55]">
                            {row.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Physician verification table */}
                <SectionHeading>Verify your physician</SectionHeading>
                <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                  Every JVTO <em className="italic">surat sehat</em> is issued by a named,
                  individually auditable doctor — not an in-house printout. You can check the
                  licence before you book.
                </p>
                <div className="overflow-x-auto mb-10">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA] pr-4">
                          Field
                        </th>
                        <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA]">
                          Detail &amp; verification
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PHYSICIAN_TABLE.map((row) => (
                        <tr key={row.field}>
                          <td className="py-4 pr-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-bold align-top leading-[1.55]">
                            {row.field}
                          </td>
                          <td className="py-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-normal align-top leading-[1.55]">
                            {row.link ? (
                              <a
                                href={row.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[12.5px] tracking-[0.02em] text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange break-all"
                              >
                                {row.detail}
                              </a>
                            ) : (
                              row.detail
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Guest preparation checklist */}
                <SectionHeading>What you should do before the trip</SectionHeading>
                <ul className="space-y-3 mb-8 ml-1">
                  {BEFORE_TRIP.map((item) => (
                    <li
                      key={item}
                      className="text-[15px] text-[#6b7280] font-light leading-[1.6] flex gap-2"
                    >
                      <span className="text-jvto-orange mt-1 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Note box — lime */}
                <div
                  className="rounded-xl p-6 mb-6"
                  style={{
                    border: "1px solid #E3E0DA",
                    borderLeft: "3px solid #8CC63F",
                    background: "rgba(140,198,63,0.05)",
                  }}
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-navy mb-2">
                    Verify before you book
                  </p>
                  <p className="text-[14px] text-[#6b7280] leading-[1.65] m-0">
                    You can check Dr. Irwandanu&#39;s licence at the{" "}
                    <a
                      href="https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange"
                    >
                      Kemenkes SatuSehat
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.kki.go.id/cekdokter/form"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange"
                    >
                      KKI registries
                    </a>{" "}
                    linked above, and read the regulatory and police-safety
                    context on the{" "}
                    <Link
                      href="/verify-jvto/police-safety"
                      prefetch={false}
                      className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange"
                    >
                      Police &amp; Safety proof page
                    </Link>
                    . The certificate behind your climb is auditable — by design.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#E3E0DA]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-3">
                  Related Destination
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/destinations/ijen-crater"
                    prefetch={false}
                    className="text-sm font-semibold text-jvto-navy hover:text-jvto-orange transition-colors"
                  >
                    Ijen Crater →
                  </Link>
                </div>
              </div>

              <Faq items={faqItems} title="Ijen Health Screening: Common Questions" />
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
