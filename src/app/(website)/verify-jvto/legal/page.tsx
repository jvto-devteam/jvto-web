import { getDocsByGroup } from "@/lib/data-loader";
import AnswerBlock from "@/components/website/AnswerBlock";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import {
  buildLegalDigitalDocuments,
  buildDoctorSchema,
} from "@/lib/schemas/buildVerifySchemas";
import { buildBbksdaRegulationSchema, getEntityGraphFacts } from "@/lib/schemas/entityGraph";
import Image from "next/image";
import Link from "@/components/website/AppLink";

export const revalidate = 86400;

const fallbackSeo = {
  title: "JVTO Legal Documents — NIB, TDUP & PT Registration | JVTO",
  h1: "Legal Documents",
  description:
    "JVTO legal documents: NIB 1102230032918, TDUP tourism licence, and PT Java Volcano Rendezvous registration — all verifiable on Indonesian government registries.",
};

const BASE_URL = "https://javavolcano-touroperator.com";

const LEGAL_CREDENTIALS = [
  {
    label: "NIB",
    name: "Nomor Induk Berusaha",
    ref: "1102230032918",
    issuer: "OSS Indonesia (Online Single Submission)",
    issuerHref: "https://oss.go.id",
    docHref: `${BASE_URL}/legal/NIB-1102230032918.pdf`,
    termId: "term-nib",
  },
  {
    label: "TDUP",
    name: "Tanda Daftar Usaha Pariwisata",
    ref: "1102230032918",
    issuer: "Kementerian Pariwisata dan Ekonomi Kreatif",
    issuerHref: "https://kemenparekraf.go.id",
    docHref: `${BASE_URL}/legal/TDUP-1102230032918.pdf`,
    termId: "term-tdup",
  },
  {
    label: "HPWKI",
    name: "Ijen Guide Association Membership",
    ref: "BBKSDA Jawa Timur supervised",
    issuer: "AHU — Ministry of Law & Human Rights",
    issuerHref:
      "https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0",
    docHref: `${BASE_URL}/legal/HPWKI-approval.pdf`,
    termId: "term-hpwki",
  },
];

void LEGAL_CREDENTIALS; // kept for schema cross-reference data — used by LEGAL_DIGITAL_DOCUMENTS

// FALLBACK — exact copy of the content that used to be hardcoded here.
// Used only if ekosistem doesn't return a `pageContent` section for this route.
const FALLBACK = {
  heroStats: [
    { label: "Entity", value: "PT Java Volcano Rendezvous" },
    { label: "NIB", value: "1102230032918" },
    { label: "Incorporated", value: "2016" },
    { label: "Status", value: "Active" },
  ],
  proofCards: [
    { title: "NIB (Business Identification Number)", desc: "Official registration of PT Java Volcano Rendezvous as a licensed tour operator in Indonesia. Issued via OSS Online Single Submission system.", meta: "NIB: 1102230032918", href: "https://oss.go.id", img: "/legal/NIB-1102230032918-preview.webp" },
    { title: "TDUP (Tourism Business Registration)", desc: "Mandatory operating licence for tourism services in East Java, issued under the OSS system. Confirms JVTO as a legally registered tour operator.", meta: "Issued: 2023-02-11", href: "https://oss.go.id", img: "/legal/TDUP-1102230032918-preview.webp" },
    { title: "HPWKI (Ijen Guide Association)", desc: "State-recognized Ijen specialist guide association. Membership requires BBKSDA-supervised volcanic safety training (SAR + emergency medical response).", meta: "AHU-0001072·2024", href: "https://ahu.go.id", img: "/legal/HPWKI-approval-preview.webp" },
  ],
  articleIntro: "JVTO operates as PT Java Volcano Rendezvous, a registered Perseroan Terbatas (limited liability company) under the laws of the Republic of Indonesia. Every credential below is publicly verifiable through an Indonesian government registry — and the source documents are fingerprinted with SHA-256 hashes so they cannot be quietly altered.",
  dataBox: [
    { k: "Legal entity", v: "PT Java Volcano Rendezvous" },
    { k: "NIB (Business ID)", v: "1102230032918" },
    { k: "TDUP (Tourism License)", v: "Issued 2023-02-11" },
    { k: "Company registry (AHU)", v: "AHU-0010187.AH.01.01.TAHUN 2023" },
    { k: "Domicile", v: "Bondowoso, East Java" },
    { k: "Incorporated", v: "2016" },
  ],
  businessRegIntro: "Three government records establish JVTO as a legal entity with a registered office, a tax identity, and a documented chain of responsibility — the things a roadside agent or a SIM-card WhatsApp number cannot produce.",
  businessRegTable: [
    { cred: "Legal name", details: "PT Java Volcano Rendezvous", mono: "Verify · ahu.go.id/pencarian/perseroan", href: "https://ahu.go.id/pencarian/perseroan" },
    { cred: "AHU · Company registry", details: "AHU-0010187.AH.01.01.TAHUN 2023", mono: "Verify · ahu.go.id company search", href: "https://ahu.go.id" },
    { cred: "NIB · Nomor Induk Berusaha", details: "1102230032918", mono: "Verify · oss.go.id (Online Single Submission)", href: "https://oss.go.id" },
    { cred: "TDUP · Tourism Business License", details: "1102230032918 · issued 2023-02-11", mono: "Dinas Pariwisata · Sistem Tanda Daftar OSS", href: null as string | null },
  ],
  kbliIntro: "Our registration covers the full chain of a real tour operation — booking, operating, and guiding — not a single generic code.",
  kbliList: [
    { code: "79121", label: "Travel Agency (Agen Perjalanan Wisata)" },
    { code: "79911", label: "Tour Operator (Penyelenggara Wisata)" },
    { code: "79921", label: "Tour Guide activities (Pemanduan Wisata)" },
    { code: "79120", label: "Travel agency activities (related)" },
    { code: "62019", label: "Computer programming / IT services" },
  ],
  tourismSafetyIntro: "Holding a business license is the floor. Operating legally inside East Java's conservation areas — and putting credentialed guides on the trail — requires a further stack of authorizations.",
  tourismSafetyRows: [
    {
      label: "HPWKI",
      monoLine: "AHU-0001072.AH.01.07.TAHUN 2024",
      monoLineBreak: true,
      segments: [{ text: "Himpunan Pelaku Wisata Khusus Ijen — the state-recognized Ijen specialist guide association. Membership requires completion of BBKSDA-supervised volcanic safety training (SAR + emergency medical response)." }],
    },
    {
      label: "BBKSDA clearance",
      monoLine: null as string | null,
      monoLineBreak: false,
      segments: [
        { text: "Operator authorization to run trips inside Bromo Tengger Semeru National Park and the Ijen conservation area. Issued by BBKSDA Jawa Timur (" },
        { text: "bbksdajatim.org", href: "https://ayoketamannasional.kehutanan.go.id/en/taman-wisata-alam/kawah-ijen" },
        { text: ")." },
      ],
    },
    {
      label: "ISIC",
      monoLine: "Provider ID 259268",
      monoLineBreak: false,
      segments: [{ text: "· UNESCO-endorsed. Official ISIC provider — student-pricing eligibility verified in real time via the Alive Verify API." }],
    },
    {
      label: "INDECON",
      monoLine: null as string | null,
      monoLineBreak: false,
      segments: [
        { text: "Live member of the Indonesian Ecotourism Network — validates the community-based \"Local Boys\" employment policy. " },
        { text: "View listing", href: "https://www.indecon.id/spotlight-networks/java-volcano-tour-operator" },
        { text: "." },
      ],
    },
  ],
  medicalIntroBefore: "Because a health certificate is mandatory for every Ijen guest (BBKSDA SE.1658/K2/BIDTEK.1/KSA/9/2024), JVTO coordinates the clinic workflow with a named, licensed physician — not an in-house printout. The doctor behind every ",
  medicalIntroAfter: " is individually auditable.",
  medicalOfficer: {
    name: "Dr. Ahmad Irwandanu",
    desc: "Licensed Medical Doctor (Dokter Umum), SIP-credentialed. Registered with Kemenkes RI · SatuSehat SDMK · KKI.",
    lines: [
      { label: "STR", text: "satusehat.kemkes.go.id", href: "https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217" },
      { label: "KKI", text: "kki.go.id/cekdokter", href: "https://www.kki.go.id/cekdokter/form" },
    ],
  },
  forensicIntroBefore: "The source document for each credential is published with a SHA-256 hash in ",
  forensicIntroAfter: " on our website. A SHA-256 hash is a cryptographic fingerprint: if a single character of a document changes, the hash changes completely. You can compute the hash of any document we send you and confirm it matches — proof the file has not been altered, without us having to release the original.",
  whyIntro: "A credential is trustworthy in proportion to how expensive it is to fake. Each item above is a barrier to entry that an illegitimate operator cannot clear:",
  whyList: [
    { strong: "NIB & TDUP", rest: " require a physical headquarters, tax compliance, and legal liability — ongoing commitments a ghost operator cannot sustain." },
    { strong: "HPWKI membership", rest: " requires government-supervised BBKSDA training. It cannot be purchased or self-issued." },
    { strong: "SHA-256 hashes", rest: " make every document tamper-evident — alteration is mathematically detectable." },
  ],
  whyOutro: "These are not marketing badges. They are the things that are hard to obtain and impossible to forge.",
  addressBeforeStrong: "JVTO has operated from the same Bondowoso address since before the company existed. Our office sits at ",
  addressStrong: "Jl. Khairil Anwar No.102 A, Badean, Bondowoso, Jawa Timur 68214",
  addressAfterStrong: " — the same address where the predecessor \"Ijen Bondowoso Homestay\" received its Booking.com Guest Review Award (9.4/10) in 2015. The award shipping label, addressed to \"Agung, Jl. Khairil Anwar No.102, Bondowoso,\" documents an unbroken operational presence from the guesthouse era through PT incorporation to today.",
  howToVerifySteps: [
    { before: "Visit ", strong: "oss.go.id", after: " (Online Single Submission)." },
    { before: "Open the public NIB / business-name search.", strong: "", after: "" },
    { before: "Enter NIB ", strong: "1102230032918", after: " or \"PT Java Volcano Rendezvous\"." },
    { before: "Confirm the record shows JVTO at the Bondowoso domicile.", strong: "", after: "" },
  ],
  onRequestText: "Scans of the Akta Pendirian (Articles of Incorporation), the Kemenkumham (AHU) approval letter, the NIB certificate, and the TDUP can be requested directly via WhatsApp before booking — each matched to the SHA-256 hash above.",
  schemaFacts: undefined as
    | Parameters<typeof buildLegalDigitalDocuments>[0]
    | undefined,
  // Each hash belongs to the DOCUMENT, and documentPath is what the card links
  // to. Until 2026-08-22 the link pointed at imagePath — the preview thumbnail —
  // so a reader who followed it and hashed what they got found a mismatch, which
  // is exactly the doubt a forensic anchor exists to remove. The two press hashes
  // were also stale and have been recomputed from the files being served.
  forensicAnchors: [
    { asset: "NIB 1102230032918", hash: "fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7", documentPath: "/legal/NIB-1102230032918.pdf", imagePath: "/legal/NIB-1102230032918-preview.png" },
    { asset: "TDUP 1102230032918", hash: "27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3", documentPath: "/legal/TDUP-1102230032918.pdf", imagePath: "/legal/TDUP-1102230032918-preview.png" },
    { asset: "HPWKI Approval", hash: "dbb57389b62b1554e4d66ccd82c6888dd4c31cb0f85619601a9befb786ac32c3", documentPath: "/legal/HPWKI-approval.pdf", imagePath: "/legal/HPWKI-approval-preview.png" },
    { asset: "SPRIN POLPAR", hash: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab", documentPath: "/legal/SPRIN-POLPAR.pdf", imagePath: "/legal/SPRIN-POLPAR.png" },
    { asset: "SPRIN WAL TRAVEL 2024-02-12", hash: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3", documentPath: "/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf", imagePath: "/legal/SPRIN-WAL-TRAVEL-2024-02-12.png" },
    { asset: "Press — Detik.com 2021-03-14", hash: "a68a0ac0ef30d7d9fc14557832ede29098faf08570f768034fa44d6e38a48490", documentPath: "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png", imagePath: "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png" },
    { asset: "Press — Radar Jember 2021-03-24", hash: "034be340ccd4354374e1f8cad009f501f975df5c5b08f2e75e7a399a3f1f5bba", documentPath: "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png", imagePath: "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto/legal", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function LegalPage() {
  const [seo, docs, page, entityGraphFacts] = await Promise.all([
    getEcosystemPageSeo("/verify-jvto/legal", fallbackSeo),
    getDocsByGroup("legal"),
    loadEcosystemPage("/verify-jvto/legal"),
    getEntityGraphFacts(),
  ]);
  const pc = ((page?.raw as any)?.page?.content?.payload?.pageContent ?? {}) as Partial<typeof FALLBACK>;

  const heroStats = pc.heroStats ?? FALLBACK.heroStats;
  const proofCards = pc.proofCards ?? FALLBACK.proofCards;
  const articleIntro = pc.articleIntro ?? FALLBACK.articleIntro;
  const dataBox = pc.dataBox ?? FALLBACK.dataBox;
  const businessRegIntro = pc.businessRegIntro ?? FALLBACK.businessRegIntro;
  const businessRegTable = pc.businessRegTable ?? FALLBACK.businessRegTable;
  const kbliIntro = pc.kbliIntro ?? FALLBACK.kbliIntro;
  const kbliList = pc.kbliList ?? FALLBACK.kbliList;
  const tourismSafetyIntro = pc.tourismSafetyIntro ?? FALLBACK.tourismSafetyIntro;
  const tourismSafetyRows = pc.tourismSafetyRows ?? FALLBACK.tourismSafetyRows;
  const medicalIntroBefore = pc.medicalIntroBefore ?? FALLBACK.medicalIntroBefore;
  const medicalIntroAfter = pc.medicalIntroAfter ?? FALLBACK.medicalIntroAfter;
  const medicalOfficer = pc.medicalOfficer ?? FALLBACK.medicalOfficer;
  const forensicIntroBefore = pc.forensicIntroBefore ?? FALLBACK.forensicIntroBefore;
  const forensicIntroAfter = pc.forensicIntroAfter ?? FALLBACK.forensicIntroAfter;
  const whyIntro = pc.whyIntro ?? FALLBACK.whyIntro;
  const whyList = pc.whyList ?? FALLBACK.whyList;
  const whyOutro = pc.whyOutro ?? FALLBACK.whyOutro;
  const addressBeforeStrong = pc.addressBeforeStrong ?? FALLBACK.addressBeforeStrong;
  const addressStrong = pc.addressStrong ?? FALLBACK.addressStrong;
  const addressAfterStrong = pc.addressAfterStrong ?? FALLBACK.addressAfterStrong;
  const howToVerifySteps = pc.howToVerifySteps ?? FALLBACK.howToVerifySteps;
  const onRequestText = pc.onRequestText ?? FALLBACK.onRequestText;
  const forensicAnchors = pc.forensicAnchors ?? FALLBACK.forensicAnchors;
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
        route: "/verify-jvto/legal",
        lang: "en",
        seo: { title: seo.title, description: seo.description },
        content: { h1: seo.h1 },
      };

  const NAV_LINKS = [
    { href: "/verify-jvto", label: "Proof library overview", active: false },
    { href: "/verify-jvto/legal", label: "Legal Identity", active: true },
    { href: "/verify-jvto/history-artifacts", label: "History & Artifacts", active: false },
    { href: "/verify-jvto/press-recognition", label: "Press & Recognition", active: false },
    { href: "/verify-jvto/police-safety", label: "Police & Safety", active: false },
  ];

  return (
    <>
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={[
          buildVerifySubpageSchema({
            pathname: "/verify-jvto/legal",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          ...buildLegalDigitalDocuments(schemaFacts),
          buildDoctorSchema(entityGraphFacts?.doctor),
          buildBbksdaRegulationSchema(entityGraphFacts?.bbksdaRegulation),
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
            <span className="text-white/70">Legal Identity</span>
          </nav>
          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Audit · Legal</span>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">PROOF / LEGAL</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.98] mb-6" style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.03em" }}>
                Legal <em className="not-italic text-jvto-orange">identity.</em>
              </h1>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-[52ch]">
                Every document JVTO uses to assert its legal identity, with steps to verify it through Indonesian government channels.
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
                  <strong className={`font-semibold text-sm text-right ${value === "Active" ? "text-[#8CC63F]" : "text-white"}`}>{value}</strong>
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
          {/* Document ProofCards — visual trust anchors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {proofCards.map(({ title, desc, meta, href, img }) => (
              <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-2xl overflow-hidden border border-[#E3E0DA] hover:border-jvto-orange/30 hover:shadow-lg transition-all block">
                <div className="relative h-48 overflow-hidden bg-[#F0EDE8]">
                  <Image src={img} alt={title} fill unoptimized className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-jvto-orange/10 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-jvto-orange" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-jvto-navy text-[15px] mb-2 leading-snug" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>{title}</h3>
                  <p className="text-[#6b7280] text-[13px] font-light leading-relaxed mb-4">{desc}</p>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-jvto-orange">{meta}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
            {/* Sidebar */}
            <aside className="flex flex-col">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-4">Verify JVTO</span>
              <ul className="border-t border-[#E3E0DA]">
                {NAV_LINKS.map(({ href, label, active }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      prefetch={false}
                      className={`block border-b border-[#E3E0DA] py-2.5 text-[14px] transition-colors ${
                        active ? "text-jvto-navy font-semibold" : "text-[#6b7280] hover:text-jvto-navy"
                      }`}
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
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca3af] mb-5">Audit record · LEG-001</span>
              <p className="text-[17px] text-[#374151] font-light leading-relaxed mb-8">
                {articleIntro}
              </p>

              {/* Data box */}
              <div className="rounded-xl overflow-hidden mb-10" style={{ border: "1px solid #E3E0DA" }}>
                {dataBox.map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center px-4 py-3" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9ca3af]">{k}</span>
                    <span className="text-[14px] font-medium text-jvto-navy text-right">{v}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Business registration</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {businessRegIntro}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Credential</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Number &amp; verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessRegTable.map(({ cred, details, mono, href }) => (
                      <tr key={cred} style={{ borderBottom: "1px solid #E3E0DA" }}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55]">{cred}</td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                          {details}
                          <br />
                          <span className="font-mono text-[12.5px] text-[#6b7280]">
                            {href ? (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">{mono}</a>
                            ) : mono}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-lg mt-8 mb-3 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Business activity codes (KBLI)</h3>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">{kbliIntro}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {kbliList.map(({ code, label }) => (
                  <li key={code} className="flex gap-3 items-baseline py-3.5 text-[15px]" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <b className="font-mono text-[12px] font-bold text-jvto-orange" style={{ minWidth: "3.6em" }}>{code}</b>
                    <span className="font-light text-jvto-navy">{label}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Tourism &amp; safety credentials</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {tourismSafetyIntro}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Credential</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">Identifier &amp; function</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourismSafetyRows.map((row, idx) => (
                      <tr key={row.label} style={idx < tourismSafetyRows.length - 1 ? { borderBottom: "1px solid #E3E0DA" } : undefined}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">{row.label}</td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                          {row.monoLine && (
                            <span className="font-mono text-[12.5px]">{row.monoLine}</span>
                          )}
                          {row.monoLine && row.monoLineBreak && <br />}
                          {row.monoLine && !row.monoLineBreak ? " " : null}
                          {row.segments.map((seg, i) =>
                            "href" in seg && seg.href ? (
                              <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">{seg.text}</a>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Medical credential</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {medicalIntroBefore}<em>surat sehat</em>{medicalIntroAfter}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-10">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3 pr-4">Officer</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-bold pb-3">License &amp; verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">{medicalOfficer.name}</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        {medicalOfficer.desc}
                        <br />
                        {medicalOfficer.lines.map((line, i) => (
                          <span key={line.label}>
                            <span className="font-mono text-[12.5px] text-[#6b7280]">{line.label} · <a href={line.href} target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40">{line.text}</a></span>
                            {i < medicalOfficer.lines.length - 1 && <br />}
                          </span>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Forensic integrity — SHA-256 anchors</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                {forensicIntroBefore}<span className="font-mono text-[13px] text-[#6b7280]">public/llms.txt</span>{forensicIntroAfter}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {forensicAnchors.map((a) => (
                  <a key={a.asset} href={`${BASE_URL}${a.documentPath ?? a.imagePath}`} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                      <Image src={a.imagePath} alt={`Preview of ${a.asset}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{a.asset}</p>
                  </a>
                ))}
              </div>
              <ul className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {forensicAnchors.map((a) => (
                  <li key={a.asset} className="py-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-bold text-[15px] text-jvto-navy">{a.asset}</span>
                    <span className="font-mono text-[11.5px] text-[#9ca3af] break-all leading-relaxed">{a.hash}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Why these are costly signals</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">{whyIntro}</p>
              <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-jvto-orange">
                {whyList.map(({ strong, rest }) => (
                  <li key={strong} className="text-[15px] text-[#374151] font-light leading-relaxed"><strong className="text-jvto-navy font-semibold">{strong}</strong>{rest}</li>
                ))}
              </ul>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">{whyOutro}</p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Address continuity</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">
                {addressBeforeStrong}<strong className="text-jvto-navy font-semibold">{addressStrong}</strong>{addressAfterStrong}
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>How to verify the NIB yourself</h2>
              <ol className="space-y-2 mb-8 pl-5 list-decimal">
                {howToVerifySteps.map((step, i) => (
                  <li key={i} className="text-[15px] text-[#374151] font-light leading-relaxed">
                    {step.before}{step.strong && <strong className="text-jvto-navy font-semibold">{step.strong}</strong>}{step.after}
                  </li>
                ))}
              </ol>

              <div className="rounded-xl p-6" style={{ border: "1px solid #E3E0DA", borderLeft: "3px solid #8CC63F", background: "rgba(140,198,63,0.05)" }}>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy mb-2">On request</span>
                <p className="text-[15px] text-jvto-navy leading-relaxed font-light">{onRequestText}</p>
              </div>
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
