import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, XCircle, ExternalLink } from "lucide-react";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getContentPage } from "@/lib/content/getContentPage";
import { resolveFaqsForPage, buildResolvedFaqSchema } from "@/lib/content/resolveFaqs";
import {
  buildWhyJvtoBreadcrumbSchema,
  buildWhyJvtoWebPageSchema,
} from "@/lib/schemas/buildWhyJvtoSchemas";
import { FOUNDER_LEADERSHIP, FIELD_OPERATIONS } from "@/lib/imageAssets";
import Sidebar from "../sidebar";

export const revalidate = 3600;

const defaultTitle = "The JVTO Difference: Safety Leadership & Verified Proof";
const defaultDescription =
  "What sets JVTO apart: Tourist Police-led safety mindset, documented operational discipline, and a full proof library anyone can verify independently.";
const defaultH1 = "The JVTO Difference: Safety Leadership and Verified Proof";

export async function generateMetadata(): Promise<Metadata> {
  const row = await getContentPage("/why-jvto/the-jvto-difference", "en");
  const seo = (row?.seo as Record<string, any> | null) ?? {};
  return {
    title: seo.title ?? defaultTitle,
    description: seo.description ?? defaultDescription,
    openGraph: {
      title: seo.title ?? defaultTitle,
      description: seo.description ?? defaultDescription,
      url: "https://javavolcano-touroperator.com/why-jvto/the-jvto-difference",
      images: [{ url: FOUNDER_LEADERSHIP[1].url, alt: FOUNDER_LEADERSHIP[1].alt }],
    },
  };
}

const WHAT_CHANGES = [
  "Clear safety boundaries — what we do and what we avoid.",
  "Early adjustments when conditions become uncertain.",
  "Disciplined coordination with drivers, guides, and local authorities.",
  "Founder with an active POLRI commission — not a marketing title.",
  "Every Ijen guest screened by a licensed physician before ascent.",
];

const WHAT_WE_DONT_PROMISE = [
  "We do not guarantee visibility at the crater (SO₂ fog is unpredictable).",
  "We do not override BBKSDA or park authority closures.",
  "We do not accept high-risk medical profiles for Ijen (blood pressure/SpO₂ flags).",
  "Police escort is available on request — it is NOT automatically included in all tours.",
];

const PROOF_LINKS = [
  { label: "Police & Safety Documents", href: "/verify-jvto/police-safety", note: "SPRIN-POLPAR, SPRIN-WAL-TRAVEL" },
  { label: "Legal Entity & Licenses", href: "/verify-jvto/legal", note: "NIB 1102230032918, TDUP, HPWKI" },
  { label: "Health Screening Evidence (Ijen)", href: "/travel-guide/ijen-health-screening", note: "SE.1658/KSA.9/2024, Dr. Ahmad SIP" },
  { label: "Press Coverage", href: "/verify-jvto/press-recognition", note: "Detik.com, Radar Jember, Stefan Loose" },
  { label: "History & Artifacts", href: "/verify-jvto/history-artifacts", note: "Booking.com 2015, SHA-256 verified" },
];

export default async function TheJvtoDifferencePage() {
  const [row, faqResolution] = await Promise.all([
    getContentPage("/why-jvto/the-jvto-difference", "en"),
    resolveFaqsForPage("/why-jvto/the-jvto-difference"),
  ]);

  const seo = (row?.seo as Record<string, any> | null) ?? {};
  const content = (row?.content as Record<string, any> | null) ?? {};
  const h1 = content.h1 ?? defaultH1;

  const faqNode = buildResolvedFaqSchema(faqResolution, "/why-jvto/the-jvto-difference");

  const extraSchemas = [
    buildWhyJvtoWebPageSchema({ subpath: "the-jvto-difference", pageName: h1, description: seo.description ?? defaultDescription }),
    buildWhyJvtoBreadcrumbSchema({ subpath: "the-jvto-difference", pageName: h1, description: defaultDescription }),
    faqNode,
  ].filter(Boolean);

  const pageRow = row
    ? { route: row.route, lang: row.lang, seo: row.seo, content: row.content, created_at: row.created_at, updated_at: row.updated_at }
    : { route: "/why-jvto/the-jvto-difference", lang: "en", seo: { title: defaultTitle, description: defaultDescription }, content: { h1 } };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <PageJsonLdCombined
        pageRow={pageRow as any}
        extraSchemas={extraSchemas}
        suppressCmsFaq={faqResolution.suppressCmsFaq}
      />
      <main className="pt-24 w-full">
        {/* Breadcrumb */}
        <nav className="border-b border-slate-200 px-6 py-3 text-xs text-slate-500">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link href="/why-jvto" className="hover:text-slate-700">Why JVTO</Link>
            <span>/</span>
            <span className="text-slate-700">The JVTO Difference</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-14">
          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-jvto-green bg-jvto-green/10 px-2.5 py-1 rounded-full mb-5">
              <ShieldCheck size={11} /> Authority-backed — every claim has a proof page
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-tight">
              {h1}
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
              The difference is not a marketing claim. It is a safety mindset from a founder with an
              active government commission — backed by documents, press coverage, and third-party
              platforms that we cannot edit or remove.
            </p>
          </div>

          {/* Founder police photo + What changes grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Left: photo */}
            <figure className="rounded-xl overflow-hidden border border-slate-200">
              <div className="relative aspect-[3/4]">
                <Image
                  src={FOUNDER_LEADERSHIP[1].url}
                  alt={FOUNDER_LEADERSHIP[1].alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <figcaption className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 leading-snug">
                {FOUNDER_LEADERSHIP[1].caption}
              </figcaption>
            </figure>

            {/* Right: what changes for your trip */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-5">What Changes for Your Trip</h2>
              <ul className="space-y-3 mb-8">
                {WHAT_CHANGES.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-jvto-green mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-bold text-slate-900 mb-4" id="what-we-do-not-promise">
                What We Do NOT Promise
              </h2>
              <ul className="space-y-3">
                {WHAT_WE_DONT_PROMISE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-500">
                    <XCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Operational photo evidence */}
          <section className="mb-16">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Operational Evidence</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Baratha Hotel departure */}
              <figure className="rounded-xl overflow-hidden border border-slate-200">
                <div className="relative aspect-video">
                  <Image
                    src={FIELD_OPERATIONS[1].url}
                    alt={FIELD_OPERATIONS[1].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 leading-snug">
                  {FIELD_OPERATIONS[1].caption}
                </figcaption>
              </figure>

              {/* Ijen Geopark briefing */}
              <figure className="rounded-xl overflow-hidden border border-slate-200">
                <div className="relative aspect-video">
                  <Image
                    src={FIELD_OPERATIONS[4].url}
                    alt={FIELD_OPERATIONS[4].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 leading-snug">
                  {FIELD_OPERATIONS[4].caption}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Proof library — how-proof-works section */}
          <section className="mb-14" id="how-proof-works">
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              How to Verify in 60 Seconds
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Read the claim → open the evidence link → check the source URL (published by a third party, not us).
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PROOF_LINKS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-jvto-green/40 hover:bg-slate-50 transition-all group"
                >
                  <ShieldCheck size={16} className="text-jvto-green mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-jvto-green transition-colors">
                      {p.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{p.note}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer cross-links */}
          <div className="border-t border-slate-100 pt-8 flex flex-wrap gap-5 text-sm">
            <Link href="/verify-jvto" className="inline-flex items-center gap-1.5 text-jvto-green font-bold hover:underline">
              Full Proof Library <ArrowRight size={13} />
            </Link>
            <Link href="/why-jvto/our-team" className="text-slate-500 hover:text-slate-800 transition-colors">
              Meet the team →
            </Link>
            <Link href="/tours" className="text-slate-500 hover:text-slate-800 transition-colors">
              Browse tours →
            </Link>
            <Link href="/why-jvto" className="text-slate-500 hover:text-slate-800 transition-colors">
              ← Why JVTO
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
