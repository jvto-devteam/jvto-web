import ContactPage from "@/components/website/ContactPage";
import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content/getPageSeo";
import { PageJsonLdCombined } from "@/components/seo/PageJsonLdCombined";
import { buildWebsiteMetadata } from "@/lib/seo/pageMetadata";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const fallbackSeo = {
  title: "Contact JVTO Tours | Plan Your East Java Adventure",
  h1: "Contact Us",
  description:
    "Get in touch with our expert team to plan your private, all-inclusive tour of Mount Bromo, Ijen, and more. We're here to help you 24/7.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/contact", fallbackSeo);

  return buildWebsiteMetadata({
    title: seo.title,
    description: seo.description,
    path: "/contact",
    image: "/assets/img/og/contact.webp",
    imageAlt: seo.h1,
  });
}

export default async function Contact() {
  const seo = await getPageSeo("/contact", fallbackSeo);
  const pageRow = seo.row
    ? {
        route: seo.row.route,
        lang: seo.row.lang,
        seo: seo.row.seo,
        content: seo.row.content,
        created_at: seo.row.created_at,
        updated_at: seo.row.updated_at,
      }
    : {
        route: "/contact",
        lang: "en",
        seo: {
          title: seo.title,
          description: seo.description,
        },
        content: {
          h1: seo.h1,
        },
      };

  return (
    <>
      <PageJsonLdCombined pageRow={pageRow as any} />
      <ContactPage title={seo.h1} description={seo.description} />
    </>
  );
}
