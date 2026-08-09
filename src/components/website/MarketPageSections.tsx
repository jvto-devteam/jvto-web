// src/components/website/MarketPageSections.tsx
// Shared Server Component rendering a /markets/* geographic landing page.
//
// Milestone 2 (2026-08-09): every sentence on the page now comes from the content/ Git SSOT
// (`content/pages/markets/*.json` + `content/faqs/markets-*.json`) — hero lede, narrative
// sections, and the visible FAQ. The only code-owned inputs left are structural: the priced
// package comparison table and the package-nav CTAs (see @/lib/marketContent), which also
// feed the ItemList/Offer JSON-LD. Static + SSG-safe (no DB fetch, no client interactivity).
// Visual mode unchanged: Trust/verify cluster (dark slate + jvto-green accent).
import Link from "next/link";
import { BlocksRenderer } from "@/components/content/BlocksRenderer";
import type { MarketStructure } from "@/lib/marketContent";
import type { StaticPage } from "@/lib/static-content";
import {
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/6282244788833";

/** Section id (content/pages/markets/*.json) after which the priced package table renders. */
const PACKAGES_SECTION_ID = "recommended-routes";
/** Section id that gets the shield heading affordance the trust block had before. */
const TRUST_SECTION_ID = "trust";

/**
 * Dark-mode overrides for the shared `.jvto-prose` markdown styles, which are authored for
 * the light content clusters. Scoped under `.jvto-market-prose` (specificity 0,2,0 beats the
 * base 0,1,0 rules regardless of style-tag order) so no other cluster is affected.
 */
const MARKET_PROSE_CSS = `
  .jvto-market-prose .jvto-prose { color: #cbd5e1; font-size: 0.875rem; }
  .jvto-market-prose .jvto-prose h2,
  .jvto-market-prose .jvto-prose h3,
  .jvto-market-prose .jvto-prose h4 { color: #f8fafc; border-bottom-color: #1e293b; }
  .jvto-market-prose .jvto-prose strong { color: #e2e8f0; }
  .jvto-market-prose .jvto-prose a { color: #9fce33; }
  .jvto-market-prose .jvto-prose a:hover { color: #ffffff; }
  .jvto-market-prose .jvto-prose th {
    background: #0f172a; color: #94a3b8; border-bottom-color: #1e293b;
  }
  .jvto-market-prose .jvto-prose td { color: #cbd5e1; border-bottom-color: rgba(30,41,59,0.7); }
  .jvto-market-prose .jvto-prose tr:hover td { background: rgba(15,23,42,0.6); }
  .jvto-market-prose .jvto-prose blockquote {
    background: rgba(15,23,42,0.6); border-left-color: #9fce33; color: #cbd5e1;
  }
  .jvto-market-prose .jvto-prose hr { border-top-color: #1e293b; }
  .jvto-market-prose .jvto-prose code { background: #1e293b; color: #9fce33; }
`;

function PackageTable({ packages }: { packages: MarketStructure["packages"] }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            {["Package", "Start / Finish", "Duration", "Best for", "From price"].map((h) => (
              <th key={h} className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={`${pkg.path}-${pkg.duration}`} className="border-b border-slate-800/60 align-top">
              <td className="py-3 pr-6">
                <Link href={pkg.path} className="text-slate-200 hover:text-white font-medium underline underline-offset-2 decoration-slate-700 hover:decoration-white transition-colors">
                  {pkg.name}
                </Link>
              </td>
              <td className="py-3 pr-6 text-slate-400 text-xs whitespace-nowrap">{pkg.startFinish}</td>
              <td className="py-3 pr-6 text-slate-400 text-xs">{pkg.duration}</td>
              <td className="py-3 pr-6 text-slate-400 text-xs leading-relaxed">{pkg.bestFor}</td>
              <td className="py-3 text-slate-200 text-xs font-semibold whitespace-nowrap">{pkg.priceLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarketPageSections({
  page,
  market,
}: {
  page: StaticPage;
  market: MarketStructure;
}) {
  const lede = page.lede ?? [];
  const sections = page.sections ?? [];
  const faqs = page.faq ?? [];

  return (
    <main className="bg-slate-950 text-slate-200">
      <style>{MARKET_PROSE_CSS}</style>

      {/* ── Hero ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-jvto-green mb-4">
            {market.country} · East Java Volcano Tours
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {page.meta.title}
          </h1>
          {lede.map((paragraph, i) =>
            i === lede.length - 1 && lede.length > 1 ? (
              <p key={paragraph} className="text-slate-500 text-xs leading-relaxed mb-8">
                {paragraph}
              </p>
            ) : (
              <p key={paragraph} className="text-slate-300 text-base leading-relaxed mb-6">
                {paragraph}
              </p>
            ),
          )}
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-jvto-green text-slate-950 font-bold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} />
              WhatsApp JVTO: +62 822 4478 8833
            </a>
            <Link
              href="/why-jvto/reviews"
              className="inline-flex items-center gap-2 border border-slate-700 text-slate-200 font-semibold text-sm px-5 py-3 rounded-lg hover:border-slate-500 transition-colors"
            >
              Read {market.demonym} reviews
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Narrative sections (content/ SSOT) ── */}
      {sections.map((sec, i) => (
        <section
          key={sec.id}
          id={sec.id}
          className={`border-b border-slate-800 ${i % 2 === 0 ? "bg-slate-900" : ""}`}
        >
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            {sec.title &&
              (sec.id === TRUST_SECTION_ID ? (
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck size={15} className="text-jvto-green" />
                  <h2 className="text-xl font-bold text-white">{sec.title}</h2>
                </div>
              ) : (
                <h2 className="text-xl font-bold text-white mb-6">{sec.title}</h2>
              ))}
            <div className="jvto-market-prose">
              <BlocksRenderer blocks={sec.blocks as never} sectionId={sec.id} />
            </div>
            {sec.id === PACKAGES_SECTION_ID && <PackageTable packages={market.packages} />}
          </div>
        </section>
      ))}

      {/* ── FAQ — same page.faq array that feeds the FAQPage JSON-LD (AD-08) ── */}
      {faqs.length > 0 && (
        <section className="border-b border-slate-800">
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <p className="text-slate-200 font-semibold text-sm mb-1.5">{faq.question}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA / internal links ── */}
      <section className="bg-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-lg font-bold text-white mb-5">Start planning your East Java tour</h2>
          <div className="flex flex-col gap-2.5 mb-8">
            {market.primaryCtas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="inline-flex items-center gap-2 text-slate-200 hover:text-white text-sm font-medium transition-colors"
              >
                <ArrowRight size={14} className="text-jvto-green shrink-0" />
                {cta.label}
              </Link>
            ))}
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-jvto-green text-slate-950 font-bold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} />
            Message JVTO on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
