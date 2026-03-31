// app/lib/site.ts
const fallbackBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  "https://javavolcano-touroperator.com";

// normalisasi: buang trailing slash
export const BASE_URL = fallbackBaseUrl.replace(/\/+$/, "");

export const url = (path: string) => {
  if (path === "/" || path === "") return BASE_URL;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path}`;
};

export const now = () => new Date();
