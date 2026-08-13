import { notFound } from "next/navigation";
import {
  generatePolicyEcosystemMetadata,
  generatePolicyEcosystemStaticParams,
  PolicyEcosystemPage,
} from "../PolicyEcosystemPage";

type Props = {
  params: Promise<{ slug: string }>;
};

const FOLDER_ROUTED_SLUGS = new Set([
  "booking-payment-cancellation",
  "inclusions-exclusions",
  "privacy",
]);

export const revalidate = 300;
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await generatePolicyEcosystemStaticParams();
  return params.filter(({ slug }) => !FOLDER_ROUTED_SLUGS.has(slug));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generatePolicyEcosystemMetadata(`/policy/${slug}`);
}

export default async function PolicyDynamicPage({ params }: Props) {
  const { slug } = await params;
  if (FOLDER_ROUTED_SLUGS.has(slug)) return notFound();
  return <PolicyEcosystemPage route={`/policy/${slug}`} />;
}
