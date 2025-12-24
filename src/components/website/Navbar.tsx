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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MegaMenuLink: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, children, onClick }) => (
  <li>
    <Link
      href={to}
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setMenuStyle({
        left: rect.left + rect.width / 2,
        top: rect.bottom,
      });
    }

    setIsDropdownOpen(true);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
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
        Tours
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        style={{
          left: menuStyle.left,
          top: menuStyle.top + 12, // jarak kecil dari menu
          // transform: "translateX(-50%)",
        }}
        className={`
    fixed
    z-40
    transition-all duration-200
    ${
      isDropdownOpen
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }
  `}
      >
        {/* Pop Art Triangle Indicator */}
        <div className="absolute -top-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[10px] border-b-gray-200"></div>

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
                    3 Day Bromo, Madakaripura & Ijen from Surabaya to Bali
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/from-surabaya/ijen-bromo-madakaripura-3d2n"
                    onClick={handleClose}
                  >
                    3 Day Ijen, Bromo, Madakaripura from Surabaya
                  </MegaMenuLink>
                  <MegaMenuLink
                    to="/tours/from-surabaya/ijen-bromo-madakaripura-4d3n"
                    onClick={handleClose}
                  >
                    4 Day Ijen, Bromo, Madakaripura from Surabaya
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

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // --- Logic Search ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTours, setAllTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/packages/web");
        const data = await res.json();
        setAllTours(data);
      } catch (err) {
        console.error("Error loading packages", err);
      }
    };
    fetchTours();
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allTours.filter(
      (tour) =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, allTours]);
  // --- End Logic Search ---

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu or search open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isSearchOpen]);
  // Tambahkan di dalam komponen Navbar, di bawah useEffect yang sudah ada
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Destinations
              </Link>
              <Link
                href="/why-jvto"
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Why JVTO
              </Link>
              <Link
                href="/travel-guide"
                className="hover:text-jvto-green transition-colors whitespace-nowrap"
              >
                Travel Guide
              </Link>
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center z-50">
            <Link
              href="/"
              className={`text-2xl font-black italic tracking-tighter flex items-center gap-1 ${finalLogoTextClass}`}
            >
              <Image
                src="/assets/img/jvto-color.png"
                alt="JVTO Logo"
                width={100}
                height={100}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <Search size={20} className={finalMenuIconClass} />
            </button>

            <Link
              href="/contact"
              className={`hidden md:inline-flex px-4 py-2 text-xs font-bold uppercase rounded-sm border-2 ${
                isHome && !isScrolled
                  ? "border-white hover:bg-white hover:text-black"
                  : "border-black hover:bg-black hover:text-white"
              } transition-all`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-24 px-6 lg:hidden flex flex-col animate-fade-in-up h-screen overflow-y-auto">
            <div className="flex flex-col gap-6 text-xl font-bold uppercase tracking-wide text-jvto-dark">
              <Link
                href="/tours"
                className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
              >
                Private Tours
              </Link>
              <Link
                href="/destinations"
                className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
              >
                Destinations
              </Link>
              <Link
                href="/why-jvto"
                className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
              >
                Why JVTO
              </Link>
              <Link
                href="/travel-guide"
                className="border-b border-gray-100 pb-4 hover:text-jvto-green transition-colors"
              >
                Travel Guide
              </Link>
              <Link
                href="/contact"
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
              <p>Email: hello@javavolcano-touroperator.com</p>
              <div className="mt-6 flex items-center gap-2 text-xs bg-gray-50 p-3 rounded-sm border border-gray-200">
                <ShieldCheck size={16} className="text-jvto-green" />
                <span>Licensed Operator No. 1102230032918</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- Search Modal (Clean Style) --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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
              {searchQuery.length > 0 ? (
                filteredResults.length > 0 ? (
                  <div className="py-2">
                    {filteredResults.map((tour) => (
                      <Link
                        key={tour.id}
                        href={`/${tour.slug}`}
                        className="flex items-center gap-4 p-3 mx-2 mb-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                      >
                        {/* 1. Thumbnail Image dengan Hover Effect */}
                        <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                          <Image
                            src={tour.banner.url}
                            alt={tour.banner.alt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* 2. Content Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-bold text-jvto-dark leading-snug group-hover:text-jvto-green transition-colors line-clamp-1">
                            {tour.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-1.5">
                            {/* Badge Durasi */}
                            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              <Clock size={12} className="text-gray-400" />{" "}
                              {tour.duration.day}D/{tour.duration.night}N
                            </span>
                            {/* Route Info */}
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
                              {tour.startDestination} → {tour.endDestination}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Harga dengan Formatting Bagus */}
                            <p className="text-[14px] font-black text-jvto-green">
                              IDR {tour.startFrom?.toLocaleString("id-ID")}
                              <span className="text-[10px] text-gray-400 font-normal ml-1 tracking-normal italic lowercase">
                                / person
                              </span>
                            </p>

                            {/* Indikator Klik */}
                            <span className="text-[10px] font-bold text-jvto-green opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all -translate-x-2 group-hover:translate-x-0">
                              DETAILS <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}{" "}
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

export default Navbar;
