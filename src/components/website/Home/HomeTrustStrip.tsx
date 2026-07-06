import { Building2, ShieldCheck, Users, Star, BadgeCheck } from "lucide-react";

const CELLS = [
  {
    Icon: Building2,
    label: "NIB · TDUP · oss.go.id",
    sub: "1102230032918 · checkable",
  },
  {
    Icon: ShieldCheck,
    label: "Ditpamobvit East Java",
    sub: "Bripka Agung Sambuko · SPRIN",
  },
  {
    Icon: Users,
    label: "100% Private — Always",
    sub: "Your vehicle · guide · driver",
  },
  {
    Icon: Star,
    label: "4.8★ Trustpilot · 4.9 Google",
    sub: "195+ reviews across platforms",
  },
  {
    Icon: BadgeCheck,
    label: "HPWKI-trained guides · BBKSDA",
    sub: "Ijen specialist · park clearance · ISIC 259268",
  },
] as const;

export default function HomeTrustStrip() {
  return (
    <div className="bg-jvto-navy border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {CELLS.map(({ Icon, label, sub }) => (
            <div key={label} className="flex flex-col gap-2">
              <Icon size={20} className="text-white/50" aria-hidden="true" strokeWidth={1.5} />
              <p className="text-white text-sm font-bold leading-snug">{label}</p>
              <p className="text-white/40 text-xs leading-snug">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
