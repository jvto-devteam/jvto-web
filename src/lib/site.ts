// app/lib/site.ts
const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (!env && process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Fail-fast on non-Vercel production builds. Vercel preview deploys without
  // NEXT_PUBLIC_SITE_URL configured fall back to the canonical domain so the
  // build does not abort while collecting page data for sitemap/route handlers.
  throw new Error("NEXT_PUBLIC_SITE_URL belum diset.");
}

const fallback = "https://javavolcano-touroperator.com";
// normalisasi: buang trailing slash
export const BASE_URL = (env ?? fallback).replace(/\/+$/, "");

export const url = (path: string) => {
  if (path === "/" || path === "") return BASE_URL;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path}`;
};

export const now = () => new Date();
