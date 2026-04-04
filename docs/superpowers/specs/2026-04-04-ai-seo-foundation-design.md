# AI SEO Foundation Design

Date: 2026-04-04
Project: `a11ying-front`
Scope: Frontend-only SEO foundation improvements for `a11y.ing`

## Goal

Improve the site's technical SEO and AI-search readiness without requiring Payload CMS schema changes. This pass should strengthen crawlability, multilingual clarity, machine-readable entity data, and page classification while avoiding inferred content data that the current CMS model does not support cleanly.

## Non-Goals

- No Payload CMS schema or content model changes
- No new authored content, FAQs, comparison tables, or content rewrites
- No attempt to infer unavailable author, publish date, modified date, or social profile data
- No rich article schema that would require CMS-backed truth we do not currently have
- No broad refactor outside shared SEO plumbing and small markup fixes

## Current State

The Astro frontend already has:

- Canonical URLs for front pages, content pages, and demo pages
- Sitemap generation via `@astrojs/sitemap`
- Open Graph title, description, URL, and image tags
- A permissive `robots.txt`

The current implementation is missing or weak in several high-value areas:

- No `hreflang` or `x-default` links for English/Finnish alternates
- No explicit robots meta handling for low-value search result pages
- Minimal schema limited to a small `WebSite` microdata block
- Open Graph metadata is generic and partly relative
- Shared head logic is spread across route conditions rather than a central metadata model
- A few low-risk defects exist in page markup and language wiring

## Recommended Approach

Implement a shared SEO foundation in the Astro layout and keep route-level usage intentionally thin.

This approach is preferred over route-by-route fixes because:

- Canonical, robots, alternate language, Open Graph, and schema logic all affect every page
- Shared logic reduces drift between page types
- The current CMS model is too thin for aggressive page inference, so the safest gain is better sitewide metadata quality
- Future CMS-backed enhancements can extend the same shared interface rather than replacing it

## Alternatives Considered

### 1. Minimal Patch Set

Add `hreflang`, `noindex` for search, and a few markup fixes only.

Pros:

- Fastest to ship
- Lowest code churn

Cons:

- Leaves most AI SEO value unrealized
- Does not establish a reusable metadata/schema foundation

### 2. Foundation Pass

Add shared metadata and JSON-LD infrastructure plus low-risk fixes, while staying truthful to the current data model.

Pros:

- Strong SEO and AI SEO upside with low implementation risk
- Clean base for future CMS-backed schema enrichment
- Centralized logic in one place

Cons:

- Slightly more design work than a minimal patch

### 3. Aggressive Inference

Infer article-like and FAQ-like schema from existing rich text and route patterns.

Pros:

- Potentially larger SEO upside

Cons:

- High risk of inaccurate schema
- Current data model does not support this cleanly
- More likely to create future migration work

Decision: use the Foundation Pass.

## Proposed Changes

### 1. Centralize SEO Metadata In The Shared Layout

Primary file: `src/layouts/Layout.astro`

The layout will become the single place that computes:

- Canonical URL
- Alternate language URLs
- `hreflang` links
- `x-default` link
- Robots meta
- Open Graph URL, image, and type
- Baseline JSON-LD objects

The layout already receives enough routing context to distinguish:

- front pages
- standard content pages
- demo pages
- search pages

That routing context will continue to drive metadata behavior, but the per-type rules will be centralized rather than embedded directly in the `<head>` markup with repeated conditional blocks.

### 2. Add Multilingual Alternate Links

Use existing `engUrl`, `fiUrl`, `locale`, `type`, and `currentUrl` props to emit:

- `<link rel="alternate" hreflang="en" ...>`
- `<link rel="alternate" hreflang="fi" ...>`
- `<link rel="alternate" hreflang="x-default" ...>`

Rules:

- Emit only URLs that actually exist
- Always emit the page's canonical URL
- Use English as `x-default`
- Preserve existing route shapes for front pages, normal pages, and demo pages

This improves Google language selection and helps AI systems understand that the two versions are alternates rather than separate competing pages.

### 3. Add Page-Aware Robots Meta

Search pages should use:

- `noindex,follow`

All other public pages in this pass should use:

- `index,follow`

This keeps internal search usable for visitors while reducing thin-page indexation.

Primary affected routes:

- `src/pages/en/search.astro`
- `src/pages/fi/haku.astro`

### 4. Improve Open Graph And Social Metadata

The layout will emit:

- Absolute `og:url`
- Absolute `og:image`
- More deliberate `og:type`

Planned rules:

- front/content/demo/search pages use a single canonical absolute URL builder
- `og:image` points to an absolute `https://a11y.ing/...` path
- `og:type` defaults to `website` for this pass

This keeps the behavior safe and consistent until article-specific data exists.

### 5. Replace Minimal Microdata With Conservative JSON-LD

Current implementation only includes a small `WebSite` microdata block at the end of the body. This pass will replace or supersede that with JSON-LD in the head.

Planned schema types:

- `WebSite`
- `WebPage`
- `Person`
- `Organization`

Constraints:

- Only include facts already supportable by the current site and codebase
- Do not add fabricated `sameAs` arrays or publish dates
- Keep organization/person modeling minimal and consistent with the site's visible branding

Expected outputs:

- `WebSite` for site identity and primary URL
- `WebPage` for page name, URL, and language
- `Person` for the site owner identity represented by the brand
- `Organization` only if the site clearly presents a separate organization-level identity; otherwise keep schema centered on the person/site

Implementation note:

If the existing site identity is more accurately modeled as a personal site than an organization site, `Person` and `WebSite` should be the primary schema objects and `Organization` should be omitted or kept minimal. Accuracy is more important than schema quantity.

### 6. Add A Small, Explicit SEO Configuration Surface

The layout props should support a small SEO-facing contract rather than pushing special cases into page markup.

Likely fields:

- page type
- locale
- current path slug
- alternate URLs when available

Avoid introducing a large abstraction. The goal is to make metadata logic clear, not to create a generic SEO framework.

### 7. Fix Known Low-Risk Markup And Language Issues

Frontend fixes already identified:

- Correct Finnish front page `RichText` `lang` from `en` to `fi`
- Replace invalid `<pp>` element on the Finnish search page with `<p>`
- Keep head output internally consistent with the new centralized metadata logic

These changes are included because they are directly adjacent to the SEO work and reduce avoidable noise in rendered output.

## File-Level Plan

### `src/layouts/Layout.astro`

Responsibilities after this change:

- Compute canonical URL in one place
- Compute alternate URLs in one place
- Emit robots meta
- Emit `hreflang` links
- Emit Open Graph values from absolute URLs
- Emit JSON-LD blocks

Potential refactor:

- Extract small helper functions inside the file or into a tiny utility module if the head logic becomes hard to read

### `src/pages/en/search.astro`

- Continue using the shared layout
- Ensure route type remains distinguishable as search
- Rely on layout to emit `noindex,follow`

### `src/pages/fi/haku.astro`

- Same as English search page
- Fix invalid `<pp>` markup

### `src/pages/fi/index.astro`

- Fix `RichText` language prop to `fi`

## Data Flow

1. A route passes page title, description, locale, type, current URL, and alternate route info into the layout.
2. The layout builds a canonical absolute URL.
3. The layout derives available alternate URLs for English and Finnish.
4. The layout derives robots policy from page type.
5. The layout emits:
   - `<title>`
   - description meta
   - canonical link
   - alternate links
   - robots meta
   - Open Graph tags
   - JSON-LD script tags

## Error Handling And Fallbacks

- If one language variant is missing, emit only the canonical and the alternates that are actually available.
- If a page type is unknown, default to safe public metadata:
  - canonical present
  - `index,follow`
  - `og:type=website`
- If a future route does not provide alternate URLs, the layout should still render a valid canonical page with no broken `hreflang`.

## Testing Strategy

### Static Verification

- Review final head output in the affected templates
- Verify canonical and alternate URL shapes match existing route conventions
- Verify search pages produce `noindex,follow`
- Validate that JSON-LD is syntactically valid JSON and matches intended schema types

### Build Verification

- Run `npm run build` if external CMS access allows
- If build remains blocked by remote Payload availability, use code inspection and targeted output verification instead of treating the build failure as an SEO implementation failure

### Regression Focus

Pay special attention to:

- Front page canonical and alternate URLs
- Nested content page URLs
- Demo page URLs
- Search page robots directives
- Finnish route handling

## Risks

### 1. Overstating Entity Data

Risk:

- Adding schema fields that cannot be defended from visible or code-backed truth

Mitigation:

- Keep JSON-LD conservative and explicit

### 2. Route Logic Drift

Risk:

- Existing route-specific URL rules may be subtly different across front, page, demo, and search routes

Mitigation:

- Centralize URL construction with small, testable branches
- Review every existing route type before changing canonical generation

### 3. CMS-Coupled Build Constraints

Risk:

- Local build verification may fail if Payload is unreachable

Mitigation:

- Treat full build as best-effort in this environment
- Verify generated logic statically where runtime validation is unavailable

## Future Follow-Up After This Pass

These are intentionally out of scope now, but the design should make them easy later:

- CMS fields for author, publish date, and modified date
- FAQ-backed content blocks and `FAQPage` schema
- Page-level article schema
- Comparison-page templates
- richer entity data such as `sameAs`
- content-side AI SEO improvements like citations, definition blocks, and statistics

## Success Criteria

This pass is successful if:

- Every public page has a canonical URL produced by one shared logic path
- English/Finnish alternates emit valid `hreflang` links where translations exist
- Search pages emit `noindex,follow`
- The site emits conservative, valid JSON-LD for core site/page identity
- Open Graph URLs and images are absolute
- The Finnish front page and search page markup defects are corrected
- No CMS changes are required to ship the work
