import { ExternalLink } from "lucide-react";

export interface PvmbgReportData {
  visual: string;
  visual_en: string;
  climate: string;
  climate_en: string;
  image_url: string;
  recommendations: string[];
  recommendations_en: string[];
  author: string;
  fetched_at: string;
}

interface Props {
  report: PvmbgReportData;
  sourceUrl: string;
  lastVerified: string;
}

export default function PvmbgFieldReport({ report, sourceUrl, lastVerified }: Props) {
  const verifiedDate = new Date(lastVerified + "T00:00:00");
  const formattedDate = verifiedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-sm border border-slate-800 bg-slate-950 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          PVMBG Field Report
        </p>
        <span className="text-[9px] text-slate-600">{formattedDate}</span>
      </div>

      {/* PVMBG observation photo */}
      {report.image_url && (
        <div className="relative w-full aspect-video bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.image_url}
            alt="PVMBG volcano observation"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {/* Visual observation */}
        {report.visual_en && (
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Visual
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">{report.visual_en}</p>
          </div>
        )}

        {/* Summit conditions */}
        {report.climate_en && (
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Summit Conditions
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">{report.climate_en}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {sourceUrl && (
        <div className="px-4 py-2.5 bg-black/20 border-t border-white/5 flex items-center justify-between gap-3">
          <p className="text-[9px] text-slate-600 leading-none">
            PVMBG / MAGMA Indonesia
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[9px] text-slate-600 hover:text-jvto-lime transition-colors leading-none shrink-0"
          >
            Source
            <ExternalLink size={8} />
          </a>
        </div>
      )}
    </div>
  );
}
