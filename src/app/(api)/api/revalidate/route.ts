// src/app/(api)/api/revalidate/route.ts
// Admin-only on-demand revalidation. POST { route } → revalidatePath(route).
// Used by the CMS SSOT editors after a successful Publish so the public page
// picks up new content_pages / narrative_claims immediately.
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(
      { message: "unauthorized" },
      { status: auth.status },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const route = typeof body?.route === "string" ? body.route.trim() : "";

    if (!route || !route.startsWith("/")) {
      return NextResponse.json(
        { message: "route wajib diisi dan harus diawali '/'" },
        { status: 400 },
      );
    }

    revalidatePath(route);
    return NextResponse.json({ revalidated: true, route }, { status: 200 });
  } catch (error) {
    console.error("POST /api/revalidate error:", error);
    return NextResponse.json(
      { message: "Failed to revalidate (server error)" },
      { status: 500 },
    );
  }
}
