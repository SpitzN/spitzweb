import { Suspense } from "react";
import { SubmitButton } from "@/components/submit-button";
import { signInWithGitHub } from "@/admin/server/sign-in-actions";
import { NOT_ADMIN_REASON } from "@/lib/auth";

// Any reason but NOT_ADMIN_REASON is a sign-in that didn't finish.
function failureMessageFor(reason: string) {
  return reason === NOT_ADMIN_REASON ? "This account can’t sign in." : "Sign-in failed. Try again.";
}

async function SignInFailure({ reason }: { reason: Promise<string | undefined> }) {
  const failureReason = await reason;
  if (failureReason === undefined) return null;
  return (
    <p role="alert" className="pbs-4 font-semibold">
      {failureMessageFor(failureReason)}
    </p>
  );
}

/**
 * The Admin panel's way in: one GitHub sign-in, and why the last attempt failed when
 * `failureReason` resolves to a reason. Only that message waits on the request.
 */
export function SignInPanel({ failureReason }: { failureReason: Promise<string | undefined> }) {
  return (
    <main className="pbs-16 pbe-24 max-inline-md">
      <h1 className="font-display text-title font-extrabold">Admin panel</h1>
      <p className="pbs-2 text-ink-muted">Sign in with Nadav’s GitHub account.</p>
      <form action={signInWithGitHub} className="pbs-8">
        <SubmitButton pendingLabel="Opening GitHub…">Sign in with GitHub</SubmitButton>
      </form>
      {/* Below the button, so the message streaming in late never moves the button. */}
      <Suspense>
        <SignInFailure reason={failureReason} />
      </Suspense>
    </main>
  );
}
