# Shared Blog Post Cards Design

## Goal

Make the blog cards on the a11ying site match the structure and presentation of the article cards on `blog.sanna.ninja`, while preserving the existing a11ying page sections and responsive grid.

## Component Design

Add a site-specific shared Astro card component used by both `BlogHighlights` and `ExoveBlogHighlights`. The component accepts a title, URL, date, optional image, and optional description.

Each card renders:

1. An optional decorative article image outside the link.
2. A heading containing the card's only link.
3. The publication date as plain text.
4. An optional plain-text description.

The card will reuse the article-card typography, spacing, separator, border, colors, hover treatment, and focus-within behavior. Only the title is interactive; clicking the image, date, description, or empty card area does not navigate.

## Data Flow

`BlogHighlights` continues to fetch the three newest accessibility posts from the Drupal JSON:API endpoint. Its request and local types will include the existing meta-description field, which is passed to the shared card as `description`. The Accessibility category is not rendered.

`ExoveBlogHighlights` continues to receive Payload blog-card data from its parent page. It passes title, URL, date, and optional image to the shared card without a description.

The components retain their current English and Finnish section copy and date localization behavior.

## Error Handling

An absent image or description is supported and omits that element without changing the title and date. Existing fetch failure behavior remains unchanged.

## Verification

Add focused Playwright assertions covering both card sources:

- every card exposes one link;
- that link contains only the title, not the image or metadata;
- own-blog cards show their meta description and omit the category;
- Exove cards show the title and date without a description;
- keyboard focus remains visibly associated with the card.

Run the focused home-page test, Astro checks, and the relevant accessibility tests. Visual snapshots should only be updated after reviewing the intentional card changes.
