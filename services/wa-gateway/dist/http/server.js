"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const fastify_1 = __importDefault(require("fastify"));
const config_1 = require("../config");
const logger_1 = require("../logger");
function assertBearer(request, reply, done) {
    const header = request.headers.authorization;
    if (header !== `Bearer ${config_1.config.token}`) {
        void reply.code(401).send({ message: "Unauthorized" });
        return done(new Error("Unauthorized"));
    }
    done();
}
function createServer(gateway) {
    const app = (0, fastify_1.default)({
        loggerInstance: logger_1.logger,
    });
    app.get("/health", async () => gateway.getHealth());
    app.get("/session/status", { preHandler: assertBearer }, async () => gateway.getHealth());
    app.get("/session/qr", { preHandler: assertBearer }, async () => gateway.getQrPayload());
    app.post("/messages/send", { preHandler: assertBearer }, async (request) => {
        const result = await gateway.sendTextMessage({
            phone: request.body.phone,
            conversationId: request.body.conversationId,
            body: request.body.body,
            senderType: request.body.senderType ?? "agent",
        });
        return { ok: true, ...result };
    });
    app.post("/automation/pause", { preHandler: assertBearer }, async (request) => {
        await gateway.pauseAutomation(request.body.conversationId, request.body.minutes ?? config_1.config.autoPauseMinutes, request.body.reason ?? "manual_pause");
        return { ok: true };
    });
    app.post("/automation/resume", { preHandler: assertBearer }, async (request) => {
        await gateway.resumeAutomation(request.body.conversationId);
        return { ok: true };
    });
    app.post("/contacts/link-booking", { preHandler: assertBearer }, async (request) => {
        await gateway.attachContactToBooking(request.body.contactId, request.body.bookingId);
        return { ok: true };
    });
    return app;
}
