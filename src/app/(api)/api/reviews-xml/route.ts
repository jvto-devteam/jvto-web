import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeXml(str?: string | null) {
  if (!str) return "";

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cleanContent(str?: string | null) {
  if (!str) return "";
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // Hapus Emoji
    .replace(/\s+/g, " ") // Rapikan spasi berlebih
    .trim();
}

export async function GET() {
  try {
    const reviews = await prisma.reviews.findMany({
      where: {
        package_id: {
          not: null,
        },
      },
      include: {
        package: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const reviewsXml = reviews
      .map((r) => {
        const reviewId = `${r.id.toString()}`;

        const productUrl = r.package?.slug
          ? `https://javavolcano-touroperator.com/${r.package.slug}`
          : "";

        return `
  <review>
    <review_id>${reviewId}</review_id>

    <reviewer>
      <name>${escapeXml(r.customer_name)}</name>
    </reviewer>

    <review_timestamp>${r.date.toISOString()}</review_timestamp>

    <content><![CDATA[${cleanContent(r.review)}]]></content>

    <review_url type="singleton">https://javavolcano-touroperator.com/why-jvto/reviews/${reviewId}</review_url>

    <ratings>
      <overall min="1" max="5">${r.star ?? 5}</overall>
    </ratings>

    <products>
      <product>
        <product_ids>
          <mpns>
            <mpn>${escapeXml(r.package?.code)}</mpn>
          </mpns>
          <skus>
            <sku>${escapeXml(r.package?.code)}</sku>
          </skus>
          <brands>
            <brand>JVTO</brand>
          </brands>
        </product_ids>

        <product_name><![CDATA[ ${r.package?.name ?? ""} ]]></product_name>

        <product_url>${productUrl}</product_url>
      </product>
    </products>

    <is_verified_purchase>true</is_verified_purchase>
  </review>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="http://www.google.com/shopping/reviews/schema/product/2.4/product_reviews.xsd">

  <version>2.4</version>

  <publisher>
    <name>Java Volcano Tour Operator</name>
    <favicon>https://javavolcano-touroperator.com/assets/img/jvto-color.png</favicon>
  </publisher>

  <reviews>
    ${reviewsXml}
  </reviews>
</feed>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("XML Reviews error:", err);
    return new NextResponse("Failed to generate XML", { status: 500 });
  }
}
