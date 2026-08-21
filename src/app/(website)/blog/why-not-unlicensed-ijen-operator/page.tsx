import type { Metadata } from "next";
import { applyLiveNumbers, getLiveNumbers } from "@/lib/publicContent/liveNumbers";
import Link from "@/components/website/AppLink";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";

const ROUTE = "/blog/why-not-unlicensed-ijen-operator";

const fallbackSeo = {
  title: "Why Not an Unlicensed Ijen Operator | JVTO Field Notes",
  h1: "Why not an unlicensed Ijen operator.",
  description:
    "The volcano is the same. Everything around it — your legal recourse, the safety chain, the regulatory framework that protects you — is not.",
};

type RichSegment = { text: string; strong?: boolean; href?: string };

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this route.
const FALLBACK = {
  // Long-form <meta name="description"> text — distinct from fallbackSeo.description
  // (the shorter text used for the JSON-LD/breadcrumb SEO row), matching the
  // original hardcoded page's two separate description strings.
  metaDescriptionLong:
    "The volcano is the same. Everything around it — your legal recourse, the safety chain, the regulatory framework that protects you — is not. A guide to the four risk categories of booking an unlicensed East Java tour operator.",
  schemaFacts: {
    headline: "Why not an unlicensed Ijen operator.",
    description:
      "The four categories of risk travelers accept when booking Mount Ijen through an unlicensed operator — safety, legal, financial, and regulatory — plus a concrete verification checklist.",
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    authorName: "JVTO ops team",
    keywords: "Ijen operator, licensed tour operator, Kawah Ijen safety, East Java volcano tour",
  },
  hero: {
    eyebrowBadge: "Field notes",
    eyebrowTag: "BLOG / SAFETY",
    titlePrefix: "Why not an ",
    titleEmphasis: "unlicensed",
    titleSuffix: " Ijen operator.",
    lede: "The volcano is the same. Everything around it — your legal recourse, the safety chain, the regulatory framework that protects you — is not.",
    metaBlock: [
      { label: "Reading time", value: "6 min" },
      { label: "Author", value: "JVTO ops team" },
      { label: "Updated", value: "27 May 2026" },
      { label: "Topic", value: "Kawah Ijen" },
    ] as { label: string; value: string }[],
  },
  article: {
    kicker: "Kawah Ijen · 6 min read · 27 May 2026",
    openingLede: [
      {
        text: "The first time you land in Surabaya or arrive at the Banyuwangi ferry port, the offers come fast. Drivers with cardboard signs, hotel front-desk staff with \"a friend who can take you,\" WhatsApp groups full of \"best price guaranteed.\" The advertised number is always lower than the licensed operator's quote. Same volcano. Same blue fire. Same sunrise.",
      },
    ] as RichSegment[],
    followUp: "It is not the same.",
    intro:
      "What changes when you book Mount Ijen through an unlicensed operator is not the volcano. It is everything around the volcano: the legal recourse you have if something goes wrong, the safety chain behind the people guiding you up the trail, and the regulatory framework that protects you from a market full of operators who can disappear the day after you pay.",
    disclosure: {
      label: "Disclosure",
      text: "This guide is written by a licensed Indonesian tour operator. We have a clear commercial interest in this question, and we are stating that openly. What follows is a description of the actual risks travelers take when booking outside the licensed market — and a checklist you can use with any operator, including us and our competitors, before you transfer a single Rupiah.",
    },
    risksHeading: "The four categories of risk you are accepting",
    risk1: {
      heading: "1. Safety risk",
      p1: [
        { text: "Mount Ijen is a " },
        { text: "2,386-meter active volcano", strong: true },
        {
          text: " with a sulfur lake at its crater. Sulfur dioxide and hydrogen sulfide are released continuously from the crater floor. The hike is steep, the descent is in pre-dawn darkness, and the air at the rim can change from breathable to dangerous within minutes when the wind shifts.",
        },
      ] as RichSegment[],
      p2: "A licensed operator's guides are trained for this. Membership in HPWKI — the AHU-registered Ijen Specialist Tourism Association — requires completion of BBKSDA-supervised training in search and rescue, first aid, and disaster mitigation. This training was independently documented by BBKSDA Jawa Timur in their 2024 guide training report.",
      p3: "An unlicensed driver who picks you up at your hotel has none of that. He may be a kind person. He may have driven the route a hundred times. But when conditions change at the rim and a decision has to be made about whether to descend into the crater or turn back, you want that decision made by someone whose training is in safety protocol, not in repeat customers.",
      p4: "The same logic applies to health screening. Because a health certificate is mandatory for every Ijen guest under BBKSDA SE.35/K2/BIDTEK.1/KSA/1/2024, a licensed operator coordinates the screening workflow with a licensed physician. Unlicensed operators bypass the screening. Some published Ijen incident records — fatalities included — involve travelers who reached the crater rim with pre-existing cardiovascular or respiratory conditions they had never declared.",
    },
    risk2: {
      heading: "2. Legal risk",
      p1: [
        { text: "Indonesian tourism operators are required to hold a " },
        { text: "NIB", strong: true },
        { text: " (Nomor Induk Berusaha — Business Registration Number) issued through the OSS portal, and a " },
        { text: "TDUP", strong: true },
        {
          text: " (Tanda Daftar Usaha Pariwisata — Tourism Business License). These are not paperwork formalities. They establish the operator as a legal entity with a registered office, a tax identity, and a documented chain of responsibility.",
        },
      ] as RichSegment[],
      p2: "If your transport breaks down at 3 a.m. on the road from Bondowoso to Paltuding, a licensed operator's WhatsApp number is connected to a physical office and a registered business. An unlicensed driver's WhatsApp number is a SIM card. The Indonesian Tourist Police can intervene on behalf of a registered operator's customer. They cannot easily intervene when no contract, no receipt, and no licensed party exists.",
      p3: "This is not theoretical. East Java has documented incidents of foreign travelers stranded by unlicensed operators mid-trip — the operator stops responding, the deposit is gone, the local police have nothing to investigate because no business was ever registered. The difference between a frustrating story and a recoverable situation is whether there is a licensed business in the chain.",
    },
    risk3: {
      heading: "3. Financial risk",
      p1: "Unlicensed operators often quote a low headline price and add costs on the road: entrance fees you thought were included, jeep rentals at Mount Bromo that suddenly appear, gas mask rental \"from the cooperative,\" tips for guides who were supposed to already be paid. The total is rarely lower than a licensed all-inclusive package once these additions are summed.",
      p2: "A licensed operator publishes inclusions and exclusions in writing. JVTO, for example, publishes a clear policy pack covering booking, payment, and cancellation rules.",
      dataBox: [
        { label: "3-Day Ijen–Bromo · 2 pax", value: "IDR 3,570,000 / person" },
        { label: "Cancellation", value: "100% Lifetime Travel Credit" },
        {
          label: "Includes",
          value:
            "All entrance fees · gas masks · 4WD jeep · accommodation + breakfast · private transport · guide & driver",
        },
        { label: "Credit window", value: "≥ 48 hrs before Day 1 · no expiry · transferable" },
      ] as { label: string; value: string }[],
      p3: "The price covers what the document says, and the document is enforceable. Unlicensed operators publish nothing, and recover deposits at their discretion.",
    },
    risk4: {
      heading: "4. Regulatory and cultural risk",
      p1: "The Mount Bromo and Mount Ijen areas are protected national park land administered by BBKSDA (Balai Besar Konservasi Sumber Daya Alam) Jawa Timur. Entry rules — health screening on Ijen routes, jeep access at Bromo, area closures during volcanic alerts — are issued through formal BBKSDA regulations. Licensed operators must operate within these rules. Their permits depend on it.",
      p2: "Unlicensed operators bypass these rules when convenient. They take groups into the crater area during officially closed hours. They skip the health-screening step. They pay informal access fees to local fixers rather than the official entrance counters. If BBKSDA conducts a check at the trailhead — and they do — the unlicensed group is the one with the problem.",
      p3: "Beyond regulation, there is a cultural dimension. The licensed operator network in East Java works alongside local government tourism initiatives, ecotourism networks like INDECON, and the BBKSDA training chain that elevates local guides into a professionally credentialed labor pool. Money paid to licensed operators stays inside that system. Money paid to unlicensed drivers leaks outside of it.",
    },
    quote: "The volcano does not adjust its conditions for travelers who picked the cheaper option.",
    checklistHeading: "What \"licensed\" actually means — a concrete checklist",
    checklistIntro:
      "Before booking any East Java volcano tour operator — including JVTO — ask for the following. Any legitimate operator will provide them on request.",
    checklist: [
      {
        title: "NIB number",
        desc: "A 13-digit number. Ask for the document, not just the number. Verifiable through the OSS portal at oss.go.id.",
      },
      {
        title: "TDUP issuance date and number",
        desc: "The Tourism License is issued by the local Dinas Pariwisata. Should be a recent document if the operator is currently active.",
      },
      {
        title: "HPWKI membership",
        desc: "Ask which guide association the operator works through. For Ijen, the canonical association is HPWKI, registered AHU-0001072.AH.01.07.TAHUN 2024. AHU verification is publicly available.",
      },
      {
        title: "Named licensed physician for Ijen screening",
        desc: "If the route involves the BBKSDA-coordinated health-screening workflow, ask for the physician's name and STR number. Indonesian physician licenses are verifiable through the Kemenkes SatuSehat SDMK registry.",
      },
      {
        title: "Written inclusions, exclusions & cancellation policy",
        desc: "If the operator cannot send a written policy pack, the operator does not have one.",
      },
      {
        title: "Independent reviews off platforms they control",
        desc: "Trustpilot, Google Maps, TripAdvisor, GetYourGuide. Repeated specific crew names across years suggest a stable, credentialed team rather than rotating freelance drivers.",
      },
      {
        title: "A physical office address",
        desc: "Ask for it. Look it up on Google Maps. A real address with a real building is the cheapest signal to verify and one of the hardest to fake.",
      },
    ] as { title: string; desc: string }[],
    jvtoHeading: "Why JVTO specifically",
    jvtoIntro:
      "We do not market on price. East Java has plenty of operators who will be cheaper than us. What we offer is a verification stack that competitors cannot match easily:",
    jvtoList: [
      {
        strong: "Registered Indonesian limited company.",
        text: " PT Java Volcano Rendezvous, NIB 1102230032918, TDUP issued 2023-02-11, with a physical office at Jl. Khairil Anwar No.102 A, Bondowoso — the same address where the predecessor Ijen Bondowoso Homestay earned a Booking.com Guest Review Award (9.4/10) in 2015.",
      },
      {
        strong: "Tourist Police founder.",
        text: " Bripka Agung Sambuko is an active officer of the Indonesian Tourist Police (POLPAR) for Bondowoso, East Java. Press coverage by Detik.com and Radar Jember; SPRIN documents are SHA-256 anchored on our verification page.",
      },
      {
        strong: "14 KTA-credentialed crew.",
        text: " Seven guides and seven drivers (2024 issuance), with HPWKI-trained Ijen specialists, named across 195 independent reviews: Google (123, 4.9/5), Trustpilot (51, 4.8/5), TripAdvisor (21, 4.95/5).",
      },
      {
        strong: "Coordinated Ijen health screening.",
        text: " Supervised by Dr. Ahmad Irwandanu (STR verifiable through Kemenkes) for every guest under BBKSDA SE.35/K2/BIDTEK.1/KSA/1/2024.",
      },
      {
        strong: "Editorial recognition.",
        text: " Stefan Loose Reiseführer Indonesien (4th Edition, 2018) lists the founder on page 287 — an editorial reference, not a paid placement.",
      },
    ] as { strong: string; text: string }[],
    verifyOutro: [
      { text: "You can verify all of these claims on our " },
      { text: "Verify JVTO page", href: "/verify-jvto" },
      {
        text: ". Every credential links to a public registry. The verification system is designed so a skeptical traveler can audit the entire trust chain in about ten minutes.",
      },
    ] as RichSegment[],
    finalHeading: "Final thought",
    finalText:
      "The Mount Ijen experience is one of the most striking volcanic landscapes accessible to international travelers in Southeast Asia. It deserves a tour operator who treats it as a safety-critical activity, not as an inexpensive logistics exercise. Whether you book with us or with another licensed operator, please book with one who can answer the seven questions above without hesitation.",
    footer: [
      { text: "Browse licensed JVTO Ijen packages " },
      { text: "from Surabaya", href: "/tours/from-surabaya" },
      { text: " or " },
      { text: "from Bali", href: "/tours/from-bali" },
      { text: ", or read our " },
      { text: "full Verify JVTO trust documentation", href: "/verify-jvto" },
      { text: " before deciding." },
    ] as RichSegment[],
  },
  cta: {
    headingPrefix: "Book with a licensed ",
    headingEmphasis: "operator.",
  },
};

const LINK_CLASS =
  "text-jvto-orange font-semibold underline underline-offset-2 hover:text-jvto-orange/75 transition-colors";

function renderRich(segments: RichSegment[]) {
  return segments.map((seg, i) => {
    if (seg.href) {
      return (
        <Link key={i} href={seg.href} prefetch={false} className={LINK_CLASS}>
          {seg.text}
        </Link>
      );
    }
    if (seg.strong) {
      return (
        <strong key={i} className="text-jvto-navy">
          {seg.text}
        </strong>
      );
    }
    return <span key={i}>{seg.text}</span>;
  });
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-5 h-5 flex-shrink-0 text-jvto-orange"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

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
  const [seo, page] = await Promise.all([
    getEcosystemPageSeo(ROUTE, fallbackSeo),
    loadEcosystemPage(ROUTE),
  ]);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<
    typeof FALLBACK
  >;
  return {
    title: seo.title,
    description: pc.metaDescriptionLong ?? FALLBACK.metaDescriptionLong,
  };
}

export default async function WhyNotUnlicensedPage() {
  const [seo, page] = await Promise.all([
    getEcosystemPageSeo(ROUTE, fallbackSeo),
    loadEcosystemPage(ROUTE),
  ]);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<
    typeof FALLBACK
  >;

  const schemaFacts = pc.schemaFacts ?? FALLBACK.schemaFacts;
  const hero = pc.hero ?? FALLBACK.hero;
  const article = pc.article ?? FALLBACK.article;
  // Review counts in this list are {TOKEN} placeholders in ekosistem prose,
  // resolved from the same sources the schema reads (it said "123 reviews"
  // while JSON-LD said 152).
  const liveNumbers = await getLiveNumbers();
  const cta = pc.cta ?? FALLBACK.cta;

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

  const blogSchema = {
    "@type": "BlogPosting",
    "@id": `https://javavolcano-touroperator.com${ROUTE}#article`,
    headline: schemaFacts.headline,
    description: schemaFacts.description,
    datePublished: schemaFacts.datePublished,
    dateModified: schemaFacts.dateModified,
    author: {
      "@type": "Organization",
      "@id": "https://javavolcano-touroperator.com/#organization",
      name: schemaFacts.authorName,
    },
    publisher: { "@id": "https://javavolcano-touroperator.com/#organization" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://javavolcano-touroperator.com${ROUTE}`,
    },
    keywords: schemaFacts.keywords,
  };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} extraSchemas={[blogSchema]} />

      {/* ── Hero — navy ──────────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-32 pb-32 md:pb-44 relative overflow-hidden">
        {/* Hero background photo placeholder layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy via-jvto-navy/95 to-[#1a2f45] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/blog" prefetch={false} className="hover:text-white/70 transition-colors">
              Field notes
            </Link>
            <span>›</span>
            <span className="text-white/70">Why Not Unlicensed</span>
          </nav>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            {/* Left: eyebrow + title + lede */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {hero.eyebrowBadge}
                </span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  {hero.eyebrowTag}
                </span>
              </div>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}
              >
                {hero.titlePrefix}
                <em className="not-italic text-jvto-orange">{hero.titleEmphasis}</em>
                {hero.titleSuffix}
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                {hero.lede}
              </p>
            </div>

            {/* Right: meta block */}
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {hero.metaBlock.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {label}
                  </span>
                  <strong className="text-white font-semibold text-sm text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article — off-white, stacked ─────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-12 md:gap-16">

            {/* Sidebar */}
            <aside className="md:sticky md:top-24 self-start">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-jvto-orange mb-4">
                On this page
              </p>
              <nav className="space-y-0.5">
                {[
                  { href: "#risks", label: "The four risk categories" },
                  { href: "#checklist", label: "What \"licensed\" means" },
                  { href: "#jvto", label: "Why JVTO specifically" },
                  { href: "#final", label: "Final thought" },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="block text-[13px] font-medium py-2 px-3 rounded-lg text-[#6b7280] hover:text-jvto-navy hover:bg-white transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <Link
                href="/blog"
                prefetch={false}
                className="inline-flex items-center gap-1.5 mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors"
              >
                ← All field notes
              </Link>
            </aside>

            {/* Article body */}
            <article className="bg-white rounded-[20px] p-8 md:p-12 border border-[#E3E0DA] min-w-0">

              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] mb-6">
                {article.kicker}
              </p>

              <p className="text-[18px] text-jvto-navy font-medium leading-relaxed mb-6 border-l-4 border-jvto-orange pl-5">
                {renderRich(article.openingLede)}
              </p>

              <p className="text-[16px] text-jvto-navy font-semibold leading-relaxed mb-5">
                {article.followUp}
              </p>

              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8">
                {article.intro}
              </p>

              {/* Disclosure box */}
              <div className="border border-[#d4a017]/30 bg-[#fdf8ec] rounded-[16px] p-6 mb-10">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#b8860b] mb-3">
                  {article.disclosure.label}
                </p>
                <p className="text-[14px] text-[#4b5563] leading-relaxed">
                  {article.disclosure.text}
                </p>
              </div>

              {/* § Risks */}
              <h2
                id="risks"
                className="text-2xl md:text-3xl font-black text-jvto-navy leading-tight mb-6 mt-2 scroll-mt-28"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {article.risksHeading}
              </h2>

              <h3 className="text-[17px] font-bold text-jvto-navy mb-3 mt-8">{article.risk1.heading}</h3>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {renderRich(article.risk1.p1)}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk1.p2}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk1.p3}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8">
                {article.risk1.p4}
              </p>

              <h3 className="text-[17px] font-bold text-jvto-navy mb-3">{article.risk2.heading}</h3>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {renderRich(article.risk2.p1)}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk2.p2}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8">
                {article.risk2.p3}
              </p>

              <h3 className="text-[17px] font-bold text-jvto-navy mb-3">{article.risk3.heading}</h3>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk3.p1}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-5">
                {article.risk3.p2}
              </p>

              {/* Data box */}
              <div className="bg-[#F6F5F2] border border-[#E3E0DA] rounded-[16px] p-6 mb-6">
                {article.risk3.dataBox.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 border-b border-[#E3E0DA] last:border-0 py-3"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9ca3af] flex-shrink-0">
                      {label}
                    </span>
                    <span className="text-[14px] text-jvto-navy font-semibold sm:text-right max-w-[60%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8">
                {article.risk3.p3}
              </p>

              <h3 className="text-[17px] font-bold text-jvto-navy mb-3">
                {article.risk4.heading}
              </h3>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk4.p1}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-4">
                {article.risk4.p2}
              </p>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-6">
                {article.risk4.p3}
              </p>

              {/* Blockquote */}
              <blockquote className="border-l-4 border-jvto-orange pl-6 py-2 my-8">
                <p className="text-[18px] text-jvto-navy font-semibold italic leading-snug">
                  {article.quote}
                </p>
              </blockquote>

              {/* § Checklist */}
              <h2
                id="checklist"
                className="text-2xl md:text-3xl font-black text-jvto-navy leading-tight mb-4 mt-10 scroll-mt-28"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {article.checklistHeading}
              </h2>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-6">
                {article.checklistIntro}
              </p>

              <ol className="space-y-4 mb-10">
                {article.checklist.map(({ title, desc }, i) => (
                  <li
                    key={title}
                    className="flex gap-4 bg-[#F6F5F2] border border-[#E3E0DA] rounded-[14px] p-5"
                  >
                    <span className="font-mono text-[12px] font-bold text-jvto-orange border border-[#E3E0DA] rounded-full w-8 h-8 inline-flex items-center justify-center flex-shrink-0 bg-white">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="font-semibold text-jvto-navy text-[15px]">{title}</strong>
                      <p className="text-[13px] text-[#6b7280] font-light mt-1 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* § Why JVTO */}
              <h2
                id="jvto"
                className="text-2xl md:text-3xl font-black text-jvto-navy leading-tight mb-4 mt-2 scroll-mt-28"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {article.jvtoHeading}
              </h2>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-6">
                {article.jvtoIntro}
              </p>

              <ul className="space-y-4 mb-10">
                {article.jvtoList.map(({ strong, text }) => (
                  <li
                    key={strong}
                    className="flex gap-3 items-start p-4 rounded-[12px] bg-[#F6F5F2] border border-[#E3E0DA]"
                  >
                    <CheckIcon />
                    <p className="text-[14px] text-[#4b5563] leading-relaxed">
                      <strong className="text-jvto-navy">{strong}</strong>
                      {applyLiveNumbers(text, liveNumbers)}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8">
                {renderRich(article.verifyOutro)}
              </p>

              {/* § Final */}
              <h2
                id="final"
                className="text-2xl md:text-3xl font-black text-jvto-navy leading-tight mb-4 mt-2 scroll-mt-28"
                style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {article.finalHeading}
              </h2>
              <p className="text-[15px] text-[#4b5563] leading-relaxed mb-6">
                {article.finalText}
              </p>

              <hr className="border-[#E3E0DA] my-8" />

              <p className="text-[14px] text-[#6b7280] leading-relaxed">
                {renderRich(article.footer)}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA — navy, stacked ───────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.18)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2
            className="font-black text-white leading-[1.02] mb-8"
            style={{
              fontFamily: "Raleway, Inter, sans-serif",
              letterSpacing: "-0.03em",
              fontSize: "clamp(32px, 4.5vw, 52px)",
            }}
          >
            {cta.headingPrefix}
            <span className="text-jvto-orange">{cta.headingEmphasis}</span>
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
