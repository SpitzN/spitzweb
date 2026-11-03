---
paths:
  - "apps/**/*.tsx"
  - "packages/**/*.tsx"
---

# React

## Server and client

- Components are Server Components by default. Put `"use client"` on the smallest leaf that needs state, effects or browser APIs.
- Fetch data in Server Components and pass it to client components as plain, serialisable values.
- Wrap a section that waits on data in `<Suspense>`. Its fallback should match the final layout, so nothing shifts when the data arrives.
- A form posts to a Server Action and shows the action's result, with field errors next to their fields.

## Composition

- Build a screen by composing small parts. A compound component exposes its parts, and the caller arranges them.
- Vary a component through `children` and composed parts before adding a prop. A component that keeps collecting boolean props gets split into parts.
- `children` is the component's own body. Content for one region of a component that already has a body goes in a named slot prop, such as `actions`.

## React Compiler

The compiler memoizes every component, so a component re-renders only when its props or hook values change.

- Memoization is the compiler's job. Write plain functions and values, without `useMemo`, `useCallback` or `memo`.
- Pass children plain values, not library objects whose contents change internally. A compiled child that is handed such an object goes stale.
- Compute derived values during render. An effect only synchronises with something outside React.
