// app/(website)/tours/[slug]/page.tsx
import TourDetail from "@/components/website/TourDetail";
import StructuredData from "@/components/website/StructuredData";
import { notFound } from "next/navigation";
import type { TourPackageDetail } from "@/interfaces";


export const dynamic = 'force-dynamic';
// or export const revalidate = 60; if you can cache

interface Props {
  params: { slug: string[] };
}

export default async function Page({ params }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // gabungkan kembali slug multi-segmen
  const fullSlug = `tours/from-bali/${params.slug}`

  const res = await fetch(
    `${siteUrl}/api/packages/web/details?slug=${fullSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const tour: TourPackageDetail = await res.json();

  return (
    <>
      <StructuredData data={{}} />
      <TourDetail initialData={tour} />
    </>
  );
}
