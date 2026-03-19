import { normalizeJsonLd } from "@/lib/seo/jsonld/normalize";

type Props = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({ data }: Props) {
  const payload = normalizeJsonLd(data as any);
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
