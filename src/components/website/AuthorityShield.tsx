import { Fragment } from "react";
import { Shield, Award, Stethoscope, Users } from "lucide-react";

interface Props {
  ijenRelevant?: boolean;
}

export default function AuthorityShield({ ijenRelevant = false }: Props) {
  const badges = [
    {
      Icon: Shield,
      label: "Verified Police Led",
      sub: "Active POLPAR officer",
    },
    {
      Icon: Award,
      label: "NIB Registered",
      sub: "PT Java Volcano Rendezvous",
    },
    ijenRelevant
      ? {
          Icon: Stethoscope,
          label: "Medical Screening Included",
          sub: "BBKSDA SE.1658 compliant",
        }
      : {
          Icon: Users,
          label: "HPWKI Certified Guides",
          sub: "BBKSDA-supervised training",
        },
  ];

  return (
    <div className="bg-jvto-navy-deep border-y border-white/10">
      <div className="container mx-auto px-6 py-3.5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-0">
          {badges.map(({ Icon, label, sub }, i) => (
            <Fragment key={label}>
              {i > 0 && (
                <div
                  className="hidden md:block h-7 w-px bg-white/15 mx-8"
                  aria-hidden
                />
              )}
              <div className="flex items-center gap-2.5">
                <span className="shrink-0 text-jvto-lime">
                  <Icon size={14} />
                </span>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white leading-none">
                    {label}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40 mt-1 leading-none">
                    {sub}
                  </p>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
