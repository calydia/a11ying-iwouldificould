# AGENTS.md

## Project

`a11ying-front` is the Astro frontend for the bilingual **A11ying with
Sanna - I would if I could** site at `https://a11y.ing/`.

The site:

- renders English and Finnish pages from a Payload CMS API;
- includes a small Drupal blog feed integration;
- uses Astro for routing and page composition;
- uses React islands and shared styles from `a11ying-ui`;
- treats accessibility, keyboard behavior, light/dark themes, and responsive
  rendering as release requirements.

The main runtime inputs are `PUBLIC_PAYLOAD_URL` and `PUBLIC_DRUPAL_URL`.
Playwright tests provide local mock services for deterministic test runs.

## Related Repositories

The sibling repositories normally live under the same `projects` directory:

| Repository | Role |
| --- | --- |
| `../a11ying-front` | This general accessibility site. |
| `../wcag-front` | The related bilingual WCAG guide site. |
| `../a11ying-ui` | The shared React component and design-token package used by both sites. |

This repository consumes `a11ying-ui` from a tagged GitHub dependency, not
directly from the sibling checkout. A change in `../a11ying-ui` does not affect
this site until the package is built, released/tagged, and the dependency and
lockfile are updated here.

Use these ownership boundaries:

- Put reusable components, shared interaction behavior, brand tokens,
  typography, colors, and broadly applicable styles in `a11ying-ui`.
- Keep routing, CMS requests, page composition, site-specific navigation,
  redirects, metadata, and content behavior in this repository.
- Compare `wcag-front` when changing duplicated site-shell behavior. Do not
  copy a fix blindly; decide whether it belongs in both sites or in
  `a11ying-ui`.
- After an `a11ying-ui` change, verify the affected behavior in both consumer
  sites before considering the shared change complete.

## Repository Map

- `src/pages/`: Astro routes, including localized catch-all and search pages.
- `src/layouts/Layout.astro`: shared document shell, metadata, theme setup,
  shared package imports, and global site styles.
- `src/components/`: site-specific Astro components.
- `src/lib/payload.ts`: Payload CMS request construction and error handling.
- `src/i18n/`: English/Finnish UI strings and translation helpers.
- `src/interfaces/`: CMS and page data contracts.
- `tests/`: Playwright functional, accessibility, and visual tests plus mock
  fixtures/server.
- `docs/testing.md`: detailed test policy and shared-design-system guidance.

## Working Rules

- Preserve semantic HTML, focus visibility, keyboard operation, accessible
  names, reduced ambiguity, and correct language metadata.
- Check behavior in English and Finnish. Localized paths and labels are part of
  the public contract.
- Check light and dark themes when changing visual or interactive UI.
- Keep Astro components responsible for server-rendered site composition.
  Use React islands for shared interactive components already owned by
  `a11ying-ui`.
- Do not hide CMS failures. `fetchApi` intentionally throws useful endpoint
  and status context.
- Preserve trailing-slash URL behavior and review canonical, alternate, and
  sitemap effects when changing routes.
- Treat `dist/`, `.astro/`, `test-results/`, and `playwright-report/` as
  generated output.
- Do not update visual snapshots until the rendered change has been reviewed
  and confirmed intentional.

## Commands

Run commands from this repository root:

```bash
npm install
npm run dev
npm run build
npm run check
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run quality
```

Use the smallest relevant test while iterating. Run `npm run quality` for
changes to the layout, shared site shell, navigation, styling foundations,
shared-component integration, or other broad behavior.

For intentional visual changes:

```bash
npm run test:visual:update
npm run test:visual
```

## Cross-Repository Changes

For a change originating in `a11ying-ui`:

1. Implement and document it with a Storybook story.
2. Run the design-system build and Storybook test suite.
3. Release/tag the package as appropriate.
4. Update `a11ying-ui` in this repository and `wcag-front`.
5. Run focused consumer tests, then each affected site's quality gate.

Use the TypeScript declarations published by `a11ying-ui`. Do not recreate a
local ambient module shim; fix missing or incorrect public types in the design
system package and update both consumers together.
