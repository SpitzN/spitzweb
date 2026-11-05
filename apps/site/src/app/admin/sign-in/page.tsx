import type { Metadata } from "next";
import { z } from "zod";
import { SignInPanel } from "@/admin/components/sign-in-panel";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Better Auth sends a failed sign-in back here with `?error=<reason>`. A repeated or malformed
// parameter still counts as a failure, never as no error.
const searchParamsSchema = z.object({ error: z.string().optional().catch("unknown") });

async function signInFailureReason(searchParams: PageProps<"/admin/sign-in">["searchParams"]) {
  return searchParamsSchema.parse(await searchParams).error;
}

// The reason is handed down unresolved, so only the message waits on the request.
export default function SignInPage({ searchParams }: PageProps<"/admin/sign-in">) {
  return <SignInPanel failureReason={signInFailureReason(searchParams)} />;
}
