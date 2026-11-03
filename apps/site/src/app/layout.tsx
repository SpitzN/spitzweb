import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "spitzweb",
  description: "What Nadav Spitzer builds, writes and is doing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
