// src/app/api/site-identity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RegistrationId = {
  label: string;
  value: string;
  document?: string;
};

type PaymentAccount = {
  label: string;
  accountDetails: string;
};

type SiteIdentityResponse = {
  id: string;
  brand_name: string;
  legal_entity_name: string;
  official_website_url: string;
  official_emails: string[];
  official_whatsapp_numbers: string[];
  registration_ids: RegistrationId[];
  official_payment_accounts: PaymentAccount[];
  maps_listings: string[];
  association_memberships: string[];
  org_schema_json_ld: any;
  created_at: string | null;
  updated_at: string | null;
};

function serializeSiteIdentity(data: any): SiteIdentityResponse {
  return {
    ...data,
    official_emails: Array.isArray(data.official_emails)
      ? data.official_emails
      : [],
    official_whatsapp_numbers: Array.isArray(data.official_whatsapp_numbers)
      ? data.official_whatsapp_numbers
      : [],
    registration_ids: Array.isArray(data.registration_ids)
      ? data.registration_ids
      : [],
    official_payment_accounts: Array.isArray(data.official_payment_accounts)
      ? data.official_payment_accounts
      : [],
    maps_listings: Array.isArray(data.maps_listings) ? data.maps_listings : [],
    association_memberships: Array.isArray(data.association_memberships)
      ? data.association_memberships
      : [],
    created_at: data.created_at ? data.created_at.toISOString() : null,
    updated_at: data.updated_at ? data.updated_at.toISOString() : null,
  };
}

// GET /api/site-identity - Get the single site identity record
export async function GET() {
  try {
    // Get the first (and should be only) record
    let siteIdentity = await prisma.site_identity.findFirst({
      orderBy: { created_at: "desc" },
    });

    // If no record exists, create a default one
    if (!siteIdentity) {
      siteIdentity = await prisma.site_identity.create({
        data: {
          brand_name: "Your Brand Name",
          legal_entity_name: "Your Legal Entity Name",
          official_website_url: "https://yourdomain.com",
          official_emails: [],
          official_whatsapp_numbers: [],
          registration_ids: [],
          official_payment_accounts: [],
          maps_listings: [],
          association_memberships: [],
//          org_schema_json_ld: Prisma.JsonNull,
        },
      });
    }

    return NextResponse.json(serializeSiteIdentity(siteIdentity), {
      status: 200,
    });
  } catch (error: any) {
    console.error("GET /api/site-identity error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch site identity",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/site-identity - Update site identity (always updates the first record)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    // Get the existing record
    let existing = await prisma.site_identity.findFirst({
      orderBy: { created_at: "desc" },
    });

    if (!existing) {
      // Create if doesn't exist
      existing = await prisma.site_identity.create({
        data: {
          brand_name: "Your Brand Name",
          legal_entity_name: "Your Legal Entity Name",
          official_website_url: "https://yourdomain.com",
        },
      });
    }

    const data: any = {};

    // Basic fields
    if (typeof body.brand_name === "string") {
      data.brand_name = body.brand_name.trim();
    }
    if (typeof body.legal_entity_name === "string") {
      data.legal_entity_name = body.legal_entity_name.trim();
    }
    if (typeof body.official_website_url === "string") {
      data.official_website_url = body.official_website_url.trim();
    }

    // Array fields - validate they are arrays
    if (Array.isArray(body.official_emails)) {
      data.official_emails = body.official_emails;
    }
    if (Array.isArray(body.official_whatsapp_numbers)) {
      data.official_whatsapp_numbers = body.official_whatsapp_numbers;
    }
    if (Array.isArray(body.registration_ids)) {
      data.registration_ids = body.registration_ids;
    }
    if (Array.isArray(body.official_payment_accounts)) {
      data.official_payment_accounts = body.official_payment_accounts;
    }
    if (Array.isArray(body.maps_listings)) {
      data.maps_listings = body.maps_listings;
    }
    if (Array.isArray(body.association_memberships)) {
      data.association_memberships = body.association_memberships;
    }

    // JSON-LD schema
    if (body.org_schema_json_ld !== undefined) {
      data.org_schema_json_ld = body.org_schema_json_ld;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the record
    const updated = await prisma.site_identity.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json(serializeSiteIdentity(updated), { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/site-identity error:", error);
    return NextResponse.json(
      {
        message: "Failed to update site identity",
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
