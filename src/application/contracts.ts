/**
 * Application layer contracts (handoff §7.8). Domain behavior is invoked through
 * command/query handlers — never direct Prisma from pages, route handlers, message
 * templates, or AI adapters. Milestone 1 defines the shapes + the canonical command
 * and query catalogs; concrete handlers arrive with their domains in later milestones.
 */
import type { UUID } from "../domains/shared/ids";
import type { DomainError } from "../domains/shared/errors";

export interface CommandContext {
  actorId?: UUID;
  actorRoles?: string[];
  correlationId: UUID;
  requestId: string;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: DomainError };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <T = never>(error: DomainError): Result<T> => ({ ok: false, error });

export interface CommandHandler<Input, Output> {
  readonly command: CommandName;
  execute(input: Input, ctx: CommandContext): Promise<Result<Output>>;
}

export interface QueryHandler<Input, Output> {
  readonly query: QueryName;
  run(input: Input, ctx: CommandContext): Promise<Result<Output>>;
}

/** Initial command catalog (§7.8). */
export const COMMAND_NAMES = [
  "CreateQuote",
  "ExpireQuote",
  "CreateBooking",
  "ImportChannelBooking",
  "AmendBooking",
  "AcceptBookingAgreement",
  "RecordPaymentProviderEvent",
  "ApproveManualPayment",
  "RequestRefund",
  "RequireJourneyTask",
  "SubmitJourneyTask",
  "VerifyJourneyTask",
  "WaiveJourneyTask",
  "AssignCrew",
  "AssignVehicle",
  "MarkTripReady",
  "StartTrip",
  "CompleteTrip",
  "RequestCommunication",
  "ResolveIntegrationException",
] as const;
export type CommandName = (typeof COMMAND_NAMES)[number];

/** Initial query / read-model catalog (§7.8). */
export const QUERY_NAMES = [
  "GetPublicPage",
  "ListPublicRoutes",
  "GetPublicProduct",
  "ListPublicProducts",
  "GetFreshQuoteContext",
  "GetBookingAgreement",
  "GetBookingBalance",
  "GetGuestJourney",
  "GetOperationsReadiness",
  "ListOperationsExceptions",
  "GetPublicOperationalStatus",
  "GetAgentDecisionEnvelope",
] as const;
export type QueryName = (typeof QUERY_NAMES)[number];
