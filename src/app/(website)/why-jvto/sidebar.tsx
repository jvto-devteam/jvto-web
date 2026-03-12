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
}

const WHY_MENU = [
  { href: "/why-jvto", label: "Why JVTO", icon: Sparkles },
  {
    href: "/why-jvto/our-story",
    label: "Our Story",
    icon: BookOpen,
  },
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

export default function SidebarWhy({ isMobile, onBack }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isMobile
          ? "w-full h-full bg-white"
          : "w-72 hidden md:block h-screen sticky top-[120px] bg-white border-r border-gray-200 overflow-y-auto p-4 pr-0 flex-shrink-0"
      }`}
    >
      {isMobile && (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-jvto-dark" />
          </button>
          <span className="font-bold text-lg uppercase tracking-wider text-jvto-dark">
            Why JVTO Menu
          </span>
        </div>
      )}

      <nav className="space-y-1">
        {WHY_MENU.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 md:py-2 text-[15px] md:text-[14px] font-medium transition-all  ${
                isActive
                  ? "text-black bg-black/10 border-l-4 border-black/70 -ml-4 pl-8"
                  : "text-gray-600 hover:bg-gray-50 pl-4"
              }`}
            >
              <item.icon
                size={18}
                className={isActive ? "text-black" : "text-gray-500"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
