import { NextResponse } from "next/server";
import { getPublicReviewFeedWithFallback } from "@/lib/publicContent/reviewApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  try {
    const reviews = await getPublicReviewFeedWithFallback(platform);

    return new NextResponse(JSON.stringify(reviews), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (err) {
    console.error("JSON Reviews error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate JSON",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
