# Cross-Site Quality Gate Design

## Context

`a11ying-front` and `wcag-front` now both have separated functional, axe accessibility, and visual regression suites. The next improvement should make those checks easier to trust and easier to run consistently before larger product, content, or design changes.

Both sites consume `a11ying-ui` as the shared design system. Every improvement pass should decide whether a change belongs in one site, both sites, or the shared design system.

## Goals

- Add a clear quality gate for each site that answers whether the current base is healthy.
- Add static correctness checks before browser-based tests where practical.
- Align command names, Playwright config boundaries, and README documentation across both sites.
- Capture a repeatable testing playbook for visual snapshots, axe checks, and negative-control testing.
- Keep future UI improvements from being duplicated when they should live in `a11ying-ui`.

## Non-Goals

- Do not redesign pages in this pass.
- Do not refactor shared UI components unless the quality-gate work exposes a concrete issue.
- Do not introduce noisy linting rules that create broad style churn without improving reliability.

## Proposed Approach

1. Review both sites' package scripts, Playwright configs, README testing docs, and current test suites.
2. Add or align a high-level quality command in each repo. The exact command can be `npm run check` or `npm run quality`, but both sites should use the same name.
3. Add static checks where they fit the existing Astro setup, starting with `astro check` if available.
4. Keep slower suites explicit and documented. If visual tests are too slow for the default quality gate, document the split clearly rather than hiding the cost.
5. Add a short testing playbook covering:
   - which command to run for each risk type,
   - when to update visual snapshots,
   - how to perform temporary negative-control checks,
   - what generated artifacts should not be committed.
6. For every UI, component, token, spacing, typography, color, navigation, or interaction improvement, ask whether it belongs in `a11ying-ui`. If it does, note the design-system task instead of duplicating site-local fixes.

## `a11ying-ui` Decision Point

During each future improvement stage, include an explicit check:

- If the issue affects shared components or design tokens used by both sites, prefer fixing or extending `a11ying-ui`.
- If the issue is site-specific content, routing, data loading, or page composition, keep it in the site repo.
- If a site-level workaround is needed first, record a follow-up to move the durable solution into `a11ying-ui`.

This should be part of the notes for each future design spec and implementation plan.

## Testing

The implementation should verify both sites after changes:

- `a11ying-front`: build/static checks, functional tests, axe tests, visual tests.
- `wcag-front`: build/static checks, functional tests, axe tests, visual tests.

If a new quality command is added, run it in both repos. If visual checks remain separate, run them separately and document that decision.

## Acceptance Criteria

- Both sites have aligned quality-check commands or a documented reason for any difference.
- Both READMEs explain the command split consistently.
- A testing playbook exists and covers negative-control testing.
- Future improvement notes explicitly mention when a change should be considered for `a11ying-ui`.
- Both repos pass their agreed quality and visual checks after the changes.
