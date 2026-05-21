import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { POLICE_SAFETY_DIGITAL_DOCUMENTS } from "@/lib/schemas/buildVerifySchemas";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import { ExternalLink, CheckCircle2, Shield, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FOUNDER_LEADERSHIP, FIELD_OPERATIONS, POLICE_AUTHORITY_DOCUMENTS } from "@/lib/imageAssets";

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
  const seo = await getPageSeo("/verify-jvto/police-safety", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

export default async function PoliceSafetyPage() {
  const seo = await getPageSeo("/verify-jvto/police-safety", fallbackSeo);
  const docs = getDocsByGroup("policeSafety");
  // Phase 5 (2026-04-29): canonical FAQ via resolver. /verify-jvto/police-safety has 0 narrative_claims
  // → falls through to POLICE_SAFETY_FAQS canonical (3 Q) → suppresses CMS FAQ.
  const faqResolution = await resolveFaqsForPage("/verify-jvto/police-safety");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/police-safety");
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
          // SPRIN-POLPAR + SPRIN-WAL-TRAVEL DigitalDocument refs, FOUNDER cross-ref
          // Per cluster_role_contracts.md Cluster 4 /police-safety MH
          ...POLICE_SAFETY_DIGITAL_DOCUMENTS,
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

      {/* ── Police Documents Summary ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Official Police Assignment Documents
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {POLICE_CREDENTIALS.map((c) => (
              <div
                key={c.label}
                className="border border-slate-800 rounded-lg p-5 bg-slate-900/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[9px] font-black text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm">
                    {c.badge}
                  </span>
                  <FileText size={14} className="text-slate-600 shrink-0" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{c.label}</h3>
                <p className="text-slate-400 text-xs mb-1">{c.name}</p>
                <p className="text-slate-600 text-[10px] mb-3">{c.ref}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-slate-500 shrink-0 w-14">Issuer</span>
                    <a
                      href={c.issuerHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {c.issuer} <ExternalLink size={8} />
                    </a>
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-slate-500 shrink-0 w-14">SHA-256</span>
                    <code className="text-[8px] text-slate-600 font-mono break-all leading-relaxed">
                      {c.sha256}
                    </code>
                  </div>
                </div>

                <a
                  href={c.docHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
                >
                  View document <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Police Authority ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4">
                Founder — Active Tourist Police Officer
              </p>
              <h2 className="text-white font-bold text-lg leading-snug mb-5">
                Bripka Agung Sambuko (Mr. Sam)
              </h2>
              <dl className="space-y-2.5 text-xs mb-6">
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Rank</dt>
                  <dd className="text-slate-300">Bripka (Brigadir Polisi Kepala)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Unit</dt>
                  <dd className="text-slate-300">
                    Ditpamobvit — Directorate of Vital Object Security
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Jurisdiction</dt>
                  <dd className="text-slate-300">Kepolisian Daerah Jawa Timur (East Java)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Status</dt>
                  <dd className="inline-flex items-center gap-1 text-jvto-green font-semibold">
                    <CheckCircle2 size={11} /> Active duty (SPRIN-WAL-TRAVEL Feb 2024)
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Role</dt>
                  <dd className="text-slate-300">
                    Tourist Police operational safety oversight at Ijen Crater and East Java
                    volcanic sites
                  </dd>
                </div>
              </dl>
              <p className="text-slate-500 text-xs leading-relaxed mb-5">
                The SPRIN POLPAR (Tourist Police Assignment Letter) and SPRIN WAL-TRAVEL (Active
                Travel Order) together establish that Agung Sambuko holds an active, government-issued
                police commission. Both documents are issued by the Indonesian National Police (POLRI)
                and carry SHA-256 hashes for forensic verification.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/why-jvto/our-story"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
                >
                  Founder background &amp; JVTO history →
                </Link>
                <a
                  href="https://polri.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  POLRI official site <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Founder portrait + Ditpamobvit context */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src={FOUNDER_LEADERSHIP[1].url}
                  alt={FOUNDER_LEADERSHIP[1].alt}
                  fill
                  className="object-cover object-top opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent px-4 py-3">
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {FOUNDER_LEADERSHIP[1].caption}
                  </p>
                </div>
              </div>
              <div className="border border-slate-800 rounded-lg p-5 bg-slate-950">
                <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-jvto-green" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  What This Means for Your Tour
                </p>
              </div>
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-slate-300">Police-standard discipline.</strong>{" "}
                  Ditpamobvit officers are trained in risk assessment, crisis response, and
                  operational safety protocols — disciplines that transfer directly to managing
                  tours in high-risk volcanic environments.
                </p>
                <p>
                  <strong className="text-slate-300">Authority, not just experience.</strong>{" "}
                  The Tourist Police commission is a government-issued operational authority.
                  This is not a certification purchased from a private body — it is an
                  assignment letter from the state.
                </p>
                <p>
                  <strong className="text-slate-300">Police escort available.</strong>{" "}
                  For large groups, a traffic police escort can be arranged via official
                  channels. This is available on request — not automatically included in all tours.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── Operational Photo Evidence ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-10">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-5">
            Operational Photo Evidence
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <figure className="rounded-lg overflow-hidden border border-slate-800">
              <div className="relative aspect-video bg-slate-900">
                <Image
                  src={FIELD_OPERATIONS[4].url}
                  alt={FIELD_OPERATIONS[4].alt}
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="px-4 py-2.5 bg-slate-900 text-[10px] text-slate-500 leading-snug">
                {FIELD_OPERATIONS[4].caption}
              </figcaption>
            </figure>
            <figure className="rounded-lg overflow-hidden border border-slate-800">
              <div className="relative aspect-video bg-slate-900">
                <Image
                  src={POLICE_AUTHORITY_DOCUMENTS[0].url}
                  alt={POLICE_AUTHORITY_DOCUMENTS[0].alt}
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="px-4 py-2.5 bg-slate-900 text-[10px] text-slate-500 leading-snug">
                {POLICE_AUTHORITY_DOCUMENTS[0].caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Third-Party Press Confirmation ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Independent Press Confirmation
          </p>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-2xl">
            These press articles independently identify the founder in his Tourist Police capacity —
            editorial, third-party confirmation that predates and is separate from any JVTO
            marketing material.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="border border-slate-800 rounded-lg p-6 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Detik.com · 14 March 2021
              </p>
              <blockquote className="border-l-2 border-jvto-green pl-4 mb-3">
                <p className="text-slate-200 text-sm font-medium leading-snug">
                  "Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin"
                </p>
              </blockquote>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                National-reach article identifying the founder by rank (Bripka Agung Sambuko) in
                his Tourist Police operational context at Ijen crater. Written and published
                independently of JVTO.
              </p>
              <a
                href="https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                Read on Detik.com <ExternalLink size={10} />
              </a>
            </article>

            <article className="border border-slate-800 rounded-lg p-6 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Radar Jember (Jawa Pos) · 24 March 2021
              </p>
              <blockquote className="border-l-2 border-jvto-green pl-4 mb-3">
                <p className="text-slate-200 text-sm font-medium leading-snug">
                  "Polpar Dibentuk untuk Mendukung Ijen Geopark"
                </p>
              </blockquote>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Regional press coverage of the Tourist Police (Polpar) unit formation explicitly
                framing its role within the Ijen UNESCO Geopark initiative — contextualising the
                police role JVTO's founder holds.
              </p>
              <a
                href="https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                Read on Radar Jember <ExternalLink size={10} />
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
