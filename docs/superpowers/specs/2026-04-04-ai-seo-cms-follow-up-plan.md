# AI SEO CMS Follow-Up Plan

Date: 2026-04-04
Project: `a11ying-front`
Scope: Later Payload CMS work to support richer SEO and AI-search features

## Goal

Define the CMS-side changes needed to extend the current frontend SEO foundation with truthful author, freshness, entity, and content-structure data.

## Why This Is Separate

The current frontend pass intentionally avoids inventing metadata the CMS does not provide. To unlock richer schema and better AI citation signals, the content model needs a few explicit fields.

## Recommended CMS Additions

### 1. Page-Level Metadata

Add to standard pages and demo pages:

- SEO title override
- meta description override validation and length guidance
- canonical override for exceptional cases
- robots override for exceptional cases
- schema type selector

Recommended schema type options:

- `WebPage`
- `Article`
- `FAQPage`
- `HowTo`
- `CollectionPage`

### 2. Author And Freshness Fields

Add:

- author name
- author role or credential line
- published date
- updated date
- reviewer name, if editorial review matters

These fields unlock:

- `Article` / `BlogPosting` schema
- visible freshness signals
- stronger E-E-A-T support

### 3. FAQ Support

Add a structured FAQ field:

- question
- answer

This should be attached to pages where FAQs are editorially useful, not generated globally.

This unlocks:

- `FAQPage` schema
- extractable answer blocks for AI systems

### 4. How-To Support

For instructional pages, add optional structured steps:

- step title
- step description
- optional image

This unlocks:

- `HowTo` schema
- cleaner process extraction

### 5. Entity And Profile Data

Add global site identity fields:

- site owner full name
- short bio
- optional organization name
- `sameAs` profile links
- profile image

This unlocks:

- richer `Person` and `Organization` schema
- better entity consistency across pages

### 6. Source And Citation Support

Add optional structured source references per page or per section:

- source label
- source URL
- source publisher
- source date

This supports:

- better citation hygiene
- stronger AI extractability
- future “sources” blocks in the frontend

## Frontend Follow-Up Once CMS Fields Exist

When the CMS work is done, the frontend should:

- append page-specific schema via the existing `schemaNodes` hook
- render author and updated-date bylines where appropriate
- emit article, FAQ, or HowTo JSON-LD based on structured fields
- support page-level title and robots overrides
- optionally render visible source sections on high-value pages

## Suggested Rollout Order

1. Global identity fields
2. Author and updated-date fields
3. Page-level schema type selector
4. FAQ block support
5. How-to step support
6. Source reference support

## Success Criteria

This CMS plan is successful when the content model can support:

- accurate author and freshness metadata
- page-specific schema selection
- structured FAQ and how-to content
- richer entity modeling
- frontend rendering of truthful, page-level JSON-LD without heuristics
