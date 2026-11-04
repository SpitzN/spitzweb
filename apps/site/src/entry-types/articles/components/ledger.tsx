import Link from "next/link";
import type { ReactNode } from "react";

// One row of the ledger on the 12-column grid: a muted label, the value, a muted end note. The
// ledger bleeds past the page column by the amount each row pads, so every hairline, the first
// included, spans the lifted ground while the text stays on the page column.
const ROW =
  "grid grid-cols-1 gap-x-5 border-be border-rule px-3 py-3 sm:grid-cols-12 sm:items-baseline";
const LABEL = "text-ink-muted sm:col-span-2";
const VALUE = "sm:col-span-7";
const END = "text-ink-muted sm:col-span-3 sm:text-end";

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
    <div className={ROW}>
      <dt className={LABEL}>{label}</dt>
      <dd className={VALUE}>{children}</dd>
      {end !== undefined && <dd className={END}>{end}</dd>}
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
    <li
      className={`${ROW} group relative transition-all hover:bg-ground-raised has-focus-visible:bg-ground-raised`}
    >
      <span aria-hidden className={LABEL}>
        {label}
      </span>
      <Link
        href={href}
        className={`${VALUE} transition-all group-hover:font-extrabold group-hover:text-accent-ink group-has-focus-visible:font-extrabold group-has-focus-visible:text-accent-ink after:absolute after:inset-0`}
      >
        {children}
      </Link>
      {end !== undefined && <span className={END}>{end}</span>}
    </li>
  );
}
