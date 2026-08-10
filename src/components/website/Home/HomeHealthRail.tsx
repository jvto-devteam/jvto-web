import { HeartPulse, CheckCircle2 } from "lucide-react";
import Section from "@/components/design/Section";

const CHECKS = [
  "Dr. Irwandanu · SIP verified",
  "BBKSDA SE.1658/KSA.9/2024",
  "Gas mask included",
];

// PKG-11a: a "band" rather than a full section — it is a standing operational
// notice between two major sections, so it gets the tighter rhythm and a warm
// orange marker. Its heading was an <h2>-level section heading marked up as
// <h3>; corrected here so the document outline has no orphan level.
export default function HomeHealthRail() {
  return (
    <Section
      surface="light"
      density="band"
      labelledBy="health-rail-heading"
      className="border-y border-jvto-border"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-jvto-orange/10 ring-1 ring-jvto-orange/25"
        >
          <HeartPulse size={26} className="text-jvto-orange" />
        </div>

        <div className="flex-1">
          <p className="mb-2 font-mono text-[10px] font-bold tracking-[0.22em] text-jvto-ink-soft uppercase">
            § 06 — Ijen health-screening coordination
          </p>
          <h2
            id="health-rail-heading"
            className="font-jvto-heading mb-3 text-lg leading-snug font-black text-jvto-navy md:text-2xl"
          >
            A health certificate is mandatory for Ijen entry. We coordinate the clinic.
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-jvto-ink-soft">
            BBKSDA SE.1658/KSA.9/2024 governs entry to the crater zone. Every guest is
            screened — JVTO arranges the workflow with Dr. Ahmad Irwandanu —
            SIP-verified at satusehat.kemkes.go.id — the evening before your hike, at
            your hotel. Gas masks are provided. No valid clearance, no crater access —
            we won&apos;t send you up without it.
          </p>
        </div>

        <ul className="flex flex-shrink-0 flex-col gap-2.5 md:border-l md:border-jvto-border md:pl-8">
          {CHECKS.map((check) => (
            <li
              key={check}
              className="inline-flex items-center gap-2 text-xs font-bold text-jvto-navy"
            >
              <CheckCircle2
                size={14}
                className="flex-shrink-0 text-jvto-lime-ink"
                aria-hidden="true"
              />
              {check}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
