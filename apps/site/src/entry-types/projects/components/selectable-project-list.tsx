"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { EntryYear } from "@/components/entry-date";
import { focusOf, listKeyAction } from "@/entry-types/projects/list-selection";

/** One Project as its row shows it, in plain values a client component can receive. */
export interface ProjectRowFacts {
  href: string;
  title: string;
  summary: string;
  isFeatured: boolean;
  /** YYYY-MM-DD; the row shows its year. */
  date: string;
  statusLabel: string;
}

/**
 * The home page's Projects list (DESIGN.md, Project list row), with one row always selected: its
 * ground lifts and its title turns heavy in the accent ink. The pointer selects the row it moves
 * over, keyboard focus selects the row it lands on, and J and K move the selection, taking focus
 * with it so Enter opens the row as a link does. With nothing focused, Enter opens the selected
 * row. None of the keys do anything while a text field has focus.
 */
export function SelectableProjectList({ rows }: { rows: readonly ProjectRowFacts[] }) {
  const [selected, setSelected] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const router = useRouter();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    const action = listKeyAction({
      key: event.key,
      code: event.code,
      isModified: event.ctrlKey || event.altKey || event.metaKey,
      focus: focusOf(document.activeElement),
      selected,
      count: rows.length,
    });
    if (action === undefined) return;

    event.preventDefault();
    if (action.kind === "open") {
      const row = rows[action.index];
      if (row) router.push(row.href);
      return;
    }
    setSelected(action.index);
    list.current?.querySelectorAll("a").item(action.index).focus();
  });

  // The keys work wherever the visitor is on the page, not only inside the list.
  useEffect(() => {
    addEventListener("keydown", onKeyDown);
    return () => {
      removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    // The list bleeds past the page column by the amount each row pads, so the hairlines span the
    // lifted ground while the text stays on the page column; on a narrow screen, to its edges.
    <ol ref={list} className="-mx-4 border-bs border-rule sm:-mx-3">
      {rows.map((row, index) => (
        <li
          key={row.href}
          data-selected={index === selected || undefined}
          className="group relative grid grid-cols-1 gap-x-5 gap-y-1 border-be border-rule px-4 py-4 transition-all data-selected:bg-ground-raised sm:grid-cols-12 sm:items-baseline sm:px-3"
        >
          <h3 className="font-display text-title text-balance transition-all group-data-selected:font-extrabold group-data-selected:text-accent-ink sm:col-span-4">
            {/* The link covers the whole row, so the pointer is over it anywhere in the row, and
                its name stays the title. */}
            <Link
              href={row.href}
              onPointerEnter={() => {
                setSelected(index);
              }}
              onFocus={() => {
                setSelected(index);
              }}
              className="after:absolute after:inset-0"
            >
              {row.title}
            </Link>
          </h3>
          <p className="text-ink-muted sm:col-span-5">{row.summary}</p>
          <p className="text-ink-muted sm:col-span-3 sm:text-end">
            {/* The panel above holds the leading Featured Project, so a second one says why it
                sits above newer Projects. */}
            {row.isFeatured ? <span className="font-semibold text-ink">Featured · </span> : null}
            <EntryYear date={row.date} />
            <br />
            {row.statusLabel}
          </p>
        </li>
      ))}
    </ol>
  );
}
