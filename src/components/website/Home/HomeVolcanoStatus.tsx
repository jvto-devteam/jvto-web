"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Section from "@/components/design/Section";
import SectionHeading from "@/components/design/SectionHeading";

interface VolcanoEntry {
  id: "bromo" | "ijen";
  name: string;
  elevation: string;
  regency: string;
  level: string;
  levelName: string;
  levelTone: "gold" | "lime";
  description: string;
  toursOperating: boolean;
}

const VOLCANOES: VolcanoEntry[] = [
  {
    id: "bromo",
    name: "Mount Bromo",
    elevation: "2,329 m",
    regency: "Probolinggo",
    level: "Level II",
    levelName: "Waspada",
    levelTone: "gold",
    description:
      "Elevated seismic activity per PVMBG. Tours operate normally with the standard safety distance maintained at the King Kong Hill viewpoint.",
    toursOperating: true,
  },
  {
    id: "ijen",
    name: "Mount Ijen",
    elevation: "2,769 m",
    regency: "Banyuwangi",
    level: "Level I",
    levelName: "Normal",
    levelTone: "lime",
    description:
      "Standard activity per PVMBG. Pre-ascent health screening is mandatory for every guest before crater descent, per BBKSDA SE.1658/KSA.9/2024, and JVTO coordinates the clinic workflow.",
    toursOperating: true,
  },
];

// PKG-11a: styled as an instrument readout — mono throughout, a ruled field for
// each measurement, and the alert level carried by a ringed dot + navy text
// rather than by colour alone (jvto-gold is 1.9:1 on the off-white panel, so it
// can never be the only signal).
export default function HomeVolcanoStatus() {
  const [activeId, setActiveId] = useState<VolcanoEntry["id"]>("bromo");
  const tabRefs = useRef<Partial<Record<VolcanoEntry["id"], HTMLButtonElement | null>>>(
    {},
  );
  const active = VOLCANOES.find((v) => v.id === activeId) ?? VOLCANOES[0];
  const dot = active.levelTone === "gold" ? "bg-jvto-gold" : "bg-jvto-lime";

  // Roving tabindex + arrow keys, per the ARIA tabs pattern (see HomeToursClient).
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const from = VOLCANOES.findIndex((v) => v.id === activeId);
    let to: number | null = null;
    if (event.key === "ArrowRight") to = (from + 1) % VOLCANOES.length;
    else if (event.key === "ArrowLeft")
      to = (from - 1 + VOLCANOES.length) % VOLCANOES.length;
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = VOLCANOES.length - 1;
    if (to === null) return;
    event.preventDefault();
    const next = VOLCANOES[to].id;
    setActiveId(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Section surface="light" labelledBy="volcano-heading">
      <SectionHeading
        id="volcano-heading"
        eyebrow="§ 07 — Live status"
        title={
          <>
            Volcano <span className="text-jvto-orange">activity.</span>
          </>
        }
        aside={
          <a
            href="https://magma.esdm.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="jvto-focus rounded-sm underline decoration-jvto-rule underline-offset-4 transition-colors hover:text-jvto-navy"
          >
            Source · PVMBG / MAGMA Indonesia &#8599;
          </a>
        }
        className="mb-8 md:mb-10"
      />

      {/* Toggle */}
      <div
        role="tablist"
        aria-label="Select volcano"
        className="mb-8 inline-flex items-center gap-1 rounded-full border border-jvto-border bg-white p-1.5 shadow-jvto-soft"
      >
        {VOLCANOES.map((v) => {
          const selected = activeId === v.id;
          return (
            <button
              key={v.id}
              id={`volcano-tab-${v.id}`}
              ref={(el) => {
                tabRefs.current[v.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="volcano-tabpanel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(v.id)}
              onKeyDown={onTabKeyDown}
              className={`jvto-focus min-w-[130px] rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-200 ${
                selected
                  ? "bg-jvto-navy text-white"
                  : "text-jvto-ink-soft hover:text-jvto-navy"
              }`}
            >
              {v.name}
            </button>
          );
        })}
      </div>

      {/* Readout panel */}
      <div
        id="volcano-tabpanel"
        role="tabpanel"
        aria-labelledby={`volcano-tab-${active.id}`}
        // The panel holds no focusable content, so per the ARIA tabs pattern it
        // takes tabindex=0 itself — otherwise its readout is unreachable by keyboard.
        tabIndex={0}
        className="jvto-focus jvto-topo-light relative overflow-hidden rounded-sm border border-jvto-border bg-jvto-off p-6 md:p-10"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-[11px] font-bold tracking-[0.2em] text-jvto-ink-soft uppercase">
              {active.name} · {active.elevation} · {active.regency}
            </p>
            <p className="text-sm leading-relaxed text-jvto-ink-soft md:text-base">
              {active.description}
            </p>
          </div>

          {/* Readout cluster — same two facts the section already published,
              re-set as instrument fields. No labels are invented here: every
              string still comes from the VOLCANOES record above. */}
          <div className="flex flex-shrink-0 items-center gap-8 border-t border-jvto-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ring-2 ring-jvto-navy/25 ${dot}`}
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-xs font-bold text-jvto-navy">
                  {active.level}
                </p>
                <p className="font-mono text-[10px] tracking-wider text-jvto-ink-soft uppercase">
                  {active.levelName}
                </p>
              </div>
            </div>
            <div className="text-sm font-bold">
              {active.toursOperating ? (
                <span className="text-jvto-lime-ink">&#9679; Tours operating</span>
              ) : (
                <span className="text-red-700">&#9679; Tours suspended</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
