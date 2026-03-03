import fs from "node:fs";
import path from "node:path";

export type WhyJvtoSSOT = any;

export type NormalizedAsset = {
  id: string; // slug_norm
  title: string;
  category?: string;
  primary_url: string;
  preview_url?: string;
  sha256?: string;
  last_verified_iso?: string;
};

export type HealthScreeningEvidenceItem = {
  id?: string;
  title?: string;
  claim?: string;
  verification_url?: string;
  verification_urls?: string[];
  evidence_asset_slugs?: string[];
};

export type HealthScreeningBundle = {
  title: string;
  evidence_items: HealthScreeningEvidenceItem[];
  evidence_asset_slugs: string[];
};

function absUrlIfNeeded(u?: string): string | undefined {
  if (!u) return undefined;
  // Keep absolute URLs as-is; convert "/path" to absolute based on NEXT_PUBLIC_SITE_URL
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://javavolcano-touroperator.com";
    return `${base}${u}`;
  }
  return u;
}

export function loadWhyJvtoSSOT(): WhyJvtoSSOT {
  // Put the JSON in your repo and reference it here. Example location:
  // /src/lib/whyjvto/why-jvto-ssot.fixed4.json
  const rel = "src/lib/whyjvto/why-jvto-ssot.fixed4.json";
  const fp = path.join(process.cwd(), rel);
  const raw = fs.readFileSync(fp, "utf-8");
  return JSON.parse(raw);
}

export function normalizeAssets(
  ssot: WhyJvtoSSOT,
): Map<string, NormalizedAsset> {
  const assets: any[] = Array.isArray(ssot?.assets_inventory)
    ? ssot.assets_inventory
    : [];
  const out = new Map<string, NormalizedAsset>();

  for (const a of assets) {
    const slug_norm: string | undefined = a?.slug ?? a?.asset_slug;
    if (!slug_norm) continue;

    const title = a?.title ?? a?.caption ?? a?.filename ?? slug_norm;

    const primary_url: string | undefined = a?.url ?? a?.file_url;
    // published-only guard: only index assets that can be opened publicly
    if (!primary_url) continue;

    const preview_url = absUrlIfNeeded(a?.preview ?? a?.preview_url);
    out.set(slug_norm, {
      id: slug_norm,
      title,
      category: a?.category,
      primary_url: absUrlIfNeeded(primary_url)!, // ensure absolute if needed
      preview_url,
      sha256: a?.sha256,
      last_verified_iso: a?.last_verified_iso ?? a?.last_verified,
    });
  }
  return out;
}

export function getDeepPage(ssot: WhyJvtoSSOT, route: string): any | null {
  const pages: any[] = Array.isArray(ssot?.content_deltas?.deepseek_pages)
    ? ssot.content_deltas.deepseek_pages
    : [];
  const hit = pages.find((p) => p?.route === route);
  if (hit) return hit;

  const fallback: any[] = Array.isArray(ssot?.page_architecture?.SSOT_Pages)
    ? ssot.page_architecture.SSOT_Pages
    : [];
  return fallback.find((p) => p?.route === route) ?? null;
}

export function getCredential(ssot: WhyJvtoSSOT, id: string): any | null {
  const creds: any[] = Array.isArray(ssot?.verification_credentials)
    ? ssot.verification_credentials
    : [];
  return creds.find((c) => c?.id === id) ?? null;
}

export function buildHealthScreeningBundle(
  ssot: WhyJvtoSSOT,
): HealthScreeningBundle {
  const cred = getCredential(ssot, "health-screening");
  if (!cred) {
    // Fail-soft: PRD says this should exist in fixed4; if not, return empty bundle.
    return {
      title: "Ijen Health Screening",
      evidence_items: [],
      evidence_asset_slugs: [],
    };
  }
  return {
    title: cred?.title ?? "Ijen Health Screening",
    evidence_items: Array.isArray(cred?.evidence_items)
      ? cred.evidence_items
      : [],
    evidence_asset_slugs: Array.isArray(cred?.evidence_asset_slugs)
      ? cred.evidence_asset_slugs
      : [],
  };
}
