import React from 'react';
import { normalizeJsonLd } from "@/lib/seo/jsonld/normalize";

interface StructuredDataProps {
  data: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const payload = normalizeJsonLd(data);
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
};

export default StructuredData;
