# Tooling

How the code is checked, and why each tool is set up the way it is. The config files are the source of truth for the exact rules; this document records the decisions, the exceptions and the traps behind them.

The setup was built and probed on 2026-11-03, then rebased on `eslint-config-next` and probed again the same day. Each rule that must fail got a "bad" file, and each one failed it. The current page and layout passed as "good" files. The one gap found is listed under "What lint cannot enforce". Probe again whenever you add or change a rule, and record the run here.

## The gate

`pnpm check` is the definition of done. Turborepo runs these steps; each one is cached by its inputs, so a package that hasn't changed is skipped.

| Step         | Command (per app)                       |
| ------------ | --------------------------------------- |
| Typecheck    | `next typegen && tsc --noEmit`          |
| Lint         | `eslint . --max-warnings 0`             |
| Tests        | `vitest run`                            |
| Format check | `prettier --check .` (root, whole repo) |

It runs at three points (`docs/conventions.md`, "The gate"):

| When                   | What runs                                                               | Where it's set up                |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------- |
| Commit                 | Prettier on staged files (re-staged), commitlint on the message         | `lefthook.yml`                   |
| Push                   | `pnpm check`                                                            | `lefthook.yml`                   |
| PR and merge to `main` | Format check, then `turbo run typecheck lint test build e2e --affected` | `.github/workflows/ci.yml`       |
| PR title               | Conventional Commits, lower-case subject, no trailing full stop         | `.github/workflows/pr-title.yml` |

`pnpm e2e` builds the site, starts it, and runs Playwright on desktop Chrome and on a Pixel 7 viewport. Every route in `e2e/public-routes.spec.ts` has to return 200 and pass axe with the WCAG 2.2 AA tags.

## Decisions

| Decision                              | Why                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node 26 (LTS) everywhere              | `.nvmrc` is `26`, and both `package.json` files set `engines.node` to `26.x`. Vercel reads `engines` from the app's own `package.json` (`apps/site`) and would otherwise build on whatever its default is. `@types/node` follows the runtime major, and Renovate holds it there.                                                                                                                                            |
| TypeScript pinned to `~6.0`           | npm's `latest` is TypeScript 7, but typescript-eslint 8 supports TypeScript below 6.1 only. This way one compiler both type-checks and lints. Renovate holds TypeScript below 6.1.                                                                                                                                                                                                                                          |
| ESLint 10                             | ESLint 9 reached end-of-life in August 2026. `eslint-plugin-jsx-a11y`, `eslint-plugin-react` and `eslint-plugin-import` (the last two through `eslint-config-next`) declare support only up to 9, but every probe ran correctly on 10. `pnpm peers check` reports the mismatch.                                                                                                                                             |
| `eslint-config-next` is the base      | It is Next.js's default (core-web-vitals and typescript), and it comes with `eslint-plugin-react`, react-hooks, jsx-a11y, `@next/eslint-plugin-next` and one `eslint-plugin-import` rule. Our stricter layers sit on top of it. Because Next.js's config registers those plugins, our layers use their rules only (`...plugin.configs.x.rules`), never the plugin itself: ESLint refuses to register the same plugin twice. |
| `typecheck` runs `next typegen` first | `LayoutProps`, `PageProps` and typed routes are generated into `.next/types`. Without them, `tsc` fails on a clean clone.                                                                                                                                                                                                                                                                                                   |
| Next.js rewrites `tsconfig.json`      | During typegen it adds `esModuleInterop`, which SWC needs, and expands the arrays. The file is kept in the shape Next.js writes, formatted by Prettier, so later runs leave it alone.                                                                                                                                                                                                                                       |
| Prettier formats, ESLint lints        | `eslint-config-prettier` comes last in the lint config, so no formatting rule stays active. Prettier's options are all written out, at 100 columns, so a new Prettier major can't restyle the code.                                                                                                                                                                                                                         |
| `prettier-plugin-tailwindcss`         | Class order counts as formatting. The plugin reads `apps/site/src/app/globals.css` and sorts classes in `className`, `cn()` and `cva()`.                                                                                                                                                                                                                                                                                    |
| Disable comments are inert            | `noInlineConfig` is on, so a file can't switch a rule off. The ignored comment shows up as a warning, and `--max-warnings 0` fails on it.                                                                                                                                                                                                                                                                                   |
| `process.env` is banned in source     | Env is read through one validated accessor (`.claude/rules/server.md`). Config files are exempt. The accessor file gets its own exception when it lands.                                                                                                                                                                                                                                                                    |
| pnpm minimum release age              | pnpm 11 refuses versions published less than a day ago. `next@16.4.5` was a few hours old at scaffold time, so `16.4.4` is pinned. Renovate waits 3 days before proposing an update.                                                                                                                                                                                                                                        |
| Install scripts allowed one by one    | `pnpm-workspace.yaml` lists every package that ships an install script. `lefthook`'s is refused because `prepare` installs the hooks. `sharp`'s and `unrs-resolver`'s are refused because their binaries arrive prebuilt.                                                                                                                                                                                                   |
| Actions pinned by commit SHA          | A moved tag can't change what CI runs. Renovate (`helpers:pinGitHubActionDigests`) keeps the SHAs current.                                                                                                                                                                                                                                                                                                                  |
| `--affected` in CI                    | CI checks only what changed relative to the base, plus everything that depends on it. The checkout uses `fetch-depth: 0` so Turborepo can diff, and `TURBO_SCM_BASE` sets the base for PRs and pushes.                                                                                                                                                                                                                      |
| `passWithNoTests`                     | `vitest run` exits 1 when there are no test files, which would fail the gate before the first tested module lands.                                                                                                                                                                                                                                                                                                          |

## What lint enforces

| Convention                                                                                                                                                              | How                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No type assertions (`as const` and `satisfies` are allowed)                                                                                                             | `@typescript-eslint/consistent-type-assertions`                                                                                                                                                                     |
| No `any`, no non-null assertions, no floating promises, no unsafe use of untyped values                                                                                 | typescript-eslint `strictTypeChecked`                                                                                                                                                                               |
| No `@ts-ignore`, `@ts-expect-error` or `@ts-nocheck`                                                                                                                    | `@typescript-eslint/ban-ts-comment`                                                                                                                                                                                 |
| Limits on tangled code                                                                                                                                                  | `complexity` 10, `max-depth` 2, `max-params` 3, `max-nested-callbacks` 2 (off in tests)                                                                                                                             |
| Guard clauses, flat logic                                                                                                                                               | `no-else-return` (`allowElseIf: false`), `no-nested-ternary`, `no-lonely-if`, `no-unneeded-ternary`                                                                                                                 |
| Destructuring when reading from objects and arrays                                                                                                                      | `@typescript-eslint/prefer-destructuring`                                                                                                                                                                           |
| No re-exports, no export lists                                                                                                                                          | `no-restricted-syntax` selectors                                                                                                                                                                                    |
| No default exports, except where Next.js or a tool needs one                                                                                                            | `no-restricted-exports`, with the exceptions listed below                                                                                                                                                           |
| `@/` for any import outside the folder; no `../`                                                                                                                        | `no-restricted-imports`                                                                                                                                                                                             |
| Env only through the accessor                                                                                                                                           | `no-restricted-properties` on `process.env`                                                                                                                                                                         |
| Import direction and known folders                                                                                                                                      | `eslint-plugin-boundaries` (see the table below)                                                                                                                                                                    |
| React Compiler rules, such as state set or derived in effects, and impure render                                                                                        | `eslint-plugin-react-hooks` `recommended-latest`, plus `no-deriving-state-in-effects`, with every rule an error                                                                                                     |
| Next.js pitfalls, such as `<img>`, `<a>` for internal links or sync scripts                                                                                             | `eslint-config-next` core-web-vitals                                                                                                                                                                                |
| React correctness: list keys, no components defined inside components, no leaked `0` from `&&`, no `dangerouslySetInnerHTML`, no array-index keys, no useless fragments | `eslint-plugin-react` from `eslint-config-next`, plus `no-danger`, `jsx-no-leaked-render`, `no-unstable-nested-components`, `no-array-index-key`, `jsx-no-useless-fragment` and `jsx-no-constructed-context-values` |
| Accessibility basics                                                                                                                                                    | `eslint-plugin-jsx-a11y`, strict                                                                                                                                                                                    |
| Theme tokens only: no arbitrary values, no raw palette colours                                                                                                          | `better-tailwindcss/no-restricted-classes`                                                                                                                                                                          |
| Logical properties only (RTL-ready)                                                                                                                                     | `better-tailwindcss/enforce-logical-properties`                                                                                                                                                                     |
| No unknown, conflicting, duplicate or deprecated classes                                                                                                                | `better-tailwindcss/no-unknown-classes`, `no-conflicting-classes`, `no-duplicate-classes`, `no-deprecated-classes`                                                                                                  |

### Import direction

`eslint-plugin-boundaries` classifies each file under `src/`. An import between project files is allowed only when a policy permits it (`default: "disallow"`). A file outside every known folder fails `boundaries/no-unknown-files`. That means the first file in a new top-level folder fails lint until the folder is added to this table and to `docs/architecture.md`.

| Layer            | Files                           | May import                                         |
| ---------------- | ------------------------------- | -------------------------------------------------- |
| `app`            | `src/app/**`                    | every layer, CSS                                   |
| `entry-type`     | `src/entry-types/<name>/**`     | the same Entry type, `domain`, shared code         |
| `feature`        | `src/features/<name>/**`        | the same Feature, `domain`, shared code            |
| `admin`          | `src/admin/**`                  | `admin`, `domain`, shared code                     |
| `hosted-project` | `src/hosted-projects/<name>/**` | the same Hosted project, shared code (no `domain`) |
| `domain`         | `src/domain/**`                 | `domain`, `lib`                                    |
| `components`     | `src/components/**`             | shared code, CSS                                   |
| `hooks`          | `src/hooks/**`                  | `hooks`, `lib`                                     |
| `lib`            | `src/lib/**`                    | `lib`                                              |

Shared code is `components`, `hooks` and `lib`. Why each row is shaped this way is in `docs/architecture.md`, Code layout.

On top of the table:

- No file imports a test file.
- An `@/` import the resolver can't follow fails `boundaries/no-unknown-dependencies`.

A new top-level folder under `src/` is a design change: it goes through `codebase-design`, then into this table, `docs/architecture.md` and the config together. Each rule above was probed with a file that breaks it (2026-11-04).

## Lint exceptions

Each exception is set up per folder in `apps/site/eslint.config.js`, never inline (`docs/conventions.md`, "Strict by default, loosened by folder").

| Files                                                                                                                          | Rules relaxed                                       | Why                                                            | Added      |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------- | ---------- |
| Next.js special files (`page`, `layout`, `loading`, `error`, `not-found`, metadata images, `sitemap`, `robots`, `manifest`, …) | `no-restricted-exports`                             | Next.js requires a default export                              | 2026-11-03 |
| `*.config.{js,ts}`                                                                                                             | `no-restricted-exports`, `no-restricted-properties` | Tools require a default export, and config reads `process.env` | 2026-11-03 |
| `e2e/**`, `**/*.test.{ts,tsx}`                                                                                                 | `max-nested-callbacks`                              | `describe` → `test` → callback nests by design                 | 2026-11-03 |

## What lint cannot enforce

These stay as review rules in `.claude/rules/`.

- **Mutating a prop inside a component** (`items.push(...)`) passes. The React Compiler rules didn't report it in the probe.
- **A function or component that only forwards its arguments.**
- **A route segment that holds business logic**, or a domain file that only one slice uses.
- **A Hosted project importing another Hosted project.** This becomes enforceable once the layers exist.
- **Physical CSS in a `.css` file**, such as `margin-left`. The Tailwind rules only see class names.

## Traps

- **Prettier reads `.gitignore`; ESLint and Vitest don't.** Here ESLint and Vitest run inside `apps/site` only, so agents' worktrees in `.claude/worktrees/` at the root never reach them.
- **`eslint-plugin-boundaries` skips an `@/` import it can't resolve.** It needs `eslint-import-resolver-typescript` with `flag-as-external: { unresolvableAlias: false }`, plus `checkInternals` and `checkUnknownLocals`.
- **In boundaries v7 an element is a folder.** Single files, such as tests and CSS, are classified with `boundaries/files` categories.
- **typescript-eslint presets reject ordinary React code in three places**, which are relaxed on purpose:
  - `no-misused-promises` (`checksVoidReturn.attributes: false`)
  - `restrict-template-expressions` (`allowNumber`)
  - `no-confusing-void-expression` (`ignoreArrowShorthand`)
- **`pnpm-lock.yaml` and `.impeccable/` are in `.prettierignore`.** Without that, the format check flags the lockfile and Impeccable's generated files.
- **`next dev` rewrites `apps/site/AGENTS.md`** when it detects a coding agent. The block is committed as written. `apps/site/CLAUDE.md` imports it, so Claude Code loads Next.js's pointer to the docs bundled in `node_modules/next/dist/docs/`.
- **Node 25 and later ship without corepack**, so `pnpm` is missing after `nvm install 26`. Run `npm install -g corepack@latest && corepack enable pnpm` once per Node install; pnpm then follows `packageManager`. CI uses `pnpm/action-setup` and doesn't need it.
