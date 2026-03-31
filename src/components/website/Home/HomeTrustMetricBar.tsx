import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileCheck2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const metrics = [
  {
    icon: FileCheck2,
    title: "Licensed PT",
    copy: "Entity trace visible",
  },
  {
    icon: ShieldCheck,
    title: "Police-Led Safety",
    copy: "Founder-led field discipline",
  },
  {
    icon: Star,
    title: "4.9 Reputation",
    copy: "112+ external reviews",
  },
  {
    icon: Users,
    title: "100% Private",
    copy: "No shared groups",
  },
  {
    icon: Building2,
    title: "Prepare & Book",
    copy: "Support before payment",
  },
] as const;

const HomeTrustMetricBar = () => {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">
              Audit Snapshot
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8faf5_100%)] px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-authority-navy text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Proof layer
                      </p>
                      <p className="mt-1 text-sm font-black uppercase tracking-wide text-jvto-dark">
                      {item.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">{item.copy}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>

          <Link
            href="/verify-jvto"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-jvto-dark transition-colors hover:border-lime-400 hover:text-lime-700"
          >
            Open full proof path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeTrustMetricBar;
