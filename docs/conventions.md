# Conventions

The standards that cut across the whole repo, as opposed to rules for one kind of file. Code rules for specific paths live in `.claude/rules/`. How each standard is enforced, and every exception, is in `docs/tooling.md`. A project-wide departure from a convention needs an ADR.

## Where a rule lives

Each rule has exactly one home, the first one in this list that can hold it:

1. **The compiler and lint**, for anything a tool can check. These rules are listed in `docs/tooling.md`. `noInlineConfig` makes disable comments inert.
2. **`.claude/rules/<topic>.md`**, for code conventions lint cannot check, scoped to the paths they govern.
3. **This file**, for standards that cut across the whole repo.
4. **An ADR**, for a decision with a real alternative, together with its reason.
5. **`GLOSSARY.md`**, for the name and meaning of a domain concept.

When the same review comment comes up a second time, it becomes a rule in its home. When a rule stops matching the code, fix one of the two in the same change.

## The gate

`pnpm check` runs typecheck, lint (ESLint and Stylelint), tests, the format check, Knip and sherif through Turborepo. Passing it is the definition of done. It runs at three points:

| When                     | What runs                                                                                 | Scope                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Commit                   | Prettier on staged files, commitlint on the message                                       | Staged files                                                     |
| Push                     | `pnpm check`                                                                              | The whole workspace. Turborepo's cache skips unchanged packages. |
| CI on a PR and on `main` | Format check, Knip and sherif, then typecheck, lint, tests, build, Playwright e2e and axe | Packages affected relative to the base (`--affected`)            |

lefthook runs the commit and push hooks. CI also checks the PR title. Unchanged apps skip their Vercel deploy (`turbo-ignore`).

## Git and pull requests

- Trunk-based: short-lived branches off `main`, named `<type>/<issue>-<slug>`, for example `feat/12-activity-list`.
- Commit messages follow Conventional Commits. The subject is a lower-case imperative and says what changed, for example `fix(site): keep long names inside their boxes`. The scope is optional and names the app or package. commitlint enforces the format.
- Every PR is squash-merged. Its title becomes the commit on `main`, so the title follows the same format.
- The PR body is written with `pr`. It covers what changed, the evidence (what was run and what it showed), what could go wrong, and `Closes #<issue>`.
- A PR that changes UI shows it in screenshots: before and after for a changed surface or a visual bug fix, after alone for a new component or page. They are captured from the running app (Playwright or Claude in Chrome), at desktop and phone width and in both themes where the change differs between them. They are uploaded to GitHub as attachments of the PR and embedded in its body (`github.com/user-attachments/…` links), which GitHub's web page does by drag and drop and the `gh` CLI cannot do. They never go into a commit, on the PR's branch or on `main`.

## Dependencies

- Use pnpm only.
- Prefer a maintained package to writing the same thing ourselves.
- Before adding a package, compare the main options on maintenance, size (and whether it ends up in the client bundle), types, licence and known advisories. Record the pick and the runner-up in the PR.
- Renovate opens one grouped PR of dependency updates a week. Majors arrive as separate PRs.

## Testing

- Vitest tests sit beside the code they test. Playwright covers end-to-end flows and accessibility.
- Logic is written test-first (`tdd`). A bug fix starts with a failing test.
- Test behaviour through public interfaces, not internals.
- Database tests run against PGlite with the real migrations applied.
- Every public route gets an axe check in Playwright.

## Security invariants

Each invariant is covered by a test once the code it governs exists.

- **Draft** Entries are reachable only by Nadav. **Unlisted** Entries are reachable at their URL but appear in no list, Activity, search, sitemap or feed.
- The repo is public, so everything committed is public. A Draft of an MDX Entry stays in the git-ignored `apps/site/drafts/` and is never committed. Unlisted means not promoted, not secret (ADR 0013).
- Any GitHub account other than Nadav's is rejected before a user record is created (ADR 0005).
- Text entered through the Admin panel or by visitors renders as text, never as HTML. A user-supplied link is accepted only with the `https:` protocol.
- A Hosted project that calls a paid API has three guards:
  - a per-visitor rate limit, incremented atomically in a single upsert statement;
  - a kill switch in the Admin panel;
  - a spend cap in the provider's dashboard.

## Accessibility and performance

- Every public page meets WCAG 2.2 AA in both themes, and the Admin panel is usable at phone width. The UI floor is in `.claude/rules/ui.md`.
- Public pages meet Core Web Vitals' "good" thresholds on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- Content pages render statically. Client JavaScript ships only where a page needs interaction.

## Strict by default, loosened by folder

Lint rules hold everywhere, including the Tailwind rule of tokens only, no arbitrary values and no raw palette colours.

A surface that needs freedom, such as a creative Hosted project or the home page, gets an override for its folder in `eslint.config`. The override is never inline, it appears as a config change in the PR, and it is listed in `docs/tooling.md` with its reason.

Before reaching for an override, try two things:

- give the surface its own tokens, defined in its own stylesheet;
- use plain CSS, SVG or canvas, which the Tailwind rules don't check.
