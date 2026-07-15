import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";
import {
  buildIjenHealthHowToSchema,
  buildIjenHealthMedicalWebPageSchema,
} from "@/lib/schemas/buildTravelGuideSchemas";

export const revalidate = 86400;

const ROUTE = "/travel-guide/ijen-health-screening";
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

const PROTOCOL_STEPS = [
  {
    title: "Pre-hike health check",
    desc: "JVTO coordinates the check at a partner clinic, or as a session at your hotel or the JVTO office, the evening before your hike.",
  },
  {
    title: "Vitals recorded digitally",
    desc: "Your readings are entered into the digital system — not a handwritten note.",
  },
  {
    title: "QR-verified certificate issued",
    desc: "A surat sehat (health clearance) is issued by Dr. Ahmad Irwandanu, carrying a QR code tied to his licence.",
  },
  {
    title: "Scanned at the crater gate",
    desc: "BBKSDA staff scan the QR code at the access gate. The certificate is checked, not just issued and ignored.",
  },
];

const VITALS_TABLE = [
  { metric: "Oxygen saturation (SpO₂)", reason: "Baseline lung function before high-altitude sulfur exposure." },
  { metric: "Blood pressure", reason: "Cardiovascular risk at 2,386 m (systolic / diastolic)." },
  { metric: "Resting heart rate", reason: "Cardiovascular baseline." },
  { metric: "Respiratory history", reason: "Asthma or bronchitis — directly relevant to gas-mask use and sulfur exposure." },
];

const PHYSICIAN_TABLE = [
  {
    field: "Dr. Ahmad Irwandanu",
    detail: "Licensed Medical Doctor (Dokter Umum), SIP-credentialed. Based in Bondowoso, East Java. Registered with Kemenkes RI · SatuSehat SDMK · KKI.",
    link: null,
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

const FACILITIES_TABLE = [
  {
    name: "Klinik Bakti Husada",
    location: "Bondowoso",
    type: "Certified medical clinic (Kemenkes RI) — a physical clinic, not a mobile or improvised service.",
  },
  {
    name: "Puskesmas Licin",
    location: "Banyuwangi",
    type: "Official government health centre (Dinkes Banyuwangi); an Ijen-screening partner.",
  },
  {
    name: "Hotel / JVTO office",
    location: "Bondowoso or Banyuwangi",
    type: "Mobile session by Dr. Irwandanu — screening done at your hotel before departure.",
  },
];

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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const seo = (page.pageRow.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? "Ijen Health Screening Coordination — JVTO Travel Guide",
    description:
      seo.description ??
      "Ijen crater access requires a health certificate under BBKSDA SE.1658. JVTO coordinates the clinic workflow with a named, SIP-licensed physician — QR-verified at the gate.",
    openGraph: {
      title: seo.title ?? "Ijen Health Screening — JVTO Travel Guide",
      description:
        seo.description ??
        "How JVTO coordinates the mandatory Ijen health certificate with Dr. Ahmad Irwandanu.",
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function IjenHealthScreeningPage() {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  const extraSchemas = [
    faqNode,
    buildIjenHealthMedicalWebPageSchema(),
    buildIjenHealthHowToSchema(),
  ].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={extraSchemas}
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
            <span className="text-white/70">Ijen Health Screening</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Conditional · BBKSDA SE.1658
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
                Ijen crater access can require a recent health certificate under
                BBKSDA rules. When it does, JVTO coordinates the check with a
                named, licensed physician — and the certificate is QR-verified
                at the gate, not a souvenir letter.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Regulatory basis", value: "BBKSDA SE.1658/KSA.9/2024" },
                { label: "Physician", value: "Dr. Ahmad Irwandanu · SIP" },
                { label: "Where", value: "Your hotel, the evening before" },
                { label: "Gate check", value: "QR-verified" },
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
                Reading time · 6 min · Medical reference
              </p>

              <p className="text-[16px] text-jvto-navy font-medium leading-[1.6] mb-8 border-l-2 border-jvto-orange pl-4">
                A health certificate is mandatory for every guest before Kawah
                Ijen crater entry, per BBKSDA SE.1658/KSA.9/2024. This is a
                regulatory requirement set by BBKSDA — the government
                conservation authority for Kawah Ijen — not a rule JVTO
                invents. When it applies, JVTO coordinates the clinic workflow
                with a named, SIP-licensed physician, and the certificate is
                QR-verified at the crater gate.
              </p>

              {/* Section 1 */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                The rule is BBKSDA&#39;s, not ours
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                The screening requirement is set by{" "}
                <strong className="text-jvto-navy font-semibold">
                  BBKSDA Surat Edaran SE.1658/KSA.9/2024
                </strong>{" "}
                and reflected in the public crater-access ticket terms at
                tiket.bbksdajatim.org, which require a health certificate from a
                doctor for crater-zone entry when conditions meet the threshold.
                JVTO&#39;s role is to{" "}
                <strong className="text-jvto-navy font-semibold">coordinate</strong>{" "}
                the clinic workflow so you can satisfy that requirement — not to
                impose it. That distinction matters: we are the logistics layer
                on a government safety rule, not the authority behind it.
              </p>

              {/* Section 2 */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Why screening exists
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                Kawah Ijen is a{" "}
                <strong className="text-jvto-navy font-semibold">
                  2,386-metre active volcano
                </strong>{" "}
                with a sulfur lake at its crater. Sulfur dioxide and hydrogen
                sulfide are released continuously from the crater floor, the
                night ascent runs from roughly 01:00 to 04:00, and the air at
                the rim can change from breathable to dangerous within minutes
                when the wind shifts. The screening is designed to catch the
                conditions that turn this environment into a medical emergency —
                before you are standing on the rim.
              </p>

              {/* Section 3 — protocol steps */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                The four-step protocol
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                When access rules require it, the workflow runs through the
                Ijen Digital Health Security System:
              </p>
              <ol className="list-none p-0 m-0 mt-4 mb-10 space-y-0">
                {PROTOCOL_STEPS.map((step, i) => (
                  <li
                    key={i}
                    className="grid gap-x-5 py-5 border-t border-[#E3E0DA] last:border-b items-start"
                    style={{ gridTemplateColumns: "38px 1fr" }}
                  >
                    <span className="font-mono text-[13px] font-bold text-jvto-orange bg-orange-50 rounded-full w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <div
                        className="font-black text-jvto-navy text-[18px] leading-tight mb-1"
                        style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.01em" }}
                      >
                        {step.title}
                      </div>
                      <div className="text-[15px] text-[#6b7280] font-light leading-[1.6]">
                        {step.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Section 4 — vitals table */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                What the check measures
              </h2>
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

              {/* Section 5 — physician */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Your physician: Dr. Ahmad Irwandanu
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                Every JVTO{" "}
                <em className="italic">surat sehat</em> is issued by a named,
                individually auditable doctor — not an in-house printout. The
                certificate cannot be faked without a valid SIP number behind
                it, and you can check the licence before you book.
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

              {/* Section 6 — where it happens */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Where it happens
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                Screening is not a clinic detour bolted onto your morning. In
                most cases a nurse visits your hotel the evening before the
                hike. The institutional chain behind the certificate is what
                makes it real:
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA] pr-4">
                        Facility
                      </th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 border-b border-[#E3E0DA]">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACILITIES_TABLE.map((row) => (
                      <tr key={row.name}>
                        <td className="py-4 pr-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-bold align-top leading-[1.55]">
                          {row.name}
                          <br />
                          <span className="text-[13px] text-[#9ca3af] font-normal">
                            {row.location}
                          </span>
                        </td>
                        <td className="py-4 border-b border-[#E3E0DA] text-jvto-navy text-[15px] font-normal align-top leading-[1.55]">
                          {row.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Gate box — orange */}
              <div
                className="rounded-xl p-6 mb-8"
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
                  No valid QR code = no access to the crater zone. This is a
                  BBKSDA rule. We will not take you up without it.
                </p>
              </div>

              {/* Section 7 */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                If you are assessed unfit
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                It is rare but possible. If the screening determines you should
                not ascend, the climb is cancelled{" "}
                <strong className="text-jvto-navy font-semibold">
                  for that individual, not the group
                </strong>{" "}
                — you can wait at base camp or a safe zone while the rest of
                your party continues. The screening session cost is
                non-refundable. This is a BBKSDA safety decision, not JVTO
                discretion.
              </p>

              {/* Section 8 */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Why this is not bureaucratic theater
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-6">
                Between 2015 and 2026, four tourists died at Kawah Ijen.{" "}
                <strong className="text-jvto-navy font-semibold">
                  Two of the four were fitness-related
                </strong>
                : a 68-year-old visitor in 2015 (exhaustion and respiratory
                distress while ascending), and a 64-year-old visitor in 2023 (a
                cardiac event near the upper trail, who collapsed despite
                supplemental oxygen). Both involved cardiovascular or
                respiratory failure in people who lacked the fitness for the
                climb — exactly the pattern an SpO₂, blood-pressure, heart-rate
                and respiratory check is designed to catch. The screening
                targets a documented, recurring cause of death at this specific
                volcano.
              </p>

              {/* Section 9 — what to do before */}
              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                What you should do before the trip
              </h2>
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
