import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "CMS FAQ route is not implemented in this branch." },
    { status: 501 },
  );
}
