// src/components/website/Home/HomeTravelGuideTeaser.tsx
import Link from "@/components/website/AppLink";
import { MessageCircleQuestion, CreditCard, HeartPulse, Shield } from "lucide-react";

const GUIDES = [
  {
    Icon: MessageCircleQuestion,
    title: "Frequently Asked Questions",
    description: "Everything first-timers ask.",
    href: "/travel-guide/faq",
  },
  {
    Icon: CreditCard,
    title: "Booking & Payment",
    description: "Deposits, cancellation, WhatsApp flow.",
    href: "/travel-guide/booking-information",
  },
  {
    Icon: HeartPulse,
    title: "Ijen Health Screening",
    description: "SpO₂ and blood pressure before ascent.",
    href: "/travel-guide/ijen-health-screening",
  },
  {
    Icon: Shield,
    title: "Safety on Tours",
    description: "Protocols, rescue access, risk realities.",
    href: "/travel-guide/safety-on-tours",
  },
] as const;

export default function HomeTravelGuideTeaser() {
  return (
    <section aria-labelledby="travel-guide-heading" className="bg-jvto-off py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Read Before You Go
        </p>
        <h2
          id="travel-guide-heading"
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          The Traveler&apos;s Rulebook
        </h2>
        <p className="text-jvto-navy/60 text-base mb-10">
          Active volcanoes. Health screenings. Early starts. Know before you go.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {GUIDES.map(({ Icon, title, description, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-6 border border-jvto-navy/5 hover:border-jvto-green transition-colors group block"
            >
              <Icon size={32} className="text-jvto-green mb-3" aria-hidden="true" />
              <p className="font-black text-jvto-navy text-base mb-1">
                {title}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </p>
              <p className="text-jvto-navy/60 text-sm">{description}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/travel-guide"
          className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
        >
          View all travel guides <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
