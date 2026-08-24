import { getDocsByGroup } from "@/lib/data-loader";
import AnswerBlock from "@/components/website/AnswerBlock";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { buildPoliceSafetyDigitalDocuments } from "@/lib/schemas/buildVerifySchemas";
import Image from "next/image";
import Link from "@/components/website/AppLink";

export const revalidate = 86400;

const BASE_URL = "https://javavolcano-touroperator.com";

const fallbackSeo = {
  title: "Verify: Police Authority & Safety Protocols",
  h1: "Police & Safety",
  description:
    "JVTO's Tourist Police authority: SPRIN POLPAR documents, health screening coordination, and safety protocols for Bromo and Ijen volcano tours.",
};

const POLICE_CREDENTIALS = [
  {
    label: "SPRIN-POLPAR",
    name: "Tourist Police Assignment Letter",
    ref: "Surat Perintah Sprin/4954/XI/2020 — Polres Bondowoso",
    issuer: "Indonesian National Police (POLRI)",
    issuerHref: "https://polri.go.id",
    docHref: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
    sha256: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab",
    badge: "Police",
  },
  {
    label: "SPRIN-WAL-TRAVEL",
    name: "Traffic-escort order (Sprin/70/II/HUK.6.6./2024)",
    ref: "February 2024 — Surat Perintah Perjalanan",
    issuer: "Indonesian National Police (POLRI)",
    issuerHref: "https://polri.go.id",
    docHref: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
    sha256: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3",
    badge: "Active 2024",
  },
];

// Rich-text segment: plain text, or text wrapped in strong/em, or a link
// (external if href starts with http, internal Link if it starts with "/").
type RichSegment = { text: string; strong?: boolean; em?: boolean; href?: string };

function renderRich(segments: RichSegment[]) {
  return segments.map((seg, i) => {
    if (seg.href) {
      const className = "text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors";
      if (seg.href.startsWith("/")) {
        return (
          <Link key={i} href={seg.href} prefetch={false} className={className}>
            {seg.text}
          </Link>
        );
      }
      return (
        <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" className={className}>
          {seg.text}
        </a>
      );
    }
    if (seg.strong) return <strong key={i} className="text-jvto-navy font-semibold">{seg.text}</strong>;
    if (seg.em) return <em key={i}>{seg.text}</em>;
    return <span key={i}>{seg.text}</span>;
  });
}

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this route.
const FALLBACK = {
  heroStats: [
    { label: "Officer", value: "Bripka Agung Sambuko" },
    { label: "Unit", value: "POLPAR Bondowoso · East Java" },
    { label: "SPRIN documents", value: "2 · SHA-256 anchored" },
    { label: "Evidence layers", value: "4" },
  ],
  articleIntro: "\"Tourist Police-Led\" is a strong claim. Here is exactly what is behind it — and how to check each layer without taking our word for any of it.",
  whatPoliceLedMeansSegments: [
    { text: "JVTO founder Agung Sambuko (\"Mr. Sam\") is " },
    { text: "Bripka Agung Sambuko", strong: true },
    { text: " — an active serving officer of the Indonesian National Police (Polri), assigned to " },
    { text: "POLPAR Bondowoso", strong: true },
    { text: " (Polisi Pariwisata Bondowoso — Tourist Police, Polres Bondowoso). The assignment order places him in tourism governance for Bondowoso Regency, which covers the Kawah Ijen access route." },
  ] as RichSegment[],
  whatPoliceLedMeansPara2: "This is not a retired officer's background or an advisory title. It is active duty, documented annually in police travel orders. In practice it means:",
  whatPoliceLedMeansList: [
    "Every JVTO tour operates under someone with active institutional responsibility for tourist safety in this area — a legal duty, not a marketing position.",
    "Traffic Police escort for airport and ferry transfers is requested through formal police channels, not sold as a private security service.",
    "Police support-vehicle presence at group departures is photographed and recurring.",
  ],
  layer1Intro: "Two active-duty documents are on file, each published with a SHA-256 fingerprint so a copy you receive can be verified as unaltered.",
  docsTable: [
    { doc: "SPRIN POLPAR", dateLine: null as string | null, detail: "Surat Perintah — the formal assignment of Bripka Agung Sambuko to Tourist Police duties." },
    { doc: "SPRIN WAL-TRAVEL", dateLine: "2024-02-12" as string | null, detail: "Police travel order authorizing him to accompany tourist groups on field operations. A 2024 date — an active-year order, not a historical artifact." },
  ],
  docImages: [
    { src: "/legal/SPRIN-POLPAR.webp", label: "SPRIN POLPAR", hrefSuffix: "/legal/SPRIN-POLPAR.pdf" },
    { src: "/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp", label: "SPRIN WAL-TRAVEL · 2024-02-12", hrefSuffix: "/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf" },
  ],
  docHashes: [
    { label: "SPRIN POLPAR", hash: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab" },
    { label: "SPRIN WAL-TRAVEL · 2024-02-12", hash: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3" },
  ],
  layer2Text: "Escort photographs document the police connection as a recurring operational pattern, not a one-off staged photo. Two arrival photos at the Bondowoso hotel — one in daylight, one at night, both showing the same type of patrol car and uniformed Traffic Police officer — establish repetition across separate trips. A further photo shows Mr. Sam conducting a Tourist Police briefing at the Ijen Geopark Information Center with local sulfur miners present: coordination with the Ijen community, not just guest-escort work.",
  layer3Intro: "Three unrelated journalists across two publications named Bripka Agung Sambuko in Tourist Police contexts — with no JVTO involvement. No tour operator can arrange independent press across three separate stories.",
  pressTable: [
    { date: "2021-03-14", pub: "Detik.com", detail: "Direct quotes from Bripka Agung Sambuko during an overnight COVID-19 deployment at Kawah Wurung. National media, full access." },
    { date: "2021-03-24", pub: "Radar Jember", detail: "The Tourist Police unit (Polpar) documented as an institutional response to the Ijen Geopark — confirming the role is structural, not personal." },
    { date: "2021-05-27", pub: "Radar Jember", detail: "Active patrol at the Ijen crater monitoring sulfuric odor conditions — event-driven safety work, not a ceremonial title." },
  ],
  quote: "\"Sejak libur hari Kamis kemarin, saya tak pernah pulang. Stand by dan nginap di sini terus.\"",
  quoteAttributionSegments: [
    { text: "— Bripka Agung Sambuko to Detik.com, on staying on-site overnight at 10°C in rain and fog to enforce health protocols (14 March 2021). Full coverage on the " },
    { text: "Press & Recognition page", href: "/verify-jvto/press-recognition" },
    { text: "." },
  ] as RichSegment[],
  pressScreenshots: [
    { src: "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png", label: "Detik.com · 14 March 2021", href: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin" },
    { src: "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png", label: "Radar Jember · 24 March 2021", href: "https://radarjember.jawapos.com" },
  ],
  institutionalTable: [
    { field: "Rank", value: "Bripka (Brigadir Kepala — Senior Constable, Indonesian National Police)" },
    { field: "Unit", value: "Polisi Pariwisata (POLPAR) Bondowoso — Tourist Police, Polres Bondowoso" },
    { field: "Sub-unit", value: "East Java Tourist Police (Polisi Pariwisata — Polpar)" },
    { field: "Scope", value: "Tourist safety at designated vital objects in East Java, including the Kawah Ijen area" },
  ],
  rulesOutIntro: "No single document is the whole argument. Together, the four layers answer every skeptical question:",
  rulesOutList: [
    { title: "Document", before: "SPRIN POLPAR + SPRIN WAL-TRAVEL (SHA-256) rule out ", em: "\"the founder just claims to be a police officer.\"", after: "" },
    { title: "Visual", before: "Day and night escort photos + the Geopark briefing rule out ", em: "\"the police connection is theoretical, not operational.\"", after: "" },
    { title: "Press", before: "Three independent articles across two newsrooms rule out ", em: "\"only JVTO says this — no independent verification exists.\"", after: "" },
    { title: "Institutional", before: "The Polpar unit formed to support the Ijen Geopark rules out ", em: "\"this is a personal affiliation, not an institutional structure.\"", after: "" },
  ],
  trafficEscortText: "JVTO submits a formal request to the Traffic Police (Lalu Lintas) — it does not provide its own escort or operate a private security service. When the request is granted, a uniformed Traffic Police officer accompanies the transfer vehicle in a Polri patrol car. That is why the escort photos show a real officer and a real patrol car, not branded security guards.",
  healthScreeningSegments: [
    { text: "A health certificate is mandatory for every guest before Kawah Ijen crater entry. This is a " },
    { text: "regulatory requirement set by BBKSDA", strong: true },
    { text: " (Surat Edaran SE.1658/K2/BIDTEK.1/KSA/9/2024, cited as supporting authority), not a rule JVTO invents. JVTO coordinates the mandatory clinic workflow with Dr. Ahmad Irwandanu (SIP-licensed, Kemenkes-verifiable). The check measures oxygen saturation, blood pressure, heart rate, and respiratory history; a QR-verified " },
    { text: "surat sehat", em: true },
    { text: " is issued and scanned at the BBKSDA access gate. Screening can be done at " },
    { text: "the guest's hotel in Bondowoso", strong: true },
    { text: " (Bondowoso), " },
    { text: "Riverside Homestay, Bondowoso", strong: true },
    { text: " (Banyuwangi), or at your partner hotel before departure." },
  ] as RichSegment[],
  healthScreeningOutroSegments: [
    { text: "Full protocol, personnel, and regulatory basis are on the " },
    { text: "Ijen health-screening guide", href: "/travel-guide/ijen-health-screening" },
    { text: "." },
  ] as RichSegment[],
  whatWeWillNotDoText: "We will not stage uniformed photo opportunities, we will not exaggerate police involvement on individual tours, and we will not claim authority over locations where we do not coordinate. The line is honest; the operation behind it is honest too.",
  schemaFacts: undefined as
    | Parameters<typeof buildPoliceSafetyDigitalDocuments>[0]
    | undefined,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto/police-safety", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PoliceSafetyPage() {
  const [seo, docs, page] = await Promise.all([
    getEcosystemPageSeo("/verify-jvto/police-safety", fallbackSeo),
    getDocsByGroup("policeSafety"),
    loadEcosystemPage("/verify-jvto/police-safety"),
  ]);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<typeof FALLBACK>;

  const heroStats = pc.heroStats ?? FALLBACK.heroStats;
  const articleIntro = pc.articleIntro ?? FALLBACK.articleIntro;
  const whatPoliceLedMeansSegments = pc.whatPoliceLedMeansSegments ?? FALLBACK.whatPoliceLedMeansSegments;
  const whatPoliceLedMeansPara2 = pc.whatPoliceLedMeansPara2 ?? FALLBACK.whatPoliceLedMeansPara2;
  const whatPoliceLedMeansList = pc.whatPoliceLedMeansList ?? FALLBACK.whatPoliceLedMeansList;
  const layer1Intro = pc.layer1Intro ?? FALLBACK.layer1Intro;
  const docsTable = pc.docsTable ?? FALLBACK.docsTable;
  const docImages = pc.docImages ?? FALLBACK.docImages;
  const docHashes = pc.docHashes ?? FALLBACK.docHashes;
  const layer2Text = pc.layer2Text ?? FALLBACK.layer2Text;
  const layer3Intro = pc.layer3Intro ?? FALLBACK.layer3Intro;
  const pressTable = pc.pressTable ?? FALLBACK.pressTable;
  const quote = pc.quote ?? FALLBACK.quote;
  const quoteAttributionSegments = pc.quoteAttributionSegments ?? FALLBACK.quoteAttributionSegments;
  const pressScreenshots = pc.pressScreenshots ?? FALLBACK.pressScreenshots;
  const institutionalTable = pc.institutionalTable ?? FALLBACK.institutionalTable;
  const rulesOutIntro = pc.rulesOutIntro ?? FALLBACK.rulesOutIntro;
  const rulesOutList = pc.rulesOutList ?? FALLBACK.rulesOutList;
  const trafficEscortText = pc.trafficEscortText ?? FALLBACK.trafficEscortText;
  const healthScreeningSegments = pc.healthScreeningSegments ?? FALLBACK.healthScreeningSegments;
  const healthScreeningOutroSegments = pc.healthScreeningOutroSegments ?? FALLBACK.healthScreeningOutroSegments;
  const whatWeWillNotDoText = pc.whatWeWillNotDoText ?? FALLBACK.whatWeWillNotDoText;
  const schemaFacts = pc.schemaFacts;

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
        route: "/verify-jvto/police-safety",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  void POLICE_CREDENTIALS; // kept for schema data — referenced by POLICE_SAFETY_DIGITAL_DOCUMENTS

  const NAV_LINKS = [
    { href: "/verify-jvto", label: "Proof library overview", active: false },
    { href: "/verify-jvto/legal", label: "Legal Identity", active: false },
    { href: "/verify-jvto/history-artifacts", label: "History & Artifacts", active: false },
    { href: "/verify-jvto/press-recognition", label: "Press & Recognition", active: false },
    { href: "/verify-jvto/police-safety", label: "Police & Safety", active: true },
  ];

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          buildVerifySubpageSchema({
            pathname: "/verify-jvto/police-safety",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          ...buildPoliceSafetyDigitalDocuments(schemaFacts),
        ]}
        suppressCmsFaq
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-jvto-navy pt-24 md:pt-36 pb-32 md:pb-44 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy via-jvto-navy/95 to-[#1a2f45] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
          <nav className="mb-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <Link href="/" prefetch={false} className="hover:text-white/70 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/verify-jvto" prefetch={false} className="hover:text-white/70 transition-colors">Verify JVTO</Link>
            <span>›</span>
            <span className="text-white/70">Police &amp; Safety</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Audit · Safety</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">PROOF / SAFETY</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}>
                Police &amp; <em className="not-italic text-jvto-orange">safety proof.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                "Tourist Police-Led" is a strong claim, so we prove it in four independent layers: official police documents, field photographs, independent press, and institutional structure.
              </p>
              {/* The proof on this page is real but arrives as a gallery; the
                  opening now states what it amounts to, in the position
                  generative engines weight most heavily. */}
              <AnswerBlock>
                {typeof (page?.raw as any)?.page?.answerFirst === "string"
                  ? ((page!.raw as any).page.answerFirst as string)
                  : null}
              </AnswerBlock>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {heroStats.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                  <strong className="font-semibold text-sm text-right text-white">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article section ───────────────────────────────────────────────── */}
      <section
        className="bg-[#F6F5F2] py-16 md:py-24 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[2]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-4">Verify JVTO</span>
              <ul style={{ borderTop: "1px solid #E3E0DA" }}>
                {NAV_LINKS.map(({ href, label, active }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      className={`block py-2.5 text-[14px] transition-colors ${
                        active ? "text-jvto-navy font-semibold" : "text-[#6b7280] hover:text-jvto-navy"
                      }`}
                      style={{ borderBottom: "1px solid #E3E0DA" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tours" prefetch={false} className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-jvto-orange hover:text-jvto-orange/75 transition-colors">
                Browse tours →
              </Link>
            </aside>

            {/* Article */}
            <article className="bg-white rounded-2xl p-8 md:p-10">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-5">Audit record · SAFE-001</span>
              <p className="text-[17px] text-[#374151] font-light leading-relaxed mb-8">
                {articleIntro}
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What "police-led" means operationally</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                {renderRich(whatPoliceLedMeansSegments)}
              </p>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                {whatPoliceLedMeansPara2}
              </p>
              <ul className="space-y-2 mb-8 pl-5 list-disc marker:text-jvto-orange">
                {whatPoliceLedMeansList.map((item, i) => (
                  <li key={i} className="text-[15px] text-[#374151] font-light leading-relaxed">{item}</li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 1 — Official police documents</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {layer1Intro}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Document</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docsTable.map((row, idx) => (
                      <tr key={row.doc} style={idx < docsTable.length - 1 ? { borderBottom: "1px solid #E3E0DA" } : undefined}>
                        <td className={`font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] ${row.dateLine ? "" : "whitespace-nowrap"}`}>
                          {row.doc}
                          {row.dateLine && (
                            <>
                              <br />
                              <span className="font-normal text-[#9ca3af] text-[13px]">{row.dateLine}</span>
                            </>
                          )}
                        </td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {docImages.map(({ src, label, hrefSuffix }) => (
                  <a key={src} href={`${BASE_URL}${hrefSuffix}`} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                      <Image src={src} alt={`Document preview: ${label}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{label}</p>
                  </a>
                ))}
              </div>
              <ul className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {docHashes.map(({ label, hash }) => (
                  <li key={label} className="py-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-bold text-[15px] text-jvto-navy">{label}</span>
                    <span className="font-mono text-[11.5px] text-[#9ca3af] break-all leading-relaxed">{hash}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 2 — Field operations</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                {layer2Text}
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 3 — Independent press</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {layer3Intro}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Date · Publisher</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">What it confirms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pressTable.map(({ date, pub, detail }) => (
                      <tr key={date} style={{ borderBottom: "1px solid #E3E0DA" }}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">
                          {date}
                          <br />
                          <span className="font-normal text-[#9ca3af] text-[13px]">{pub}</span>
                        </td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">{detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <blockquote className="border-l-4 border-jvto-orange pl-5 my-6">
                <p className="text-[17px] text-jvto-navy font-light italic leading-relaxed">{quote}</p>
              </blockquote>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6 -mt-2">
                {renderRich(quoteAttributionSegments)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {pressScreenshots.map(({ src, label, href }) => (
                  <a key={src} href={href} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                      <Image src={src} alt={`Press screenshot: ${label}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 100vw, 50vw" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{label}</p>
                  </a>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 4 — Institutional structure</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Field</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutionalTable.map(({ field, value }) => (
                      <tr key={field} style={{ borderBottom: "1px solid #E3E0DA" }}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">{field}</td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-lg mt-8 mb-3 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What each layer rules out</h3>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">{rulesOutIntro}</p>
              <ol className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {rulesOutList.map(({ title, before, em, after }, i) => (
                  <li key={title} className="grid items-start gap-4 py-5" style={{ borderBottom: "1px solid #E3E0DA", gridTemplateColumns: "34px 1fr" }}>
                    <span className="font-mono text-[12px] font-bold text-jvto-orange bg-orange-50 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div>
                      <div className="font-bold text-jvto-navy text-[17px] mb-1 leading-tight" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>{title}</div>
                      <p className="text-[15px] text-[#6b7280] font-light leading-relaxed">{before}<em className="text-jvto-navy">{em}</em>{after}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>How the Traffic Police escort actually works</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                {trafficEscortText}
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Health screening — mandatory for every Ijen guest</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                {renderRich(healthScreeningSegments)}
              </p>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                {renderRich(healthScreeningOutroSegments)}
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What we will not do</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed">
                {whatWeWillNotDoText}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-jvto-navy py-20 md:py-28 rounded-t-[clamp(36px,5vw,72px)] -mt-16 relative z-[3]"
        style={{ boxShadow: "0 -32px 80px -36px rgba(13,27,42,0.25)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-black text-white leading-[1.02] mb-8" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em", fontSize: "clamp(32px, 4.5vw, 52px)" }}>
            Ready for operational <span className="text-jvto-orange">certainty?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours" prefetch={false} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-jvto-orange text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-[#C4520A] transition-colors">
              Explore tours
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/verify-jvto" prefetch={false} className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-mono text-[11px] font-bold uppercase tracking-[0.18em] rounded-[12px] hover:bg-white/10 transition-colors">
              Verify JVTO
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
