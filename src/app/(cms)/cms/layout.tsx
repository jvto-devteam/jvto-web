import type { ReactNode } from "react";
import CmsSidebar from "./_components/CmsSidebar";
import CmsTopbar from "./_components/CmsTopbar";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    // ⬇️ ganti min-h-screen -> h-screen, tambahkan overflow-hidden
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex">
      <CmsSidebar />
      <div className="flex flex-1 flex-col">
        <CmsTopbar />
        {/* main sudah punya overflow-y-auto, biarkan */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-slate-900/40 nice-scrollbar">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
