import ssot from "@/content/why-jvto-ssot.json";

export const BASE_URL = "https://javavolcano-touroperator.com";

export type SSOT = typeof ssot;
export type SSOTPage = SSOT["pages"][number];

export function getSSOT(): SSOT {
  return ssot as SSOT;
}

export function getPageByRoute(route: string): SSOTPage | undefined {
  const data = getSSOT();
  return data.pages.find((p) => p.route === route);
}

export function getOrg() {
  return getSSOT().organization;
}

export function getProofItems() {
  return getSSOT().proof_items;
}

export function getAssetsInventory() {
  return getProofItems().assets_inventory;
}

export function getAssetBySlug(slug: string) {
  return getAssetsInventory().find((a) => a.slug === slug);
}

export function getCrewHighlights() {
  return getProofItems().crew_highlights ?? [];
}

export function getPressCoverage() {
  return getProofItems().press_coverage ?? [];
}

export function getReviewPlatforms() {
  return getProofItems().review_platforms ?? [];
}

/** helper: build absolute url */
export function absUrl(pathname: string) {
  if (!pathname.startsWith("/")) return `${BASE_URL}/${pathname}`;
  return `${BASE_URL}${pathname}`;
}
