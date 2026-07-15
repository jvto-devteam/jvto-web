"use client";

import { useState, useEffect } from "react";

// ── §01 Diff Chips ────────────────────────────────────────────────

const DIFF_DATA = [
  { num: "01", label: "Police-led", title: "Police-Led Safety Authority", text: "Our founder is an active officer in Ditpamobvit — the directorate securing vital objects including Ijen Crater. No other East Java operator is led by an active Tourist Police officer.", proof: "SPRIN documents + independent press" },
  { num: "02", label: "100% private", title: "100% Private Tours", text: "A dedicated vehicle, driver, and guide assigned to your group only. No shared groups, no mixed itineraries, no timing compromises.", proof: "NIB + TDUP, OSS-verifiable" },
  { num: "03", label: "All-inclusive", title: "All-Inclusive Clarity", text: "Transport, accommodation, permits, water and safety gear written into the price. If it is not on the E-Voucher, it is not included.", proof: "Inclusions & Exclusions Policy" },
  { num: "04", label: "Ijen screening", title: "Ijen Health-Screening", text: "A health certificate is mandatory for every Ijen guest (BBKSDA SE.1658/KSA.9/2024). We coordinate a QR-verified surat sehat through an SIP-licensed doctor — scannable at the crater gate.", proof: "BBKSDA SE.1658/KSA.9/2024" },
  { num: "05", label: "Licenses", title: "Verifiable Licenses", text: "NIB, TDUP, HPWKI-credentialed guides, BBKSDA clearance, ISIC provider and ecotourism alignment — a proof library, not a logo wall.", proof: "Proof · /verify-jvto/legal" },
  { num: "06", label: "Plan B", title: "Plan B Framework", text: "Documented alternative routes activated when a site closes or conditions change — a written SOP published before you book.", proof: "Travel Guide, pre-booking" },
] as const;

export function DiffChipsPanel() {
  const [active, setActive] = useState(0);
  const d = DIFF_DATA[active];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        {DIFF_DATA.map((item, i) => (
          <button
            key={item.num}
            onClick={() => setActive(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-colors cursor-pointer ${
              i === active
                ? "bg-jvto-orange text-white border-jvto-orange"
                : "bg-white border-[#E3E0DA] text-jvto-navy hover:border-jvto-orange/50"
            }`}
          >
            <span className={`text-[10px] font-mono ${i === active ? "text-white/70" : "text-[#9ca3af]"}`}>{item.num}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="bg-[#F6F5F2] rounded-[16px] p-5 mb-5">
        <h4
          className="font-black text-jvto-navy text-[16px] mb-2 leading-snug"
          style={{ fontFamily: "Raleway, Inter, sans-serif" }}
        >
          {d.title}
        </h4>
        <p className="text-[13px] text-[#6b7280] font-light leading-relaxed mb-3">{d.text}</p>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-jvto-orange">
          Proof · {d.proof}
        </span>
      </div>
    </>
  );
}

// ── §02 Quote Rotator ─────────────────────────────────────────────

const QUOTES: [string, string][] = [
  ["I don't think there is a better tour guide anywhere than Anjas — head and shoulders above the rest.", "John Joyce · Trustpilot · guide Anjas"],
  ["Being a solo traveler it was safe and stress free with JVTO.", "Karthika TS · Trustpilot"],
  ["When we went down the steep crater, he held our hands to prevent us from falling.", "Wing Shan Lui · Google · guide Rendi"],
  ["One of our friends was injured and they helped him as well. Fantastic planning.", "Jiang Tianjian · Trustpilot"],
  ["Our driver Yandi was really reliable and friendly. He briefed us on what to expect.", "Divya_Stri · Trustpilot · driver Yandi"],
];

export function QuoteRotator() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % QUOTES.length);
        setVisible(true);
      }, 250);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const [text, who] = QUOTES[active];

  return (
    <div className="bg-jvto-navy rounded-[16px] p-5 mb-5 relative overflow-hidden">
      <div className="text-white/20 text-[48px] font-black leading-none mb-1 select-none" aria-hidden="true">&ldquo;</div>
      <p
        className="text-white text-[14px] font-light leading-relaxed italic mb-3 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {text}
      </p>
      <footer
        className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-jvto-orange transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {who}
      </footer>
      <div className="absolute right-5 bottom-4 flex gap-1.5">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="w-1.5 h-1.5 rounded-full transition-colors cursor-pointer"
            style={{ background: i === active ? "#E8650A" : "rgba(255,255,255,0.25)" }}
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── §05 Standards Accordion ───────────────────────────────────────

const STANDARDS_DATA = [
  { q: "We don't operate shared groups", a: "Every tour is private to your booking — a dedicated vehicle, driver, and guide for your group alone." },
  { q: "We don't make verbal promises", a: "The E-Voucher is the binding document. If it is not on the voucher, it is not included." },
  { q: "We don't guarantee natural phenomena", a: "Blue Fire depends on weather and gas activity. We plan around the viewing window — we don't promise outcomes we can't control." },
  { q: "We don't source crew from marketplaces", a: "Every guide and driver is a named, registered team member recruited from local communities — aligned with national ecotourism principles (INDECON)." },
] as const;

export function StandardsAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2 mb-6">
      {STANDARDS_DATA.map(({ q, a }, i) => (
        <div key={q} className="bg-white border border-[#E3E0DA] rounded-[14px] overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-3 p-5 text-left cursor-pointer"
            aria-expanded={open === i}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-jvto-orange flex items-center justify-center flex-shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5 text-jvto-orange" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span className="font-semibold text-jvto-navy text-[14px] flex-1 text-left">{q}</span>
          </button>
          {open === i && (
            <div className="px-5 pb-5 pl-[52px]">
              <p className="text-[13px] text-[#6b7280] font-light leading-relaxed">{a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── §03 Story Tabs ────────────────────────────────────────────────

const STORY_TABS_DATA = [
  { year: "'15", label: "Homestay", title: "The Guesthouse", text: "Mr. Sam opens the Ijen Bondowoso Homestay on Jl. Khairil Anwar No.102 — the same address JVTO operates from today. Booking.com guests rate the property 9.4 / 10." },
  { year: "'16", label: "PT formed", title: "PT Java Volcano Rendezvous", text: "The company is incorporated on 2016-01-01. Stefan Loose Reiseführer Indonesien (4th Ed., 2018) names “Agung” as operator at the same address — an independent German guidebook." },
  { year: "'23", label: "TDUP", title: "TDUP Formalization", text: "The Tourism Business Permit is formalized, completing the regulatory chain. NIB 1102230032918 is OSS-verifiable through Indonesia’s government system." },
] as const;

export function StoryTabsPanel() {
  const [active, setActive] = useState(0);
  const tab = STORY_TABS_DATA[active];

  return (
    <>
      <div className="flex gap-2 mb-5">
        {STORY_TABS_DATA.map((t, i) => (
          <button
            key={t.year}
            onClick={() => setActive(i)}
            className={`px-3.5 py-2 rounded-full text-center min-w-[72px] transition-colors cursor-pointer ${
              i === active ? "bg-jvto-orange text-white" : "bg-white/10 text-white/50 hover:text-white/70"
            }`}
          >
            <div className="font-black text-[13px] leading-tight">{t.year}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">{t.label}</div>
          </button>
        ))}
      </div>
      <div className="bg-white/[0.06] rounded-[14px] p-5">
        <h4
          className="font-black text-white text-[15px] mb-2"
          style={{ fontFamily: "Raleway, Inter, sans-serif" }}
        >
          {tab.title}
        </h4>
        <p className="text-white/65 text-[13px] leading-relaxed">{tab.text}</p>
      </div>
    </>
  );
}
