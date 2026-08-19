import Link from "@/components/website/AppLink";
import { ArrowRight, ExternalLink } from "lucide-react";

interface CtaSection {
  eyebrow?: string;
  heading?: string;
  description?: string;
  subLabel2?: string;
}

// Fallback: same copy as the pre-migration hardcoded version, used only if the
// ekosistem section (home/index.source.json, section id "cta") is unreachable —
// same pattern as fallbackSeo elsewhere.
const FALLBACK: Required<CtaSection> = {
  eyebrow: "Ready to book?",
  heading: "Private tours, documented legitimacy, written policies.",
  description:
    "Read the Rulebook Before You Book — cancellation rules, inclusions, and screening protocols are published in full before payment.",
  subLabel2: "Check licenses, press coverage, and founder credentials",
};

interface HomeCTAProps {
  section?: CtaSection;
  /** Live package count — replaces the old hardcoded "16 private itineraries". */
  packageCount?: number;
}

const HomeCTA: React.FC<HomeCTAProps> = ({ section, packageCount }) => {
  const eyebrow = section?.eyebrow ?? FALLBACK.eyebrow;
  const heading = section?.heading ?? FALLBACK.heading;
  const description = section?.description ?? FALLBACK.description;
  const subLabel2 = section?.subLabel2 ?? FALLBACK.subLabel2;

  return (
    <section
      className="py-24 md:py-32 bg-jvto-navy-mid text-white"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-tags border border-white/20 bg-white/5 mb-8">
          <span className="text-micro font-semibold uppercase tracking-[0.2em] text-white/70">
            {eyebrow}
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-subheading md:text-heading-sm font-black mb-6 max-w-3xl mx-auto">
          {heading}
        </h2>

        {/* Policy reminder */}
        <p className="text-white/70 text-caption md:text-body-sm max-w-xl mx-auto mb-12">
          {description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href="/tours"
            prefetch={false}
            className="inline-flex items-center gap-2 bg-jvto-orange text-white px-10 py-4 font-semibold text-micro uppercase tracking-[0.2em] rounded-buttons hover:bg-jvto-orange-hover transition-colors"
            style={{ boxShadow: "var(--shadow-jvto-orange)" }}
          >
            Browse Tours
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/verify-jvto"
            prefetch={false}
            className="inline-flex items-center gap-2 border border-jvto-lime/50 text-jvto-lime px-10 py-4 font-semibold text-micro uppercase tracking-[0.2em] rounded-buttons hover:bg-jvto-lime/10 transition-colors"
          >
            Verify JVTO
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Sub-labels */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-micro text-white/60">
          <span>
            {packageCount ? `${packageCount} private itineraries from Surabaya and Bali` : "Private itineraries from Surabaya and Bali"}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{subLabel2}</span>
        </div>

      </div>
    </section>
  );
};

export default HomeCTA;
