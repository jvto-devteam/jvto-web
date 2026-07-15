"use client";

import { useState } from "react";
import Link from "@/components/website/AppLink";

type ProofCard = {
  readonly icon: string;
  readonly h3: string;
  readonly p: string;
  readonly meta: string;
  readonly href: string;
};

const CATEGORIES = ["All", "Legal", "Press", "History", "Safety", "Reviews"] as const;

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#8CC63F]" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#8CC63F]" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export function VerifyProofGrid({ cards }: { cards: readonly ProofCard[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? cards
      : cards.filter((card) => card.meta.startsWith(activeFilter + " ·"));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
              activeFilter === cat
                ? "bg-[#8CC63F] text-white"
                : "bg-white/[0.06] text-white/50 border border-white/10 hover:text-white/70 hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(({ icon, h3, p, meta, href }) => (
          <Link
            key={h3}
            href={href}
            prefetch={false}
            className="bg-white/[0.04] border border-white/10 rounded-[16px] overflow-hidden hover:border-white/20 transition-colors group block"
          >
            <div className="bg-white/[0.03] h-24 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
                  backgroundSize: "8px 8px",
                }}
              />
            </div>
            <div className="p-5">
              {icon === "shield" ? <ShieldIcon /> : <DocIcon />}
              <h3 className="text-white font-bold text-[15px] mt-3 mb-2 leading-snug">{h3}</h3>
              <p className="text-white/50 text-[13px] leading-relaxed font-light mb-4">{p}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/35 uppercase tracking-[0.14em]">{meta}</span>
                <span className="font-mono text-[10px] font-bold text-[#8CC63F]">Open →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
