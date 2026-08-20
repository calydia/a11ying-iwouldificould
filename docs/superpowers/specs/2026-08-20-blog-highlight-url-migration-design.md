# Blog highlight URL migration design

## Context

The A11ying homepage builds accessibility-blog article links from Drupal path aliases such as `/post-one`. These links still use the retired `blog.sanna.ninja` domain. The renewed blog uses canonical article URLs below `sanna.a11y.ing/blog/accessibility/`.

## Decision

Build each highlighted article URL in this format:

`https://sanna.a11y.ing/blog/accessibility/{article-slug}/`

Add a small local URL-building helper in `BlogHighlights.astro`. It will remove leading and trailing slashes from the Drupal alias before composing the URL, then include one canonical trailing slash.

This accepts equivalent aliases such as:

- `/post-one`
- `post-one`
- `/post-one/`

All three produce:

`https://sanna.a11y.ing/blog/accessibility/post-one/`

## Scope

Only the personal accessibility-blog highlight cards rendered by `BlogHighlights.astro` change. Exove article cards, footer destinations, Drupal requests, and source data remain unchanged.

## Verification

- Add a browser assertion using the existing mocked `/post-one` alias.
- Confirm the rendered card points to the canonical new URL.
- Search the A11ying source and tests for remaining `blog.sanna.ninja` references.
- Run the relevant homepage browser test and production build.

