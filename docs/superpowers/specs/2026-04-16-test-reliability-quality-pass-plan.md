# Test Reliability Quality Pass Implementation Plan

Date: 2026-04-16
Project: `a11ying-front`
Design: `docs/superpowers/specs/2026-04-16-test-reliability-quality-pass-design.md`

## Goal

Make the local mocked functional test suite reliable before broader codebase refactoring or site polish.

## Work Sequence

### 1. Separate Test Commands

- Update Playwright configuration or package scripts so `npm run test:e2e` excludes visual and axe suites.
- Keep `npm run test:visual` responsible for `tests/visual.spec.ts`.
- Keep `npm run test:a11y` responsible for `tests/axe-core.spec.ts`.
- Decide during implementation whether a `test:all` script is useful after the individual commands are green.

Expected result: `npm run test:e2e` runs only mocked functional/component tests.

### 2. Complete Mock Server Coverage

- Add fixtures for missing Payload endpoints used by tested routes:
  - `pages`
  - `menuTitles`
  - search data if needed by included tests
- Extend `tests/mock-server.mjs` to serve those fixtures.
- Make unknown mock endpoints return a clear JSON response that includes the requested URL.

Expected result: tested pages render without Astro/Vite error overlays.

### 3. Add Narrow Data Error Clarity

- Review `src/lib/payload.ts` for unclear failures on non-OK responses.
- Add narrow endpoint/status error messages if they make fixture or CMS failures easier to diagnose.
- Avoid broad fallbacks that hide missing required data.

Expected result: a missing required endpoint produces a useful error rather than a later undefined-property failure.

### 4. Adjust Tests By Intent

- Move or exclude tests whose intent belongs to visual or accessibility suites rather than functional e2e.
- Review the `MainImage` overlay checks and decide whether they belong in functional e2e or visual coverage.
- Keep snapshot updates out of this pass unless explicitly reviewed.

Expected result: the functional suite checks behavior/content that can be deterministic under mocks.

### 5. Cleanup And Documentation

- Remove `console.log('hep')` from `src/components/MainNavigation.astro`.
- Update README command documentation to explain build, e2e, a11y, and visual checks.

Expected result: command usage is clear for future work.

### 6. Negative-Control Verification

- Temporarily break one focused test by changing one local fixture value or removing one mock response.
- Run the focused test and confirm it fails for the expected reason.
- Revert only the temporary break.
- Re-run the focused test and the full relevant suite.

Expected result: at least one important test is proven to fail when its protected behavior or fixture contract breaks.

## Final Verification

Run:

- `npm run build`
- `npm run test:e2e`
- `npm run test:a11y`

Run `npm run test:visual` separately if the implementation touches visual behavior or if test-boundary changes require confirming the visual command still works.

## Stop Points

Useful pause points:

1. After command separation is complete.
2. After mock endpoint coverage is complete.
3. After `npm run test:e2e` first passes.
4. After negative-control verification is complete.
5. After README updates and final verification.

## Carry-Forward To `wcag-front`

When applying the same process to `wcag-front`, start by repeating steps 1 and 2: separate test command intent, then map the missing mock endpoint coverage. Do not begin broad refactoring in `wcag-front` until its equivalent mocked functional gate is green.
