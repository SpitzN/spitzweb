import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DESIGN_SYSTEM_SETTINGS, RESTYLE_POLICY } from "@spitzweb/design-system/lint-policy";
import { designSystemLayer } from "@spitzweb/lint-config/eslint";
import { ESLint } from "eslint";
import tseslint from "typescript-eslint";
import { describe, expect, test } from "vitest";

// Every component an atom file exports is enforced by the design system's lint (ADR 0016): a caller
// may set its layout through className, never its look. An atom the linter fails to recognise as
// a design-system component would let any class through, so it fails here.

const PACKAGE_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const ATOMS = new URL(".", import.meta.url);

// Lint makes every component an `export function` declaration (func-style, no export lists), so
// an atom file's components are read from its source.
const components = readdirSync(ATOMS)
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .flatMap((file) =>
    readFileSync(new URL(file, ATOMS), "utf8")
      .matchAll(/^export function ([A-Z]\w*)/gm)
      .map(([, name = ""]) => ({ atom: file.replace(/\.tsx$/, ""), name }))
      .toArray(),
  );

// The real rule and settings, on a parser alone: the type-aware layers need files on disk.
const eslint = new ESLint({
  cwd: PACKAGE_ROOT,
  overrideConfigFile: true,
  overrideConfig: [
    { files: ["**/*.tsx"], languageOptions: { parser: tseslint.parser } },
    designSystemLayer({ restylePolicy: RESTYLE_POLICY, settings: DESIGN_SYSTEM_SETTINGS }),
  ],
});

async function restyleFindings({ atom, name }: (typeof components)[number], props: string) {
  const caller = `import { ${name} } from "@spitzweb/design-system/atoms/${atom}";
export function Caller() {
  return <${name} ${props} />;
}
`;
  const [result] = await eslint.lintText(caller, { filePath: "src/molecules/caller.tsx" });
  return (result?.messages ?? []).filter(({ ruleId }) => ruleId === "shadcn/no-restyle");
}

test("the atoms folder exports components", () => {
  expect(components.length).toBeGreaterThan(0);
});

describe.each(components)("<$name> from atoms/$atom", (component) => {
  test("reports a look class passed as className", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(component, `className="p-4"`)).toHaveLength(1);
  });

  test("reports a look class passed through a spread", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(component, `{...{ className: "p-4" }}`)).toHaveLength(1);
  });

  test("lets a layout class through", { timeout: 30_000 }, async () => {
    expect(await restyleFindings(component, `className="inline-full"`)).toStrictEqual([]);
  });
});
