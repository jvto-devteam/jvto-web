import ContactPage from "@/components/website/ContactPage";
import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getPublicPageSnapshot } from "@/lib/publicContent/getPublicPageSnapshot";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const ROUTE = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicPageSnapshot(ROUTE);
  const title = page.snapshot.seo.title;
  const description = page.snapshot.seo.description ?? "";
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteUrl + "/assets/img/og/contact.webp",
          width: 1200,
          height: 630,
          alt: h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/assets/img/og/contact.webp"],
    },
  };
}

export default async function Contact() {
  const page = await getPublicPageSnapshot(ROUTE);
  const description = page.snapshot.seo.description ?? "";
  const h1 =
    typeof page.snapshot.content.h1 === "string"
      ? page.snapshot.content.h1
      : page.snapshot.seo.title;

  return (
    <>
      <PageJsonLdCombined pageRow={page.pageRow} />
      <ContactPage title={h1} description={description} />
    </>
  );
}
