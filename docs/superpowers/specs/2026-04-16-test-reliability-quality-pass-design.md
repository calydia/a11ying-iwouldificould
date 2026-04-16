# Test Reliability Quality Pass Design

## Context

The production Astro build currently succeeds, but the mocked Playwright quality gate is not reliable. `npm run test:e2e` runs 39 tests and currently reports 23 passed and 16 failed. The failures are mostly caused by test infrastructure gaps rather than clear product regressions:

- The mock server does not provide all Payload endpoints used by the rendered routes, including page data for `getStaticPaths` and menu title data for breadcrumbs.
- The mocked e2e command currently includes suites that behave more like visual and accessibility gates.
- Some failures render Astro/Vite error overlays, which then cause misleading axe color contrast failures.
- Visual snapshot expectations are stale or coupled to content height differences.
- `MainImage` overlay tests can time out when the relevant UI does not appear under the mocked run.

The first quality pass should make the repository easier to change safely before larger refactoring or visual site improvements.

## Goals

- Make `npm run test:e2e` a dependable mocked functional quality gate.
- Keep visual regression checks separate from functional e2e checks.
- Keep accessibility scans separate from mocked e2e checks.
- Add representative mock fixtures for routes and components covered by tests.
- Ensure failures identify missing endpoint or fixture coverage clearly.
- Document the verification commands in the README.
- Capture a reusable checklist for applying the same quality pass to `wcag-front` later.

## Non-Goals

- Do not split the large `Layout.astro` CSS and script blocks in this pass.
- Do not redesign the site or change broad visual styling.
- Do not add test-only branches to production app code unless there is no cleaner fixture or configuration fix.
- Do not update visual snapshots unless that becomes an intentional, separately reviewed part of the implementation.
- Do not hide broken CMS contracts behind broad fallback rendering.

## Recommended Approach

Use a test-reliability-first approach. Stabilize the mocked test boundary before refactoring app structure. This gives later work a trustworthy signal and avoids using a red suite as the baseline for broader cleanup.

The implementation should focus on command separation, mock data parity, narrow code cleanup, and documentation.

## Architecture

### Test Command Boundary

The test scripts should communicate their purpose clearly:

- `npm run build`: production static build.
- `npm run test:e2e`: mocked functional/component Playwright checks only.
- `npm run test:a11y`: production-build accessibility scans.
- `npm run test:visual`: visual snapshot checks.

If needed, split Playwright test matching so `test:e2e` excludes `tests/visual.spec.ts` and `tests/axe-core.spec.ts`. Those suites should remain runnable through their dedicated commands.

### Mock Data Boundary

`tests/mock-server.mjs` should serve every endpoint used by pages/components exercised in mocked e2e tests. Fixtures should mirror the Payload and Drupal response envelopes closely enough that app code can run normally without test-specific branches.

Required fixture coverage should include:

- `frontPage` global.
- `mainNav` global.
- `footerNav` global.
- `menuTitles` global for breadcrumbs.
- `pages` collection data for `getStaticPaths`.
- `blogCards` collection data.
- Drupal blog response data.
- Search endpoint data if the functional e2e suite exercises search behavior beyond static page rendering.

Unknown endpoints should still return `404`, but the response should make the missing endpoint obvious.

### Route And Component Resilience Boundary

Prefer accurate fixtures over production fallback behavior. Where route generation or API code can fail with unclear errors, add narrow error messages that name the endpoint or expected data shape.

Avoid broad defaults that let missing CMS data silently produce incomplete pages. This site is content-driven, so a missing required CMS contract should be visible during build or tests.

### Cleanup Boundary

Allow cleanup that directly improves the quality gate:

- Remove the `console.log('hep')` debug statement from `MainNavigation.astro`.
- Clarify README command documentation.
- Remove or adjust stale test assumptions when they are clearly about test boundaries rather than product behavior.

Leave unrelated refactors for later.

## Data Flow

The mocked e2e flow should be:

1. Playwright starts `tests/mock-server.mjs` on `127.0.0.1:4010`.
2. Playwright starts Astro on `127.0.0.1:4321`.
3. Astro receives `PUBLIC_PAYLOAD_URL=http://127.0.0.1:4010` and `PUBLIC_DRUPAL_URL=http://127.0.0.1:4010`.
4. Astro route generation fetches representative mock data.
5. Functional tests exercise rendered pages without contacting the real Payload or Drupal services.

This should make the local test signal deterministic and independent of external services.

## Error Handling

The mock server should keep a strict unknown-endpoint path. When an endpoint is missing from the fixture server, the response should include the request URL so the developer knows exactly what to add.

App-side errors should be narrow and explicit. For example, if `fetchApi` receives a non-OK response for a required endpoint, it should be acceptable to throw an error naming the endpoint and status. Avoid adding catch-all fallbacks that make broken fixtures or broken CMS responses look like valid empty content.

## Verification Plan

The implementation is complete when:

- `npm run build` passes.
- `npm run test:e2e` passes and runs only mocked functional/component tests.
- `npm run test:visual` remains available separately.
- `npm run test:a11y` remains available separately.
- README documents the distinction between build, e2e, a11y, and visual checks.

Include a temporary negative-control check during implementation:

1. Make one controlled local mutation that should break a specific test, such as changing an expected fixture title or omitting a required mock endpoint.
2. Run the relevant focused test and confirm it fails for the expected reason.
3. Revert only that temporary mutation.
4. Re-run the focused test and the full relevant suite to confirm the quality gate is green again.

Do not commit the intentionally broken state.

## Carry-Forward Checklist For `wcag-front`

Use this quality pass as a repeatable pattern for `wcag-front`:

1. Inspect package scripts and Playwright configs.
2. Separate functional e2e, visual snapshots, and accessibility scans into distinct commands.
3. Run the mocked e2e command and record which failures are infrastructure failures versus product failures.
4. Map every endpoint used by tested pages/components.
5. Add fixtures that match real API response envelopes.
6. Keep unknown mock endpoints strict and easy to diagnose.
7. Remove debug output and update README command docs.
8. Add one temporary negative-control check during implementation to prove at least one important test fails for the right reason.
9. Leave larger app refactors until after the quality gate is green.

## Risks

- Fixtures can drift from the real CMS schema. Keep fixture shape representative and avoid simplifying response envelopes too aggressively.
- Splitting test commands may reveal that some tests belong in different suites. Move them based on intent, not current convenience.
- Updating snapshots can hide real visual changes. Snapshot updates should be intentional and reviewed separately from test command cleanup.
- Adding app-side error handling can change build failure behavior. Keep errors clear and narrow.

## Open Decisions For Implementation Planning

- Whether to move `axe-core.spec.ts` out of the default Playwright config or exclude it only from `test:e2e`.
- Whether `MainImage` overlay checks belong in functional e2e or visual tests.
- Whether to add a dedicated `test:all` command after the individual commands are reliable.
