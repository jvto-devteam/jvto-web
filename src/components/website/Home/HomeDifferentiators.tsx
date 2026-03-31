import Link from "next/link";
import { Activity, Lock, ShieldCheck, Waves } from "lucide-react";

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
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {differentiators.map(({ title, copy, href, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-sm border border-[#e5e9d8] bg-[#fafbf7] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-lg"
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark transition-colors group-hover:bg-jvto-green group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-black uppercase tracking-wide text-jvto-dark">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{copy}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDifferentiators;
