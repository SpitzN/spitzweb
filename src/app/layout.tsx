// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { FloatingThemeToggle } from "@/components/theme/floating-theme-toggle";
import { ColorProvider } from "@/features/colors/context/color-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ColorProvider>
            <MainLayout>{children}</MainLayout>
            <FloatingThemeToggle />
          </ColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
