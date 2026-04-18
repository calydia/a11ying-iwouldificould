# Visual Regression Stabilization Design

## Context

`a11ying-front` now has a green mocked functional suite and green axe checks, but `npm run test:visual` is still red. The visual failures appear to come from stale screenshot baselines and mocked fixture/content-height changes introduced before the current quality pass. `wcag-front` visual tests already pass.

## Goals

- Make `a11ying-front` visual regression tests pass against the current mocked visual baseline.
- Keep visual coverage focused on the existing home, content, and search pages across desktop/mobile and light/dark.
- Prove the visual suite fails for a deliberate visible change.
- Leave `wcag-front` unchanged unless verification shows an issue.

## Non-Goals

- Do not redesign either site.
- Do not broaden visual coverage in this pass.
- Do not hide visual drift by loosening thresholds unless a specific flake requires it.
- Do not update `wcag-front` snapshots when they already pass.

## Approach

1. Run `npm run test:visual:update` in `a11ying-front` to refresh snapshots against the current mocked baseline.
2. Review the changed snapshot files and confirm the changes correspond to the current page output.
3. Run `npm run test:visual` and expect it to pass.
4. Make a temporary visible mutation in a covered page style.
5. Run a focused visual test and confirm it fails with a screenshot diff.
6. Revert the temporary mutation.
7. Re-run the focused visual test and the full visual suite.
8. Run `npm run test:visual` in `wcag-front` as a guard.

## Verification

The pass is complete when:

- `a11ying-front` `npm run test:visual` passes.
- A temporary visible mutation was confirmed to fail a focused visual test.
- The temporary mutation was reverted.
- `wcag-front` `npm run test:visual` still passes.

## Risks

- Snapshot updates can mask accidental visual regressions. Keep the review scoped to files changed by the current mocked baseline.
- Full-page screenshots can be sensitive to content-height changes. Do not alter thresholds unless repeated runs show real flake.
- Temporary visual mutations must not be committed.
