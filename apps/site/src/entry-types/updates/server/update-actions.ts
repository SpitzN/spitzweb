"use server";

import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { deleteUpdate, editUpdate, postUpdate } from "@/entry-types/updates/server/update-commands";
import { UPDATES_CACHE_TAG } from "@/entry-types/updates/server/updates";
import { getAuth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

// What was typed, kept as it was so the form can show it again; anything missing reads as empty.
const submittedSchema = z.object({ text: z.string().catch(""), link: z.string().catch("") });

/** What an Update form shows after its last submission. */
export type UpdateFormState =
  | { status: "ready" }
  | { status: "posted" }
  // A turned-back submission carries what was submitted, because React empties the form.
  | {
      status: "invalid";
      /** Each failing field's error, by the field's name. */
      errors: Record<string, string>;
      submitted: z.infer<typeof submittedSchema>;
    }
  | { status: "failed"; message: string; submitted: z.infer<typeof submittedSchema> };

async function adminRequest() {
  // The request first: building Better Auth reads the server env (docs/tooling.md, Traps).
  const requestHeaders = await headers();
  return { auth: getAuth(), db: getDatabase(), requestHeaders };
}

/**
 * Runs the command on a submitted Update form and returns the state for a submission it turned
 * back, or undefined when it saved, after expiring the cached Updates. Bad input and a failed
 * database come back as state, so what Nadav typed survives; a redirect to sign-in and a 404 pass
 * through.
 */
async function turnedBackState(
  command: typeof postUpdate | typeof editUpdate,
  formData: FormData,
): Promise<UpdateFormState | undefined> {
  const submitted = submittedSchema.parse({
    text: formData.get("text"),
    link: formData.get("link"),
  });
  try {
    const result = await command(await adminRequest(), formData);
    if (!result.ok) return { status: "invalid", errors: result.error, submitted };
    updateTag(UPDATES_CACHE_TAG);
    return undefined;
  } catch (error) {
    unstable_rethrow(error);
    Sentry.captureException(error);
    return { status: "failed", message: "The Update couldn’t be saved. Try again.", submitted };
  }
}

/** Posts an Update from the Admin panel; the home page shows it on its next request. */
export async function postUpdateAction(
  _previous: UpdateFormState,
  formData: FormData,
): Promise<UpdateFormState> {
  return (await turnedBackState(postUpdate, formData)) ?? { status: "posted" };
}

/** Saves an edited Update, then returns to the Admin panel. */
export async function editUpdateAction(
  _previous: UpdateFormState,
  formData: FormData,
): Promise<UpdateFormState> {
  const turnedBack = await turnedBackState(editUpdate, formData);
  if (turnedBack) return turnedBack;
  redirect("/admin");
}

/**
 * Deletes an Update for good, then returns to the Admin panel. A failure goes to the error page,
 * which reports it; there is nothing typed to keep.
 */
export async function deleteUpdateAction(formData: FormData) {
  await deleteUpdate(await adminRequest(), formData);
  updateTag(UPDATES_CACHE_TAG);
  redirect("/admin");
}
