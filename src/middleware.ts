// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl
  const rawHost = req.headers.get("host") || "";
  const host = rawHost.split(":")[0];
  const domain = "java-tour";

  
  if (host === `my.${domain}.local` || host === `my.${domain}.com`) {
    if (url.pathname === '/') {
      url.pathname = '/customer'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
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
