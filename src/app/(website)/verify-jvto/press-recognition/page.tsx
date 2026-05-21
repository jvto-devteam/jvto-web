import { getDocsByGroup } from "@/lib/data-loader";
import VerifyJvtoClient from "../VerifyJvtoClient";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildVerifySubpageSchema } from "../schema";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import {
  PRESS_RECOGNITION_SCHEMAS,
  PRESS_ORGANIZATION_SUBJECTS,
} from "@/lib/schemas/buildVerifySchemas";
import Image from "next/image";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { FOUNDER_WITH_GUESTS_STEFAN_LOOSE } from "@/lib/imageAssets";

export const revalidate = 86400;

const fallbackSeo = {
  title: "JVTO Press Recognition — Detik.com & Stefan Loose | JVTO",
  h1: "Press Recognition",
  description:
    "Independent press coverage confirming JVTO's identity: Detik.com Tourist Police article, Stefan Loose Indonesia guidebook, and editorial recognition.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  return { title: seo.title, description: seo.description };
}

const CREDENTIALS = [
  {
    label: "NIB",
    name: "Nomor Induk Berusaha",
    ref: "1102230032918",
    href: "/verify-jvto/legal",
    external: false,
  },
  {
    label: "TDUP",
    name: "Tanda Daftar Usaha Pariwisata",
    ref: "1102230032918",
    href: "/verify-jvto/legal",
    external: false,
  },
  {
    label: "HPWKI",
    name: "Ijen Guide Association",
    ref: "BBKSDA Jawa Timur supervised",
    href: "https://ahu.go.id/sabh/perkumpulan/qrcode/?kode=NjAyNDAxMjczNTEwMTM2MV8wXzA3IEZlYnJ1YXJpIDIwMjRfMjcgSmFudWFyeSAyMDI0",
    external: true,
  },
  {
    label: "ISIC",
    name: "Student Discount Partner",
    ref: "Provider ID 259268",
    href: "/isic/student-package",
    external: false,
  },
];

export default async function PressRecognitionPage() {
  const seo = await getPageSeo("/verify-jvto/press-recognition", fallbackSeo);
  const docs = getDocsByGroup("pressRecognition");
  const faqResolution = await resolveFaqsForPage("/verify-jvto/press-recognition");
  const faqResolvedNode = buildResolvedFaqSchema(faqResolution, "/verify-jvto/press-recognition");
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
        route: "/verify-jvto/press-recognition",
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
            pathname: "/verify-jvto/press-recognition",
            title: seo.title,
            description: seo.description,
            breadcrumbLabel: seo.h1,
            docs,
          }),
          faqResolvedNode,
          ...PRESS_RECOGNITION_SCHEMAS,
          PRESS_ORGANIZATION_SUBJECTS,
        ]}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <VerifyJvtoClient
        initialDocs={docs}
        groupTitle={seo.h1}
        heroTitle={seo.h1}
        heroDescription={seo.description}
      />

      {/* ── Verified Credentials Quick Reference ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-12">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-6">
            Verified Credentials Referenced in Press Coverage
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Credential</th>
                  <th className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Name</th>
                  <th className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Reference</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {CREDENTIALS.map((c) => (
                  <tr key={c.label} className="border-b border-slate-900 group">
                    <td className="py-3 pr-6">
                      <span className="text-[10px] font-black text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm">
                        {c.label}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-slate-400 text-xs">{c.name}</td>
                    <td className="py-3 pr-6">
                      <a
                        href={c.href}
                        target={c.external ? "_blank" : undefined}
                        rel={c.external ? "noopener noreferrer" : undefined}
                        className="text-xs text-slate-300 hover:text-white underline underline-offset-2 decoration-slate-700 hover:decoration-white transition-colors inline-flex items-center gap-1"
                      >
                        {c.ref}
                        {c.external && <ExternalLink size={10} className="shrink-0" />}
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

      {/* ── Stefan Loose Editorial Citation ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4">
                Independent Editorial Citation
              </p>
              <h2 className="text-white font-bold text-lg leading-snug mb-3">
                Stefan Loose Reiseführer Indonesien
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                The 4th edition of the Stefan Loose Indonesien travel guide (DuMont Reiseverlag,
                2018) names the founder by name on page 287 in the Ijen Massif section — an
                independent editorial citation in a widely distributed German-language travel guide
                predating PT incorporation.
              </p>
              <dl className="space-y-2 text-xs text-slate-500">
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-20">Publisher</dt>
                  <dd>DuMont Reiseverlag</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-20">Edition</dt>
                  <dd>4th (2018)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-20">ISBN</dt>
                  <dd>978-3-7701-7881-0</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-20">Page</dt>
                  <dd>287 — Ost-Java / Ijen-Massiv</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col gap-3">
              <figure className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src="https://javavolcano-touroperator.com/history/stefan_loose_crop_enh.jpg"
                  alt="Stefan Loose Reiseführer Indonesien page 287 — Ijen Massif section"
                  fill
                  className="object-cover object-top opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </figure>
              <figure className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src={FOUNDER_WITH_GUESTS_STEFAN_LOOSE.url}
                  alt={FOUNDER_WITH_GUESTS_STEFAN_LOOSE.alt}
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent px-3 py-2">
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {FOUNDER_WITH_GUESTS_STEFAN_LOOSE.caption}
                  </p>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── Press Coverage: Detik.com & Radar Jember ── */}
      <section className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6 py-14">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-8">
            Indonesian Press Coverage
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Detik.com */}
            <article className="border border-slate-800 rounded-lg p-6 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Detik.com · 14 March 2021
              </p>
              <blockquote className="border-l-2 border-jvto-green pl-4 mb-4">
                <p className="text-slate-200 text-sm font-medium leading-snug">
                  "Suka Duka Polisi Pariwisata Bondowoso: Tegakkan Prokes Sambil Lawan Dingin"
                </p>
              </blockquote>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Independent reporting on the Tourist Police unit active at Ijen crater — identifying
                the founder by rank (Bripka) and role in a third-party editorial context.
              </p>
              <a
                href="https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                Read article <ExternalLink size={10} />
              </a>
            </article>

            {/* Radar Jember */}
            <article className="border border-slate-800 rounded-lg p-6 bg-slate-900/50">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-3">
                Radar Jember (Jawa Pos) · 24 March 2021
              </p>
              <blockquote className="border-l-2 border-jvto-green pl-4 mb-4">
                <p className="text-slate-200 text-sm font-medium leading-snug">
                  "Polpar Dibentuk untuk Mendukung Ijen Geopark"
                </p>
              </blockquote>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Regional press coverage of the Tourist Police formation explicitly framing JVTO's
                operational context within the Ijen UNESCO Geopark initiative.
              </p>
              <a
                href="https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                Read article <ExternalLink size={10} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ── Booking.com Guest Review Award 2015 ── */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Evidence images — plaque + shipping label */}
            <div className="space-y-3 order-last md:order-first">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src="https://javavolcano-touroperator.com/history/booking-2015-plaque.jpg"
                  alt="Booking.com Guest Review Award 2015 plaque — score 9.4/10"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src="https://javavolcano-touroperator.com/history/booking-2015-shipping-label.jpg"
                  alt="Booking.com award shipping label addressed to Jl. Khairil Anwar 102A, Bondowoso"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="text-[9px] text-slate-700 leading-snug">
                Original shipping label confirming delivery to Jl. Khairil Anwar 102A,
                Bondowoso — same address JVTO operates from today.
              </p>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4">
                Third-Party Award — Pre-Incorporation
              </p>
              <h2 className="text-white font-bold text-lg leading-snug mb-3">
                Booking.com Guest Review Award 2015
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                An independently calculated guest review award issued by Booking.com to the
                guesthouse operated at Jl. Khairil Anwar 102A, Bondowoso — the same address
                JVTO operates from today. The original shipping label confirms the delivery
                address, establishing unbroken address continuity from the 2015 guesthouse era
                to the current PT registration.
              </p>
              <dl className="space-y-2 text-xs text-slate-500">
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Score</dt>
                  <dd className="text-jvto-green font-bold text-sm">9.4 / 10</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Year</dt>
                  <dd>2015</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Issued to</dt>
                  <dd>Jl. Khairil Anwar 102A, Bondowoso</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Issuer</dt>
                  <dd>Booking.com (independent platform)</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="shrink-0 font-semibold text-slate-400 w-24">Evidence</dt>
                  <dd>Plaque + original shipping label (2 artifacts)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
