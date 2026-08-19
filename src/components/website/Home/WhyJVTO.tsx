import Link from "@/components/website/AppLink";
import Image from "next/image";

interface StoryTeaserSection {
  eyebrow?: string;
  heading?: string;
  body?: string;
  bodyStrongPhrase?: string;
  quote?: string;
  founderName?: string;
  founderTitle?: string;
}

// Fallback: same copy as the pre-migration hardcoded version, used only if the
// ekosistem section (home/index.source.json, section id "story-teaser") is
// unreachable — same pattern as fallbackSeo elsewhere.
const FALLBACK: Required<StoryTeaserSection> = {
  eyebrow: "Our Story",
  heading: "Built by someone who saw what the alternatives looked like.",
  body:
    "We saw the gaps first-hand — unlicensed guides, no medical screening, operators with no BBKSDA clearance, no written rules for guests. We built something different: private-only routes, realistic driving days, and clear written policies — shaped by a founder who is an active Tourist Police officer.",
  bodyStrongPhrase:
    "private-only routes, realistic driving days, and clear written policies",
  quote:
    "The Tourist Police experience isn't a marketing credential — it's how every safety decision is made.",
  founderName: "Agung \"Mr. Sam\" Sambuko",
  founderTitle: "Founder · Active Tourist Police Officer",
};

interface WhyJVTOProps {
  section?: StoryTeaserSection;
}

const WhyJVTO: React.FC<WhyJVTOProps> = ({ section }) => {
  const heading = section?.heading ?? FALLBACK.heading;
  const body = section?.body ?? FALLBACK.body;
  const bodyStrongPhrase = section?.bodyStrongPhrase ?? FALLBACK.bodyStrongPhrase;
  const quote = section?.quote ?? FALLBACK.quote;
  const founderName = section?.founderName ?? FALLBACK.founderName;
  const founderTitle = section?.founderTitle ?? FALLBACK.founderTitle;

  const strongIndex = bodyStrongPhrase ? body.indexOf(bodyStrongPhrase) : -1;
  const bodyBefore = strongIndex >= 0 ? body.slice(0, strongIndex) : body;
  const bodyAfter = strongIndex >= 0 ? body.slice(strongIndex + bodyStrongPhrase.length) : "";

  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — editorial copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-tags bg-jvto-lime/10 border border-jvto-lime/30 mb-7">
              <span className="text-micro font-semibold uppercase tracking-[0.2em] text-jvto-lime">
                {section?.eyebrow ?? FALLBACK.eyebrow}
              </span>
            </div>

            <h2 className="font-display text-subheading md:text-heading-sm font-black mb-8">
              {heading}
            </h2>

            <div className="text-white/70 text-caption md:text-body-sm">
              <p>
                {bodyBefore}
                {strongIndex >= 0 && (
                  <strong className="text-white font-semibold">{bodyStrongPhrase}</strong>
                )}
                {bodyAfter}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-semibold border-b-2 border-jvto-lime text-white hover:text-jvto-lime transition-colors pb-1 text-body-sm"
              >
                Read the Full Story
              </Link>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="font-semibold border-b-2 border-white/20 text-white/70 hover:text-white hover:border-white transition-colors pb-1 text-body-sm"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right — founder portrait with quote badge */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Quote badge — OUTSIDE overflow-hidden card, anchored on relative wrapper */}
            <div
              className="absolute -top-4 -right-4 z-10 bg-jvto-orange rounded-jvto-md p-4 max-w-[200px]"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              <p className="text-micro text-white italic">
                &ldquo;{quote}&rdquo;
              </p>
            </div>

            {/* Founder card — separate element so quote badge overflows correctly */}
            <div
              className="relative z-0 rounded-jvto-xl overflow-hidden border border-white/10 w-full max-w-md aspect-[4/5]"
              style={{ boxShadow: "var(--shadow-jvto-hover)" }}
            >
              <Image
                src="/founder/agung_sambuko.webp"
                alt='Agung "Mr. Sam" Sambuko — JVTO Founder &amp; Active Tourist Police Officer'
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-jvto-navy/95 via-jvto-navy/60 to-transparent p-8">
                <p className="font-display font-black text-white text-body-lg mb-1">
                  {founderName}
                </p>
                <p className="text-micro text-jvto-lime font-semibold uppercase tracking-[0.2em]">
                  {founderTitle}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJVTO;
