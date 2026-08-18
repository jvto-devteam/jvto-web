// next.config.js
// Matches robots.ts, which allows every AI-training crawler (GPTBot, CCBot,
// ClaudeBot, Google-Extended, Bytespider, etc.) — ai-train=yes so the header
// doesn't contradict what the site actually permits. Owner decision 2026-08-18.
const CONTENT_SIGNAL = "search=yes,ai-train=yes,use=reference";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: false,
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
      {
        protocol: "https",
        hostname: "magma.vsi.esdm.go.id",
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
            key: "Content-Signal",
            value: CONTENT_SIGNAL,
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              img-src 'self' data: https: blob:;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
              style-src 'self' 'unsafe-inline' https:;
              connect-src 'self' https: blob:;
              font-src 'self' https: data:;
              frame-src 'self' https:;
              worker-src 'self' blob:;
              child-src 'self' blob:;
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
      // AUDIT 2026-05-04: safety-leadership is a duplicate of the-jvto-difference (same sections/body).
      {
        source: "/why-jvto/safety-leadership",
        destination: "/why-jvto/the-jvto-difference",
        permanent: true,
      },
      // AUDIT 2026-05-04: local-team-operations covers the same topic as our-team (team roster).
      // our-team is canonical (dedicated page.tsx + full Person schemas).
      {
        source: "/why-jvto/local-team-operations",
        destination: "/why-jvto/our-team",
        permanent: true,
      },
      // AUDIT 2026-05-04: partners-verification content merged into community-standards.
      {
        source: "/why-jvto/partners-verification",
        destination: "/why-jvto/community-standards",
        permanent: true,
      },
      // Sub-pages of partners-verification — point to canonical locations.
      {
        source: "/why-jvto/partners-verification/hpwki",
        destination: "/why-jvto/community-standards",
        permanent: true,
      },
      {
        source: "/why-jvto/partners-verification/indecon",
        destination: "/why-jvto/community-standards",
        permanent: true,
      },
      {
        source: "/why-jvto/partners-verification/isic",
        destination: "/isic/student-package",
        permanent: true,
      },
      // AUDIT 2026-05-04: proof-transparency is a legacy page (SSOTRenderer, old builders).
      // verify-jvto is the canonical proof hub with full schema injection.
      {
        source: "/why-jvto/proof-transparency",
        destination: "/verify-jvto",
        permanent: true,
      },
      // AUDIT 2026-05-04: packing-list is a subset of packing-and-fitness (same topic, less content).
      {
        source: "/travel-guide/packing-list",
        destination: "/travel-guide/packing-and-fitness",
        permanent: true,
      },
      // AUDIT 2026-05-04: student-deals/isic duplicate of isic/student-package.
      {
        source: "/student-deals/isic",
        destination: "/isic/student-package",
        permanent: true,
      },
      // SEO AUDIT 2026-05-17 (QW-1): legacy Laravel routes → SSOT canonical URLs.
      // These are still indexed by Google alongside new Next.js routes (authority dilution).
      { source: "/about", destination: "/why-jvto/our-story", permanent: true },
      { source: "/faq", destination: "/travel-guide/faq", permanent: true },
      { source: "/reviews", destination: "/why-jvto/reviews", permanent: true },
      { source: "/all-inclusive", destination: "/policy/inclusions-exclusions", permanent: true },
      { source: "/student-package", destination: "/isic/student-package", permanent: true },
      { source: "/custom-package", destination: "/tours", permanent: true },
      { source: "/office", destination: "/contact", permanent: true },
      { source: "/how-to-book", destination: "/travel-guide/booking-information", permanent: true },
      { source: "/terms-and-condition", destination: "/policy", permanent: true },
      { source: "/blog", destination: "/travel-guide", permanent: true },
      { source: "/packages/yogyakarta", destination: "/tours", permanent: true },
      // Note: /packages/surabaya/3d2n/{N} skipped — legacy IDs need verification from GSC/server logs first.
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
