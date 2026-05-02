"use client";

import { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  Compass,
  MessageCircle,
  User,
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  HelpCircle,
} from "lucide-react";

// ── Stub DrawerContext (no-op: drawer removed) ───────────────────────────────
export const DrawerContext = createContext<{ open: () => void; close: () => void }>(
  { open: () => {}, close: () => {} }
);
export const useDrawer = () => useContext(DrawerContext);

// ── Booking tab context ───────────────────────────────────────────────────────
export type BookingTab = "overview" | "itinerary" | "crew" | "payment" | "info";
export const BookingTabContext = createContext<{
  activeTab: BookingTab;
  setActiveTab: (t: BookingTab) => void;
}>({ activeTab: "overview", setActiveTab: () => {} });
export const useBookingTab = () => useContext(BookingTabContext);

// ── Tab configs ───────────────────────────────────────────────────────────────
const BOOKING_TABS: { id: BookingTab; label: string; Icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",  Icon: LayoutDashboard },
  { id: "itinerary", label: "Itinerary", Icon: CalendarDays },
  { id: "crew",      label: "Crew",      Icon: Users },
  { id: "payment",   label: "Payment",   Icon: Wallet },
  { id: "info",      label: "Info",      Icon: HelpCircle },
];

const LIST_TABS = [
  { label: "My Trips", Icon: BookOpen,      href: "/my-booking", matchPrefix: "/my-booking" },
  { label: "Explore",  Icon: Compass,       href: "/tours",      matchPrefix: "/tours" },
  { label: "Help",     Icon: MessageCircle, href: "https://wa.me/6282244788833", external: true },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function MobileBookingNav({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<BookingTab>("overview");
  const pathname = usePathname();

  const isDetailPage =
    pathname.startsWith("/my-booking/") && pathname !== "/my-booking";

  return (
    <DrawerContext.Provider value={{ open: () => {}, close: () => {} }}>
      <BookingTabContext.Provider value={{ activeTab, setActiveTab }}>
        {children}

        {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
          <div className="flex items-stretch max-w-lg mx-auto">

            {isDetailPage ? (
              /* ── detail page: 5 booking section tabs ── */
              BOOKING_TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-colors ${
                      active ? "text-jvto-green" : "text-gray-400"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-0 inset-x-2 h-0.5 bg-jvto-green rounded-full" />
                    )}
                    <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[9.5px] font-semibold tracking-wide">{label}</span>
                  </button>
                );
              })
            ) : (
              /* ── list page: nav tabs + account ── */
              <>
                {LIST_TABS.map((tab) => {
                  if (tab.external) {
                    return (
                      <a
                        key={tab.label}
                        href={tab.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-gray-400"
                      >
                        <tab.Icon size={19} strokeWidth={1.8} />
                        <span className="text-[9.5px] font-semibold tracking-wide">{tab.label}</span>
                      </a>
                    );
                  }
                  const isMine = tab.href === "/my-booking";
                  const isActive = isMine
                    ? pathname === "/my-booking"
                    : !!tab.matchPrefix && pathname.startsWith(tab.matchPrefix);

                  return (
                    <Link
                      key={tab.label}
                      href={tab.href}
                      className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 relative transition-colors ${
                        isActive ? "text-jvto-green" : "text-gray-400"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-0 inset-x-2 h-0.5 bg-jvto-green rounded-full" />
                      )}
                      <tab.Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                      <span className="text-[9.5px] font-semibold tracking-wide">{tab.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-gray-400"
                >
                  <User size={19} strokeWidth={1.8} />
                  <span className="text-[9.5px] font-semibold tracking-wide">Sign Out</span>
                </button>
              </>
            )}

          </div>
        </nav>
      </BookingTabContext.Provider>
    </DrawerContext.Provider>
  );
}
