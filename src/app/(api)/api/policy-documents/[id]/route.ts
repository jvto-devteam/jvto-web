import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// REMOVED parseId function since we're using uuid strings now

function serializePolicy(policy: any) {
  return {
    ...policy,
    // No need to convert id anymore since it's already a string
  };
}

// GET /api/policy-documents/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Basic validation for uuid format
  if (!id || id.trim() === "") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const policy = await prisma.policy_documents.findUnique({ 
      where: { id } 
    });
    
    if (!policy) {
      return NextResponse.json(
        { message: "Policy document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializePolicy(policy), { status: 200 });
  } catch (error) {
    console.error("GET /api/policy-documents/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch policy document (server error)" },
      { status: 500 }
    );
  }
}

// PATCH /api/policy-documents/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  const { id } = await params;

  if (!id || id.trim() === "") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data: any = {};

    if (typeof body.title === "string")
      data.title = body.title.trim();
    if (typeof body.slug === "string")
      data.slug = body.slug.trim();
    if (typeof body.content === "string")
      data.content = body.content.trim();

    if (typeof body.version === "string") {
      const v = body.version.trim();
      data.version = v || null;
    }

    if (typeof body.policy_type === "string") {
      const pt = body.policy_type as
        | "booking_payment_cancellation"
        | "inclusions_exclusions"
        | "privacy"
        | "guest_responsibilities";

      if (
        [
          "booking_payment_cancellation",
          "inclusions_exclusions",
          "privacy",
          "guest_responsibilities",
        ].includes(pt)
      ) {
        data.policy_type = pt;
      } else {
        return NextResponse.json(
          { message: "policy_type tidak valid" },
          { status: 400 }
        );
      }
    }

    if (body.effective_date !== undefined) {
      if (!body.effective_date) {
        data.effective_date = null;
      } else {
        const d = new Date(body.effective_date);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json(
            { message: "effective_date tidak valid" },
            { status: 400 }
          );
        }
        data.effective_date = d;
      }
    }

    if (typeof body.is_binding === "boolean")
      data.is_binding = body.is_binding;

    if (typeof body.include_in_sitemap === "boolean")
      data.include_in_sitemap = body.include_in_sitemap;

    if (body.seo_meta_title !== undefined) {
      if (typeof body.seo_meta_title === "string") {
        const v = body.seo_meta_title.trim();
        data.seo_meta_title = v || null;
      } else {
        data.seo_meta_title = null;
      }
    }

    if (body.seo_meta_description !== undefined) {
      if (typeof body.seo_meta_description === "string") {
        const v = body.seo_meta_description.trim();
        data.seo_meta_description = v || null;
      } else {
        data.seo_meta_description = null;
      }
    }

    if (body.seo_og_image_url !== undefined) {
      if (typeof body.seo_og_image_url === "string") {
        const v = body.seo_og_image_url.trim();
        data.seo_og_image_url = v || null;
      } else {
        data.seo_og_image_url = null;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    data.date_modified = new Date(); // CHANGED: dari updated_at ke date_modified

    const updated = await prisma.policy_documents.update({
      where: { id },
      data,
    });

    return NextResponse.json(serializePolicy(updated), { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/policy-documents/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update policy document (server error)" },
      { status: 500 }
    );
  }
}

// DELETE /api/policy-documents/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  const { id } = await params;

  if (!id || id.trim() === "") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.policy_documents.delete({ where: { id } });
    return NextResponse.json(
      { message: "Policy document deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/policy-documents/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Policy document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete policy document (server error)" },
      { status: 500 }
    );
  }
}
