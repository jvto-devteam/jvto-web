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
        borderRadius: "var(--radius-jvto-sm)",
        border: "1px solid rgba(140,198,63,0.30)",
        background: "var(--color-jvto-off)",
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
            background: "var(--color-jvto-lime)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={14} color="var(--color-jvto-navy)" />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-raleway), sans-serif",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--color-jvto-navy)",
              marginBottom: "0.2rem",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "var(--color-jvto-muted)",
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
          background: "var(--color-jvto-navy)",
          color: "var(--color-jvto-lime)",
          fontFamily: "var(--font-raleway), sans-serif",
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
          borderTop: "1px solid var(--color-jvto-border)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.58rem",
          color: "var(--color-jvto-muted)",
        }}
      >
        If a statement cannot be independently verified, treat it as unverified.
      </p>

      <style>{`
        .jvto-evidence-btn:hover {
          background: var(--color-jvto-lime) !important;
          color: var(--color-jvto-navy) !important;
        }
      `}</style>
    </aside>
  );
}
