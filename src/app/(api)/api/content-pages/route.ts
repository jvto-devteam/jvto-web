// src/app/(api)/api/content-pages/route.ts
// Admin write API for content_pages (per-route CMS SEO + content).
// GET  = list. POST = upsert by unique [route, lang].
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function serialize(row: any) {
  return {
    ...row,
    id: row.id != null ? Number(row.id) : null,
  };
}

// GET /api/content-pages — list route,lang,seo,content,is_active
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  try {
    const rows = await prisma.content_pages.findMany({
      orderBy: [{ route: "asc" }, { lang: "asc" }],
      select: {
        id: true,
        route: true,
        lang: true,
        seo: true,
        content: true,
        is_active: true,
        updated_at: true,
      },
    });
    return NextResponse.json(rows.map(serialize), { status: 200 });
  } catch (error) {
    console.error("GET /api/content-pages error:", error);
    return NextResponse.json(
      { message: "Failed to fetch content pages (server error)" },
      { status: 500 },
    );
  }
}

// POST /api/content-pages — upsert by [route, lang]
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  try {
    const body = await req.json();

    const route = typeof body.route === "string" ? body.route.trim() : "";
    const lang =
      typeof body.lang === "string" && body.lang.trim() ? body.lang.trim() : "en";

    if (!route || !route.startsWith("/")) {
      return NextResponse.json(
        { message: "route wajib diisi dan harus diawali '/'" },
        { status: 400 },
      );
    }

    const seo = body.seo !== undefined ? body.seo : {};
    const content = body.content !== undefined ? body.content : {};
    const is_active =
      typeof body.is_active === "boolean" ? body.is_active : true;

    const row = await prisma.content_pages.upsert({
      where: { route_lang: { route, lang } },
      create: { route, lang, seo, content, is_active },
      update: { seo, content, is_active },
    });

    return NextResponse.json(serialize(row), { status: 200 });
  } catch (error) {
    console.error("POST /api/content-pages error:", error);
    return NextResponse.json(
      { message: "Failed to upsert content page (server error)" },
      { status: 500 },
    );
  }
}
