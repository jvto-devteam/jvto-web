// src/app/api/blog-categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cats = await prisma.blog_categories.findMany({
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(
      cats.map((c) => ({
        ...c,
        id: Number(c.id),
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/blog-categories error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog categories" },
      { status: 500 }
    );
  }
}
