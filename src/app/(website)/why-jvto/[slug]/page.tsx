import { notFound } from "next/navigation";
import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
  generateEcosystemContentStaticParams,
} from "../../_ecosystem/EcosystemContentPage";

type Props = {
  params: Promise<{ slug: string }>;
};

const FOLDER_ROUTED_SLUGS = new Set([
  "community-standards",
  "our-story",
  "our-team",
  "reviews",
  "the-jvto-difference",
]);

export const revalidate = 300;
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await generateEcosystemContentStaticParams("/why-jvto");
  return params.filter(({ slug }) => !FOLDER_ROUTED_SLUGS.has(slug));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateEcosystemContentMetadata(`/why-jvto/${slug}`);
}

export default async function WhyJvtoDynamicPage({ params }: Props) {
  const { slug } = await params;
  if (FOLDER_ROUTED_SLUGS.has(slug)) return notFound();
  return (
    <EcosystemContentPage
      route={`/why-jvto/${slug}`}
      sectionLabel="Why JVTO"
      navBase="/why-jvto"
    />
  );
}
