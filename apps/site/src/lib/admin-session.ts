import "server-only";
import { redirect } from "next/navigation";
import type { Auth } from "@/lib/auth";
import { SIGN_IN_PATH } from "@/lib/auth";

/**
 * The admin session behind this request, or a redirect to sign-in when there is none. Every Admin
 * panel layout, page that reads data, and Server Action calls it itself, whichever slice it is in;
 * a proxy redirect never stands in for it (ADR 0005). A layout's check doesn't run again when the
 * browser moves between that layout's pages, so it never covers a page on its own. Any session is
 * Nadav's: no other account can get a user row (lib/auth.ts).
 */
export async function requireAdminSession(auth: Auth, headers: Headers) {
  const adminSession = await auth.api.getSession({ headers });
  if (!adminSession) redirect(SIGN_IN_PATH);
  return adminSession;
}
