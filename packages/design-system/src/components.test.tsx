import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DESIGN_SYSTEM_SETTINGS, RESTYLE_POLICY } from "@spitzweb/design-system/lint-policy";
import { designSystemLayer } from "@spitzweb/lint-config/eslint";
import { ESLint } from "eslint";
import type { ComponentType } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import tseslint from "typescript-eslint";
import { describe, expect, test } from "vitest";

// Every design-system component, at every level, keeps the contract callers rely on (ADR 0016):
// it takes `className` and applies it, and the design system's lint lets that className set the
// component's layout but never its look. A component that drops className, or that the linter
// fails to recognise as a design-system component, fails here.

const SOURCE = new URL(".", import.meta.url);
const PACKAGE_ROOT = fileURLToPath(new URL("..", SOURCE));
const LEVELS = ["atoms", "molecules", "organisms"];

// What a component needs before it renders anything: a compound part renders inside its root
// (Base UI throws otherwise), and an error shows only when it matches.
const ROOT_OF: Record<string, string> = {
  FieldLabel: "Field",
  FieldDescription: "Field",
  FieldError: "Field",
};
const RENDER_PROPS: Record<string, Record<string, unknown>> = { FieldError: { match: true } };

type Component = ComponentType<Record<string, unknown>>;

// An export named in PascalCase that is a function is a component.
function isComponent(entry: [string, unknown]): entry is [string, Component] {
  return /^[A-Z]/.test(entry[0]) && typeof entry[1] === "function";
}

async function componentsIn(level: string) {
  const folder = new URL(`${level}/`, SOURCE);
  const files = readdirSync(folder).filter(
    (file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"),
  );
  const found = await Promise.all(
    files.map(async (file) => {
      const loaded: unknown = await import(new URL(file, folder).href);
      if (typeof loaded !== "object" || loaded === null) return [];
      const path = `${level}/${file.replace(/\.tsx$/, "")}`;
      return Object.entries(loaded)
        .filter((entry) => isComponent(entry))
        .map(([name, component]) => ({ path, name, component }));
    }),
  );
  return found.flat();
}

const existingLevels = new Set(readdirSync(SOURCE));
const componentsByLevel = await Promise.all(
  LEVELS.filter((level) => existingLevels.has(level)).map((level) => componentsIn(level)),
);
const components = componentsByLevel.flat();

// The real rule and settings, on a parser alone: the type-aware layers need files on disk.
const eslint = new ESLint({
  cwd: PACKAGE_ROOT,
  overrideConfigFile: true,
  overrideConfig: [
    { files: ["**/*.tsx"], languageOptions: { parser: tseslint.parser } },
    designSystemLayer({ restylePolicy: RESTYLE_POLICY, settings: DESIGN_SYSTEM_SETTINGS }),
  ],
});

function renderWithClassName({ name, component }: (typeof components)[number]) {
  const element = createElement(component, { ...RENDER_PROPS[name], className: "mbs-4" });
  const root = components.find((candidate) => candidate.name === ROOT_OF[name]);
  return renderToStaticMarkup(root ? createElement(root.component, {}, element) : element);
}

async function restyleFindings({ path, name }: (typeof components)[number], props: string) {
  const caller = `import { ${name} } from "@spitzweb/design-system/${path}";
export function Caller() {
  return <${name} ${props} />;
}
`;
  const [result] = await eslint.lintText(caller, { filePath: "src/organisms/caller.tsx" });
  return (result?.messages ?? []).filter(({ ruleId }) => ruleId === "shadcn/no-restyle");
}

test("the design system has components to check", () => {
  expect(components.length).toBeGreaterThan(0);
});

describe.each(components)("<$name> from $path", (found) => {
  test("applies a caller's className", () => {
    expect(renderWithClassName(found)).toMatch(/class="[^"]*\bmbs-4\b/);
  });

  test("lint reports a look class passed as className", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(found, `className="p-4"`)).toHaveLength(1);
  });

  test("lint reports a look class passed through a spread", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(found, `{...{ className: "p-4" }}`)).toHaveLength(1);
  });

  test("lint lets a layout class through", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(found, `className="inline-full"`)).toStrictEqual([]);
  });
});
