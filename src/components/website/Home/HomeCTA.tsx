import Link from "@/components/website/AppLink";
import { ArrowRight, ExternalLink } from "lucide-react";

const HomeCTA: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white">
      <div className="container mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Ready to book?
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl md:text-5xl font-black leading-tight mb-6 max-w-3xl mx-auto"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
        >
          Private tours,{" "}
          <span className="text-jvto-orange italic">documented legitimacy,</span>{" "}
          written policies.
        </h2>

        {/* Policy reminder */}
        <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Read the Rulebook Before You Book — cancellation rules, inclusions,
          and screening protocols are published in full before payment.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/tours"
            prefetch={false}
            className="inline-flex items-center gap-2 bg-jvto-orange text-white px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-jvto-orange-hover transition-colors"
            style={{ boxShadow: "var(--shadow-jvto-orange)" }}
          >
            Browse Tours
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 border border-jvto-lime/50 text-jvto-lime px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-jvto-lime/10 transition-colors"
          >
            Verify JVTO
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub-labels */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-white/30">
          <span>16 private itineraries · Surabaya &amp; Bali</span>
          <span className="hidden sm:inline">·</span>
          <span>Licenses, press coverage &amp; founder credentials</span>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
