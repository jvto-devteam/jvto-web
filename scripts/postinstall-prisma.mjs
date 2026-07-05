// scripts/postinstall-prisma.mjs
// Postinstall safety net: regenerate the Prisma client on every install so the
// app keeps building once src/generated/prisma is untracked from git (W1).
//
// Why a wrapper instead of a bare `postinstall: prisma generate`:
// prisma.config.ts hard-requires DATABASE_URL at config load (throws
// PrismaConfigEnvError), but `prisma generate` never actually connects. Installs
// routinely run where no env file exists — the CI verify job's `npm ci` step,
// fresh clones, sandboxes — and prisma.config.ts only dotenv-loads `.env`, not
// `.env.local` (where the VPS keeps DATABASE_URL). Injecting a dummy URL when
// the variable is absent keeps all of those working; a real DATABASE_URL, when
// present, is used untouched. Same trick as ci.yml's explicit generate step.
import { spawnSync } from 'node:child_process';

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'; // generate-only, never connects
}

const result = spawnSync('npx', ['--no-install', 'prisma', 'generate'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});

if (result.error || result.status === null) {
  // prisma CLI unavailable (e.g. --omit=dev install): warn, don't break install.
  console.warn('[postinstall] prisma CLI not available — skipping client generation.');
  process.exit(0);
}
process.exit(result.status);
