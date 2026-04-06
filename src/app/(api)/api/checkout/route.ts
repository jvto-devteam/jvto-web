import { NextRequest, NextResponse } from "next/server";
import {
  validateCheckoutPricingContract,
  type CheckoutPricingAudit,
  type CheckoutPricingSelection,
} from "@/lib/packages/checkoutPricingContract";

export async function POST(req: NextRequest) {
  try {
    // 1. Terima payload dari frontend internal
    const body = await req.json();
    const {
      pricing_audit: pricingAudit,
      bookingSelection,
      ...legacyBody
    }: {
      pricing_audit?: CheckoutPricingAudit;
      bookingSelection?: CheckoutPricingSelection;
      [key: string]: unknown;
    } = body;

    if (!pricingAudit || !bookingSelection) {
      return NextResponse.json(
        {
          message:
            "Missing pricing audit or booking selection in checkout request",
        },
        { status: 400 },
      );
    }

    const contract = validateCheckoutPricingContract({
      pricingAudit,
      bookingSelection,
    });

    if (!contract.valid) {
      console.error("❌ Checkout pricing contract mismatch:", contract.errors);
      return NextResponse.json(
        {
          message: "Checkout pricing contract mismatch",
          errors: contract.errors,
          normalized: contract.normalized,
        },
        { status: 400 },
      );
    }

    const legacyUrlBase = process.env.NEXT_PUBLIC_LEGACY_URL;
    if (!legacyUrlBase) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_LEGACY_URL for checkout proxy" },
        { status: 500 },
      );
    }

    const normalizedLegacyBody = {
      ...legacyBody,
      bookingSelection: {
        ...bookingSelection,
        numb_of_pax: contract.normalized.pax,
        payment_method: contract.expectedPaymentMethod,
        down_payment: contract.normalized.downPayment,
        total_package: contract.normalized.totalPackage,
        total_addons: contract.normalized.totalAddons,
        grand_total: contract.normalized.grandTotal,
        total_discount: contract.normalized.totalDiscount,
      },
    };

    console.log("🔄 Proxying validated checkout request to Legacy...");

    // 2. TEMBAK KE LEGACY (Server-to-Server bypasses CORS)
    const legacyUrl = `${legacyUrlBase}/checkout`;
    
    const response = await fetch(legacyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(normalizedLegacyBody),
    });

    // 3. AMBIL RESPON DARI LEGACY
    const responseText = await response.text();
    let result;
    
    try {
        result = JSON.parse(responseText);
    } catch {
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
