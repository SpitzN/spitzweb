import Link from "next/link";
import type { ReactNode } from "react";

// One row of the ledger on the 12-column grid: a muted label, the value, a muted end note. The
// ledger bleeds past the page column by the amount each row pads, so every hairline, the first
// included, spans the lifted ground while the text stays on the page column.

/** A ruled ledger: rows of facts and links set on hairlines, the first rule above them. */
export function Ledger({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section aria-label={label} className="-mx-3 border-bs border-rule">
      {children}
    </section>
  );
}

/** A fact in the ledger, for use inside a `<dl>`. */
export function LedgerFact({
  label,
  end,
  children,
}: {
  label: string;
  end?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 border-be border-rule px-3 py-3 sm:grid-cols-12 sm:items-baseline">
      <dt className="text-ink-muted sm:col-span-2">{label}</dt>
      <dd className="sm:col-span-7">{children}</dd>
      {end !== undefined && <dd className="text-ink-muted sm:col-span-3 sm:text-end">{end}</dd>}
    </div>
  );
}

/**
 * A ledger row that is a link, for use inside a list. The whole row is the target; its name is
 * the value alone, since the list around it says what kind of link it is. Under pointer or focus
 * the row lifts and the value turns heavy in the accent ink.
 */
export function LedgerLink({
  href,
  label,
  end,
  children,
}: {
  href: string;
  label?: string | undefined;
  end?: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="group relative grid grid-cols-1 gap-x-5 border-be border-rule px-3 py-3 transition-all hover:bg-ground-raised has-focus-visible:bg-ground-raised sm:grid-cols-12 sm:items-baseline">
      <span aria-hidden className="text-ink-muted sm:col-span-2">
        {label}
      </span>
      <Link
        href={href}
        className="transition-all group-hover:font-extrabold group-hover:text-accent-ink group-has-focus-visible:font-extrabold group-has-focus-visible:text-accent-ink after:absolute after:inset-0 sm:col-span-7"
      >
        {children}
      </Link>
      {end !== undefined && <span className="text-ink-muted sm:col-span-3 sm:text-end">{end}</span>}
    </li>
  );
}
