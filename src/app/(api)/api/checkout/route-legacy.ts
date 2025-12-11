import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Terima Payload VALID dari Frontend
    const body = await req.json();

    console.log("🔄 Proxying request to Legacy...");

    // 2. TEMBAK KE LEGACY (Server-to-Server bypasses CORS)
    // Pastikan URL di env tidak diakhiri slash, atau sesuaikan penggabungannya
    const legacyUrl = `${process.env.NEXT_PUBLIC_LEGACY_URL}/checkout`;
    
    const response = await fetch(legacyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body), // Kirim payload apa adanya (karena sudah disusun di frontend)
    });

    // 3. AMBIL RESPON DARI LEGACY
    const responseText = await response.text();
    let result;
    
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error("❌ Legacy returned non-JSON:", responseText);
        return NextResponse.json({ message: "Legacy Server Error (HTML Response)" }, { status: 500 });
    }

    // 4. KEMBALIKAN KE FRONTEND
    if (!response.ok) {
        return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("POST /api/checkout proxy error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during Proxy", error: String(error) },
      { status: 500 }
    );
  }
}