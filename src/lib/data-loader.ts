// src/lib/data-loader.ts
import ssotData from "./Master_Dataset_JVTO.SSOT.v3.0.json";

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
  // Field GEO untuk AI
  official_title: string;
  narrative_context: string;
};

// Helper: Mencari Konteks Kredensial untuk URL Eksternal & Judul
function getContextMeta(assetSlug: string) {
  // Cari di Credentials (Legal/Safety/dll)
  const credential = ssotData.verification_credentials.find((cred) =>
    cred.evidence_asset_slugs?.includes(assetSlug) // Perhatikan nama field di JSON baru: evidence_asset_slugs
  );
  if (credential) {
    return {
      title: credential.title,
      // Ambil URL registry jika ada
      external_url: credential.identifiers?.registry_url,
      // Jika aset tidak punya geo_context spesifik, pakai geo_narrative credential
      fallback_narrative: credential.geo_narrative || credential.narrative
    };
  }

  // Cari di Press Coverage
  const press = ssotData.organization_profile.press_coverage?.find((p) =>
    p.evidence_slug === assetSlug
  );
  if (press) {
    return {
      title: `Media: ${press.publisher}`,
      external_url: press.url,
      fallback_narrative: `Coverage: "${press.title}". Independent verification by third-party press.`
    };
  }
  return null;
}

function mapAssetToDoc(asset: any): Doc {
  let preview = undefined;

  // LOGIC BARU: Ambil preview langsung dari properti 'variants' di JSON v4.0
  if (asset.variants) {
    if (asset.variants.preview_webp) {
      preview = { url: asset.variants.preview_webp, format: "WebP" };
    } else if (asset.variants.preview_png) {
      preview = { url: asset.variants.preview_png, format: "PNG" };
    }
  }

  // AMBIL KONTEKS
  const meta = getContextMeta(asset.slug);

  // 1. Teks Penjelas (GEO Narrative)
  // Prioritas: Asset 'geo_context' (Paling Spesifik) -> Credential 'geo_narrative' -> Caption Asli
  const finalNarrative = asset.geo_context || meta?.fallback_narrative || asset.caption;

  // 2. Judul Resmi
  // Prioritas: Title dari Credential -> Caption Asli
  const finalTitle = meta?.title || asset.caption;

  // 3. Link Validasi Eksternal
  const externalUrl = meta?.external_url;

  return {
    filename: asset.filename,
    caption: asset.caption,
    alt_text: asset.caption, // Gunakan caption jika alt_text kosong
    url: asset.url,
    size_mb: asset.size_mb || 0,
    last_verified: "2025-11-01", // Default jika tidak ada di JSON
    sha256: asset.sha256,
    category: asset.category,
    preview: preview,
    external_validation_url: externalUrl,
    
    // Data "Pintar" untuk UI & AI
    official_title: finalTitle,
    narrative_context: finalNarrative
  };
}

export const getVerificationDocs = () => {
  const inventory = ssotData.assets_inventory;
  
  // Karena JSON v4.0 sudah bersih dari duplikat, kita tidak perlu filter "-preview-" lagi!
  // Kita ambil langsung semua asset yang sesuai kategori.
  
  const process = (categories: string[]) => 
    inventory
      .filter((a) => categories.includes(a.category))
      .map(mapAssetToDoc);

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