import type { Metadata } from "next";
import { BASE_URL } from "@/lib/site";

type BuildWebsiteMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

export function buildWebsiteMetadata({
  title,
  description,
  path,
  image = "/assets/img/og/default.jpg",
  imageAlt = title,
}: BuildWebsiteMetadataInput): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonical}`,
      siteName: "Java Volcano Tour Operator",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
