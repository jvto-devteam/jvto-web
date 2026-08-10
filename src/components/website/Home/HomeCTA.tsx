import Link from "@/components/website/AppLink";
import Section from "@/components/design/Section";

// PKG-11a: the closing plate inherits the shared navy material (deep floor +
// contour texture) from <Section>, so the page ends on the same ground it
// opened on. The rulebook line is set on a hairline rule to close the document.
export default function HomeCTA() {
  return (
    <Section surface="navy" labelledBy="cta-heading" containerClassName="text-center">
      <h2
        id="cta-heading"
        className="font-jvto-heading mb-5 text-[2rem] leading-[1.05] font-black tracking-[-0.025em] text-white md:text-5xl"
      >
        Ready to explore <span className="text-jvto-orange">East Java?</span>
      </h2>
      <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-jvto-on-navy">
        16 private itineraries from Surabaya and Bali — or check every licence, press
        article, and founder credential before you commit.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/tours"
          className="jvto-focus-dark rounded-sm bg-jvto-lime px-8 py-3.5 text-center text-sm font-bold tracking-wider text-jvto-navy uppercase shadow-[0_12px_34px_-16px_rgba(140,198,63,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
        >
          Browse Tours — 16 private itineraries
        </Link>
        <Link
          href="/verify-jvto"
          className="jvto-focus-dark rounded-sm border-2 border-white/35 bg-white/[0.04] px-8 py-3.5 text-center text-sm font-bold tracking-wider text-white uppercase transition-colors duration-200 hover:border-white/70 hover:bg-white/10"
        >
          Verify JVTO — check the proof
        </Link>
      </div>
      <p className="mx-auto mt-12 max-w-xl border-t border-white/15 pt-6 font-mono text-[11px] leading-relaxed font-semibold tracking-[0.18em] text-jvto-on-navy-dim uppercase">
        Read the Rulebook Before You Book — cancellation rules, inclusions, and
        screening protocols are published in full before payment.
      </p>
    </Section>
  );
}
