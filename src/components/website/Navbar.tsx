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
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

const NavbarSearchModal = dynamic(() => import("./NavbarSearchModal"), {
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
      className="block py-2 text-sm font-medium text-gray-700 hover:text-jvto-green transition-colors"
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
        className="flex items-center gap-1 uppercase tracking-wider font-bold text-sm hover:text-jvto-green transition-colors whitespace-nowrap"
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
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg w-[800px] max-w-[90vw] overflow-hidden">
          <div className="flex">
            <div className="flex-1 p-8 grid grid-cols-2 gap-8 bg-white">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
                  Popular
                </h4>
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
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-4">
                  By Location
                </h4>
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
            <div className="w-[300px] bg-jvto-green border-l border-gray-200 p-6 flex flex-col justify-center">
              <Link
                href="/tours"
                prefetch={false}
                onClick={handleClose}
                className="bg-white border-4 border-black p-4 shadow-pop hover:-translate-y-1 transition-transform text-center"
              >
                <span className="font-display text-2xl text-black block text-primary">
                  ALL TOURS
                </span>
                <span className="font-bold text-sm text-black">
                  Find your adventure!
                </span>
              </Link>
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
      : "bg-white text-jvto-dark shadow-md";
  const logoTextClass = isHome && !isScrolled ? "text-white" : "text-jvto-dark";
  const finalLogoTextClass = isMenuOpen ? "text-jvto-dark" : logoTextClass;
  const finalMenuIconClass = isMenuOpen
    ? "text-jvto-dark"
    : isHome && !isScrolled
      ? "text-white"
      : "text-jvto-dark";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
      >
        <div
          className={`hidden md:block py-2 text-xs font-medium border-b border-white/10 ${
            isHome && !isScrolled
              ? "bg-black/20"
              : "bg-jvto-green text-jvto-dark"
          }`}
        >
          <div className="container mx-auto px-6 flex justify-center items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Tourist Police-Led Private Tours
            </span>
            <span className="hidden lg:inline">|</span>
            <span className="hidden lg:inline">
              Licensed East Java Operator (No. 1102230032918)
            </span>
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
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Destinations
              </Link>
              <Link
                href="/why-jvto"
                prefetch={false}
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Why JVTO
              </Link>
              <Link
                href="/travel-guide"
                prefetch={false}
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Travel Guide
              </Link>
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center z-50">
            <Link
              href="/"
              prefetch={false}
              className={`text-2xl font-black italic tracking-tighter flex items-center gap-1 ${finalLogoTextClass}`}
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
            </Link>
          </div>

          <div className="flex items-center gap-1">
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
                <div className="flex flex-col gap-6 text-xl font-bold uppercase tracking-wide text-jvto-dark">
                  {shouldLoadAuth ? (
                    <NavbarMobileAuthIsland
                      onOpenLogin={() => {
                        setIsMenuOpen(false);
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setShouldLoadAuth(true)}
                      className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-dark text-left"
                    >
                      <User size={20} /> Log In
                    </button>
                  )}

                  <Link
                    href="/tours"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
                  >
                    Private Tours
                  </Link>
                  <Link
                    href="/destinations"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
                  >
                    Destinations
                  </Link>
                  <Link
                    href="/why-jvto"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
                  >
                    Why JVTO
                  </Link>
                  <Link
                    href="/travel-guide"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
                  >
                    Travel Guide
                  </Link>
                  <Link
                    href="/contact"
                    prefetch={false}
                    className="border-b border-gray-100 pb-4 hover:text-jvto-green text-jvto-green transition-colors"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-auto mb-10 pt-8 border-t border-gray-100 text-sm text-gray-500">
                  <p className="font-bold mb-2 text-jvto-dark uppercase tracking-wider">
                    Official Contact
                  </p>
                  <p className="mb-1">WhatsApp: +62 822-4478-8833</p>
                  <div className="mt-6 flex items-center gap-2 text-xs bg-gray-50 p-3 rounded-sm border border-gray-200">
                    <ShieldCheck size={16} className="text-jvto-green" />
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
