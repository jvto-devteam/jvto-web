// src/lib/data-loader.ts
import ssotData from "./Master_Dataset_JVTO.SSOT.v2.1.public.ready_to_copy.json";

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
  external_validation_url?: string; // NEW: Field untuk link ke AHU/Media
};

function mapAssetToDoc(asset: any, allAssets: any[]): Doc {
  let preview = undefined;

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

  // LOGIC MANUAL: Menyuntikkan External Link berdasarkan Slug/Kategori
  // Ini memenuhi syarat "Cross-Referencing" dalam strategi
  let externalUrl = undefined;

  // 1. Link ke Database Pemerintah (AHU) untuk Legalitas
  if (asset.slug.includes("nib") || asset.category === "BusinessID") {
    externalUrl =
      "https://ahu.go.id/sabh/perseroan/qrcode/?kode=NDAyMzAyMDYzNTEwMjE3NF8yXzA4IEZlYnJ1YXJpIDIwMjNfMDggRmVicnVhcmkgMjAyMw==";
  }

  // 2. Link ke Artikel Berita Asli (High Domain Authority)
  if (asset.slug.includes("detik")) {
    externalUrl =
      "https://news.detik.com/berita-jawa-timur/d-5492690/suka-duka-polisi-pariwisata-bondowoso-tegakkan-prokes-sambil-lawan-dingin";
  }
  if (asset.slug.includes("radarjember")) {
    externalUrl =
      "https://radarjember.jawapos.com/bondowoso/791102263/polpar-dibentuk-untuk-mendukung-ijen-geopark";
  }

  // 3. Link ke ISIC untuk Student Deals
  if (asset.category === "Membership" && asset.slug.includes("isic")) {
    externalUrl = "https://www.isic.org/discounts/?providerId=259268";
  }

  return {
    filename: asset.filename,
    caption: asset.caption,
    alt_text: asset.alt_text,
    url: asset.url,
    size_mb:
      asset.size_mb || (asset.size_bytes ? asset.size_bytes / 1024 / 1024 : 0),
    last_verified: asset.last_verified_iso || "2026-01-01",
    sha256: asset.sha256,
    category: asset.category,
    preview: preview,
    external_validation_url: externalUrl, // Return link eksternal
  };
}

export const getVerificationDocs = () => {
  const inventory = ssotData.assets_inventory;
  const mainAssets = inventory.filter((a) => !a.slug.includes("-preview-"));
  const allAssets = inventory;

  return {
    company_registration: mainAssets
      .filter((a) => a.category === "BusinessID" || a.category === "License")
      .map((a) => mapAssetToDoc(a, allAssets)),
    police_clearances: mainAssets
      .filter((a) => a.category === "PoliceDocs")
      .map((a) => mapAssetToDoc(a, allAssets)),
    operations: mainAssets
      .filter((a) => a.category === "OpsPhoto" || a.category === "Facility")
      .map((a) => mapAssetToDoc(a, allAssets)),
    health_safety: mainAssets
      .filter((a) => a.category === "Screening")
      .map((a) => mapAssetToDoc(a, allAssets)),
    company_history: mainAssets
      .filter((a) => a.category === "History")
      .map((a) => mapAssetToDoc(a, allAssets)),
    press_coverage: mainAssets
      .filter((a) => a.category === "Press")
      .map((a) => mapAssetToDoc(a, allAssets)),
    membership: mainAssets
      .filter((a) => a.category === "Membership")
      .map((a) => mapAssetToDoc(a, allAssets)),
  };
};
