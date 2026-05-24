// src/components/website/Home/HomeWhyJVTO.tsx
import Link from "@/components/website/AppLink";
import { ShieldCheck, Users, BadgeCheck } from "lucide-react";

const DIFFERENTIATORS = [
  {
    Icon: ShieldCheck,
    title: "Tourist Police-Led",
    body: "Our founder is an active POLPAR officer. Not a travel agent who hired a guide — an officer who built a tour company.",
  },
  {
    Icon: Users,
    title: "Private. Always.",
    body: "Your group is your group. We never mix strangers into one vehicle or one tour. If you book 2 people, 2 people go.",
  },
  {
    Icon: BadgeCheck,
    title: "All-Inclusive, No Surprises",
    body: "One price covers transport, guide, permits, meals where listed. No tipping culture. No last-minute extras at the gate.",
  },
] as const;

export default function HomeWhyJVTO() {
  return (
    <section aria-labelledby="why-jvto-heading" className="bg-white pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Why JVTO
        </p>
        <h2
          id="why-jvto-heading"
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Three Things No Other Operator Offers Together
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {DIFFERENTIATORS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="border border-jvto-navy/10 border-t-4 border-t-jvto-green rounded-2xl p-8"
            >
              <Icon size={32} className="text-jvto-green mb-4" aria-hidden="true" />
              <p className="font-black text-jvto-navy text-xl mb-3">{title}</p>
              <p className="text-jvto-navy/70 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/why-jvto"
            className="text-sm font-bold text-jvto-navy/60 hover:text-jvto-navy underline"
          >
            Learn more about JVTO <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
