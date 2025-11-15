import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import mime from "mime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: { path: string[] } }
) {
  const relPath = context.params.path.join("/");

  const filePath = path.join(process.cwd(), "public", "uploads", relPath);

  try {
    const file = await fs.readFile(filePath);
    const type = mime.getType(filePath) || "application/octet-stream";

    return new NextResponse(file, {
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
