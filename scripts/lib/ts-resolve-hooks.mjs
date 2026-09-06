/**
 * ts-resolve-hooks.mjs — teach plain `node` the two resolution rules that live in
 * tsconfig.json and nowhere node can see them. Pure Node ESM, zero dependencies.
 *
 * Usage (the caller registers, this module never self-registers):
 *   import { register } from "node:module";
 *   import { pathToFileURL } from "node:url";
 *   register(pathToFileURL("scripts/lib/ts-resolve-hooks.mjs"));
 *   const { getPublicCrewCodes } = await import("../src/lib/people/canonicalPeople.ts");
 *
 * `register()` must run BEFORE the modules it affects are imported, so a consumer
 * cannot statically import them — use `await import()` after registering, or put
 * the registration behind `node --import`.
 *
 * WHY THIS EXISTS. Node 24 strips TypeScript types on its own, so scripts/*.mjs can
 * import src/**\/*.ts directly and reuse the real loaders instead of copying their
 * rules. Two things still break, and they are different problems:
 *
 *   1. `@/lib/...` is a tsconfig `paths` alias. Node does not read tsconfig, so it
 *      reports `Cannot find package '@/lib'`.
 *   2. `../ecosystemContent/people` has no extension. TypeScript, webpack and
 *      Turbopack all infer `.ts`; Node ESM never does, and reports
 *      `Cannot find module '...\ecosystemContent\people'`.
 *
 * Measured 2026-09-06: rewriting (1) to a relative specifier leaves (2) standing —
 * the import still fails. Both must be handled, which is why this is a resolver hook
 * and not a two-line edit to the source file. The alternative was tsconfig's
 * `allowImportingTsExtensions`, rejected by the owner (decision D-2026-09-06-02)
 * because it changes repo-wide config and spreads `.ts` suffixes through src/.
 *
 * LIMITS, stated rather than discovered later:
 *   - Resolution only. This does not transform anything; type-stripping is Node's.
 *   - A module whose own import throws at load time still throws. Notably
 *     src/lib/site.ts throws when NEXT_PUBLIC_SITE_URL is unset, so anything that
 *     value-imports it (e.g. src/lib/ecosystemContent/blog.ts) stays unloadable
 *     under a bare `node` invocation. That is an env contract, not a resolution bug.
 *   - Extension candidates are tried in a fixed order and the first existing file
 *     wins. A directory holding both `x.ts` and `x/index.ts` resolves to `x.ts`,
 *     matching TypeScript.
 *   - Applies to every specifier in the process once registered, including
 *     node_modules. Real packages resolve normally because the fallback only runs
 *     after nextResolve has already failed with ERR_MODULE_NOT_FOUND.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/** Thrown when the hook is registered somewhere it cannot do its job at all. */
export class ResolveHookError extends Error {}

const ALIAS_PREFIX = "@/";

/**
 * `paths` in tsconfig.json maps "@/*" to "./src/*", resolved from the repo root.
 * Callers run from the repo root (every npm script in this repo does), so cwd is
 * the default; JVTO_SRC_DIR exists for a caller that cannot guarantee that.
 */
const SRC_DIR = process.env.JVTO_SRC_DIR
  ? path.resolve(process.env.JVTO_SRC_DIR)
  : path.join(process.cwd(), "src");

if (!existsSync(SRC_DIR)) {
  // Failing loudly here beats resolving nothing: an unresolved alias surfaces as
  // ERR_MODULE_NOT_FOUND deep inside an unrelated module, which reads like a
  // missing dependency rather than a misconfigured hook.
  throw new ResolveHookError(
    `ts-resolve-hooks: source dir not found at ${SRC_DIR}. ` +
      `Run from the repo root, or set JVTO_SRC_DIR to the directory "@/" should map to.`,
  );
}

/** Extension candidates, in TypeScript's own precedence order. */
const CANDIDATE_SUFFIXES = [".ts", ".tsx", ".mts", "/index.ts", "/index.tsx"];

function firstExistingFile(basePath) {
  for (const suffix of CANDIDATE_SUFFIXES) {
    const candidate = `${basePath}${suffix}`;
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Node resolve hook. Rewrites "@/..." to an absolute file URL, then lets Node try;
 * only if Node reports the module missing does it retry with TS extensions.
 */
export async function resolve(specifier, context, nextResolve) {
  let spec = specifier;

  if (spec.startsWith(ALIAS_PREFIX)) {
    const aliased = path.join(SRC_DIR, spec.slice(ALIAS_PREFIX.length));
    const hit = firstExistingFile(aliased) ?? (existsSync(aliased) ? aliased : null);
    if (hit) spec = pathToFileURL(hit).href;
  }

  try {
    return await nextResolve(spec, context);
  } catch (error) {
    // Anything other than "not found" is a real error — a syntax problem, a bad
    // package export map — and must not be masked by an extension retry.
    if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    if (!spec.startsWith(".") && !spec.startsWith("file:")) throw error;

    const base = context.parentURL ?? pathToFileURL(`${process.cwd()}/`).href;
    const hit = firstExistingFile(fileURLToPath(new URL(spec, base)));
    if (!hit) throw error;

    return nextResolve(pathToFileURL(hit).href, context);
  }
}
