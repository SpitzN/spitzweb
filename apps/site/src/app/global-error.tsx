"use client";

import * as Sentry from "@sentry/nextjs";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
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

const ACTION =
  "underline decoration-ink-muted underline-offset-4 transition-colors hover:decoration-ink";

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
        <main className="pbs-16 pbe-24">
          <h1 className="font-display text-statement font-extrabold text-balance max-inline-4xl">
            Something broke.
          </h1>
          <p className="pbs-5 pbe-12 text-lg text-ink-muted max-inline-2xl">
            This page failed to load. Try again, or start from the home page.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <button type="button" onClick={retry} className={`${ACTION} cursor-pointer`}>
              Try again
            </button>
            <Link href="/" className={ACTION}>
              Go to the home page
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
