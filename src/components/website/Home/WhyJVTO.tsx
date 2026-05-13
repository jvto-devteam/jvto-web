import Link from "@/components/website/AppLink";
import Image from "next/image";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-jvto-navy text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-jvto-lime/10 border border-jvto-lime/30 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-jvto-lime">
                Our Story
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black leading-none mb-8"
              style={{
                fontFamily: "Raleway, Inter, sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              Built by someone who saw
              <br className="hidden md:block" />
              <span className="text-jvto-orange italic">
                {" "}what the alternatives looked like.
              </span>
            </h2>

            <div className="space-y-5 text-white/70 text-base md:text-lg leading-relaxed">
              <p>
                JVTO grew from a humble local guesthouse in Bondowoso into a
                licensed tour operator shaped by the{" "}
                <strong className="text-white font-semibold">
                  Tourist Police experience
                </strong>{" "}
                of our founder, Mr. Sam.
              </p>
              <p>
                We saw the gaps in safety standards first-hand — unlicensed
                guides, no medical screening, operators with no BBKSDA
                clearance, no written rules for guests. We decided to build
                something different: private-only routes, realistic driving
                days, and clear written policies.
              </p>
              <p>
                Today, we act as a bridge between wild adventure and
                professional safety standards. The Tourist Police experience
                isn't a marketing credential — it's the lens through which
                every route, every safety rule, and every Plan-B decision is
                made.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                target="_blank"
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-bold border-b-2 border-jvto-lime text-white hover:text-jvto-lime transition-colors pb-1 text-base"
              >
                Read the Full Story
              </Link>
              <Link
                target="_blank"
                href="/verify-jvto"
                prefetch={false}
                className="font-bold border-b-2 border-white/20 text-white/50 hover:text-white hover:border-white transition-colors pb-1 text-base"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right — Founder portrait */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative z-10 rounded-[32px] overflow-hidden border border-white/10 w-full max-w-md aspect-[4/5]"
              style={{ boxShadow: "var(--shadow-jvto-hover)" }}
            >
              <Image
                src="/founder/agung_sambuko.webp"
                alt='Agung "Mr. Sam" Sambuko - JVTO Founder & Tourist Police Officer'
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-jvto-navy/90 via-jvto-navy/60 to-transparent p-8">
                <p
                  className="font-black text-white text-xl tracking-tight mb-1"
                  style={{ fontFamily: "Raleway, Inter, sans-serif" }}
                >
                  Agung &ldquo;Mr. Sam&rdquo; Sambuko
                </p>
                <p className="text-[10px] text-jvto-lime font-bold uppercase tracking-[0.2em]">
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
