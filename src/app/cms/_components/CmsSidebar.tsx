"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ShieldCheck, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    href: "/cms",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/cms/faq",
    label: "FAQ Management",
    icon: HelpCircle,
  },
  {
    href: "/cms/verify-config",
    label: "Verify Config",
    icon: ShieldCheck,
  },
];

export default function CmsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-800 bg-slate-950/95 backdrop-blur">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Internal CMS
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-100">
          Volcano Admin
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/cms" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                active
                  ? "bg-slate-800/80 text-slate-50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80",
              ].join(" ")}
            >
              <Icon
                className={
                  "h-4 w-4 flex-shrink-0 " +
                  (active
                    ? "text-emerald-400"
                    : "text-slate-500 group-hover:text-slate-200")
                }
              />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500">
        Logged in as{" "}
        <span className="text-slate-300 font-medium">
          Admin
        </span>
      </div>
    </aside>
  );
}
