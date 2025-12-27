// app/api/check-isic/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. UBAH DISINI: Ambil 'codes' (array), bukan 'code'
    const { codes } = await req.json();

    // Validasi Array
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json({ valid: false, message: "Codes are required" }, { status: 400 });
    }

    // URL Target Legacy
    const legacyUrl = "https://legacy.javavolcano-touroperator.com/api/web/check-isic-discount";

    // 2. Kirim object { codes: [...] } ke server Laravel
    const response = await fetch(legacyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ codes }), // Pastikan property-nya 'codes'
    });

    const result = await response.json();

    // Kembalikan respon apa adanya dari Laravel
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error("ISIC Check Error:", error);
    return NextResponse.json({ valid: false, message: "Server Error" }, { status: 500 });
  }
}