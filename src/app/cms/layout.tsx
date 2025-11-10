import type { ReactNode } from "react";
import CmsSidebar from "./_components/CmsSidebar";
import CmsTopbar from "./_components/CmsTopbar";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <CmsSidebar />
      <div className="flex flex-1 flex-col">
        <CmsTopbar />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-slate-900/40">
          <div className="mx-auto max-w-6xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
