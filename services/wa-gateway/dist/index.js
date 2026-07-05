"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const schema_1 = require("./db/schema");
const server_1 = require("./http/server");
const logger_1 = require("./logger");
const socket_1 = require("./whatsapp/socket");
async function main() {
    await (0, schema_1.ensureSchema)();
    const gateway = new socket_1.WhatsappGateway();
    await gateway.start();
    const app = (0, server_1.createServer)(gateway);
    await app.listen({ host: "0.0.0.0", port: config_1.config.port });
    logger_1.logger.info({ port: config_1.config.port }, "JVTO WA gateway is listening");
}
void main().catch((error) => {
    logger_1.logger.error({ error }, "Failed to boot JVTO WA gateway");
    process.exit(1);
});
