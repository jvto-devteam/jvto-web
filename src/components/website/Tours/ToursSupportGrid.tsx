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
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7faf0_100%)] py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-safety-orange">
              Support near the shortlist
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-[-0.03em] text-jvto-dark md:text-5xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-gray-600">{copy}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[28px] border border-[#dce4c7] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#b8c59a] hover:shadow-[0_24px_50px_rgba(35,48,18,0.08)]"
              >
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-authority-navy text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-jvto-dark transition-colors group-hover:text-jvto-green">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{item.copy}</p>
                <div className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-green">
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
