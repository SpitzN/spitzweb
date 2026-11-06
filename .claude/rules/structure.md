---
paths:
  - "apps/**/*"
  - "packages/**/*"
---

# Structure

The exact folder layout and the boundary table are in `docs/architecture.md`, and lint enforces them (`docs/tooling.md`). These are the rules lint cannot check.

A **slice** is one vertical area of code: an Entry type, a Feature, the Admin panel or a Hosted project.

## Where a new file goes

1. **A route segment** (page, layout or Route Handler) lives in the app's `app/` directory and only composes. It reads params, calls into slices and arranges what they return. Business logic and private sub-components belong in a slice.
2. **Something only one slice uses** goes in that slice, in the folder named for what the file is.
3. **A fact several slices read** goes in the shared domain folder, one file per concept. Examples: a domain schema, the publication-state rules, a ranking.
4. **Code with no domain meaning that a second caller already needs** goes in the shared components, hooks or lib folders.
5. **Code a second app needs** moves to `packages/<name>` (ADR 0001). Two packages exist before a second app (ADR 0014): the design system (`packages/design-system`), where a UI primitive goes at the atomic level it belongs to, never in an app; and the shared lint config (`packages/lint-config`).

Create a folder together with its first file: no empty folders, no placeholder files. A test sits beside the file it tests.

## Crossing slices

Slices never import each other, not even a type. When a route needs two slices, it composes them and passes plain values from one into the other. When both slices need the same fact, move it to the domain folder.

## Hosted projects

A Hosted project is a self-contained slice. It owns its components, its server code and its Postgres schema, and it imports only shared code. Nothing imports it except the route that mounts it. That keeps it ready to move out to its own app (ADR 0002).
