"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    WA_GATEWAY_PORT: zod_1.z.coerce.number().int().positive().default(4010),
    WA_GATEWAY_TOKEN: zod_1.z.string().min(16),
    WA_SESSION_DIR: zod_1.z.string().min(1),
    DATABASE_URL: zod_1.z.string().min(1),
    WA_JVTO_NUMBER: zod_1.z.string().min(8),
    WA_AUTO_REPLY_ENABLED: zod_1.z
        .string()
        .optional()
        .transform((value) => value !== "false"),
    WA_AUTO_PAUSE_MINUTES: zod_1.z.coerce.number().int().positive().default(180),
    WA_RULESET_PATH: zod_1.z.string().optional(),
    JVTO_PUBLIC_BASE_URL: zod_1.z
        .string()
        .url()
        .default("https://javavolcano-touroperator.com"),
});
const parsed = envSchema.parse(process.env);
exports.config = {
    port: parsed.WA_GATEWAY_PORT,
    token: parsed.WA_GATEWAY_TOKEN,
    sessionDir: parsed.WA_SESSION_DIR,
    databaseUrl: parsed.DATABASE_URL,
    jvtoNumber: parsed.WA_JVTO_NUMBER,
    autoReplyEnabled: parsed.WA_AUTO_REPLY_ENABLED,
    autoPauseMinutes: parsed.WA_AUTO_PAUSE_MINUTES,
    rulesetPath: parsed.WA_RULESET_PATH ||
        path_1.default.resolve(process.cwd(), "../../docs/whatsapp-jvto-semi-chatbot-templates.json"),
    publicBaseUrl: parsed.JVTO_PUBLIC_BASE_URL.replace(/\/$/, ""),
};
