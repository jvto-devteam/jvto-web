// src/app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
function parseId(idParam: string) {
  const n = Number(idParam);
  if (!idParam || Number.isNaN(n) || n <= 0) return null;
  return BigInt(n); 
}

function serializeBlog(blog: any) {
  return {
    ...blog,
    id: Number(blog.id),
    category_id: blog.category_id ? Number(blog.category_id) : null,
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    category: blog.category
      ? {
          id: Number(blog.category.id),
          name: blog.category.name,
        }
      : null,
  };
}

// GET /api/blogs/[id]
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
    const blog = await prisma.blogs.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBlog(blog), { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog (server error)" },
      { status: 500 }
    );
  }
}
async function saveCoverFile(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = file.name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.\-_]/g, "");
  const timestamp = Date.now();
  const fileName = `${timestamp}-${safeName || "cover"}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  return `/uploads/blogs/${fileName}`;
}

// PATCH /api/blogs/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const data: any = {};

    const title = form.get("title");
    if (typeof title === "string") {
      const t = title.trim();
      if (!t) {
        return NextResponse.json(
          { message: "title tidak boleh kosong" },
          { status: 400 }
        );
      }
      data.title = t;
    }

    const slug = form.get("slug");
    if (typeof slug === "string") {
      const s = slug.trim();
      if (!s) {
        return NextResponse.json(
          { message: "slug tidak boleh kosong" },
          { status: 400 }
        );
      }
      data.slug = s;
    }

    const content = form.get("content");
    if (typeof content === "string") {
      const c = content.trim();
      if (!c) {
        return NextResponse.json(
          { message: "content tidak boleh kosong" },
          { status: 400 }
        );
      }
      data.content = c;
    }

    const status = form.get("status");
    if (typeof status === "string") {
      if (status === "draft" || status === "published") {
        data.status = status;
      } else {
        return NextResponse.json(
          { message: "status harus draft atau published" },
          { status: 400 }
        );
      }
    }

    const tagsRaw = form.get("tags");
    if (tagsRaw !== null) {
      if (typeof tagsRaw === "string") {
        data.tags = tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        data.tags = [];
      }
    }

    const catRaw = form.get("category_id");
    if (catRaw !== null) {
      if (typeof catRaw === "string" && catRaw !== "") {
        const n = Number(catRaw);
        if (Number.isInteger(n) && n > 0) {
          data.category_id = BigInt(n);
        }
      } else if (catRaw === "" || catRaw === null) {
        data.category_id = null;
      }
    }

    const coverFile = form.get("cover_image");
    if (coverFile instanceof File && coverFile.size > 0) {
      data.cover_image = await saveCoverFile(coverFile);
    }
    // (kalau mau fitur "hapus cover", bisa pakai field khusus misal remove_cover = "1")

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.blogs.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(serializeBlog(updated), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/blogs/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update blog (server error)" },
      { status: 500 }
    );
  }
}
// DELETE /api/blogs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseId(idParam);

  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.blogs.delete({ where: { id } });
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/blogs/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Failed to delete blog (server error)" },
      { status: 500 }
    );
  }
}
