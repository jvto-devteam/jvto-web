import Image from "next/image";
import AnswerBlock from "../AnswerBlock";
import Button from "../UI/Button";
import { getEcosystemReviewProfiles } from "@/lib/ecosystemContent/reviewPlatforms";

interface HeroProps {
  title?: string;
  description?: string;
  /** 40-60 fact-dense words stating what JVTO is, before anything else. */
  answerFirst?: string | null;
}

const Hero: React.FC<HeroProps> = async ({
  title = "Tourist Police-Led Private Volcano Tours in East Java",
  description = "Private Bromo, Ijen & Tumpak Sewu tours from Surabaya or Bali. Licensed operator (NIB 1102230032918), led by an active Tourist Police officer.",
  answerFirst = null,
}) => {
  // Resolve platform data at render time — live ekosistem record, not the
  // deleted jvtoReviews.ts snapshot (which had drifted stale).
  const profiles = await getEcosystemReviewProfiles();
  const _tp = profiles.find((p) => p.platform === "Trustpilot");
  const _gm = profiles.find((p) => p.platform === "Google Maps");
  const _ta = profiles.find((p) => p.platform === "TripAdvisor");

  return (
    <div className="relative min-h-[100vh] flex items-center overflow-hidden bg-jvto-navy">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/home-lite.webp"
          alt="Ijen Crater at dawn"
          fill
          priority
          unoptimized
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-jvto-navy/60 via-transparent to-jvto-navy/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-16">

        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-jvto-lime/40 bg-jvto-lime/10 backdrop-blur-sm mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime animate-pulse flex-shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
            Java Volcano Tour Operator
          </span>
        </div>

        {/* H1 */}
        <h1
          className="text-4xl md:text-6xl font-black text-white leading-[1.0] mb-6 max-w-4xl"
          style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.035em" }}
        >
          Tourist Police-Led{" "}
          <em className="text-jvto-orange not-italic">Private Volcano Tours</em>{" "}
          in East Java
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-white/70 max-w-2xl mb-5 leading-relaxed">
          {description}
        </p>

        {/* The entity answer. The homepage opened on a positioning line and
            left the legal identity, the founding year and the rating to be
            gathered from four sections further down.

            This comment shipped without the block it explains: `answerFirst`
            is typed, documented and destructured above, and was then never
            rendered — so page.tsx handed the block to a component that
            dropped it on the floor. The 2026-08-27 live measurement caught
            it: the homepage was the only page type to move backwards
            (density 0.52 -> 0.42, and 1/1 -> 0/1 on three numbers in the
            first 120 words) while its source block sat correct and unused.
            Position is the point — directly under the hero lede, not four
            sections down. */}
        <AnswerBlock tone="dark" className="mb-5">
          {answerFirst}
        </AnswerBlock>

        {/* Body paragraph 1 */}
        {/* <p className="text-sm md:text-base text-white/50 max-w-xl mb-3 leading-relaxed font-light">
          Mr. Sam is a Tourist Police officer first, tour operator second. That order matters: every route decision, every written rule, and every safety boundary comes from someone who answers to police protocol — not a marketing brief.
        </p>
 */}
        {/* Body paragraph 2 */}
        {/* <p className="text-sm md:text-base text-white/50 max-w-xl mb-10 leading-relaxed font-light">
          We operate private tours only. Your group gets a dedicated vehicle, driver, and guide. No shared transfers, no schedule compromises with strangers, no last-minute logistics surprises.
        </p> */}

        {/* CTA buttons */}
        <div className="flex gap-3 flex-wrap mb-12">
          <div className="flex gap-3 md:hidden">
            <Button to="/tours" prefetch={false} variant="primary" size="md">
              Browse Tours
            </Button>
            <Button
              to="/verify-jvto"
              prefetch={false}
              variant="outline"
              size="md"
              className="border-jvto-orange/50 text-jvto-orange hover:bg-jvto-orange/10 rounded-full"
            >
              Verify JVTO
            </Button>
          </div>
          <div className="hidden md:flex gap-3">
            <Button to="/tours" prefetch={false} variant="primary" size="lg">
              Browse Tours
            </Button>
            <Button
              to="/verify-jvto"
              prefetch={false}
              variant="outline"
              size="lg"
              className="border-jvto-orange/50 text-jvto-orange hover:bg-jvto-orange/10 rounded-full"
            >
              Verify JVTO
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:inline-flex w-full md:w-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          {[
            { val: _tp?.rating?.toFixed(2) ?? "4.93", lbl: `Trustpilot · ${_tp?.reviewCount ?? 44} reviews` },
            { val: _gm?.rating?.toFixed(2) ?? "4.90", lbl: `Google Maps · ${_gm?.reviewCount ?? 138} reviews` },
            { val: _ta?.rating?.toFixed(2) ?? "4.95", lbl: `TripAdvisor · ${_ta?.reviewCount ?? 21} reviews` },
            { val: "16", lbl: "Private itineraries" },
          ].map((stat, i) => (
            <div
              key={stat.lbl}
              className={[
                "px-5 py-4 text-center",
                i % 2 === 1 ? "border-l border-white/10" : "",
                i >= 2 ? "border-t border-white/10 md:border-t-0" : "",
                i === 2 ? "md:border-l md:border-white/10" : "",
              ].filter(Boolean).join(" ")}
            >
              <span
                className="block text-lg font-black text-white leading-none"
                style={{ fontFamily: "Raleway, Inter, sans-serif" }}
              >
                {stat.val}
              </span>
              <span className="block text-[8px] uppercase tracking-[0.12em] text-white/40 mt-1">
                {stat.lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
