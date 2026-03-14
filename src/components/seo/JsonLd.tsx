import React from "react";
import Script from "next/script";

type JsonLdValue =
  | Record<string, any>[]
  | Record<string, any>
  | null
  | undefined;

function normalize(data: JsonLdValue): Record<string, any>[] {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(Boolean) as Record<string, any>[];
  if (typeof data === "object") return [data as Record<string, any>];
  return [];
}

export function JsonLd({ data }: { data: JsonLdValue }) {
  const payload = normalize(data);
  if (!payload.length) return null;

  return (
    <Script
      id={`json-ld-${Math.random().toString(36).substring(2, 9)}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html:
          payload.length === 1
            ? JSON.stringify(payload[0])
            : JSON.stringify(payload),
      }}
    />
  );
}
