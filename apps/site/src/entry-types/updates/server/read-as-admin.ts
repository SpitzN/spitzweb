import "server-only";
import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import { requireAdminSession } from "@/lib/admin-session";
import { getAuth } from "@/lib/auth";
import type { Database } from "@/lib/db";
import { getDatabase } from "@/lib/db";

/**
 * Runs an Admin panel read after checking the admin session itself, as every Admin panel page that
 * reads data must (.claude/rules/server.md). Redirects to sign-in without a session. When the
 * session or the read fails, reports the error and returns `ok: false`, so only the section that
 * needed the data degrades.
 */
export async function readAsAdmin<T>(read: (db: Database) => Promise<T>) {
  // A real request first, so neither Better Auth nor the database is touched while prerendering.
  await connection();
  const requestHeaders = await headers();
  try {
    await requireAdminSession(getAuth(), requestHeaders);
    return { ok: true as const, value: await read(getDatabase()) };
  } catch (error) {
    unstable_rethrow(error);
    Sentry.captureException(error);
    return { ok: false as const, error };
  }
}
