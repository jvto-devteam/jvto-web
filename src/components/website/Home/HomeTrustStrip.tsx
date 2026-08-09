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

// PKG-11a: rendered as a five-column credential ledger with vertical hairline
// rules — a spec sheet, not a badge row. Sub-text moved off white/40 (3.8:1)
// onto --color-jvto-on-navy-dim (6.9:1); the lime icons carry the "verified"
// read that the accent colour is reserved for.
export default function HomeTrustStrip() {
  return (
    <div className="border-t border-white/10 bg-jvto-navy">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {CELLS.map(({ Icon, label, sub }) => (
            <li
              key={label}
              className="flex flex-col gap-2.5 border-b border-white/10 py-6 pr-6 last:border-b-0 lg:border-b-0 lg:border-l lg:py-8 lg:pr-4 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <Icon
                size={20}
                className="text-jvto-lime"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              <p className="text-sm leading-snug font-bold text-white">{label}</p>
              <p className="text-xs leading-snug text-jvto-on-navy-dim">{sub}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
