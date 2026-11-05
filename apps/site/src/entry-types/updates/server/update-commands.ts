import "server-only";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { updates } from "@/entry-types/updates/schema";
import { UPDATE_TEXT_MAX_LENGTH } from "@/entry-types/updates/update-text";
import { requireAdminSession } from "@/lib/admin-session";
import type { Auth } from "@/lib/auth";
import type { Database } from "@/lib/db";

const TOO_LONG = `Keep it to ${String(UPDATE_TEXT_MAX_LENGTH)} characters.`;
const textSchema = z
  .string()
  .min(1, "Write what you’re doing.")
  .max(UPDATE_TEXT_MAX_LENGTH, TOO_LONG);

const updateInputSchema = z.object({
  // Runs of whitespace, line breaks included, become one space: an Update renders as one line.
  text: z
    .string()
    .transform((text) => text.trim().replaceAll(/\s+/g, " "))
    .pipe(textSchema),
  // Security invariant (docs/conventions.md): a link is accepted only with the https: protocol.
  link: z.preprocess(
    (link) => (link === "" || link === null ? undefined : link),
    z
      .url({
        protocol: /^https$/,
        hostname: z.regexes.domain,
        error: "Use a link that starts with https://",
      })
      .optional(),
  ),
});

// The form names the Update it edits or deletes in a hidden field, which arrives as any string.
const updateIdSchema = z.uuid();

interface AdminRequest {
  auth: Auth;
  db: Database;
  requestHeaders: Headers;
}

function parseUpdateInput(formData: FormData) {
  const fields = { text: formData.get("text"), link: formData.get("link") };
  const parsed = updateInputSchema.safeParse(fields);
  if (parsed.success) return { ok: true as const, value: parsed.data };
  // A field shows one message: the first of its checks that failed. Fields that passed are absent.
  const error: Record<string, string> = {};
  for (const [field, [message] = []] of Object.entries(z.flattenError(parsed.error).fieldErrors)) {
    if (message !== undefined) error[field] = message;
  }
  return { ok: false as const, error };
}

/**
 * Posts an Update from the Admin panel's form, Published the moment it is posted. Redirects to
 * sign-in without an admin session; with bad input, returns each field's errors and posts nothing.
 */
export async function postUpdate({ auth, db, requestHeaders }: AdminRequest, formData: FormData) {
  await requireAdminSession(auth, requestHeaders);
  const input = parseUpdateInput(formData);
  if (!input.ok) return input;

  const { text, link } = input.value;
  await db.insert(updates).values({ text, link: link ?? null });
  return { ok: true as const };
}

// An id that names no Update is a 404, as an unknown URL is (.claude/rules/server.md, Status codes).
function parseUpdateId(formData: FormData) {
  const parsed = updateIdSchema.safeParse(formData.get("id"));
  if (!parsed.success) notFound();
  return parsed.data;
}

/**
 * Replaces an Update's text and link and marks it edited; when it was posted stays the same, so it
 * keeps its place. Redirects to sign-in without an admin session, is a 404 when the Update doesn't
 * exist, and with bad input returns each field's errors and changes nothing.
 */
export async function editUpdate({ auth, db, requestHeaders }: AdminRequest, formData: FormData) {
  await requireAdminSession(auth, requestHeaders);
  const id = parseUpdateId(formData);
  const input = parseUpdateInput(formData);
  if (!input.ok) return input;

  const { text, link } = input.value;
  const edited = await db
    .update(updates)
    .set({ text, link: link ?? null, editedAt: new Date() })
    .where(eq(updates.id, id))
    .returning({ id: updates.id });
  if (edited.length === 0) notFound();
  return { ok: true as const };
}

/**
 * Deletes an Update for good. Redirects to sign-in without an admin session. Deleting one that is
 * already gone changes nothing.
 */
export async function deleteUpdate({ auth, db, requestHeaders }: AdminRequest, formData: FormData) {
  await requireAdminSession(auth, requestHeaders);
  const id = parseUpdateId(formData);
  await db.delete(updates).where(eq(updates.id, id));
  return { ok: true as const };
}
