"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { contactInfo } from "@/constants";
import { usePathname } from "next/navigation";

const NavLink: React.FC<{
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
}> = ({ to, children, isScrolled }) => (
  <Link
    href={to}
    className={`font-semibold transition-colors ${
      isScrolled
        ? "text-ink-primary dark:text-white hover:text-primary dark:hover:text-ink-accentC"
        : "text-white hover:text-white/80"
    }`}
  >
    {children}
  </Link>
);

const MegaMenuLink: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, children, onClick }) => (
  <li>
    <Link
      href={to}
      onClick={onClick}
      className="block p-2 -mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-ink-neutral-700 transition-colors text-ink-primary dark:text-white"
    >
      {children}
    </Link>
  </li>
);

const MegaMenuSeeAllLink: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, children, onClick }) => (
  <li>
    <Link
      href={to}
      onClick={onClick}
      className="inline-flex items-center gap-1 font-semibold text-primary mt-2"
    >
      <span className="hover:underline">{children}</span>
      <span className="material-symbols-outlined text-sm no-underline">
        arrow_forward
      </span>
    </Link>
  </li>
);

const ToursDropdown: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => setIsDropdownOpen(false);
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 200);
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`font-semibold transition-colors flex items-center gap-1 ${
          isScrolled
            ? "text-ink-primary dark:text-white hover:text-primary dark:hover:text-ink-accentC"
            : "text-white hover:text-white/80"
        }`}
      >
        Tours
        <span
          className={`material-symbols-outlined text-base transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 transform ${
          isDropdownOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ perspective: "1000px" }}
      >
        <div className="bg-white dark:bg-background-dark rounded-xl shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700 w-[800px] max-w-[90vw] overflow-hidden">
          <div className="flex">
            {/* Left: Links */}
            <div className="flex-1 p-8 grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-ink-primary dark:text-white mb-3">
                  Popular Packages
                </h4>
                <ul className="space-y-1 text-sm">
                  <MegaMenuLink
                    to="/tours/ijen-bromo-madakaripura-3d2n-from-surabaya"
                    onClick={handleClose}
                  >
                    3D2N Ijen, Bromo & Waterfall
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/bromo-ijen-3d2n-from-surabaya"
                    onClick={handleClose}
                  >
                    3D2N Bromo & Ijen Volcanoes
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/bromo-sunrise-2d1n-from-surabaya"
                    onClick={handleClose}
                  >
                    2D1N Bromo & Waterfall
                  </MegaMenuLink>
                  <MegaMenuSeeAllLink to="/tours" onClick={handleClose}>
                    See All Packages
                  </MegaMenuSeeAllLink>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-ink-primary dark:text-white mb-3">
                  Tours by Duration
                </h4>
                <ul className="space-y-1 text-sm">
                  <MegaMenuLink
                    to="/tours/duration/short"
                    onClick={handleClose}
                  >
                    Short Trips (1-2 Days)
                  </MegaMenuLink>
                  <MegaMenuLink to="/tours" onClick={handleClose}>
                    Classic Adventures (3-4 Days)
                  </MegaMenuLink>
                  <MegaMenuLink to="/tours" onClick={handleClose}>
                    Long Expeditions (5+ Days)
                  </MegaMenuLink>
                  <MegaMenuSeeAllLink to="/tours" onClick={handleClose}>
                    See All Durations
                  </MegaMenuSeeAllLink>
                </ul>
              </div>
            </div>

            {/* Right: Gambar dengan Next/Image */}
            <div className="w-[320px] bg-gray-50 dark:bg-ink-primary p-6 space-y-4">
              <Link
                href="/tours/from/surabaya"
                onClick={handleClose}
                className="group block relative rounded-lg overflow-hidden h-36 text-white"
              >
                <Image
                  src="https://javavolcano-touroperator.com/assets/img/destinations/new4.jpg"
                  alt="Mount Bromo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="320px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-4">
                  <h5 className="font-bold text-lg">Tours from Surabaya</h5>
                  <p className="text-xs opacity-90 mt-1">
                    Explore Bromo, Ijen & more.
                  </p>
                </div>
              </Link>

              <Link
                href="/tours/from/bali"
                onClick={handleClose}
                className="group block relative rounded-lg overflow-hidden h-36 text-white"
              >
                <Image
                  src="https://javavolcano-touroperator.com/assets/img/destinations/new6.jpg"
                  alt="Ijen Crater"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="320px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-4">
                  <h5 className="font-bold text-lg">Tours from Bali</h5>
                  <p className="text-xs opacity-90 mt-1">
                    Overland adventures to Java.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const WhyJVTODropdown: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`font-semibold transition-colors flex items-center gap-1 ${
          isScrolled
            ? "text-ink-primary dark:text-white hover:text-primary dark:hover:text-ink-accentC"
            : "text-white hover:text-white/80"
        }`}
      >
        Why JVTO
        <span
          className={`material-symbols-outlined text-base transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 transform ${
          isDropdownOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-background-dark rounded-xl shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700 w-72 p-4">
          <ul className="space-y-1 text-sm">
            <MegaMenuLink to="/why-jvto/our-story" onClick={handleClose}>
              Our Story
            </MegaMenuLink>
            <MegaMenuLink
              to="/why-jvto/the-jvto-difference"
              onClick={handleClose}
            >
              The JVTO Difference
            </MegaMenuLink>
            <MegaMenuLink to="/why-jvto/reviews" onClick={handleClose}>
              Reviews
            </MegaMenuLink>
            <MegaMenuLink to="/why-jvto/our-team" onClick={handleClose}>
              Our Team
            </MegaMenuLink>
            <MegaMenuLink
              to="/why-jvto/community-standards"
              onClick={handleClose}
            >
              Community Standards
            </MegaMenuLink>
            <div className="pt-2 mt-2 border-t border-ink-neutral-200 dark:border-ink-neutral-700">
              <MegaMenuSeeAllLink to="/why-jvto" onClick={handleClose}>
                Why JVTO Hub
              </MegaMenuSeeAllLink>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

const TravelGuideDropdown: React.FC<{ isScrolled: boolean }> = ({
  isScrolled,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`font-semibold transition-colors flex items-center gap-1 ${
          isScrolled
            ? "text-ink-primary dark:text-white hover:text-primary dark:hover:text-ink-accentC"
            : "text-white hover:text-white/80"
        }`}
      >
        Travel Guide
        <span
          className={`material-symbols-outlined text-base transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 transform ${
          isDropdownOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-background-dark rounded-xl shadow-lg border border-ink-neutral-200 dark:border-ink-neutral-700 w-[550px] p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h4 className="font-bold text-ink-primary dark:text-white mb-3">
                Planning & Policy
              </h4>
              <ul className="space-y-1 text-sm">
                <MegaMenuLink to="/travel-guide/faq" onClick={handleClose}>
                  FAQ
                </MegaMenuLink>
                <MegaMenuLink
                  to="/travel-guide/booking-information"
                  onClick={handleClose}
                >
                  Booking & Payments
                </MegaMenuLink>
                <MegaMenuLink to="/travel-guide/privacy" onClick={handleClose}>
                  Privacy Policy
                </MegaMenuLink>
                <MegaMenuLink to="/travel-guide/terms" onClick={handleClose}>
                  Terms of Service
                </MegaMenuLink>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ink-primary dark:text-white mb-3">
                Safety & Preparation
              </h4>
              <ul className="space-y-1 text-sm">
                <MegaMenuLink
                  to="/travel-guide/ijen-health-screening"
                  onClick={handleClose}
                >
                  Ijen Health Screening
                </MegaMenuLink>
                <MegaMenuLink
                  to="/travel-guide/safety-on-tours"
                  onClick={handleClose}
                >
                  Safety On Tours
                </MegaMenuLink>
                <MegaMenuLink
                  to="/travel-guide/packing-and-fitness"
                  onClick={handleClose}
                >
                  Packing & Fitness Guide
                </MegaMenuLink>
                <MegaMenuLink
                  to="/travel-guide/weather-and-closures"
                  onClick={handleClose}
                >
                  Weather & Closures
                </MegaMenuLink>
                <MegaMenuLink
                  to="/travel-guide/police-escort-for-groups"
                  onClick={handleClose}
                >
                  Police Escort for Groups
                </MegaMenuLink>
              </ul>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-ink-neutral-200 dark:border-ink-neutral-700">
            <ul className="list-none">
              <MegaMenuSeeAllLink to="/travel-guide" onClick={handleClose}>
                Travel Guide Home
              </MegaMenuSeeAllLink>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const exactScrolledPaths = [
    "/why-jvto/our-story",
    "/why-jvto/the-jvto-difference",
    "/why-jvto/reviews",
    "/why-jvto/community-standards",
    "/why-jvto/our-team",
    "/why-jvto",
    "/travel-guide/faq",
    "/travel-guide/booking-information",
    "/travel-guide/booking-information",
    "/travel-guide/safety-on-tours",
    "/travel-guide/packing-and-fitness",
    "/travel-guide/weather-and-closures",
    "/travel-guide/police-escort-for-groups",
    "/tours",
    "/verify-jvto",
  ];
  const prefixScrolledPaths = [
    "/destinations/", // <-- ini yang kamu butuhkan
    "/tours/", // opsional, kalau mau semua sub-page tours juga selalu scrolled
  ];

  // 3. Cek apakah current path termasuk exact ATAU dimulai dengan salah satu prefix
  const isForceScrolled =
    exactScrolledPaths.includes(pathname) ||
    prefixScrolledPaths.some((prefix) => pathname.startsWith(prefix));

  const forceScrolled = isForceScrolled;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      // Default to light mode unless 'dark' is explicitly set in localStorage.
      return localStorage.theme === "dark";
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 50; // bisa 50 atau 80
      setIsScrolled(forceScrolled || shouldBeScrolled);
    };

    // Jalankan sekali saat mount (penting!)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceScrolled]); // ← dependency penting: kalau path berubah, re-check

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navLinks = [
    { name: "Destinations", href: "/destinations", icon: "public" },
    { name: "Why JVTO", href: "/why-jvto", icon: "verified_user" },
    { name: "Travel Guide", href: "/travel-guide", icon: "menu_book" },
    { name: "Insights", href: "/insights", icon: "lightbulb" },
    { name: "Contact", href: "/contact", icon: "email" },
  ];

  const textColorClass = isScrolled
    ? "text-ink-primary dark:text-white"
    : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shadow"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="p-2 -ml-2 rounded-lg">
            <Image
              src="https://javavolcano-touroperator.com/assets/img/jvto-color.png?1702429896"
              alt="JVTO Tours Logo"
              width={160}
              height={40}
              className={`h-10 w-auto transition-all duration-300 ${
                isScrolled ? "" : "filter brightness-0 invert"
              }`}
              priority // karena logo selalu di atas fold
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <ToursDropdown isScrolled={isScrolled} />
            {navLinks.map((link) => {
              if (link.name === "Why JVTO") {
                return (
                  <WhyJVTODropdown key={link.name} isScrolled={isScrolled} />
                );
              }
              if (link.name === "Travel Guide") {
                return (
                  <TravelGuideDropdown
                    key={link.name}
                    isScrolled={isScrolled}
                  />
                );
              }
              return (
                <NavLink key={link.name} to={link.href} isScrolled={isScrolled}>
                  {link.name}
                </NavLink>
              );
            })}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <a
              href={contactInfo.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact JVTO on WhatsApp"
              className={`flex items-center gap-1.5 text-sm transition-colors p-2 rounded-lg ${textColorClass} ${
                isScrolled
                  ? "hover:text-primary dark:hover:text-primary"
                  : "hover:text-white/80"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                chat_bubble
              </span>
              <span className="hidden lg:inline">WhatsApp Us</span>
            </a>
            <button
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className={`p-3 rounded-full transition-colors ${textColorClass} ${
                isScrolled
                  ? "hover:bg-gray-200 dark:hover:bg-ink-neutral-700"
                  : "hover:bg-white/20"
              }`}
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <Link
              href="/plan-my-trip"
              className="px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors duration-200"
            >
              Plan My Trip
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              className={`relative w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 ${textColorClass} ${
                isScrolled
                  ? "hover:bg-gray-200 dark:hover:bg-ink-neutral-700"
                  : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl absolute transition-all duration-300 transform ${
                  isOpen
                    ? "rotate-90 scale-50 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
                aria-hidden={isOpen}
              >
                menu
              </span>
              <span
                className={`material-symbols-outlined text-3xl absolute transition-all duration-300 transform ${
                  isOpen
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-50 opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                close
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        } overflow-hidden bg-white dark:bg-background-dark shadow-lg`}
      >
        <div className="px-4 pt-2 pb-4">
          <div className="space-y-2">
            <Link
              href="/tours"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-ink-primary dark:text-white hover:bg-gray-100 dark:hover:bg-ink-neutral-700"
            >
              <span className="material-symbols-outlined">explore</span>
              <span>Tours</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-ink-primary dark:text-white hover:bg-gray-100 dark:hover:bg-ink-neutral-700"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-ink-neutral-200 dark:border-ink-neutral-700 space-y-2">
            <a
              href={contactInfo.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-ink-primary dark:text-white hover:bg-gray-100 dark:hover:bg-ink-neutral-700"
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-ink-primary dark:text-white hover:bg-gray-100 dark:hover:bg-ink-neutral-700 text-left"
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
              <span>{isDarkMode ? "Light Theme" : "Dark Theme"}</span>
            </button>
          </div>

          <Link
            href="/plan-my-trip"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-opacity-90 transition-colors"
          >
            Plan My Trip
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
