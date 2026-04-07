"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

function getTitle(pathname: string): string {
  if (pathname === "/cms") return "CMS Dashboard";
  if (pathname.startsWith("/cms/faq")) return "FAQ Management";
  if (pathname.startsWith("/cms/verify-config")) return "Verify Configuration";
  if (pathname.startsWith("/cms/collections/content-pages")) return "Content Pages";
  if (pathname.startsWith("/cms/collections/blog-manager")) return "Blog Posts";
  if (pathname.startsWith("/cms/collections/faq-manager")) return "FAQ Manager";

  // ⬇️ Tambahan: judul untuk Global Singletons + subhalaman
  if (pathname.startsWith("/cms/global-singletons")) {
    const seg = pathname.split("/")[3] || "";
    if (seg === "site-identity") return "Global Singletons · Site Identity";
    if (seg === "global-seo") return "Global Singletons · Global SEO";
    if (seg === "navigation") return "Global Singletons · Navigation Settings";
    return "Global Singletons";
  }

  return "CMS";
}

export default function CmsTopbar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center px-4 md:px-6 gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-slate-500">Control Panel</span>
        <h1 className="text-sm font-semibold text-slate-100">
          {title}
        </h1>
      </div>

      <div className="flex-1 flex justify-end items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400 w-56">
          <Search className="h-3.5 w-3.5 mr-2 text-slate-600" />
          <input
            placeholder="Search in CMS..."
            className="bg-transparent outline-none flex-1 placeholder:text-slate-600 text-slate-200"
          />
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-slate-100">
              Admin User
            </div>
            <div className="text-[10px] text-slate-500">
              cms@yourdomain.com
            </div>
          </div>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-[10px] flex items-center justify-center text-slate-950 font-semibold">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
