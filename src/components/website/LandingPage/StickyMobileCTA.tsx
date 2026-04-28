"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { pushWaEvent } from "./StickyWhatsApp";

export default function StickyMobileCTA({
  href,
  source,
  label = "Get a Free Quote",
}: {
  href: string;
  source: string;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 leading-none mb-0.5">We reply within 1 hour</p>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none truncate">
            {label}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => pushWaEvent(source)}
          className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap shadow-lg active:scale-95 transition-transform"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
