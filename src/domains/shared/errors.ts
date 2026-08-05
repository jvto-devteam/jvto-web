/**
 * Error contracts (handoff §7.9). Stable machine-readable codes + an RFC-7807-style
 * problem envelope + a typed DomainError base. Milestone 1 — no throwing paths wired
 * into existing routes; this is the shared vocabulary later domains return.
 */

/** Stable, machine-readable error codes (extend deliberately, never renumber). */
export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "IDEMPOTENCY_REPLAY",
  "VERSION_MISMATCH",
  "QUOTE_EXPIRED",
  "PRICE_STALE",
  "PROVIDER_ERROR",
  "RATE_LIMITED",
  "INTERNAL",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/** RFC-7807-style problem envelope for HTTP boundaries (§7.9). */
export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  code: ErrorCode;
  detail?: string;
  requestId: string;
  fieldErrors?: Record<string, string[]>;
}

export class DomainError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly fieldErrors?: Record<string, string[]>;
  constructor(
    code: ErrorCode,
    message: string,
    opts: { httpStatus?: number; fieldErrors?: Record<string, string[]>; cause?: unknown } = {},
  ) {
    super(message, opts.cause !== undefined ? { cause: opts.cause } : undefined);
    this.name = "DomainError";
    this.code = code;
    this.httpStatus = opts.httpStatus ?? defaultStatusFor(code);
    this.fieldErrors = opts.fieldErrors;
  }

  toProblem(requestId: string): ApiProblem {
    return {
      type: `https://errors.jvto/${this.code.toLowerCase()}`,
      title: this.code,
      status: this.httpStatus,
      code: this.code,
      detail: this.message,
      requestId,
      fieldErrors: this.fieldErrors,
    };
  }
}

function defaultStatusFor(code: ErrorCode): number {
  switch (code) {
    case "VALIDATION_FAILED":
    case "QUOTE_EXPIRED":
    case "PRICE_STALE":
    case "VERSION_MISMATCH":
      return 422;
    case "UNAUTHENTICATED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "IDEMPOTENCY_REPLAY":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "PROVIDER_ERROR":
      return 502;
    default:
      return 500;
  }
}
