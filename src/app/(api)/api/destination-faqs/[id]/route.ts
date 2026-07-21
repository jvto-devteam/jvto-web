// src/app/api/destination-faqs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function parseId(idParam: string): bigint | null {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n);
}

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
    await prisma.destination_faqs.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Destination FAQ link deleted" });
  } catch (error: any) {
    console.error("DELETE /api/destination-faqs/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Destination FAQ link not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Failed to delete destination_faq link" },
      { status: 500 }
    );
  }
}
