"use client";

// src/app/(website)/why-jvto/HubInteractive.tsx
// Client islands for the /why-jvto hub page — small interactive widgets
// (chip selector, quote rotator, timeline tabs, accordion). The parent
// page.tsx stays a Server Component per the server/client split rule;
// only these self-contained UI islands need "use client".
//
// PACKAGE 05c (2026-08-04): all narrative data (differentiators, guest
// quotes, story milestones, standards) moved to
// content/pages/why-jvto/index.json — these components receive it as props
// and keep only layout, styling, the icon map, and interaction state.
// TSX must not carry company claims (owner directive: content/ is the only
// public-narrative source for migrated routes).
import { useState } from "react";
import {
  ShieldCheck,
  Car,
  PackageCheck,
  Stethoscope,
  FileCheck2,
  RadioTower,
  type LucideIcon,
} from "lucide-react";

export type DiffItem = {
  key: string;
  label: string;
  title: string;
  text: string;
  cred: string;
};
export type QuoteItem = { text: string; attribution: string };
export type StoryTab = { tab: string; title: string; body: string };
export type StandardItem = { heading: string; body: string };

// ─────────────────────────────────────────────
// 01 · Difference chips
// ─────────────────────────────────────────────

/** Design-side icon mapping — keyed by the content item's `key` (not narrative). */
const DIFF_ICONS: Record<string, LucideIcon> = {
  "police-led": ShieldCheck,
  private: Car,
  "all-inclusive": PackageCheck,
  screening: Stethoscope,
  licenses: FileCheck2,
  "plan-b": RadioTower,
};

export function DifferenceChips({ items }: { items: DiffItem[] }) {
  const [active, setActive] = useState(0);
  const d = items[active];
  if (!d) return null;
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {items.map((item, i) => {
          const Icon = DIFF_ICONS[item.key] ?? ShieldCheck;
          const isActive = i === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(i)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--jw-font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "9px 14px",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: isActive ? "#0D1B2A" : "#E3E0DA",
                background: isActive ? "#0D1B2A" : "#fff",
                color: isActive ? "#fff" : "#6B7280",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              <Icon size={13} color={isActive ? "#8CC63F" : "#E8650A"} />
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="jw-cred" key={active}>
        <span className="jw-cred-label">{d.title}</span>
        <span className="jw-cred-text" style={{ fontFamily: "inherit", fontSize: "0.9rem", color: "#0D1B2A" }}>
          {d.text}
        </span>
        <span className="jw-cred-label" style={{ marginTop: "0.5rem" }}>
          {d.cred}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 02 · Review quote rotator
// ─────────────────────────────────────────────

export function ReviewQuoteRotator({ quotes }: { quotes: QuoteItem[] }) {
  const [i, setI] = useState(0);
  const q = quotes[i];
  if (!q) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E3E0DA",
        borderRadius: "18px",
        padding: "1.5rem 1.75rem",
        boxShadow: "var(--jw-shadow-soft)",
        minHeight: "150px",
        position: "relative",
      }}
    >
      <div style={{ fontFamily: "var(--jw-font-display)", fontSize: "44px", lineHeight: 0.6, color: "#E8650A" }}>
        &ldquo;
      </div>
      <p
        key={i}
        style={{
          fontFamily: "var(--jw-font-display)",
          fontStyle: "italic",
          fontSize: "17px",
          lineHeight: 1.4,
          color: "#0D1B2A",
          margin: "0.4rem 0 0.75rem",
        }}
      >
        {q.text}
      </p>
      <div className="jw-micro">{q.attribution}</div>
      <div style={{ display: "flex", gap: "5px", marginTop: "1rem" }}>
        {quotes.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show quote ${idx + 1}`}
            onClick={() => setI(idx)}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              border: 0,
              padding: 0,
              cursor: "pointer",
              background: idx === i ? "#E8650A" : "#E3E0DA",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 03 · Story timeline tabs
// ─────────────────────────────────────────────

export function StoryTimelineTabs({ tabs }: { tabs: StoryTab[] }) {
  const [i, setI] = useState(0);
  const activeTab = tabs[i];
  if (!activeTab) return null;
  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {tabs.map((d, idx) => {
          const isActive = idx === i;
          return (
            <button
              key={d.tab}
              type="button"
              onClick={() => setI(idx)}
              style={{
                flex: 1,
                background: isActive ? "#E8650A" : "transparent",
                border: "1px solid",
                borderColor: isActive ? "#E8650A" : "rgba(255,255,255,0.18)",
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                borderRadius: "12px",
                padding: "0.85rem",
                cursor: "pointer",
                textAlign: "center",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--jw-font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {d.tab}
              </div>
              <span
                style={{
                  fontFamily: "var(--jw-font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                  display: "block",
                }}
              >
                {d.title}
              </span>
            </button>
          );
        })}
      </div>
      <div
        key={i}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          padding: "1.5rem 1.75rem",
          minHeight: "120px",
        }}
      >
        <h4 style={{ fontFamily: "var(--jw-font-display)", color: "#fff", fontSize: "20px", margin: "0 0 0.5rem", letterSpacing: "-0.01em" }}>
          {activeTab.title}
        </h4>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "15px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
          {activeTab.body}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 05 · Standards accordion
// ─────────────────────────────────────────────

export function StandardsAccordion({ items }: { items: StandardItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: "1px solid #E3E0DA" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.heading} style={{ borderBottom: "1px solid #E3E0DA" }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: "100%",
                background: "none",
                border: 0,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.1rem 0",
                cursor: "pointer",
                fontFamily: "var(--jw-font-display)",
                fontSize: "17px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0D1B2A",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "rgba(232,101,10,0.1)",
                  color: "#E8650A",
                  display: "grid",
                  placeItems: "center",
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition: "transform .3s",
                }}
              >
                +
              </span>
              {item.heading}
            </button>
            {isOpen && (
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "14.5px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  padding: "0 0 1.2rem 2.6rem",
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
