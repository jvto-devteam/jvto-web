// app/lib/site.ts
const PRODUCTION_ORIGIN = "https://javavolcano-touroperator.com";

const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

// BASE_URL: origin canonical untuk deployment ini. Fallback ke origin produksi
// bila env belum di-set, supaya URL absolut (sitemap/indexnow) tak pernah pecah
// dan route sitemap.ts tak bisa 500 — sebelumnya file ini `throw` saat env kosong.
// Gating index-atau-tidak dipisah ke isIndexableDeployment() di bawah.
export const BASE_URL = raw || PRODUCTION_ORIGIN;

export const url = (path: string) => {
  if (path === "/" || path === "") return BASE_URL;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path}`;
};

export const now = () => new Date();

// Hanya origin produksi asli yang boleh diindeks mesin pencari. Preview/help
// (host lain, atau env kosong) → false, dipakai untuk mengirim `noindex`.
// Fail-safe: default false, jadi box yang tak dikonfigurasi tak akan bocor terindeks.
export const isIndexableDeployment = () => raw === PRODUCTION_ORIGIN;
