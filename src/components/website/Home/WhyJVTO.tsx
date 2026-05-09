import Link from "@/components/website/AppLink";
import Image from "next/image";

const WhyJVTO: React.FC = () => {
  return (
    <section className="py-24 bg-jvto-dark text-white relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <div className="inline-block bg-jvto-green text-jvto-dark text-xs font-black uppercase tracking-widest px-3 py-1 mb-6">
              Our Story
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-none">
              From Local Host to <br />
              <span className="text-jvto-green">Police-Led Operator.</span>
            </h2>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                JVTO grew from a humble local guesthouse in Bondowoso into a licensed tour operator shaped by the <strong>Tourist Police experience</strong> of our founder, Mr. Sam.
              </p>
              <p>
                We saw the gaps in safety standards first-hand and decided to build something different: private-only routes, realistic driving days, and clear written rules.
              </p>
              <p>
                Today, we act as a bridge between wild adventure and professional safety standards.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Link
                target="_blank"
                href="/why-jvto/our-story"
                prefetch={false}
                className="font-bold border-b-2 border-jvto-green text-white hover:text-jvto-green transition-colors pb-1 text-lg"
              >
                Read Full Story
              </Link>

              <Link
                target="_blank"
                href="/verify-jvto"
                prefetch={false}
                className="font-bold border-b-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors pb-1 text-lg"
              >
                How to Verify Us
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Main Image */}
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 w-full max-w-md aspect-[4/5]">
              <Image
                src="/founder/agung_sambuko.webp"
                alt='Agung "Mr. Sam" Sambuko - JVTO Founder'
                fill
                unoptimized
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                <p className="font-bold text-white text-xl uppercase mb-1">
                  Agung “Mr. Sam” Sambuko
                </p>
                <p className="text-xs text-jvto-green font-bold uppercase tracking-widest">
                  Founder & Active Tourist Police
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
