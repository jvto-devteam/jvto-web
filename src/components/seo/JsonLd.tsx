import React from "react";
import { normalizeJsonLd } from "@/lib/seo/jsonld/normalize";

type JsonLdValue =
  | Record<string, any>[]
  | Record<string, any>
  | null
  | undefined;

export function JsonLd({ data }: { data: JsonLdValue }) {
  const payload = normalizeJsonLd(data);
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      // Menggunakan tag HTML standar agar langsung tercetak di Server-Side
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload, (_, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      }}
    />
  );
}
