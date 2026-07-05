// app/(website)/checkout/page.tsx
// Server Component — reads ?pid from URL and emits Product schema into initial HTML.
// All checkout UI and localStorage logic lives in CheckoutInner (client component).

import CheckoutInner from "./CheckoutInner";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ pid?: string }>;
}) {
  const { pid } = await searchParams;

  const schema = pid
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        productID: pid,
        sku: pid,
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CheckoutInner />
    </>
  );
}
