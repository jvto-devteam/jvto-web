"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function LPFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-jvto-dark text-sm md:text-base pr-4">
              {item.question}
            </span>
            <ChevronDown
              size={20}
              className={`flex-shrink-0 text-jvto-green transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-96" : "max-h-0"
            }`}
          >
            <p className="px-6 pb-5 text-gray-600 leading-relaxed text-sm md:text-base">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
