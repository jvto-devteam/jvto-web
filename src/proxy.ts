// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // trailing slash
  if (pathname !== "/" && pathname.endsWith("/")) {
    const clean = pathname.slice(0, -1);
    const res = NextResponse.redirect(new URL(clean, req.url), 301);
    trackVisit(req, res);
    return res;
  }

  const rawHost = req.headers.get("host") || "";
  const host = rawHost.split(":")[0];
  const domain = "javavolcano-touroperator";

  const isCustomerHost =
    host === `my.${domain}.local` || host === `my.${domain}.com`;

  if (!isCustomerHost && pathname.startsWith("/customer")) {
    const res = new NextResponse("404 Not Found", { status: 404 });
    trackVisit(req, res);
    return res;
  }

  if (isCustomerHost) {
    if (pathname === "/") {
      url.pathname = "/customer";
      const res = NextResponse.rewrite(url);
      trackVisit(req, res);
      return res;
    }
    const res = NextResponse.next();
    trackVisit(req, res);
    return res;
  }

  // daftar exact URL delete permanent
  const goneUrls = [
    "/all-inclusive",
    "/all-inclusive/transport",
    "/assets/img/cars/${data}",
    "/assets/img/locations/${data.location.images}?0",
    // "/base-knowledge",
    "/blog/2025-ijen-volcano-health-certificate-guide",
    "/blog/blue-fire-ijen-crater-hiking-guide-2025",
    "/blog/ijen-volcano-historical-activity-east-java",
    "/custom-package",
    "/destinations//span[",
    "/destinations/ijen",
    "/destinations/juanda-airport",
    "/destinations/madakaripura-area",
    "/destinations/malang-city",
    "/destinations/malang-to-batu-tour-start",
    "/destinations/map//span[",
    "/destinations/map/bromo",
    "/destinations/map/juanda-airport",
    "/destinations/map/madakaripura",
    "/destinations/map/surabaya",
    "/destinations/map/yogyakarta",
    "/destinations/return-to-malang-hotel",
    "/destinations/Taman Safari Prigen",
    "/destinations/transfer-to-mount-bromo-area",
    "/experiences/destination/surabaya",
    "/experiences/family-tours",
    "/experiences/photography-tours",
    "/experiences/volcano-trekking-tours",
    "/fast-track",
    "/how-to-pay",
    "/insights/",
    "/insights/choose-legal-operator",
    "/insights/combine-destinations",
    "/insights/ijen-screening-explained",
    "/insights/isic-student-fairness",
    "/isic",
    "/isic//span[",
    "/jvto-gift-card",
    "/language/ch",
    "/language/en",
    "/login/google/callback",
    "/police-escort",
    "/policy/booking.json",
    "/policy/inclusions_exclusions.json",
    "/popular-activity",
    "/popular-activity?priceplan=Reguler",
    "/popular-activity?url=3d-2n--surabaya---bromo---ijen---bali--(-stargazing-reg-package-)-1669898798697",
    "/popular-activity?url=surabaya---ijen---bromo-(3d-2n)-1676510962600",
    "/public/about",
    "/public/contact",
    "/public/custom-package",
    "/public/destinations",
    "/public/destinations/bali",
    "/public/destinations/ijen",
    "/public/destinations/juanda-airport",
    "/public/destinations/madakaripura",
    "/public/destinations/map/madakaripura",
    "/public/destinations/map/surabaya",
    "/public/destinations/papuma-beach",
    "/public/mice",
    "/public/office",
    "/public/review",
    "/student-package",
    "/terms-and-conditions",
    "/tours/1-day-bromo-midnight-experience-from-surabaya",
    "/tours/2-day-bromo-sunrise-adventure-from-surabaya",
    "/tours/2-day-ijen-blue-fire-expedition-from-surabaya",
    "/tours/3-day-bromo-and-ijen-volcano-discovery-from-bali",
    "/tours/3-day-bromo-and-ijen-volcano-trip-from-surabaya",
    "/tours/3-day-bromo-and-madakaripura-waterfall-and-ijen-overland-from-surabaya-to-bali",
    "/tours/3-day-ijen-and-bromo-and-madakaripura-waterfall-from-bali-to-surabaya",
    "/tours/3-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya",
    "/tours/3-day-taman-safari-prigen-and-bromo-and-madakaripura-waterfall-family-adventure-from-surabaya",
    "/tours/3-day-tumpak-sewu-waterfall-and-bromo-explorer-from-surabaya",
    // "/tours/4-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya",
    "/tours/4-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-bali-to-surabaya",
    "/tours/4-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-surabaya",
    "/tours/4-day-tumpak-sewu-waterfall-and-bromo-and-ijen-adventure-from-surabaya-to-bali",
    "/tours/5-day-ijen-and-bromo-and-madakaripura-waterfall-and-malang-city-adventure-from-surabaya",
    "/tours/5-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-bali-to-surabaya",
    "/tours/5-day-ijen-and-papuma-beach-and-tumpak-sewu-waterfall-and-bromo-from-surabaya",
    "/tours/destination/18",
    "/tours/destination/3",
    "/tours/destination/38",
    "/tours/destination/bali",
    "/tours/destination/bromo",
    "/tours/destination/ijen",
    "/tours/destination/madakaripura",
    "/tours/destination/surabaya",
    "/tours/destination/taman-safari-prigen",
    "/tours/from-bali/1d1n",
    "/tours/from-bali/4d3n",
    "/tours/from-bali/5d4n",
    "/tours/from-surabaya/1d1n",
    "/tours/from-surabaya/7d6n",
    "/tours/tours/from-surabaya/bromo-1d1n",
    "/tours/tours/from-surabaya/bromo-2d1n",
    "/tours/tours/from-surabaya/bromo-madakaripura-ijen-3d2n",
    "/tours/tours/from-surabaya/ijen-2d1n",
    "/tours/tours/from-surabaya/ijen-bromo-madakaripura-3d2n",
    "/tours/tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
    "/tours/tours/from-surabaya/ijen-bromo-madakaripura-malang-5d4n",
    "/tours/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-4d3n",
    "/tours/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-5d4n",
    "/tours/tours/from-surabaya/ijen-papuma-tumpak-sewu-bromo-malang-6d5n",
    "/tours/tours/from-surabaya/taman-safari-prigen-bromo-madakaripura-3d2n",
    "/tours/tours/from-surabaya/tumpak-sewu-bromo-ijen-4d3n",
    "/tours/yogyakarta",
    "/tours/yogyakarta/2d1n",
    "/tours/yogyakarta/3d2n",
    "/tours/yogyakarta/4d3n",
    "/tours/yogyakarta/5d4n",
    "/tours/yogyakarta/6d5n",
    "/travel-guide/booking-payment-cancellation",
    "/trips/trip-package-BALI-3D2N-001.json",
    "/trips/trip-package-BALI-3D2N-003.json",
    "/trips/trip-package-BALI-4D3N-001.json",
    "/trips/trip-package-BALI-5D4N-001.json",
    "/trips/trip-package-SUB-2D1N-001.json",
    "/trips/trip-package-SUB-3D2N-002.json",
    "/trips/trip-package-SUB-3D2N-003.json",
    "/trips/trip-package-SUB-3D2N-006.json",
    "/trips/trip-package-SUB-4D3N-001.json",
    "/trips/trip-package-SUB-4D3N-003.json",
    "/trips/trip-package-SUB-5D4N-001.json",
    "/trips/trip-package-SUB-5D4N-002.json",
    "/trips/trip-package-SUB-6D5N-001.json",
  ];

  // 410 untuk exact match
  if (goneUrls.includes(pathname)) {
    const res = new NextResponse("410 Gone", { status: 410 });
    trackVisit(req, res);
    return res;
  }

  const redirectMap: Record<string, string> = {
    "/reviews": "/why-jvto/reviews",
    "/about": "/why-jvto/our-story",
    "/destinations/mount-ijen": "/destinations/ijen-crater",
    "/how-to-book": "/travel-guide/booking-information",
    "/what-set-us-apart": "/why-jvto/the-jvto-difference",
    "/base-knowledge": "/travel-guide",
    "/office": "/contact",
    "/tours/4-day-ijen-and-bromo-and-madakaripura-waterfall-from-surabaya":
      "/tours/from-surabaya/ijen-bromo-madakaripura-4d3n",
    "/student-deals/isic": "/isic/student-package",
    "/why-jvto/proof-transparency/legal": "/verify-jvto/legal",
    "/why-jvto/proof-transparency/press-recognition":
      "/verify-jvto/press-recognition",
    "/why-jvto/proof-transparency/police-safety": "/verify-jvto/police-safety",
    "/why-jvto/proof-transparency/history-artifacts":
      "/verify-jvto/history-artifacts",
  };

  if (pathname.startsWith("/faq")) {
    const res = NextResponse.redirect(
      new URL("/travel-guide/faq", req.url),
      301,
    );
    trackVisit(req, res);
    return res;
  }

  if (pathname.startsWith("/packages") || pathname.startsWith("/tours/style")) {
    const res = NextResponse.redirect(new URL("/tours", req.url), 301);
    trackVisit(req, res);
    return res;
  }

  const destination = redirectMap[pathname];
  if (destination) {
    const res = NextResponse.redirect(new URL(destination, req.url), 301);
    trackVisit(req, res);
    return res;
  }

  const res = NextResponse.next();
  trackVisit(req, res);
  return res;
}

function trackVisit(request: NextRequest, response: NextResponse) {
  void fetch("https://api.knownagents.com/visits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KNOWN_AGENTS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request_path: request.nextUrl.pathname,
      request_method: request.method,
      request_headers: {
        "user-agent": request.headers.get("user-agent") || "",
        referer: request.headers.get("referer") || "",
        "x-forwarded-for":
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "",
      },
      response_status_code: response.status,
      response_headers: {
        "content-type": response.headers.get("content-type") || "text/html",
      },
    }),
  }).catch((error) => {
    console.error("Known Agents tracking error:", error);
  });
}

export const config = {
  matcher: [
    // Exclude all Next internals so dev HMR/WebSocket traffic is never intercepted.
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
