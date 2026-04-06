# Main Navigation Escape Behavior

## Summary

Expand the main navigation keyboard behavior so `Escape` closes one main-navigation level at a time instead of jumping directly to a broader close state. This applies only to the main navigation, not the sidebar menu. The same behavior must be implemented in both `a11ying-front` and `wcag-front`.

## Current State

- Main-navigation markup lives in each site:
  - `src/components/MainNavigation.astro`
- Main-navigation `Escape` handling lives in each site layout:
  - `src/layouts/Layout.astro`
- The current logic closes some menu states, but it is distributed across target-type checks and does not model the hierarchy explicitly.
- As a result, `Escape` behavior inside nested menu content is hard to reason about and easy to regress.

## Goals

- Pressing `Escape` inside main-navigation items closes the current main-navigation level first.
- Pressing `Escape` again from the newly focused parent control closes the next higher level.
- Pressing `Escape` from a top-level expanded main-navigation button closes the full mobile main menu and focuses the main menu toggle.
- Keep sidebar menu behavior unchanged.
- Add regression tests in both sites so future updates do not break the keyboard flow.

## Non-Goals

- No behavior changes for the sidebar menu.
- No redesign of main-navigation markup.
- No migration of the duplicated main-navigation implementation into `a11ying-ui` in this change.
- No changes to language-switcher keyboard behavior beyond preserving current behavior.

## Desired Behavior

### Main Navigation Links

- If focus is on a link inside a nested `.menu-lower-level`, pressing `Escape` closes that nested level and moves focus to the preceding `.mobile-menu-toggle`.
- If focus is on a link inside a first submenu container `.menu-button-ul` but not inside `.menu-lower-level`, pressing `Escape` closes that submenu and moves focus to the preceding top-level `.menu-button`.
- If focus is on a link inside `#main-menu` but outside submenu containers, pressing `Escape` closes the whole mobile main menu and moves focus to `#main-menu-toggle`.

### Main Navigation Toggles

- If focus is on an expanded `.mobile-menu-toggle`, pressing `Escape` closes that level and keeps focus on that toggle.
- If focus is on the same `.mobile-menu-toggle` again after it has been closed, pressing `Escape` closes the parent main-navigation level and moves focus to the owning top-level `.menu-button`.
- If focus is on an expanded top-level `.menu-button`, pressing `Escape` closes that submenu and keeps focus on that button.
- If focus is on the same top-level `.menu-button` again after it has been closed, pressing `Escape` closes the full mobile main menu and moves focus to `#main-menu-toggle`.

## Implementation Approach

### Layout Keyboard Handler

Keep the global `keyup` listener in `Layout.astro`, but extract main-navigation `Escape` behavior into a dedicated helper inside each site layout script.

The helper should:

1. Identify whether the event target is part of the main navigation.
2. Resolve the nearest current menu context using:
   - `.menu-lower-level`
   - `.menu-button-ul`
   - `#main-menu`
3. Close only the current level on the first `Escape`.
4. Use the focused parent control state on the next `Escape` to close the next higher level.

This keeps the current architecture intact while making the main-navigation hierarchy explicit and testable.

### Main Navigation Markup

No structural redesign is required. The implementation will rely on the existing relationships already present in the DOM:

- `.menu-button` controls `.menu-button-ul`
- `.mobile-menu-toggle` controls `.menu-lower-level`
- `#main-menu-toggle` controls `#main-menu`

If a helper needs safer traversal, it may use `previousElementSibling` instead of `previousSibling` where appropriate to avoid text-node coupling.

### Repo Scope

Apply the same logic to:

- `a11ying-front`
- `wcag-front`

The two repos currently maintain parallel main-navigation and layout implementations, so both need equivalent changes in this task.

## Testing

Add Playwright tests in both repos covering:

1. Pressing `Escape` on a nested main-navigation link closes the nearest nested level and focuses the owning `.mobile-menu-toggle`.
2. Pressing `Escape` again from that toggle closes the parent submenu and focuses the owning top-level `.menu-button`.
3. Pressing `Escape` on a top-level `.menu-button` when its submenu is open closes that submenu.
4. Pressing `Escape` again from that now-collapsed `.menu-button` closes the whole mobile main menu and focuses `#main-menu-toggle`.

Tests should target real rendered navigation states instead of implementation details beyond stable selectors and ARIA attributes.

## Risks

- The current DOM traversal uses sibling assumptions that can break if markup shifts.
- Main-navigation structures differ slightly between the two repos, so selectors must be validated in both.
- Desktop and mobile navigation share markup with different CSS visibility rules, so tests must interact with the mobile toggle path consistently.

## Mitigations

- Prefer DOM traversal based on `closest()` and `previousElementSibling`.
- Keep logic scoped to main-navigation selectors only.
- Verify with Playwright in both repos after implementation.

## Acceptance Criteria

- `Escape` inside main navigation closes one level at a time in both sites.
- A second `Escape` from the newly focused parent control closes the next higher level.
- A final `Escape` from a collapsed top-level main-navigation button closes the whole mobile menu and focuses `#main-menu-toggle`.
- Sidebar menu behavior is unchanged.
- Relevant Playwright tests pass in both repos.
