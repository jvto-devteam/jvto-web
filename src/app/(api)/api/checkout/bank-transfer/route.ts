import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔄 Processing Bank Transfer Proof...");

    // 1. Parse as FormData instead of JSON
    const formData = await req.formData();
    
    const booking_id = formData.get("booking_id");
    const sender_name = formData.get("sender_name");
    const proofFile = formData.get("proof") as File;

    if (!proofFile || !booking_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 2. Convert File to Base64
    // Since your legacy server expects JSON, we must encode the file
    const bytes = await proofFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // 3. Prepare Payload for Legacy
    const legacyPayload = {
      booking_id: booking_id,
      sender_name: sender_name,
      proof_base64: `data:${proofFile.type};base64,${base64Image}`,
      file_name: proofFile.name,
    };

    const legacyUrl = `${process.env.NEXT_PUBLIC_LEGACY_URL}/checkout/bank-transfer`;
    
    // 4. Proxy to Legacy
    const response = await fetch(legacyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(legacyPayload),
    });

    // 5. Handle Legacy Response
    const responseText = await response.text();
    let result;
    
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error("❌ Legacy returned non-JSON:", responseText);
        return NextResponse.json({ message: "Legacy Server Error (Invalid JSON)" }, { status: 500 });
    }

    if (!response.ok) {
        return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("POST /api/checkout/bank-transfer proxy error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during Proxy", error: String(error) },
      { status: 500 }
    );
  }
}