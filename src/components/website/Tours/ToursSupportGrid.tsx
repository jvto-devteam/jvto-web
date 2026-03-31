import Link from "next/link";
import { BookOpen, FileCheck2, HeartPulse, ShieldCheck } from "lucide-react";

type SupportItem = {
  title: string;
  copy: string;
  href: string;
  icon: "proof" | "booking" | "screening" | "trust";
};

const iconMap = {
  proof: FileCheck2,
  booking: BookOpen,
  screening: HeartPulse,
  trust: ShieldCheck,
} as const;

interface ToursSupportGridProps {
  title: string;
  copy: string;
  items: SupportItem[];
}

const ToursSupportGrid = ({ title, copy, items }: ToursSupportGridProps) => {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f6f8ef_100%)] py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">
              Support near the shortlist
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-jvto-dark md:text-4xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-gray-600">{copy}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[24px] border border-[#dce4c7] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-[0_20px_40px_rgba(35,48,18,0.08)]"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jvto-green/12 text-jvto-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-jvto-dark transition-colors group-hover:text-jvto-green">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.copy}</p>
                <div className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-jvto-green">
                  Open support route
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToursSupportGrid;
