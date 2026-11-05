"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endAdminSession } from "@/admin/server/admin-session";
import { ADMIN_GITHUB_SIGN_IN, getAuth, SIGN_IN_PATH } from "@/lib/auth";

/**
 * Starts GitHub sign-in and sends the browser to GitHub. It runs before there is a session, so it
 * is the one Admin panel action that doesn't check one (.claude/rules/server.md); the callback
 * decides who gets in.
 */
export async function signInWithGitHub() {
  const { url } = await getAuth().api.signInSocial({
    body: ADMIN_GITHUB_SIGN_IN,
    headers: await headers(),
  });
  if (!url) throw new Error("Better Auth returned no GitHub authorization URL.");
  redirect(url);
}

/** Ends Nadav's session and returns to sign-in. */
export async function signOut() {
  await endAdminSession(getAuth(), await headers());
  redirect(SIGN_IN_PATH);
}
