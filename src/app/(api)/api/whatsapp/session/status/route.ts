import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/whatsapp/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await gatewayFetch("/session/status");
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch WhatsApp gateway status", details: String(error) },
      { status: 500 },
    );
  }
}
