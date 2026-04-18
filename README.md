# A11ying with Sanna - I would if I could

The frontend Astro project for I would if I could site.

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run check`           | Run Astro static validation                      |
| `npm run quality`         | Run the full baseline quality gate               |
| `npm test`                | Run mocked functional/component Playwright tests |
| `npm run test:e2e`        | Run mocked functional/component Playwright tests |
| `npm run test:a11y`       | Build and run axe accessibility checks           |
| `npm run test:visual`     | Run visual regression snapshot tests             |
| `npm run test:visual:update` | Update visual regression snapshots after reviewed visual changes |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

The test commands intentionally cover different risks. Use `test:e2e` for fast mocked functional checks, `test:a11y` for axe scans against the production build, and `test:visual` for screenshot comparisons. Use `quality` before merging foundation changes.

See `docs/testing.md` for the testing playbook, visual snapshot policy, negative-control checks, and `a11ying-ui` decision point.
