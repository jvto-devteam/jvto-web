import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "CMS content route is not implemented in this branch." },
    { status: 501 },
  );
}
