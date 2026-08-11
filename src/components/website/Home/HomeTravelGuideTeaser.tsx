// src/components/website/Home/HomeTravelGuideTeaser.tsx
import Image from "next/image";
import Link from "@/components/website/AppLink";
import { HeartPulse, CloudRain, Backpack, ShieldCheck } from "lucide-react";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

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
    <Section surface="light" labelledBy="guide-heading">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Ijen pre-ascent screening at a partner hotel — was a captioned empty
            plate pending a real photo (PKG-11a, owner decision 2026-08-09);
            filled with the same hotel-screening photo set used by
            HomeHealthRail, second frame, to avoid repeating the identical
            image within the same homepage. */}
        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-sm border border-jvto-border md:order-1 md:aspect-square">
          <Image
            src="/screening/ijen-screening-hotel-02.webp"
            alt="Ijen pre-ascent health screening at a partner hotel"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 md:order-2">
          <SectionHeading
            id="guide-heading"
            eyebrow="§ 08 · Read the Rulebook Before You Book"
            title={
              <>
                The Java <span className="text-jvto-orange">expedition guide.</span>
              </>
            }
            className="mb-6"
          />

          <p className="mb-8 max-w-md text-sm leading-relaxed text-jvto-ink-soft md:text-base">
            Informed travelers make better decisions. Cancellation rules, inclusions,
            weather closures, and screening protocols are published in full before
            payment — not buried in fine print after a deposit.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GUIDES.map(({ Icon, title, href }) => (
              <Link
                key={href}
                href={href}
                className="jvto-focus group flex items-center gap-2.5 rounded-sm border border-jvto-border bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-jvto-navy hover:shadow-jvto-soft"
              >
                <Icon
                  size={16}
                  className="flex-shrink-0 text-jvto-orange"
                  aria-hidden="true"
                />
                <span className="text-xs leading-snug font-bold text-jvto-navy">
                  {title}
                </span>
                <span
                  className="ml-auto text-jvto-ink-soft transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/travel-guide"
            className="jvto-focus rounded-sm text-sm font-bold text-jvto-navy transition-colors hover:text-jvto-orange"
          >
            Open full travel guide <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
