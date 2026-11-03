# AGENTS.md

spitzweb is Nadav Spitzer's personal site: what Nadav builds, writes and is doing. Read before acting:

- `PRODUCT.md`: who the site is for, what it is made of, its principles.
- `GLOSSARY.md`: the only names for domain concepts.
- `docs/adr/`: decisions already made, and why. Read the ADRs touching an area before changing it.
- `docs/conventions.md`: code standards. Read before writing or reviewing code.
- `docs/setup.md`: accounts, environment variables and deploy steps that Nadav performs.

## Hard rules

- **Glossary names only.** Use `GLOSSARY.md` terms in code, copy, docs, issues and commits. Every _Avoid_ term is wrong everywhere, including the retired v1 names Lab, Writing, Now, Sandbox and Experiment. A new concept gets its name settled in the glossary (domain-modeling) before it gets code.
- **Secrets stay unseen.** `.env*` files are off-limits to read, print or commit; variable names live in `.env.example`. Never echo a secret into chat, logs, code or commits.
- **Migrations move forward.** Generate a new migration for every schema change; a committed migration is immutable. Never run a migration against production: Nadav runs it.
- **Branch, then PR.** `main` takes only squash-merged PRs (GitHub enforces it). On your own feature branch, rewrite history freely and push with `git push --force-with-lease`.
- **Green before done.** Run `pnpm lint`, `pnpm typecheck` and `pnpm test` from the repo root before saying work is done, and report the output as it is.
- **Every dependency is argued.** A PR that adds a dependency says what it does, why the platform or existing code can't, and its install size.
- **Real content or a visible placeholder.** Never invent Projects, Articles, metrics, clients, quotes or Nadav's voice; mark placeholders as placeholders.
- **Pronouns.** Refer to Nadav as "Nadav" or they/them.

## Hosted projects

A Hosted project lives in a self-contained folder inside `apps/site`, with its own Postgres schema if it needs data, and imports nothing from other Hosted projects. It moves to `apps/<name>` at `<name>.spitzweb.dev` only when it hits a trigger in ADR 0002. Raise the move with Nadav rather than making it unasked.

## Skill routing

Three skill packs share the work; superpowers and frontend-design are disabled in this repo. When two skills overlap, the owner below wins.

- **Matt Pocock (`mattpocock-skills:*`) decides and delivers.** `grilling` / `grill-with-docs` and `domain-modeling` settle decisions, names and ADRs; `codebase-design` places module seams; `tdd` writes code test-first; `diagnosing-bugs` hunts bugs; `code-review` reviews; `pr` writes PR bodies. Nadav starts `to-spec`, `to-tickets`, `implement` and `triage` by slash command; when work needs one of them, say so.
- **Addy Osmani (`agent-skills:*`) runs specialist passes:** security, performance, observability, CI/CD, shipping and launch, code simplification, deprecation and migration.
- **Impeccable (`impeccable:impeccable`) owns every UI and UX change**, from a new page to a spacing tweak. It reads `PRODUCT.md` and `DESIGN.md`.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues on `SpitzN/spitzweb`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single context: one `GLOSSARY.md` and `docs/adr/` at the repo root, created as terms and decisions get settled. See `docs/agents/domain.md`.
