"use client";

// src/app/(website)/why-jvto/HubInteractive.tsx
// Client islands for the /why-jvto hub page — small interactive widgets
// (chip selector, quote rotator, timeline tabs, accordion) ported from the
// design-reference spec (docs/design-reference/why-jvto.html). The parent
// page.tsx stays a Server Component per the server/client split rule;
// only these self-contained UI islands need "use client".
//
// Copy here is either (a) static credential summaries matching
// docs/CANONICAL_FACTS.md, or (b) the same real, named guest quotes already
// present in the design-reference spec's why-jvto.html / why-jvto-reviews.html
// (John Joyce, Karthika TS, Wing Shan Lui, Jiang Tianjian, Divya_Stri) — not
// the fabricated animated-testimonials.js widget flagged separately in
// docs/design-reference (that file is unused by this cluster).
import { useState } from "react";
import { ShieldCheck, Car, PackageCheck, Stethoscope, FileCheck2, RadioTower } from "lucide-react";

// ─────────────────────────────────────────────
// 01 · Difference chips
// ─────────────────────────────────────────────

const DIFF_DATA = [
  {
    label: "Police-led",
    icon: ShieldCheck,
    title: "Police-Led Safety Authority",
    text: "Our founder is an active officer in Ditpamobvit — the directorate securing vital objects including Ijen Crater. No other East Java operator is led by an active Tourist Police officer.",
    cred: "Proof · SPRIN documents + independent press",
  },
  {
    label: "100% private",
    icon: Car,
    title: "100% Private Tours",
    text: "A dedicated vehicle, driver, and guide assigned to your group only. No shared groups, no mixed itineraries, no timing compromises.",
    cred: "Proof · NIB + TDUP, OSS-verifiable",
  },
  {
    label: "All-inclusive",
    icon: PackageCheck,
    title: "All-Inclusive Clarity",
    text: "Transport, accommodation, permits, water and safety gear written into the price. If it is not on the E-Voucher, it is not included.",
    cred: "Proof · Inclusions & Exclusions Policy",
  },
  {
    label: "Ijen screening",
    icon: Stethoscope,
    title: "Ijen Health-Screening",
    text: "Mandatory for every guest under BBKSDA SE.1658/KSA.9/2024 — we coordinate a QR-verified surat sehat through an SIP-licensed doctor, scannable at the crater gate.",
    cred: "Proof · BBKSDA SE.1658/KSA.9/2024",
  },
  {
    label: "Licenses",
    icon: FileCheck2,
    title: "Verifiable Licenses",
    text: "NIB, TDUP, HPWKI-credentialed guides, BBKSDA clearance, ISIC provider and ecotourism alignment — a proof library, not a logo wall.",
    cred: "Proof · /verify-jvto/legal",
  },
  {
    label: "Plan B",
    icon: RadioTower,
    title: "Plan B Framework",
    text: "Documented alternative routes activated when a site closes or conditions change — a written SOP published before you book.",
    cred: "Proof · Travel Guide, pre-booking",
  },
];

export function DifferenceChips() {
  const [active, setActive] = useState(0);
  const d = DIFF_DATA[active];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {DIFF_DATA.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === active;
          return (
            <button
              key={item.label}
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

const QUOTES: Array<[string, string]> = [
  [
    "I don't think there is a better tour guide anywhere than Anjas — head and shoulders above the rest.",
    "John Joyce · Trustpilot · guide Anjas",
  ],
  ["Being a solo traveler it was safe and stress free with JVTO.", "Karthika TS · Trustpilot"],
  [
    "When we went down the steep crater, he held our hands to prevent us from falling.",
    "Wing Shan Lui · Google · guide Rendi",
  ],
  [
    "One of our friends was injured and they helped him as well. Fantastic planning.",
    "Jiang Tianjian · Trustpilot",
  ],
  [
    "Our driver Yandi was really reliable and friendly. He briefed us on what to expect.",
    "Divya_Stri · Trustpilot · driver Yandi",
  ],
];

export function ReviewQuoteRotator() {
  const [i, setI] = useState(0);
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
        {QUOTES[i][0]}
      </p>
      <div className="jw-micro">{QUOTES[i][1]}</div>
      <div style={{ display: "flex", gap: "5px", marginTop: "1rem" }}>
        {QUOTES.map((_, idx) => (
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
// Fact-corrected: docs/CANONICAL_FACTS.md forbids inventing a PT
// incorporation year (2016/2019/2020/2023). The design-reference spec's
// middle tab ("'16 · PT formed", "incorporated on 2016-01-01") is dropped —
// the legal entity is named only in the 2023 TDUP-formalization context,
// with no fabricated incorporation date, matching the already-published
// adjudication in the (unused) why-jvto/our-story/"page copy.tsx" reference
// and src/lib/schemas/entityGraph.ts.
// ─────────────────────────────────────────────

const STORY_DATA: Array<[string, string, string]> = [
  [
    "'15",
    "The Guesthouse",
    "Mr. Sam opens the Ijen Bondowoso Homestay on Jl. Khairil Anwar No.102 — the same address JVTO operates from today. Booking.com guests rate the property 9.4 / 10.",
  ],
  [
    "Legal",
    "PT Java Volcano Rendezvous",
    "The guesthouse grows into PT Java Volcano Rendezvous — the licensed legal entity behind JVTO today, verifiable via NIB 1102230032918.",
  ],
  [
    "'23",
    "TDUP Formalization",
    "The Tourism Business Permit is formalized, completing the regulatory chain. NIB 1102230032918 is OSS-verifiable through Indonesia's government system.",
  ],
];

export function StoryTimelineTabs() {
  const [i, setI] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {STORY_DATA.map((d, idx) => {
          const isActive = idx === i;
          return (
            <button
              key={d[0]}
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
                {d[0]}
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
                {d[1]}
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
          {STORY_DATA[i][1]}
        </h4>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "15px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
          {STORY_DATA[i][2]}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 05 · Standards accordion
// ─────────────────────────────────────────────

const STANDARDS: Array<[string, string]> = [
  [
    "We don't operate shared groups",
    "Every tour is private to your booking — a dedicated vehicle, driver, and guide for your group alone.",
  ],
  [
    "We don't make verbal promises",
    "The E-Voucher is the binding document. If it is not on the voucher, it is not included.",
  ],
  [
    "We don't guarantee natural phenomena",
    "Blue Fire is a natural phenomenon subject to weather and gas activity — it cannot be guaranteed. We plan around the viewing window; we don't promise outcomes we can't control.",
  ],
  [
    "We don't source crew from marketplaces",
    "Every guide and driver is a named, registered team member recruited from local communities — aligned with national ecotourism principles (INDECON).",
  ],
];

export function StandardsAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderTop: "1px solid #E3E0DA" }}>
      {STANDARDS.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div key={q} style={{ borderBottom: "1px solid #E3E0DA" }}>
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
              {q}
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
                {a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
