import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Action = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

interface ToursHubIntroProps {
  eyebrow: string;
  title: string;
  intro: string;
  chips: string[];
  actions: Action[];
}

const actionClassMap = {
  primary:
    "bg-jvto-green text-jvto-dark hover:bg-white",
  secondary:
    "border border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white",
  ghost:
    "text-jvto-dark hover:text-jvto-green",
} as const;

const ToursHubIntro = ({
  eyebrow,
  title,
  intro,
  chips,
  actions,
}: ToursHubIntroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-[#e4e8da] bg-[linear-gradient(180deg,#eef5e2_0%,#ffffff_72%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(110,143,44,0.2),transparent_50%)]" />
      <div className="container relative mx-auto px-6 pt-28 pb-14 md:pt-36 md:pb-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-jvto-green">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-jvto-dark md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#d7ddc6] bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors ${actionClassMap[action.variant ?? "primary"]}`}
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#d9e1c4] bg-white/90 p-5 shadow-[0_24px_60px_rgba(35,48,18,0.1)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-jvto-green">
              Decision cues
            </p>
            <div className="mt-4 grid gap-3">
              {chips.slice(0, 4).map((chip, index) => (
                <div
                  key={chip}
                  className="rounded-2xl border border-[#e8edd9] bg-[#fbfcf8] px-4 py-4"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-jvto-green/80">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-jvto-dark">
                    {chip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(93,122,38,0.28),transparent)]" />
      </div>
    </section>
  );
};

export default ToursHubIntro;
