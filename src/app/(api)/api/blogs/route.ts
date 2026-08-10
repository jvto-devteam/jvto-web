// src/app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth";
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

  // path yang disimpan ke DB → bisa di-serve langsung oleh Next dari /public
  return `/uploads/blogs/${fileName}`;
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

// GET /api/blogs
export async function GET() {
  try {
    const blogs = await prisma.blogs.findMany({
      orderBy: [{ created_at: "desc" }],
      include: { category: true },
    });

    return NextResponse.json(blogs.map(serializeBlog), { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs (server error)" },
      { status: 500 }
    );
  }
}

// POST /api/blogs
export async function POST(req: NextRequest) {
  const __admin = await requireAdmin();
  if (!__admin.ok) {
    return NextResponse.json({ message: "unauthorized" }, { status: __admin.status });
  }

  try {
    const form = await req.formData();

    const title = String(form.get("title") || "").trim();
    const slug = String(form.get("slug") || "").trim();
    const content = String(form.get("content") || "").trim();
    const statusRaw = String(form.get("status") || "draft").trim();
    const status =
      statusRaw === "published" || statusRaw === "draft" ? statusRaw : "draft";

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: "title, slug & content wajib diisi" },
        { status: 400 }
      );
    }

    const tagsInput = form.get("tags");
    const tags =
      typeof tagsInput === "string"
        ? tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    const categoryRaw = form.get("category_id");
    let category_id: bigint | null = null;
    if (typeof categoryRaw === "string" && categoryRaw !== "") {
      const n = Number(categoryRaw);
      if (Number.isInteger(n) && n > 0) {
        category_id = BigInt(n);
      }
    }

    let cover_image: string | null = null;
    const coverFile = form.get("cover_image");
    if (coverFile instanceof File && coverFile.size > 0) {
      cover_image = await saveCoverFile(coverFile);
    }

    const data: any = {
      title,
      slug,
      content,
      status,
      tags,
      cover_image,
    };

    if (category_id !== null) {
      data.category_id = category_id;
    }

    const created = await prisma.blogs.create({
      data,
      include: { category: true },
    });

    return NextResponse.json(serializeBlog(created), { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { message: "Failed to create blog (server error)" },
      { status: 500 }
    );
  }
}
