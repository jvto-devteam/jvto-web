// src/app/api/faqs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function parseId(idParam: string) {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}

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

// GET /api/faqs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const faq = await prisma.faqs.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!faq) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(serializeFaq(faq), { status: 200 });
  } catch (error) {
    console.error("GET /api/faqs/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQ (server error)" },
      { status: 500 }
    );
  }
}

// PATCH /api/faqs/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.question === "string") data.question = body.question.trim();
    if (typeof body.answer === "string") data.answer = body.answer.trim();
    if (typeof body.is_published === "boolean")
      data.is_published = body.is_published;
    if (
      typeof body.sort_order === "number" &&
      Number.isInteger(body.sort_order)
    )
      data.sort_order = body.sort_order;

    if (body.tags !== undefined) {
      const tagsInput = body.tags;
      data.tags = Array.isArray(tagsInput)
        ? tagsInput.map((t: string) => t.trim()).filter(Boolean)
        : typeof tagsInput === "string"
        ? tagsInput
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    if (body.category_id !== undefined) {
      const raw = body.category_id;
      if (typeof raw === "number" && Number.isInteger(raw) && raw > 0) {
        data.category_id = BigInt(raw);
      } else if (raw === null) {
        data.category_id = null;
      }
    }
    const updated = await prisma.faqs.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(serializeFaq(updated), { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/faqs/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update FAQ (server error)" },
      { status: 500 }
    );
  }
}

// DELETE /api/faqs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.faqs.delete({ where: { id } });
    return NextResponse.json({ message: "FAQ deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/faqs/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Failed to delete FAQ (server error)" },
      { status: 500 }
    );
  }
}
