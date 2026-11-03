---
paths:
  - "apps/**/*.{ts,tsx}"
  - "packages/**/*.{ts,tsx}"
---

# Code design

Lint enforces the mechanical conventions (`docs/tooling.md`). These are the rules it cannot check.

## Modules

- **Deep modules.** A module earns its place by hiding real work behind a small interface. A second responsibility is a reason to split; length is not.
- **Every layer transforms.** A function, hook or component that only forwards its arguments is removed, and its caller uses the next layer directly.
- **Values travel the shortest path.** A value needed deep in the tree is read where it is used, or handed down by composition. Components don't carry props they don't use.
- **Import from the defining file.** Each name is exported where it is declared and imported from that file.

## Scope

- **Build for a caller that exists.** Add a prop, option, parameter or abstraction only when this version uses it.
- **One source for each fact.** Option lists, states and types are derived from their schema. A rule lives in one place, and everything else reads it.
- **Extract on the third use.** Two similar pieces of code stay separate until a third shows what they share.
- **The library's feature first.** Check a library's own API and examples before writing project code that does the same job.

## Functions

- Guard clauses and early returns keep the main path unindented.
- A boolean parameter that switches behaviour becomes two functions.
- Names use the glossary's terms, and a name says what a function returns.
- A function that can fail for a known reason returns `{ ok: true, value } | { ok: false, error }`. Throw only for bugs and broken invariants.

## Types

- Build types by construction: `z.infer` from schemas, `satisfies`, discriminated unions.
- Zod parses wherever data enters from outside the type system. `docs/architecture.md` lists those boundaries; inside them, types are trusted.
- Let return types be inferred.

## Comments

A comment says what the code cannot.

- An interface comment describes a function or module from the caller's side: what it promises, what it expects, and its side effects.
- An implementation comment explains why this path or workaround was chosen.
- When code needs a comment to say what it does, rename or restructure it instead.
