import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../config";
import { logger } from "../logger";
import { WhatsappGateway } from "../whatsapp/socket";

function assertBearer(
  request: FastifyRequest,
  reply: FastifyReply,
  done: (error?: Error) => void,
) {
  const header = request.headers.authorization;
  if (header !== `Bearer ${config.token}`) {
    void reply.code(401).send({ message: "Unauthorized" });
    return done(new Error("Unauthorized"));
  }
  done();
}

export function createServer(gateway: WhatsappGateway) {
  const app = Fastify({
    loggerInstance: logger,
  });

  app.get("/health", async () => gateway.getHealth());
  app.get("/session/status", { preHandler: assertBearer }, async () => gateway.getHealth());
  app.get("/session/qr", { preHandler: assertBearer }, async () => gateway.getQrPayload());

  app.post<{
    Body: {
      phone?: string;
      conversationId?: string;
      body: string;
      senderType?: "agent" | "bot" | "system";
    };
  }>(
    "/messages/send",
    { preHandler: assertBearer },
    async (request) => {
      const result = await gateway.sendTextMessage({
        phone: request.body.phone,
        conversationId: request.body.conversationId,
        body: request.body.body,
        senderType: request.body.senderType ?? "agent",
      });
      return { ok: true, ...result };
    },
  );

  app.post<{ Body: { conversationId: string; minutes?: number; reason?: string } }>(
    "/automation/pause",
    { preHandler: assertBearer },
    async (request) => {
      await gateway.pauseAutomation(
        request.body.conversationId,
        request.body.minutes ?? config.autoPauseMinutes,
        request.body.reason ?? "manual_pause",
      );
      return { ok: true };
    },
  );

  app.post<{ Body: { conversationId: string } }>(
    "/automation/resume",
    { preHandler: assertBearer },
    async (request) => {
      await gateway.resumeAutomation(request.body.conversationId);
      return { ok: true };
    },
  );

  app.post<{ Body: { contactId: string; bookingId: string } }>(
    "/contacts/link-booking",
    { preHandler: assertBearer },
    async (request) => {
      await gateway.attachContactToBooking(request.body.contactId, request.body.bookingId);
      return { ok: true };
    },
  );

  return app;
}
