import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
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

  // eslint-config-next 16 sudah flat-native — impor langsung, tanpa FlatCompat.
  // (FlatCompat.extends("next/core-web-vitals") crash "circular structure" di eslint 9.)
  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
