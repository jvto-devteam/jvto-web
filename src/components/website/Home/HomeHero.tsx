import Image from "next/image";
import Link from "@/components/website/AppLink";

// PKG-11a: the hero keeps its own scrim stack rather than using
// <Section surface="navy">, because its ground is a photograph — the shared
// navy treatment would flatten it. It still uses the shared container width,
// gutters and text-on-dark tokens so it sits in the same system.

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
    <section
      aria-labelledby="home-h1"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-jvto-navy"
    >
      <Image
        src="/assets/img/hero/home.webp"
        alt="Scenic view of Java volcanoes"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Scrim stack. Three stops instead of one flat wash: a top band so the
          sticky navbar stays legible, a deliberately thin middle so the
          landscape actually reads (photography-first), and a deep floor the
          copy sits on. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,16,25,0.78) 0%, rgba(7,16,25,0.30) 34%, rgba(7,16,25,0.62) 68%, rgba(7,16,25,0.95) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Ember — the crater glow, kept under 25% so it never touches contrast. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 6% 104%, rgba(232,101,10,0.22), transparent 62%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-40 pb-14 md:px-8 md:pb-20">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-jvto-lime/45 bg-jvto-lime/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-[2px]">
                Tourist Police-Led Private Tours
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-jvto-on-navy-dim uppercase">
                File 001 / Homepage
              </span>
            </div>

            <h1
              id="home-h1"
              className="font-jvto-heading mb-7 text-[2.5rem] leading-[1.03] font-black tracking-[-0.03em] whitespace-pre-line text-white sm:text-5xl md:text-[4rem]"
            >
              {title}
            </h1>

            <p className="sr-only">{description}</p>

            {/* Accent rule — a survey mark tying the headline to the deck. */}
            <span
              aria-hidden="true"
              className="mb-6 block h-0.5 w-16 bg-jvto-orange"
            />

            <p className="max-w-xl text-base leading-relaxed text-jvto-on-navy md:text-lg">
              Private Bromo, Ijen &amp; Tumpak Sewu tours from Surabaya or Bali. Licensed
              operator (NIB 1102230032918), led by an active Tourist Police officer. No
              shared groups. Plan-B framework when conditions change. From IDR
              1,000,000/pax.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-[10px] font-bold tracking-[0.15em] text-jvto-on-navy uppercase">
                Choose your start point
              </span>
              <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-jvto-on-navy-dim uppercase">
                02 routes
              </span>
            </div>
            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tours/from-surabaya"
                className="jvto-focus-dark inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-jvto-lime px-6 py-3.5 text-center text-sm font-bold tracking-wider text-jvto-navy uppercase shadow-[0_10px_30px_-14px_rgba(140,198,63,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95"
              >
                From Surabaya
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/tours/from-bali"
                className="jvto-focus-dark inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-white/45 bg-white/[0.04] px-6 py-3.5 text-center text-sm font-bold tracking-wider text-white uppercase backdrop-blur-[2px] transition-colors duration-200 hover:border-white/80 hover:bg-white/10"
              >
                From Bali
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {/* Ledger — hairline-ruled cells, the operational-authority read. */}
            <div className="grid grid-cols-2 border-t border-white/15">
              {STATS.map((stat) => (
                <div
                  key={stat.l}
                  className="border-b border-white/10 py-4 pr-4 odd:border-r odd:pr-6"
                >
                  <p className="font-jvto-heading mb-1.5 text-2xl leading-none font-black text-white">
                    {stat.n}
                    {stat.suffix && (
                      <small className="text-sm font-bold text-jvto-on-navy-dim">
                        {stat.suffix}
                      </small>
                    )}
                  </p>
                  <p className="text-xs leading-snug text-jvto-on-navy-dim">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
