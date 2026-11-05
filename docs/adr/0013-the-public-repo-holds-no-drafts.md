# The public repo holds no Drafts

The repository is public, and Articles and Project write-ups are MDX files in it (ADR 0004), so anything committed can be read on GitHub and stays in git history even after it is deleted. The site hides a Draft, but GitHub doesn't, so committing one breaks "a Draft is reachable only by Nadav". So a Draft of an MDX Entry is never committed: it is written in `apps/site/drafts/`, which git ignores, and moves to `content/` when it is ready to be seen. Whatever is in `content/` counts as public, whatever its publication state.

## Considered Options

- **A private content repository**, pulled in at build time: Drafts could deploy, and Nadav could read them on the real site after signing in (ADR 0005). It costs a second repository for one site, and Vercel's build needs access to it. Every change that touches content and code would then span two repos.
- **Drafts in Postgres**, edited in the Admin panel: private and viewable on the real site, but long-form writing would leave version control (ADR 0004), and pages would compile MDX at request time instead of rendering statically (ADR 0011).
- **Drafts on a branch that isn't merged**: every branch of a public repository is public too.
- **A private repository**: this removes the problem, but it hides the code as well. The code stays public, so this ADR stands until that changes.

## Consequences

- An MDX Draft exists only on Nadav's machine. Admin sign-in shows no MDX Drafts on the deployed site. Updates live in Postgres and are never Drafts (GLOSSARY.md), so this ADR doesn't affect them.
- Unlisted means not promoted, not secret. An Unlisted Entry appears in no list on the site, but anyone browsing the repo can find it, so Unlisted is for work that is fine to be found: testing and sharing on the real site before it is listed (PRODUCT.md).
- Removing something from history means rewriting history and treating it as already leaked. Deleting the file is not enough.
- The `pr-screenshots` branch is public as well, so no screenshot shows a Draft, an admin session or a secret.
- The e2e fixtures in every publication state are committed on purpose. They are made-up content.
- Follow-up work (#34) enforces this rather than leaving it to habit:
  - the build fails when a file in `content/` is in the Draft state;
  - `next dev` also renders `drafts/`, so Nadav can read a Draft on the local site.
