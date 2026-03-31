import Link from "next/link";
import { Activity, ArrowRight, Lock, ShieldCheck, Waves } from "lucide-react";

const differentiators = [
  {
    title: "You Know Who's Leading",
    copy: "Founded by an active Tourist Police officer. Route discipline comes from real field accountability, not brochure language.",
    href: "/verify-jvto/police-safety",
    Icon: ShieldCheck,
  },
  {
    title: "Screened Before You Climb",
    copy: "Ijen access is gated by licensed doctor clearance. The workflow is visible before you commit, not discovered after you arrive.",
    href: "/travel-guide/ijen-health-screening",
    Icon: Activity,
  },
  {
    title: "Fully Traceable, Not Anonymous",
    copy: "A registered PT with visible legal documents and office identity. Every core claim can be verified before booking.",
    href: "/verify-jvto/legal",
    Icon: Lock,
  },
  {
    title: "No Static Volcano Assumptions",
    copy: "Bromo and Ijen decisions should follow live volcanic context. Route planning is stronger when status is treated seriously.",
    href: "/travel-guide/weather-and-closures",
    Icon: Waves,
  },
] as const;

const HomeDifferentiators = () => {
  return (
    <section className="bg-[#f8faf5] py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">
              Why the route feels different
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-authority-navy md:text-5xl">
              Built for proof, not generic brochure comfort.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
              JVTO should feel like one system: the commercial route, the health seriousness,
              the legal identity, and the field logic all belong together. These are not
              decorative trust badges added after the route is sold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/why-jvto"
                className="inline-flex items-center gap-2 rounded-full bg-authority-navy px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
              >
                Open Why JVTO
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/travel-guide"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-jvto-dark transition hover:border-lime-400 hover:text-lime-700"
              >
                Prepare &amp; Book
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {differentiators.map(({ title, copy, href, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[30px] border border-[#dbe4c6] bg-white p-7 shadow-[0_18px_44px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-lime-400 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
              >
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-jvto-green/12 text-jvto-dark transition-colors group-hover:bg-jvto-green group-hover:text-authority-navy">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-black uppercase tracking-wide text-jvto-dark">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{copy}</p>
                <div className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-lime-700">
                  Read next
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeDifferentiators;
