// app/lib/site.ts
const rawPublicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
const publicSiteUrlIsLocal =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(rawPublicSiteUrl);

const fallbackBaseUrl =
  (rawPublicSiteUrl && (!process.env.VERCEL || !publicSiteUrlIsLocal)
    ? rawPublicSiteUrl
    : "") ||
  process.env.NEXTAUTH_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "https://javavolcano-touroperator.com";

// normalisasi: buang trailing slash
export const BASE_URL = fallbackBaseUrl.replace(/\/+$/, "");

export const url = (path: string) => {
  if (path === "/" || path === "") return BASE_URL;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path}`;
};

export const now = () => new Date();
