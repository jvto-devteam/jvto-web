// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  const rawHost = req.headers.get("host") || "";
  const host = rawHost.split(":")[0];
  const domain = "javavolcano-touroperator";

  const isCustomerHost =
    host === `my.${domain}.local` || host === `my.${domain}.com`;

  if (!isCustomerHost && pathname.startsWith("/customer")) {
    return new NextResponse("404 Not Found", { status: 404 });
  }

  if (isCustomerHost) {
    if (pathname === "/") {
      url.pathname = "/customer";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // daftar exact URL delete permanent
  const goneUrls = [
    "/student-package",
    "/packages/activity/east-java-snapshot",
    "/packages/activity/3D2N-java-volcano-tour-packages",
    "/packages/activity/essentials-of-east-java-from-bali",
    "/packages/activity/best-of-east-java-from-surabaya",
    "/packages/activity/best-of-east-java-from-bali",
    "/packages/activity/highlights-of-east-java-from-surabaya",
    "/packages/activity/premiere-of-east-java",
    "/packages/surabaya/3d2n/3",
    "/packages/surabaya/4d3n/4",
    "/packages/surabaya/4d3n/5",
    "/packages/surabaya/4d3n/6",
    "/packages/surabaya/5d4n/4",
    "/packages/surabaya/5d4n/9",
    "/packages/surabaya/6d5n/2",
    "/packages/bali/3d2n/3",
    "/packages/bali/4d3n/3",
    "/packages/bali/4d3n/4",
    "/accommodations",
    "/transportations",
  ];

  // 410 untuk exact match
  if (goneUrls.includes(pathname)) {
    return new NextResponse("410 Gone", { status: 410 });
  }

  // 410 untuk semua URL dengan prefix /packages/yogyakarta
  if (pathname.startsWith("/packages/yogyakarta")) {
    return new NextResponse("410 Gone", { status: 410 });
  }

  return NextResponse.next();
}
export const config = {
  // Matcher ini berfungsi untuk MENGECUALIKAN middleware pada path tertentu:
  // 1. /api (API Routes termasuk NextAuth) -> Agar tidak kena error JSON
  // 2. /_next (Next.js internals)
  // 3. /static (Static files)
  // 4. favicon.ico, sitemap.xml, robots.txt, dll
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
