// src/components/website/Home/HomeTravelGuideTeaser.tsx
import Link from "@/components/website/AppLink";
import { HeartPulse, CloudRain, Backpack, ShieldCheck } from "lucide-react";

const GUIDES = [
  {
    Icon: HeartPulse,
    title: "Ijen Health Screening",
    href: "/travel-guide/ijen-health-screening",
  },
  {
    Icon: CloudRain,
    title: "Weather & Closures",
    href: "/travel-guide/weather-and-closures",
  },
  {
    Icon: Backpack,
    title: "Packing & Fitness",
    href: "/travel-guide/packing-and-fitness",
  },
  {
    Icon: ShieldCheck,
    title: "Booking & Cancellation",
    href: "/policy/booking-payment-cancellation",
  },
] as const;

export default function HomeTravelGuideTeaser() {
  return (
    <section aria-labelledby="guide-heading" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative order-2 md:order-1 aspect-[4/3] md:aspect-square rounded-sm overflow-hidden bg-jvto-off">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-jvto-muted/50 px-6 text-center">
                Ijen pre-ascent screening at partner hotel
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-3">
              § 08 · Read the Rulebook Before You Book
            </p>
            <h2
              id="guide-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy mb-4"
            >
              The Java <span className="text-jvto-orange">expedition guide.</span>
            </h2>
            <p className="text-jvto-muted text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Informed travelers make better decisions. Cancellation rules,
              inclusions, weather closures, and screening protocols are published in
              full before payment — not buried in fine print after a deposit.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {GUIDES.map(({ Icon, title, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-2.5 rounded-sm border border-jvto-border px-4 py-3 hover:border-jvto-navy transition-colors"
                >
                  <Icon size={16} className="text-jvto-muted flex-shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold text-jvto-navy leading-snug">
                    {title}
                  </span>
                  <span
                    className="ml-auto text-jvto-muted group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/travel-guide"
              className="text-sm font-bold text-jvto-navy hover:text-jvto-orange transition-colors"
            >
              Open full travel guide <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
