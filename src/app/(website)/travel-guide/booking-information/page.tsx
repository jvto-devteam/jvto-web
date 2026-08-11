import { type Metadata } from "next";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";
import {
  resolveFaqsForPage,
  buildResolvedFaqSchema,
} from "@/lib/content/resolveFaqs";

export const revalidate = 86400;

const ROUTE = "/travel-guide/booking-information";
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
  const title =
    seo.title ?? "Booking Information — JVTO Travel Guide";
  const description =
    seo.description ??
    "How to book a JVTO private volcano tour: deposit, payment deadlines, E-Voucher, and the Travel Credit cancellation scheme explained in plain language.";
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

export default async function BookingInformationPage() {
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
            <span className="text-white/70">Booking Information</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Process
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / BOOKING
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                How <em className="italic">booking works.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                Deposit, confirmation, day-of communication. The process is simple by design.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Deposit", value: "20%" },
                { label: "Balance due", value: "≤ 5 days before Day 1" },
                { label: "Book via", value: "Website or WhatsApp" },
                { label: "You receive", value: "E-Voucher" },
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
                A 20% deposit locks your vehicle and crew on your dates. The rules below are the
                binding ones — your E-Voucher is the document that governs the trip.
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-0"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Two ways to book
              </h2>
              <ol className="list-decimal list-outside ml-5 space-y-3 mb-6">
                <li className="text-[15px] text-[#6b7280] font-light leading-[1.7]">
                  <strong className="font-semibold text-jvto-navy">Website Instant Book</strong>{" "}
                  — for standard packages and dates: choose your package, date and travelers,
                  review price and add-ons, accept the Terms &amp; Cancellation Policy, and pay.
                  JVTO follows up with your confirmation and E-Voucher.
                </li>
                <li className="text-[15px] text-[#6b7280] font-light leading-[1.7]">
                  <strong className="font-semibold text-jvto-navy">WhatsApp-assisted</strong>{" "}
                  — for custom routes, group arrangements, or special requests: send your dates,
                  origin, group size and requirements; JVTO confirms availability and price, sends
                  a secure payment link, and issues your E-Voucher.
                </li>
              </ol>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                Payment &amp; deadlines
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                The standard deposit is{" "}
                <strong className="font-semibold text-jvto-navy">20% of total booking value</strong>,
                paid by card via a secure JVTO link. If Day 1 is within 14 days, up to 100% full
                payment may be required. The balance is due no later than{" "}
                <strong className="font-semibold text-jvto-navy">5 days before Day 1</strong> by
                card, or{" "}
                <strong className="font-semibold text-jvto-navy">3 days before</strong> by bank wire
                or Wise. Cash is accepted at the JVTO office only if approved in writing. Full legal
                text is at the{" "}
                <Link
                  href="/policy/booking-payment-cancellation"
                  prefetch={false}
                  className="text-jvto-navy font-medium underline decoration-jvto-orange/30 hover:decoration-jvto-orange transition-colors"
                >
                  booking, payment &amp; cancellation policy
                </Link>
                .
              </p>

              <h2
                className="font-black text-jvto-navy text-[22px] md:text-[26px] leading-[1.15] mb-4 mt-10"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                What you receive
              </h2>
              <ul className="space-y-2 mb-6 ml-4">
                {[
                  "An E-Voucher with full trip details (the binding document)",
                  "Lead-guide name and WhatsApp contact",
                  "Vehicle and crew assignment",
                  "Health-screening details for Ijen routes, for every guest under BBKSDA SE.1658/KSA.9/2024",
                  "24/7 emergency contact at the operations base",
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
                Cancellation &amp; Travel Credit
              </h2>
              <p className="text-[15px] text-[#6b7280] font-light leading-[1.7] mb-4">
                JVTO uses a Travel Credit system instead of cash refunds for guest-initiated
                cancellations. Cancel{" "}
                <strong className="font-semibold text-jvto-navy">
                  at least 48 hours before Day 1
                </strong>{" "}
                and 100% of eligible booking value converts to{" "}
                <strong className="font-semibold text-jvto-navy">Lifetime Travel Credit</strong>{" "}
                (no expiry, transferable). Cancel{" "}
                <strong className="font-semibold text-jvto-navy">within 48 hours</strong> and
                payment is forfeited with no credit. One free reschedule is offered if requested at
                least 48 hours before Day 1. We do not write hidden fees into the contract.
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
