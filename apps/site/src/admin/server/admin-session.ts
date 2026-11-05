import "server-only";
import { unstable_rethrow } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-session";
import type { Auth } from "@/lib/auth";
import { getAuth } from "@/lib/auth";

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
