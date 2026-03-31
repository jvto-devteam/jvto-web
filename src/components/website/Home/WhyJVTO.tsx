import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, ShieldCheck, Star } from "lucide-react";

const WhyJVTO: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-jvto-dark py-24 text-white">
      <div className="absolute inset-y-0 right-0 w-1/3 translate-x-20 skew-x-12 bg-jvto-green/5" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative z-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-sm border-4 border-white/10 shadow-2xl">
              <Image
                src="/founder/agung_sambuko.jpg"
                alt='Agung "Mr. Sam" Sambuko, founder of JVTO'
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-jvto-green" />
                  Police-Led Context
                </span>
                <p className="mb-1 text-xl font-bold text-white uppercase">
                  Agung “Mr. Sam” Sambuko
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-jvto-green">
                  Founder & Active Tourist Police
                </p>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-jvto-green/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
              <Star className="h-3.5 w-3.5" />
              Police Leadership
            </p>

            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Our Story
              <br />
              <span className="text-jvto-green">From Local Host to Trusted Operator.</span>
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-300">
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
              <div className="rounded-sm border border-white/10 bg-white/5 p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">
                  Official Liaison Context
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Not anonymous branding. The operator identity stays visible
                  throughout the decision journey.
                </p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/5 p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-green">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white">
                  Safety-First Route Handling
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Police-style route discipline carried into Ijen, Bromo, and
                  longer overland operations.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/why-jvto/our-story"
                className="inline-flex items-center gap-2 bg-jvto-green px-6 py-3 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:bg-white"
              >
                Read Our Story
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/verify-jvto"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-white/10"
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
