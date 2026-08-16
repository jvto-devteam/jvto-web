import { AlertTriangle, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import type { PvmbgReportData } from "@/components/website/PvmbgFieldReport";

export interface VolcanicStatusData {
  status: "operational" | "restricted" | "closed";
  alert_level: string;
  alert_code: "level-1" | "level-2" | "level-3" | "level-4";
  last_verified: string; // YYYY-MM-DD
  notes: string;
  tours_operating: boolean;
  exclusion_zone_active: boolean;
  exclusion_zone_radius_km?: number;
  source: string;
  source_url: string;
  pvmbg_report?: PvmbgReportData;
}

const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    bg: "bg-emerald-950",
    border: "border-emerald-800",
    badge: "bg-emerald-900/60 text-emerald-300",
    dot: "bg-emerald-400",
    Icon: CheckCircle2,
    iconColor: "text-emerald-400",
  },
  restricted: {
    label: "Restricted",
    bg: "bg-amber-950",
    border: "border-amber-800",
    badge: "bg-amber-900/60 text-amber-300",
    dot: "bg-amber-400",
    Icon: AlertTriangle,
    iconColor: "text-amber-400",
  },
  closed: {
    label: "Closed",
    bg: "bg-red-950",
    border: "border-red-800",
    badge: "bg-red-900/60 text-red-300",
    dot: "bg-red-500",
    Icon: AlertCircle,
    iconColor: "text-red-400",
  },
} as const;

interface Props {
  destinationName: string;
  status: VolcanicStatusData;
}

export default function VolcanicStatusBadge({ destinationName, status }: Props) {
  const cfg = STATUS_CONFIG[status.status];
  const { Icon } = cfg;

  // Format date for human-readable display
  const verifiedDate = new Date(status.last_verified + "T00:00:00");
  const formattedDate = verifiedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-sm border ${cfg.bg} ${cfg.border} overflow-hidden`}
      // data- attributes for AI crawlers to parse status programmatically
      data-volcanic-status={status.status}
      data-alert-level={status.alert_level}
      data-last-verified={status.last_verified}
      data-tours-operating={String(status.tours_operating)}
    >
      {/* Header row */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} aria-hidden />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            Current Status — {destinationName}
          </p>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Alert level */}
        <div className="flex items-start gap-2.5">
          <Icon size={14} className={`${cfg.iconColor} shrink-0 mt-0.5`} />
          <div>
            <p className="text-[10px] font-bold text-white">{status.alert_level}</p>
            {status.exclusion_zone_active && status.exclusion_zone_radius_km && (
              <p className="text-[9px] text-slate-500 mt-0.5">
                {status.exclusion_zone_radius_km} km exclusion zone from crater rim
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <p className="text-[10px] text-slate-400 leading-relaxed">{status.notes}</p>

        {/* Tours operating indicator */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {status.tours_operating ? (
            <CheckCircle2 size={11} className="text-jvto-lime" />
          ) : (
            <AlertCircle size={11} className="text-red-400" />
          )}
          <span className="text-[9px] font-bold text-slate-400">
            {status.tours_operating ? "Tours operating normally" : "Tours paused — contact JVTO"}
          </span>
        </div>
      </div>

      {/* Footer — verification timestamp + source link */}
      <div className="px-4 py-2.5 bg-black/20 border-t border-white/5 flex items-center justify-between gap-3">
        <p className="text-[9px] text-slate-600 leading-none">
          Verified {formattedDate} · {status.source}
        </p>
        <a
          href={status.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[9px] text-slate-600 hover:text-jvto-lime transition-colors leading-none"
        >
          {status.source_url.replace("https://", "").split("/")[0]}
          <ExternalLink size={8} />
        </a>
      </div>
    </div>
  );
}
