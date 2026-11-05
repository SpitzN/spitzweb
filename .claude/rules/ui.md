---
paths:
  - "apps/**/*.{tsx,css,mdx}"
  - "packages/**/*.{tsx,css}"
---

# UI

Impeccable owns design, so run `impeccable` for every UI change. `DESIGN.md` is the source of truth for tokens and components. ADR 0010 says which surface is which register. The rules below are the floor that every surface meets, in both registers.

## Tokens

- Every colour, type size, space, radius, shadow and motion value comes from a token defined for light and dark.
- A creative surface may define its own tokens in its own stylesheet. A lint exception is granted per folder and listed in `docs/tooling.md` (`docs/conventions.md`, "Strict by default, loosened by folder").

## Design system

- The Admin panel builds from `@spitzweb/design-system` (ADR 0014). A caller's `className` on a design-system component sets layout only: margin, width, flex and grid placement. `@shadcn/lint` reports the rest (ADR 0016).
- A look finding is fixed in the package, not at the call site: use an existing variant, add a variant the design calls for, or, when DESIGN.md calls for a caller to set more than layout on one component, add a contract in `packages/design-system/lint-policy.js` with its reason. A wrapper element that restyles the component is the same finding in another place.
- A new primitive starts from `shadcn add` in `packages/design-system` and is rewritten onto the tokens (`docs/tooling.md`, Decisions).

## Accessibility (WCAG 2.2 AA)

- Every interactive element has visible hover and focus states. Anything revealed on hover can also be reached by keyboard focus.
- An icon-only control has an accessible name and a tooltip.
- Text contrast meets AA in both themes.
- Targets are at least 24×24 px, and at least 44×44 px in the Admin panel.
- Motion respects `prefers-reduced-motion`. Nothing essential is shown only through motion.
- An image's `alt` text says what the image is for. A decorative image has `alt=""`.

## States

- Every list, Activity view and data-backed section has an empty state, a loading state and an unavailable state.
- Text that can overflow truncates, and its full value stays reachable.
- In-progress Projects, Archived Entries and outages are labelled, never hidden.
