// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    allowPrivateIpAddresses: process.env.NEXT_PUBLIC_ENV === "dev",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "legacy.javavolcano-touroperator.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "javavolcano-touroperator.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.javavolcano-touroperator.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "user-images.trustpilot.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 1. WAJIB: HSTS (Supaya browser memaksa pakai HTTPS)
          // Ini yang bikin nilaimu merah (-20 poin) sebelumnya
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // 2. WAJIB: Anti-Clickjacking
          // Ini juga bikin merah (-20 poin) sebelumnya
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // 3. Tambahan keamanan standar
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 4. Content Security Policy (Punya kamu)
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              img-src 'self' data: https: blob:;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
              style-src 'self' 'unsafe-inline' https:;
              connect-src 'self' https:;
              font-src 'self' https: data:;
              frame-src 'self' https:;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/octo/:path*",
        destination:
          "https://legacy.javavolcano-touroperator.com/api/octo/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
