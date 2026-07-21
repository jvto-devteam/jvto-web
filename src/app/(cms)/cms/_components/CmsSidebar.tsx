"use client";

import Link from "@/components/website/AppLink";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
  LayoutDashboard,
  Globe,
  FolderTree,
  Package,
  MapPin,
  Shield,
  Newspaper,
  Image as ImageIcon,
  LayoutTemplate,
  Layers,
  Megaphone,
} from "lucide-react";

type NavChild = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: NavChild[];
};

// Menu rewritten to reality (2026-07-21): removed dead 404 links (whatsapp,
// activities, travel-guides, isic-offerings, team-members, partnerships, ui-blocks),
// the dead redirect stubs (faq-manager, blog-manager) now point at the REAL editors
// (/cms/faq, /cms/blog), and the fake in-memory singletons (global-seo, navigation)
// are dropped — only the persisted Site Identity remains. Every link below resolves.
const navItems: NavItem[] = [
  {
    href: "/cms",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  // Website SSOT — Route Content Console (per-page breakdown + block editor)
  {
    href: "/cms/pages",
    label: "Pages (SSOT)",
    icon: Layers,
  },
  // Only real, persisted singleton (global-seo / navigation were in-memory stubs)
  {
    href: "/cms/global-singletons/site-identity",
    label: "Site Identity",
    icon: Globe,
  },
  {
    // No /cms/collections index page exists — point the group header at its first
    // real child so it never 404s.
    href: "/cms/collections/content-pages",
    label: "Core Collections",
    icon: FolderTree,
    children: [
      {
        href: "/cms/collections/content-pages",
        label: "Content Pages",
        icon: LayoutTemplate,
      },
      {
        href: "/cms/collections/narrative-claims",
        label: "Narrative Claims",
        icon: Megaphone,
      },
      {
        href: "/cms/tour-packages",
        label: "Tour Packages",
        icon: Package,
      },
      {
        href: "/cms/destinations",
        label: "Destinations",
        icon: MapPin,
      },
      {
        href: "/cms/collections/policy-documents",
        label: "Policy Documents",
        icon: Shield,
      },
      {
        // Real FAQ editor (the /cms/collections/faq-manager stub just redirects here).
        href: "/cms/faq",
        label: "FAQ Items",
        icon: HelpCircle,
      },
      {
        // Real blog editor (the /cms/collections/blog-manager stub just redirects here).
        href: "/cms/blog",
        label: "Blog / Insight Posts",
        icon: Newspaper,
      },
      {
        href: "/cms/assets",
        label: "Media Assets",
        icon: ImageIcon,
      },
    ],
  },
];

export default function CmsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex md:flex-col w-64 h-full overflow-y-auto flex-shrink-0 border-r border-slate-800 bg-slate-950/95 backdrop-blur nice-scrollbar"
      style={{ scrollbarGutter: "stable" }}
    >
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
          const parentActive =
            pathname === item.href ||
            (item.href !== "/cms" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <div key={item.href} className="space-y-1">
              {/* Parent link */}
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                  parentActive
                    ? "bg-slate-800/80 text-slate-50 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80",
                ].join(" ")}
              >
                <Icon
                  className={
                    "h-4 w-4 flex-shrink-0 " +
                    (parentActive
                      ? "text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-200")
                  }
                />
                <span className="truncate">{item.label}</span>
                {parentActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>

              {/* Children (submenu) */}
              {item.children && (
                <div
                  className={[
                    "ml-7 pl-2 border-l border-slate-800/60 space-y-1",
                    parentActive ? "block" : "hidden md:block",
                  ].join(" ")}
                >
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={[
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-all",
                          childActive
                            ? "bg-slate-800/70 text-slate-50"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60",
                        ].join(" ")}
                      >
                        <ChildIcon
                          className={
                            "h-3.5 w-3.5 " +
                            (childActive
                              ? "text-emerald-400"
                              : "text-slate-500")
                          }
                        />
                        <span className="truncate">{child.label}</span>
                        {childActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500">
        Logged in as <span className="text-slate-300 font-medium">Admin</span>
      </div>
    </aside>
  );
}
