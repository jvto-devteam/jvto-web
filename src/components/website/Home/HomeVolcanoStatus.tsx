"use client";

import { useState } from "react";

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
      "Standard activity per PVMBG. When BBKSDA access rules require it, JVTO coordinates pre-ascent health screening before crater descent.",
    toursOperating: true,
  },
];

export default function HomeVolcanoStatus() {
  const [activeId, setActiveId] = useState<VolcanoEntry["id"]>("bromo");
  const active = VOLCANOES.find((v) => v.id === activeId) ?? VOLCANOES[0];
  const accent = active.levelTone === "gold" ? "text-jvto-gold" : "text-jvto-green";
  const dot = active.levelTone === "gold" ? "bg-jvto-gold" : "bg-jvto-green";

  return (
    <section aria-labelledby="volcano-heading" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-jvto-muted mb-2">
              § 07 — Live status
            </p>
            <h2
              id="volcano-heading"
              className="font-black text-2xl md:text-3xl text-jvto-navy"
            >
              Volcano <span className="text-jvto-orange">activity.</span>
            </h2>
          </div>
          <a
            href="https://magma.esdm.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-jvto-muted hover:text-jvto-navy underline decoration-jvto-border underline-offset-4 transition-colors"
          >
            Source · PVMBG / MAGMA Indonesia &#8599;
          </a>
        </div>

        {/* Toggle */}
        <div
          role="tablist"
          aria-label="Select volcano"
          className="inline-flex items-center gap-1 rounded-full border border-jvto-border bg-white p-1.5 shadow-[var(--shadow-jvto)] mb-8"
        >
          {VOLCANOES.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={activeId === v.id}
              onClick={() => setActiveId(v.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors min-w-[130px] ${
                activeId === v.id
                  ? "bg-jvto-navy text-white"
                  : "text-jvto-muted hover:text-jvto-navy"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="rounded-sm border border-jvto-border bg-jvto-off p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-jvto-muted mb-2">
                {active.name} · {active.elevation} · {active.regency}
              </p>
              <p className="text-jvto-muted text-sm md:text-base leading-relaxed">
                {active.description}
              </p>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${dot}`} aria-hidden="true" />
                <div>
                  <p className={`font-mono text-xs font-bold ${accent}`}>{active.level}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-jvto-muted">
                    {active.levelName}
                  </p>
                </div>
              </div>
              <div className="text-sm font-bold">
                {active.toursOperating ? (
                  <span className="text-jvto-green">&#9679; Tours operating</span>
                ) : (
                  <span className="text-red-500">&#9679; Tours suspended</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
