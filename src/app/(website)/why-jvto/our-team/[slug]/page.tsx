import {
  EcosystemContentPage,
  generateEcosystemContentMetadata,
  generateEcosystemContentStaticParams,
} from "../../../_ecosystem/EcosystemContentPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return generateEcosystemContentStaticParams("/why-jvto/our-team");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateEcosystemContentMetadata(`/why-jvto/our-team/${slug}`);
}

export default async function CrewMemberPage({ params }: Props) {
  const { slug } = await params;
  return (
    <EcosystemContentPage
      route={`/why-jvto/our-team/${slug}`}
      sectionLabel="Why JVTO"
      eyebrow="Why JVTO - Our Team"
      navBase="/why-jvto"
    />
  );
}
