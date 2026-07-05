"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Menu,
  ShieldCheck,
  X,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import Link from "@/components/website/AppLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavbarSearchModal from "./NavbarSearchModal";
import TrackedContactLink from "./TrackedContactLink";
import { contactInfo } from "@/constants";
import { BRAND_EST_TAG } from "@/lib/site-config";

/** Inline WhatsApp glyph — same path as StickyWhatsApp's FAB icon, kept local to
 * avoid a cross-component import for a single small SVG. */
const NavWhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="12"
    height="12"
    aria-hidden="true"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const NavbarDesktopAuthIsland = dynamic(
  () =>
    import("./NavbarAuthClient").then((mod) => mod.NavbarDesktopAuthIsland),
  { ssr: false },
);

const NavbarMobileAuthIsland = dynamic(
  () => import("./NavbarAuthClient").then((mod) => mod.NavbarMobileAuthIsland),
  { ssr: false },
);

const SidebarTravelGuide = dynamic(
  () => import("@/app/(website)/travel-guide/sidebar"),
  { ssr: false, loading: () => null },
);

const SidebarPolicy = dynamic(() => import("@/app/(website)/policy/sidebar"), {
  ssr: false,
  loading: () => null,
});

const SidebarWhy = dynamic(() => import("@/app/(website)/why-jvto/sidebar"), {
  ssr: false,
  loading: () => null,
});

const MegaMenuLink: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, children, onClick }) => (
  <li>
    <Link
      href={to}
      prefetch={false}
      onClick={onClick}
      className="block py-2 text-sm font-medium text-gray-700 hover:text-jvto-orange transition-colors"
    >
      {children}
    </Link>
  </li>
);

const ToursDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({ left: rect.left + rect.width / 2, top: rect.bottom });
    }
    setIsDropdownOpen(true);
  };

  const handleClose = () => setIsDropdownOpen(false);
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className="flex items-center gap-1 uppercase tracking-wider font-bold text-sm hover:text-jvto-orange transition-colors whitespace-nowrap"
      >
        Tours{" "}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        style={{ left: menuStyle.left, top: menuStyle.top + 12 }}
        className={`fixed z-40 transition-all duration-200 ${
          isDropdownOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="absolute -top-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[10px] border-b-gray-200" />
        <div className="bg-white border border-jvto-border shadow-xl rounded-[24px] w-[800px] max-w-[90vw] overflow-hidden" style={{ boxShadow: 'var(--shadow-jvto-hover)' }}>
          <div className="flex">
            <div className="flex-1 p-8 grid grid-cols-2 gap-8 bg-white">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
                  Popular
                </p>
                <ul className="space-y-2">
                  <MegaMenuLink
                    to="/tours/from-surabaya/bromo-madakaripura-ijen-3d2n"
                    onClick={handleClose}
                  >
                    3 Day Bromo, Madakaripura & Ijen
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/from-surabaya/ijen-bromo-madakaripura-3d2n"
                    onClick={handleClose}
                  >
                    3 Day Ijen, Bromo, Madakaripura
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/from-surabaya/ijen-bromo-madakaripura-4d3n"
                    onClick={handleClose}
                  >
                    4 Day Ijen, Bromo, Madakaripura
                  </MegaMenuLink>
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
                  By Location
                </p>
                <ul className="space-y-2">
                  <MegaMenuLink to="/tours/from-surabaya" onClick={handleClose}>
                    Start From Surabaya
                  </MegaMenuLink>
                  <MegaMenuLink to="/tours/from-bali" onClick={handleClose}>
                    Start From Bali
                  </MegaMenuLink>
                </ul>
              </div>
            </div>
            <div className="w-[300px] bg-jvto-navy border-l border-jvto-border p-6 flex flex-col justify-center gap-4">
              <Link
                href="/tours"
                prefetch={false}
                onClick={handleClose}
                className="bg-jvto-orange text-white rounded-full px-6 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-jvto-orange-hover transition-colors text-center block"
                style={{ boxShadow: 'var(--shadow-jvto-orange)' }}
              >
                All Tours
              </Link>
              <p className="text-xs text-white/50 text-center">
                16 private itineraries · Surabaya &amp; Bali
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopGuestButton = ({
  finalMenuIconClass,
  onClick,
}: {
  finalMenuIconClass: string;
  onClick: () => void;
}) => (
  <button
    aria-label="Open login"
    onClick={onClick}
    className="hidden md:inline-flex p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
  >
    <User size={20} className={finalMenuIconClass} />
  </button>
);

const NavbarInner: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const [mobileMenuView, setMobileMenuView] = useState<
    "main" | "travel" | "policy" | "why-jvto"
  >("main");
  const isTravelGuidePath = pathname.startsWith("/travel-guide");
  const isPolicyPath = pathname.startsWith("/policy");
  const isWhyJVTOPath = pathname.startsWith("/why-jvto");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTours, setAllTours] = useState<any[]>([]);
  const [hasLoadedTours, setHasLoadedTours] = useState(false);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [tourLoadError, setTourLoadError] = useState(false);
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      if (isTravelGuidePath) setMobileMenuView("travel");
      else if (isPolicyPath) setMobileMenuView("policy");
      else if (isWhyJVTOPath) setMobileMenuView("why-jvto");
      else setMobileMenuView("main");
    }
  }, [isMenuOpen, isTravelGuidePath, isPolicyPath, isWhyJVTOPath]);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      if (isTravelGuidePath) setMobileMenuView("travel");
      else if (isPolicyPath) setMobileMenuView("policy");
      else if (isWhyJVTOPath) setMobileMenuView("why-jvto");
      else setMobileMenuView("main");
    }
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isSearchOpen || hasLoadedTours || isLoadingTours) return;

    let isMounted = true;

    const fetchTours = async () => {
      setIsLoadingTours(true);
      setTourLoadError(false);

      try {
        const res = await fetch("/api/packages/web");
        if (!res.ok) throw new Error("Failed to fetch tours");
        const data = await res.json();
        if (!isMounted) return;
        setAllTours(Array.isArray(data) ? data : []);
        setHasLoadedTours(true);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading packages", err);
        setTourLoadError(true);
      } finally {
        if (isMounted) setIsLoadingTours(false);
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
    };
  }, [hasLoadedTours, isLoadingTours, isSearchOpen]);

  useEffect(() => {
    if (shouldLoadAuth) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleCallbackId: number | undefined;

    const enableAuth = () => {
      if (!cancelled) setShouldLoadAuth(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleCallbackId = window.requestIdleCallback(enableAuth, {
        timeout: 2500,
      });
    } else {
      timeoutId = setTimeout(enableAuth, 1500);
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (
        idleCallbackId !== undefined &&
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [shouldLoadAuth]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allTours.filter(
      (tour) =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [searchQuery, allTours]);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navClass =
    isHome && !isScrolled
      ? "bg-transparent text-white"
      : "bg-white/80 backdrop-blur-md border-b border-jvto-border text-jvto-navy";
  const logoTextClass = isHome && !isScrolled ? "text-white" : "text-jvto-navy";
  const finalLogoTextClass = isMenuOpen ? "text-jvto-navy" : logoTextClass;
  const finalMenuIconClass = isMenuOpen
    ? "text-jvto-navy"
    : isHome && !isScrolled
      ? "text-white"
      : "text-jvto-navy";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
      >
        <div className="hidden md:block bg-jvto-navy text-white/80 border-b border-white/[0.07] py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase">
          <div className="container mx-auto px-6 flex justify-between items-center gap-6">
            <div className="flex items-center gap-8 min-w-0">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-jvto-lime shrink-0" />
                PT Java Volcano Rendezvous
              </span>
              <span className="hidden lg:inline whitespace-nowrap">
                NIB · 1102230032918
              </span>
              <span className="hidden xl:inline whitespace-nowrap">
                Tourist Police-Led
              </span>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <span className="hidden lg:inline whitespace-nowrap">
                EN · IDR · USD · EUR
              </span>
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="text-jvto-lime hover:underline underline-offset-4 whitespace-nowrap"
              >
                ✓ Verify Us
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 z-50 relative"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-jvto-dark" />
              ) : (
                <Menu size={24} className={finalMenuIconClass} />
              )}
            </button>
            <div className="hidden lg:flex items-center lg:gap-3 xl:gap-8 font-bold lg:text-xs xl:text-sm uppercase tracking-wider">
              <ToursDropdown />
              <Link
                href="/destinations"
                prefetch={false}
                className="hover:text-jvto-orange transition-colors whitespace-nowrap"
              >
                Destinations
              </Link>
              <Link
                href="/why-jvto"
                prefetch={false}
                className="hover:text-jvto-orange transition-colors whitespace-nowrap"
              >
                Why JVTO
              </Link>
              <Link
                href="/travel-guide"
                prefetch={false}
                className="hover:text-jvto-orange transition-colors whitespace-nowrap"
              >
                Travel Guide
              </Link>
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center z-50">
            <Link
              href="/"
              prefetch={false}
              className={`text-2xl font-black italic tracking-tighter flex items-center gap-2 ${finalLogoTextClass}`}
            >
              <Image
                src="/assets/img/jvto-logo.png"
                alt="JVTO Logo"
                width={80}
                height={80}
                priority
                unoptimized
                className="object-contain"
              />
              {/* Brand tag — dynamic from SITE_CONFIG.foundingDate (CANONICAL_FACTS: 2015).
                  Never hardcode "EST 2016" / "EST 2015" as static text; this is the one
                  place the founding year renders in nav chrome. */}
              <span
                className={`hidden sm:inline font-mono not-italic text-[10px] font-semibold tracking-[0.3em] uppercase opacity-55 ${finalLogoTextClass}`}
              >
                · {BRAND_EST_TAG}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden xl:flex items-center gap-2 mr-1">
              <Link
                href="/verify-jvto"
                prefetch={false}
                className="inline-flex items-center gap-1.5 rounded-full border border-jvto-lime/50 text-jvto-lime px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-jvto-lime/10 transition-colors whitespace-nowrap"
              >
                ✓ Verify Us
              </Link>
              <TrackedContactLink
                channel="whatsapp"
                href={contactInfo.whatsappLink}
                source="navbar_cta"
                linkText="WhatsApp"
                className="inline-flex items-center gap-1.5 rounded-full bg-jvto-wa-green text-white px-4 py-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:brightness-110 transition-all whitespace-nowrap shadow-[0_10px_25px_-10px_rgba(37,211,102,0.5)]"
              >
                <NavWhatsAppIcon /> WhatsApp
              </TrackedContactLink>
            </div>
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              className="p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
            >
              <Search size={20} className={finalMenuIconClass} />
            </button>

            {shouldLoadAuth ? (
              <NavbarDesktopAuthIsland finalMenuIconClass={finalMenuIconClass} />
            ) : (
              <DesktopGuestButton
                finalMenuIconClass={finalMenuIconClass}
                onClick={() => setShouldLoadAuth(true)}
              />
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-24 px-6 lg:hidden flex flex-col animate-fade-in-up h-screen overflow-y-auto">
            {mobileMenuView === "travel" && (
              <SidebarTravelGuide
                isMobile
                onBack={() => setMobileMenuView("main")}
              />
            )}

            {mobileMenuView === "policy" && (
              <SidebarPolicy
                isMobile
                onBack={() => setMobileMenuView("main")}
              />
            )}

            {mobileMenuView === "why-jvto" && (
              <SidebarWhy isMobile onBack={() => setMobileMenuView("main")} />
            )}

            {mobileMenuView === "main" && (
              <>
                <div className="flex flex-col gap-6 text-xl font-bold uppercase tracking-wide text-jvto-navy">
                  {shouldLoadAuth ? (
                    <NavbarMobileAuthIsland
                      onOpenLogin={() => {
                        setIsMenuOpen(false);
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setShouldLoadAuth(true)}
                      className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-navy text-left"
                    >
                      <User size={20} /> Log In
                    </button>
                  )}

                  <Link
                    href="/tours"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-orange transition-colors"
                  >
                    Private Tours
                  </Link>
                  <Link
                    href="/destinations"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-orange transition-colors"
                  >
                    Destinations
                  </Link>
                  <Link
                    href="/why-jvto"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-orange transition-colors"
                  >
                    Why JVTO
                  </Link>
                  <Link
                    href="/travel-guide"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-orange transition-colors"
                  >
                    Travel Guide
                  </Link>
                  <Link
                    href="/contact"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-orange text-jvto-orange transition-colors"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-auto mb-10 pt-8 border-t border-gray-100 text-sm text-gray-500">
                  <p className="font-bold mb-2 text-jvto-navy uppercase tracking-wider">
                    Official Contact
                  </p>
                  <p className="mb-1">WhatsApp: +62 822-4478-8833</p>
                  <div className="mt-6 flex items-center gap-2 text-xs bg-gray-50 p-3 rounded-sm border border-gray-200">
                    <ShieldCheck size={16} className="text-jvto-lime" />
                    <span>Licensed Operator No. 1102230032918</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {isSearchOpen && (
        <NavbarSearchModal
          isOpen={isSearchOpen}
          isLoadingTours={isLoadingTours}
          tourLoadError={tourLoadError}
          searchQuery={searchQuery}
          filteredResults={filteredResults}
          onClose={() => setIsSearchOpen(false)}
          onSearchQueryChange={setSearchQuery}
        />
      )}
    </>
  );
};

export default NavbarInner;
