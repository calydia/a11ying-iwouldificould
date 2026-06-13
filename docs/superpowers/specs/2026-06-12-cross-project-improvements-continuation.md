# Cross-Project Improvements Continuation

## Current State

The package typing, CMS HTML safety, and RichText heading ID work is complete
across `a11ying-ui`, `a11ying-front`, and `wcag-front`.

- `a11ying-ui` `v2.0.9` is tagged and pushed at commit `d3579b4`.
- `a11ying-front` consumes `v2.0.9` in commit `87c77ba`.
- `wcag-front` consumes `v2.0.9` in commit `f3ec236`.
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
  island hydration.

The consumers now sanitize all direct CMS HTML fragments and server-render
static RichText instead of hydrating it as a React island. `wcag-front` also
accepts both localized-object and already-localized-string forms of
`cardContent`.

`v2.0.8` was superseded before either consumer update was committed. Fresh
consumer dependency optimization exposed that its externalized CommonJS
`sanitize-html` import blocked all package-root React islands from hydrating.
`v2.0.9` includes the verified browser-safe bundle fix.

## Verification Completed

- `a11ying-ui`: 19 library unit tests and 2 RichText rendering tests passed.
- `a11ying-ui`: build and production dependency audit passed with zero
  vulnerabilities.
- `a11ying-ui`: 22 Storybook accessibility tests, 21 visual tests, and the
  RichText fragment behavior test passed.
- `a11ying-front`: check passed with no errors; 18 functional, 6 axe, and 12
  visual tests passed; the 222-page production build passed.
- `wcag-front`: check passed with no errors; 34 functional, 6 axe, and 12
  visual tests passed; the 230-page production build passed.
- No consumer visual snapshots changed.

## Resume Checklist

1. Confirm all three repositories are clean and aligned with their remotes.
2. Continue the improvement audit with search state and URL synchronization.

The remaining candidates identified earlier are:

- improve search state and URL synchronization;
- tighten Payload URL configuration, request behavior, and caching;
- review duplicated layouts and site-shell behavior for shared ownership;
- continue reducing unnecessary client hydration outside RichText.

Start with one bounded area, agree on its behavior, implement it in the owning
repository, and verify both consumers when shared behavior is affected.
