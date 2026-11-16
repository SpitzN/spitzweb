import { Suspense } from "react";
import { SubmitButton } from "@spitzweb/design-system/molecules/submit-button";
import { signInWithGitHub } from "@/admin/server/sign-in-actions";
import { NOT_ADMIN_REASON } from "@/lib/auth";
import { readAuthEnv } from "@/lib/env";

// Any reason but NOT_ADMIN_REASON is a sign-in that didn't finish.
function failureMessageFor(reason: string) {
  return reason === NOT_ADMIN_REASON ? "This account can’t sign in." : "Sign-in failed. Try again.";
}

async function SignInOptions({ failureReason }: { failureReason: Promise<string | undefined> }) {
  // The request's search params come first, so this never renders while the page is prerendered:
  // whether sign-in is offered follows the deployment's env, not the build's.
  const reason = await failureReason;
  if (!readAuthEnv().ok) {
    return <p className="pbs-2 text-ink-muted">Sign-in isn’t available on this deployment.</p>;
  }

  return (
    <>
      <p className="pbs-2 text-ink-muted">Sign in with Nadav’s GitHub account.</p>
      <form action={signInWithGitHub} className="pbs-8">
        <SubmitButton pendingLabel="Opening GitHub…">Sign in with GitHub</SubmitButton>
      </form>
      {reason === undefined ? null : (
        <p role="alert" className="pbs-4 font-semibold">
          {failureMessageFor(reason)}
        </p>
      )}
    </>
  );
}

/**
 * The Admin panel's way in: one GitHub sign-in, and why the last attempt failed when
 * `failureReason` resolves to a reason. A deployment without the auth env, like every preview,
 * can't sign anyone in, so it says so and offers nothing to press. Everything below the heading
 * waits on the request.
 */
export function SignInPanel({ failureReason }: { failureReason: Promise<string | undefined> }) {
  return (
    <main className="pbs-16 pbe-24 max-inline-md">
      <h1 className="font-display text-title font-extrabold">Admin panel</h1>
      <Suspense fallback={<p className="pbs-2 text-ink-muted">Checking sign-in…</p>}>
        <SignInOptions failureReason={failureReason} />
      </Suspense>
    </main>
  );
}
