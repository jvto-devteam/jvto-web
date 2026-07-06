import Link from "@/components/website/AppLink";

export default function HomeCTA() {
  return (
    <section aria-labelledby="cta-heading" className="bg-jvto-navy py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <h2
          id="cta-heading"
          className="font-black text-3xl md:text-4xl text-white mb-4"
        >
          Ready to explore <span className="text-jvto-orange">East Java?</span>
        </h2>
        <p className="text-white/60 text-base max-w-xl mx-auto mb-10 leading-relaxed">
          16 private itineraries from Surabaya and Bali — or check every licence,
          press article, and founder credential before you commit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tours"
            className="bg-jvto-lime text-jvto-navy font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm text-sm text-center hover:brightness-95 transition-all"
          >
            Browse Tours — 16 private itineraries
          </Link>
          <Link
            href="/verify-jvto"
            className="border-2 border-white/30 text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm text-sm text-center hover:border-white/60 transition-colors"
          >
            Verify JVTO — check the proof
          </Link>
        </div>
        <p className="mt-11 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 leading-relaxed max-w-xl mx-auto">
          Read the Rulebook Before You Book — cancellation rules, inclusions, and
          screening protocols are published in full before payment.
        </p>
      </div>
    </section>
  );
}
