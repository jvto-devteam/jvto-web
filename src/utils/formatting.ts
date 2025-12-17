// Utility: slug → Title Case
export function slugToTitle(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\/tours\//g, "") // remove prefix
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Utility: price guard + formatter
export function isValidPrice(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

export function formatIDR(n: number) {
    return `IDR ${Math.round(n).toLocaleString("id-ID")}`;
}
