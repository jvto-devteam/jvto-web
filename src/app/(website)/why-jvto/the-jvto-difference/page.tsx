// app/(website)/why-jvto/the-jvto-difference/page.tsx
import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/why-jvto/the-jvto-difference";

const WHY_JVTO_NAV = [
  { href: "/why-jvto", label: "Why JVTO overview" },
  { href: "/why-jvto/the-jvto-difference", label: "The JVTO Difference" },
  { href: "/why-jvto/reviews", label: "Reviews" },
  { href: "/why-jvto/our-story", label: "Our Story" },
  { href: "/why-jvto/our-team", label: "Our Team" },
  { href: "/why-jvto/community-standards", label: "Community Standards" },
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

const DIFF_ITEMS = [
  {
    num: "01",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    tag: "Police-Led Safety Authority",
    h2: "Tourist safety at Ijen is his professional jurisdiction — not a personal interest.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          JVTO&apos;s founder, Bripka Agung Sambuko, is an active officer in Ditpamobvit — the
          Indonesian National Police directorate responsible for security at designated vital
          objects, including the Ijen Crater area.
        </p>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          No other East Java volcano tour operator is led by an active Tourist Police officer.
          Three independent press articles (Detik.com 2021-03-14, Radar Jember 2021-03-24, Radar
          Jember 2021-05-27) name Bripka Agung Sambuko in operational Tourist Police duties at
          Ijen — this is not self-reported.
        </p>
      </>
    ),
    cred: (
      <>
        SPRIN WAL TRAVEL 2024-02-12 (SHA256: 179b061a…) · SPRIN POLPAR (SHA256: 03c8578d…) ·
        Press archive + field photos at{" "}
        <Link
          href="/verify-jvto/police-safety"
          prefetch={false}
          className="text-jvto-orange border-b border-current"
        >
          /verify-jvto/police-safety
        </Link>
        . <em>(POLPAR is a police unit designation — listed here rather than under Licenses.)</em>
      </>
    ),
  },
  {
    num: "02",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <circle cx="17" cy="7" r="3" />
      </svg>
    ),
    tag: "100% Private Tours",
    h2: "A dedicated vehicle, driver, and guide assigned to your group only.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          Every JVTO tour runs with no shared groups, no mixed itineraries, and no timing
          compromises because another party needs to be somewhere.
        </p>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          Private structure means your schedule runs on your group&apos;s pace (within safety
          limits), your early start is not coordinated around strangers, and safety decisions are
          made for your group alone. Vehicle allocation scales by group size: MPV for 2–3 guests,
          Toyota Hiace for 4–9, Hiace plus MPV for 10–11.
        </p>
      </>
    ),
    cred: <>NIB 1102230032918 · TDUP (OSS-verifiable) — confirmed private-tour operator registration.</>,
  },
  {
    num: "03",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    tag: "All-Inclusive Clarity",
    h2: "Written inclusions, no surprise costs.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          The price includes private transport for all land sectors (fuel, tolls, parking),
          accommodation with breakfast for overnight stays, all entrance tickets and park permits,
          daily bottled water, Ijen safety gear (gas mask, trekking poles) when Ijen is on the
          itinerary, a private 4WD jeep (max 4 guests) when Bromo is on the itinerary, and a JVTO
          travel T-shirt.
        </p>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          What is included is written on the official tour page and the E-Voucher PDF. What is not
          included is listed explicitly. The voucher is the binding document — if it is not on the
          voucher, it is not included.
        </p>
      </>
    ),
    cred: (
      <>
        Inclusions &amp; Exclusions Policy at{" "}
        <Link
          href="/policy/inclusions-exclusions"
          prefetch={false}
          className="text-jvto-orange border-b border-current"
        >
          /policy/inclusions-exclusions
        </Link>{" "}
        — full written list, no verbal promises.
      </>
    ),
  },
  {
    num: "04",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    tag: "Ijen Health-Screening Coordination",
    h2: "A regulatory requirement we coordinate — not a formality we invented.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          On itineraries that include Mount Ijen, JVTO coordinates a mandatory health-screening
          step for every guest before crater entry, under BBKSDA Surat Edaran SE.1658/KSA.9/2024.
        </p>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          JVTO coordinates the clinic workflow through Dr. Ahmad Irwandanu (SIP-licensed, Kemenkes
          RI). The process issues a QR-verified surat sehat required at the crater access gate.
          Oxygen saturation, blood pressure, heart rate, and respiratory history are recorded. No
          valid QR code means no access to the crater zone — that rule is BBKSDA&apos;s, not ours.
        </p>
      </>
    ),
    cred: (
      <>
        BBKSDA SE.1658/KSA.9/2024 · Dr. Ahmad Irwandanu SIP at
        satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217 · Full protocol at{" "}
        <Link
          href="/travel-guide/ijen-health-screening"
          prefetch={false}
          className="text-jvto-orange border-b border-current"
        >
          /travel-guide/ijen-health-screening
        </Link>
        .
      </>
    ),
  },
  {
    num: "05",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 4v16" />
      </svg>
    ),
    tag: "Verifiable Licenses",
    h2: "A proof library, not a logo wall.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          JVTO holds and publishes the following credentials:
        </p>
        <ul className="pl-5 mb-4 space-y-1.5 list-disc">
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>NIB 1102230032918</strong> — national business registration number
            (OSS-verifiable)
          </li>
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>TDUP</strong> — Tourism Business Permit, issued 2023-02-11
          </li>
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>HPWKI-credentialed guides</strong> — AHU-0001072.AH.01.07.TAHUN 2024, Ijen
            specialist guide association (held by our licensed guides)
          </li>
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>BBKSDA clearance</strong> — operator permit for Kawah Ijen access
          </li>
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>ISIC provider 259268</strong> — UNESCO-endorsed student identity verification
          </li>
          <li className="text-[16px] text-jvto-navy leading-relaxed">
            <strong>Ecotourism-aligned (INDECON)</strong> — aligned with national ecotourism
            principles; community-based tourism practices
          </li>
        </ul>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          Each credential is listed with verification instructions at /verify-jvto. SHA-256 anchors
          are on file for key documents.
        </p>
      </>
    ),
    cred: (
      <>
        <Link
          href="/verify-jvto/legal"
          prefetch={false}
          className="text-jvto-orange border-b border-current"
        >
          /verify-jvto/legal
        </Link>{" "}
        — AHU link for HPWKI, OSS link for NIB, ISIC provider page for student verification.
      </>
    ),
  },
  {
    num: "06",
    tagIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true">
        <path d="M9 11H3v10h6V11zM21 3h-6v18h6V3zM15 7H9v14h6V7z" />
      </svg>
    ),
    tag: "Plan B Framework",
    h2: "A written closure SOP — not a plan invented on the day.",
    body: (
      <>
        <p className="text-[17px] text-jvto-navy leading-relaxed mb-4">
          Volcanic conditions, weather, and government closure decisions are outside any
          operator&apos;s control. What is within our control is having a written response plan
          before departure.
        </p>
        <p className="text-[17px] text-[#6b7280] font-light leading-relaxed">
          JVTO operates a Plan B framework: documented alternative routes and itinerary
          substitutions activated when a site closes or conditions change. The closure response
          protocol is in the Travel Guide before you book. Guests who review us note that briefings
          happen before each activity, not at the gate.
        </p>
      </>
    ),
    cred: (
      <>
        Travel Guide at{" "}
        <Link href="/travel-guide" prefetch={false} className="text-jvto-orange border-b border-current">
          /travel-guide
        </Link>{" "}
        — Plan B and force-majeure procedures published pre-booking · Booking, Payment &amp;
        Cancellation Policy at{" "}
        <Link
          href="/policy/booking-payment-cancellation"
          prefetch={false}
          className="text-jvto-orange border-b border-current"
        >
          /policy/booking-payment-cancellation
        </Link>
        .
      </>
    ),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const seo = (page.pageRow.seo as Record<string, string> | null) ?? {};
  const title = seo.title ?? "The JVTO Difference — JVTO";
  const description =
    seo.description ??
    "Six verifiable things that make JVTO operationally different from other East Java volcano tour operators — police-led safety, private-only format, written credentials.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function TheJvtoDifferencePage() {
  const page = await getPublicPageSnapshot(ROUTE, { allowDatabaseFallback: false });
  const faqResolution = await resolveFaqsForPage(ROUTE);
  const faqNode = buildResolvedFaqSchema(faqResolution, ROUTE);

  return (
    <>
      <PageJsonLdCombined
        pageRow={page.pageRow}
        extraSchemas={[faqNode].filter(Boolean) as Record<string, unknown>[]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />

      {/* ── Hero — navy ───────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url(https://javavolcano-touroperator.com/assets/img/hero/home.webp)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-jvto-navy/70" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/why-jvto" prefetch={false} className="hover:text-white/70 transition-colors">
              Why JVTO
            </Link>
            <span>›</span>
            <span className="text-white/70">The JVTO Difference</span>
          </nav>
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Why JVTO · The Difference
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 004A
                </span>
              </div>
              <h1
                className="text-4xl md:text-[3.75rem] font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                The JVTO <span className="text-jvto-orange italic">difference.</span>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                Six things that make JVTO operationally different from other East Java volcano tour
                operators. Each one is backed by a verifiable credential — not marketing language.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "01 · Authority", value: "Police-led" },
                { label: "02 · Format", value: "100% private" },
                { label: "05 · Licenses", value: "Proof library" },
                { label: "06 · Plan B", value: "Written SOP" },
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
      </header>

      {/* ── Diff items — off-white ────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="md:sticky md:top-28 md:self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                Why JVTO
              </p>
              <nav className="space-y-0.5">
                {WHY_JVTO_NAV.map(({ href, label }) => {
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
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Open proof library <ArrowRight />
              </Link>
            </aside>

            {/* Diff items list */}
            <div className="min-w-0">
              {DIFF_ITEMS.map((item, i) => (
                <div
                  key={item.num}
                  className={`grid md:grid-cols-[120px_1fr] gap-8 md:gap-10 py-14 ${
                    i === 0 ? "pt-4" : "border-t border-[#E3E0DA]"
                  }`}
                >
                  {/* Number */}
                  <div
                    className="font-black leading-none text-[#F6F5F2] select-none"
                    style={{
                      fontFamily: "Raleway, Inter, sans-serif",
                      fontSize: "clamp(56px, 7vw, 96px)",
                      letterSpacing: "-0.05em",
                      WebkitTextStroke: "1px #E3E0DA",
                    }}
                  >
                    {item.num}
                  </div>

                  {/* Body */}
                  <div className="max-w-[64ch]">
                    <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                      {item.tagIcon}
                      {item.tag}
                    </div>
                    <h2
                      className="font-black text-jvto-navy mb-5 leading-[1.08]"
                      style={{
                        fontFamily: "Raleway, Inter, sans-serif",
                        fontSize: "clamp(22px, 3vw, 36px)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.h2}
                    </h2>
                    {item.body}
                    {/* Credential box */}
                    <div
                      className="mt-7 bg-[#F6F5F2] border border-[#E3E0DA] rounded-[12px] p-5 flex flex-col gap-2"
                      style={{ borderLeft: "3px solid #8CC63F" }}
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F]">
                        Verifiable credential
                      </span>
                      <span className="font-mono text-[12.5px] leading-relaxed text-jvto-navy">
                        {item.cred}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust anchor — navy ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-16 md:py-20 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8 mb-0">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#8CC63F] block mb-4">
                Trust Anchor
              </span>
              <p className="font-mono text-[13px] tracking-[0.14em] text-white/75 leading-relaxed">
                PT Java Volcano Rendezvous · NIB 1102230032918 · Trustpilot 4.8&nbsp;/&nbsp;5
                (51&nbsp;reviews, verified 2026-05-09)
              </p>
            </div>
            <div className="flex gap-5 flex-wrap">
              <Link
                href="/why-jvto/reviews"
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Reviews <ArrowRight />
              </Link>
              <Link
                href="/why-jvto/our-team"
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Our Team <ArrowRight />
              </Link>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                Verify JVTO <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy ────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[4]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(28px, 4vw, 44px)",
            }}
          >
            Don&apos;t guess. <span className="text-jvto-orange">Verify.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors"
            >
              Open the proof library <ArrowRight />
            </Link>
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Explore private tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
