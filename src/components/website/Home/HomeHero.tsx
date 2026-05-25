// src/components/website/Home/HomeHero.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";

interface HomeHeroProps {
  title: string;
  description: string;
}

const STATS = ["4.8★ Trustpilot / 51", "4.9★ Google / 92", "16 Packages", "Est. 2015"];

export default function HomeHero({ title, description }: HomeHeroProps) {
  return (
    <section className="relative min-h-[100svh] flex items-center md:items-end">
      <Image
        src="/assets/img/hero/home.webp"
        alt="Mount Bromo volcano at sunrise — Java Volcano Tour Operator"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-jvto-navy/60 via-jvto-navy/30 to-jvto-navy/90" />

      {/* Main content — centered on mobile, bottom-left on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full py-24 md:pb-20 md:pt-0">
        <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-jvto-green/90 mb-4">
            Est. 2015 · Bondowoso, East Java · Tourist Police-Led
          </p>

          <h1
            className="font-black text-4xl sm:text-5xl md:text-6xl leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>

          <p className="sr-only">{description}</p>

          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto md:mx-0 mb-8">
            16 private packages to Bromo, Ijen, and East Java&apos;s best.
            Licensed operator. No shared groups. All-inclusive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/tours"
              className="bg-jvto-green text-jvto-navy font-black px-6 py-3 rounded-full text-sm text-center hover:bg-jvto-green/90 transition-colors"
            >
              Browse Tours <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/verify-jvto"
              className="border border-white/50 text-white font-bold px-6 py-3 rounded-full text-sm text-center hover:border-white/80 transition-colors"
            >
              Verify Credentials <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Stats — desktop only, in-flow */}
          <div className="hidden md:block border-t border-white/10 pt-6 mt-12">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-start">
              {STATS.map((stat) => (
                <span key={stat} className="text-xs font-bold text-white/60 uppercase tracking-wide">
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats — mobile only, anchored to bottom of hero */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 px-6 pb-8">
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            {STATS.map((stat) => (
              <span key={stat} className="text-xs font-bold text-white/60 uppercase tracking-wide">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
