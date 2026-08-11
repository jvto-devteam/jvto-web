import { getDocsByGroup } from "@/lib/data-loader";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import {
  LEGAL_DIGITAL_DOCUMENTS,
  DOCTOR_SCHEMA,
} from "@/lib/schemas/buildVerifySchemas";
import { BBKSDA_REGULATION_SCHEMA } from "@/lib/schemas/entityGraph";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { SHA256_ANCHORS } from "@/lib/forensic-anchors";
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/legal", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function LegalPage() {
  const seo = await getPageSeo("/verify-jvto/legal", fallbackSeo);
  const docs = getDocsByGroup("legal");
  const faqResolution = await resolveFaqsForPage("/verify-jvto/legal");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/legal");
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
          ...LEGAL_DIGITAL_DOCUMENTS,
          DOCTOR_SCHEMA,
          BBKSDA_REGULATION_SCHEMA,
          faqResolvedNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
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
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Entity", value: "PT Java Volcano Rendezvous" },
                { label: "NIB", value: "1102230032918" },
                { label: "Incorporated", value: "2016" },
                { label: "Status", value: "Active" },
              ].map(({ label, value }) => (
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
            {[
              { title: "NIB (Business Identification Number)", desc: "Official registration of PT Java Volcano Rendezvous as a licensed tour operator in Indonesia. Issued via OSS Online Single Submission system.", meta: "NIB: 1102230032918", href: "https://oss.go.id", img: "/legal/NIB-1102230032918-preview.webp" },
              { title: "TDUP (Tourism Business Registration)", desc: "Mandatory operating licence for tourism services in East Java, issued under the OSS system. Confirms JVTO as a legally registered tour operator.", meta: "Issued: 2023-02-11", href: "https://oss.go.id", img: "/legal/TDUP-1102230032918-preview.webp" },
              { title: "HPWKI (Ijen Guide Association)", desc: "State-recognized Ijen specialist guide association. Membership requires BBKSDA-supervised volcanic safety training (SAR + emergency medical response).", meta: "AHU-0001072·2024", href: "https://ahu.go.id", img: "/legal/HPWKI-approval-preview.webp" },
            ].map(({ title, desc, meta, href, img }) => (
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
                JVTO operates as PT Java Volcano Rendezvous, a registered Perseroan Terbatas (limited liability company) under the laws of the Republic of Indonesia. Every credential below is publicly verifiable through an Indonesian government registry — and the source documents are fingerprinted with SHA-256 hashes so they cannot be quietly altered.
              </p>

              {/* Data box */}
              <div className="rounded-xl overflow-hidden mb-10" style={{ border: "1px solid #E3E0DA" }}>
                {[
                  { k: "Legal entity", v: "PT Java Volcano Rendezvous" },
                  { k: "NIB (Business ID)", v: "1102230032918" },
                  { k: "TDUP (Tourism License)", v: "Issued 2023-02-11" },
                  { k: "Company registry (AHU)", v: "AHU-0023020" },
                  { k: "Domicile", v: "Bondowoso, East Java" },
                  { k: "Incorporated", v: "2016" },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center px-4 py-3" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9ca3af]">{k}</span>
                    <span className="text-[14px] font-medium text-jvto-navy text-right">{v}</span>
                  </div>
                ))}
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Business registration</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Three government records establish JVTO as a legal entity with a registered office, a tax identity, and a documented chain of responsibility — the things a roadside agent or a SIM-card WhatsApp number cannot produce.
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
                    {([
                      { cred: "Legal name", details: "PT Java Volcano Rendezvous", mono: "Verify · ahu.go.id/pencarian/perseroan", href: "https://ahu.go.id/pencarian/perseroan" },
                      { cred: "AHU · Company registry", details: "AHU-0023020", mono: "Verify · ahu.go.id company search", href: "https://ahu.go.id" },
                      { cred: "NIB · Nomor Induk Berusaha", details: "1102230032918", mono: "Verify · oss.go.id (Online Single Submission)", href: "https://oss.go.id" },
                      { cred: "TDUP · Tourism Business License", details: "1102230032918 · issued 2023-02-11", mono: "Dinas Pariwisata · Sistem Tanda Daftar OSS", href: null },
                    ] as const).map(({ cred, details, mono, href }) => (
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
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">Our registration covers the full chain of a real tour operation — booking, operating, and guiding — not a single generic code.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {[
                  { code: "79121", label: "Travel Agency (Agen Perjalanan Wisata)" },
                  { code: "79911", label: "Tour Operator (Penyelenggara Wisata)" },
                  { code: "79921", label: "Tour Guide activities (Pemanduan Wisata)" },
                  { code: "79120", label: "Travel agency activities (related)" },
                  { code: "62019", label: "Computer programming / IT services" },
                ].map(({ code, label }) => (
                  <li key={code} className="flex gap-3 items-baseline py-3.5 text-[15px]" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <b className="font-mono text-[12px] font-bold text-jvto-orange" style={{ minWidth: "3.6em" }}>{code}</b>
                    <span className="font-light text-jvto-navy">{label}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Tourism &amp; safety credentials</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Holding a business license is the floor. Operating legally inside East Java's conservation areas — and putting credentialed guides on the trail — requires a further stack of authorizations.
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
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">HPWKI</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <span className="font-mono text-[12.5px]">AHU-0001072.AH.01.07.TAHUN 2024</span>
                        <br />
                        Himpunan Pelaku Wisata Khusus Ijen — the state-recognized Ijen specialist guide association. Membership requires completion of BBKSDA-supervised volcanic safety training (SAR + emergency medical response).
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">BBKSDA clearance</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        Operator authorization to run trips inside Bromo Tengger Semeru National Park and the Ijen conservation area. Issued by BBKSDA Jawa Timur (<a href="https://bbksdajatim.org" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">bbksdajatim.org</a>).
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">ISIC</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        <span className="font-mono text-[12.5px]">Provider ID 259268</span> · UNESCO-endorsed. Official ISIC provider — student-pricing eligibility verified in real time via the Alive Verify API.
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">INDECON</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        Live member of the Indonesian Ecotourism Network — validates the community-based "Local Boys" employment policy. <a href="https://www.indecon.id/spotlight-networks/java-volcano-tour-operator" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">View listing</a>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Medical credential</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Because a health certificate is mandatory for every Ijen guest (BBKSDA SE.1658/KSA.9/2024), JVTO coordinates the clinic workflow with a named, licensed physician — not an in-house printout. The doctor behind every <em>surat sehat</em> is individually auditable.
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
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">Dr. Ahmad Irwandanu</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">
                        Licensed Medical Doctor (Dokter Umum), SIP-credentialed. Registered with Kemenkes RI · SatuSehat SDMK · KKI.
                        <br />
                        <span className="font-mono text-[12.5px] text-[#6b7280]">STR · <a href="https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40">satusehat.kemkes.go.id</a></span>
                        <br />
                        <span className="font-mono text-[12.5px] text-[#6b7280]">KKI · <a href="https://www.kki.go.id/cekdokter/form" target="_blank" rel="noopener noreferrer" className="text-jvto-orange underline decoration-jvto-orange/40">kki.go.id/cekdokter</a></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Forensic integrity — SHA-256 anchors</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                The source document for each credential is published with a SHA-256 hash in <span className="font-mono text-[13px] text-[#6b7280]">public/llms.txt</span> on our website. A SHA-256 hash is a cryptographic fingerprint: if a single character of a document changes, the hash changes completely. You can compute the hash of any document we send you and confirm it matches — proof the file has not been altered, without us having to release the original.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {SHA256_ANCHORS.map((a) => {
                  const imgSrc = a.imageUrl.replace("https://javavolcano-touroperator.com", "");
                  return (
                    <a key={a.asset} href={a.imageUrl} target="_blank" rel="noopener noreferrer" className="group">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                        <Image src={imgSrc} alt={`Preview of ${a.asset}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" />
                      </div>
                      <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{a.asset}</p>
                    </a>
                  );
                })}
              </div>
              <ul className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {SHA256_ANCHORS.map((a) => (
                  <li key={a.asset} className="py-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid #E3E0DA" }}>
                    <span className="font-bold text-[15px] text-jvto-navy">{a.asset}</span>
                    <span className="font-mono text-[11.5px] text-[#9ca3af] break-all leading-relaxed">{a.hash}</span>
                  </li>
                ))}
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Why these are costly signals</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">A credential is trustworthy in proportion to how expensive it is to fake. Each item above is a barrier to entry that an illegitimate operator cannot clear:</p>
              <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-jvto-orange">
                <li className="text-[15px] text-[#374151] font-light leading-relaxed"><strong className="text-jvto-navy font-semibold">NIB &amp; TDUP</strong> require a physical headquarters, tax compliance, and legal liability — ongoing commitments a ghost operator cannot sustain.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed"><strong className="text-jvto-navy font-semibold">HPWKI membership</strong> requires government-supervised BBKSDA training. It cannot be purchased or self-issued.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed"><strong className="text-jvto-navy font-semibold">SHA-256 hashes</strong> make every document tamper-evident — alteration is mathematically detectable.</li>
              </ul>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">These are not marketing badges. They are the things that are hard to obtain and impossible to forge.</p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Address continuity</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-6">
                JVTO has operated from the same Bondowoso address since before the company existed. Our office sits at <strong className="text-jvto-navy font-semibold">Jl. Khairil Anwar No.102 A, Badean, Bondowoso, Jawa Timur 68214</strong> — the same address where the predecessor "Ijen Bondowoso Homestay" received its Booking.com Guest Review Award (9.4/10) in 2015. The award shipping label, addressed to "Agung, Jl. Khairil Anwar No.102, Bondowoso," documents an unbroken operational presence from the guesthouse era through PT incorporation to today.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>How to verify the NIB yourself</h2>
              <ol className="space-y-2 mb-8 pl-5 list-decimal">
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Visit <strong className="text-jvto-navy font-semibold">oss.go.id</strong> (Online Single Submission).</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Open the public NIB / business-name search.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Enter NIB <strong className="text-jvto-navy font-semibold">1102230032918</strong> or "PT Java Volcano Rendezvous".</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Confirm the record shows JVTO at the Bondowoso domicile.</li>
              </ol>

              <div className="rounded-xl p-6" style={{ border: "1px solid #E3E0DA", borderLeft: "3px solid #8CC63F", background: "rgba(140,198,63,0.05)" }}>
                <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-navy mb-2">On request</span>
                <p className="text-[15px] text-jvto-navy leading-relaxed font-light">Scans of the Akta Pendirian (Articles of Incorporation), the Kemenkumham (AHU) approval letter, the NIB certificate, and the TDUP can be requested directly via WhatsApp before booking — each matched to the SHA-256 hash above.</p>
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
