import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, ShieldCheck, Star } from "lucide-react";

const WhyJVTO: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-[32px] shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
              <Image
                src="/founder/agung_sambuko.jpg"
                alt='Agung "Mr. Sam" Sambuko, founder of JVTO'
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-authority-navy via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-safety-orange" />
                  Police-Led Context
                </span>
                <p className="mb-1 text-xl font-bold text-white uppercase">
                  Agung “Mr. Sam” Sambuko
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-200">
                  Founder & Active Tourist Police
                </p>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-safety-orange/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-authority-navy/5 blur-3xl" />
          </div>

          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-safety-orange">
              <Star className="h-3.5 w-3.5" />
              Police Leadership
            </p>

            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.04em] text-authority-navy md:text-6xl">
              Our Story
              <br />
              <span className="text-safety-orange">From Local Host to Trusted Operator.</span>
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-[#5d6a5a]">
              <p>
                JVTO did not start as a brochure brand. It grew from real East
                Java hospitality roots into a licensed private operator shaped by
                Tourist Police experience, route seriousness, and field
                accountability.
              </p>
              <p>
                That matters because guests are not only buying scenery. They are
                trusting someone to handle night departures, active-volcano
                conditions, screening rules, and long driving days correctly.
              </p>
              <p>
                The founder context is visible because it changes how the company
                runs routes on the ground.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#e7ebdd] bg-[#f8faf4] p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-authority-navy shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                  <Award className="h-5 w-5 text-safety-orange" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-authority-navy">
                  Official Liaison Context
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6a5a]">
                  Not anonymous branding. The operator identity stays visible
                  throughout the decision journey.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#e7ebdd] bg-[#f8faf4] p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-authority-navy shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                  <ShieldCheck className="h-5 w-5 text-safety-orange" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-authority-navy">
                  Safety-First Route Handling
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6a5a]">
                  Police-style route discipline carried into Ijen, Bromo, and
                  longer overland operations.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/why-jvto/our-story"
                className="inline-flex items-center gap-2 rounded-xl bg-authority-navy px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-authority-navy/90"
              >
                Read Our Story
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/verify-jvto"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d7dec8] px-6 py-4 text-sm font-black uppercase tracking-wide text-authority-navy transition-colors hover:bg-[#f5f7f0]"
              >
                Open Proof Library
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyJVTO;
