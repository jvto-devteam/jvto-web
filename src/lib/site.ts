// app/lib/site.ts
const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (!env) {
  // Biar fail-fast kalau lupa set env (sesuai “ENV only”).
  throw new Error("NEXT_PUBLIC_SITE_URL belum diset.");
}

// normalisasi: buang trailing slash
export const BASE_URL = env.replace(/\/+$/, "");

export const url = (path: string) => {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path}`;
};

export const now = () => new Date();
