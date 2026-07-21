// src/app/api/faqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function serializeFaq(faq: any) {
  return {
    ...faq,
    id: Number(faq.id),
    category_id: faq.category_id ? Number(faq.category_id) : null,
    category: faq.category
      ? {
          id: Number(faq.category.id),
          name: faq.category.name,
          slug: faq.category.slug,
        }
      : null,
  };
}

// GET /api/faqs
export async function GET() {
  try {
    const faqs = await prisma.faqs.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
      include: {
        category: true,
      },
    });

    return NextResponse.json(faqs.map(serializeFaq), { status: 200 });
  } catch (error) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQs (server error)" },
      { status: 500 }
    );
  }
}

// POST /api/faqs
export async function POST(req: NextRequest) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  try {
    const body = await req.json();

    const question = (body.question || "").trim();
    const answer = (body.answer || "").trim();
    const tagsInput = body.tags ?? "";
    const is_published =
      typeof body.is_published === "boolean" ? body.is_published : true;
    const sort_order =
      typeof body.sort_order === "number" && Number.isInteger(body.sort_order)
        ? body.sort_order
        : 0;

    const category_id_raw = body.category_id;
    let category_id: bigint | null = null;

    if (
      typeof category_id_raw === "number" &&
      Number.isInteger(category_id_raw) &&
      category_id_raw > 0
    ) {
      category_id = BigInt(category_id_raw);
    }

    if (!question || !answer) {
      return NextResponse.json(
        { message: "question & answer wajib diisi" },
        { status: 400 }
      );
    }

    const tags = Array.isArray(tagsInput)
      ? tagsInput.map((t: string) => t.trim()).filter(Boolean)
      : typeof tagsInput === "string"
      ? tagsInput
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const created = await prisma.faqs.create({
      data: {
        question,
        answer,
        tags,
        is_published,
        sort_order,
        category_id,
      },
    });

    return NextResponse.json(serializeFaq(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/faqs error:", error);
    return NextResponse.json(
      { message: "Failed to create FAQ (server error)" },
      { status: 500 }
    );
  }
}
