"use client";

import { useState } from "react";
import { HelpCircle, Backpack, CheckSquare, Camera, Star, ExternalLink } from "lucide-react";

interface Props {
  faq: Record<string, Record<string, string>>;
  packing: Record<string, string[]>;
  mediaLink?: string | null;
}

export default function BookingInformation({ faq, packing, mediaLink }: Props) {
  const [activeTab, setActiveTab] = useState<"faq" | "packing">("faq");

  return (
    <div className="space-y-8">
      
      {/* 1. TABS SECTION (FAQ & PACKING) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab("faq")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === "faq" ? "bg-slate-50 text-lime-600 border-b-2 border-lime-500" : "text-slate-400 hover:text-slate-600"
                }`}
            >
                <HelpCircle size={18} /> Information & FAQ
            </button>
            <button 
                onClick={() => setActiveTab("packing")}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    activeTab === "packing" ? "bg-slate-50 text-lime-600 border-b-2 border-lime-500" : "text-slate-400 hover:text-slate-600"
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
                            <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-widest border-l-4 border-lime-400 pl-3">{category}</h4>
                            <div className="space-y-4">
                                {Object.entries(questions).map(([q, a], i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-xl">
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
                        <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckSquare size={16} className="text-lime-600"/> {category}
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

      {/* 2. REVIEWS & MEDIA SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Trip Media */}
          <a href={mediaLink || "#"} target="_blank" className="group bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-2xl p-6 text-center transition-all cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 group-hover:bg-white text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Camera size={24} />
              </div>
              <h4 className="font-bold text-orange-800 mb-1">Your Trip Media</h4>
              <p className="text-xs text-orange-600/80">Download photos & videos</p>
          </a>

          {/* Trustpilot */}
          <a href="https://www.trustpilot.com/review/javavolcano-touroperator.com" target="_blank" className="group bg-green-50 hover:bg-green-100 border border-green-100 rounded-2xl p-6 text-center transition-all cursor-pointer">
              <div className="w-12 h-12 bg-green-100 group-hover:bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Star size={24} />
              </div>
              <h4 className="font-bold text-green-800 mb-1">Trustpilot Review</h4>
              <p className="text-xs text-green-600/80">Rate us on Trustpilot</p>
          </a>

          {/* Google Review */}
          <a href="https://g.page/r/Cb3i9Eu0K5MREB0/review" target="_blank" className="group bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-6 text-center transition-all cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <ExternalLink size={24} />
              </div>
              <h4 className="font-bold text-blue-800 mb-1">Google Review</h4>
              <p className="text-xs text-blue-600/80">Share your experience</p>
          </a>

      </div>

    </div>
  );
}