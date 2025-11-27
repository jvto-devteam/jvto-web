// src/app/api/destination-faqs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationIdParam =
      searchParams.get("destination_id") || searchParams.get("destinationId");

    const where: any = {};

    if (destinationIdParam) {
      const destIdNum = Number(destinationIdParam);
      if (!destIdNum || Number.isNaN(destIdNum) || destIdNum <= 0) {
        return NextResponse.json(
          { message: "destination_id tidak valid" },
          { status: 400 }
        );
      }
      where.destination_id = BigInt(destIdNum);
    }

    const rows = await prisma.destination_faqs.findMany({
      where,
      include: {
        faq: true,
      },
      orderBy: [
        { destination_id: "asc" },
        { faq_id: "asc" },
        // NOTE: di Prisma field-nya `createdAt`, bukan `created_at`
        { createdAt: "asc" },
      ],
    });

    const data = rows.map((row) => ({
      id: Number(row.id),
      destination_id: Number(row.destination_id),
      faq_id: Number(row.faq_id),
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
      faq: row.faq
        ? {
            id: Number(row.faq.id),
            question: row.faq.question,
            answer: row.faq.answer,
            // tambahkan field lain kalau kamu perlu
          }
        : null,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/destination-faqs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch destination_faqs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const destinationIdNum = Number(body.destination_id ?? body.destinationId);
    const faqIdNum = Number(body.faq_id ?? body.faqId);

    if (
      !destinationIdNum ||
      Number.isNaN(destinationIdNum) ||
      destinationIdNum <= 0
    ) {
      return NextResponse.json(
        { message: "destination_id wajib dan harus number > 0" },
        { status: 400 }
      );
    }
    if (!faqIdNum || Number.isNaN(faqIdNum) || faqIdNum <= 0) {
      return NextResponse.json(
        { message: "faq_id wajib dan harus number > 0" },
        { status: 400 }
      );
    }

    // optional: cegah duplikat manual (di luar unique index DB)
    const existing = await prisma.destination_faqs.findFirst({
      where: {
        destination_id: BigInt(destinationIdNum),
        faq_id: BigInt(faqIdNum),
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "FAQ sudah terhubung ke destination ini" },
        { status: 409 }
      );
    }

    const created = await prisma.destination_faqs.create({
      data: {
        destination_id: BigInt(destinationIdNum),
        faq_id: BigInt(faqIdNum),
      },
      include: {
        faq: true,
      },
    });

    const dto = {
      id: Number(created.id),
      destination_id: Number(created.destination_id),
      faq_id: Number(created.faq_id),
      created_at: created.createdAt.toISOString(),
      updated_at: created.updatedAt.toISOString(),
      faq: created.faq
        ? {
            id: Number(created.faq.id),
            question: created.faq.question,
            answer: created.faq.answer,
          }
        : null,
    };

    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    console.error("POST /api/destination-faqs error:", error);
    return NextResponse.json(
      { message: "Failed to create destination_faq link" },
      { status: 500 }
    );
  }
}
