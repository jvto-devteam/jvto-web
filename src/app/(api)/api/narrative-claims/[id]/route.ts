// src/app/(api)/api/narrative-claims/[id]/route.ts
// Admin read/update/delete a single narrative_claims row by String id.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/narrative-claims/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const row = await prisma.narrative_claims.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json(
        { message: "Narrative claim not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(row, { status: 200 });
  } catch (error) {
    console.error("GET /api/narrative-claims/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch narrative claim (server error)" },
      { status: 500 },
    );
  }
}

// PATCH /api/narrative-claims/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (body.pillar !== undefined) data.pillar = body.pillar;
    if (body.core_claim !== undefined) data.core_claim = body.core_claim;
    if (body.primary_page !== undefined) data.primary_page = body.primary_page;
    if (body.nlp_variants !== undefined) data.nlp_variants = body.nlp_variants;
    if (body.evidence_slugs !== undefined) {
      data.evidence_slugs = Array.isArray(body.evidence_slugs)
        ? body.evidence_slugs.filter((s: unknown) => typeof s === "string")
        : [];
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await prisma.narrative_claims.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/narrative-claims/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Narrative claim not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update narrative claim (server error)" },
      { status: 500 },
    );
  }
}

// DELETE /api/narrative-claims/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.narrative_claims.delete({ where: { id } });
    return NextResponse.json(
      { message: "Narrative claim deleted" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DELETE /api/narrative-claims/[id] error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Narrative claim not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Failed to delete narrative claim (server error)" },
      { status: 500 },
    );
  }
}
