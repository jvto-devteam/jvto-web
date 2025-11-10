// src/app/api/faqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeFaq(faq: any) {
  return {
    ...faq,
    id: Number(faq.id),
  };
}

// GET /api/faqs
export async function GET() {
  try {
    const faqs = await prisma.faqs.findMany({
      orderBy: [
        { sort_order: "asc" },
        { created_at: "desc" },
      ],
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

    if (!question || !answer) {
      return NextResponse.json(
        { message: "question & answer wajib diisi" },
        { status: 400 }
      );
    }

    const tags =
      Array.isArray(tagsInput)
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