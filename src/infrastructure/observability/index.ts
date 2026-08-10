/**
 * Correlation IDs + structured logging (handoff §16 M1, field set §20.1).
 * Milestone 1 — a pure structured logger + correlation helpers. Not wired into
 * existing routes; opt-in. Never logs secrets/PII (§20.1) — callers pass only
 * redacted/opaque values.
 */
import type { UUID } from "../../domains/shared/ids";

export type LogLevel = "debug" | "info" | "warn" | "error";

/** Structured log record — the §20.1 field set (opaque/hashed where noted). */
export interface LogFields {
  requestId?: string;
  correlationId?: string;
  service?: string;
  module?: string;
  actorId?: string; // hashed/redacted by the caller
  bookingId?: string; // opaque reference, never a sequential id
  eventType?: string;
  provider?: string;
  result?: string;
  errorCode?: string;
  durationMs?: number;
  commitSha?: string;
  [extra: string]: unknown;
}

export interface Logger {
  child(bindings: LogFields): Logger;
  log(level: LogLevel, message: string, fields?: LogFields): void;
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

type Sink = (line: string) => void;

/** Deterministic structured logger. `now` + `sink` are injectable for tests. */
export function createLogger(
  base: LogFields = {},
  opts: { sink?: Sink; now?: () => string } = {},
): Logger {
  const sink: Sink = opts.sink ?? ((line) => console.log(line));
  const now = opts.now ?? (() => new Date().toISOString());

  const emit = (level: LogLevel, message: string, fields?: LogFields) => {
    const record = { timestamp: now(), level, message, ...base, ...fields };
    sink(JSON.stringify(record));
  };

  const logger: Logger = {
    child: (bindings) => createLogger({ ...base, ...bindings }, opts),
    log: emit,
    debug: (m, f) => emit("debug", m, f),
    info: (m, f) => emit("info", m, f),
    warn: (m, f) => emit("warn", m, f),
    error: (m, f) => emit("error", m, f),
  };
  return logger;
}

/**
 * Derive a correlation id from an incoming request header, or mint one. Kept simple
 * + dependency-free; callers pass a generator so this module has no ambient state.
 */
export function correlationIdFrom(
  headerValue: string | null | undefined,
  generate: () => UUID,
): UUID {
  const trimmed = headerValue?.trim();
  return trimmed ? (trimmed as UUID) : generate();
}
