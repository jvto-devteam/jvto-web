"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import WhySidebar from "@/components/why/WhySidebar";

export default function WhyLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto container px-4 md:py-10 py-30">
      {/* Toggle button (mobile only) */}
      <div className="px-4">
      <button
        onClick={() => setOpen(!open)}
        className="mb-4 flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium md:hidden"
      >
        {open ? "Hide Menu" : "Show Menu"}
      </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside
          className={`
            md:block
            ${open ? "block" : "hidden"}
          `}
        >
          <WhySidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 md:pt-30">
          {children}
        </main>
      </div>
    </div>
  );
}
