import "dotenv/config";
import path from "path";
import { z } from "zod";

const envSchema = z.object({
  WA_GATEWAY_PORT: z.coerce.number().int().positive().default(4010),
  WA_GATEWAY_TOKEN: z.string().min(16),
  WA_SESSION_DIR: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  WA_JVTO_NUMBER: z.string().min(8),
  WA_AUTO_REPLY_ENABLED: z
    .string()
    .optional()
    .transform((value) => value !== "false"),
  WA_AUTO_PAUSE_MINUTES: z.coerce.number().int().positive().default(180),
  WA_RULESET_PATH: z.string().optional(),
  JVTO_PUBLIC_BASE_URL: z
    .string()
    .url()
    .default("https://javavolcano-touroperator.com"),
});

const parsed = envSchema.parse(process.env);

export const config = {
  port: parsed.WA_GATEWAY_PORT,
  token: parsed.WA_GATEWAY_TOKEN,
  sessionDir: parsed.WA_SESSION_DIR,
  databaseUrl: parsed.DATABASE_URL,
  jvtoNumber: parsed.WA_JVTO_NUMBER,
  autoReplyEnabled: parsed.WA_AUTO_REPLY_ENABLED,
  autoPauseMinutes: parsed.WA_AUTO_PAUSE_MINUTES,
  rulesetPath:
    parsed.WA_RULESET_PATH ||
    path.resolve(process.cwd(), "../../docs/whatsapp-jvto-semi-chatbot-templates.json"),
  publicBaseUrl: parsed.JVTO_PUBLIC_BASE_URL.replace(/\/$/, ""),
};
