import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isMissingSchema(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "42P01"
  );
}

export async function GET() {
  try {
    const rows = await db(
      `
        SELECT
          id::text,
          slug,
          intent_id,
          title,
          body,
          is_active,
          sort_order,
          updated_at::text
        FROM wa_quick_replies
        ORDER BY sort_order ASC, title ASC
      `,
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    if (isMissingSchema(error)) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(
      { message: "Failed to fetch quick replies", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (
      typeof body.slug !== "string" ||
      typeof body.intentId !== "string" ||
      typeof body.title !== "string" ||
      typeof body.body !== "string"
    ) {
      return NextResponse.json(
        { message: "slug, intentId, title, and body are required" },
        { status: 400 },
      );
    }

    const rows = await db(
      `
        INSERT INTO wa_quick_replies (
          slug,
          intent_id,
          title,
          body,
          is_active,
          sort_order,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (slug) DO UPDATE SET
          intent_id = EXCLUDED.intent_id,
          title = EXCLUDED.title,
          body = EXCLUDED.body,
          is_active = EXCLUDED.is_active,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
        RETURNING
          id::text,
          slug,
          intent_id,
          title,
          body,
          is_active,
          sort_order,
          updated_at::text
      `,
      [
        body.slug.trim(),
        body.intentId.trim(),
        body.title.trim(),
        body.body.trim(),
        body.isActive !== false,
        Number(body.sortOrder ?? 100),
      ],
    );

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save quick reply", details: String(error) },
      { status: 500 },
    );
  }
}
