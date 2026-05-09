"use client";
import React from "react";
import Link from "@/components/website/AppLink";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
} from "lucide-react";
import { WHY_MENU } from "./sidebarMenu";

interface SidebarProps {
  isMobile?: boolean;
  onBack?: () => void;
}

export default function SidebarWhy({ isMobile, onBack }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .jvto-sidebar {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
        }

        /* ── Section label ── */
        .sidebar-section-label {
          font-family: 'DM Sans', monospace;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9aaa80;
          padding: 0 1rem 0.625rem;
          margin-bottom: 0.25rem;
        }

        /* ── Nav item ── */
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6rem 1rem;
          border-radius: 0.625rem;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.845rem;
          font-weight: 500;
          color: #5a6a45;
          transition: background 0.15s, color 0.15s;
          position: relative;
          margin-bottom: 0.125rem;
        }
        .sidebar-link:hover {
          background: #f4f7ec;
          color: #2a3a18;
        }
        .sidebar-link.active {
          background: #eef5d8;
          color: #2a3a18;
          font-weight: 600;
        }

        /* active indicator bar */
        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: #9fce33;
        }

        .sidebar-link-icon {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: transparent;
          transition: background 0.15s;
        }
        .sidebar-link.active .sidebar-link-icon {
          background: #9fce33;
        }
        .sidebar-link.active .sidebar-link-icon svg {
          color: #1a2a0a;
        }
        .sidebar-link:not(.active) .sidebar-link-icon svg {
          color: #8a9e70;
        }
        .sidebar-link:hover:not(.active) .sidebar-link-icon {
          background: #e6f0c8;
        }
        .sidebar-link:hover:not(.active) .sidebar-link-icon svg {
          color: #4a6a28;
        }

        /* ── Mobile back button ── */
        .sidebar-back-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #eef0e8;
        }
        .sidebar-back-icon-btn {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 1px solid #e0e8d0;
          background: #f7faf0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .sidebar-back-icon-btn:hover {
          background: #eef5d8;
          border-color: #9fce33;
        }
        .sidebar-back-icon-btn svg {
          color: #3a4a28;
        }
        .sidebar-back-title {
          // font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #2a3a18;
        }

        /* ── Divider ── */
        .sidebar-divider {
          height: 1px;
          background: #eef0e8;
          margin: 0.75rem 1rem 1rem;
        }

        /* ── Verify badge at bottom ── */
        .sidebar-verify-badge {
          margin: 1rem 0.75rem 0;
          padding: 0.875rem 1rem;
          border-radius: 0.75rem;
          background: #f4f7ec;
          border: 1px solid #dde8c0;
          text-decoration: none;
          display: block;
          transition: border-color 0.15s, background 0.15s;
        }
        .sidebar-verify-badge:hover {
          background: #eef5d8;
          border-color: #9fce33;
        }
        .sidebar-verify-badge-label {
          font-family: 'DM Sans', monospace;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #7aaa1a;
          display: block;
          margin-bottom: 0.25rem;
        }
        .sidebar-verify-badge-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #2a3a18;
          display: block;
        }
        .sidebar-verify-badge-sub {
          font-size: 0.7rem;
          color: #8a9e70;
          display: block;
          margin-top: 0.2rem;
          line-height: 1.4;
        }
      `}</style>

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
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
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
        <Link href="/verify-jvto" prefetch={false} className="sidebar-verify-badge">
          <span className="sidebar-verify-badge-label">◆ Quick Access</span>
          <span className="sidebar-verify-badge-text">Verify JVTO</span>
          <span className="sidebar-verify-badge-sub">
            Legal docs, licenses & proof library
          </span>
        </Link>
      </aside>
    </>
  );
}
