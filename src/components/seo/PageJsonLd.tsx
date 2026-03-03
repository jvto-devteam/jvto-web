import { JsonLd } from "./JsonLd";
import { buildPageJsonLd } from "@/lib/seo/buildPageJsonLd";

export function PageJsonLd({
  row,
}: {
  row: {
    route: string;
    lang: string;
    seo: any;
    content: any;
    created_at: Date;
    updated_at: Date;
  };
}) {
  const jsonld = buildPageJsonLd(row);
  return <JsonLd data={jsonld} />;
}
