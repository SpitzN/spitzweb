import type { ReactNode } from "react";

/**
 * The whole page when it can't show what was asked for: a 404 or an error. `children` is the
 * sentence under the heading; `actions` are the ways forward.
 */
export function StatusMessage({
  heading,
  children,
  actions,
}: {
  heading: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <main className="pbs-16 pbe-24">
      <h1 className="font-display text-statement font-extrabold text-balance max-inline-4xl">
        {heading}
      </h1>
      <p className="pbs-5 pbe-12 text-lg text-ink-muted max-inline-2xl">{children}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">{actions}</div>
    </main>
  );
}
