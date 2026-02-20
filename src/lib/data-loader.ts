import ssotData from "./Master_Dataset_JVTO.SSOT.v3.0.json";

export type Doc = {
  filename: string;
  caption: string;
  alt_text?: string;
  url: string; // file asli
  size_mb: number;
  last_verified: string;
  sha256?: string;
  category: string;
  preview?: { url: string; format: string }; // thumbnail
  external_validation_url?: string;

  // Field Khusus GEO
  official_title: string;
  narrative_context: string;
};

function getOriginalUrl(asset: any): string {
  if (asset.file_url) {
    try {
      const urlObj = new URL(asset.url);
      const pathParts = urlObj.pathname.split("/");
      pathParts.pop(); // hapus nama file thumbnail
      pathParts.push(asset.file_url);
      urlObj.pathname = pathParts.join("/");
      return urlObj.toString();
    } catch (e) {
      console.error("Error building URL for asset", asset.filename, e);
      return asset.url;
    }
  }
  return asset.url;
}

function getContextMeta(assetSlug: string) {
  const baseSlug = assetSlug.replace(/-preview-(png|webp)$/, "");

  const credential = ssotData.verification_credentials?.find((cred) =>
    cred.evidence_asset_slugs?.includes(baseSlug),
  );

  if (credential) {
    return {
      title: credential.title,
      external_url: credential.identifiers?.registry_url,
      fallback_narrative: credential.geo_narrative || credential.narrative,
    };
  }

  const press = ssotData.organization_profile?.press_coverage?.find(
    (p) => p.evidence?.proof_asset_slug === baseSlug,
  );

  if (press) {
    return {
      title: `Media Verification: ${press.publisher}`,
      external_url: press.url,
      fallback_narrative: `Coverage: "${press.title}". Independent verification by third-party press.`,
    };
  }

  return null;
}

function mapAssetToDoc(asset: any): Doc {
  const meta = getContextMeta(asset.slug);
  const finalNarrative =
    asset.geo_context || meta?.fallback_narrative || asset.caption;
  const finalTitle = meta?.title || asset.caption;
  const externalUrl = meta?.external_url;

  // Tentukan preview: gunakan field preview yang sudah ada
  let preview = undefined;
  if (asset.preview) {
    const formatMatch = asset.preview.match(/\.(webp|png|jpg|jpeg)$/i);
    const format = formatMatch ? formatMatch[1].toUpperCase() : "IMAGE";
    preview = { url: asset.preview, format };
  }

  // URL file asli
  const originalUrl = getOriginalUrl(asset);

  return {
    filename: asset.filename,
    caption: asset.caption,
    alt_text: asset.alt_text || asset.caption,
    url: originalUrl,
    size_mb:
      asset.size_mb || (asset.size_bytes ? asset.size_bytes / 1024 / 1024 : 0),
    last_verified: asset.last_verified_iso || "2025-01-01",
    sha256: asset.sha256,
    category: asset.category,
    preview: preview,
    external_validation_url: externalUrl,
    official_title: finalTitle,
    narrative_context: finalNarrative,
  };
}

export const getVerificationDocs = () => {
  const inventory = ssotData.assets_inventory;

  // Hanya aset dengan is_show = true
  const visibleAssets = inventory.filter((a) => a.is_show === true);

  const groupByCategory = (categories: string[]) =>
    visibleAssets
      .filter((a) => categories.includes(a.category))
      .map((a) => mapAssetToDoc(a));

  return {
    company_registration: groupByCategory(["BusinessID", "License"]),
    police_clearances: groupByCategory(["PoliceDocs"]),
    operations: groupByCategory(["OpsPhoto", "Facility"]),
    health_safety: groupByCategory(["Screening"]),
    company_history: groupByCategory(["History"]),
    press_coverage: groupByCategory(["Press"]),
    membership: groupByCategory(["Membership"]),
    founder: groupByCategory(["Founder"]),
    credentials: groupByCategory(["Credentials"]),
  };
};
