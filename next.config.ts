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
    // Dev & production berjalan di server yang sama.
    // javavolcano-touroperator.com di /etc/hosts resolve ke 127.0.0.1,
    // sehingga Next.js image optimizer menolak fetch (private IP protection).
    // allowPrivateIpAddresses mengizinkan ini — aman karena hanya aktif di dev.
    unoptimized: process.env.NEXT_PUBLIC_ENV === "dev",
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
      // ── Tambahan: izinkan semua subdomain *.javavolcano-touroperator.com ──
      // Mencakup dev., staging., dan subdomain lain di masa depan
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
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
  async redirects() {
    return [
      // MERGE: guest-voices-reviews is a duplicate of reviews (identical H1 + purpose, no FAQ).
      {
        source: "/why-jvto/guest-voices-reviews",
        destination: "/why-jvto/reviews",
        permanent: true,
      },
      // MERGE: history-roots covers the same topic as our-story (GEO doc: our-story = (history-roots)).
      // our-story is the narrative-complete canonical; history-roots audit-trail framing is secondary.
      {
        source: "/why-jvto/history-roots",
        destination: "/why-jvto/our-story",
        permanent: true,
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