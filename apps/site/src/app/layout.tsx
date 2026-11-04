import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { SiteHeader } from "./site-header";
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
  title: "spitzweb",
  description: "What Nadav Spitzer builds, writes and is doing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${funnelDisplay.variable} ${funnelSans.variable}`}>
      <body className="px-4 min-block-dvh sm:px-8">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
