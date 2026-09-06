/**
 * Installs ts-resolve-hooks for a whole node process. Load it with
 * `node --import ./scripts/lib/register-ts-hook.mjs <entry>` so the hook is in
 * place before the entry module is linked — a top-level register() inside the
 * entry itself runs after its own imports have already been resolved, which is
 * too late. See scripts/lib/ts-resolve-hooks.mjs for what it resolves and why.
 *
 * Decision D-2026-09-06-03, docs/audit/decision-log.json.
 */
import { register } from "node:module";

register(new URL("./ts-resolve-hooks.mjs", import.meta.url));
