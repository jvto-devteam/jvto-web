import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { composeGraph } from "@/lib/schema/contract";
import { DEFAULT_SITE } from "@/lib/seo/jsonld/builders";
import Link from "@/components/website/AppLink";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { getPublicFaqCategories } from "@/lib/publicContent/faqSnapshot";

export const revalidate = 3600;

const ROUTE = "/travel-guide/faq";
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

const fallbackSeo = {
  title: "Bromo, Ijen & Tumpak Sewu Tour FAQ | JVTO",
  h1: "Travel guide FAQ.",
  description:
    "Plain-language answers to the questions in almost every inquiry. If yours is not here, ask via WhatsApp — a human answers.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo(ROUTE, fallbackSeo);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
    },
  };
}

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default async function FaqPage() {
  const [seo, categoriesData] = await Promise.all([
    getPageSeo(ROUTE, fallbackSeo),
    getPublicFaqCategories(),
  ]);

  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: ROUTE,
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  const categories = categoriesData.filter((cat) => cat.faqs.length > 0);

  const allFaqsForSeo = categories.flatMap((cat) =>
    cat.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
  );

  const { "@graph": extraNodes } = composeGraph([
    {
      "@type": "FAQPage",
      "@id": `${DEFAULT_SITE}${ROUTE}#faqpage`,
      mainEntity: allFaqsForSeo.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ]);

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={extraNodes}
        suppressCmsFaq={true}
      />

      {/* ── Interior hero — navy ────────────────────────────────────────── */}
      <section className="bg-jvto-navy pt-24 md:pt-36 pb-28 md:pb-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/travel-guide" prefetch={false} className="hover:text-white/70 transition-colors">Travel Guide</Link>
            <span>›</span>
            <span className="text-white/70">FAQ</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Reference
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  GUIDE / FAQ
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white leading-[0.98] mb-5"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                Travel guide{" "}
                <em className="italic text-jvto-orange">FAQ.</em>
              </h1>
              <p className="text-white/60 text-[17px] font-light leading-relaxed max-w-[50ch]">
                Common questions in plain language. If yours is not here, ask via WhatsApp — a human answers.
              </p>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-6 self-start">
              {[
                { label: "Updated", value: "May 2026" },
                { label: "Questions", value: `${allFaqsForSeo.length} canonical` },
                { label: "Categories", value: `${categories.length}` },
                { label: "Schema", value: "FAQPage" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 flex-shrink-0">{label}</span>
                  <strong className="text-white text-sm font-semibold text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ section — off-white, stacked ───────────────────────────── */}
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

            {/* FAQ main */}
            <div className="min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9ca3af] block mb-4">
                {allFaqsForSeo.length} canonical answers · {categories.length} categories
              </span>
              <p className="text-[21px] text-[#6b7280] font-light leading-relaxed mb-10 max-w-[60ch]">
                Plain-language answers to the questions in almost every inquiry. Tap any question to
                expand. If yours is not here, ask via WhatsApp — a human answers, 08:00–22:00 WIB.
              </p>

              {categories.length === 0 ? (
                <p className="text-[#6b7280] font-light">No questions available at the moment.</p>
              ) : (
                <div className="space-y-10">
                  {categories.map((category, catIdx) => (
                    <div key={category.id}>
                      {/* Category label with separator */}
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-orange flex-shrink-0">
                          {String.fromCharCode(65 + catIdx)} · {category.name}
                        </span>
                        <div className="flex-1 h-px bg-[#E3E0DA]" />
                      </div>

                      {/* FAQ items */}
                      <div className="border-t border-[#E3E0DA]">
                        {category.faqs.map((faq, i) => (
                          <details
                            key={`${category.id}-${i}`}
                            className="border-b border-[#E3E0DA] group"
                          >
                            <summary className="flex items-start gap-4 py-5 cursor-pointer [list-style:none] [&::-webkit-details-marker]:hidden">
                              <div className="w-[26px] h-[26px] flex-shrink-0 rounded-full bg-jvto-orange/10 text-jvto-orange flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[13px] h-[13px]" aria-hidden="true">
                                  <path d="M12 5v14M5 12h14" />
                                </svg>
                              </div>
                              <span
                                className="font-black text-jvto-navy text-[18px] leading-snug flex-1 pt-0.5"
                                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.01em" }}
                              >
                                {faq.question}
                              </span>
                            </summary>
                            <div
                              className="pb-5 pl-[42px] text-[15.5px] text-jvto-navy font-light leading-relaxed prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ask box */}
              <div className="mt-12 border border-[#E3E0DA] border-l-[3px] border-l-[#E8A200] bg-[#E8A200]/5 rounded-[12px] px-6 py-5">
                <p className="text-[15px] text-jvto-navy font-light leading-relaxed">
                  <strong className="font-semibold">Still have a question?</strong>{" "}
                  Message JVTO on{" "}
                  <Link href="/contact" prefetch={false} className="text-jvto-orange border-b border-current">
                    WhatsApp (+62 822 4478 8833)
                  </Link>{" "}
                  or email hello@javavolcano-touroperator.com. For credentials, open the{" "}
                  <Link href="/verify-jvto" prefetch={false} className="text-jvto-orange border-b border-current">
                    proof library
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ─────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(28px, 3.5vw, 44px)" }}
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
