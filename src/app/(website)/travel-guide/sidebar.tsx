"use client";
import React from "react";
import Link from "@/components/website/AppLink";
import { usePathname } from "next/navigation";
import {
  MapPin,
  ReceiptText,
  CircleHelp,
  SlidersHorizontal,
  ShieldCheck,
  Backpack,
  CloudSun,
  ShieldAlert,
  CalendarDays,
  ArrowLeft,
  Mountain,
  Droplets,
} from "lucide-react";

// Definisikan props agar bisa dikontrol dari Navbar
interface SidebarProps {
  isMobile?: boolean;
  onBack?: () => void;
}

const MENU_ITEMS = [
  { href: "/travel-guide", label: "Travel Guide Hub", icon: MapPin },
  {
    href: "/travel-guide/booking-information",
    label: "Booking & Payments",
    icon: ReceiptText,
  },
  { href: "/travel-guide/faq", label: "FAQ", icon: CircleHelp },
  {
    href: "/travel-guide/ijen-health-screening",
    label: "Ijen Health Screening",
    icon: SlidersHorizontal,
  },
  {
    href: "/travel-guide/mount-bromo-logistics",
    label: "Mount Bromo Logistics",
    icon: Mountain,
  },
  {
    href: "/travel-guide/tumpak-sewu-logistics",
    label: "Tumpak Sewu Logistics",
    icon: Droplets,
  },
  {
    href: "/travel-guide/safety-on-tours",
    label: "Safety on Tours",
    icon: ShieldCheck,
  },
  {
    href: "/travel-guide/packing-and-fitness",
    label: "Packing & Fitness",
    icon: Backpack,
  },
  {
    href: "/travel-guide/best-time-to-visit",
    label: "Best Time to Visit",
    icon: CalendarDays,
  },
  {
    href: "/travel-guide/weather-and-closures",
    label: "Weather & Closures",
    icon: CloudSun,
  },
  {
    href: "/travel-guide/police-escort-for-groups",
    label: "Police Escort for Groups",
    icon: ShieldAlert,
  },
];

export default function Sidebar({ isMobile, onBack }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isMobile
          ? "w-full h-full bg-white"
          : "w-72 hidden md:block h-screen sticky top-[120px] bg-white border-r border-gray-200 overflow-y-auto p-4 pr-0 flex-shrink-0"
      }`}
    >
      {/* Header khusus Mobile dengan tombol Back */}
      {isMobile && (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-jvto-navy" />
          </button>
          <span className="font-bold text-lg uppercase tracking-wider text-jvto-navy">
            Travel Guide Menu
          </span>
        </div>
      )}

      <nav className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`flex items-center gap-3 px-4 py-3 md:py-2 text-[15px] md:text-[14px] font-medium transition-all ${
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
