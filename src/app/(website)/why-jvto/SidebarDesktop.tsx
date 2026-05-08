import Link from "next/link";
import { WHY_MENU } from "./sidebarMenu";

export default function SidebarDesktop({
  currentPath,
}: {
  currentPath: string;
}) {
  return (
    <>
      <style>{`
        .jvto-sidebar {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
        }
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
        .sidebar-divider {
          height: 1px;
          background: #eef0e8;
          margin: 0.75rem 1rem 1rem;
        }
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

      <aside className="jvto-sidebar w-64 hidden md:flex flex-col h-screen sticky top-[120px] border-r border-[#eef0e8] overflow-y-auto pt-6 pb-8 flex-shrink-0">
        <div className="sidebar-section-label">Navigation</div>

        <nav className="px-2">
          {WHY_MENU.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="sidebar-link-icon">
                  <Icon size={14} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        <Link href="/verify-jvto" className="sidebar-verify-badge">
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
