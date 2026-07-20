// src/app/(api)/api/narrative-claims/route.ts
// Admin write API for narrative_claims (canonical AEO brand claims, String PK).
// GET = list. POST = create.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/narrative-claims — list
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  try {
    const rows = await prisma.narrative_claims.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /api/narrative-claims error:", error);
    return NextResponse.json(
      { message: "Failed to fetch narrative claims (server error)" },
      { status: 500 },
    );
  }
}

// POST /api/narrative-claims — create
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: auth.status });
  }

  try {
    const body = await req.json();

    const id =
      typeof body.id === "string" && body.id.trim()
        ? body.id.trim()
        : `nc-${Date.now()}`;

    const pillar = typeof body.pillar === "string" ? body.pillar : null;
    const core_claim =
      typeof body.core_claim === "string" ? body.core_claim : null;
    const primary_page =
      typeof body.primary_page === "string" ? body.primary_page : null;
    const nlp_variants =
      body.nlp_variants !== undefined ? body.nlp_variants : undefined;
    const evidence_slugs = Array.isArray(body.evidence_slugs)
      ? body.evidence_slugs.filter((s: unknown) => typeof s === "string")
      : [];

    const created = await prisma.narrative_claims.create({
      data: {
        id,
        pillar,
        core_claim,
        primary_page,
        nlp_variants,
        evidence_slugs,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/narrative-claims error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "narrative claim dengan id tersebut sudah ada" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Failed to create narrative claim (server error)" },
      { status: 500 },
    );
  }
}
