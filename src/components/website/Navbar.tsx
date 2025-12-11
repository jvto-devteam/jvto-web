"use client";
import React, { useState, useEffect } from "react";
import { Menu, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // const location = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  // useEffect(() => {
  //   setIsMenuOpen(false);
  // }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
  setIsMenuOpen(false);
}, [pathname]);

  // Dynamic classes based on state
  const navClass =
    isHome && !isScrolled
      ? "bg-transparent text-white"
      : "bg-white text-jvto-dark shadow-md";

  const logoTextClass = isHome && !isScrolled ? "text-white" : "text-jvto-dark";

  // Ensure logo is dark when menu is open (as menu background is white)
  const finalLogoTextClass = isMenuOpen ? "text-jvto-dark" : logoTextClass;
  const finalMenuIconClass = isMenuOpen
    ? "text-jvto-dark"
    : isHome && !isScrolled
    ? "text-white"
    : "text-jvto-dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}
    >
      {/* Top Utility Bar - Only visible when not scrolled on Home, or hidden on mobile */}
      <div
        className={`hidden md:block py-2 text-xs font-medium border-b border-white/10 ${
          isHome && !isScrolled ? "bg-black/20" : "bg-jvto-green text-jvto-dark"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-center items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} />
            Tourist Police-Led Private Tours
          </span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline">
            Licensed East Java Operator (No. 1102230032918)
          </span>
        </div>
      </div>

      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Hamburger & Menu Links */}
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

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-wider">
            <Link
              href="/tours"
              className="hover:text-jvto-green transition-colors"
            >
              Private Tours
            </Link>
            <Link
              href="/destinations"
              className="hover:text-jvto-green transition-colors"
            >
              Destinations
            </Link>
            <Link
              href="/why-jvto"
              className="hover:text-jvto-green transition-colors"
            >
              Why JVTO
            </Link>
            <Link
              href="/travel-guide"
              className="hover:text-jvto-green transition-colors"
            >
              Travel Guide
            </Link>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center z-50">
          <Link
            href="/"
            className={`text-2xl font-black italic tracking-tighter flex items-center gap-1 ${finalLogoTextClass}`}
          >
            <Image
              src="/assets/img/jvto-color.png"
              alt="JVTO Logo"
              width={100}
              height={100} // wajib ada (boleh disesuaikan)
              priority // opsional (supaya load lebih cepat)
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
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
  );
};

export default Navbar;
