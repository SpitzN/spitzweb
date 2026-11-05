import "server-only";
import { redirect, unstable_rethrow } from "next/navigation";
import type { Auth } from "@/lib/auth";
import { getAuth, SIGN_IN_PATH } from "@/lib/auth";

/**
 * The admin session behind this request, or a redirect to sign-in when there is none. Every Admin
 * panel layout, page that reads data, and Server Action calls it itself; a proxy redirect never
 * stands in for it (ADR 0005). A layout's check doesn't run again when the browser moves between
 * that layout's pages, so it never covers a page on its own. Any session is Nadav's: no other
 * account can get a user row (lib/auth.ts).
 */
export async function requireAdminSession(auth: Auth, headers: Headers) {
  const adminSession = await auth.api.getSession({ headers });
  if (!adminSession) redirect(SIGN_IN_PATH);
  return adminSession;
}

/** Ends the admin session behind this request, or redirects to sign-in when there is none. */
export async function endAdminSession(auth: Auth, headers: Headers) {
  await requireAdminSession(auth, headers);
  await auth.api.signOut({ headers });
}

/**
 * The app's admin session behind this request, as a result: `ok: false` when it can't be checked
 * (the database is down, or this deployment has no auth env, like a preview). Still redirects to
 * sign-in when there is no session, so a failure never lets anything through.
 */
export async function checkAdminSession(headers: Headers) {
  try {
    return { ok: true as const, value: await requireAdminSession(getAuth(), headers) };
  } catch (error) {
    unstable_rethrow(error);
    return { ok: false as const, error };
  }
}
