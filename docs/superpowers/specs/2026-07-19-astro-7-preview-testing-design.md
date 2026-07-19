# Astro 7 production-preview testing design

## Context

`a11ying-front` and `wcag-front` have been upgraded to Astro 7. Astro 7 can
automatically run `astro dev` as a background process in agentic environments.
Playwright expects its configured web server command to remain in the
foreground, so a backgrounded development server is reported as an early exit.

Both sites already produce static builds and treat production rendering,
accessibility, keyboard behavior, responsive layouts, and light and dark themes
as release requirements. The browser suites should therefore exercise the
production output instead of depending on development-server lifecycle details.

## Goals

- Run Playwright against Astro's production preview server.
- Keep deterministic tests backed by the existing local mock service.
- Preserve the existing live-data accessibility checks where applicable.
- Make server ownership and data-source behavior clear to developers.
- Keep all existing screenshots and accessibility expectations unchanged.

## Non-goals

- Change application behavior, page content, routes, or visual output.
- Replace Playwright, Vitest, axe-core, or the existing mock fixtures.
- Update visual snapshots.
- Run the two repositories' browser suites concurrently on their shared ports.

## Design

### Production server lifecycle

Playwright web-server entries will build the relevant site and then start
`astro preview` in the foreground. Playwright will own and stop the preview
process. This avoids Astro 7's agent-aware development-server behavior and
tests the same generated assets that are deployed.

Each browser configuration will use an explicit command appropriate to its
data source:

- deterministic end-to-end and visual suites build against the local mock API;
- accessibility suites that currently use live CMS data continue to build
  against live data;
- `wcag-front` suites retain their current data-source semantics while moving
  from development serving to preview serving.

The mock server remains a separate Playwright-managed web server. Build-time
environment variables and preview URLs will be declared in configuration so a
developer can see which service each suite uses.

### Port and concurrency policy

Both repositories use the same local site and mock ports. Suites within a
repository may retain their existing Playwright worker parallelism, but the
full quality gates for `a11ying-front` and `wcag-front` must be run
sequentially. Documentation will call this out explicitly.

### Package and runtime requirements

Both projects require Node.js 22.12 or newer, matching Astro 7's engine
requirement. The package manifests retain this requirement. Astro 7 uses its
supported Vite version; the former Vite 7 override is removed.

The dependency audit removes direct packages with no source, configuration, or
script usage:

- `qs-esm` from both sites;
- `dayjs` from `wcag-front` only.

`dayjs` remains in `a11ying-front`, where blog dates use it. React, React DOM,
their types, and Node types become explicit dependencies because the projects
directly render React islands and type-check Node-based Playwright configs.

### Developer documentation

`AGENTS.md` and `docs/testing.md` in both repositories will document:

- the Node.js 22.12 minimum;
- that browser tests build first and run against `astro preview`;
- which suites use mock versus live CMS data;
- the commands for focused and full verification;
- the requirement to run the two repositories' browser quality gates
  sequentially;
- that visual snapshots must not be updated merely to make an Astro upgrade
  pass.

## Error handling

If a build fails, Playwright must not start the preview server or execute
browser assertions. If the mock service fails health checking, deterministic
suites must fail rather than fall back to live services. Existing CMS request
errors remain visible and are not swallowed by the test harness.

## Verification

For each repository:

1. Run `npm audit` and require zero known vulnerabilities.
2. Run `npm run check`.
3. Run `npm run test:unit`.
4. Run `npm run build`.
5. Run the complete `npm run quality` gate.
6. Confirm visual tests pass without snapshot changes.

Run the two complete quality gates sequentially. Finish by checking that only
the intended manifests, lockfiles, Playwright configuration, and developer
documentation changed.
