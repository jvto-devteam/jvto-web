// components/content/EvidenceBox.tsx
import Link from "@/components/website/AppLink";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

type Evidence = {
  verify_anchor?: string;
  tags?: string[];
  asset_slugs?: string[];
};

function normalizeInternalHref(href?: string) {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("/")) return href;
  return `/${href}`;
}

export function EvidenceBox({
  evidence,
  title = "Evidence",
  description,
}: {
  evidence?: Evidence;
  title?: string;
  description?: string;
}) {
  if (!evidence) return null;

  const proofHref = normalizeInternalHref(
    evidence.verify_anchor || "/verify-jvto",
  );
  if (!proofHref) return null;

  const isExternal = /^https?:\/\//.test(proofHref);

  return (
    <aside
      style={{
        marginTop: "1.5rem",
        borderRadius: "0.875rem",
        border: "1px solid rgba(159,206,51,0.30)",
        background: "#f7faf0",
        padding: "1.125rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.25rem",
        flexWrap: "wrap",
      }}
    >
      {/* Left: icon + text */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.5rem",
            background: "#9fce33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={14} color="#0c0e09" />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#2a3a18",
              marginBottom: "0.2rem",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "#6b7a55",
              lineHeight: 1.55,
            }}
          >
            {description ??
              "Open the Proof Library to view documents and verification links for this claim."}
          </div>
        </div>
      </div>

      {/* Right: CTA button */}
      <Link
        href={proofHref}
        prefetch={isExternal ? undefined : false}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.55rem 1.1rem",
          borderRadius: "0.625rem",
          background: "#0c0e09",
          color: "#9fce33",
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.75rem",
          fontWeight: 700,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
        className="jvto-evidence-btn"
      >
        Open Proof Library <ArrowUpRight size={13} />
      </Link>

      {/* Disclaimer */}
      <p
        style={{
          width: "100%",
          margin: 0,
          paddingTop: "0.625rem",
          borderTop: "1px solid #dde8c0",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.58rem",
          color: "#9aaa80",
        }}
      >
        If a statement cannot be independently verified, treat it as unverified.
      </p>

      <style>{`
        .jvto-evidence-btn:hover {
          background: #9fce33 !important;
          color: #0c0e09 !important;
        }
      `}</style>
    </aside>
  );
}
