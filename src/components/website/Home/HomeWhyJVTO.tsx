// src/components/website/Home/HomeWhyJVTO.tsx
import Link from "@/components/website/AppLink";
import { ShieldCheck, Users, BadgeCheck, HeartPulse, FileCheck2, Map } from "lucide-react";

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
  {
    Icon: HeartPulse,
    title: "Ijen Health Screening",
    body: "Licensed doctor on file with Kemenkes RI. SpO₂ and blood pressure checked before ascent. Ijen can reject guests at the gate — we screen before you travel.",
  },
  {
    Icon: FileCheck2,
    title: "Verifiable Licenses",
    body: "NIB, TDUP, HPWKI, and park clearance — all publicly verifiable. We publish SHA-256 hashes of our documents so you can confirm authenticity yourself.",
  },
  {
    Icon: Map,
    title: "Written Plan B",
    body: "If Bromo or Ijen closes due to volcanic activity, you get a pre-briefed alternative route — not improvised at the gate. Plan B is part of your departure briefing.",
  },
] as const;

export default function HomeWhyJVTO() {
  return (
    <section aria-labelledby="why-jvto-heading" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-jvto-navy/40 mb-2">
          Why JVTO
        </p>
        <h2
          id="why-jvto-heading"
          className="font-black text-3xl md:text-4xl text-jvto-navy mb-12"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What Makes JVTO Different
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
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

        {/* Verify JVTO teaser */}
        <div className="bg-jvto-off rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="font-black text-jvto-navy text-lg mb-1">
              Credentials you can check — not logos you have to take on faith.
            </p>
            <p className="text-jvto-navy/60 text-sm">
              Every license, permit, and credential is publicly verifiable. SHA-256 anchored.
            </p>
          </div>
          <Link
            href="/verify-jvto"
            className="flex-shrink-0 bg-jvto-navy text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-jvto-navy/90 transition-colors"
          >
            Verify JVTO <span aria-hidden="true">→</span>
          </Link>
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
