"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  BadgeCheck,
  Star,
  Users,
  HeartHandshake,
  ArrowLeft,
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onBack?: () => void;
  activePath?: string;
}

const WHY_MENU = [
  { href: "/why-jvto", label: "Why JVTO", icon: Sparkles },
  { href: "/why-jvto/our-story", label: "Our Story", icon: BookOpen },
  {
    href: "/why-jvto/the-jvto-difference",
    label: "The JVTO Difference",
    icon: BadgeCheck,
  },
  { href: "/why-jvto/reviews", label: "Reviews", icon: Star },
  { href: "/why-jvto/our-team", label: "Our Team", icon: Users },
  {
    href: "/why-jvto/community-standards",
    label: "Community Standards",
    icon: HeartHandshake,
  },
];

export default function SidebarWhy({ isMobile, onBack, activePath }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activePath ?? pathname;

  return (
      <aside
        className={`jvto-sidebar ${
          isMobile
            ? "w-full h-full"
            : "w-64 hidden md:flex flex-col h-screen sticky top-[120px] border-r border-[#eef0e8] overflow-y-auto pt-6 pb-8 flex-shrink-0"
        }`}
      >
        {/* Mobile: back button */}
        {isMobile && (
          <div className="sidebar-back-btn px-4 pt-5">
            <button onClick={onBack} className="sidebar-back-icon-btn">
              <ArrowLeft size={16} />
            </button>
            <span className="sidebar-back-title">Why JVTO Menu</span>
          </div>
        )}

        {/* Section label */}
        {!isMobile && <div className="sidebar-section-label">Navigation</div>}

        {/* Nav items */}
        <nav className="px-2">
          {WHY_MENU.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="sidebar-link-icon">
                  <item.icon size={14} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Verify badge */}
        <Link href="/verify-jvto" className="sidebar-verify-badge">
          <span className="sidebar-verify-badge-label">◆ Quick Access</span>
          <span className="sidebar-verify-badge-text">Verify JVTO</span>
          <span className="sidebar-verify-badge-sub">
            Legal docs, licenses & proof library
          </span>
        </Link>
      </aside>
  );
}
