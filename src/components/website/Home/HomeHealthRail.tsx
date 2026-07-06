import { HeartPulse, CheckCircle2 } from "lucide-react";

const CHECKS = [
  "Dr. Irwandanu · SIP verified",
  "BBKSDA SE.1658/KSA.9/2024",
  "Gas mask included",
];

export default function HomeHealthRail() {
  return (
    <section aria-labelledby="health-rail-heading" className="bg-white border-y border-jvto-border py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-jvto-off flex items-center justify-center">
            <HeartPulse size={26} className="text-jvto-orange" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 06 — Ijen health-screening coordination
            </p>
            <h3
              id="health-rail-heading"
              className="font-black text-lg md:text-xl text-jvto-navy mb-2 leading-snug"
            >
              A health certificate is mandatory for Ijen entry. We coordinate the
              clinic.
            </h3>
            <p className="text-jvto-muted text-sm leading-relaxed max-w-3xl">
              BBKSDA SE.1658/KSA.9/2024 governs entry to the crater zone. Every guest is
              screened — JVTO arranges the workflow with Dr. Ahmad Irwandanu —
              SIP-verified at satusehat.kemkes.go.id — the evening before your hike, at
              your hotel. Gas masks are provided. No valid clearance, no crater access —
              we won&apos;t send you up without it.
            </p>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            {CHECKS.map((check) => (
              <span
                key={check}
                className="inline-flex items-center gap-2 text-xs font-bold text-jvto-navy"
              >
                <CheckCircle2 size={14} className="text-jvto-green flex-shrink-0" aria-hidden="true" />
                {check}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
