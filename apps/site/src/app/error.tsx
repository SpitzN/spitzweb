"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { StatusMessage } from "@/components/status-message";

// A render that fails below the root layout lands here, so the header and theme stay.
// global-error.tsx covers a failure in the layout itself.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <>
      <title>Something broke · spitzweb</title>
      <StatusMessage
        heading="Something broke."
        actions={
          <>
            <button type="button" onClick={retry} className="cursor-pointer text-link">
              Try again
            </button>
            <Link href="/" className="text-link">
              Go to the home page
            </Link>
          </>
        }
      >
        This page failed to load. Try again, or start from the home page.
      </StatusMessage>
    </>
  );
}
