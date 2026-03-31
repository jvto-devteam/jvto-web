import Link from "next/link";
import { ArrowRight, FileCheck2, ShieldCheck, Stethoscope } from "lucide-react";

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
    "rounded-full bg-jvto-green px-6 py-3 text-jvto-dark hover:bg-white",
  secondary:
    "rounded-full border border-white/20 bg-white/6 px-6 py-3 text-white hover:border-white hover:bg-white hover:text-authority-navy",
  ghost:
    "rounded-full border border-white/15 bg-black/15 px-6 py-3 text-white hover:bg-white/10",
} as const;

const ToursHubIntro = ({
  eyebrow,
  title,
  intro,
  chips,
  actions,
}: ToursHubIntroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-authority-navy text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(163,230,53,0.08),transparent_28%)]" />
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-15" />

      <div className="relative z-10 border-b border-white/10 bg-black/20">
        <div className="container mx-auto flex flex-wrap items-center gap-4 px-6 py-4 lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="status-live" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">
              Route Shortlist Protocol
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/85">
            <div className="inline-flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-verified-bright" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Proof nearby
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-verified-bright" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Private handling
              </span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-verified-bright" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Ijen seriousness
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-safety-orange">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
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
                  className={`inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.16em] transition-colors ${actionClassMap[action.variant ?? "primary"]}`}
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/12 bg-white/8 p-6 shadow-[0_32px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  Decision cues
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
                  Keep these beside the route list.
                </h2>
              </div>
              <span className="verified-badge">Active</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              The catalog works better when comparison, proof, and route seriousness stay in one view.
            </p>

            <div className="mt-5 grid gap-3">
              {chips.slice(0, 4).map((chip, index) => (
                <div
                  key={chip}
                  className="rounded-2xl border border-white/10 bg-black/18 px-4 py-4"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">
                    {chip}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/verify-jvto"
              className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-verified-bright transition hover:text-white"
            >
              Open proof route
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
      </div>
    </section>
  );
};

export default ToursHubIntro;
