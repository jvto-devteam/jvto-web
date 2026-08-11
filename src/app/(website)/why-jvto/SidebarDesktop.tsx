import Link from "@/components/website/AppLink";
import { WHY_MENU } from "./sidebarMenu";

export default function SidebarDesktop({
  currentPath,
}: {
  currentPath: string;
}) {
  return (
    <>
      <style>{`
        .jw-sidebar {
          font-family: var(--jw-font-mono, 'JetBrains Mono', monospace);
          background: #ffffff;
        }
        .jw-sidebar-label {
          font-family: var(--jw-font-mono, 'JetBrains Mono', monospace);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6B7280;
          padding: 0 1rem 0.75rem;
          margin-bottom: 0.25rem;
        }
        .jw-sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          font-family: var(--jw-font-sans, 'Inter', sans-serif);
          font-size: 0.845rem;
          font-weight: 500;
          color: #4a5568;
          transition: background 0.15s, color 0.15s;
          position: relative;
          margin-bottom: 0.125rem;
        }
        .jw-sidebar-link:hover {
          background: #F6F5F2;
          color: #0D1B2A;
        }
        .jw-sidebar-link.active {
          background: #0D1B2A;
          color: #ffffff;
          font-weight: 600;
        }
        .jw-sidebar-link.active::before {
          content: '';
          position: absolute;
          left: -0.5rem;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 2px 2px 0;
          background: #E8650A;
        }
        .jw-sidebar-link-icon {
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
        .jw-sidebar-link.active .jw-sidebar-link-icon svg {
          color: #8CC63F;
        }
        .jw-sidebar-link:not(.active) .jw-sidebar-link-icon svg {
          color: #8a94a6;
        }
        .jw-sidebar-link:hover:not(.active) .jw-sidebar-link-icon svg {
          color: #E8650A;
        }
        .jw-sidebar-divider {
          height: 1px;
          background: #E3E0DA;
          margin: 0.75rem 1rem 1rem;
        }
        .jw-sidebar-verify-badge {
          margin: 1rem 0.75rem 0;
          padding: 0.9rem 1rem;
          border-radius: 14px;
          background: #F6F5F2;
          border: 1px solid #E3E0DA;
          text-decoration: none;
          display: block;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .jw-sidebar-verify-badge:hover {
          border-color: rgba(232,101,10,0.4);
          box-shadow: 0 12px 32px -16px rgba(13,27,42,0.12);
        }
        .jw-sidebar-verify-badge-label {
          font-family: var(--jw-font-mono, 'JetBrains Mono', monospace);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E8650A;
          display: block;
          margin-bottom: 0.25rem;
        }
        .jw-sidebar-verify-badge-text {
          font-family: var(--jw-font-sans, 'Inter', sans-serif);
          font-size: 0.78rem;
          font-weight: 700;
          color: #0D1B2A;
          display: block;
        }
        .jw-sidebar-verify-badge-sub {
          font-size: 0.7rem;
          color: #6B7280;
          display: block;
          margin-top: 0.2rem;
          line-height: 1.4;
        }
      `}</style>

      <aside className="jw-sidebar w-64 hidden md:flex flex-col h-screen sticky top-[120px] border-r border-[#E3E0DA] overflow-y-auto pt-6 pb-8 flex-shrink-0">
        <div className="jw-sidebar-label">◆ Why JVTO</div>

        <nav className="px-2">
          {WHY_MENU.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`jw-sidebar-link${isActive ? " active" : ""}`}
              >
                <span className="jw-sidebar-link-icon">
                  <Icon size={14} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="jw-sidebar-divider" />

        <Link href="/verify-jvto" prefetch={false} className="jw-sidebar-verify-badge">
          <span className="jw-sidebar-verify-badge-label">◆ Quick Access</span>
          <span className="jw-sidebar-verify-badge-text">Verify JVTO</span>
          <span className="jw-sidebar-verify-badge-sub">
            Legal docs, licenses &amp; proof library
          </span>
        </Link>
      </aside>
    </>
  );
}
