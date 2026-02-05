// src/lib/data-loader.ts
import ssotData from "./Master_Dataset_JVTO.SSOT.v3.0.json";

export type Doc = {
  filename: string;
  caption: string; // Teks pendek untuk manusia
  alt_text?: string;
  url: string;
  size_mb: number;
  last_verified: string;
  sha256?: string;
  category: string;
  preview?: { url: string; format: string };
  external_validation_url?: string;
  
  // Field Khusus GEO (Untuk Mesin Pencari/AI)
  official_title: string;    // Judul Resmi (misal: "Tourist Police Authority")
  narrative_context: string; // Paragraf Penjelas (misal: "Part of Ditpamobvit...")
};

// Helper: Mencari Parent Credential / Press Coverage untuk mengambil Konteks
function getContextMeta(assetSlug: string) {
  // 1. Cari di Credentials (Legal, Safety, History, Membership)
  const credential = ssotData.verification_credentials.find((cred) =>
    cred.evidence_asset_slugs?.includes(assetSlug)
  );
  
  if (credential) {
    return {
      title: credential.title,
      // Ambil URL registrasi pemerintah jika ada
      external_url: credential.identifiers?.registry_url,
      // Fallback narrative jika di level asset tidak ada geo_context
      fallback_narrative: credential.geo_narrative || credential.narrative
    };
  }

  // 2. Cari di Press Coverage (Media)
  // Perhatikan: Di JSON Anda, slug aset ada di dalam objek `evidence`
  const press = ssotData.organization_profile.press_coverage?.find((p) =>
    p.evidence?.proof_asset_slug === assetSlug
  );

  if (press) {
    return {
      title: `Media Verification: ${press.publisher}`,
      external_url: press.url,
      fallback_narrative: `Coverage: "${press.title}". Independent verification by third-party press.`
    };
  }

  return null;
}

function mapAssetToDoc(asset: any, allAssets: any[]): Doc {
  let preview = undefined;

  // LOGIC: Mencari file preview secara manual karena struktur Flat
  // Kita cari aset lain yang slug-nya = "slug-asli" + "-preview-webp"
  if (asset.url.endsWith(".pdf")) {
    const previewSlugWebP = asset.slug + "-preview-webp";
    const previewAssetWebP = allAssets.find((a) => a.slug === previewSlugWebP);

    if (previewAssetWebP) {
      preview = { url: previewAssetWebP.url, format: "WebP" };
    } else {
      // Fallback ke PNG
      const previewSlugPng = asset.slug + "-preview-png";
      const previewAssetPng = allAssets.find((a) => a.slug === previewSlugPng);
      if (previewAssetPng)
        preview = { url: previewAssetPng.url, format: "PNG" };
    }
  }

  // AMBIL KONTEKS GEO
  const meta = getContextMeta(asset.slug);

  // 1. Teks Penjelas (GEO Narrative)
  // Prioritas: Asset 'geo_context' (Spesifik Gambar) -> Credential 'geo_narrative' (Umum) -> Caption Asli
  const finalNarrative = asset.geo_context || meta?.fallback_narrative || asset.caption;

  // 2. Judul Resmi
  // Prioritas: Title Credential -> Caption Asli
  const finalTitle = meta?.title || asset.caption;

  // 3. Link Validasi Eksternal
  const externalUrl = meta?.external_url;

  return {
    filename: asset.filename,
    caption: asset.caption,
    alt_text: asset.alt_text || asset.caption,
    url: asset.url,
    size_mb: asset.size_mb || (asset.size_bytes ? asset.size_bytes / 1024 / 1024 : 0),
    last_verified: asset.last_verified_iso || "2025-01-01",
    sha256: asset.sha256,
    category: asset.category,
    preview: preview,
    external_validation_url: externalUrl,
    
    // Data Siap Pakai untuk UI
    official_title: finalTitle,
    narrative_context: finalNarrative
  };
}

export const getVerificationDocs = () => {
  const inventory = ssotData.assets_inventory;
  
  // Filter 1: Ambil aset utama saja (bukan file preview -preview-png/webp)
  // File preview hanya digunakan sebagai thumbnail, bukan entitas utama.
  const mainAssets = inventory.filter((a) => !a.slug.includes("-preview-"));
  
  // Reference ke semua aset (termasuk preview) untuk lookup
  const allAssets = inventory;

  // Helper mapping
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