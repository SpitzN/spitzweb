import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { SubmitButton } from "@/components/submit-button";
import { checkAdminSession } from "@/admin/server/admin-session";
import { signOut } from "@/admin/server/sign-in-actions";

async function AdminBar({ children }: { children: ReactNode }) {
  // The request comes first, so Better Auth is never built (and the server env never read) while
  // the page is prerendered. Headers alone still allow a prerender at request time, which Better
  // Auth's random ids break; connection() keeps this render to a real request.
  await connection();
  const adminSession = await checkAdminSession(await headers());

  // Fail closed: when the session can't be checked, the page behind the bar never renders.
  if (!adminSession.ok) {
    Sentry.captureException(adminSession.error);
    return (
      <section aria-label="Admin session" className="border-be border-rule pbs-3 pbe-3">
        <p className="flex items-center text-ink-muted min-block-11">
          The Admin panel is unavailable right now.
        </p>
      </section>
    );
  }

  const { name } = adminSession.value.user;
  return (
    <>
      <section
        aria-label="Admin session"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-be border-rule pbs-3 pbe-3"
      >
        <p className="truncate text-ink-muted min-inline-0" title={name}>
          Signed in as <span className="text-ink">{name}</span>
        </p>
        <form action={signOut}>
          <SubmitButton variant="outline" pendingLabel="Signing out…">
            Sign out
          </SubmitButton>
        </form>
      </section>
      {children}
    </>
  );
}

/**
 * The frame around every signed-in Admin panel page: who is signed in and the way out, on a
 * hairline under the site header. It checks the admin session itself and redirects to sign-in
 * without one (ADR 0005), so nothing in `children` renders for anyone else. When the session
 * can't be checked at all, it says the panel is unavailable and reports the error.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        // As tall as the Admin bar, whose Sign out button is 44 px, so its hairline stays put.
        <section aria-label="Admin session" className="border-be border-rule pbs-3 pbe-3">
          <p className="flex items-center text-ink-muted min-block-11">Checking your session…</p>
        </section>
      }
    >
      <AdminBar>{children}</AdminBar>
    </Suspense>
  );
}
