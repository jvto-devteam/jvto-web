import { getDocsByGroup } from "@/lib/data-loader";
import type { Metadata } from "next";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { POLICE_SAFETY_DIGITAL_DOCUMENTS } from "@/lib/schemas/buildVerifySchemas";
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
    ref: "Surat Perintah — Ditpamobvit",
    issuer: "Indonesian National Police (POLRI)",
    issuerHref: "https://polri.go.id",
    docHref: `${BASE_URL}/legal/SPRIN-POLPAR.pdf`,
    sha256: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab",
    badge: "Police",
  },
  {
    label: "SPRIN-WAL-TRAVEL",
    name: "Active Travel Order",
    ref: "February 2024 — Surat Perintah Perjalanan",
    issuer: "Indonesian National Police (POLRI)",
    issuerHref: "https://polri.go.id",
    docHref: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp`,
    sha256: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3",
    badge: "Active 2024",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo("/verify-jvto/police-safety", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PoliceSafetyPage() {
  const seo = await getEcosystemPageSeo("/verify-jvto/police-safety", fallbackSeo);
  const docs = await getDocsByGroup("policeSafety");
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
          ...POLICE_SAFETY_DIGITAL_DOCUMENTS,
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
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-[20px] p-6 md:mt-10 self-center">
              {[
                { label: "Officer", value: "Bripka Agung Sambuko" },
                { label: "Unit", value: "Ditpamobvit · East Java" },
                { label: "SPRIN documents", value: "2 · SHA-256 anchored" },
                { label: "Evidence layers", value: "4" },
              ].map(({ label, value }) => (
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
                "Tourist Police-Led" is a strong claim. Here is exactly what is behind it — and how to check each layer without taking our word for any of it.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What "police-led" means operationally</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                JVTO founder Agung Sambuko ("Mr. Sam") is <strong className="text-jvto-navy font-semibold">Bripka Agung Sambuko</strong> — an active serving officer of the Indonesian National Police (Polri), assigned to <strong className="text-jvto-navy font-semibold">Ditpamobvit</strong> (Direktorat Pengamanan Objek Vital — the Directorate of Vital Object Security, East Java). Ditpamobvit's mandate covers tourist safety at designated vital objects, and the Kawah Ijen area is within that jurisdiction.
              </p>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                This is not a retired officer's background or an advisory title. It is active duty, documented annually in police travel orders. In practice it means:
              </p>
              <ul className="space-y-2 mb-8 pl-5 list-disc marker:text-jvto-orange">
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Every JVTO tour operates under someone with active institutional responsibility for tourist safety in this area — a legal duty, not a marketing position.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Traffic Police escort for airport and ferry transfers is requested through formal police channels, not sold as a private security service.</li>
                <li className="text-[15px] text-[#374151] font-light leading-relaxed">Police support-vehicle presence at group departures is photographed and recurring.</li>
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 1 — Official police documents</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Two active-duty documents are on file, each published with a SHA-256 fingerprint so a copy you receive can be verified as unaltered.
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
                    <tr style={{ borderBottom: "1px solid #E3E0DA" }}>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">SPRIN POLPAR</td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">Surat Perintah — the formal assignment of Bripka Agung Sambuko to Tourist Police duties.</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55]">
                        SPRIN WAL-TRAVEL
                        <br />
                        <span className="font-normal text-[#9ca3af] text-[13px]">2024-02-12</span>
                      </td>
                      <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">Police travel order authorizing him to accompany tourist groups on field operations. A 2024 date — an active-year order, not a historical artifact.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { src: "/legal/SPRIN-POLPAR.webp", label: "SPRIN POLPAR", href: `${BASE_URL}/legal/SPRIN-POLPAR.pdf` },
                  { src: "/legal/SPRIN-WAL-TRAVEL-2024-02-12.webp", label: "SPRIN WAL-TRAVEL · 2024-02-12", href: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.pdf` },
                ].map(({ src, label, href }) => (
                  <a key={src} href={href} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F5F2] group-hover:ring-2 group-hover:ring-jvto-orange transition-all" style={{ border: "1px solid #E3E0DA" }}>
                      <Image src={src} alt={`Document preview: ${label}`} fill unoptimized className="object-cover object-top" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280] leading-snug group-hover:text-jvto-navy transition-colors">{label}</p>
                  </a>
                ))}
              </div>
              <ul className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                <li className="py-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid #E3E0DA" }}>
                  <span className="font-bold text-[15px] text-jvto-navy">SPRIN POLPAR</span>
                  <span className="font-mono text-[11.5px] text-[#9ca3af] break-all leading-relaxed">03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab</span>
                </li>
                <li className="py-4 flex flex-col gap-1.5" style={{ borderBottom: "1px solid #E3E0DA" }}>
                  <span className="font-bold text-[15px] text-jvto-navy">SPRIN WAL-TRAVEL · 2024-02-12</span>
                  <span className="font-mono text-[11.5px] text-[#9ca3af] break-all leading-relaxed">179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3</span>
                </li>
              </ul>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 2 — Field operations</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                Escort photographs document the police connection as a recurring operational pattern, not a one-off staged photo. Two arrival photos at the Bondowoso hotel — one in daylight, one at night, both showing the same type of patrol car and uniformed Traffic Police officer — establish repetition across separate trips. A further photo shows Mr. Sam conducting a Tourist Police briefing at the Ijen Geopark Information Center with local sulfur miners present: coordination with the Ijen community, not just guest-escort work.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Layer 3 — Independent press</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">
                Three unrelated journalists across two publications named Bripka Agung Sambuko in Tourist Police contexts — with no JVTO involvement. No tour operator can arrange independent press across three separate stories.
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
                    {[
                      { date: "2021-03-14", pub: "Detik.com", detail: "Direct quotes from Bripka Agung Sambuko during an overnight COVID-19 deployment at Kawah Wurung. National media, full access." },
                      { date: "2021-03-24", pub: "Radar Jember", detail: "The Tourist Police unit (Polpar) documented as an institutional response to the Ijen Geopark — confirming the role is structural, not personal." },
                      { date: "2021-05-27", pub: "Radar Jember", detail: "Active patrol at the Ijen crater monitoring sulfuric odor conditions — event-driven safety work, not a ceremonial title." },
                    ].map(({ date, pub, detail }) => (
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
                <p className="text-[17px] text-jvto-navy font-light italic leading-relaxed">"Sejak libur hari Kamis kemarin, saya tak pernah pulang. Stand by dan nginap di sini terus."</p>
              </blockquote>
              <p className="text-[15px] text-[#6b7280] font-light leading-relaxed mb-6 -mt-2">
                — Bripka Agung Sambuko to Detik.com, on staying on-site overnight at 10°C in rain and fog to enforce health protocols (14 March 2021). Full coverage on the <Link href="/verify-jvto/press-recognition" prefetch={false} className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Press &amp; Recognition page</Link>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { src: "/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png", label: "Detik.com · 14 March 2021", href: "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin" },
                  { src: "/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png", label: "Radar Jember · 24 March 2021", href: "https://radarjember.jawapos.com" },
                ].map(({ src, label, href }) => (
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
                    {[
                      { field: "Rank", value: "Bripka (Brigadir Kepala — Senior Constable, Indonesian National Police)" },
                      { field: "Unit", value: "Ditpamobvit — Direktorat Pengamanan Objek Vital (Directorate of Vital Object Security)" },
                      { field: "Sub-unit", value: "East Java Tourist Police (Polisi Pariwisata — Polpar)" },
                      { field: "Scope", value: "Tourist safety at designated vital objects in East Java, including the Kawah Ijen area" },
                    ].map(({ field, value }) => (
                      <tr key={field} style={{ borderBottom: "1px solid #E3E0DA" }}>
                        <td className="font-bold text-jvto-navy py-4 pr-4 align-top text-[15px] leading-[1.55] whitespace-nowrap">{field}</td>
                        <td className="text-jvto-navy py-4 align-top text-[15px] leading-[1.55] font-light">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-lg mt-8 mb-3 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What each layer rules out</h3>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-5">No single document is the whole argument. Together, the four layers answer every skeptical question:</p>
              <ol className="mb-10" style={{ borderTop: "1px solid #E3E0DA" }}>
                {([
                  { title: "Document", desc: <>SPRIN POLPAR + SPRIN WAL-TRAVEL (SHA-256) rule out <em className="text-jvto-navy">"the founder just claims to be a police officer."</em></> },
                  { title: "Visual", desc: <>Day and night escort photos + the Geopark briefing rule out <em className="text-jvto-navy">"the police connection is theoretical, not operational."</em></> },
                  { title: "Press", desc: <>Three independent articles across two newsrooms rule out <em className="text-jvto-navy">"only JVTO says this — no independent verification exists."</em></> },
                  { title: "Institutional", desc: <>The Polpar unit formed to support the Ijen Geopark rules out <em className="text-jvto-navy">"this is a personal affiliation, not an institutional structure."</em></> },
                ] as const).map(({ title, desc }, i) => (
                  <li key={title} className="grid items-start gap-4 py-5" style={{ borderBottom: "1px solid #E3E0DA", gridTemplateColumns: "34px 1fr" }}>
                    <span className="font-mono text-[12px] font-bold text-jvto-orange bg-orange-50 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <div>
                      <div className="font-bold text-jvto-navy text-[17px] mb-1 leading-tight" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>{title}</div>
                      <p className="text-[15px] text-[#6b7280] font-light leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>How the Traffic Police escort actually works</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                JVTO submits a formal request to the Traffic Police (Lalu Lintas) — it does not provide its own escort or operate a private security service. When the request is granted, a uniformed Traffic Police officer accompanies the transfer vehicle in a Polri patrol car. That is why the escort photos show a real officer and a real patrol car, not branded security guards.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>Health screening — mandatory for every Ijen guest</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-4">
                A health certificate is mandatory for every guest before Kawah Ijen crater entry. This is a <strong className="text-jvto-navy font-semibold">regulatory requirement set by BBKSDA</strong> (Surat Edaran SE.1658/KSA.9/2024, cited as supporting authority), not a rule JVTO invents. JVTO coordinates the mandatory clinic workflow with Dr. Ahmad Irwandanu (SIP-licensed, Kemenkes-verifiable). The check measures oxygen saturation, blood pressure, heart rate, and respiratory history; a QR-verified <em>surat sehat</em> is issued and scanned at the BBKSDA access gate. Screening can be done at <strong className="text-jvto-navy font-semibold">Klinik Bakti Husada</strong> (Bondowoso), <strong className="text-jvto-navy font-semibold">Puskesmas Licin</strong> (Banyuwangi), or at your partner hotel before departure.
              </p>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed mb-8">
                Full protocol, personnel, and regulatory basis are on the <Link href="/travel-guide/ijen-health-screening" prefetch={false} className="text-jvto-orange underline decoration-jvto-orange/40 hover:decoration-jvto-orange transition-colors">Ijen health-screening guide</Link>.
              </p>

              <h2 className="font-black text-2xl leading-tight mb-4 mt-10 text-jvto-navy" style={{ fontFamily: "Raleway, Inter, sans-serif" }}>What we will not do</h2>
              <p className="text-[15px] text-[#374151] font-light leading-relaxed">
                We will not stage uniformed photo opportunities, we will not exaggerate police involvement on individual tours, and we will not claim authority over locations where we do not coordinate. The line is honest; the operation behind it is honest too.
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
