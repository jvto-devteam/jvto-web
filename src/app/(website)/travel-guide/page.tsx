import { type Metadata } from "next";
import AnswerBlock from "@/components/website/AnswerBlock";
import Link from "@/components/website/AppLink";
import { Faq } from "@/components/content/Faq";
import { MarkdownRendererTravelGuide } from "@/components/content/MarkdownRendererTravelGuide";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import {
  buildEcosystemRouteMetadata,
  getEcosystemWebsitePage,
  resolveOgImage,
} from "@/lib/ecosystemContent/website";
import { buildTgHubItemListSchema } from "@/lib/schemas/buildTravelGuideSchemas";

const ROUTE = "/travel-guide";
const FAQ_SITE_URL = "https://javavolcano-touroperator.com";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://javavolcano-touroperator.com";

export const revalidate = 300;

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this route.
const FALLBACK = {
  heroStats: [
    { label: "Guide articles", value: "10" },
    { label: "Last updated", value: "May 2026" },
    { label: "Reading time", value: "~25 min" },
    { label: "Author", value: "JVTO ops team" },
  ],
  rulebookCards: [
    {
      icon: "pvmbg",
      label: "PVMBG-aligned",
      title: "Safety boundaries",
      desc: "We follow official PVMBG (Volcanology) alerts without exception. If a site is closed, we do not enter. Safety is the non-negotiable.",
    },
    {
      icon: "screening",
      label: "Real screening",
      title: "Health requirements",
      desc: "Mandatory certified clinic checks for Ijen. You must be medically cleared for altitude and sulfur exposure. No fake letters.",
    },
    {
      icon: "operator",
      label: "Not a broker",
      title: "Operational control",
      desc: "We are the operator, not a broker. We control the vehicles, the guides, and the safety decisions from start to finish.",
    },
  ],
  destinationGuides: [
    {
      href: "/travel-guide/ijen-health-screening",
      name: "Ijen Health Screening",
      desc: "Mandatory medical clearance - gas mask - clinic protocol.",
    },
    {
      href: "/travel-guide/mount-bromo-logistics",
      name: "Mount Bromo Logistics",
      desc: "Jeep timings - sunrise viewpoints - altitude prep.",
    },
    {
      href: "/travel-guide/tumpak-sewu-logistics",
      name: "Tumpak Sewu Logistics",
      desc: "Trekking - footwear - river crossing safety.",
    },
  ],
  packingCard: {
    href: "/travel-guide/packing-and-fitness",
    name: "Packing & Fitness",
    desc: "Layered clothing, hiking shoes, headlamps, and personal medication. See our full list.",
    action: "Read packing & fitness",
  },
  extraPracticalCards: [
    {
      icon: "altitude",
      title: "Altitude & temperature",
      desc: "Bromo can drop to 0 C. Ijen is at 2,386m. Prepare for cold mornings and thin air.",
      footerLabel: "Critical info",
    },
    {
      icon: "connectivity",
      title: "Money & connectivity",
      desc: "Cash is king in remote areas. SIM cards and Wi-Fi availability vary by location.",
      footerLabel: "Logistics",
    },
  ],
  checklistItems: [
    {
      title: "Verify your operator",
      desc: "Check for a real NIB license and police-led safety oversight. Don't book with unlicensed brokers.",
    },
    {
      title: "Verify your health",
      desc: "Ensure you have a real medical check at a certified clinic for Ijen. Your safety depends on it.",
    },
    {
      title: "Verify your route",
      desc: "Confirm your private logistics and safety decision boundaries. Know who makes the call if things change.",
    },
  ],
  articles: [
    {
      slug: "ijen-health-screening",
      label: "Required",
      name: "Ijen Health Screening",
      desc: "Mandatory medical clearance - gas mask - clinic protocol.",
    },
    {
      slug: "mount-bromo-logistics",
      label: "Logistics",
      name: "Mount Bromo Logistics",
      desc: "Jeep timings - sunrise viewpoints - altitude prep.",
    },
    {
      slug: "tumpak-sewu-logistics",
      label: "Logistics",
      name: "Tumpak Sewu Logistics",
      desc: "Trekking - footwear - river crossing safety.",
    },
    {
      slug: "packing-and-fitness",
      label: "Prep",
      name: "Packing & Fitness",
      desc: "Layered clothing and fitness expectations.",
    },
    {
      slug: "weather-and-closures",
      label: "Conditions",
      name: "Weather & Closures",
      desc: "PVMBG alerts - seasonal access - monsoon notes.",
    },
    {
      slug: "safety-on-tours",
      label: "Safety",
      name: "Safety on Tours",
      desc: "Police-led protocols - medical - vehicle standards.",
    },
    {
      slug: "booking-information",
      label: "Process",
      name: "Booking Information",
      desc: "Deposits - confirmation - reschedule mechanics.",
    },
    {
      slug: "police-escort-for-groups",
      label: "Authority",
      name: "Police Escort for Groups",
      desc: "When and how police escort is arranged.",
    },
    {
      slug: "rijik-monthly-closure",
      label: "Conditions",
      name: "Ijen Rijik Monthly Closure",
      desc: "The first-Friday-of-the-month TWA Ijen conservation closure.",
    },
    {
      slug: "faq",
      label: "Reference",
      name: "FAQ",
      desc: "Common questions answered in plain language.",
    },
  ],
};

const HUB_FAQ_FALLBACK = [
  {
    question: "What is the Travel Guide for?",
    answer:
      "This is JVTO's planning hub for safety rules, Ijen screening, closures/weather logic, packing/fitness, booking flow, and group escort context. It helps you prepare before departure.",
  },
  {
    question: "What is the binding reference if anything differs?",
    answer:
      "Your Official E-Voucher / Invoice (PDF) is the highest authority for your specific booking. If anything differs, follow the document precedence stated on this page and in the policy pack.",
  },
  {
    question: "Which pages should I read before paying?",
    answer:
      "Read /travel-guide/booking-information, then /policy/booking-payment-cancellation and /policy/inclusions-exclusions. Use /travel-guide/weather-and-closures for route uncertainty.",
  },
  {
    question: "Where can I find the Ijen screening process?",
    answer:
      "Read /travel-guide/ijen-health-screening. Screening is part of Ijen night hike logistics when applicable and may be required by local rules.",
  },
  {
    question: "What should I do close to departure?",
    answer:
      "Re-check /travel-guide/packing-and-fitness and /travel-guide/weather-and-closures. If you are unsure how a rule applies, verify via official channels before travel.",
  },
] as const;

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

const DestinationIcon = () => (
  <svg
    className="h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PvmbgIcon = () => (
  <svg
    className="h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ScreeningIcon = () => (
  <svg
    className="h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const OperatorIcon = () => (
  <svg
    className="h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <circle cx="17" cy="7" r="3" />
  </svg>
);

const RULEBOOK_ICONS: Record<string, () => React.ReactNode> = {
  pvmbg: PvmbgIcon,
  screening: ScreeningIcon,
  operator: OperatorIcon,
};

const AltitudeIcon = () => (
  <svg
    className="mb-4 h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M14 4v10a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
  </svg>
);

const ConnectivityIcon = () => (
  <svg
    className="mb-4 h-7 w-7 text-jvto-orange"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15 15 0 0 1 0 20" />
  </svg>
);

const EXTRA_PRACTICAL_ICONS: Record<string, () => React.ReactNode> = {
  altitude: AltitudeIcon,
  connectivity: ConnectivityIcon,
};

function SectionHeading({
  index,
  title,
  accent,
  label,
  dark = false,
}: {
  index: string;
  title: string;
  accent: string;
  label?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span
        className={`font-mono text-[11px] font-bold ${
          dark ? "text-white/50" : "text-jvto-orange"
        }`}
      >
        {index}
      </span>
      <div>
        <h2
          className={`font-black leading-[1.0] ${
            dark ? "text-white" : "text-jvto-navy"
          }`}
          style={{
            fontFamily: "Raleway, Inter, sans-serif",
            fontSize: "clamp(32px, 4.5vw, 52px)",
          }}
        >
          {title} <span className="text-jvto-orange">{accent}</span>
        </h2>
        {label ? (
          <span
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/40" : "text-[#9ca3af]"
            }`}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function GuideCard({
  href,
  name,
  desc,
  action = "Read guide",
}: {
  href: string;
  name: string;
  desc: string;
  action?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group block rounded-[20px] border border-[#E3E0DA] bg-white p-7 transition-all hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)]"
    >
      <div className="mb-4">
        <DestinationIcon />
      </div>
      <h3
        className="mb-3 text-xl font-black text-jvto-navy"
        style={{ fontFamily: "Raleway, Inter, sans-serif" }}
      >
        {name}
      </h3>
      <p className="mb-5 text-[15px] font-light leading-relaxed text-[#6b7280]">
        {desc}
      </p>
      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
        {action} <ArrowRight />
      </span>
    </Link>
  );
}

function getFaqItems(pageFaq?: { question: string; answer: string }[]) {
  const source = pageFaq?.length ? pageFaq : HUB_FAQ_FALLBACK;
  return source.map((item) => ({ q: item.question, a: item.answer }));
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEcosystemWebsitePage(ROUTE);
  const title =
    page?.meta.browserTitle ??
    "Travel Guide - Safety, Booking & Practical Info | JVTO";
  const description =
    page?.meta.description ??
    "Your practical handbook for traveling with JVTO: bookings, safety, health screening, packing, and more.";
  const h1 = page?.meta.title ?? "Travel Guide";
  const baseMetadata = page
    ? buildEcosystemRouteMetadata(page, "website")
    : ({ title, description } satisfies Metadata);

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `${siteUrl}${ROUTE}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: resolveOgImage(ROUTE, h1),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/assets/img/og/travel-guide.webp`],
    },
  };
}

export default async function TravelGuideHubPage() {
  const page = await getEcosystemWebsitePage(ROUTE);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<typeof FALLBACK>;
  const heroStats = pc.heroStats ?? FALLBACK.heroStats;
  const rulebookCards = pc.rulebookCards ?? FALLBACK.rulebookCards;
  const destinationGuides = pc.destinationGuides ?? FALLBACK.destinationGuides;
  const packingCard = pc.packingCard ?? FALLBACK.packingCard;
  const extraPracticalCards = pc.extraPracticalCards ?? FALLBACK.extraPracticalCards;
  const checklistItems = pc.checklistItems ?? FALLBACK.checklistItems;
  const articles = pc.articles ?? FALLBACK.articles;
  const title =
    page?.meta.browserTitle ??
    "Travel Guide - Safety, Booking & Practical Info | JVTO";
  const description =
    page?.meta.description ??
    "JVTO's official travel guide: booking steps, safety rules, Ijen health screening, weather and closures, packing list, and police escort for groups.";
  const h1 = page?.meta.title ?? "Travel Guide";
  const faqItems = getFaqItems(page?.faq);
  const officialBody = page?.body?.trim();

  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${FAQ_SITE_URL}${ROUTE}#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  const extraSchemas = [buildTgHubItemListSchema(), faqSchema].filter(Boolean);

  return (
    <>
      <PageJsonLdCombined
        pageRow={{
          route: ROUTE,
          lang: "en",
          seo: { title, description },
          content: { h1 },
        }}
        extraSchemas={extraSchemas}
        suppressCmsFaq
      />

      <section className="relative overflow-hidden bg-jvto-navy pb-32 pt-24 md:pb-44 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid items-start gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Essential Knowledge
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  FILE 005 / GUIDE
                </span>
              </div>
              <h1
                className="mb-5 text-5xl font-black leading-[0.98] text-white md:text-7xl"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                The <em className="italic text-jvto-orange">rulebook</em> before
                you book.
              </h1>
              <p className="max-w-[48ch] text-lg font-light leading-relaxed text-white/60">
                Operational certainty starts with being informed. Read our
                comprehensive guide to understand the boundaries, logistics, and
                safety protocols of East Java expeditions.
              </p>
              <AnswerBlock>
                {typeof (page?.raw as any)?.page?.answerFirst === "string"
                  ? ((page!.raw as any).page.answerFirst as string)
                  : null}
              </AnswerBlock>
            </div>
            <div className="self-center rounded-[20px] border border-white/10 bg-white/[0.04] p-6 md:mt-10">
              {heroStats.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 py-3.5 last:border-0"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {label}
                  </span>
                  <strong className="text-sm font-semibold text-white">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-[2] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-[#F6F5F2] py-20 md:py-32"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            index="§ 01"
            title="The rulebook"
            accent="before you book."
            label="Three boundaries"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {rulebookCards.map(({ icon, label, title: cardTitle, desc }) => {
              const Icon = RULEBOOK_ICONS[icon];
              if (!Icon) return null;
              return (
                <div
                  key={cardTitle}
                  className="rounded-[20px] border border-[#E3E0DA] bg-white p-7"
                >
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-orange">
                    {label}
                  </p>
                  <h3
                    className="mb-3 text-xl font-black text-jvto-navy"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {cardTitle}
                  </h3>
                  <p className="text-[15px] font-light leading-relaxed text-[#6b7280]">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative z-[3] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-white py-20 md:py-32"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.05)" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            index="§ 02"
            title="Destination"
            accent="guides."
            label="Practical logistics"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {destinationGuides.map(({ href, name, desc }) => (
              <GuideCard key={href} href={href} name={name} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative z-[4] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-[#F6F5F2] py-20 md:py-32"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            index="§ 03"
            title="Practical"
            accent="preparation."
            label="Climate - gear - connectivity"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <GuideCard
              href={packingCard.href}
              name={packingCard.name}
              desc={packingCard.desc}
              action={packingCard.action}
            />
            {extraPracticalCards.map(({ icon, title: cardTitle, desc, footerLabel }) => {
              const Icon = EXTRA_PRACTICAL_ICONS[icon];
              if (!Icon) return null;
              return (
                <div
                  key={cardTitle}
                  className="rounded-[20px] border border-[#E3E0DA] bg-white p-7"
                >
                  <Icon />
                  <h3
                    className="mb-3 text-xl font-black text-jvto-navy"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {cardTitle}
                  </h3>
                  <p className="mb-4 text-[15px] font-light leading-relaxed text-[#6b7280]">
                    {desc}
                  </p>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af]">
                    {footerLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative z-[5] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-jvto-navy py-20 md:py-32"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            index="§ 04"
            title="Operational certainty"
            accent="checklist."
            label="Three steps"
            dark
          />
          <ol className="max-w-[64ch]">
            {checklistItems.map((item, index) => (
              <li
                key={item.title}
                className="grid grid-cols-[44px_1fr] gap-4 border-b border-white/15 py-6 first:border-t first:border-t-white/15"
              >
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-jvto-orange/10 font-mono text-sm font-bold text-jvto-orange">
                  {index + 1}
                </span>
                <div>
                  <h4
                    className="mb-1 text-lg font-bold text-white"
                    style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[15px] font-light leading-relaxed text-white/65">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="relative z-[6] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-[#F6F5F2] py-20 md:py-32"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading
            index="§ 05"
            title="All"
            accent="articles."
            label={`${articles.length} guides`}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(({ slug, label, name, desc }) => (
              <Link
                key={slug}
                href={`/travel-guide/${slug}`}
                prefetch={false}
                className="group block rounded-[16px] border border-[#E3E0DA] bg-white p-6 transition-all hover:border-jvto-orange/30 hover:shadow-[0_8px_32px_rgba(232,101,10,0.08)]"
              >
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-jvto-orange">
                  {label}
                </p>
                <h3
                  className="mb-2 text-[17px] font-bold leading-snug text-jvto-navy"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  {name}
                </h3>
                <p className="mb-4 text-[14px] font-light leading-relaxed text-[#6b7280]">
                  {desc}
                </p>
                <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jvto-orange">
                  Open <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section
          className="relative z-[8] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-white py-20 md:py-28"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.05)" }}
        >
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <SectionHeading index="§ 06" title="Frequently" accent="asked." />
            <Faq items={faqItems} title="Travel Guide: Common Questions" />
          </div>
        </section>
      ) : null}

      {officialBody ? (
        <section
          className="relative z-[8] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-white py-20 md:py-28"
          style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.06)" }}
        >
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <SectionHeading
              index="§ 07"
              title="Official"
              accent="guide text."
              label="Rendered from ecosystem"
            />
            <div className="rounded-[20px] border border-[#E3E0DA] bg-white p-8 md:p-12">
              <MarkdownRendererTravelGuide markdown={officialBody} />
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="relative z-[9] -mt-16 rounded-t-[clamp(36px,5vw,72px)] bg-jvto-navy py-20 md:py-28"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
          <h2
            className="mb-8 font-black leading-[1.02] text-white"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              fontSize: "clamp(32px, 4.5vw, 48px)",
            }}
          >
            Ready for operational{" "}
            <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/tours"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-jvto-orange px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#C4520A]"
            >
              Explore tours <ArrowRight />
            </Link>
            <Link
              href="/verify-jvto"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/20 px-8 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
            >
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
