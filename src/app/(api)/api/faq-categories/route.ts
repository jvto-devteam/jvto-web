// src/app/api/faq-categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function serializeCategory(cat: any) {
  return {
    ...cat,
    id: Number(cat.id),
  };
}

// GET /api/faq-categories
export async function GET() {
  try {
    const cats = await prisma.category_faqs.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(cats.map(serializeCategory), { status: 200 });
  } catch (error) {
    console.error("GET /api/faq-categories error:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQ categories" },
      { status: 500 }
    );
  }
}

// POST /api/faq-categories
export async function POST(req: NextRequest) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    let slug = (body.slug || "").trim();
    const sort_order =
      typeof body.sort_order === "number" && Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0;
    const is_active =
      typeof body.is_active === "boolean" ? body.is_active : true;

    if (!name) {
      return NextResponse.json(
        { message: "Category name wajib diisi" },
        { status: 400 }
      );
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const created = await prisma.category_faqs.create({
      data: {
        name,
        slug,
        sort_order,
        is_active,
      },
    });

    return NextResponse.json(serializeCategory(created), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/faq-categories error:", error);

    if (error.code === "P2002") {
      // unique constraint (slug)
      return NextResponse.json(
        { message: "Slug sudah digunakan, coba nama lain" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create FAQ category" },
      { status: 500 }
    );
  }
}
