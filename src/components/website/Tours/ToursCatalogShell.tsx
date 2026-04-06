import { ReactNode } from "react";
import { Compass, Route, ShieldCheck } from "lucide-react";

interface ToursCatalogShellProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  children: ReactNode;
}

const iconMap = [Compass, Route, ShieldCheck] as const;

const ToursCatalogShell = ({
  eyebrow,
  title,
  description,
  bullets,
  children,
}: ToursCatalogShellProps) => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4f7ec_100%)] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(155,184,89,0.15),transparent_55%)]" />
      <div className="container relative mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight text-jvto-dark md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {bullets.map((bullet, index) => {
              const Icon = iconMap[index] ?? ShieldCheck;

              return (
                <div
                  key={bullet}
                  className="rounded-2xl border border-[#dce4c7] bg-white/90 p-4 shadow-[0_14px_32px_rgba(35,48,18,0.06)] backdrop-blur"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-jvto-green/15 text-jvto-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-semibold leading-6 text-gray-700">
                    {bullet}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-[#dbe3c5] bg-white p-3 shadow-[0_24px_60px_rgba(35,48,18,0.08)] md:p-4">
          <div className="rounded-[22px] border border-[#edf1e2] bg-[#fbfcf8]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursCatalogShell;
