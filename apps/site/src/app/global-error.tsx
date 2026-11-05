"use client";

import * as Sentry from "@sentry/nextjs";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import { StatusMessage } from "@/components/status-message";
import "./globals.css";

// This page replaces the root layout when the layout itself fails, so it loads its own fonts and
// styles.
const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  display: "swap",
});

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
  display: "swap",
});

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className={`${funnelDisplay.variable} ${funnelSans.variable}`}>
      <body className="px-4 min-block-dvh sm:px-8">
        <title>Something broke · spitzweb</title>
        <header className="border-be border-rule pbs-6 pbe-5">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            spitzweb
          </Link>
        </header>
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
      </body>
    </html>
  );
}
