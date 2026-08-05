/**
 * Domain event contract + the canonical initial event catalog (handoff §7.7).
 * Milestone 1 — types + the frozen event-name union. No dispatch here; the outbox
 * (src/infrastructure/outbox) transports these behind a disabled flag.
 */
import type { UUID, ISODateTime } from "./ids";

export interface DomainEvent<T = unknown> {
  eventId: UUID;
  eventType: DomainEventType;
  aggregateType: string;
  aggregateId: UUID;
  aggregateVersion: number;
  occurredAt: ISODateTime;
  actorId?: UUID;
  correlationId: UUID;
  causationId?: UUID;
  payload: T;
  schemaVersion: number;
}

/** Required initial events, verbatim from handoff §7.7. */
export const DOMAIN_EVENT_TYPES = [
  "inquiry.created",
  "quote.issued",
  "quote.expired",
  "booking.created",
  "booking.confirmed",
  "booking.amended",
  "deposit.requested",
  "deposit.paid",
  "balance.due",
  "payment.failed",
  "pickup.required",
  "pickup.confirmed",
  "health.required",
  "health.completed",
  "crew.assigned",
  "vehicle.assigned",
  "trip.ready",
  "trip.started",
  "trip.completed",
  "review.requested",
  "communication.requested",
  "communication.sent",
  "communication.failed",
] as const;

export type DomainEventType = (typeof DOMAIN_EVENT_TYPES)[number];

export const isDomainEventType = (v: unknown): v is DomainEventType =>
  typeof v === "string" && (DOMAIN_EVENT_TYPES as readonly string[]).includes(v);
