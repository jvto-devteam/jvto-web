import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Menggunakan logika serializer yang Anda berikan
function serializeForXML(pkg: any) {
  // --- Logika Gambar ---
  const imageAssets = (pkg.package_assets ?? [])
    .filter((pa: any) => pa.asset?.type === "image")
    .map((pa: any) => ({
      url: pa.asset?.url || "",
      isPrimary: pa.is_primary === true,
    }));

  const primaryImage =
    imageAssets.find((img: any) => img.isPrimary) || imageAssets[0];
  const additionalImages = imageAssets.slice(1, 11); // Ambil up to 10 gambar tambahan

  // --- Logika Harga ---
  const validPrices: number[] = (pkg.package_prices ?? [])
    .map((p: any) => p.price)
    .filter((price: any) => typeof price === "number" && price > 0);
  const startFrom = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  return {
    id: pkg.code, // Google menyarankan ID yang stabil, slug sangat cocok
    title: pkg.name,
    description: pkg.highlights_bullets?.join(". ") || pkg.name,
    link: `https://javavolcano-touroperator.com/${pkg.slug}`,
    image_link: primaryImage?.url,
    additional_images: additionalImages,
    price: `${startFrom} IDR`,
    startDestination: pkg.start_destination?.name || "Surabaya",
    durationLabel: `${pkg.durations?.day || 0}D${pkg.durations?.night || 0}N`,
  };
}

export async function GET() {
  try {
    const pkgs = await prisma.packages.findMany({
      where: { is_publish: true },
      include: {
        start_destination: true,
        durations: true,
        package_prices: true,
        package_assets: { include: { asset: true } },
      },
    });

    const baseUrl = "https://javavolcano-touroperator.com"

    // Header XML dengan Namespace Google Merchant Center
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Java Volcano Tour Operator (JVTO) - Tours Feed</title>
    <link>${baseUrl}</link>
    <description>Discover the ultimate collection of volcanic adventures, waterfall expeditions, and wildlife safaris across East Java and Bali</description>`;

    pkgs.forEach((rawPkg) => {
      const p = serializeForXML(rawPkg);

      xml += `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${p.link}</g:link>
      <g:image_link>${baseUrl+p.image_link}</g:image_link>
      ${p.additional_images
        .map(
          (img) =>
            `<g:additional_image_link>${baseUrl+img.url}</g:additional_image_link>`
        )
        .join("")}
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}</g:price>
      <g:brand>JVTO</g:brand>
      <g:google_product_category>8</g:google_product_category>
      <g:custom_label_0>${p.durationLabel}</g:custom_label_0>
      <g:custom_label_1>From ${p.startDestination}</g:custom_label_1>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate", // Cache 24 jam
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate feed" },
      { status: 500 }
    );
  }
}
