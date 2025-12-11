import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Terima data dari Frontend
    const body = await req.json();
    const { url, type } = body; // url = hash booking, type = cc/wise/cash

    // 2. Tentukan URL Legacy (Gunakan Env Variable Domain yang Benar)
    const legacyDomain = process.env.NEXT_PUBLIC_LEGACY_URL_DOMAIN;
    
    // Endpoint di Laravel: POST /booking/set-payment-method/{url}
    const legacyUrl = `${legacyDomain}/booking/set-payment-method/${url}`;

    console.log("🚀 Proxying Payment Selection to:", legacyUrl, "| Method:", type);

    // 3. Kirim Request ke Legacy
    const response = await fetch(legacyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // Wajib agar Laravel return JSON, bukan Redirect/HTML
      },
      body: JSON.stringify({ type }), 
    });

    // 4. Handle Response
    const responseText = await response.text();
    let data;

    try {
        data = JSON.parse(responseText);
    } catch (e) {
        // Jika gagal parse JSON, berarti Legacy error (HTML)
        console.error("❌ Legacy HTML Error:", responseText);
        return NextResponse.json(
            { message: "Legacy Server Error (HTML Response). Cek Console Server Next.js." },
            { status: 500 }
        );
    }

    if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
    }

    // 5. Sukses -> Balikin JSON ke Frontend
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("❌ Pay Balance Proxy Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Proxy Error" },
      { status: 500 }
    );
  }
}