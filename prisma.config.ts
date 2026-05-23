import 'dotenv/config';
import { defineConfig } from "prisma/config";

// `prisma generate` (postinstall on Vercel) only needs DATABASE_URL for codegen
// metadata, not to connect. Falling back to a placeholder lets the generator
// run when the build env legitimately has no DB access. Runtime queries still
// require the real DATABASE_URL — they are guarded by safeBuildQuery()
// in generateStaticParams / sitemap.data and by Prisma itself at request time.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});
