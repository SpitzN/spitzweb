import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { SiteAnalytics } from "@/components/site-analytics";
import { SiteHeader } from "@/components/site-header";
import { APPLY_STORED_THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

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

export const metadata: Metadata = {
  title: { default: "spitzweb", template: "%s · spitzweb" },
  description: "What Nadav Spitzer builds, writes and is doing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script sets the stored theme on <html> before React hydrates, so React is told
    // to keep the DOM's attributes there rather than its own.
    <html
      lang="en"
      className={`${funnelDisplay.variable} ${funnelSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* A string child is written into the page as it is: the script runs before first paint. */}
        <script>{APPLY_STORED_THEME_SCRIPT}</script>
      </head>
      <body className="px-4 min-block-dvh sm:px-8">
        <SiteHeader />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
