import Image from "next/image";
import Link from "@/components/website/AppLink";

interface HomeHeroProps {
  title: string;
  description: string;
}

const STATS = [
  { n: "2015", l: "Est. · guesthouse era" },
  { n: "4.8", suffix: "/5", l: "Trustpilot · 51 verified" },
  { n: "16", l: "Private itineraries · 1D–6D" },
  { n: "14", l: "Crew · 11 KTA-confirmed" },
];

export default function HomeHero({ title, description }: HomeHeroProps) {
  return (
    <header className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      <Image
        src="/assets/img/hero/home.webp"
        alt="Scenic view of Java volcanoes"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.82) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-8 pb-14 md:pb-20 pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                Tourist Police-Led Private Tours
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                File 001 / Homepage
              </span>
            </div>

            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-white mb-6 tracking-tight whitespace-pre-line">
              {title}
            </h1>

            <p className="sr-only">{description}</p>

            <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
              Private Bromo, Ijen &amp; Tumpak Sewu tours from Surabaya or Bali. Licensed
              operator (NIB 1102230032918), led by an active Tourist Police officer. No
              shared groups. Plan-B framework when conditions change. From IDR
              1,000,000/pax.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
                Choose your start point
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                02 routes
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/tours/from-surabaya"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-jvto-lime text-jvto-navy font-bold uppercase tracking-wider px-6 py-3.5 rounded-sm text-sm text-center hover:brightness-95 hover:-translate-y-0.5 transition-all"
              >
                From Surabaya
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/tours/from-bali"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold uppercase tracking-wider px-6 py-3.5 rounded-sm text-sm text-center hover:border-white/70 transition-colors"
              >
                From Bali
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
              {STATS.map((stat) => (
                <div key={stat.l}>
                  <p className="text-white font-black text-xl leading-none mb-1.5">
                    {stat.n}
                    {stat.suffix && (
                      <small className="text-white/50 font-bold text-sm">
                        {stat.suffix}
                      </small>
                    )}
                  </p>
                  <p className="text-white/50 text-xs leading-snug">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
