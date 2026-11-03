# AGENTS.md

spitzweb is Nadav Spitzer's personal site: what Nadav builds, writes and is doing. It publishes Entries (Projects, Articles, Updates) and Features such as Activity. The repo is a pnpm + Turborepo monorepo; the site is the Next.js app in `apps/site`.

## Where things are

- `PRODUCT.md`: audiences, purpose and principles. Read before deciding what a page or Feature should do.
- `GLOSSARY.md`: the domain terms. Use them in code names, UI copy, commits and docs; every _Avoid_ term is wrong. A new concept gets its name settled here (domain-modeling) before it gets code.
- `docs/adr/`: decisions already made. Read the ones touching an area before changing it. If a change conflicts with one, flag the conflict and leave the decision standing.
- `docs/conventions.md`: workflow, commits, dependencies, testing, and the security, accessibility and performance bars. Read before starting a ticket or opening a PR.
- `docs/architecture.md`: the stack, workspace, code layout, where state lives, and boundaries. Read before adding a module, a route or a dependency.
- `docs/tooling.md`: the gate, what lint enforces and why, and the lint exceptions. Read when a check fails for a reason you don't recognise.
- `DESIGN.md` (written by Impeccable): the visual system. Read before changing how anything looks.
- `docs/setup.md`: the steps only Nadav performs (accounts, secrets, domains). Read when work depends on one of them.

## Rules

Code rules that lint cannot check live in `.claude/rules/`. Read the matching file before writing or changing code:

- `code-design.md`: every source file.
- `structure.md`: where a new file goes.
- `react.md`: components.
- `server.md`: Server Actions, Route Handlers, data access, env and migrations.
- `ui.md`: the UI floor every surface meets.

## Working agreements

- `pnpm check` passes before work is called done; report its output as it is.
- A failing check is fixed in the code. A config change is made on purpose, with its reason recorded in `docs/tooling.md`.
- Work happens on a branch and reaches `main` through a squash-merged PR.
- When a review changes a rule, the same change updates the rule's home (an ADR, `.claude/rules/`, `docs/conventions.md` or `docs/tooling.md`).
- A Hosted project moves out of `apps/site` only on a trigger in ADR 0002. Raise the move with Nadav rather than making it unasked.

## Skill routing

Three skill packs share the work; superpowers and frontend-design are disabled in this repo. When two skills overlap, the owner below wins.

- **Matt Pocock (`mattpocock-skills:*`) decides and delivers.** `grilling` / `grill-with-docs` and `domain-modeling` settle decisions, names and ADRs; `codebase-design` places module seams; `tdd` writes code test-first; `diagnosing-bugs` hunts bugs; `code-review` reviews; `pr` writes PR bodies. Nadav starts `to-spec`, `to-tickets`, `implement` and `triage` by slash command; when work needs one of them, say so.
- **Addy Osmani (`agent-skills:*`) runs specialist passes:** security, performance, observability, CI/CD, shipping and launch, code simplification, deprecation and migration.
- **Impeccable (`impeccable:impeccable`) owns every UI and UX change**, from a new page to a spacing tweak.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues on `SpitzN/spitzweb`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created as terms and decisions get settled. See `docs/agents/domain.md`.
