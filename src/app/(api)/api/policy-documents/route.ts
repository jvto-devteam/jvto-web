// src/app/api/policy-documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function serializePolicy(policy: any) {
  return {
    ...policy,
    // id already string (uuid), no conversion needed
  };
}

// GET /api/policy-documents
export async function GET() {
  try {
    const policies = await prisma.policy_documents.findMany({
      orderBy: [
        { effective_date: "desc" },
        { created_at: "desc" },
      ],
    });

    return NextResponse.json(
      policies.map(serializePolicy),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/policy-documents error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    return NextResponse.json(
      { 
        message: "Failed to fetch policy documents (server error)",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/policy-documents
export async function POST(req: NextRequest) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  try {
    const body = await req.json();
    
    console.log("Received POST body:", body);

    const title = (body.title || "").trim();
    const slug = (body.slug || "").trim();
    const content = (body.content || "").trim();
    const policy_type = body.policy_type as
      | "booking_payment_cancellation"
      | "inclusions_exclusions"
      | "privacy"
      | "guest_responsibilities"
      | undefined;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: "title, slug, dan content wajib diisi" },
        { status: 400 }
      );
    }

    if (
      !policy_type ||
      ![
        "booking_payment_cancellation",
        "inclusions_exclusions",
        "privacy",
        "guest_responsibilities",
      ].includes(policy_type)
    ) {
      return NextResponse.json(
        { message: "policy_type tidak valid" },
        { status: 400 }
      );
    }

    // Parse effective_date
    let effective_date: Date | null = null;
    if (body.effective_date) {
      const d = new Date(body.effective_date);
      if (!Number.isNaN(d.getTime())) {
        effective_date = d;
      }
    }

    const is_binding =
      typeof body.is_binding === "boolean" ? body.is_binding : true;

    const include_in_sitemap =
      typeof body.include_in_sitemap === "boolean"
        ? body.include_in_sitemap
        : true;

    const version =
      typeof body.version === "string" && body.version.trim()
        ? body.version.trim()
        : null;

    const seo_meta_title =
      typeof body.seo_meta_title === "string" && body.seo_meta_title.trim()
        ? body.seo_meta_title.trim()
        : null;

    const seo_meta_description =
      typeof body.seo_meta_description === "string" &&
      body.seo_meta_description.trim()
        ? body.seo_meta_description.trim()
        : null;

    const seo_og_image_url =
      typeof body.seo_og_image_url === "string" &&
      body.seo_og_image_url.trim()
        ? body.seo_og_image_url.trim()
        : null;

    const dataToInsert = {
      title,
      slug,
      policy_type,
      version,
      effective_date,
      content,
      is_binding,
      include_in_sitemap,
      seo_meta_title,
      seo_meta_description,
      seo_og_image_url,
    };

    console.log("Data to insert:", dataToInsert);

    const created = await prisma.policy_documents.create({
      data: dataToInsert,
    });

    console.log("Successfully created policy:", created.id);

    return NextResponse.json(serializePolicy(created), { status: 201 });
  } catch (error: any) {
    console.error("POST /api/policy-documents error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    // Return detailed error for debugging
    return NextResponse.json(
      { 
        message: "Failed to create policy document (server error)",
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}