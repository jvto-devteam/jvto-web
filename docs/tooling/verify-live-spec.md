# `verify-live.mjs` — contract

What `scripts/verify-live.mjs` actually does, extracted from the source on
2026-09-04 at commit `3ce5f5cb`. Nothing here is aspirational: every flag,
check, exit code and field below was read out of the file, and the regression
table at the bottom lists commands that were run.

The tool exists because CLAUDE.md Rule 8 forbids verifying rendered HTML by
reading `.next` files — routes marked `ƒ (Dynamic)` have no file to read — and
Rule 9 requires a fix to be re-measured at the scope the defect was found. A
302-URL sweep by hand is not a thing anyone does twice, so both rules needed a
command.

> **Two things this document deliberately does not claim.** There is no
> `src/lib/cli/contract.mjs` in this repository — the flag contract lives in the
> `FLAGS` table inside `verify-live.mjs` itself. And `og:image` / `twitter:image`
> are **not** checked; see [Not checked](#not-checked).

---

## Flags

Every flag is declared in one `FLAGS` table (`verify-live.mjs`), and the parse
loop reads that table rather than hand-written per-flag blocks. A flag that
takes a value declares how to coerce it and what counts as valid, so a new flag
cannot skip validation by being forgotten — only by declaring none.

| Flag | Value | Default | Validation |
|---|---|---|---|
| `--sitemap` | none | off | — takes the route list from `<base>/sitemap.xml` |
| `--quiet` | none | off | — suppresses per-route `PASS` lines; failures still print |
| `--base` | URL | `$NEXT_PUBLIC_SITE_URL`, else `https://javavolcano-touroperator.com` | trimmed and trailing-slash-stripped, then must be an http(s) **origin** — no path, query, fragment, or userinfo |
| `--routes` | path or `-` | — | any non-empty string; `-` reads stdin |
| `--json` | path | none | any non-empty string; write errors are classified, see [Exit codes](#exit-codes) |
| `--concurrency` | number | `6` | whole number, `1`–`64` |
| `--limit` | number | `0` (no limit) | whole number `>= 1` |

Rules that apply to every value-taking flag:

- A missing value, an empty string, or another `--`-prefixed token where the
  value should be → exit 2. A lone `-` is a real value, so `--routes -` works.
- Flag lookup goes through `Object.hasOwn`. Without it, `FLAGS["toString"]`
  resolved `Object.prototype.toString` and `toString foo` was silently accepted.
- An unknown argument → exit 2.
- `--sitemap` and `--routes` together: the sitemap wins, and a warning says so
  on stderr. The run still exits on its own merits.

`--concurrency` is capped at 64 because more parallel sockets against one origin
stops being a measurement and becomes a load test. The full 302-route sweep takes
roughly 17–28s at the default of 6.

`--limit` is for spot checks. It must never be used to close a finding — see
[Rule 9](#rule-9-and-scope).

---

## Exit codes

Three meanings, kept apart on purpose. The whole point of the tool is that CI
reads nothing but this number.

| Code | Meaning | Raised by |
|---|---|---|
| `0` | every route passed every check | end of a completed run |
| `1` | the site failed — a route failed a check, or the base would not answer | `failed.length > 0`; a non-`UsageError` thrown while loading routes |
| `2` | the invocation was wrong | `refuse()` in `parseArgs`; any `UsageError` |

What counts as a usage error (exit 2):

- an unknown flag, a missing/empty flag value, an out-of-range number, a `--base`
  that is not a bare http(s) origin
- a routes file that cannot be read (`ENOENT`, `EISDIR`, …) — raised as a
  `UsageError` so a typo in a path is never reported as a site failure
- an empty route list, or a sitemap that parsed to zero `<loc>` entries
- a sitemap URL that answered with a non-2xx status
- a `--json` destination that cannot be written for path-shaped reasons
  (`ENOENT`, `EISDIR`, `ENOTDIR`, `EACCES`, `EPERM`) — **only when the run was
  otherwise clean**

That last clause is deliberate and was got wrong once: the `--json` handler
raises only from `0`. A run that already found route failures stays at `1`,
because a real failure outranks a bad output path, and the write problem is
printed alongside it.

A sitemap that answers `404` is a usage error (the site replied); a base that
refuses the connection is a site failure (it did not).

---

## Checks per route

Fetched with `redirect: "manual"` and `connection: close`. Only the
server-rendered HTML is examined.

**Failures** (each moves the exit code to 1):

| Check | Fails when |
|---|---|
| HTTP status | anything other than `200`, redirects included |
| `<link rel=canonical>` | missing; not absolute; its normalised path is not this route's |
| `og:url` | missing; not absolute; its normalised path is not this route's; disagrees with the canonical once both are normalised to origin + path + query |
| `<title>` | missing or empty |
| JSON-LD | no `application/ld+json` block at all; any block that does not parse |

**Warnings** (reported, grouped, and never change the exit code):

| Warning | Threshold |
|---|---|
| `title N chars` | longer than 60 |
| `no meta description` | absent |
| `description N chars` | longer than 160 |

Title and description length are judgement calls, not defects, which is why they
sit on the warning side. The 2026-09-04 production sweep reports 302 passes and
209 routes carrying warnings.

### Not checked

`og:image`, `twitter:image`, `twitter:card`, `hreflang`, `robots` meta and
`og:type` are **not** inspected by this tool today. Neither string appears in the
script. Anything relying on them needs its own check added here first — do not
read a green sweep as evidence about them.

---

## JSON output

`--json <file>` writes the full result set as a JSON array, pretty-printed. One
object per route:

| Field | Always present | Notes |
|---|---|---|
| `target` | yes | absolute URL fetched |
| `status` | yes | HTTP status; `0` when the fetch itself threw |
| `failures` | yes | array of strings, empty on a pass |
| `warnings` | yes | array of strings, empty when none |
| `canonical`, `ogUrl`, `title`, `titleLength`, `descriptionLength`, `ldBlocks`, `ldParsed` | **no** | present only for routes that returned 200 |

The last row is a real trap for consumers: a fetch failure and a non-200 each
produce a shorter object, so `results.filter(r => r.titleLength > 60)`
undercounts silently rather than throwing. Check `status === 200` first.

---

## Known limitations

- **No retry.** One network blip fails the route. Observed 2026-09-04: a sweep
  returned `299 pass, 3 fail` — one `HTTP 522` and two `fetch failed` — and an
  immediate re-run returned `302 pass`, with all three routes passing
  individually. The exit code was correct both times; what misleads is reading
  the first run as a regression. Tracked as `VERIFY_LIVE_RETRY_NEEDED`.
- **Redirects are not followed.** `redirect: "manual"`, so a `301` is reported as
  `HTTP 301`. A route that moved is itself a finding when it came from the
  sitemap.
- **Server-rendered HTML only.** Anything a client component injects after
  hydration is invisible. Correct for SEO, wrong as a general DOM check.
- **Regex-scraped `<head>`.** Adequate because Next.js emits these tags plainly;
  it is not an HTML parser.
- **`--json` is not written when route loading fails**, and that path now exits
  1 — the same code as a completed run with failures, for which the file does
  exist. Distinguish by whether a summary line was printed.
- **Reporting loops re-parse `r.target` with `new URL()` unguarded.** A malformed
  entry in a routes file can throw after every fetch has completed and discard
  the run. Tracked under `VERIFY_LIVE_YELLOW_ITEMS`.

---

## Rule 9 and scope

A finding measured across the whole sitemap is closed by measuring the whole
sitemap again:

```bash
npm run verify:live -- --sitemap
```

`--limit` produces evidence that looks identical to a full sweep in the JSON
artifact, which carries no record of the population it covered. Never close a
finding on a limited run.

---

## Regression tests

Commands run during 2026-09-03/04 while building these guards. Each line is a
behaviour that was broken at some point and is now asserted.

### Usage errors — must exit 2

```bash
node scripts/verify-live.mjs --sitemap --bogus                       # unknown flag
node scripts/verify-live.mjs --sitemap --json                        # flag with no value
node scripts/verify-live.mjs --sitemap --base ""                     # empty value
printf '/contact\n' | node scripts/verify-live.mjs --routes - toString foo
printf '\n'         | node scripts/verify-live.mjs --routes -        # empty route list
node scripts/verify-live.mjs --routes /no/such/file.txt              # unreadable routes file
node scripts/verify-live.mjs --routes <a directory>                  # EISDIR
node scripts/verify-live.mjs --routes r.txt --concurrency abc
node scripts/verify-live.mjs --routes r.txt --concurrency 1e10
node scripts/verify-live.mjs --routes r.txt --concurrency 2.7
node scripts/verify-live.mjs --routes r.txt --concurrency 0
node scripts/verify-live.mjs --routes r.txt --concurrency 65
node scripts/verify-live.mjs --routes r.txt --limit 0.5
node scripts/verify-live.mjs --routes r.txt --limit abc
node scripts/verify-live.mjs --routes r.txt --base localhost:3123
node scripts/verify-live.mjs --routes r.txt --base https://site/blog
node scripts/verify-live.mjs --routes r.txt --base https://site/?x=1
node scripts/verify-live.mjs --routes r.txt --base https://site/#f
node scripts/verify-live.mjs --routes r.txt --json /no/such/dir/out.json   # clean run only
```

`toString`, `constructor`, `valueOf`, `hasOwnProperty`, `__proto__` and
`isPrototypeOf` were each checked; all six exit 2.

### Site failures — must exit 1

```bash
node scripts/verify-live.mjs --sitemap --base http://127.0.0.1:59999 --limit 1
printf '/contact\n' | node scripts/verify-live.mjs --routes - \
  --base http://127.0.0.1:59999 --json /no/such/dir/out.json    # real failure outranks bad path
```

### Must exit 0

```bash
printf '/contact\n' | node scripts/verify-live.mjs --routes - --quiet
node scripts/verify-live.mjs --routes r.txt --base "https://javavolcano-touroperator.com//"
node scripts/verify-live.mjs --routes r.txt --base " https://javavolcano-touroperator.com/ "
node scripts/verify-live.mjs --routes r.txt --limit 2
node scripts/verify-live.mjs --routes r.txt --json <writable path>
node scripts/verify-live.mjs --sitemap --quiet          # 302 routes, 302 pass
```

### Content regression, via a local mock

Three crafted pages proved the canonical/`og:url` comparison: a pair differing
only by a trailing slash passes, an identical pair passes, and a pair pointing at
different pages fails.

---

## History

| Commit | What it changed |
|---|---|
| `c01dd5cd` | closed three silent-pass paths: missing flag values, oversized `tsc` output in the typecheck hook, canonical/`og:url` compared as bytes after a normalised path check |
| `171d710d` | removed the two silent-pass paths `c01dd5cd` reopened — a type error hiding itself behind toolchain-absence matching, and a valid file blocked in a checkout without `node_modules` |
| `dec984c0` | replaced per-flag validation blocks with the single `FLAGS` table; capped `--concurrency` at 64; required `--base` to be a bare origin |
| `bbc2a2c6` | `Object.hasOwn` for flag lookup; normalise the base before validating it; an unreachable site exits 1 rather than 2; guarded the `--json` write |
| `3ce5f5cb` | stopped the exit-code contract inverting itself: unreadable routes file back to 2, `--json` failures raise only from 0, four more errno codes treated as bad paths, whitespace trimmed from the base |

Every one of these was found by reviewing the commit before it. The pattern is
worth remembering: each round narrowed toward the argument-handling paths, while
the 302-route sweep — the thing that decides whether the tool is telling the
truth — passed throughout.
