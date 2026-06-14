# Cross-Project Improvements Continuation

## Current State

The package typing, CMS HTML safety, RichText heading ID, and search URL state
work is complete across `a11ying-ui`, `a11ying-front`, and `wcag-front`.

- `a11ying-ui` `v2.0.10` is tagged and pushed at commit `3559dbc`.
- `a11ying-front` consumes `v2.0.10` in commit `7a813dc`.
- `wcag-front` consumes `v2.0.10` in commit `9143cde`.
- Each consumer contains its earlier CMS safety commit
  (`7b8d95c` and `a359fc0`) beneath the package update commit.

The shared package now:

- sanitizes CMS HTML through an explicit formatting-only allowlist;
- rejects unsafe URLs, scripts, event handlers, styles, arbitrary classes, and
  embeds;
- secures links opened in a new window;
- gives RichText links a persistent underline;
- removes the RichText `link-in-text-block` axe suppression;
- transliterates heading fragments to readable ASCII;
- allocates collision-safe IDs across normal, ContentBox, and nested headings;
- guarantees TOC links and rendered headings use the same ID plan;
- bundles `sanitize-html` so CommonJS interop cannot block consumer React
  island hydration;
- restores searches from the `q` query parameter;
- preserves unrelated query parameters and fragments when searches change;
- writes meaningful searches to browser history and restores them on
  back/forward navigation;
- aborts obsolete requests and prevents stale results from rendering;
- exposes localized loading and error messages through accessible status and
  alert regions.

The consumers now sanitize all direct CMS HTML fragments and server-render
static RichText instead of hydrating it as a React island. `wcag-front` also
accepts both localized-object and already-localized-string forms of
`cardContent`. Both consumers provide English and Finnish search status
messages and deterministic browser coverage for URL restoration, history,
focus, empty results, and request errors.

`v2.0.8` was superseded before either consumer update was committed. Fresh
consumer dependency optimization exposed that its externalized CommonJS
`sanitize-html` import blocked all package-root React islands from hydrating.
`v2.0.9` includes the verified browser-safe bundle fix.

## Verification Completed

- `a11ying-ui`: build and 31 unit tests passed.
- `a11ying-ui`: all 49 Storybook accessibility, behavior, and visual tests
  passed without snapshot updates.
- `a11ying-ui`: non-breaking dependency updates removed the critical,
  moderate, Vitest, glob, and WebSocket audit findings. Eleven high findings
  remain through Storybook's current `esbuild@0.27.7`; no patched `esbuild`
  release is available, and npm's proposed fix is a breaking Storybook
  downgrade.
- `a11ying-front`: check passed with no errors; 20 functional, 6 axe, and 12
  visual tests passed; the 222-page production build passed.
- `wcag-front`: check passed with no errors; 30 functional, 6 axe, and 12
  visual tests passed; the 230-page production build passed.
- No consumer visual snapshots changed.

## Resume Checklist

1. Confirm all three repositories are clean and aligned with their remotes.
2. Continue the improvement audit with Payload URL configuration, request
   behavior, and caching.

The remaining candidates identified earlier are:

- tighten Payload URL configuration, request behavior, and caching;
- review duplicated layouts and site-shell behavior for shared ownership;
- continue reducing unnecessary client hydration outside RichText.

Start with one bounded area, agree on its behavior, implement it in the owning
repository, and verify both consumers when shared behavior is affected.
