import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { EntryDate } from "@/components/entry-date";
import { SubmitButton } from "@/components/submit-button";
import { UpdateForm } from "@/entry-types/updates/components/update-form";
import { readAsAdmin } from "@/entry-types/updates/server/read-as-admin";
import {
  deleteUpdateAction,
  editUpdateAction,
  postUpdateAction,
} from "@/entry-types/updates/server/update-actions";
import { findUpdate, listUpdates } from "@/entry-types/updates/server/updates";

function postedDay(postedAt: Date) {
  return postedAt.toISOString().slice(0, 10);
}

/** The Admin panel's form for posting an Update, which is Published the moment it is posted. */
export function PostUpdateForm() {
  return (
    <UpdateForm
      action={postUpdateAction}
      actions={<SubmitButton pendingLabel="Posting…">Post Update</SubmitButton>}
    />
  );
}

// What the Updates list shows in place of rows: loading, empty or unavailable.
function UpdateListNote({ children }: { children: ReactNode }) {
  return <p className="border-bs border-rule pbs-6 text-ink-muted">{children}</p>;
}

async function UpdateRows() {
  const updates = await readAsAdmin(listUpdates);
  if (!updates.ok) {
    return <UpdateListNote>Updates are unavailable right now.</UpdateListNote>;
  }
  if (updates.value.length === 0) {
    return (
      <UpdateListNote>
        No Updates yet. The first one you post shows on the home page.
      </UpdateListNote>
    );
  }

  return (
    <ol className="-mx-4 border-bs border-rule sm:-mx-3">
      {updates.value.map(({ id, text, link, postedAt, editedAt }) => (
        <li
          key={id}
          className="relative flex items-start justify-between gap-4 border-be border-rule px-4 py-4 transition-colors hover:bg-ground-raised has-focus-visible:bg-ground-raised sm:px-3"
        >
          <div className="grid gap-1 min-inline-0">
            <p className="wrap-break-word">{text}</p>
            {link === null ? null : <p className="wrap-anywhere text-ink-muted">{link}</p>}
            <p className="text-ink-muted">
              <EntryDate date={postedDay(postedAt)} />
              {editedAt === null ? null : " · Edited"}
            </p>
          </div>
          {/* The link covers the whole row; its name says which Update it edits. */}
          <Link
            href={`/admin/updates/${id}`}
            className="flex shrink-0 items-center font-semibold min-block-11 after:absolute after:inset-0"
          >
            Edit<span className="sr-only"> “{text}”</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/**
 * Every Update, newest first, each opening its edit page. Checks the admin session itself, and
 * says so when Updates can't be loaded.
 */
export function UpdateAdminList() {
  return (
    <Suspense fallback={<UpdateListNote>Loading Updates…</UpdateListNote>}>
      <UpdateRows />
    </Suspense>
  );
}

async function EditUpdateBody({ id }: { id: Promise<string | undefined> }) {
  const updateId = await id;
  if (updateId === undefined) notFound();
  const found = await readAsAdmin((db) => findUpdate(db, updateId));
  if (!found.ok) return <p className="text-ink-muted">This Update is unavailable right now.</p>;
  if (!found.value) notFound();

  const update = found.value;
  const { id: foundId, text, link } = update;
  return (
    <>
      <p className="pbs-2 text-ink-muted">
        Posted <EntryDate date={postedDay(update.postedAt)} />
        {update.editedAt === null ? null : " · Edited"}
      </p>
      <div className="pbs-8">
        <UpdateForm
          action={editUpdateAction}
          update={{ id: foundId, text, link }}
          actions={
            <>
              <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
              <Link href="/admin" className="flex items-center text-link min-block-11">
                Cancel
              </Link>
            </>
          }
        />
      </div>
      <section aria-labelledby="delete-update" className="mbs-12 border-bs border-rule pbs-6">
        <h2 id="delete-update" className="font-display text-xl font-bold">
          Delete this Update
        </h2>
        <p className="pbs-1 pbe-4 text-ink-muted">
          It leaves the site at once, and it can’t be brought back.
        </p>
        <form action={deleteUpdateAction}>
          <input type="hidden" name="id" value={foundId} />
          <SubmitButton variant="outline" pendingLabel="Deleting…">
            Delete Update
          </SubmitButton>
        </form>
      </section>
    </>
  );
}

/**
 * The edit page's body for the Update `id` resolves to: when it was posted, the form filled with
 * it, and the way to delete it. Checks the admin session itself; an id that names no Update (or
 * resolves to undefined) is a 404.
 */
export function EditUpdate({ id }: { id: Promise<string | undefined> }) {
  return (
    <Suspense fallback={<p className="pbs-2 text-ink-muted">Loading the Update…</p>}>
      <EditUpdateBody id={id} />
    </Suspense>
  );
}
