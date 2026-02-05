// src/lib/data-loader.ts
import ssotData from "@/lib/Master_Dataset_JVTO.SSOT.v3.0.json";

export type Doc = {
  filename: string;
  caption?: string;
  alt_text?: string;
  url: string;
  size_mb: number;
  last_verified: string;
  sha256?: string;
  category: string;
  preview?: { url: string; format: string };
  external_validation_url?: string;
  // Field GEO Baru
  official_title: string;
  narrative_context: string;
};

// Helper: Mencari Konteks Kredensial untuk URL Eksternal & Judul
function getContextMeta(assetSlug: string) {
  // Cari di Credentials
  const credential = ssotData.verification_credentials.find((cred) =>
    cred.evidence_asset_slugs?.includes(assetSlug),
  );
  if (credential) {
    return {
      title: credential.title,
      // Ambil URL registry jika ada
      external_url:
        credential.identifiers?.registry_url ||
        (credential as any).external_url,
      // Fallback narrative dari credential (jika asset tidak punya geo_context)
      fallback_narrative: credential.geo_narrative || credential.narrative,
    };
  }

  // Cari di Press Coverage
  const press = ssotData.organization_profile.press_coverage?.find(
    (p) => p.evidence?.proof_asset_slug === assetSlug,
  );
  if (press) {
    return {
      title: `Media: ${press.publisher}`,
      external_url: press.url,
      fallback_narrative: `Coverage: "${press.title}". Independent verification by third-party press.`,
    };
  }
  return null;
}

function mapAssetToDoc(asset: any, allAssets: any[]): Doc {
  let preview = undefined;

  // Logic Preview Image (Cari file preview terpisah di daftar flat)
  if (asset.url.endsWith(".pdf")) {
    const previewSlug = asset.slug + "-preview-webp";
    const previewAsset = allAssets.find((a) => a.slug === previewSlug);

    if (previewAsset) {
      preview = { url: previewAsset.url, format: "WebP" };
    } else {
      const previewSlugPng = asset.slug + "-preview-png";
      const previewAssetPng = allAssets.find((a) => a.slug === previewSlugPng);
      if (previewAssetPng)
        preview = { url: previewAssetPng.url, format: "PNG" };
    }
  }

  // AMBIL KONTEKS
  const meta = getContextMeta(asset.slug);

  // 1. Teks Penjelas (GEO Narrative)
  // Prioritas: Asset 'geo_context' (Paling Spesifik) -> Credential 'geo_narrative' -> Caption Asli
  const finalNarrative =
    asset.geo_context || meta?.fallback_narrative || asset.caption;

  // 2. Judul Resmi
  const finalTitle = meta?.title || asset.caption;

  // 3. Link Validasi Eksternal
  const externalUrl = meta?.external_url;

  return {
    filename: asset.filename,
    caption: asset.caption,
    alt_text: asset.alt_text || asset.caption,
    url: asset.url,
    size_mb:
      asset.size_mb || (asset.size_bytes ? asset.size_bytes / 1024 / 1024 : 0),
    last_verified: asset.last_verified_iso || "2026-01-01",
    sha256: asset.sha256,
    category: asset.category,
    preview: preview,
    external_validation_url: externalUrl,

    // Data "Pintar" untuk UI & AI
    official_title: finalTitle,
    narrative_context: finalNarrative,
  };
}

const getVerificationDocs = () => {
  const inventory = ssotData.assets_inventory;

  // Filter: Kita tidak ingin menampilkan file "-preview-" sebagai entry utama di UI
  const mainAssets = inventory.filter((a) => !a.slug.includes("-preview-"));
  const allAssets = inventory; // Butuh semua aset untuk lookup preview

  const process = (categories: string[]) =>
    mainAssets
      .filter((a) => categories.includes(a.category))
      .map((a) => mapAssetToDoc(a, allAssets));

  return {
    company_registration: process(["BusinessID", "License"]),
    police_clearances: process(["PoliceDocs"]),
    operations: process(["OpsPhoto", "Facility"]),
    health_safety: process(["Screening"]),
    company_history: process(["History"]),
    press_coverage: process(["Press"]),
    membership: process(["Membership"]),
  };
};

export default getVerificationDocs;
