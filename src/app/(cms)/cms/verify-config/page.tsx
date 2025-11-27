"use client";

import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

type CheckItem = {
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
};

const mockChecks: CheckItem[] = [
  {
    label: "API Base URL",
    status: "ok",
    detail: "https://api.your-domain.com",
  },
  {
    label: "Public Site URL",
    status: "ok",
    detail: "https://your-domain.com",
  },
  {
    label: "CMS Auth Token",
    status: "warn",
    detail: "Using dev token. Disarankan pakai token produksi.",
  },
  {
    label: "FAQ Sync Endpoint",
    status: "ok",
    detail: "/api/cms/faq",
  },
];

export default function VerifyConfigPage() {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Verify Configuration
          </h2>
          <p className="text-sm text-slate-400">
            Pantau konfigurasi penting antara CMS dan website utama: endpoint, URL, dan kredensial.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 divide-y divide-slate-900/80">
        {mockChecks.map((item, i) => {
          const icon =
            item.status === "ok"
              ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              : item.status === "warn"
              ? <AlertTriangle className="h-4 w-4 text-amber-400" />
              : <AlertTriangle className="h-4 w-4 text-rose-400" />;

          const badgeClass =
            item.status === "ok"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : item.status === "warn"
              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
              : "bg-rose-500/10 text-rose-300 border-rose-500/30";

          const label =
            item.status === "ok"
              ? "OK"
              : item.status === "warn"
              ? "Warning"
              : "Failed";

          return (
            <div
              key={i}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-start gap-2">
                {icon}
                <div>
                  <div className="text-xs font-semibold text-slate-100">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.detail}
                  </div>
                </div>
              </div>
              <span
                className={
                  "px-2 py-0.5 rounded-full text-[9px] border " + badgeClass
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-slate-500">
        Untuk produksi: ganti <code>mockChecks</code> dengan hasil fetch dari API internal
        atau pembacaan langsung environment variables, lalu beri indikator jelas kalau ada misconfig.
      </p>
    </section>
  );
}
