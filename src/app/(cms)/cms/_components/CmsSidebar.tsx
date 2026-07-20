"use client";

import Link from "@/components/website/AppLink";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
  LayoutDashboard,
  Settings,
  Globe,
  Search as SearchIcon,
  Navigation,
  FolderTree,
  Package,
  MapPin,
  Activity,
  Shield,
  BookOpen,
  Newspaper,
  GraduationCap,
  Users,
  Handshake,
  Image as ImageIcon,
  LayoutTemplate,
  MessageSquare,
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

const navItems: NavItem[] = [
  {
    href: "/cms",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/cms/whatsapp",
    label: "WhatsApp Ops",
    icon: MessageSquare,
  },
  // === Website SSOT — Route Content Console ===
  {
    href: "/cms/pages",
    label: "Pages (SSOT)",
    icon: Layers,
  },
  // === Global Singletons (sudah ada) ===
  {
    href: "/cms/global-singletons",
    label: "Global Singletons",
    icon: Settings,
    children: [
      {
        href: "/cms/global-singletons/site-identity",
        label: "Site Identity",
        icon: Globe,
      },
      {
        href: "/cms/global-singletons/global-seo",
        label: "Global SEO",
        icon: SearchIcon,
      },
      {
        href: "/cms/global-singletons/navigation",
        label: "Navigation Settings",
        icon: Navigation,
      },
    ],
  },

  // === Core Collections (Point 2.1 - 2.12) ===
  {
    href: "/cms/collections",
    label: "Core Collections",
    icon: FolderTree,
    children: [
      // Content Pages
      {
        href: "/cms/collections/content-pages",
        label: "Content Pages",
        icon: LayoutTemplate,
      },
      // Narrative Claims (highest-precedence FAQ source)
      {
        href: "/cms/collections/narrative-claims",
        label: "Narrative Claims",
        icon: Megaphone,
      },
      // 2.1 tourPackages
      {
        href: "/cms/tour-packages",
        label: "Tour Packages",
        icon: Package,
      },
      // 2.2 destinations
      {
        href: "/cms/destinations",
        label: "Destinations",
        icon: MapPin,
      },
      // 2.3 activities
      {
        href: "/cms/collections/activities",
        label: "Activities",
        icon: Activity,
      },
      // 2.4 policyDocuments
      {
        href: "/cms/collections/policy-documents",
        label: "Policy Documents",
        icon: Shield,
      },
      // 2.5 faqItems
      {
        href: "/cms/collections/faq-manager",
        label: "FAQ Items",
        icon: HelpCircle,
      },
      // 2.6 travelGuideArticles
      {
        href: "/cms/collections/travel-guides",
        label: "Travel Guide Articles",
        icon: BookOpen,
      },
      // 2.7 insightPosts
      {
        href: "/cms/collections/blog-manager",
        label: "Blog / Insight Posts",
        icon: Newspaper,
      },
      // 2.8 isicOfferings / studentDeals
      {
        href: "/cms/collections/isic-offerings",
        label: "ISIC Offerings",
        icon: GraduationCap,
      },
      // 2.9 teamMembers
      {
        href: "/cms/collections/team-members",
        label: "Team Members",
        icon: Users,
      },
      // 2.10 partnerships
      {
        href: "/cms/collections/partnerships",
        label: "Partnerships",
        icon: Handshake,
      },
      // 2.11 mediaAssets
      {
        href: "/cms/assets",
        label: "Media Assets",
        icon: ImageIcon,
      },
      // 2.12 uiBlocks / pageSections
      {
        href: "/cms/collections/ui-blocks",
        label: "UI Blocks / Page Sections",
        icon: LayoutTemplate,
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
