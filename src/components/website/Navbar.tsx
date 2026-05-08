"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu,
  ShieldCheck,
  X,
  ChevronDown,
  Search,
  ArrowRight,
  Clock,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Mail,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Providers } from "@/app/providers";
import SidebarTravelGuide from "@/app/(website)/travel-guide/sidebar";
import SidebarPolicy from "@/app/(website)/policy/sidebar";
import SidebarWhy from "@/app/(website)/why-jvto/sidebar";

// --- 1. HELPER COMPONENTS ---

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

// --- 2. LOGIN MODAL COMPONENT ---
const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Reset state saat modal dibuka/tutup
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setIsLoading(false);
      setIsEmailSent(false);
    }
  }, [isOpen]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Menggunakan signIn('email') dari NextAuth
    const res = await signIn("email", {
      email,
      redirect: false, // Jangan redirect otomatis agar kita bisa kasih pesan sukses
      callbackUrl: "/my-booking", // Redirect ke sini setelah klik link di email
    });

    setIsLoading(false);

    if (res?.error) {
      alert("Error sending email. Please try again.");
    } else {
      setIsEmailSent(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">
            {isEmailSent ? "Check your inbox" : "Welcome Back"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          {/* STATE 1: EMAIL TERKIRIM */}
          {isEmailSent ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Magic Link Sent!
              </h4>
              <p className="text-sm text-slate-500 mb-6">
                We sent a login link to <strong>{email}</strong>.<br />
                Please check your email (and spam folder) to sign in.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-sm hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            /* STATE 2: FORM LOGIN */
            <>
              <div className="w-16 h-16 bg-jvto-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-jvto-green" />
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Log in to your account
              </h4>
              <p className="text-sm text-slate-500 mb-6">
                Access your bookings and manage trips.
              </p>

              <div className="space-y-4">
                {/* 1. Google Button */}
                <button
                  onClick={() => signIn("google")}
                  className="flex w-full items-center justify-center gap-3 rounded-sm border border-slate-300 bg-white px-4 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">
                    Or continue with email
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* 2. Email Form */}
                <form onSubmit={handleEmailLogin} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-sm border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-jvto-green/20 focus:border-jvto-green outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-jvto-dark text-white font-bold rounded-sm hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Send Login Link"
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            By logging in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
// --- 3. TOURS DROPDOWN COMPONENT ---
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
        <div className="absolute -top-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[10px] border-b-gray-200"></div>
        <div className="bg-white border border-gray-200 shadow-xl rounded-sm w-[800px] max-w-[90vw] overflow-hidden">
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

// --- 4. MY ACCOUNT DROPDOWN (NEW) ---
const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-sm border-2 transition-all ${
          isOpen
            ? "bg-jvto-green text-jvto-dark border-jvto-dark"
            : "border-jvto-green bg-jvto-green text-jvto-dark hover:bg-jvto-dark hover:border-jvto-dark hover:text-white"
        }`}
      >
        <User size={16} /> My Account
        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          <Link
            href="/my-booking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-jvto-green"
          >
            <LayoutDashboard size={16} />
            My Booking
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const DesktopGuestButton = ({
  finalMenuIconClass,
  onOpenLogin,
}: {
  finalMenuIconClass: string;
  onOpenLogin: () => void;
}) => (
  <button
    onClick={onOpenLogin}
    aria-label="Open login"
    className="hidden md:inline-flex p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
  >
    <User size={20} className={finalMenuIconClass} />
  </button>
);

const NavbarDesktopAuth = ({
  finalMenuIconClass,
  onOpenLogin,
}: {
  finalMenuIconClass: string;
  onOpenLogin: () => void;
}) => {
  const { data: session } = useSession();

  return session ? (
    <ProfileDropdown />
  ) : (
    <DesktopGuestButton
      finalMenuIconClass={finalMenuIconClass}
      onOpenLogin={onOpenLogin}
    />
  );
};

const NavbarMobileAuth = ({
  onOpenMobileLogin,
}: {
  onOpenMobileLogin: () => void;
}) => {
  const { data: session } = useSession();

  return session ? (
    <>
      <Link
        href="/my-booking"
        prefetch={false}
        className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-green hover:text-jvto-dark transition-colors"
      >
        <LayoutDashboard size={20} /> My Booking
      </Link>
      <button
        onClick={() => signOut()}
        className="flex items-center gap-3 border-b border-gray-100 pb-4 text-red-600 hover:text-red-800 transition-colors text-left"
      >
        <LogOut size={20} /> Log Out
      </button>
    </>
  ) : (
    <button
      onClick={onOpenMobileLogin}
      className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-dark hover:text-jvto-green transition-colors text-left"
    >
      <LogIn size={20} /> Log In
    </button>
  );
};

// --- 5. MAIN NAVBAR COMPONENT ---

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

  // Logic: Reset menu view saat menu ditutup atau path berubah
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
      // Tentukan tampilan awal saat menu dibuka berdasarkan path URL
      if (isTravelGuidePath) {
        setMobileMenuView("travel");
      } else if (isPolicyPath) {
        setMobileMenuView("policy");
      } else if (isWhyJVTOPath) {
        setMobileMenuView("why-jvto");
      } else {
        setMobileMenuView("main");
      }
    }
    setIsMenuOpen(!isMenuOpen);
  };
  // State Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Logic Search Data
  const [searchQuery, setSearchQuery] = useState("");
  const [allTours, setAllTours] = useState<any[]>([]);
  const [hasLoadedTours, setHasLoadedTours] = useState(false);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [tourLoadError, setTourLoadError] = useState(false);
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false);

  useEffect(() => {
    if (!isSearchOpen || hasLoadedTours || isLoadingTours) return;

    let isMounted = true;

    const fetchTours = async () => {
      setIsLoadingTours(true);
      setTourLoadError(false);

      try {
        const res = await fetch("/api/packages/web");
        if (!res.ok) {
          throw new Error("Failed to fetch tours");
        }

        const data = await res.json();
        if (!isMounted) return;

        setAllTours(Array.isArray(data) ? data : []);
        setHasLoadedTours(true);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading packages", err);
        setTourLoadError(true);
      } finally {
        if (isMounted) {
          setIsLoadingTours(false);
        }
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
      if (!cancelled) {
        setShouldLoadAuth(true);
      }
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

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen || isLoginOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isSearchOpen, isLoginOpen]);

  // Keyboard navigation (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsLoginOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsLoginOpen(false);
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
        {/* Top Bar */}
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

        {/* Main Bar */}
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-2 z-50 relative"
              onClick={() => toggleMenu()}
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

            {/* --- AUTH LOGIC (DESKTOP) --- */}
            {shouldLoadAuth ? (
              <NavbarDesktopAuth
                finalMenuIconClass={finalMenuIconClass}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            ) : (
              <DesktopGuestButton
                finalMenuIconClass={finalMenuIconClass}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-24 px-6 lg:hidden flex flex-col animate-fade-in-up h-screen overflow-y-auto">
            {/* VIEW 1: SIDEBAR TRAVEL GUIDE */}
            {mobileMenuView === "travel" && (
              <SidebarTravelGuide
                isMobile
                onBack={() => setMobileMenuView("main")}
              />
            )}

            {/* VIEW 2: SIDEBAR POLICY */}
            {mobileMenuView === "policy" && (
              <SidebarPolicy
                isMobile
                onBack={() => setMobileMenuView("main")}
              />
            )}

            {/* VIEW 3: SIDEBAR WHY JVTO */}
            {mobileMenuView === "why-jvto" && (
              <SidebarWhy isMobile onBack={() => setMobileMenuView("main")} />
            )}

            {/* VIEW 4: MAIN MENU */}
            {mobileMenuView === "main" && (
              <>
                <div className="flex flex-col gap-6 text-xl font-bold uppercase tracking-wide text-jvto-dark">
                  {/* --- AUTH LOGIC (MOBILE) --- */}
                  {shouldLoadAuth ? (
                    <NavbarMobileAuth
                      onOpenMobileLogin={() => {
                        setIsMenuOpen(false);
                        setIsLoginOpen(true);
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="flex items-center gap-3 border-b border-gray-100 pb-4 text-jvto-dark hover:text-jvto-green transition-colors text-left"
                    >
                      <LogIn size={20} /> Log In
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

      {/* --- MODALS --- */}

      {/* 1. Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* 2. Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center px-4 py-4 border-b border-gray-100">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search tour packages (e.g. Bromo, Ijen...)"
                className="w-full outline-none text-jvto-dark text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {isLoadingTours ? (
                <div className="py-12 text-center text-gray-400 font-medium">
                  Loading tours...
                </div>
              ) : tourLoadError ? (
                <div className="py-12 text-center text-gray-400 font-medium">
                  Search is temporarily unavailable.
                </div>
              ) : searchQuery.length > 0 ? (
                filteredResults.length > 0 ? (
                  <div className="py-2">
                    {filteredResults.map((tour) => (
                      <Link
                        key={tour.id}
                        href={`/${tour.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-3 mx-2 mb-2 rounded-sm hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-20 rounded-sm overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <Image
                            src={tour.banner.url}
                            alt={tour.banner.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-bold text-jvto-dark leading-snug group-hover:text-jvto-green transition-colors line-clamp-1">
                            {tour.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              <Clock size={12} className="text-gray-400" />{" "}
                              {tour.duration.day}D/{tour.duration.night}N
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                              {tour.startDestination} → {tour.endDestination}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-[14px] font-black text-jvto-green">
                              IDR {tour.startFrom?.toLocaleString("id-ID")}
                              <span className="text-[10px] text-gray-400 font-normal ml-1 tracking-normal italic lowercase">
                                / person
                              </span>
                            </p>
                            <span className="text-[10px] font-bold text-jvto-green opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all -translate-x-2 group-hover:translate-x-0">
                              DETAILS <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400 font-medium">
                    No tours found for "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Start typing to find your adventure...
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>Java Volcano Tour Operator</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Navbar: React.FC = () => {
  return (
    <Providers>
      <NavbarInner />
    </Providers>
  );
};

export default Navbar;
