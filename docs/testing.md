# Testing Playbook

Use this playbook when changing the site base, shared layouts, interactive components, or visual presentation.

## Commands

| Command | Purpose |
| :-- | :-- |
| `npm run check` | Run Astro static validation. |
| `npm run test:e2e` | Run mocked functional and component Playwright tests. |
| `npm run test:a11y` | Build the production site and run axe accessibility checks. |
| `npm run test:visual` | Run visual regression snapshots. |
| `npm run quality` | Run the full baseline: static checks, functional tests, axe checks, and visual snapshots. |

Run `npm run quality` before merging foundation changes. For narrow copy or content-only edits, run the smallest relevant command and note the reason if you skip the full gate.

## Visual Snapshots

Only update visual snapshots after reviewing the rendered difference. Use `npm run test:visual:update` when the visual change is intentional, then rerun `npm run test:visual` to confirm the refreshed baseline is stable.

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

Current follow-up: `a11ying-ui` should publish TypeScript declaration files. This repo has a local `src/types/a11ying-ui.d.ts` shim so `astro check` can run until the design-system package ships declarations.
