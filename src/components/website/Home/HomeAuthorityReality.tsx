import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Building2,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { homepageAuthorityRealityDoctrine } from "@/lib/homepage/homepageDoctrine";

const iconMap = {
  shield: ShieldCheck,
  waves: Waves,
  activity: Activity,
  building: Building2,
} as const;

const HomeAuthorityReality = () => {
  return (
    <section className="border-y border-[#d9dfc9] bg-[#f4f6ed] py-10 md:py-14">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
              {homepageAuthorityRealityDoctrine.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-jvto-dark md:text-4xl">
              {homepageAuthorityRealityDoctrine.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              {homepageAuthorityRealityDoctrine.copy}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {homepageAuthorityRealityDoctrine.actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={
                  action.variant === "primary"
                    ? "inline-flex items-center gap-2 bg-jvto-dark px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-black"
                    : "inline-flex items-center gap-2 border border-[#ccd6b4] px-5 py-3 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:bg-white"
                }
              >
                {action.label}
                {action.variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {homepageAuthorityRealityDoctrine.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-sm border border-[#d9dfc9] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark transition-colors group-hover:bg-jvto-green group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {item.meta}
                </span>
              </div>
              <h3 className="mt-5 text-base font-black uppercase leading-6 tracking-wide text-jvto-dark">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.copy}</p>
            </Link>
          )})}
        </div>
      </div>
    </section>
  );
};

export default HomeAuthorityReality;
