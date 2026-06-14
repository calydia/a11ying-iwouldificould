# Payload Request Reliability Implementation Plan

## Scope

Implement the approved design in `a11ying-front` and `wcag-front` without
changing existing `fetchApi({...})` call sites.

## Task 1: Add Unit-Test Infrastructure

In each consumer repository:

1. Add `vitest` as a development dependency.
2. Add `"test:unit": "vitest run src/lib/payload.test.ts"`.
3. Insert `npm run test:unit` after `npm run check` in the `quality` script.
4. Install dependencies and commit lockfile changes with the implementation.

## Task 2: Test And Refactor `a11ying-front`

Files:

- `src/lib/payload.test.ts`
- `src/lib/payload.ts`
- `package.json`
- `package-lock.json`

Steps:

1. Write failing tests for configuration validation:
   - missing and whitespace-only values;
   - malformed and relative URLs;
   - unsupported protocols;
   - trailing slash and path-prefix preservation.
2. Write failing URL-construction tests:
   - endpoint slash normalization;
   - English, Finnish, and wildcard locales;
   - collection pagination and sort;
   - globals;
   - menu depth/draft/trash without locale override;
   - search query merging.
3. Write failing response tests:
   - wrapper extraction;
   - missing wrapper error;
   - HTTP, network, and JSON error context.
4. Write failing cache tests:
   - concurrent deduplication;
   - sequential successful caching;
   - independent URL keys;
   - failure eviction and retry;
   - per-caller wrappers over one cached raw response.
5. Refactor `payload.ts`:
   - retain the existing options interface and default export;
   - add `createPayloadClient(baseUrl, fetchImpl?)`;
   - validate and normalize the base URL;
   - build request URLs with `URL` and `URLSearchParams`;
   - cache raw response promises by final URL;
   - evict failed request promises;
   - apply `wrappedByKey` after the cache boundary;
   - preserve strict contextual errors.
6. Run `npm run test:unit`, `npm run check`, and the focused mocked functional
   tests.
7. Commit the site implementation.

## Task 3: Test And Refactor `wcag-front`

Files:

- `src/lib/payload.test.ts`
- `src/lib/payload.ts`
- `package.json`
- `package-lock.json`

Steps:

1. Port the common validation, response, and cache tests.
2. Add WCAG-specific URL tests:
   - generic `limit=2000`;
   - criteria `sort=criterionSort&limit=200`;
   - guidelines `sort=guidelineNumber&limit=200`;
   - principles `sort=principleNumber&limit=200`;
   - valid caller-provided sort syntax;
   - no duplicate endpoint-specific parameters.
3. Implement the same client factory and cache structure while retaining the
   WCAG endpoint rules.
4. Remove unused internal option fields only if no call site supplies them.
5. Run `npm run test:unit`, `npm run check`, and focused functional tests.
6. Commit the site implementation.

## Task 4: Full Verification

Run sequentially:

1. `npm run quality` in `a11ying-front`.
2. `npm run quality` in `wcag-front`.
3. Confirm visual snapshots are unchanged.
4. Run `npm audit` in both repositories and record any existing residual
   toolchain findings without applying breaking forced updates.

## Task 5: Rollout

1. Push both implementation commits.
2. Update
   `docs/superpowers/specs/2026-06-12-cross-project-improvements-continuation.md`
   with behavior, test totals, audit status, and commit hashes.
3. Commit and push the continuation update.
4. Verify `a11ying-front` and `wcag-front` are clean and aligned with
   `origin/main`.
