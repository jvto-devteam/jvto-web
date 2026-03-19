import { NextRequest, NextResponse } from "next/server";
import {
  getSitemapUrls,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  submitIndexNow,
} from "@/lib/seo/indexnow";

type IndexNowRequestBody = {
  urls?: string[];
  scope?: "sitemap";
};

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      provider: "IndexNow",
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      usage: {
        single: {
          method: "POST",
          body: {
            urls: [
              "https://javavolcano-touroperator.com/",
              "https://javavolcano-touroperator.com/tours",
              "https://javavolcano-touroperator.com/why-jvto",
            ],
          },
        },
        sitemap: {
          method: "POST",
          body: { scope: "sitemap" },
        },
      },
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IndexNowRequestBody;

    const urls =
      body.scope === "sitemap"
        ? await getSitemapUrls()
        : Array.isArray(body.urls)
          ? body.urls
          : [];

    const result = await submitIndexNow(urls);

    return NextResponse.json(result, {
      status: result.ok ? 200 : result.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        status: 500,
        submitted: 0,
        message: error?.message || "Failed to submit IndexNow request.",
      },
      { status: 500 },
    );
  }
}
