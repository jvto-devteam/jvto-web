import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import mime from "mime";

export const runtime = "nodejs";          // pakai fs, jangan edge
export const dynamic = "force-dynamic";   // jangan di-static-kan

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // /uploads/a/b/c.png  -> params.path = ["a","b","c.png"]
    const relPath = params.path.join("/");

    // SESUAI tempat kamu simpan file:
    const filePath = path.join(process.cwd(), "public", "uploads", relPath);

    const file = await fs.readFile(filePath);
    const type = mime.getType(filePath) || "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": type,
        // optional cache
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[/uploads/*] file not found", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
