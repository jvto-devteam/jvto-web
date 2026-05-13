import Link from "@/components/website/AppLink";
import Image from "next/image";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — editorial copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-7">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                Our Story
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black leading-[1.05] mb-8"
              style={{ fontFamily: "Raleway, Inter, sans-serif", letterSpacing: "-0.025em" }}
            >
              Built by someone who saw
              <br className="hidden md:block" />
              <em className="text-jvto-orange not-italic">
                {" "}what the alternatives looked like.
              </em>
            </h2>

            <div className="text-white/60 text-sm md:text-base leading-relaxed font-light">
              <p>
                We saw the gaps first-hand — unlicensed guides, no medical
                screening, operators with no BBKSDA clearance, no written rules
                for guests. We built something different:{" "}
                <strong className="text-white font-semibold">
                  private-only routes, realistic driving days, and clear written
                  policies
                </strong>{" "}
                — shaped by a founder who is an active Tourist Police officer.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-bold border-b-2 border-jvto-lime text-white hover:text-jvto-lime transition-colors pb-1 text-sm"
              >
                Read the Full Story
              </Link>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="font-bold border-b-2 border-white/20 text-white/60 hover:text-white hover:border-white transition-colors pb-1 text-sm"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right — founder portrait with quote badge */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Quote badge — OUTSIDE overflow-hidden card, anchored on relative wrapper */}
            <div
              className="absolute -top-4 -right-4 z-10 bg-jvto-orange rounded-[18px] p-4 max-w-[200px]"
              style={{ boxShadow: "var(--shadow-jvto-orange)" }}
            >
              <p className="text-[10px] text-white italic leading-relaxed">
                &ldquo;The Tourist Police experience isn&apos;t a marketing
                credential — it&apos;s how every safety decision is made.&rdquo;
              </p>
            </div>

            {/* Founder card — separate element so quote badge overflows correctly */}
            <div
              className="relative z-0 rounded-[40px] overflow-hidden border border-white/10 w-full max-w-md aspect-[4/5]"
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
                <p
                  className="font-black text-white text-lg tracking-tight mb-1"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  Agung &ldquo;Mr. Sam&rdquo; Sambuko
                </p>
                <p className="text-[9px] text-jvto-lime font-bold uppercase tracking-[0.2em]">
                  Founder · Active Tourist Police Officer
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
