
import React from 'react';

const JsonLd: React.FC<{ schema: object }> = ({ schema }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default JsonLd;
