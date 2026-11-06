# The design system is a workspace package

The Admin panel's primitives lived in `apps/site/src/components/ui/`, and nothing stopped a slice from reaching past them: `update-form.tsx` imported Base UI's `Form` and `Field` directly. So the primitives move into `packages/design-system` (`@spitzweb/design-system`) while `apps/site` is still its only app. This supersedes ADR 0001's "packages are created only when a second consumer needs them" for the design system and its shared lint config (below), for two reasons. A workspace dependency is the strongest boundary the repo has: the package can't see the app, and the app reaches Base UI only through it. And when a Hosted project moves out to its own app (ADR 0002), it takes the design system as a dependency instead of copying it.

The package is TSX source with no build step: `apps/site` compiles it (`transpilePackages`), and the React Compiler covers it like the app's own code. Callers import each file by path through an `exports` wildcard (`@spitzweb/design-system/atoms/button`), never a barrel. It is laid out in atomic levels: `atoms/` holds every primitive, shadcn-derived or a direct Base UI wrapper; `molecules/` and `organisms/` compose them. It holds no domain meaning, so UpdateForm and Entry lists stay in their slices and compose from it.

Its lint must be as strict as the app's, and it may not import the app, so the shared ESLint layers and Stylelint config move into a second package, `packages/lint-config` (`@spitzweb/lint-config`). It owns the lint plugins; each workspace's config adds only its own parts.

## Considered Options

- **Keep the primitives in `apps/site`, guarded by lint**: a lint rule can ban Base UI outside `components/ui/`, but it is a weaker boundary than a dependency, and moving a Hosted project out would still mean copying the components.
- **Lint config at the repo root** instead of a package: the root `package.json` would take every lint plugin, and each workspace config would import `../../` paths.
- **A cut-down copy of the app's lint config in the package**: smallest today, but the two copies drift.

## Consequences

- `apps/site` no longer depends on Base UI or `class-variance-authority`. The shared lint layers ban `@base-ui/*` in every workspace, and only the design system's config lifts the ban.
- The package imports nothing from an app, and lint names that mistake.
- The tokens live in the package (`src/styles/tokens.css`); `DESIGN.md` stays at the repo root as the spec.
- Read and creative components (`entry-date`, `ledger`, `prose`, …) stay in the app until a decision moves them.
