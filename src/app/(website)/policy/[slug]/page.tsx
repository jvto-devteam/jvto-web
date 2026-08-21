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
// dynamicParams = true (2026-08-21). See why-jvto/our-team/[slug] for the full
// account: with false, any path evicted from the cache 404s instead of
// re-rendering, because Next no longer holds the build-time param list at
// runtime. These routes are all in ekosistem's revalidation set, so every
// ekosistem deploy could evict them and turn live pages into 404s. Unknown
// slugs still 404 through the notFound() guard below, which checks the real
// content source rather than the build list.
export const dynamicParams = true;

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
