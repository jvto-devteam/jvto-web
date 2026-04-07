import { config } from "./config";
import { ensureSchema } from "./db/schema";
import { createServer } from "./http/server";
import { logger } from "./logger";
import { WhatsappGateway } from "./whatsapp/socket";

async function main(): Promise<void> {
  await ensureSchema();

  const gateway = new WhatsappGateway();
  await gateway.start();

  const app = createServer(gateway);
  await app.listen({ host: "0.0.0.0", port: config.port });
  logger.info({ port: config.port }, "JVTO WA gateway is listening");
}

void main().catch((error) => {
  logger.error({ error }, "Failed to boot JVTO WA gateway");
  process.exit(1);
});
