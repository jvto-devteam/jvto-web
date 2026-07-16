// src/components/website/MarketPageSections.tsx
// Shared Server Component rendering a /markets/* geographic landing page from a MarketContent
// model. Static, SSG-safe (no DB fetch, no client interactivity) — v1 per GAP-09. Visual mode
// follows the Trust/verify cluster (dark slate + jvto-green accent).
import Link from "next/link";
import { AGGREGATE_RATING } from "@/lib/jvtoReviews";
import type { MarketContent } from "@/lib/marketContent";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Quote,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/6282244788833";

export function MarketPageSections({ content }: { content: MarketContent }) {
  return (
    <main className="bg-slate-950 text-slate-200">
      {/* ── Hero ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-jvto-green mb-4">
            {content.country} · East Java Volcano Tours
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {content.h1}
          </h1>
          {content.supportLine && (
            <p className="text-slate-400 text-sm leading-relaxed mb-4 italic">
              {content.supportLine}
            </p>
          )}
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            {content.subheadline}
          </p>
          <p className="text-slate-500 text-xs leading-relaxed mb-8">
            {content.credibilityLine}
          </p>
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
              Read {content.demonym} reviews
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lead ── */}
      <section className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <p className="text-slate-300 text-base leading-relaxed">{content.lead}</p>
        </div>
      </section>

      {/* ── Entry choice ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-xl font-bold text-white mb-6">{content.entryHeading}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  {["If your flight plan is…", "Best start", "Why it works", "Recommended route"].map((h) => (
                    <th key={h} className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.entryChoices.map((row) => (
                  <tr key={row.flightPlan} className="border-b border-slate-900 align-top">
                    <td className="py-3 pr-6 text-slate-300">{row.flightPlan}</td>
                    <td className="py-3 pr-6">
                      <span className="text-[11px] font-bold text-jvto-green bg-jvto-green/10 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                        {row.start}
                      </span>
                    </td>
                    <td className="py-3 pr-6 text-slate-400 text-xs leading-relaxed">{row.why}</td>
                    <td className="py-3 text-slate-400 text-xs leading-relaxed">{row.route}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-500 text-xs mt-4 leading-relaxed">{content.entryNote}</p>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <h2 className="text-xl font-bold text-white mb-2">{content.packagesHeading}</h2>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed max-w-2xl">{content.packagesIntro}</p>
          <div className="overflow-x-auto">
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
                {content.packages.map((pkg) => (
                  <tr key={pkg.path} className="border-b border-slate-800/60 align-top">
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
        </div>
      </section>

      {/* ── Inclusions ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-xl font-bold text-white mb-6">
            Private, all-inclusive — written before you pay
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {content.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
                <CheckCircle2 size={15} className="text-jvto-green shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-xs mt-6 leading-relaxed">{content.notIncluded}</p>
        </div>
      </section>

      {/* ── Logistics Q&A ── */}
      <section className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-xl font-bold text-white mb-6">
            Questions {content.demonym} travelers ask
          </h2>
          <div className="space-y-5">
            {content.logistics.map((qa) => (
              <div key={qa.question}>
                <p className="text-slate-200 font-semibold text-sm mb-1">{qa.question}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={15} className="text-jvto-green" />
            <h2 className="text-xl font-bold text-white">Verify JVTO before you send money</h2>
          </div>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {content.trustRows.map((row) => (
                  <tr key={row.signal} className="border-b border-slate-800/60 align-top">
                    <td className="py-3 pr-6 text-slate-400 text-xs font-semibold whitespace-nowrap">{row.signal}</td>
                    <td className="py-3 text-slate-300 text-xs leading-relaxed">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-3">
            {content.trustLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-jvto-green hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.label}
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      {content.reviews.length > 0 && (
        <section className="border-b border-slate-800 bg-slate-900">
          <div className="container mx-auto px-6 py-12 max-w-4xl">
            <h2 className="text-xl font-bold text-white mb-6">{content.reviewsHeading}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {content.reviews.map((review) => (
                <figure key={review.author} className="border border-slate-800 rounded-lg p-5 bg-slate-950/50">
                  <Quote size={16} className="text-jvto-green/50 mb-3" />
                  <blockquote className="text-slate-300 text-sm leading-relaxed mb-3">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="text-slate-500 text-xs">
                    <span className="text-slate-300 font-semibold">{review.author}</span>
                    {" · "}
                    {review.platform}
                    {" · "}
                    {content.country} traveler
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-6">
              <Link href="/why-jvto/reviews" className="text-jvto-green hover:text-white transition-colors">
                See all {AGGREGATE_RATING.reviewCount} reviews across Trustpilot, Google & TripAdvisor →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="space-y-6">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <p className="text-slate-200 font-semibold text-sm mb-1.5">{faq.question}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA / internal links ── */}
      <section className="bg-slate-900">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h2 className="text-lg font-bold text-white mb-5">Start planning your East Java tour</h2>
          <div className="flex flex-col gap-2.5 mb-8">
            {content.primaryCtas.map((cta) => (
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
