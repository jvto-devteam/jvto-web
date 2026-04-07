import { NextRequest, NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/whatsapp/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await gatewayFetch("/automation/resume", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to resume WhatsApp automation", details: String(error) },
      { status: 500 },
    );
  }
}
