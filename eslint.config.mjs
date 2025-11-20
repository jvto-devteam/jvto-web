import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // ⬅️ bagian penting untuk skip warning "Unused eslint-disable directive"
    linterOptions: {
      // "off" = tidak pernah lapor komentar eslint-disable yang tidak terpakai
      // kalau mau masih kelihatan sebagai warning, pakai "warn"
      reportUnusedDisableDirectives: "off",
    },
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

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
