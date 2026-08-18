import { NextResponse } from "next/server";
import { getEcosystemPackagesList } from "@/lib/ecosystemContent/tourPackageDetail";

// Migrated 2026-08-18: no internal caller found for this route (checked fetch calls,
// imports, git history) — sourced from ekosistem per owner decision. 24h feed cache
// already tolerates the "snapshot, not live" trade-off that comes with ekosistem.
function serializeForXML(pkg: Awaited<ReturnType<typeof getEcosystemPackagesList>>[number]) {
  const images = pkg.images.map((img) => img.url);
  const primaryImage = images[0];
  const additionalImages = images.slice(1, 11);

  return {
    id: pkg.slug,
    title: pkg.name,
    description: pkg.highlights.join(". ") || pkg.name,
    link: `https://javavolcano-touroperator.com/${pkg.slug}`,
    image_link: primaryImage,
    additional_images: additionalImages.map((url) => ({ url })),
    price: `${pkg.startFrom} IDR`,
    startDestination: pkg.startDestination || "Surabaya",
    durationLabel: `${pkg.duration.day}D${pkg.duration.night}N`,
  };
}

export async function GET() {
  try {
    const pkgs = await getEcosystemPackagesList();

    const baseUrl = "https://javavolcano-touroperator.com";

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
      <g:image_link>${baseUrl + p.image_link}</g:image_link>
      ${p.additional_images
        .map(
          (img: { url: string }) =>
            `<g:additional_image_link>${
              baseUrl + img.url
            }</g:additional_image_link>`
        )
        .join("")}
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}</g:price>
      <g:brand>JVTO</g:brand>
      <g:mpn>${p.id}</g:mpn> 
      <g:identifier_exists>true</g:identifier_exists>
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
