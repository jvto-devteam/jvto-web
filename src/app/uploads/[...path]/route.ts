import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import mime from "mime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Ambil path dari URL: /uploads/1763....-rendi.png
  const url = new URL(req.url);
  const relPath = url.pathname.replace(/^\/uploads\//, "");

  // Kalau tidak ada nama file → 404
  if (!relPath || relPath === "/" || relPath.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", relPath);

  try {
    const file = await fs.readFile(filePath);
    const fileUint8 = new Uint8Array(file); // ⬅️ konversi Buffer -> Uint8Array
    const type = mime.getType(filePath) || "application/octet-stream";

    return new NextResponse(fileUint8, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[/uploads/*] file not found", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
