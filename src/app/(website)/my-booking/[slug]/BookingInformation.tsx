"use client";

import { useState } from "react";
import { HelpCircle, Backpack, CheckSquare } from "lucide-react";

interface Props {
  faq: Record<string, Record<string, string>>;
  packing: Record<string, string[]>;
  mediaLink?: string | null; // kept for API compatibility, no longer used here
}

export default function BookingInformation({ faq, packing, mediaLink }: Props) {
  const [activeTab, setActiveTab] = useState<"faq" | "packing">("faq");

  return (
    <div className="space-y-8">
      
      {/* 1. TABS SECTION (FAQ & PACKING) */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab("faq")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === "faq" ? "bg-slate-50 text-jvto-lime-ink border-b-2 border-jvto-lime" : "text-slate-400 hover:text-slate-600"
                }`}
            >
                <HelpCircle size={18} /> Information & FAQ
            </button>
            <button 
                onClick={() => setActiveTab("packing")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === "packing" ? "bg-slate-50 text-jvto-lime-ink border-b-2 border-jvto-lime" : "text-slate-400 hover:text-slate-600"
                }`}
            >
                <Backpack size={18} /> Packing List
            </button>
        </div>

        <div className="p-6">
            {activeTab === "faq" && (
                <div className="space-y-6">
                    {Object.entries(faq).map(([category, questions], idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-widest">{category}</h4>
                            <div className="space-y-4">
                                {Object.entries(questions).map(([q, a], i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-sm">
                                        <p className="font-bold text-slate-800 text-sm mb-1">{q}</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "packing" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(packing).map(([category, items], idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded-sm border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckSquare size={16} className="text-jvto-lime"/> {category}
                            </h4>
                            <ul className="space-y-2">
                                {items.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

    </div>
  );
}