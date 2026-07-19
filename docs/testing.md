# Testing Playbook

Use this playbook when changing the site base, shared layouts, interactive components, or visual presentation.

Use Node.js 22.12 or newer. Astro 7 and the production-preview test workflow
depend on that runtime requirement.

## Commands

| Command | Purpose |
| :-- | :-- |
| `npm run check` | Run Astro static validation. |
| `npm run test:e2e` | Build with local Payload/Drupal mocks, preview the production output, and run functional/component tests. |
| `npm run test:a11y` | Build with configured live services, preview the production output, and run axe checks. |
| `npm run test:visual` | Build with local mocks, preview the production output, and run visual snapshots. |
| `npm run quality` | Run the full baseline: static checks, functional tests, axe checks, and visual snapshots. |

Run `npm run quality` before merging foundation changes. For narrow copy or content-only edits, run the smallest relevant command and note the reason if you skip the full gate.

## Browser Test Servers

Playwright owns the servers used by browser tests. It starts the mock service
when required, builds the static site with the suite's explicit environment,
and serves `dist/` with `astro preview`. Tests do not use `astro dev`.
The mock API covers every collection needed during static route generation;
collections without focused fixtures return an explicit empty document list.

Do not start a separate dev or preview process on ports 4010 or 4321 before a
browser run. A build failure, unavailable live CMS, or failed mock health check
is a real test failure; do not work around it by reusing an unrelated server.

`a11ying-front` and `wcag-front` share these ports. Run their full quality
gates sequentially, not in parallel.

## Visual Snapshots

Only update visual snapshots after reviewing the rendered difference. Use `npm run test:visual:update` when the visual change is intentional, then rerun `npm run test:visual` to confirm the refreshed baseline is stable.

Framework and dependency upgrades are not, by themselves, a reason to update
snapshots. An unchanged UI should pass the committed baseline.

Do not commit `test-results/`, `playwright-report/`, temporary screenshots, or videos.

## Negative Controls

When adding or materially changing a test suite, prove it can fail for the right reason:

1. Make a temporary, obvious regression in the smallest possible place.
2. Run the focused test that should fail.
3. Confirm the failure message matches the intended risk.
4. Revert the temporary regression.
5. Rerun the focused test, then the relevant full suite.

Examples include removing the `<html lang>` attribute for axe checks or changing visible text for a functional assertion. Keep negative-control changes out of commits.

## Shared Design System

Before making UI, token, spacing, typography, color, navigation, or interaction changes, decide whether the durable fix belongs in `a11ying-ui`.

- Shared component behavior or design tokens should usually move to `a11ying-ui`.
- Site-specific content, routing, data loading, and page composition should stay in this repo.
- If a local workaround is needed first, record a follow-up to move the durable fix into `a11ying-ui`.

`a11ying-ui` publishes TypeScript declarations. Keep the package dependency up
to date and use its exported component and data-contract types directly.
