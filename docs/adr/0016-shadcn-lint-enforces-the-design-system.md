# @shadcn/lint enforces the design system

Agents write most of the UI, and lint is their feedback loop. So every caller of the design system is checked by [`@shadcn/lint`](https://github.com/shadcn-ui/lint), in every workspace. It recognises a design-system component by its import path (`@spitzweb/design-system/…`), not by a list, so a new atom is covered as soon as it exists. Its errors name the component's variants and the file that defines them, which tells an agent how to fix a finding.

The line it draws: **a caller owns a component's layout, and the component owns its look.** A design-system component takes `className`, but only layout passes (margin, width, flex and grid placement). Colour, spacing, typography, shape, effects and motion are reported. A new look is a new variant in the package, never a class at the call site. A contract (`contracts` in `packages/design-system/lint-policy.js`) is the only way to open more for one component, and only when DESIGN.md calls for a caller to set more than layout on it. The policy is written once there, and every workspace's ESLint config reads it.

Six rules run as errors:

| Rule                     | Guards                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `no-restyle`             | A design-system component's look, from `className`, a spread or a wrapper (`allow: layout`) |
| `no-raw-colors`          | Colours: theme tokens only, no Tailwind palette, no literal colours in SVG attributes       |
| `no-arbitrary-values`    | Values: the theme's scale, no `p-[13px]`; the error names the scale step                    |
| `no-inline-styles`       | No `style` props or `<style>` elements                                                      |
| `no-unknown-classes`     | Classes Tailwind can generate from the theme, with a spelling suggestion                    |
| `require-static-classes` | Class values lint can read, so the rules above see every class handed to a component        |

Inside the package, an atom is where a look is defined, so `no-restyle` and `require-static-classes` are off in `src/atoms/` only. Molecules and organisms compose atoms under the same rule as the app.

## Considered Options

- **Atoms take no `className`**, so TypeScript blocks restyling: it also blocks layout, so a caller wraps every atom in a `div` or the atom grows layout variants; it breaks shadcn's code shape; and a spread (`{...{ className }}`) gets past the type anyway.
- **eslint-plugin-better-tailwindcss alone**, which already banned arbitrary values and the palette: it can't tell a component's look from its layout, and its errors don't point at the variants or tokens to use.

## Consequences

- better-tailwindcss's `no-restricted-classes` and `no-unknown-classes` are off, so a class isn't reported twice. It keeps logical properties, conflicting, duplicate and deprecated classes, which `@shadcn/lint` doesn't check.
- `noInlineConfig` makes `eslint-disable` inert, so the exception comments shadcn's docs suggest don't exist here. A real exception goes in a config, with its reason in `docs/tooling.md`.
- A test in the package (`src/atoms/lint-coverage.test.ts`) lints a caller of every atom component: a look class must be reported, directly and through a spread, and a layout class must pass. An atom the linter fails to recognise fails it.
- The theme is built from `src/styles/tokens.css`, which imports Tailwind itself, so the package's `components.json` points there and the package depends on `tailwindcss`. Otherwise the class rules fall back to a weaker grammar and print a `[@shadcn/lint]` warning.
