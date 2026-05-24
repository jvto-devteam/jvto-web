// src/components/website/Home/HomeHero.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";

interface HomeHeroProps {
  title: string;
  description: string;
}

export default function HomeHero({ title, description }: HomeHeroProps) {
  return (
    <section className="relative min-h-[100svh] flex items-center">
      <Image
        src="/assets/img/hero/home.webp"
        alt="Mount Bromo volcano at sunrise — Java Volcano Tour Operator"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-jvto-navy/90 via-jvto-navy/40 to-jvto-navy/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full py-20">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-jvto-green/90 mb-4">
            Est. 2015 · Bondowoso, East Java · Tourist Police-Led
          </p>

          <h1
            className="font-black text-5xl md:text-7xl leading-tight text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h1>

          <p className="sr-only">{description}</p>

          <p className="text-base md:text-lg text-white/70 max-w-xl mb-8">
            16 private packages to Bromo, Ijen, and East Java&apos;s best.
            Licensed operator. No shared groups. All-inclusive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/tours"
              className="bg-jvto-green text-jvto-navy font-black px-6 py-3 rounded-full text-sm text-center hover:bg-jvto-green/90 transition-colors"
            >
              Browse Tours ↗
            </Link>
            <Link
              href="/verify-jvto"
              className="border border-white/50 text-white font-bold px-6 py-3 rounded-full text-sm text-center hover:border-white/80 transition-colors"
            >
              Verify Credentials →
            </Link>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
              {["4.8★ Trustpilot / 51", "4.9★ Google / 92", "16 Packages", "Est. 2015"].map(
                (stat) => (
                  <span key={stat} className="text-xs font-bold text-white/60 uppercase tracking-wide">
                    {stat}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
