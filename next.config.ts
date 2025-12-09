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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'javavolcano-touroperator.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
      {
        source: "/about",
        destination: "/why-jvto",
        permanent: true,
      },
      {
        source: "/office",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/review",
        destination: "/why-jvto/reviews",
        permanent: true,
      },
      {
        source: "/reviews",
        destination: "/why-jvto/reviews",
        permanent: true,
      },
      {
        source: "/what-set-us-apart",
        destination: "/why-jvto/the-jvto-difference",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/travel-guide/faq",
        permanent: true,
      },
      {
        source: "/destinations/ijen",
        destination: "/destinations/ijen-crater",
        permanent: true,
      },
      {
        source: "/destinations/bromo",
        destination: "/destinations/mount-bromo",
        permanent: true,
      },
      {
        source: "/destinations/tumpak-sewu",
        destination: "/destinations/tumpak-sewu-waterfall",
        permanent: true,
      },
      {
        source: "/destinations/madakaripura",
        destination: "/destinations/madakaripura-waterfall",
        permanent: true,
      },
      {
        source: "/packages",
        destination: "/tours",
        permanent: true,
      },
      {
        source: "/packages/surabaya",
        destination: "/tours/from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/bali",
        destination: "/tours/from-bali",
        permanent: true,
      },
      {
        source: "/experiences/volcano-trekking-tours",
        destination: "/tours/style/volcano-trekking-tours",
        permanent: true,
      },
      {
        source: "/experiences/romantic-gateway",
        destination: "/tours/style/romantic-gateway",
        permanent: true,
      },
      {
        source: "/experiences/photography-tours",
        destination: "/tours/style/photography-tours",
        permanent: true,
      },
      {
        source: "/experiences/family-tours",
        destination: "/tours/style/family-tours",
        permanent: true,
      },

      // Packages with query params
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "bromo" }],
        destination: "/tours/destination/mount-bromo",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "ijen" }],
        destination: "/tours/destination/ijen-crater",
        permanent: true,
      },
      {
        source: "/packages",
        has: [
          { type: "query", key: "destinations", value: "taman-safari-prigen" },
        ],
        destination: "/tours/destination/taman-safari-prigen",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "tumpak-sewu" }],
        destination: "/tours/destination/tumpak-sewu-waterfall",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "papuma-beach" }],
        destination: "/tours/destination/papuma-beach",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "madakaripura" }],
        destination: "/tours/destination/madakaripura-waterfall",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "surabaya" }],
        destination: "/tours/destination/surabaya",
        permanent: true,
      },
      {
        source: "/packages",
        has: [{ type: "query", key: "destinations", value: "malang" }],
        destination: "/tours/destination/malang",
        permanent: true,
      },
      // Surabaya Packages
      {
        source: "/packages/surabaya/1d1n",
        destination: "/tours/from-surabaya/1d1n",
        permanent: true,
      },
      {
        source: "/packages/surabaya/2d1n",
        destination: "/tours/from-surabaya/2d1n",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n",
        destination: "/tours/from-surabaya/3d2n",
        permanent: true,
      },
      {
        source: "/packages/surabaya/4d3n",
        destination: "/tours/from-surabaya/4d3n",
        permanent: true,
      },
      {
        source: "/packages/surabaya/5d4n",
        destination: "/tours/from-surabaya/5d4n",
        permanent: true,
      },
      {
        source: "/packages/surabaya/6d5n",
        destination: "/tours/from-surabaya/6d5n",
        permanent: true,
      },

      // Bali Packages
      {
        source: "/packages/bali/2d1n",
        destination: "/tours/from-bali/2d1n",
        permanent: true,
      },
      {
        source: "/packages/bali/3d2n",
        destination: "/tours/from-bali/3d2n",
        permanent: true,
      },
      {
        source: "/packages/bali/4d3n",
        destination: "/tours/from-bali/4d3n",
        permanent: true,
      },
      {
        source: "/packages/bali/5d4n",
        destination: "/tours/from-bali/5d4n",
        permanent: true,
      },

      // Detailed Surabaya Packages
      {
        source: "/packages/surabaya/1d1n/1",
        destination: "/tours/1-day-bromo-midnight-experience-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/2d1n/1",
        destination: "/tours/2-day-bromo-sunrise-adventure-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/2d1n/2",
        destination: "/tours/2-day-ijen-blue-fire-expedition-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/1",
        destination:
          "/tours/3-day-bromo-and-madakaripura-waterfall-and-ijen-overland-from-surabaya-to-bali",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/2",
        destination:
          "/tours/3-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/4",
        destination:
          "/tours/3-day-bromo-and-madakaripura-waterfall-getaway-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/5",
        destination: "/tours/3-day-bromo-and-ijen-volcano-trip-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/6",
        destination:
          "/tours/3-day-tumpak-sewu-waterfall-and-bromo-explorer-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/3d2n/7",
        destination:
          "/tours/3-day-taman-safari-prigen-and-bromo-and-madakaripura-waterfall-family-adventure-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/4d3n/1",
        destination:
          "/tours/4-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/4d3n/2",
        destination:
          "/tours/4-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/4d3n/3",
        destination:
          "/tours/4-day-tumpak-sewu-waterfall-and-bromo-and-ijen-adventure-from-surabaya-to-bali",
        permanent: true,
      },
      {
        source: "/packages/surabaya/5d4n/5",
        destination:
          "/tours/5-day-ijen-and-bromo-and-madakaripura-waterfall-and-malang-city-adventure-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/5d4n/8",
        destination:
          "/tours/5-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-surabaya",
        permanent: true,
      },
      {
        source: "/packages/surabaya/6d5n/1",
        destination:
          "/tours/6-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-and-malang-city-discovery-from-surabaya",
        permanent: true,
      },

      // Bali Detailed Packages
      {
        source: "/packages/bali/3d2n/1",
        destination:
          "/tours/3-day-ijen-and-bromo-and-madakaripura-waterfall-from-bali-to-surabaya",
        permanent: true,
      },
      {
        source: "/packages/bali/3d2n/2",
        destination: "/tours/3-day-bromo-and-ijen-volcano-discovery-from-bali",
        permanent: true,
      },
      {
        source: "/packages/bali/4d3n/2",
        destination:
          "/tours/4-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-bali-to-surabaya",
        permanent: true,
      },
      {
        source: "/packages/bali/5d4n/2",
        destination:
          "/tours/5-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-bali-to-surabaya",
        permanent: true,
      },

      // Misc
      {
        source: "/all-inclusive",
        destination: "/why-jvto/the-jvto-difference/",
        permanent: true,
      },
      {
        source: "/police-escort",
        destination: "/why-jvto/the-jvto-difference/",
        permanent: true,
      },
      {
        source: "/medical-checkup",
        destination: "/why-jvto/the-jvto-difference/",
        permanent: true,
      },
      {
        source: "/travel-tshirt",
        destination: "/why-jvto/the-jvto-difference/",
        permanent: true,
      },
      {
        source: "/how-it-works",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/reserve-now-pay-later",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/support/reserve-now-pay-later",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/how-to-book",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/payment-information",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/travel-guide/booking-payment-cancellation/",
        permanent: true,
      },
      {
        source: "/flip/jvr/legality",
        destination: "/why-jvto/the-jvto-difference",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
