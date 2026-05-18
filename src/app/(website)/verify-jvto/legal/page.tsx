import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
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
import { ExternalLink, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";

export const revalidate = 86400;

const fallbackSeo = {
  title: "Verify: Legal Documents",
  h1: "Legal Documents",
  description:
    "Verify NIB, TDUP, and official business registrations of PT Java Volcano Rendezvous.",
};

const BASE_URL = "https://javavolcano-touroperator.com";

const SHA256_ANCHORS = [
  {
    asset: "NIB 1102230032918",
    hash: "fa20dde31bb75e46b061ed14cc6d003f6960c02a9a82c20d8603b0cbf6f7b1b7",
    imageUrl: `${BASE_URL}/legal/NIB-1102230032918-preview.png`,
  },
  {
    asset: "TDUP 1102230032918",
    hash: "27252d512ddfa74de22a3e3ec10aa3dd40ef88da3eb57349fcd2137411551ee3",
    imageUrl: `${BASE_URL}/legal/TDUP-1102230032918-preview.png`,
  },
  {
    asset: "HPWKI Approval",
    hash: "ca1fb1a48b550a7748d400f165899f12a356e6941aacdde9c043427698aaf63b",
    imageUrl: `${BASE_URL}/legal/HPWKI-approval-preview.png`,
  },
  {
    asset: "SPRIN POLPAR",
    hash: "03c8578dc22956faa366d957badecfe38868d4760359cd8059fb2d6b145dfeab",
    imageUrl: `${BASE_URL}/legal/SPRIN-POLPAR.png`,
  },
  {
    asset: "SPRIN WAL TRAVEL 2024-02-12",
    hash: "179b061eae558943fdccc51d2ea3c8233a704b61f03ca3d212433f3e8d6f3bd3",
    imageUrl: `${BASE_URL}/legal/SPRIN-WAL-TRAVEL-2024-02-12.png`,
  },
  {
    asset: "Press — Detik.com 2021-03-14",
    hash: "b257b75b3d2b9edebf07c9af89a6c6aa9a4e01d6a716ef3f7c4ca75deda64b77",
    imageUrl: `${BASE_URL}/press/screencapture-news-detik-berita-jawa-timur-d-5492690-suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin-2026-01-14-02_48_41.png`,
  },
  {
    asset: "Press — Radar Jember 2021-03-24",
    hash: "2a60eb168274004283b2b9939ccbf5982c12a7db854fda014308a2494ee2abf4",
    imageUrl: `${BASE_URL}/press/screenshot-radarjember.jawapos.com-polpar-dibentuk-untuk-mendukung-ijen-geopark.png`,
  },
];

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
          // DigitalDocument chain: NIB / TDUP / HPWKI with DefinedTerm @id cross-refs
          ...LEGAL_DIGITAL_DOCUMENTS,
          // DOCTOR_SCHEMA cross-ref: medical compliance chain (MH per cluster_role_contracts.md Cluster 4)
          // Connects: SE.1658 (BBKSDA regulation) → JVTO health screening → Dr. Ahmad (SIP verified)
          DOCTOR_SCHEMA,
          // BBKSDA_REGULATION_SCHEMA (SH): regulatory chain anchoring health cert requirement
          BBKSDA_REGULATION_SCHEMA,
          // Canonical FAQ via resolver
          faqResolvedNode,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <VerifyJvtoClient
        initialDocs={docs}
        groupTitle={seo.h1}
        heroTitle={seo.h1}
        heroDescription={seo.description}
      />
      {/* ── Legal Credential Summary ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Business Registration & Licensing
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Credential", "Name", "Reference", "Issuing Authority", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEGAL_CREDENTIALS.map((c) => (
                  <tr key={c.label} className="border-b border-slate-900">
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-black text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm">
                        {c.label}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-slate-400 text-xs">{c.name}</td>
                    <td className="py-3 pr-6">
                      <a
                        href={c.docHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-300 hover:text-white underline underline-offset-2 decoration-slate-700 hover:decoration-white transition-colors inline-flex items-center gap-1"
                      >
                        {c.ref}
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 pr-6">
                      <a
                        href={c.issuerHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
                      >
                        {c.issuer}
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[10px] text-jvto-green font-semibold">
                        <CheckCircle2 size={11} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Legal Entity Card ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4">
                Registered Legal Entity
              </p>
              <h2 className="text-white font-bold text-lg leading-snug mb-5">
                PT Java Volcano Rendezvous
              </h2>
              <dl className="space-y-2.5 text-xs">
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">Legal Name</dt>
                  <dd className="text-slate-300">PT Java Volcano Rendezvous</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">Brand</dt>
                  <dd className="text-slate-300">Java Volcano Tour Operator (JVTO)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">NIB / TDUP</dt>
                  <dd className="text-slate-300 font-mono">1102230032918</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">PT Incorporated</dt>
                  <dd className="text-slate-300">February 2023</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">Operations since</dt>
                  <dd className="text-slate-300">2015 (guesthouse era)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-28">Address</dt>
                  <dd className="text-slate-300">Jl. Khairil Anwar No. 102A, Bondowoso, East Java 68214</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 border border-slate-800 rounded-lg p-5 bg-slate-950 hover:border-slate-700 transition-colors group"
              >
                <ShieldCheck size={18} className="text-jvto-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Verify on AHU Registry
                  </p>
                  <p className="text-slate-300 text-xs group-hover:text-white transition-colors">
                    PT Java Volcano Rendezvous — Administrasi Hukum Umum, Ministry of Law & Human Rights
                  </p>
                  <p className="text-slate-600 text-[10px] mt-1 flex items-center gap-1">
                    ahu.go.id <ExternalLink size={9} />
                  </p>
                </div>
              </a>
              <a
                href="https://oss.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 border border-slate-800 rounded-lg p-5 bg-slate-950 hover:border-slate-700 transition-colors group"
              >
                <ShieldCheck size={18} className="text-jvto-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    NIB Issued via OSS
                  </p>
                  <p className="text-slate-300 text-xs group-hover:text-white transition-colors">
                    Online Single Submission (OSS) — Indonesia's business registration portal under BKPM
                  </p>
                  <p className="text-slate-600 text-[10px] mt-1 flex items-center gap-1">
                    oss.go.id <ExternalLink size={9} />
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHA-256 Forensic Anchors ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={13} className="text-jvto-green" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              SHA-256 Forensic Anchors
            </p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-2xl">
            Hashes published in <code className="text-slate-400 text-[10px]">public/llms.txt</code> on the JVTO website.
            Download any document and compute its SHA-256 hash to verify the file has not been altered.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Image", "Asset", "SHA-256 Hash"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHA256_ANCHORS.map((a) => (
                  <tr key={a.asset} className="border-b border-slate-800/60">
                    <td className="py-3 pr-4">
                      <a href={a.imageUrl} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                        <div className="relative w-16 h-10 bg-slate-800 rounded overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors">
                          <Image
                            src={a.imageUrl}
                            alt={`Preview of ${a.asset}`}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </a>
                    </td>
                    <td className="py-3 pr-6 text-slate-300 text-xs font-medium whitespace-nowrap">{a.asset}</td>
                    <td className="py-3 pr-6">
                      <code className="text-[10px] font-mono text-slate-500 break-all leading-relaxed">
                        {a.hash}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Medical Compliance Chain ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Regulatory Compliance Chain — Ijen Health Screening
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-2xl">
            JVTO's legal credentials extend into operational health compliance. Under BBKSDA
            regulation SE.1658/KSA.9/2024, every visitor ascending Kawah Ijen must present a
            health certificate from a licensed clinic. JVTO coordinates this directly.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="border border-slate-800 rounded-lg p-5 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Regulation Issuer
              </p>
              <p className="text-white text-sm font-bold mb-2">BBKSDA Jawa Timur</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">
                Balai Besar Konservasi Sumber Daya Alam — Ministry of Environment body
                managing Ijen Crater nature reserve. Issued SE.1658/KSA.9/2024 mandating
                pre-climb health certificates.
              </p>
              <a
                href="https://tiket.bbksdajatim.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                tiket.bbksdajatim.org <ExternalLink size={10} />
              </a>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-800 rounded-lg p-5 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                JVTO Coordination
              </p>
              <p className="text-white text-sm font-bold mb-2">Klinik Bakti Husada, Bondowoso</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Ministry of Health-licensed clinic coordinating on-site screenings for JVTO guests.
                Screening checks SpO₂ and blood pressure before ascent. Certificate issued
                digitally with QR code.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-800 rounded-lg p-5 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Licensed Physician
              </p>
              <p className="text-white text-sm font-bold mb-2">Dr. Ahmad Irwandanu</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">
                SIP (Surat Izin Praktik) and KKI (Konsil Kedokteran Indonesia) registered.
                Identity independently verifiable via the national health registry.
              </p>
              <a
                href="https://satusehat.kemkes.go.id/sdmk/nakes/QN00001073380217"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                Verify SIP <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
