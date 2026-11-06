// How the design system is linted, read by every workspace's ESLint config so they can't drift
// (ADR 0016). The rules themselves are set in @spitzweb/lint-config.

/**
 * The `shadcn/no-restyle` options. A caller owns a design-system component's layout through
 * `className`: margin, width, flex and grid placement. The component owns its look: colour,
 * spacing, typography, shape, effects and motion, which change only through a new variant.
 *
 * A contract opens more for one component, and only when DESIGN.md calls for a caller to set more
 * than layout on it. Each contract goes in `contracts` with its reason beside it.
 */
export const RESTYLE_POLICY = {
  allow: ["layout"],
};

/** `settings.shadcn`: which imports are design-system components, and where the theme lives. */
export const DESIGN_SYSTEM_SETTINGS = {
  ui: "@spitzweb/design-system",
  themeImports: ["^@spitzweb/design-system/"],
  note: "DESIGN.md is the spec. A new look is a new variant in packages/design-system, never a class at the call site.",
};
