import ContactPage from "@/components/website/ContactPage";
import type { Metadata } from "next";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { getEcosystemPageSeo } from "@/lib/content/getEcosystemPageSeo";
import { loadEcosystemPage } from "@/lib/ecosystemContent/staticPageAdapter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const ROUTE = "/contact";

const fallbackSeo = {
  title: "Contact JVTO Tours | Plan Your East Java Adventure",
  h1: "Contact Us",
  description:
    "Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We're here to help you 24/7.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getEcosystemPageSeo(ROUTE, fallbackSeo);
  const title = seo.title;
  const description = seo.description;
  const h1 = seo.h1;

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
  const [seo, page] = await Promise.all([
    getEcosystemPageSeo(ROUTE, fallbackSeo),
    loadEcosystemPage(ROUTE),
  ]);
  const pageContent = (page?.raw as any)?.page?.content?.payload?.pageContent ?? null;

  return (
    <>
      <PageJsonLdCombined pageRow={seo.row as any} />
      <ContactPage title={seo.h1} description={seo.description} content={pageContent} />
    </>
  );
}
