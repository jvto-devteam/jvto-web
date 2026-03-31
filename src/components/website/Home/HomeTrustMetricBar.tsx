import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Star, Users } from "lucide-react";

const metrics = [
  {
    icon: Star,
    title: "4.9 Reputation",
    copy: "112+ external reviews",
  },
  {
    icon: ShieldCheck,
    title: "Police-Led Safety",
    copy: "Founder-led field discipline",
  },
  {
    icon: Users,
    title: "100% Private",
    copy: "No shared groups",
  },
  {
    icon: Building2,
    title: "Licensed PT",
    copy: "Registered Indonesian operator",
  },
] as const;

const HomeTrustMetricBar = () => {
  return (
    <section className="bg-[#f4f6ed] border-y border-[#d9dfc9]">
      <div className="container mx-auto px-6 py-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-sm border border-[#d9dfc9] bg-white px-4 py-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black uppercase tracking-wide text-jvto-dark">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-600">{item.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/why-jvto/reviews"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-jvto-dark transition-colors hover:text-jvto-green"
          >
            Read reviews
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeTrustMetricBar;
