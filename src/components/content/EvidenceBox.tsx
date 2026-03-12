// components/content/EvidenceBox.tsx
import Link from "next/link";

type Evidence = {
  verify_anchor?: string; // e.g. "/verify-jvto#legal"
  // tags and asset_slugs may exist in DB but are not displayed to users
  tags?: string[];
  asset_slugs?: string[];
};

function normalizeInternalHref(href?: string) {
  if (!href) return null;
  // Ensure leading slash for internal routes
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

  return (
    <aside className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-neutral-700">
            {description ??
              "Open the Proof Library to view documents and verification links for this claim."}
          </div>
        </div>

        <Link
          href={proofHref}
          className="shrink-0 rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Open Proof Library
        </Link>
      </div>

      <div className="mt-3 text-xs text-neutral-600">
        If a statement cannot be independently verified, treat it as unverified.
      </div>
    </aside>
  );
}
