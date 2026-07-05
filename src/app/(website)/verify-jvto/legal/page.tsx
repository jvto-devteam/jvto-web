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
import { SHA256_ANCHORS } from "@/lib/forensic-anchors";
import { ExternalLink, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";

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

      {/* ── Operational Continuity (Address Anchor + NIB Legacy Audit) ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Operational Continuity — Address Anchor
          </p>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Continuity statement */}
            <div>
              <h2 className="text-white font-bold text-lg leading-snug mb-5">
                Same address since 2015
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Before PT Java Volcano Rendezvous was incorporated in February
                2023, the same operation ran at the same Bondowoso address as{" "}
                <strong className="text-slate-200">Ijen Bondowoso Homestay</strong>.
                The 2015 Booking.com Guest Review Award (9.4/10) was shipped to{" "}
                <span className="font-mono text-slate-300">
                  Jl. Khairil Anwar No.102, Bondowoso
                </span>{" "}
                — the same street as today&rsquo;s PT office, demonstrating
                continuous operational presence across the guesthouse →
                PT → TDUP timeline.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Founder Mr. Sam (Bripka Agung Sambuko) operated the guesthouse
                from 2015 and is named in the 4th-edition Stefan Loose
                Reisef&uuml;hrer Indonesien (DuMont Reiseverlag) as the operator
                at the homestay address.
              </p>
            </div>

            {/* NIB legacy audit disclosure */}
            <div className="border border-slate-800 rounded-lg p-5 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Audit Disclosure — Legacy OSS Record
              </p>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                A second NIB —{" "}
                <span className="font-mono text-slate-300">0220001393513</span>
                {" "}— may appear in legacy OSS portal records linked to JVTO. If
                you encounter it during verification, treat it as a possible
                legacy registration; the canonical active license is{" "}
                <span className="font-mono text-slate-300">1102230032918</span>
                {" "}(shown in the credentials table above).
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                Disclosed proactively for transparency. The legacy record has no
                impact on current operational status — TDUP, HPWKI, BBKSDA,
                ISIC, and INDECON registrations all reference the canonical NIB.
              </p>
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
            Hashes published at <code className="text-slate-400 text-[10px]">/llms.txt</code> on the JVTO website.
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
