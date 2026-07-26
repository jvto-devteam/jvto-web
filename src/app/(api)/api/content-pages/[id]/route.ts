// src/app/(api)/api/content-pages/[id]/route.ts
// Admin read/update/delete a single content_pages row by BigInt id.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { jvtoCmsEnabled } from "@/lib/cms/jvtoCmsClient";
import {
  getCmsContentPageById,
  upsertCmsContentPage,
  resetCmsContentPageById,
} from "@/lib/cms/jvtoCmsContent";

function parseId(idParam: string) {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}

function serialize(row: any) {
  const numeric = row.id != null && /^\d+$/.test(String(row.id));
  return {
    ...row,
    id: row.id == null ? null : numeric ? Number(row.id) : row.id,
  };
}

// GET /api/content-pages/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id: idParam } = await params;

  if (jvtoCmsEnabled()) {
    const row = await getCmsContentPageById(idParam);
    if (!row) return NextResponse.json({ message: "Content page not found" }, { status: 404 });
    return NextResponse.json(serialize(row), { status: 200 });
  }

  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const row = await prisma.content_pages.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json(
        { message: "Content page not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(serialize(row), { status: 200 });
  } catch (error) {
    console.error("GET /api/content-pages/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch content page (server error)" },
      { status: 500 },
    );
  }
}

// PATCH /api/content-pages/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id: idParam } = await params;

  if (jvtoCmsEnabled()) {
    try {
      const existing = await getCmsContentPageById(idParam);
      if (!existing) return NextResponse.json({ message: "Content page not found" }, { status: 404 });
      const body = await req.json();
      const route = typeof body.route === "string" && body.route.trim() ? body.route.trim() : existing.route;
      if (!route.startsWith("/")) {
        return NextResponse.json({ message: "route harus diawali '/'" }, { status: 400 });
      }
      const merged = await upsertCmsContentPage({
        route,
        lang: typeof body.lang === "string" && body.lang.trim() ? body.lang.trim() : existing.lang,
        seo: body.seo !== undefined ? body.seo : existing.seo,
        content: body.content !== undefined ? body.content : existing.content,
        is_active: typeof body.is_active === "boolean" ? body.is_active : existing.is_active,
      });
      return NextResponse.json(serialize(merged), { status: 200 });
    } catch (error) {
      console.error("PATCH /api/content-pages/[id] (jvto_cms) error:", error);
      return NextResponse.json({ message: "Failed to update content page (server error)" }, { status: 500 });
    }
  }

  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.route === "string") {
      const route = body.route.trim();
      if (!route.startsWith("/")) {
        return NextResponse.json(
          { message: "route harus diawali '/'" },
          { status: 400 },
        );
      }
      data.route = route;
    }
    if (typeof body.lang === "string" && body.lang.trim()) data.lang = body.lang.trim();
    if (body.seo !== undefined) data.seo = body.seo;
    if (body.content !== undefined) data.content = body.content;
    if (typeof body.is_active === "boolean") data.is_active = body.is_active;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await prisma.content_pages.update({ where: { id }, data });
    return NextResponse.json(serialize(updated), { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/content-pages/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Content page not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update content page (server error)" },
      { status: 500 },
    );
  }
}

// DELETE /api/content-pages/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id: idParam } = await params;

  if (jvtoCmsEnabled()) {
    // jvto_cms is the master — a route always exists; "delete" = reset the override
    // (clear editable) so the next upstream refresh restores the synced baseline.
    const ok = await resetCmsContentPageById(idParam);
    if (!ok) return NextResponse.json({ message: "Content page not found" }, { status: 404 });
    return NextResponse.json({ message: "Override reset to synced baseline" }, { status: 200 });
  }

  const id = parseId(idParam);
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.content_pages.delete({ where: { id } });
    return NextResponse.json({ message: "Content page deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/content-pages/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Content page not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Failed to delete content page (server error)" },
      { status: 500 },
    );
  }
}
