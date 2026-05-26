import Image from "next/image";
import Link from "@/components/website/AppLink";

interface HomeHeroProps {
  title: string;
  description: string;
}

const STATS = [
  { label: "Trustpilot", value: "4.8★", detail: "51 reviews" },
  { label: "Google", value: "4.9★", detail: "123 reviews" },
  { label: "Packages", value: "16", detail: "private tours" },
  { label: "Operating", value: "Since", detail: "2015" },
];

export default function HomeHero({ title, description }: HomeHeroProps) {
  return (
    <section className="relative min-h-[100svh] flex items-end">
      <Image
        src="/assets/img/hero/home.webp"
        alt="Mount Bromo volcano at sunrise, East Java"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-jvto-navy/50 via-jvto-navy/20 to-jvto-navy/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full pb-10 md:pb-16 pt-32">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-jvto-green mb-5">
            Est. 2015 · Bondowoso, East Java · Tourist Police-Led
          </p>

          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl leading-[1.08] text-white mb-5">
            {title}
          </h1>

          <p className="sr-only">{description}</p>

          <p className="text-base md:text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
            16 private packages to Bromo, Ijen, and Tumpak Sewu.
            Licensed operator (NIB 1102230032918). All-inclusive.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12 md:mb-16">
            <Link
              href="/tours"
              className="bg-jvto-green text-jvto-navy font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm text-center hover:brightness-95 transition-all"
            >
              Browse Tours
            </Link>
            <Link
              href="/verify-jvto"
              className="border-2 border-white/40 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm text-sm text-center hover:border-white/70 transition-colors"
            >
              Verify Credentials
            </Link>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-white font-black text-lg leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
