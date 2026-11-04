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
