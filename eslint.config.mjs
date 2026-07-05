// Native flat config — eslint-config-next 16.x ships flat-config arrays via its
// package exports, so FlatCompat (@eslint/eslintrc) is no longer needed. The old
// FlatCompat path crashed eslint entirely (circular structure thrown while
// eslintrc formatted a config-schema error for eslint-plugin-react).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // ⬅️ bagian penting untuk skip warning "Unused eslint-disable directive"
    linterOptions: {
      // "off" = tidak pernah lapor komentar eslint-disable yang tidak terpakai
      // kalau mau masih kelihatan sebagai warning, pakai "warn"
      reportUnusedDisableDirectives: "off",
    },
  },

  ...coreWebVitals,
  ...nextTypescript,

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
      // Producer-repo checkout that exists only inside the CI verify job
      // (ci.yml checks out sambuko82/llm-wiki into ./llm-wiki). Must be
      // ignored so the CI lint count matches local runs (lint-gate baseline).
      "llm-wiki/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
