# Tooling

How the code is checked, and why each tool is set up the way it is. The config files are the source of truth for the exact rules. This document records the decisions, the exceptions and the traps behind them.

> **Status:** planned. Nothing is installed yet. Each section is filled in at scaffold time, when every rule has been probed with a file that must fail it. Record the probe run and its date here.

## The gate

`pnpm check` runs typecheck, lint, format check and tests across the workspace through Turborepo. When each layer runs is in `docs/conventions.md`, "The gate". The setup:

- **lefthook** (`lefthook.yml`):
  - pre-commit runs Prettier on staged files and re-stages them;
  - commit-msg runs commitlint;
  - pre-push runs `pnpm check`.
- **CI** (GitHub Actions) runs `turbo run … --affected` against `main`, then build, Playwright e2e and axe for the affected apps. It also lints the PR title. The required checks are added to the `protect-main` ruleset.
- **Turborepo remote cache** (Vercel, free) shares task results between local runs and CI.
- **`turbo-ignore`** skips the Vercel deploy of an app that didn't change.

## Planned lint set

The set follows the agent-playbook stack, adapted for Next.js. It is kept lean, and every rule must be defensible.

- **TypeScript:**
  - Compiler: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`.
  - typescript-eslint `strictTypeChecked` + `stylisticTypeChecked`.
  - No type assertions (`as const` and `satisfies` are allowed), no `any`, no non-null assertions, no `@ts-*` comments.
- **Shape:**
  - `complexity` 10, `max-depth` 2, `max-params` 3, `max-nested-callbacks` 2.
  - `no-else-return`, `no-nested-ternary`.
- **Modules:**
  - No re-exports, export lists or `../` imports.
  - Default exports only in files Next.js or a tool requires: `page`, `layout`, `loading`, `error`, `not-found`, `route`, metadata images and config files.
  - `eslint-plugin-boundaries` with `default: "disallow"` and the layer table from `docs/architecture.md`.
- **React and Next.js:**
  - `eslint-plugin-react-hooks` with the React Compiler rules.
  - `@next/eslint-plugin-next`.
  - `eslint-plugin-jsx-a11y`, strict.
- **Tailwind:**
  - `eslint-plugin-better-tailwindcss`: tokens only, no arbitrary values, no raw palette colours.
  - There is no cap on text size; display type comes from `DESIGN.md` tokens.
- **Inline disables:** `linterOptions.noInlineConfig: true`, so disable comments are inert.
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`, and `eslint-config-prettier` last in the lint config.

## Lint exceptions

Per-folder overrides in `eslint.config`. Each needs a reason (`docs/conventions.md`, "Strict by default, loosened by folder").

| Folder | Rules relaxed | Why | Added |
| --- | --- | --- | --- |
| _none yet_ | | | |

## Known traps to re-verify

These come from earlier projects. Each must be confirmed or dropped at scaffold.

- When npm's `latest` TypeScript is ahead of what typescript-eslint supports, pin TypeScript to the newest supported minor.
- `vitest run` exits 1 when there are no test files, so set `passWithNoTests`.
- `eslint-plugin-boundaries` treats an `@/` import it cannot resolve as external and skips it. Add `eslint-import-resolver-typescript` and set `flag-as-external: { unresolvableAlias: false }`, plus `checkInternals` and `checkUnknownLocals`.
- In boundaries v7 an element is a folder. Single files have to be classified with `boundaries/files`.
- pnpm refuses dependency build scripts unless they are listed under `allowBuilds` in `pnpm-workspace.yaml`.
- `pnpm-lock.yaml` goes in `.prettierignore`.
- Prettier reads `.gitignore`, but ESLint and Vitest do not. Ignore `.claude/worktrees/` in all three.
- typescript-eslint presets reject ordinary React code in three places. Relax:
  - `no-misused-promises` with `checksVoidReturn.attributes: false`;
  - `restrict-template-expressions` with `allowNumber`;
  - `no-confusing-void-expression` with `ignoreArrowShorthand`.
- CI's `--affected` needs the git history of the base branch. Check out with `fetch-depth: 0`.
