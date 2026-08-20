import { NextResponse } from "next/server";
import { getPublicReviewPreviewWithFallback } from "@/lib/publicContent/reviewApi";

export async function GET() {
  try {
    const response = await getPublicReviewPreviewWithFallback();

    return new NextResponse(JSON.stringify(response), {
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
